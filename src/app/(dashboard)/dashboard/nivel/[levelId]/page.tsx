import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getGrade } from "@/lib/scoring";
import { calcModulePct } from "@/lib/progress";

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

  // Separar módulos regulares del módulo final del nivel
  const regularModules = level.modules.filter((m) => !m.isLevelFinal);
  const finalModule = level.modules.find((m) => m.isLevelFinal) ?? null;

  const allLessonIds = regularModules.flatMap((m) => m.lessons.map((l) => l.id));

  const [userProgress, lessonProgressList] = await Promise.all([
    prisma.progress.findMany({ where: { userId: session.user.id } }),
    prisma.lessonProgress.findMany({
      where: { userId: session.user.id, lessonId: { in: allLessonIds } },
      select: { lessonId: true },
    }),
  ]);

  const readLessonIds = new Set(lessonProgressList.map((lp) => lp.lessonId));
  const progressMap = new Map(userProgress.map((p) => [p.moduleId, p]));

  // Desbloqueo secuencial de módulos regulares
  const unlockedModuleIds = new Set<string>();
  for (let i = 0; i < regularModules.length; i++) {
    const mod = regularModules[i];
    if (i === 0) { unlockedModuleIds.add(mod.id); continue; }
    const prev = regularModules[i - 1];
    if (progressMap.get(prev.id)?.completed) unlockedModuleIds.add(mod.id);
  }

  // El quiz final se desbloquea cuando todos los módulos regulares están completados
  const allRegularCompleted =
    regularModules.length > 0 &&
    regularModules.every((m) => progressMap.get(m.id)?.completed);

  const completedCount = regularModules.filter((m) => progressMap.get(m.id)?.completed).length;
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
          <span className="text-sm text-gray-400">{completedCount}/{regularModules.length} módulos</span>
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${DIFFICULTY_COLORS[level.difficulty] ?? "bg-gray-800 text-gray-300"}`}>
            {DIFFICULTY_LABELS[level.difficulty] ?? level.difficulty}
          </span>
        </div>
      </div>

      {/* Módulos con sus temas */}
      <div className="flex flex-col gap-4">
        {regularModules.map((mod) => {
          const progress = progressMap.get(mod.id);
          const isUnlocked = unlockedModuleIds.has(mod.id);
          const isCompleted = progress?.completed ?? false;
          const moduleHref = `/dashboard/module/${mod.id}?back=${encodeURIComponent(backUrl)}`;
          const lessonHref = (lessonId: string) =>
            `/dashboard/lesson/${lessonId}?back=${encodeURIComponent(backUrl)}`;

          const readCount = isCompleted ? mod.lessons.length : mod.lessons.filter((l) => readLessonIds.has(l.id)).length;
          const modulePct = calcModulePct(mod.lessons.length, readCount, isCompleted);

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
                {isUnlocked && (
                  <span className={`text-xs font-semibold ${getGrade(modulePct).color.text}`}>
                    {modulePct}%
                  </span>
                )}
              </div>

              {/* Lecciones */}
              {mod.lessons.map((lesson, idx) => {
                const isLast = idx === mod.lessons.length - 1;
                const isRead = isCompleted || readLessonIds.has(lesson.id);
                const row = (
                  <div className={`flex items-center gap-3 px-5 py-3 transition-colors ${!isLast ? "border-b border-gray-800/60" : ""} ${isUnlocked && isRead ? "bg-emerald-950/20" : ""}`}>
                    {/* Indicador de estado */}
                    {isUnlocked ? (
                      isRead ? (
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shadow-[0_0_8px_rgba(16,185,129,0.5)]">
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2 6l3 3 5-5" />
                          </svg>
                        </span>
                      ) : (
                        <span className="flex-shrink-0 w-5 h-5 rounded-full border-2 border-indigo-500/50 bg-indigo-500/10" />
                      )
                    ) : (
                      <span className="flex-shrink-0 w-5 h-5 rounded-full border-2 border-gray-700/40" />
                    )}
                    <span className={`text-sm flex-1 ${isUnlocked ? (isRead ? "text-emerald-300/90 group-hover:text-emerald-200" : "text-gray-300 group-hover:text-white") : "text-gray-600"} transition-colors`}>
                      {lesson.title}
                    </span>
                    {isUnlocked && isRead && (
                      <span className="flex-shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        Leído
                      </span>
                    )}
                    {isUnlocked && !isRead && (
                      <span className="flex-shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        Sin comenzar
                      </span>
                    )}
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

        {/* Quiz Final del Nivel */}
        {finalModule && (() => {
          const finalProgress = progressMap.get(finalModule.id);
          const finalCompleted = finalProgress?.completed ?? false;
          const finalHref = `/dashboard/module/${finalModule.id}?back=${encodeURIComponent(backUrl)}`;

          const card = (
            <div className={`rounded-xl border overflow-hidden transition-all ${
              allRegularCompleted
                ? "border-amber-700/50 bg-gradient-to-br from-amber-900/20 to-gray-900"
                : "border-gray-800 bg-gray-900/50 opacity-40"
            }`}>
              <div className="flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{allRegularCompleted ? "🏆" : "🔒"}</span>
                  <div>
                    <p className={`font-semibold text-sm ${allRegularCompleted ? "text-amber-200" : "text-gray-500"}`}>
                      Evaluación Final del Nivel
                    </p>
                    <p className={`text-xs mt-0.5 ${allRegularCompleted ? "text-amber-400/70" : "text-gray-600"}`}>
                      {allRegularCompleted
                        ? "Cubre todos los temas del nivel"
                        : "Completá todos los módulos para desbloquear"}
                    </p>
                  </div>
                </div>
                <span className={`text-xs px-3 py-1.5 rounded-lg font-medium ${
                  allRegularCompleted
                    ? finalCompleted
                      ? "bg-emerald-900/60 text-emerald-300"
                      : "bg-amber-600 text-white group-hover:bg-amber-500"
                    : "bg-gray-800 text-gray-600"
                }`}>
                  {allRegularCompleted
                    ? finalCompleted ? "✓ Aprobado" : "Rendir"
                    : "Bloqueado"}
                </span>
              </div>
            </div>
          );

          return allRegularCompleted ? (
            <Link key={finalModule.id} href={finalHref} className="group block">
              {card}
            </Link>
          ) : (
            <div key={finalModule.id}>{card}</div>
          );
        })()}
      </div>
    </div>
  );
}
