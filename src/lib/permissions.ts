// ─── Definición de roles ───────────────────────────────────────────────────
export type Role = "STUDENT" | "TEACHER" | "ADMIN" | "SUPER_ADMIN";

// Jerarquía numérica: mayor número = más permisos
const ROLE_LEVEL: Record<Role, number> = {
  STUDENT: 1,
  TEACHER: 2,
  ADMIN: 3,
  SUPER_ADMIN: 4,
};

// Devuelve true si el rol del usuario es >= al rol requerido
export function hasMinRole(userRole: Role, requiredRole: Role): boolean {
  return ROLE_LEVEL[userRole] >= ROLE_LEVEL[requiredRole];
}

// ─── Permisos granulares ───────────────────────────────────────────────────
export const PERMISSIONS = {
  // Contenido — lectura
  VIEW_LESSONS: ["STUDENT", "TEACHER", "ADMIN", "SUPER_ADMIN"],
  VIEW_MODULES: ["STUDENT", "TEACHER", "ADMIN", "SUPER_ADMIN"],

  // Contenido — escritura
  CREATE_LESSON: ["TEACHER", "ADMIN", "SUPER_ADMIN"],
  EDIT_LESSON: ["TEACHER", "ADMIN", "SUPER_ADMIN"],
  DELETE_LESSON: ["SUPER_ADMIN"],

  CREATE_CHALLENGE: ["TEACHER", "ADMIN", "SUPER_ADMIN"],
  EDIT_CHALLENGE: ["TEACHER", "ADMIN", "SUPER_ADMIN"],
  DELETE_CHALLENGE: ["SUPER_ADMIN"],

  CREATE_MODULE: ["ADMIN", "SUPER_ADMIN"],
  EDIT_MODULE: ["ADMIN", "SUPER_ADMIN"],
  DELETE_MODULE: ["SUPER_ADMIN"],

  CREATE_LEVEL: ["ADMIN", "SUPER_ADMIN"],
  EDIT_LEVEL: ["ADMIN", "SUPER_ADMIN"],
  DELETE_LEVEL: ["SUPER_ADMIN"],

  CREATE_INSTRUMENT: ["ADMIN", "SUPER_ADMIN"],
  EDIT_INSTRUMENT: ["ADMIN", "SUPER_ADMIN"],
  DELETE_INSTRUMENT: ["SUPER_ADMIN"],

  // Desafíos
  SUBMIT_CHALLENGE: ["STUDENT", "TEACHER", "ADMIN", "SUPER_ADMIN"],

  // Progreso
  VIEW_OWN_PROGRESS: ["STUDENT", "TEACHER", "ADMIN", "SUPER_ADMIN"],
  VIEW_ALL_PROGRESS: ["TEACHER", "ADMIN", "SUPER_ADMIN"],
  VIEW_STUDENT_DETAIL: ["TEACHER", "ADMIN", "SUPER_ADMIN"],

  // Usuarios
  VIEW_ALL_USERS: ["ADMIN", "SUPER_ADMIN"],
  CREATE_STUDENT: ["ADMIN", "SUPER_ADMIN"],
  CREATE_TEACHER: ["ADMIN", "SUPER_ADMIN"],
  EDIT_USER: ["ADMIN", "SUPER_ADMIN"],
  DELETE_USER: ["SUPER_ADMIN"],
  CHANGE_USER_ROLE: ["SUPER_ADMIN"],

  // Admin
  VIEW_ADMIN_PANEL: ["ADMIN", "SUPER_ADMIN"],
  VIEW_TEACHER_PANEL: ["TEACHER", "ADMIN", "SUPER_ADMIN"],
  VIEW_SUPER_ADMIN_PANEL: ["SUPER_ADMIN"],
} as const;

export type Permission = keyof typeof PERMISSIONS;

// Devuelve true si el rol tiene el permiso indicado
export function can(userRole: Role, permission: Permission): boolean {
  return (PERMISSIONS[permission] as readonly string[]).includes(userRole);
}

// ─── Rutas protegidas ──────────────────────────────────────────────────────
// Define qué rol mínimo se requiere para acceder a cada prefijo de ruta
export const PROTECTED_ROUTES: { prefix: string; minRole: Role }[] = [
  { prefix: "/superadmin", minRole: "SUPER_ADMIN" },
  { prefix: "/admin", minRole: "ADMIN" },
  { prefix: "/teacher", minRole: "TEACHER" },
  { prefix: "/dashboard", minRole: "STUDENT" },
  { prefix: "/instruments", minRole: "STUDENT" },
];

// Rutas que solo pueden ver usuarios NO autenticados (login, register)
export const AUTH_ROUTES = ["/login", "/register"];

// Rutas completamente públicas
export const PUBLIC_ROUTES = ["/"];
