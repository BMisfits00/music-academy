# Music Academy — Documentación del Proyecto

## Visión general

Plataforma web de aprendizaje musical estructurada por niveles para **Piano**, **Guitarra** y **Bajo**. Los alumnos avanzan módulo a módulo completando lecciones teóricas y desafíos. El profesor puede ver el progreso de cada alumno y gestionar el contenido.

Pensado para escalar luego a aplicación móvil (React Native), reutilizando la lógica de negocio.

---

## Stack tecnológico

| Capa | Tecnología | Motivo |
|------|-----------|--------|
| Frontend + Backend | **Next.js 16** (App Router) | Full stack en un solo proyecto, fácil migración futura a React Native |
| Estilos | **Tailwind CSS 4** | Velocidad de desarrollo |
| Base de datos | **PostgreSQL** (Railway) | Relacional, gratuito para empezar, online desde el día 1 |
| ORM | **Prisma 7** | Type-safe, migraciones automáticas |
| Autenticación | **NextAuth v5 beta** | Integración con Prisma, soporte JWT + credentials |
| Deploy (futuro) | **Vercel** (frontend) + Railway (DB) | Plan gratuito suficiente para 50 alumnos |

---

## Estructura del proyecto

```
music-academy/
├── prisma/
│   ├── schema.prisma          # Modelos de base de datos
│   ├── seed.ts                # Datos iniciales (instrumentos, niveles, módulos, lecciones, desafíos)
│   ├── content.ts             # Contenido real: lecciones HTML + desafíos de los 9 módulos
│   └── migrations/            # Historial de migraciones
├── src/
│   ├── app/
│   │   ├── (auth)/            # Login, registro (rutas públicas)
│   │   ├── (dashboard)/       # Área del alumno (protegida)
│   │   │   ├── dashboard/
│   │   │   │   ├── page.tsx              # Selector de instrumentos (pantalla inicio)
│   │   │   │   ├── [instrumentSlug]/     # Mapa de niveles del instrumento elegido
│   │   │   │   ├── module/[moduleId]/    # Vista de módulo con lecciones y desafíos
│   │   │   │   └── calendario/
│   │   │   │       └── page.tsx          # Calendario mensual (alumnos/profesores)
│   │   │   └── layout.tsx
│   │   ├── (teacher)/         # Panel del profesor (protegida)
│   │   │   ├── teacher/
│   │   │   │   ├── page.tsx              # Stats globales + tabla de alumnos
│   │   │   │   └── student/[userId]/     # Detalle de progreso de un alumno
│   │   │   └── layout.tsx
│   │   ├── (admin)/           # Panel de admin (protegida)
│   │   │   ├── admin/
│   │   │   │   ├── page.tsx              # Overview: stats de conexión, profesores, alumnos, filtros
│   │   │   │   ├── profesores/
│   │   │   │   │   └── page.tsx          # Lista de profesores con gestión de instrumentos y alumnos
│   │   │   │   ├── usuarios/
│   │   │   │   │   └── page.tsx          # Gestión de usuarios (UserTable + CreateUserForm)
│   │   │   │   └── calendario/
│   │   │   │       └── page.tsx          # Calendario mensual (próximas funciones)
│   │   │   └── layout.tsx
│   │   ├── actions/
│   │   │   ├── auth.ts        # Server actions: registerUser, loginUser
│   │   │   ├── user.ts        # Server actions: selectInstrument
│   │   │   ├── progress.ts    # Server actions: submitChallenges
│   │   │   └── admin.ts       # Server actions: CRUD usuarios + asignaciones de profesores
│   │   ├── api/auth/          # NextAuth route handler
│   │   ├── api/instruments/   # GET /api/instruments
│   │   ├── layout.tsx         # Layout raíz
│   │   └── page.tsx           # Landing page
│   ├── components/
│   │   ├── layout/            # Navbar, Sidebar
│   │   ├── dashboard/         # InstrumentSelector, LevelCard
│   │   ├── challenges/        # LessonContent, ChallengeSet
│   │   ├── teacher/           # StudentTable, StudentProgressDetail
│   │   ├── calendar/          # CalendarView (navegación mensual, compartido)
│   │   └── admin/             # UserTable, CreateUserForm, AdminOverviewPanel,
│   │                          # TeacherTable, TeacherManageModal
│   ├── lib/
│   │   ├── prisma.ts          # Cliente Prisma singleton (con adapter pg)
│   │   ├── auth.ts            # Configuración NextAuth
│   │   ├── permissions.ts     # Sistema de roles y permisos
│   │   └── scoring.ts         # Lógica de puntaje y clasificación
│   └── types/
│       └── index.ts           # Tipos TypeScript globales
├── src/proxy.ts               # Protección de rutas por rol (Next.js 16: proxy.ts)
├── .env                       # Variables de entorno (no commitear)
└── PROYECTO.md                # Este archivo
```

---

## Modelos de base de datos

```
User              → Alumnos, profesores, admins. Tiene rol y puede tener instrumento principal.
Instrument        → Piano, Guitarra, Bajo.
Level             → 3 niveles por instrumento (Principiante, Intermedio, Avanzado).
Module            → 3 módulos por nivel. Unidad mínima de aprendizaje.
Lesson            → Contenido teórico de un módulo (HTML/Markdown).
Resource          → Archivos adjuntos a una lección (video, PDF, imagen, audio, link).
Challenge         → Preguntas/ejercicios de un módulo (opción múltiple, V/F, práctico).
Progress          → Registro de avance de un alumno en un módulo (puntaje, completado).
ChallengeAnswer   → Respuestas individuales del alumno a cada desafío.
TeacherInstrument → Relación many-to-many: instrumentos que enseña un profesor.
TeacherStudent    → Relación many-to-many: alumnos asignados a un profesor (asignación explícita).
Account/Session   → Tablas de NextAuth para autenticación.
```

> **Nota sobre profesores:** un profesor puede enseñar múltiples instrumentos y tener múltiples alumnos asignados. La asignación la hace un ADMIN o SUPER_ADMIN desde el panel. No se infiere por instrumento.

---

## Sistema de puntaje

La clasificación del resultado de cada módulo se define en `src/lib/scoring.ts`:

| Rango | Color | Clasificación | Implicancia |
|-------|-------|--------------|-------------|
| ≥ 70% | 🟢 Verde | Aprobado especial | Rinde final corto |
| 60–69% | 🟡 Amarillo | Aprobado | Rinde final largo |
| < 60% | 🔴 Rojo | No aprobado | No desbloquea el siguiente módulo |

Un módulo se considera **completado** (desbloquea el siguiente) con score ≥ 60%.
La función `getGrade(score)` devuelve el color, label y sublabel correspondientes.

---

## Roles y permisos

Ver `src/lib/permissions.ts` para el detalle completo.

| Acción | STUDENT | TEACHER | ADMIN | SUPER_ADMIN |
|--------|:-------:|:-------:|:-----:|:-----------:|
| Ver lecciones y módulos | ✅ | ✅ | ✅ | ✅ |
| Completar desafíos | ✅ | ✅ | ✅ | ✅ |
| Ver propio progreso | ✅ | ✅ | ✅ | ✅ |
| Ver progreso de todos los alumnos | ❌ | ✅ | ✅ | ✅ |
| Crear/editar lecciones y desafíos | ❌ | ✅ | ✅ | ✅ |
| Gestionar usuarios | ❌ | ❌ | ✅ | ✅ |
| Crear/editar instrumentos y niveles | ❌ | ❌ | ✅ | ✅ |
| Eliminar contenido | ❌ | ❌ | ❌ | ✅ |
| Gestionar admins | ❌ | ❌ | ❌ | ✅ |

---

## Estructura de contenido (módulos)

### Nivel 1 — Principiante (compartido entre los 3 instrumentos)
1. **Fundamentos de Notación** — Pentagrama, claves, figuras rítmicas, compás
2. **Lectura Rítmica** — Pulso, acento, tempo, subdivisión binaria
3. **Lectura Melódica Básica** — Notas, alteraciones, tonalidad de Do Mayor

### Nivel 2 — Intermedio
1. **Intervalos y Escalas** — Intervalos, construcción de la escala mayor, círculo de quintas
2. **Ritmos y Compases Compuestos** — 6/8, 9/8, ligaduras, síncopas
3. **Acordes y Triadas** — Triadas Mayor/Menor/Disminuida/Aumentada, cifrado americano

### Nivel 3 — Avanzado
1. **Armonía Funcional** — Grados, progresiones (II-V-I), acordes de 4 sonidos
2. **Modos y Escalas Avanzadas** — Modos, pentatónica, blues
3. **Composición y Forma Musical** — Forma de canción, frase musical, análisis armónico

> Los módulos 1-3 son transversales (misma teoría para Piano, Guitarra y Bajo).
> A partir del Nivel 2 se agregan ejemplos y ejercicios específicos por instrumento.

---

## Fuente del contenido

- **Teoría base:** materiales del instituto (usados como referencia de estructura y temas).
  El texto de las lecciones se redacta desde cero para evitar problemas de derechos de autor.
- **Guitarra:** ejercicios propios (triadas, escalas, posiciones) — se incorporan desde Nivel 2.
- **Audios (audioperceptiva):** reservado para una segunda etapa de la aplicación.

---

## Base de datos

- **Proveedor:** Railway (PostgreSQL)
- **Host público:** `centerbeam.proxy.rlwy.net:30859`
- **Host interno (para deploy):** `postgres.railway.internal:5432`
- **Tablas creadas:** 14 (se agregaron `TeacherInstrument` y `TeacherStudent`)
- **Datos iniciales cargados:** 3 instrumentos, 9 niveles, 27 módulos, 54 lecciones, 177 desafíos

---

## Procedimiento de setup (resumen)

```bash
# 1. Clonar e instalar
npm install

# 2. Configurar .env con DATABASE_URL de Railway

# 3. Generar cliente Prisma
npm run db:generate

# 4. Aplicar migraciones
npm run db:migrate

# 5. Cargar datos iniciales
npm run db:seed

# 6. Correr en desarrollo
npm run dev
```

---

## Progreso del desarrollo

### Fase 1 — Setup (completado ✅)
- [x] Proyecto Next.js con TypeScript + Tailwind
- [x] Prisma 7 con adapter pg
- [x] Base de datos en Railway
- [x] Schema completo (12 modelos)
- [x] NextAuth v5 configurado
- [x] Landing page
- [x] Roles: STUDENT, TEACHER, ADMIN, SUPER_ADMIN
- [x] Sistema de permisos granulares (src/lib/permissions.ts)
- [x] Proxy de protección de rutas (src/proxy.ts) — Next.js 16 renombró middleware → proxy

### Fase 2 — MVP (completado ✅)
- [x] Página de login (`/login`)
- [x] Página de registro (`/register`) con selector de instrumento
- [x] Server actions de auth con bcrypt (`src/app/actions/auth.ts`)
- [x] API endpoint de instrumentos (`/api/instruments`)
- [x] Dashboard del alumno: pantalla inicio = selector de instrumentos (`/dashboard`)
- [x] Vista de niveles por instrumento (`/dashboard/[instrumentSlug]`)
- [x] Vista de módulo con lecciones (`/dashboard/module/[moduleId]`)
- [x] Sistema de desafíos: opción múltiple, V/F, práctico con auto-evaluación
- [x] Sistema de puntaje y desbloqueo (≥60% para completar, ≥70% Aprobado especial)
- [x] Panel del profesor (`/teacher`) con stats globales y módulos con dificultades
- [x] Tabla de alumnos con filtro por instrumento y búsqueda
- [x] Detalle de alumno (`/teacher/student/[userId]`) con progreso módulo a módulo
- [x] Panel de admin (`/admin`) con gestión de usuarios, cambio de roles y creación de cuentas
- [x] Contenido real cargado: 54 lecciones y 177 desafíos en los 9 módulos (`prisma/content.ts`)
- [x] Panel admin enriquecido: stats dinámicas, overview de profesores y alumnos con filtros por profesor
- [x] Modelo de profesores ampliado: múltiples instrumentos y alumnos asignados (many-to-many via `TeacherInstrument` / `TeacherStudent`)
- [x] Modal de gestión de profesor: asignar instrumentos y alumnos desde el panel admin
- [x] Módulo "Profesores" en sidebar (`/admin/profesores`) con tabla, filtros y gestión inline
- [x] Panel admin reestructurado: home con stats de usuarios conectados, sin gestión de cursos
- [x] Módulo "Admin" (`/admin/usuarios`) para gestión de usuarios (roles, creación, edición)
- [x] Módulo "Calendario" para todos los roles (`/admin/calendario`, `/dashboard/calendario`)
- [x] Sidebar adaptado por rol: navegación diferenciada admin vs alumno/profesor, ítem Inicio con match exacto
- [x] TeacherManageModal: pestaña Alumnos deshabilitada si el profesor no tiene instrumentos asignados
- [x] TeacherManageModal: filtro de alumnos disponibles por instrumento del profesor
- [x] Navegación con botón "← Regresar" en todas las pantallas interiores
- [x] Proxy redirige usuarios autenticados de `/` a `/dashboard`
- [x] Layouts sin max-width: contenido ocupa todo el ancho disponible

### Fase 3 — Enriquecimiento
- [ ] Editor de contenido para el profesor
- [ ] Diagramas interactivos (acordes, teclado)
- [ ] Estadísticas de errores frecuentes
- [ ] Gamificación (racha, logros)

### Fase 4 — Segunda etapa
- [ ] Ejercicios de audioperceptiva con audio
- [ ] App móvil (React Native / Expo EAS Build)
- [ ] Notificaciones

---

## Notas técnicas

- **Prisma 7 + Node 24:** la instalación requiere `--ignore-scripts` y usar el binario directo
  (`node node_modules/prisma/build/index.js`) porque el script wrapper usa Node 22 del PATH.
- **Seed:** usa `tsx` para ejecutar TypeScript directamente. Requiere `import "dotenv/config"`.
- **PrismaClient:** requiere `PrismaPg` adapter (Prisma 7 abandonó el engine binario por defecto).
- **Variables de entorno Railway:** la URL interna solo funciona en deploy. Para desarrollo local
  usar la URL pública (`DATABASE_PUBLIC_URL`).
- **Next.js 16:** renombró `middleware.ts` a `proxy.ts`. El archivo de protección de rutas
  es `src/proxy.ts` (no `src/middleware.ts`).
- **Prisma generate:** correr `npm run db:generate` después de cada migración para actualizar
  los tipos TypeScript del cliente.
- **Navegación de instrumentos:** `/dashboard` siempre muestra el selector. Al elegir un
  instrumento, `selectInstrument` guarda la preferencia en DB y redirige a `/dashboard/[slug]`.
  El instrumento guardado en DB se usa solo para el panel del profesor (ver instrumento del alumno).
- **Layouts sin max-width:** todos los layouts usan `w-full px-6` para cubrir todo el ancho
  de pantalla. El Navbar también es full-width. La página de módulo usa `max-w-3xl` localmente
  para mejorar la legibilidad del texto largo.
- **Server actions y redirect:** `redirect()` de `next/navigation` dentro de un server action
  lanza un error especial que Next.js intercepta para navegar en el cliente. No retorna un valor.
