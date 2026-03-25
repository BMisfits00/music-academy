import Link from "next/link";

const instruments = [
  {
    slug: "piano",
    name: "Piano",
    description: "Desde las primeras notas hasta armonías complejas. Teoría, lectura de pentagrama y técnica.",
    icon: "🎹",
    levels: ["Principiante", "Intermedio", "Avanzado"],
  },
  {
    slug: "guitarra",
    name: "Guitarra",
    description: "Acordes, escalas, técnicas y estilos. Todo lo que necesitás para dominar la guitarra.",
    icon: "🎸",
    levels: ["Principiante", "Intermedio", "Avanzado"],
  },
  {
    slug: "bajo",
    name: "Bajo",
    description: "Fundamentos del ritmo, grooves, líneas de bajo y teoría aplicada al instrumento.",
    icon: "🎵",
    levels: ["Principiante", "Intermedio", "Avanzado"],
  },
];

export default function HomePage() {
  return (
    <main className="flex flex-col min-h-screen bg-slate-950">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-24 bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-800/20 via-transparent to-transparent pointer-events-none" />
        <h1 className="relative text-5xl font-bold tracking-tight text-white mb-4">
          Aprendé música a tu ritmo
        </h1>
        <p className="relative text-xl text-slate-400 max-w-2xl mb-10">
          Clases estructuradas por niveles para Piano, Guitarra y Bajo.
          Teoría, práctica y seguimiento de tu progreso en un solo lugar.
        </p>
        <div className="relative flex gap-4">
          <Link
            href="/register"
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold transition-colors shadow-lg shadow-indigo-900/50"
          >
            Empezar gratis
          </Link>
          <Link
            href="/login"
            className="px-6 py-3 border border-slate-600 hover:border-indigo-500 hover:text-indigo-300 text-slate-300 rounded-lg font-semibold transition-colors"
          >
            Iniciar sesión
          </Link>
        </div>
      </section>

      {/* Instrumentos */}
      <section className="px-6 py-20 max-w-6xl mx-auto w-full">
        <h2 className="text-3xl font-bold text-center text-white mb-12">
          Elegí tu instrumento
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {instruments.map((inst, i) => {
            const gradients = [
              "from-indigo-900/60 to-slate-900 border-indigo-800/60 hover:border-indigo-600",
              "from-amber-900/60 to-slate-900 border-amber-800/60 hover:border-amber-600",
              "from-emerald-900/60 to-slate-900 border-emerald-800/60 hover:border-emerald-600",
            ];
            const levelColors = [
              "bg-indigo-900/50 border-indigo-700/50 text-indigo-300",
              "bg-amber-900/50 border-amber-700/50 text-amber-300",
              "bg-emerald-900/50 border-emerald-700/50 text-emerald-300",
            ];
            return (
              <div
                key={inst.slug}
                className={`flex flex-col bg-gradient-to-br ${gradients[i]} rounded-2xl p-8 border transition-all hover:shadow-lg`}
              >
                <span className="text-5xl mb-4">{inst.icon}</span>
                <h3 className="text-2xl font-bold text-white mb-2">{inst.name}</h3>
                <p className="text-slate-400 mb-6 flex-1">{inst.description}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {inst.levels.map((level) => (
                    <span
                      key={level}
                      className={`text-xs px-3 py-1 ${levelColors[i]} border rounded-full`}
                    >
                      {level}
                    </span>
                  ))}
                </div>
                <Link
                  href={`/instruments/${inst.slug}`}
                  className="text-center px-4 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg font-medium transition-colors"
                >
                  Ver programa
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="px-6 py-20 bg-slate-900/50 border-t border-slate-800">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            ¿Cómo funciona?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { step: "1", title: "Elegí tu instrumento", desc: "Seleccioná entre Piano, Guitarra o Bajo y empezá desde tu nivel.", color: "from-indigo-600 to-indigo-700" },
              { step: "2", title: "Estudiá a tu ritmo", desc: "Accedé a lecciones teóricas, videos y material de apoyo cuando quieras.", color: "from-violet-600 to-violet-700" },
              { step: "3", title: "Completá desafíos", desc: "Respondé preguntas y ejercicios para desbloquear el siguiente nivel.", color: "from-purple-600 to-purple-700" },
            ].map((item) => (
              <div key={item.step} className="flex flex-col items-center">
                <span className={`w-12 h-12 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center text-xl font-bold text-white mb-4 shadow-lg`}>
                  {item.step}
                </span>
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-slate-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="text-center py-8 text-slate-600 text-sm border-t border-slate-800">
        Music Academy &copy; {new Date().getFullYear()}
      </footer>
    </main>
  );
}
