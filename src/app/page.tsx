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
    <main className="flex flex-col min-h-screen">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-24 bg-gradient-to-b from-gray-900 to-gray-950">
        <h1 className="text-5xl font-bold tracking-tight mb-4">
          Aprendé música a tu ritmo
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mb-10">
          Clases estructuradas por niveles para Piano, Guitarra y Bajo.
          Teoría, práctica y seguimiento de tu progreso en un solo lugar.
        </p>
        <div className="flex gap-4">
          <Link
            href="/register"
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-semibold transition-colors"
          >
            Empezar gratis
          </Link>
          <Link
            href="/login"
            className="px-6 py-3 border border-gray-600 hover:border-gray-400 rounded-lg font-semibold transition-colors"
          >
            Iniciar sesión
          </Link>
        </div>
      </section>

      {/* Instrumentos */}
      <section className="px-6 py-20 max-w-6xl mx-auto w-full">
        <h2 className="text-3xl font-bold text-center mb-12">
          Elegí tu instrumento
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {instruments.map((inst) => (
            <div
              key={inst.slug}
              className="flex flex-col bg-gray-900 rounded-xl p-8 border border-gray-800 hover:border-indigo-500 transition-colors"
            >
              <span className="text-5xl mb-4">{inst.icon}</span>
              <h3 className="text-2xl font-bold mb-2">{inst.name}</h3>
              <p className="text-gray-400 mb-6 flex-1">{inst.description}</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {inst.levels.map((level) => (
                  <span
                    key={level}
                    className="text-xs px-3 py-1 bg-gray-800 rounded-full text-gray-300"
                  >
                    {level}
                  </span>
                ))}
              </div>
              <Link
                href={`/instruments/${inst.slug}`}
                className="text-center px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-medium transition-colors"
              >
                Ver programa
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="px-6 py-20 bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            ¿Cómo funciona?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { step: "1", title: "Elegí tu instrumento", desc: "Seleccioná entre Piano, Guitarra o Bajo y empezá desde tu nivel." },
              { step: "2", title: "Estudiá a tu ritmo", desc: "Accedé a lecciones teóricas, videos y material de apoyo cuando quieras." },
              { step: "3", title: "Completá desafíos", desc: "Respondé preguntas y ejercicios para desbloquear el siguiente nivel." },
            ].map((item) => (
              <div key={item.step} className="flex flex-col items-center">
                <span className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-xl font-bold mb-4">
                  {item.step}
                </span>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="text-center py-8 text-gray-600 text-sm">
        Music Academy &copy; {new Date().getFullYear()}
      </footer>
    </main>
  );
}
