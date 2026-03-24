import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const TEST_USERS = [
  // ── Alumnos ──────────────────────────────────────────────────────
  { name: "Ana García",        email: "ana.garcia@test.com",       password: "Alumno123!", role: "STUDENT", instrument: "piano"    },
  { name: "Carlos López",      email: "carlos.lopez@test.com",     password: "Alumno123!", role: "STUDENT", instrument: "guitarra" },
  { name: "María Rodríguez",   email: "maria.rodriguez@test.com",  password: "Alumno123!", role: "STUDENT", instrument: "bajo"     },
  { name: "Juan Martínez",     email: "juan.martinez@test.com",    password: "Alumno123!", role: "STUDENT", instrument: "piano"    },
  { name: "Sofía Fernández",   email: "sofia.fernandez@test.com",  password: "Alumno123!", role: "STUDENT", instrument: "guitarra" },
  { name: "Diego Torres",      email: "diego.torres@test.com",     password: "Alumno123!", role: "STUDENT", instrument: "bajo"     },
  { name: "Valentina Díaz",    email: "valentina.diaz@test.com",   password: "Alumno123!", role: "STUDENT", instrument: "piano"    },
  { name: "Lucas Pérez",       email: "lucas.perez@test.com",      password: "Alumno123!", role: "STUDENT", instrument: "guitarra" },
  { name: "Camila Sánchez",    email: "camila.sanchez@test.com",   password: "Alumno123!", role: "STUDENT", instrument: null       },
  { name: "Mateo González",    email: "mateo.gonzalez@test.com",   password: "Alumno123!", role: "STUDENT", instrument: "bajo"     },

  // ── Profesores ───────────────────────────────────────────────────
  { name: "Roberto Iglesias",  email: "roberto.iglesias@test.com", password: "Profe123!",  role: "TEACHER", instrument: null },
  { name: "Laura Morales",     email: "laura.morales@test.com",    password: "Profe123!",  role: "TEACHER", instrument: null },
  { name: "Miguel Vargas",     email: "miguel.vargas@test.com",    password: "Profe123!",  role: "TEACHER", instrument: null },

  // ── Admins ───────────────────────────────────────────────────────
  { name: "Patricia Ruiz",     email: "patricia.ruiz@test.com",    password: "Admin123!",  role: "ADMIN",   instrument: null },
  { name: "Andrés Castro",     email: "andres.castro@test.com",    password: "Admin123!",  role: "ADMIN",   instrument: null },
] as const;

async function main() {
  console.log("Creando usuarios de prueba...\n");

  const instruments = await prisma.instrument.findMany({
    where: { slug: { not: "teoria" } },
    select: { id: true, slug: true },
  });
  const instrumentMap = new Map(instruments.map((i) => [i.slug, i.id]));

  const lines: string[] = [
    "═══════════════════════════════════════════════════════",
    "        CREDENCIALES DE USUARIOS DE PRUEBA",
    "        Music Academy — ambiente de desarrollo",
    "═══════════════════════════════════════════════════════",
    "",
  ];

  const sections: Record<string, typeof TEST_USERS[number][]> = {
    STUDENT: [],
    TEACHER: [],
    ADMIN:   [],
  };
  for (const u of TEST_USERS) sections[u.role]?.push(u as never);

  const sectionLabels: Record<string, string> = {
    STUDENT: "ALUMNOS (10)",
    TEACHER: "PROFESORES (3)",
    ADMIN:   "ADMINS (2)",
  };

  for (const [role, users] of Object.entries(sections)) {
    lines.push(`── ${sectionLabels[role]} ${"─".repeat(40 - sectionLabels[role].length)}`);
    lines.push("");

    for (const userData of users) {
      const hashed = await bcrypt.hash(userData.password, 10);

      const instrumentId =
        userData.instrument ? (instrumentMap.get(userData.instrument) ?? null) : null;

      await prisma.user.upsert({
        where: { email: userData.email },
        update: {},
        create: {
          name: userData.name,
          email: userData.email,
          password: hashed,
          role: userData.role as "STUDENT" | "TEACHER" | "ADMIN",
          instrumentId,
        },
      });

      const instLabel = userData.instrument
        ? `  instrumento : ${userData.instrument}`
        : "";

      lines.push(`  nombre      : ${userData.name}`);
      lines.push(`  email       : ${userData.email}`);
      lines.push(`  contraseña  : ${userData.password}`);
      if (instLabel) lines.push(instLabel);
      lines.push("");
      console.log(`  ✓ ${userData.name} <${userData.email}>`);
    }
  }

  lines.push("═══════════════════════════════════════════════════════");

  const outPath = path.join(process.cwd(), "test-credentials.txt");
  fs.writeFileSync(outPath, lines.join("\n"), "utf-8");

  console.log(`\nCredenciales guardadas en: test-credentials.txt`);
  console.log("(el archivo está en .gitignore — no se subirá al repo)\n");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
