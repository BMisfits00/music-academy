import "dotenv/config";
import { PrismaClient, DifficultyLevel } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { MODULE_CONTENT } from "./content";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // ─── Instrumentos ──────────────────────────────────────────────
  const piano = await prisma.instrument.upsert({
    where: { slug: "piano" },
    update: {},
    create: {
      name: "Piano",
      slug: "piano",
      description: "Desde las primeras notas hasta armonías complejas. Teoría, lectura de pentagrama y técnica de dos manos.",
    },
  });

  const guitarra = await prisma.instrument.upsert({
    where: { slug: "guitarra" },
    update: {},
    create: {
      name: "Guitarra",
      slug: "guitarra",
      description: "Acordes, escalas, técnicas y estilos. Todo lo que necesitás para dominar la guitarra.",
    },
  });

  const bajo = await prisma.instrument.upsert({
    where: { slug: "bajo" },
    update: {},
    create: {
      name: "Bajo",
      slug: "bajo",
      description: "Fundamentos del ritmo, grooves, líneas de bajo y teoría aplicada al instrumento.",
    },
  });

  // Teoría transversal — prerequisito para todos los instrumentos
  const teoria = await prisma.instrument.upsert({
    where: { slug: "teoria" },
    update: {},
    create: {
      name: "Teoría Musical",
      slug: "teoria",
      description: "Notación, lectura rítmica y melódica, intervalos, escalas y armonía. Base obligatoria antes de comenzar cualquier instrumento.",
    },
  });

  const instruments = [piano, guitarra, bajo];
  const allInstrumentsIncludingTheory = [teoria, piano, guitarra, bajo];
  console.log(`✓ ${instruments.length} instrumentos creados`);

  // ─── Niveles y módulos (iguales para los 3 instrumentos) ──────
  const levelData = [
    {
      name: "Nivel 1 — Principiante",
      difficulty: DifficultyLevel.BEGINNER,
      order: 1,
      description: "Fundamentos de la música: notación, ritmo y lectura melódica básica.",
      modules: [
        {
          order: 1,
          title: "Fundamentos de Notación",
          description: "El pentagrama, las claves, figuras rítmicas y el compás.",
        },
        {
          order: 2,
          title: "Lectura Rítmica",
          description: "Pulso, acento, tempo y subdivisión binaria.",
        },
        {
          order: 3,
          title: "Lectura Melódica Básica",
          description: "Notas en el pentagrama, alteraciones y tonalidad de Do Mayor.",
        },
      ],
    },
    {
      name: "Nivel 2 — Intermedio",
      difficulty: DifficultyLevel.INTERMEDIATE,
      order: 2,
      description: "Intervalos, escalas, compases compuestos y acordes básicos.",
      modules: [
        {
          order: 1,
          title: "Intervalos y Escalas",
          description: "Intervalos justos/mayores/menores y construcción de la escala mayor.",
        },
        {
          order: 2,
          title: "Ritmos y Compases Compuestos",
          description: "Compases 6/8, 9/8, ligaduras, puntillos, síncopas y contratiempos.",
        },
        {
          order: 3,
          title: "Acordes y Triadas",
          description: "Triadas Mayor, Menor, Disminuida y Aumentada. Cifrado americano.",
        },
      ],
    },
    {
      name: "Nivel 3 — Avanzado",
      difficulty: DifficultyLevel.ADVANCED,
      order: 3,
      description: "Armonía funcional, modos, escalas avanzadas y nociones de composición.",
      modules: [
        {
          order: 1,
          title: "Armonía Funcional",
          description: "Grados, funciones, progresiones típicas y acordes de 4 sonidos.",
        },
        {
          order: 2,
          title: "Modos y Escalas Avanzadas",
          description: "Modos de la escala mayor, pentatónica, blues y aplicación práctica.",
        },
        {
          order: 3,
          title: "Composición y Forma Musical",
          description: "Forma de canción, frase musical, análisis armónico y composición.",
        },
      ],
    },
  ];

  let totalLevels = 0;
  let totalModules = 0;

  for (const instrument of allInstrumentsIncludingTheory) {
    for (const lvl of levelData) {
      const level = await prisma.level.upsert({
        where: {
          // Prisma no soporta upsert compuesto sin unique — usamos findFirst + create
          id: `${instrument.slug}-level-${lvl.order}`,
        },
        update: {},
        create: {
          id: `${instrument.slug}-level-${lvl.order}`,
          instrumentId: instrument.id,
          name: lvl.name,
          difficulty: lvl.difficulty,
          order: lvl.order,
          description: lvl.description,
        },
      });
      totalLevels++;

      for (const mod of lvl.modules) {
        await prisma.module.upsert({
          where: {
            id: `${instrument.slug}-level-${lvl.order}-mod-${mod.order}`,
          },
          update: {},
          create: {
            id: `${instrument.slug}-level-${lvl.order}-mod-${mod.order}`,
            levelId: level.id,
            title: mod.title,
            description: mod.description,
            order: mod.order,
          },
        });
        totalModules++;
      }
    }
  }

  console.log(`✓ ${totalLevels} niveles creados`);
  console.log(`✓ ${totalModules} módulos creados`);

  // ─── Lecciones y desafíos ─────────────────────────────────────
  let totalLessons = 0;
  let totalChallenges = 0;

  for (const instrument of allInstrumentsIncludingTheory) {
    for (let lvl = 1; lvl <= 3; lvl++) {
      for (let mod = 1; mod <= 3; mod++) {
        const moduleId = `${instrument.slug}-level-${lvl}-mod-${mod}`;
        const contentKey = `level-${lvl}-mod-${mod}`;
        const content = MODULE_CONTENT[contentKey];
        if (!content) continue;

        for (const lesson of content.lessons) {
          await prisma.lesson.upsert({
            where: { id: `${moduleId}-lesson-${lesson.order}` },
            update: { title: lesson.title, content: lesson.content },
            create: {
              id: `${moduleId}-lesson-${lesson.order}`,
              moduleId,
              title: lesson.title,
              content: lesson.content,
              order: lesson.order,
            },
          });
          totalLessons++;
        }

        for (const challenge of content.challenges) {
          await prisma.challenge.upsert({
            where: { id: `${moduleId}-challenge-${challenge.order}` },
            update: {
              question: challenge.question,
              options: challenge.options,
              correctAnswer: challenge.correctAnswer,
              explanation: challenge.explanation,
            },
            create: {
              id: `${moduleId}-challenge-${challenge.order}`,
              moduleId,
              question: challenge.question,
              type: challenge.type,
              options: challenge.options,
              correctAnswer: challenge.correctAnswer,
              explanation: challenge.explanation,
              order: challenge.order,
            },
          });
          totalChallenges++;
        }
      }
    }
  }

  console.log(`✓ ${totalLessons} lecciones creadas`);
  console.log(`✓ ${totalChallenges} desafíos creados`);
  console.log("Seed completado.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
