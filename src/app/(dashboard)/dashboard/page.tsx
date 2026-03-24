import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import InstrumentSelector from "@/components/dashboard/InstrumentSelector";

const INSTRUMENT_ICONS: Record<string, string> = {
  piano: "🎹",
  guitarra: "🎸",
  bajo: "🎵",
  teoria: "📖",
};


// r=36, circunferencia ≈ 226.2
const CIRC = 2 * Math.PI * 36;

function CircularProgress({
  pct,
  label,
  icon,
  color = "#6366f1",
}: {
  pct: number;
  label: string;
  icon: string;
  color?: string;
}) {
  const offset = CIRC - (pct / 100) * CIRC;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-[88px] h-[88px]">
        <svg width="88" height="88" className="block -rotate-90">
          <circle cx="44" cy="44" r="36" fill="none" stroke="#1f2937" strokeWidth="7" />
          <circle
            cx="44"
            cy="44"
            r="36"
            fill="none"
            stroke={color}
            strokeWidth="7"
            strokeDasharray={CIRC}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
          <span className="text-xl leading-none">{icon}</span>
          <span className="text-xs font-bold text-white">{pct}%</span>
        </div>
      </div>
      <span className="text-xs text-gray-400 text-center leading-tight w-[88px]">{label}</span>
    </div>
  );
}

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

  // Progreso total de teoría
  let teoriaCompleted = true;
  let teoriaPct = 0;
  let teoriaCompletedCount = 0;
  let teoriaTotal = 0;

  // Progreso por nivel de teoría
  const teoriaLevels = teoriaInstrument
    ? teoriaInstrument.levels.map((level) => {
        const moduleIds = level.modules.map((m) => m.id);
        const completedCount = moduleIds.filter((id) => completedSet.has(id)).length;
        const total = moduleIds.length;
        return {
          id: level.id,
          name: level.name,
          difficulty: level.difficulty as string,
          completed: completedCount,
          total,
          pct: total > 0 ? Math.round((completedCount / total) * 100) : 0,
        };
      })
    : [];

  if (teoriaInstrument) {
    teoriaTotal = teoriaInstrument.levels.reduce((s, l) => s + l.modules.length, 0);
    teoriaCompletedCount = teoriaInstrument.levels
      .flatMap((l) => l.modules.map((m) => m.id))
      .filter((id) => completedSet.has(id)).length;
    teoriaPct = teoriaTotal > 0 ? Math.round((teoriaCompletedCount / teoriaTotal) * 100) : 0;
    teoriaCompleted = teoriaTotal > 0 && teoriaCompletedCount === teoriaTotal;
  }

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
      <h1 className="text-2xl font-bold mb-1">
        Bienvenido{user.name ? `, ${user.name.split(" ")[0]}` : ""}
      </h1>
      <p className="text-gray-400 mb-8">Tu progreso en la academia musical.</p>

      {/* Gráficos de progreso — centrados */}
      <div className="flex flex-col items-center gap-4 mb-10 p-6 bg-gray-900 border border-gray-800 rounded-2xl">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider self-start">
          Progreso general
        </p>
        <div className="flex gap-8 flex-wrap justify-center">
          {teoriaInstrument && (
            <CircularProgress
              pct={teoriaPct}
              label="Teoría Musical"
              icon={INSTRUMENT_ICONS["teoria"]}
              color="#8b5cf6"
            />
          )}
          {instrumentsWithProgress.map((inst) => (
            <CircularProgress
              key={inst.id}
              pct={inst.pct}
              label={inst.name}
              icon={INSTRUMENT_ICONS[inst.slug] ?? "🎵"}
              color={teoriaCompleted ? "#6366f1" : "#374151"}
            />
          ))}
        </div>
      </div>

      {/* Niveles de Teoría */}
      {teoriaInstrument && (
        <div className="mb-10">
          <h2 className="text-lg font-semibold mb-4">Teoría Musical</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {teoriaLevels.map((level) => (
              <Link
                key={level.id}
                href="/dashboard/teoria"
                className="flex flex-col gap-4 rounded-xl border border-gray-800 bg-gray-900 hover:border-indigo-500 hover:bg-gray-800 p-5 transition-all group"
              >
                <span className="text-4xl">📖</span>
                <p className="font-semibold text-base group-hover:text-indigo-400 transition-colors">
                  {level.name}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Instrumentos */}
      <div>
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-lg font-semibold">Instrumentos</h2>
          {!teoriaCompleted && teoriaInstrument && (
            <span className="text-sm text-amber-400">
              Completá la Teoría Musical para desbloquear
            </span>
          )}
        </div>
        <InstrumentSelector
          instruments={instrumentsWithProgress.map((i) => ({ id: i.id, name: i.name, slug: i.slug }))}
          teoriaCompleted={teoriaCompleted}
        />
      </div>
    </div>
  );
}
