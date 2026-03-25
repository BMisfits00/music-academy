import Link from "next/link";
import { getGrade } from "@/lib/scoring";

interface Module {
  id: string;
  title: string;
  description: string | null;
  order: number;
  isLevelFinal: boolean;
}

interface Level {
  id: string;
  name: string;
  difficulty: string;
  description: string | null;
  modules: Module[];
}

interface Progress {
  completed: boolean;
  score: number | null;
  attempts: number;
}

interface LevelCardProps {
  level: Level;
  levelIndex: number;
  isUnlocked: boolean;
  isCompleted: boolean;
  progressMap: Map<string, Progress>;
  unlockedModuleIds: Set<string>;
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

export default function LevelCard({
  level,
  isUnlocked,
  isCompleted,
  progressMap,
  unlockedModuleIds,
}: LevelCardProps) {
  const regularModules = level.modules.filter((m) => !m.isLevelFinal);
  const finalModule = level.modules.find((m) => m.isLevelFinal) ?? null;

  const completedCount = regularModules.filter(
    (m) => progressMap.get(m.id)?.completed
  ).length;

  return (
    <div
      className={`rounded-xl border ${
        isUnlocked ? "border-gray-800 bg-gray-900" : "border-gray-800 bg-gray-900/50 opacity-60"
      }`}
    >
      {/* Header del nivel */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
        <div className="flex items-center gap-3">
          {!isUnlocked && (
            <span className="text-gray-600 text-lg">🔒</span>
          )}
          {isCompleted && (
            <span className="text-emerald-400 text-lg">✓</span>
          )}
          <div>
            <h2 className="font-semibold">{level.name}</h2>
            {level.description && (
              <p className="text-sm text-gray-400 mt-0.5">{level.description}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400">
            {completedCount}/{regularModules.length}
          </span>
          <span
            className={`text-xs px-2.5 py-1 rounded-full font-medium ${
              DIFFICULTY_COLORS[level.difficulty] ?? "bg-gray-800 text-gray-300"
            }`}
          >
            {DIFFICULTY_LABELS[level.difficulty] ?? level.difficulty}
          </span>
        </div>
      </div>

      {/* Módulos regulares */}
      <div className="divide-y divide-gray-800">
        {regularModules.map((mod) => {
          const progress = progressMap.get(mod.id);
          const isModuleUnlocked = unlockedModuleIds.has(mod.id);
          const isModuleCompleted = progress?.completed ?? false;
          const score = progress?.score;

          const rowContent = (
            <>
              {/* Ícono de estado */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 transition-transform group-hover:scale-110 ${
                  isModuleCompleted
                    ? "bg-emerald-600 text-white"
                    : isModuleUnlocked
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-700 text-gray-500"
                }`}
              >
                {isModuleCompleted ? "✓" : isModuleUnlocked ? mod.order : "🔒"}
              </div>

              {/* Info del módulo */}
              <div className="flex-1 min-w-0">
                <p
                  className={`font-medium text-sm ${
                    isModuleUnlocked ? "text-gray-100 group-hover:text-white" : "text-gray-500"
                  }`}
                >
                  {mod.title}
                </p>
                {mod.description && (
                  <p className="text-xs text-gray-500 truncate mt-0.5">{mod.description}</p>
                )}
              </div>

              {/* Score y acción */}
              <div className="flex items-center gap-3 flex-shrink-0">
                {score !== null && score !== undefined && (
                  <span className={`text-xs font-semibold ${getGrade(score).color.text}`}>
                    {Math.round(score)}%
                  </span>
                )}
                <span
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    isModuleUnlocked
                      ? isModuleCompleted
                        ? "bg-gray-700 text-gray-300 group-hover:bg-gray-600"
                        : "bg-indigo-600 text-white group-hover:bg-indigo-500"
                      : "bg-gray-800 text-gray-600 cursor-not-allowed"
                  }`}
                >
                  {isModuleUnlocked
                    ? isModuleCompleted ? "Repasar" : "Iniciar"
                    : "Bloqueado"}
                </span>
              </div>
            </>
          );

          return isModuleUnlocked ? (
            <Link
              key={mod.id}
              href={`/dashboard/module/${mod.id}`}
              className="group flex items-center gap-4 px-6 py-4 hover:bg-gray-800/70 transition-colors"
            >
              {rowContent}
            </Link>
          ) : (
            <div key={mod.id} className="group flex items-center gap-4 px-6 py-4 opacity-50">
              {rowContent}
            </div>
          );
        })}
      </div>

      {/* Quiz Final del Nivel */}
      {finalModule && (() => {
        const finalProgress = progressMap.get(finalModule.id);
        const finalCompleted = finalProgress?.completed ?? false;
        const finalScore = finalProgress?.score;
        const isFinalUnlocked = isUnlocked && unlockedModuleIds.has(finalModule.id);

        const content = (
          <div className={`flex items-center justify-between px-6 py-4 transition-colors ${
            isFinalUnlocked ? "group-hover:bg-amber-900/10" : ""
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${
                finalCompleted
                  ? "bg-amber-600 text-white"
                  : isFinalUnlocked
                  ? "bg-amber-800/60 text-amber-300"
                  : "bg-gray-700 text-gray-500"
              }`}>
                {finalCompleted ? "✓" : isFinalUnlocked ? "🏆" : "🔒"}
              </div>
              <div>
                <p className={`font-semibold text-sm ${isFinalUnlocked ? "text-amber-200" : "text-gray-500"}`}>
                  Evaluación Final del Nivel
                </p>
                {!isFinalUnlocked && (
                  <p className="text-xs text-gray-600 mt-0.5">Completá todos los módulos para desbloquear</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              {finalScore !== null && finalScore !== undefined && (
                <span className={`text-xs font-semibold ${getGrade(finalScore).color.text}`}>
                  {Math.round(finalScore)}%
                </span>
              )}
              <span className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                isFinalUnlocked
                  ? finalCompleted
                    ? "bg-amber-900/50 text-amber-300 group-hover:bg-amber-900/70"
                    : "bg-amber-600 text-white group-hover:bg-amber-500"
                  : "bg-gray-800 text-gray-600 cursor-not-allowed"
              }`}>
                {isFinalUnlocked ? (finalCompleted ? "Repasar" : "Rendir") : "Bloqueado"}
              </span>
            </div>
          </div>
        );

        return isFinalUnlocked ? (
          <div key={finalModule.id} className="border-t border-amber-900/30">
            <Link href={`/dashboard/module/${finalModule.id}`} className="group block">
              {content}
            </Link>
          </div>
        ) : (
          <div key={finalModule.id} className="border-t border-gray-800 opacity-50">
            {content}
          </div>
        );
      })()}
    </div>
  );
}
