import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getGrade } from "@/lib/scoring";
import StudentProgressDetail from "@/components/teacher/StudentProgressDetail";

interface PageProps {
  params: Promise<{ userId: string }>;
}

export default async function StudentDetailPage({ params }: PageProps) {
  const { userId } = await params;

  const student = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      instrument: true,
      progress: {
        include: {
          module: {
            include: {
              level: { include: { instrument: true } },
            },
          },
        },
        orderBy: { updatedAt: "desc" },
      },
    },
  });

  if (!student || student.role !== "STUDENT") notFound();

  // Niveles completos del instrumento del alumno (para mostrar módulos no intentados)
  const levels = student.instrument
    ? await prisma.level.findMany({
        where: { instrumentId: student.instrument.id },
        include: { modules: { orderBy: { order: "asc" } } },
        orderBy: { order: "asc" },
      })
    : [];

  // Mapa de progreso por módulo
  const progressMap = new Map(student.progress.map((p) => [p.moduleId, p]));

  // Stats del alumno
  const completedCount = student.progress.filter((p) => p.completed).length;
  const totalAttempts = student.progress.reduce((sum, p) => sum + p.attempts, 0);
  const scores = student.progress.filter((p) => p.score !== null).map((p) => p.score!);
  const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b) / scores.length) : null;
  const bestScore = scores.length > 0 ? Math.max(...scores) : null;

  const instrumentIcon =
    student.instrument?.slug === "piano" ? "🎹"
    : student.instrument?.slug === "guitarra" ? "🎸"
    : student.instrument ? "🎵" : null;

  return (
    <div>
      {/* Regresar */}
      <Link
        href="/teacher"
        className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors mb-4"
      >
        ← Regresar
      </Link>

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/teacher" className="hover:text-gray-300 transition-colors">
          Panel del Profesor
        </Link>
        <span>/</span>
        <span className="text-gray-200">{student.name ?? student.email}</span>
      </nav>

      {/* Header del alumno */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-indigo-700 flex items-center justify-center text-xl font-bold flex-shrink-0">
              {student.name?.[0]?.toUpperCase() ?? "?"}
            </div>
            <div>
              <h1 className="text-xl font-bold">{student.name ?? "Sin nombre"}</h1>
              <p className="text-gray-400 text-sm">{student.email}</p>
              <p className="text-gray-500 text-xs mt-1">
                Registrado el{" "}
                {new Date(student.createdAt).toLocaleDateString("es-AR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
          {student.instrument && (
            <span className="flex items-center gap-2 text-sm bg-gray-800 border border-gray-700 px-4 py-2 rounded-full">
              {instrumentIcon} {student.instrument.name}
            </span>
          )}
        </div>

        {/* Stats del alumno */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-800">
          {[
            { label: "Módulos completados", value: completedCount },
            { label: "Total de intentos", value: totalAttempts },
            {
              label: "Puntaje promedio",
              value: avgScore !== null ? `${avgScore}%` : "—",
              color: avgScore !== null ? getGrade(avgScore).color.text : "text-gray-400",
            },
            {
              label: "Mejor puntaje",
              value: bestScore !== null ? `${bestScore}%` : "—",
              color: bestScore !== null ? getGrade(bestScore).color.text : "text-gray-400",
            },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className={`text-xl font-bold ${stat.color ?? "text-indigo-400"}`}>
                {stat.value}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Progreso por nivel */}
      {!student.instrument ? (
        <div className="text-center py-12 text-gray-500 bg-gray-900 border border-dashed border-gray-700 rounded-xl">
          El alumno todavía no eligió un instrumento.
        </div>
      ) : (
        <StudentProgressDetail levels={levels} progressMap={progressMap} />
      )}
    </div>
  );
}
