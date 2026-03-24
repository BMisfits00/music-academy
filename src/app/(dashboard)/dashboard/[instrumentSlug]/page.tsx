import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import LevelCard from "@/components/dashboard/LevelCard";

interface PageProps {
  params: Promise<{ instrumentSlug: string }>;
}

const INSTRUMENT_ICONS: Record<string, string> = {
  piano: "🎹",
  guitarra: "🎸",
  bajo: "🎵",
};

export default async function InstrumentPage({ params }: PageProps) {
  const { instrumentSlug } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const instrument = await prisma.instrument.findUnique({ where: { slug: instrumentSlug } });
  if (!instrument) notFound();

  const [levels, userProgress] = await Promise.all([
    prisma.level.findMany({
      where: { instrumentId: instrument.id },
      include: { modules: { orderBy: { order: "asc" } } },
      orderBy: { order: "asc" },
    }),
    prisma.progress.findMany({ where: { userId: session.user.id } }),
  ]);

  const completedModules = userProgress.filter((p) => p.completed).length;
  const totalModules = levels.reduce((sum, l) => sum + l.modules.length, 0);
  const progressMap = new Map(userProgress.map((p) => [p.moduleId, p]));

  // Lógica de desbloqueo
  const unlockedModuleIds = new Set<string>();
  for (let li = 0; li < levels.length; li++) {
    const level = levels[li];
    for (let mi = 0; mi < level.modules.length; mi++) {
      const mod = level.modules[mi];
      if (li === 0 && mi === 0) {
        unlockedModuleIds.add(mod.id);
        continue;
      }
      const prevMod =
        mi > 0
          ? level.modules[mi - 1]
          : levels[li - 1]?.modules[levels[li - 1].modules.length - 1];
      if (prevMod && progressMap.get(prevMod.id)?.completed) {
        unlockedModuleIds.add(mod.id);
      }
    }
  }

  const icon = INSTRUMENT_ICONS[instrument.slug] ?? "🎵";
  const progressPct = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;

  return (
    <div>
      {/* Regresar */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600 rounded-lg px-4 py-2 transition-all mb-6"
      >
        ← Regresar
      </Link>

      {/* Encabezado */}
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1">{icon} {instrument.name}</h1>
          <p className="text-gray-400">{instrument.description}</p>
        </div>
        <div className="hidden md:flex gap-6 text-center">
          <div>
            <p className="text-2xl font-bold text-indigo-400">{completedModules}</p>
            <p className="text-xs text-gray-500">Completados</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-indigo-400">{totalModules}</p>
            <p className="text-xs text-gray-500">Total</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-indigo-400">{progressPct}%</p>
            <p className="text-xs text-gray-500">Progreso</p>
          </div>
        </div>
      </div>

      {/* Barra de progreso */}
      <div className="mb-10">
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-600 rounded-full transition-all"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Niveles */}
      <div className="flex flex-col gap-8">
        {levels.map((level, li) => (
          <LevelCard
            key={level.id}
            level={level}
            levelIndex={li}
            isUnlocked={unlockedModuleIds.has(level.modules[0]?.id)}
            isCompleted={level.modules.every((m) => progressMap.get(m.id)?.completed)}
            progressMap={progressMap}
            unlockedModuleIds={unlockedModuleIds}
          />
        ))}
      </div>
    </div>
  );
}
