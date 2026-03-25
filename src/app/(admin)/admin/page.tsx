import { prisma } from "@/lib/prisma";
import AdminOverviewPanel from "@/components/admin/AdminOverviewPanel";
import type { TeacherData, StudentData, InstrumentOption } from "@/components/admin/AdminOverviewPanel";

export default async function AdminPage() {
  const now = new Date();

  const [teachers, studentsRaw, instruments, sessionStats] = await Promise.all([
    prisma.user.findMany({
      where: { role: "TEACHER" },
      include: {
        teachingInstruments: {
          include: { instrument: { select: { id: true, name: true, slug: true } } },
        },
        assignedStudents: { select: { studentId: true } },
      },
      orderBy: { name: "asc" },
    }),
    prisma.user.findMany({
      where: { role: "STUDENT" },
      include: {
        instrument: { select: { id: true, name: true, slug: true } },
        progress: { select: { completed: true, score: true, updatedAt: true } },
        _count: { select: { answers: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.instrument.findMany({ orderBy: { name: "asc" } }),
    // Sesiones activas (no expiradas), agrupadas por rol del usuario
    prisma.session.findMany({
      where: { expires: { gt: now } },
      select: { userId: true },
      distinct: ["userId"],
    }),
  ]);

  // Usuarios con sesiones activas
  const activeUserIds = new Set(sessionStats.map((s) => s.userId));
  const connectedTeachers = teachers.filter((t) => activeUserIds.has(t.id)).length;
  const connectedStudents = studentsRaw.filter((s) => activeUserIds.has(s.id)).length;

  // Compute student data
  const studentData: StudentData[] = studentsRaw.map((s) => {
    const completed = s.progress.filter((p) => p.completed).length;
    const total = s.progress.length;
    const scores = s.progress.map((p) => p.score ?? 0).filter((v) => v > 0);
    const bestScore = scores.length > 0 ? Math.max(...scores) : null;
    const progressPct = total > 0 ? Math.round((completed / total) * 100) : 0;
    const isApproved = s.progress.some((p) => (p.score ?? 0) >= 60);
    const sorted = [...s.progress].sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
    return {
      id: s.id,
      name: s.name,
      email: s.email,
      instrumentId: s.instrumentId,
      instrumentName: s.instrument?.name ?? null,
      instrumentSlug: s.instrument?.slug ?? null,
      completedModules: completed,
      totalModules: total,
      progressPct,
      isApproved,
      bestScore,
      lastActivity: sorted[0]?.updatedAt ?? null,
    };
  });

  // Compute teacher data
  const teacherData: TeacherData[] = teachers.map((t) => {
    const assignedStudentIds = t.assignedStudents.map((a) => a.studentId);
    const myStudents = studentsRaw.filter((s) => assignedStudentIds.includes(s.id));
    const answersEvaluated = myStudents.reduce((sum, s) => sum + s._count.answers, 0);
    return {
      id: t.id,
      name: t.name,
      instruments: t.teachingInstruments.map((ti) => ti.instrument),
      assignedStudentIds,
      studentCount: myStudents.length,
      answersEvaluated,
    };
  });

  // Stats globales
  const approvedStudents = studentsRaw.filter((s) =>
    s.progress.some((p) => (p.score ?? 0) >= 60)
  ).length;
  const approvalPct =
    studentsRaw.length > 0
      ? Math.round((approvedStudents / studentsRaw.length) * 100)
      : 0;
  const totalCompleted = studentsRaw
    .flatMap((s) => s.progress)
    .filter((p) => p.completed).length;

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Panel de Administración</h1>
        <p className="text-sm text-slate-400 mt-1">
          Vista general del estado de la plataforma.
        </p>
      </div>

      {/* Conectados + stats globales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-indigo-900/60 to-slate-900 border border-indigo-700/40 rounded-xl px-5 py-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <p className="text-xs text-slate-400">Con sesión activa</p>
          </div>
          <p className="text-2xl font-bold text-indigo-300">{connectedTeachers}</p>
          <p className="text-xs text-slate-500 mt-0.5">
            profesor{connectedTeachers !== 1 ? "es" : ""}
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-900/60 to-slate-900 border border-purple-700/40 rounded-xl px-5 py-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <p className="text-xs text-slate-400">Con sesión activa</p>
          </div>
          <p className="text-2xl font-bold text-purple-300">{connectedStudents}</p>
          <p className="text-xs text-slate-500 mt-0.5">
            alumno{connectedStudents !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="bg-gradient-to-br from-emerald-900/60 to-slate-900 border border-emerald-700/40 rounded-xl px-5 py-4">
          <p className="text-2xl font-bold text-emerald-400">{approvalPct}%</p>
          <p className="text-xs text-slate-400 mt-1">Alumnos aprobados</p>
          <p className="text-xs text-slate-500 mt-0.5">
            {approvedStudents} de {studentsRaw.length}
          </p>
        </div>

        <div className="bg-gradient-to-br from-amber-900/60 to-slate-900 border border-amber-700/40 rounded-xl px-5 py-4">
          <p className="text-2xl font-bold text-amber-400">{totalCompleted}</p>
          <p className="text-xs text-slate-400 mt-1">Módulos completados</p>
          <p className="text-xs text-slate-500 mt-0.5">en total</p>
        </div>
      </div>

      {/* Overview con profesores, alumnos y filtros */}
      <AdminOverviewPanel
        teachers={teacherData}
        students={studentData}
        allInstruments={instruments as InstrumentOption[]}
      />
    </div>
  );
}
