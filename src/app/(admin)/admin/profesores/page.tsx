import { prisma } from "@/lib/prisma";
import TeacherTable from "@/components/admin/TeacherTable";
import type { TeacherRow } from "@/components/admin/TeacherTable";

export default async function ProfesoresPage() {
  const [teachersRaw, instruments, studentsRaw] = await Promise.all([
    prisma.user.findMany({
      where: { role: "TEACHER" },
      include: {
        teachingInstruments: {
          include: { instrument: { select: { id: true, name: true, slug: true } } },
        },
        assignedStudents: { select: { studentId: true } },
        _count: { select: { assignedStudents: true } },
      },
      orderBy: { name: "asc" },
    }),
    prisma.instrument.findMany({ orderBy: { name: "asc" } }),
    prisma.user.findMany({
      where: { role: "STUDENT" },
      include: {
        instrument: { select: { name: true, slug: true } },
        _count: { select: { answers: true } },
      },
      orderBy: { name: "asc" },
    }),
  ]);

  const teachers: TeacherRow[] = teachersRaw.map((t) => {
    const assignedStudentIds = t.assignedStudents.map((a) => a.studentId);
    const myStudents = studentsRaw.filter((s) =>
      assignedStudentIds.includes(s.id)
    );
    const answersEvaluated = myStudents.reduce(
      (sum, s) => sum + s._count.answers,
      0
    );

    return {
      id: t.id,
      name: t.name,
      email: t.email,
      instruments: t.teachingInstruments.map((ti) => ti.instrument),
      assignedStudentIds,
      studentCount: assignedStudentIds.length,
      answersEvaluated,
      createdAt: t.createdAt,
    };
  });

  const allStudents = studentsRaw.map((s) => ({
    id: s.id,
    name: s.name,
    email: s.email,
    instrumentName: s.instrument?.name ?? null,
    instrumentSlug: s.instrument?.slug ?? null,
  }));

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Profesores</h1>
        <p className="text-sm text-gray-400">
          Lista de profesores, instrumentos asignados y alumnos a cargo.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {[
          {
            label: "Profesores registrados",
            value: teachers.length,
            color: "text-indigo-400",
          },
          {
            label: "Con instrumentos asignados",
            value: teachers.filter((t) => t.instruments.length > 0).length,
            color: "text-gray-200",
          },
          {
            label: "Con alumnos asignados",
            value: teachers.filter((t) => t.studentCount > 0).length,
            color: "text-emerald-400",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-gray-900 border border-gray-800 rounded-xl px-5 py-4"
          >
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <TeacherTable
        teachers={teachers}
        allInstruments={instruments}
        allStudents={allStudents}
      />
    </div>
  );
}
