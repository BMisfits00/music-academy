import { prisma } from "@/lib/prisma";

const INSTRUMENT_ICONS: Record<string, string> = {
  piano: "🎹",
  guitarra: "🎸",
  bajo: "🎵",
  teoria: "📖",
};

const INSTRUMENT_COLORS: Record<string, string> = {
  teoria: "#8b5cf6",
  piano: "#6366f1",
  guitarra: "#06b6d4",
  bajo: "#f59e0b",
};

const CIRC = 2 * Math.PI * 42;

function CircularProgress({
  pct,
  label,
  icon,
  color,
  locked = false,
}: {
  pct: number;
  label: string;
  icon: string;
  color: string;
  locked?: boolean;
}) {
  const offset = CIRC - (pct / 100) * CIRC;
  const displayColor = locked ? "#374151" : color;

  return (
    <div className="flex flex-col items-center gap-2 w-full">
      <div className="relative w-[100px] h-[100px]">
        {/* Track */}
        <svg width="100" height="100" className="block -rotate-90">
          <circle cx="50" cy="50" r="42" fill="none" stroke="#1f2937" strokeWidth="8" />
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke={displayColor}
            strokeWidth="8"
            strokeDasharray={CIRC}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
          <span className="text-2xl leading-none">{locked ? "🔒" : icon}</span>
          <span className="text-sm font-bold text-white leading-none mt-1">{pct}%</span>
        </div>
      </div>

      {/* Label + bar */}
      <div className="w-full px-1">
        <p className="text-xs text-gray-400 text-center leading-tight mb-1.5">{label}</p>
        <div className="h-1 rounded-full bg-gray-800 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${pct}%`, backgroundColor: locked ? "#374151" : color }}
          />
        </div>
      </div>
    </div>
  );
}

export default async function ProgressSidebar({ userId }: { userId: string }) {
  const allInstruments = await prisma.instrument.findMany({
    include: {
      levels: {
        include: { modules: true },
        orderBy: { order: "asc" },
      },
    },
    orderBy: { name: "asc" },
  });

  const userProgress = await prisma.progress.findMany({
    where: { userId },
  });
  const completedSet = new Set(
    userProgress.filter((p) => p.completed).map((p) => p.moduleId)
  );

  const teoriaInstrument = allInstruments.find((i) => i.slug === "teoria");
  const instruments = allInstruments.filter((i) => i.slug !== "teoria");

  function getPct(levels: { modules: { id: string }[] }[]) {
    const moduleIds = levels.flatMap((l) => l.modules.map((m) => m.id));
    const total = moduleIds.length;
    const completed = moduleIds.filter((id) => completedSet.has(id)).length;
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  }

  const teoriaPct = teoriaInstrument ? getPct(teoriaInstrument.levels) : 0;

  // Instruments unlock after teoria level 2 is 100%
  const teoriaLevel2 = teoriaInstrument?.levels.find((l) => l.order === 2);
  const teoriaCompleted = teoriaInstrument
    ? teoriaLevel2
      ? getPct([teoriaLevel2]) === 100
      : false
    : true;

  const totalModules =
    (teoriaInstrument?.levels.reduce((s, l) => s + l.modules.length, 0) ?? 0) +
    instruments.reduce(
      (s, i) => s + i.levels.reduce((ss, l) => ss + l.modules.length, 0),
      0
    );
  const totalCompleted = userProgress.filter((p) => p.completed).length;
  const overallPct = totalModules > 0 ? Math.round((totalCompleted / totalModules) * 100) : 0;

  return (
    <aside className="w-52 flex-shrink-0 sticky top-0 h-screen border-l border-gray-800 bg-gray-900/60 flex flex-col">
      {/* Header */}
      <div className="px-4 py-4 border-b border-gray-800">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Progreso general
        </p>
        {/* Overall bar */}
        <div className="mt-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-gray-400">Total</span>
            <span className="text-xs font-bold text-white">{overallPct}%</span>
          </div>
          <div className="h-2 rounded-full bg-gray-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-500"
              style={{ width: `${overallPct}%` }}
            />
          </div>
          <p className="text-xs text-gray-600 mt-1.5">
            {totalCompleted} / {totalModules} módulos
          </p>
        </div>
      </div>

      {/* Per-instrument circles */}
      <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-6 items-center">
        {teoriaInstrument && (
          <CircularProgress
            pct={teoriaPct}
            label="Teoría Musical"
            icon={INSTRUMENT_ICONS["teoria"]}
            color={INSTRUMENT_COLORS["teoria"]}
          />
        )}
        {instruments.map((inst) => (
          <CircularProgress
            key={inst.id}
            pct={getPct(inst.levels)}
            label={inst.name}
            icon={INSTRUMENT_ICONS[inst.slug] ?? "🎵"}
            color={INSTRUMENT_COLORS[inst.slug] ?? "#6366f1"}
            locked={!teoriaCompleted}
          />
        ))}
      </div>
    </aside>
  );
}
