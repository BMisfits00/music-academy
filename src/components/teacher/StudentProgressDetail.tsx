import { getGrade } from "@/lib/scoring";

interface Module {
  id: string;
  title: string;
  description: string | null;
  order: number;
}

interface Level {
  id: string;
  name: string;
  difficulty: string;
  modules: Module[];
}

interface Progress {
  completed: boolean;
  score: number | null;
  attempts: number;
  completedAt: Date | null;
  updatedAt: Date;
}

const DIFFICULTY_LABELS: Record<string, string> = {
  BEGINNER: "Principiante",
  INTERMEDIATE: "Intermedio",
  ADVANCED: "Avanzado",
};

const DIFFICULTY_COLORS: Record<string, string> = {
  BEGINNER: "bg-emerald-900 text-emerald-300",
  INTERMEDIATE: "bg-amber-900 text-amber-300",
  ADVANCED: "bg-red-900 text-red-300",
};

export default function StudentProgressDetail({
  levels,
  progressMap,
}: {
  levels: Level[];
  progressMap: Map<string, Progress>;
}) {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-lg font-semibold">Progreso por módulo</h2>

      {levels.map((level) => {
        const completedInLevel = level.modules.filter(
          (m) => progressMap.get(m.id)?.completed
        ).length;

        return (
          <div key={level.id} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            {/* Header del nivel */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <h3 className="font-semibold">{level.name}</h3>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full ${
                    DIFFICULTY_COLORS[level.difficulty] ?? "bg-gray-800 text-gray-300"
                  }`}
                >
                  {DIFFICULTY_LABELS[level.difficulty] ?? level.difficulty}
                </span>
              </div>
              <span className="text-sm text-gray-400">
                {completedInLevel}/{level.modules.length} completados
              </span>
            </div>

            {/* Módulos */}
            <div className="divide-y divide-gray-800">
              {level.modules.map((mod) => {
                const progress = progressMap.get(mod.id);
                const score = progress?.score ?? null;
                const grade = score !== null ? getGrade(score) : null;

                return (
                  <div key={mod.id} className="flex items-center gap-4 px-6 py-4">
                    {/* Estado */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                        progress?.completed
                          ? "bg-emerald-800 text-emerald-300"
                          : score !== null
                          ? "bg-red-900 text-red-300"
                          : "bg-gray-800 text-gray-600"
                      }`}
                    >
                      {progress?.completed ? "✓" : score !== null ? "✗" : mod.order}
                    </div>

                    {/* Info del módulo */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{mod.title}</p>
                      {mod.description && (
                        <p className="text-xs text-gray-500 truncate">{mod.description}</p>
                      )}
                    </div>

                    {/* Detalles de progreso */}
                    <div className="flex items-center gap-6 text-right text-xs flex-shrink-0">
                      {/* Puntaje */}
                      <div className="w-20">
                        {score !== null && grade ? (
                          <>
                            <p className={`font-semibold ${grade.color.text}`}>{score}%</p>
                            <p className="text-gray-600">{grade.label}</p>
                          </>
                        ) : (
                          <p className="text-gray-600">Sin intentar</p>
                        )}
                      </div>

                      {/* Intentos */}
                      <div className="w-16">
                        {progress ? (
                          <>
                            <p className="text-gray-300">{progress.attempts}</p>
                            <p className="text-gray-600">
                              {progress.attempts === 1 ? "intento" : "intentos"}
                            </p>
                          </>
                        ) : (
                          <p className="text-gray-600">—</p>
                        )}
                      </div>

                      {/* Fecha de completado */}
                      <div className="w-28 hidden md:block">
                        {progress?.completedAt ? (
                          <>
                            <p className="text-gray-300">
                              {new Date(progress.completedAt).toLocaleDateString("es-AR", {
                                day: "numeric",
                                month: "short",
                              })}
                            </p>
                            <p className="text-gray-600">completado</p>
                          </>
                        ) : progress?.updatedAt ? (
                          <>
                            <p className="text-gray-500">
                              {new Date(progress.updatedAt).toLocaleDateString("es-AR", {
                                day: "numeric",
                                month: "short",
                              })}
                            </p>
                            <p className="text-gray-600">último intento</p>
                          </>
                        ) : (
                          <p className="text-gray-600">—</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
