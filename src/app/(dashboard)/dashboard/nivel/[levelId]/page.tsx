import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getGrade } from "@/lib/scoring";

interface PageProps {
  params: Promise<{ levelId: string }>;
}

const DIFFICULTY_COLORS: Record<string, string> = {
  BEGINNER: "bg-emerald-900 text-emerald-300",
  INTERMEDIATE: "bg-amber-900 text-amber-300",
  ADVANCED: "bg-red-900 text-red-300",
};

const DIFFICULTY_LABELS: Record<string, string> = {
  BEGINNER: "Principiante",
  INTERMEDIATE: "Intermedio",
  ADVANCED: "Avanzado",
};

export default async function NivelPage({ params }: PageProps) {
  const { levelId } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const level = await prisma.level.findUnique({
    where: { id: levelId },
    include: {
      instrument: true,
      modules: {
        orderBy: { order: "asc" },
        include: {
          lessons: { orderBy: { order: "asc" }, select: { id: true, title: true } },
        },
      },
    },
  });

  if (!level) notFound();

  const userProgress = await prisma.progress.findMany({
    where: { userId: session.user.id },
  });

  const progressMap = new Map(userProgress.map((p) => [p.moduleId, p]));

  // Desbloqueo secuencial de módulos
  const unlockedModuleIds = new Set<string>();
  for (let i = 0; i < level.modules.length; i++) {
    const mod = level.modules[i];
    if (i === 0) {
      unlockedModuleIds.add(mod.id);
      continue;
    }
    const prev = level.modules[i - 1];
    if (progressMap.get(prev.id)?.completed) {
      unlockedModuleIds.add(mod.id);
    }
  }

  const completedCount = level.modules.filter((m) => progressMap.get(m.id)?.completed).length;
  const backUrl = `/dashboard/nivel/${levelId}`;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Regresar */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600 rounded-lg px-4 py-2 transition-all mb-6"
      >
        ← Regresar
      </Link>

      {/* Encabezado */}
      <div className="flex items-start justify-between mb-8 flex-wrap gap-3">
        <h1 className="text-2xl font-bold">📖 {level.name}</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400">{completedCount}/{level.modules.length} módulos</span>
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${DIFFICULTY_COLORS[level.difficulty] ?? "bg-gray-800 text-gray-300"}`}>
            {DIFFICULTY_LABELS[level.difficulty] ?? level.difficulty}
          </span>
        </div>
      </div>

      {/* Módulos con sus temas */}
      <div className="flex flex-col gap-4">
        {level.modules.map((mod) => {
          const progress = progressMap.get(mod.id);
          const isUnlocked = unlockedModuleIds.has(mod.id);
          const isCompleted = progress?.completed ?? false;
          const score = progress?.score ?? null;
          const moduleHref = `/dashboard/module/${mod.id}?back=${encodeURIComponent(backUrl)}`;
          const lessonHref = (lessonId: string) =>
            `/dashboard/lesson/${lessonId}?back=${encodeURIComponent(backUrl)}`;

          return (
            <div
              key={mod.id}
              className={`rounded-xl border border-gray-800 bg-gray-900 overflow-hidden ${!isUnlocked ? "opacity-50" : ""}`}
            >
              {/* Cabecera del módulo */}
              <div className="flex items-center justify-between px-5 py-3 bg-gray-800/60 border-b border-gray-800">
                <div className="flex items-center gap-2">
                  {isCompleted && <span className="text-emerald-400 text-sm">✓</span>}
                  {!isUnlocked && <span className="text-gray-500 text-sm">🔒</span>}
                  <span className="font-semibold text-sm text-gray-100">{mod.title}</span>
                </div>
                {score !== null && (
                  <span className={`text-xs font-semibold ${getGrade(score).color.text}`}>
                    {Math.round(score)}%
                  </span>
                )}
              </div>

              {/* Lecciones */}
              {mod.lessons.map((lesson, idx) => {
                const isLast = idx === mod.lessons.length - 1;
                const row = (
                  <div className={`flex items-center gap-3 px-7 py-3 ${!isLast ? "border-b border-gray-800/60" : ""}`}>
                    <span className="text-gray-600 text-xs flex-shrink-0">📄</span>
                    <span className={`text-sm ${isUnlocked ? "text-gray-300 group-hover:text-white transition-colors" : "text-gray-500"}`}>
                      {lesson.title}
                    </span>
                  </div>
                );
                return isUnlocked ? (
                  <Link key={lesson.id} href={lessonHref(lesson.id)} className="group block hover:bg-gray-800/50 transition-colors">
                    {row}
                  </Link>
                ) : (
                  <div key={lesson.id}>{row}</div>
                );
              })}

              {/* Quiz */}
              {(() => {
                const quizRow = (
                  <div className="flex items-center justify-between px-7 py-3 border-t border-gray-800/60">
                    <div className="flex items-center gap-3">
                      <span className="text-gray-600 text-xs flex-shrink-0">✏️</span>
                      <span className={`text-sm font-medium ${isUnlocked ? "text-gray-300 group-hover:text-white transition-colors" : "text-gray-500"}`}>
                        Quiz
                      </span>
                    </div>
                    <span className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                      isUnlocked
                        ? isCompleted
                          ? "bg-gray-700 text-gray-300 group-hover:bg-gray-600"
                          : "bg-indigo-600 text-white group-hover:bg-indigo-500"
                        : "bg-gray-800 text-gray-600"
                    }`}>
                      {isUnlocked ? (isCompleted ? "Repasar" : "Iniciar") : "Bloqueado"}
                    </span>
                  </div>
                );
                return isUnlocked ? (
                  <Link href={moduleHref} className="group block hover:bg-gray-800/50 transition-colors">
                    {quizRow}
                  </Link>
                ) : (
                  <div>{quizRow}</div>
                );
              })()}
            </div>
          );
        })}
      </div>
    </div>
  );
}
