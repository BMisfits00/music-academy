import { prisma } from "@/lib/prisma";
import { calcModulePct } from "@/lib/progress";

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
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
          <span className="text-2xl leading-none">{locked ? "🔒" : icon}</span>
          <span className="text-sm font-bold text-white leading-none mt-1">{pct}%</span>
        </div>
      </div>

      <div className="w-full px-1">
        <p className="text-xs text-gray-400 text-center leading-tight mb-1.5">{label}</p>
        <svg width="100%" height="4" className="overflow-visible">
          <rect x="0" y="0" width="100%" height="4" fill="#1f2937" rx="2" />
          <rect x="0" y="0" width={`${pct}%`} height="4" fill={displayColor} rx="2" />
        </svg>
      </div>
    </div>
  );
}

export default async function ProgressSidebar({ userId }: { userId: string }) {
  const allInstruments = await prisma.instrument.findMany({
    include: {
      levels: {
        include: {
          modules: {
            include: {
              lessons: { select: { id: true } },
            },
          },
        },
        orderBy: { order: "asc" },
      },
    },
    orderBy: { name: "asc" },
  });

  // Collect all lesson IDs across all instruments
  const allLessonIds = allInstruments.flatMap((inst) =>
    inst.levels.flatMap((l) => l.modules.flatMap((m) => m.lessons.map((ls) => ls.id)))
  );

  const [userProgress, lessonProgressList] = await Promise.all([
    prisma.progress.findMany({ where: { userId } }),
    prisma.lessonProgress.findMany({
      where: { userId, lessonId: { in: allLessonIds } },
      select: { lessonId: true },
    }),
  ]);

  const completedModules = new Map(
    userProgress.filter((p) => p.completed).map((p) => [p.moduleId, true])
  );
  const readLessons = new Set(lessonProgressList.map((lp) => lp.lessonId));

  const teoriaInstrument = allInstruments.find((i) => i.slug === "teoria");
  const instruments = allInstruments.filter((i) => i.slug !== "teoria");

  function getInstrumentPct(levels: typeof allInstruments[0]["levels"]): number {
    let earned = 0;
    let total = 0;
    for (const level of levels) {
      for (const mod of level.modules) {
        const L = mod.lessons.length;
        if (L === 0) continue;
        const readCount = mod.lessons.filter((ls) => readLessons.has(ls.id)).length;
        const quizDone = completedModules.has(mod.id);
        earned += readCount + (quizDone ? L : 0);
        total += L * 2;
      }
    }
    return total > 0 ? Math.round((earned / total) * 100) : 0;
  }

  const teoriaPct = teoriaInstrument ? getInstrumentPct(teoriaInstrument.levels) : 0;

  // Instruments unlock after teoria level 2 is 100% (quiz-based for unlock)
  const teoriaLevel2 = teoriaInstrument?.levels.find((l) => l.order === 2);
  const teoriaCompleted = teoriaInstrument
    ? teoriaLevel2
      ? teoriaLevel2.modules.every((m) => completedModules.has(m.id))
      : false
    : true;

  // Overall progress
  let overallEarned = 0;
  let overallTotal = 0;
  for (const inst of allInstruments) {
    for (const level of inst.levels) {
      for (const mod of level.modules) {
        const L = mod.lessons.length;
        if (L === 0) continue;
        const readCount = mod.lessons.filter((ls) => readLessons.has(ls.id)).length;
        const quizDone = completedModules.has(mod.id);
        overallEarned += readCount + (quizDone ? L : 0);
        overallTotal += L * 2;
      }
    }
  }
  const overallPct = overallTotal > 0 ? Math.round((overallEarned / overallTotal) * 100) : 0;
  const moduleCount = allInstruments.reduce(
    (s, i) => s + i.levels.reduce((ss, l) => ss + l.modules.length, 0),
    0
  );
  const completedModuleCount = userProgress.filter((p) => p.completed).length;

  return (
    <aside className="w-52 flex-shrink-0 sticky top-0 h-screen border-l border-gray-800 bg-gray-900/60 flex flex-col">
      {/* Header */}
      <div className="px-4 py-4 border-b border-gray-800">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Progreso general
        </p>
        <div className="mt-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-gray-400">Total</span>
            <span className="text-xs font-bold text-white">{overallPct}%</span>
          </div>
          <svg width="100%" height="8">
            <defs>
              <linearGradient id="overall-grad" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
            <rect x="0" y="0" width="100%" height="8" fill="#1f2937" rx="4" />
            <rect x="0" y="0" width={`${overallPct}%`} height="8" fill="url(#overall-grad)" rx="4" />
          </svg>
          <p className="text-xs text-gray-600 mt-1.5">
            {completedModuleCount} / {moduleCount} quizzes
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
            pct={getInstrumentPct(inst.levels)}
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
