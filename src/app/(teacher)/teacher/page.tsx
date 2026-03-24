import { prisma } from "@/lib/prisma";
import { getGrade } from "@/lib/scoring";
import StudentTable from "@/components/teacher/StudentTable";

export default async function TeacherPage() {
  // Alumnos con instrumento, niveles y progreso
  const students = await prisma.user.findMany({
    where: { role: "STUDENT" },
    include: {
      instrument: true,
      progress: {
        include: { module: { include: { level: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Estadísticas globales
  const totalStudents = students.length;
  const withInstrument = students.filter((s) => s.instrument).length;

  const allProgress = students.flatMap((s) => s.progress);
  const completedCount = allProgress.filter((p) => p.completed).length;
  const avgScore =
    allProgress.length > 0
      ? Math.round(allProgress.reduce((sum, p) => sum + (p.score ?? 0), 0) / allProgress.length)
      : 0;

  // Módulos con más errores (score < 60 en al menos un intento)
  const weakModules = await prisma.progress.groupBy({
    by: ["moduleId"],
    where: { score: { lt: 60 } },
    _count: { userId: true },
    orderBy: { _count: { userId: "desc" } },
    take: 3,
  });

  const weakModuleDetails = await Promise.all(
    weakModules.map(async (wm) => {
      const mod = await prisma.module.findUnique({
        where: { id: wm.moduleId },
        include: { level: { include: { instrument: true } } },
      });
      return { module: mod, failCount: wm._count.userId };
    })
  );

  // Preparar datos para la tabla
  const tableData = students.map((student) => {
    const completedModules = student.progress.filter((p) => p.completed).length;
    const totalModules = student.progress.length;
    const bestScore =
      student.progress.length > 0
        ? Math.max(...student.progress.map((p) => p.score ?? 0))
        : null;
    const lastActivity =
      student.progress.length > 0
        ? student.progress.sort(
            (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          )[0].updatedAt
        : null;

    return {
      id: student.id,
      name: student.name,
      email: student.email,
      instrument: student.instrument,
      completedModules,
      totalModules,
      bestScore,
      lastActivity,
      createdAt: student.createdAt,
    };
  });

  return (
    <div>
      {/* Encabezado */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Panel del Profesor</h1>
        <p className="text-gray-400">Seguimiento del progreso de tus alumnos.</p>
      </div>

      {/* Stats globales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: "Alumnos registrados", value: totalStudents },
          { label: "Con instrumento asignado", value: withInstrument },
          { label: "Módulos completados (total)", value: completedCount },
          { label: "Puntaje promedio", value: avgScore > 0 ? `${avgScore}%` : "—" },
        ].map((stat) => (
          <div key={stat.label} className="bg-gray-900 border border-gray-800 rounded-xl px-5 py-4">
            <p className="text-2xl font-bold text-indigo-400">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Módulos problemáticos */}
      {weakModuleDetails.length > 0 && (
        <div className="mb-10">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Módulos con más dificultades
          </h2>
          <div className="flex flex-wrap gap-3">
            {weakModuleDetails.map(({ module, failCount }) =>
              module ? (
                <div
                  key={module.id}
                  className="flex items-center gap-3 bg-gray-900 border border-red-900 rounded-lg px-4 py-3 text-sm"
                >
                  <span className="text-red-400">⚠</span>
                  <div>
                    <p className="font-medium">{module.title}</p>
                    <p className="text-xs text-gray-500">
                      {module.level.instrument.name} · {failCount} alumno{failCount !== 1 ? "s" : ""} con dificultades
                    </p>
                  </div>
                </div>
              ) : null
            )}
          </div>
        </div>
      )}

      {/* Tabla de alumnos */}
      <StudentTable students={tableData} />
    </div>
  );
}
