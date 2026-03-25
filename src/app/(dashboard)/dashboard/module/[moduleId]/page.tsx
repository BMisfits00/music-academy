import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import ChallengeSet from "@/components/challenges/ChallengeSet";

interface PageProps {
  params: Promise<{ moduleId: string }>;
  searchParams: Promise<{ back?: string }>;
}

export default async function ModulePage({ params, searchParams }: PageProps) {
  const { moduleId } = await params;
  const { back } = await searchParams;
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [module, progress] = await Promise.all([
    prisma.module.findUnique({
      where: { id: moduleId },
      include: {
        level: { include: { instrument: true } },
        challenges: { orderBy: { order: "asc" } },
      },
    }),
    prisma.progress.findUnique({
      where: {
        userId_moduleId: { userId: session.user.id, moduleId },
      },
    }),
  ]);

  if (!module) notFound();

  const instrument = module.level.instrument;
  const level = module.level;
  const instrumentIcon =
    instrument.slug === "piano" ? "🎹"
    : instrument.slug === "guitarra" ? "🎸"
    : "🎵";

  const difficultyLabel: Record<string, string> = {
    BEGINNER: "Principiante",
    INTERMEDIATE: "Intermedio",
    ADVANCED: "Avanzado",
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Regresar */}
      <Link
        href={back && back.startsWith("/dashboard/") ? back : `/dashboard/${instrument.slug}`}
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600 rounded-lg px-4 py-2 transition-all mb-4"
      >
        ← Regresar
      </Link>

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/dashboard" className="hover:text-gray-300 transition-colors">
          Inicio
        </Link>
        <span>/</span>
        <Link href={`/dashboard/${instrument.slug}`} className="hover:text-gray-300 transition-colors">
          {instrumentIcon} {instrument.name}
        </Link>
        <span>/</span>
        <span className="text-gray-400">
          {difficultyLabel[level.difficulty] ?? level.difficulty}
        </span>
        <span>/</span>
        <span className="text-gray-200">{module.title}</span>
      </nav>

      {/* Encabezado del módulo */}
      <div className="mb-8">
        {module.isLevelFinal && (
          <div className="flex items-center gap-2 text-amber-400 text-sm font-medium mb-3">
            <span>🏆</span>
            <span>Evaluación Final del Nivel</span>
          </div>
        )}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-1">{module.title}</h1>
            {module.description && (
              <p className="text-gray-400">{module.description}</p>
            )}
          </div>
          {progress?.completed && (
            <span className="flex-shrink-0 flex items-center gap-1.5 text-sm text-emerald-400 bg-emerald-950 border border-emerald-800 px-3 py-1.5 rounded-full">
              ✓ Aprobado
            </span>
          )}
        </div>

        {progress && !progress.completed && progress.score !== null && (
          <div className="mt-3 text-sm text-amber-400">
            Último intento: {Math.round(progress.score)}% — intentos: {progress.attempts}
          </div>
        )}
      </div>

      {/* Desafíos */}
      <section>
        <ChallengeSet
          moduleId={module.id}
          challenges={module.challenges}
          previousScore={progress?.score}
          previousCompleted={progress?.completed}
        />
      </section>
    </div>
  );
}
