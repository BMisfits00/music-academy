interface Resource {
  id: string;
  title: string;
  type: string;
  url: string;
}

interface Lesson {
  id: string;
  title: string;
  content: string;
  order: number;
  resources: Resource[];
}

const RESOURCE_ICONS: Record<string, string> = {
  VIDEO: "▶",
  PDF: "📄",
  IMAGE: "🖼",
  AUDIO: "🎵",
  LINK: "🔗",
};

export default function LessonContent({ lessons }: { lessons: Lesson[] }) {
  if (lessons.length === 0) {
    return (
      <div className="bg-gray-900 border border-dashed border-gray-700 rounded-xl p-10 text-center text-gray-500">
        <p className="text-lg mb-1">Contenido en preparación</p>
        <p className="text-sm">Las lecciones de este módulo se agregarán pronto.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {lessons.map((lesson) => (
        <div key={lesson.id} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800">
            <h3 className="font-semibold text-lg">{lesson.title}</h3>
          </div>

          {/* Contenido HTML de la lección */}
          <div
            className="px-6 py-5 prose prose-invert prose-sm max-w-none
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
      ))}
    </div>
  );
}
