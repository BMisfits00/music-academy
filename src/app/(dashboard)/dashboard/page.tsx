import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import InstrumentSelector from "@/components/dashboard/InstrumentSelector";
import CircularProgress from "@/components/dashboard/CircularProgress";

const INSTRUMENT_ICONS: Record<string, string> = {
  piano: "🎹",
  guitarra: "🎸",
  bajo: "🎵",
  teoria: "📖",
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true },
  });
  if (!user) redirect("/login");

  // Cargar teoría e instrumentos regulares
  const teoriaInstrument = await prisma.instrument.findUnique({
    where: { slug: "teoria" },
    include: { levels: { include: { modules: true }, orderBy: { order: "asc" } } },
  });

  const instruments = await prisma.instrument.findMany({
    where: { slug: { not: "teoria" } },
    include: { levels: { include: { modules: true } } },
    orderBy: { name: "asc" },
  });

  // Progreso del usuario
  const allProgress = await prisma.progress.findMany({
    where: { userId: session.user.id },
  });
  const completedSet = new Set(allProgress.filter((p) => p.completed).map((p) => p.moduleId));

  // Progreso por nivel de teoría + lógica de desbloqueo
  const teoriaLevels = teoriaInstrument
    ? teoriaInstrument.levels.map((level) => {
        const regularModules = level.modules.filter((m) => !m.isLevelFinal);
        const finalModule = level.modules.find((m) => m.isLevelFinal) ?? null;
        const moduleIds = regularModules.map((m) => m.id);
        const completedCount = moduleIds.filter((id) => completedSet.has(id)).length;
        const total = regularModules.length;
        const allRegularCompleted = total > 0 && completedCount === total;
        return {
          id: level.id,
          name: level.name,
          order: level.order,
          completed: completedCount,
          total,
          pct: total > 0 ? Math.round((completedCount / total) * 100) : 0,
          finalModuleId: finalModule?.id ?? null,
          finalCompleted: finalModule ? completedSet.has(finalModule.id) : false,
          allRegularCompleted,
        };
      })
    : [];

  // Nivel desbloqueado si el anterior está 100% completo (nivel 1 siempre libre)
  const teoriaLevelsWithUnlock = teoriaLevels.map((level) => {
    if (level.order === 1) return { ...level, isUnlocked: true };
    const prev = teoriaLevels.find((l) => l.order === level.order - 1);
    return { ...level, isUnlocked: prev ? prev.pct === 100 : false };
  });

  // Instrumentos se desbloquean al completar el nivel 2 de teoría
  const teoriaLevel2 = teoriaLevels.find((l) => l.order === 2);
  const teoriaCompleted = teoriaInstrument
    ? (teoriaLevel2 ? teoriaLevel2.pct === 100 : false)
    : true;

  // Progreso por instrumento
  const instrumentsWithProgress = instruments.map((inst) => {
    const moduleIds = inst.levels.flatMap((l) => l.modules.map((m) => m.id));
    const completedCount = moduleIds.filter((id) => completedSet.has(id)).length;
    const total = moduleIds.length;
    return {
      id: inst.id,
      name: inst.name,
      slug: inst.slug,
      completed: completedCount,
      total,
      pct: total > 0 ? Math.round((completedCount / total) * 100) : 0,
    };
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1 text-white">
        Bienvenido{user.name ? `, ${user.name.split(" ")[0]}` : ""}
      </h1>
      <p className="text-slate-400 mb-8">Tu progreso en la academia musical.</p>

      {/* Niveles de Teoría */}
      {teoriaInstrument && (
        <div className="mb-10">
          <h2 className="text-lg font-semibold text-slate-200 mb-4">Teoría Musical</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {teoriaLevelsWithUnlock.map((level) => (
              level.isUnlocked ? (
                <div
                  key={level.id}
                  className="rounded-xl border border-violet-700/40 bg-gradient-to-br from-violet-900/60 to-slate-900 hover:border-violet-500/60 hover:shadow-lg hover:shadow-violet-900/20 transition-all overflow-hidden"
                >
                  <Link
                    href={`/dashboard/nivel/${level.id}`}
                    className="relative flex flex-col gap-4 p-5 group block"
                  >
                    <span className="text-4xl">📖</span>
                    <p className="font-semibold text-base text-slate-200 group-hover:text-violet-300 transition-colors">
                      {level.name}
                    </p>
                    <div className="absolute top-3 right-3">
                      <CircularProgress
                        pct={level.pct}
                        size={52}
                        arcClass={level.pct === 100 ? "text-emerald-400" : "text-violet-400"}
                        textClass={level.pct === 100 ? "text-emerald-400" : level.pct > 0 ? "text-violet-200" : "text-slate-500"}
                      />
                    </div>
                  </Link>
                  {level.finalModuleId && (
                    level.allRegularCompleted ? (
                      <Link
                        href={`/dashboard/module/${level.finalModuleId}`}
                        className="group flex items-center justify-between px-5 py-3 border-t border-amber-900/30 hover:bg-amber-900/10 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{level.finalCompleted ? "✓" : "🏆"}</span>
                          <span className={`text-xs font-medium ${level.finalCompleted ? "text-emerald-400" : "text-amber-300"}`}>
                            Evaluación Final
                          </span>
                        </div>
                        <span className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors ${
                          level.finalCompleted
                            ? "bg-emerald-900/50 text-emerald-400 group-hover:bg-emerald-900/70"
                            : "bg-amber-600 text-white group-hover:bg-amber-500"
                        }`}>
                          {level.finalCompleted ? "Repasar" : "Rendir"}
                        </span>
                      </Link>
                    ) : (
                      <div className="flex items-center justify-between px-5 py-3 border-t border-gray-800/60 opacity-40">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">🔒</span>
                          <span className="text-xs font-medium text-gray-500">Evaluación Final</span>
                        </div>
                        <span className="text-xs px-2.5 py-1 rounded-lg font-medium bg-gray-800 text-gray-600">
                          Bloqueado
                        </span>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <div
                  key={level.id}
                  title="Completá el nivel anterior para desbloquear"
                  className="relative flex flex-col gap-4 rounded-xl border border-slate-800 bg-slate-900/50 p-5 opacity-40 cursor-not-allowed"
                >
                  <span className="absolute top-3 right-3 text-slate-500 text-base">🔒</span>
                  <span className="text-4xl">📖</span>
                  <p className="font-semibold text-base text-slate-500">{level.name}</p>
                </div>
              )
            ))}
          </div>
        </div>
      )}

      {/* Instrumentos */}
      <div>
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-200">Instrumentos</h2>
          {!teoriaCompleted && teoriaInstrument && (
            <span className="text-sm text-amber-400">
              Completá la Teoría Musical para desbloquear
            </span>
          )}
        </div>
        <InstrumentSelector
          instruments={instrumentsWithProgress.map((i) => ({ id: i.id, name: i.name, slug: i.slug, pct: i.pct }))}
          teoriaCompleted={teoriaCompleted}
        />
      </div>
    </div>
  );
}
