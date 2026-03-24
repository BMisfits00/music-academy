import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";

interface PageProps {
  params: Promise<{ lessonId: string }>;
  searchParams: Promise<{ back?: string }>;
}

export default async function LessonPage({ params, searchParams }: PageProps) {
  const { lessonId } = await params;
  const { back } = await searchParams;
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: {
      resources: true,
      module: {
        include: {
          level: { include: { instrument: true } },
        },
      },
    },
  });

  if (!lesson) notFound();

  // Marcar como leída (upsert silencioso)
  await prisma.lessonProgress.upsert({
    where: { userId_lessonId: { userId: session.user.id, lessonId: lesson.id } },
    create: { userId: session.user.id, lessonId: lesson.id },
    update: {},
  });

  const level = lesson.module.level;
  const instrument = level.instrument;
  const backUrl =
    back && back.startsWith("/dashboard/") ? back : `/dashboard/nivel/${level.id}`;

  const RESOURCE_ICONS: Record<string, string> = {
    VIDEO: "▶",
    PDF: "📄",
    IMAGE: "🖼",
    AUDIO: "🎵",
    LINK: "🔗",
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Regresar */}
      <Link
        href={backUrl}
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600 rounded-lg px-4 py-2 transition-all mb-4"
      >
        ← Regresar
      </Link>

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6 flex-wrap">
        <Link href="/dashboard" className="hover:text-gray-300 transition-colors">
          Inicio
        </Link>
        <span>/</span>
        <Link href={`/dashboard/nivel/${level.id}`} className="hover:text-gray-300 transition-colors">
          {level.name}
        </Link>
        <span>/</span>
        <span className="text-gray-200">{lesson.title}</span>
      </nav>

      {/* Título */}
      <h1 className="text-2xl font-bold mb-8">{lesson.title}</h1>

      {/* Contenido HTML */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden mb-6">
        <div
          className="px-6 py-6 prose prose-invert prose-sm max-w-none
            prose-headings:font-semibold prose-headings:text-gray-100
            prose-p:text-gray-300 prose-p:leading-relaxed
            prose-strong:text-gray-100
            prose-ul:text-gray-300 prose-ol:text-gray-300
            prose-li:marker:text-indigo-400
            prose-blockquote:border-indigo-500 prose-blockquote:text-gray-400
            prose-code:bg-gray-800 prose-code:text-indigo-300 prose-code:px-1 prose-code:rounded"
          dangerouslySetInnerHTML={{ __html: lesson.content }}
        />

        {/* Recursos adjuntos */}
        {lesson.resources.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-800 bg-gray-950/50">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
              Material de apoyo
            </p>
            <div className="flex flex-wrap gap-2">
              {lesson.resources.map((res) => (
                <a
                  key={res.id}
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-gray-300"
                >
                  <span>{RESOURCE_ICONS[res.type] ?? "🔗"}</span>
                  {res.title}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Navegar al módulo completo (quiz) */}
      <div className="flex justify-end">
        <Link
          href={`/dashboard/module/${lesson.moduleId}?back=${encodeURIComponent(`/dashboard/nivel/${level.id}`)}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          Ir al quiz del módulo →
        </Link>
      </div>
    </div>
  );
}
