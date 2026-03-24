"use client";

import { useState, useTransition } from "react";
import { updateUserRole, deleteUser } from "@/app/actions/admin";
import type { Role } from "@/lib/permissions";

const ROLE_LABELS: Record<string, string> = {
  STUDENT: "Alumno",
  TEACHER: "Profesor",
  ADMIN: "Admin",
  SUPER_ADMIN: "Super Admin",
};

const ROLE_COLORS: Record<string, string> = {
  STUDENT: "bg-gray-800 text-gray-300",
  TEACHER: "bg-indigo-900 text-indigo-300",
  ADMIN: "bg-amber-900 text-amber-300",
  SUPER_ADMIN: "bg-red-900 text-red-300",
};

const INSTRUMENT_ICONS: Record<string, string> = {
  piano: "🎹",
  guitarra: "🎸",
  bajo: "🎵",
};

interface UserRow {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  instrument: { name: string; slug: string } | null;
  createdAt: Date;
  _count: { progress: number };
}

export default function UserTable({
  users,
  callerRole,
  callerId,
}: {
  users: UserRow[];
  callerRole: Role;
  callerId: string;
}) {
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [isPending, startTransition] = useTransition();
  const [actionError, setActionError] = useState<string | null>(null);

  const isSuperAdmin = callerRole === "SUPER_ADMIN";

  const filtered = users.filter((u) => {
    const matchesSearch =
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase());
    const matchesRole = filterRole === "all" || u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  function handleRoleChange(userId: string, newRole: Role) {
    setActionError(null);
    startTransition(async () => {
      const result = await updateUserRole(userId, newRole);
      if (result.error) setActionError(result.error);
    });
  }

  function handleDelete(userId: string, userName: string | null) {
    if (!confirm(`¿Eliminar al usuario "${userName ?? "Sin nombre"}"? Esta acción no se puede deshacer.`)) return;
    setActionError(null);
    startTransition(async () => {
      const result = await deleteUser(userId);
      if (result.error) setActionError(result.error);
    });
  }

  return (
    <div>
      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          type="text"
          placeholder="Buscar por nombre o email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">Todos los roles</option>
          {Object.entries(ROLE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      {actionError && (
        <div className="mb-4 px-4 py-3 bg-red-900/40 border border-red-700 rounded-lg text-sm text-red-300">
          {actionError}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-500 bg-gray-900 border border-gray-800 rounded-xl">
          {users.length === 0 ? "No hay usuarios registrados." : "No hay resultados para esa búsqueda."}
        </div>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400 text-xs uppercase tracking-wider">
                <th className="text-left px-5 py-3 font-medium">Usuario</th>
                <th className="text-left px-5 py-3 font-medium">Rol</th>
                <th className="text-left px-5 py-3 font-medium hidden md:table-cell">Instrumento</th>
                <th className="text-left px-5 py-3 font-medium hidden md:table-cell">Módulos</th>
                <th className="text-left px-5 py-3 font-medium hidden lg:table-cell">Registrado</th>
                {isSuperAdmin && <th className="px-5 py-3" />}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filtered.map((user) => {
                const isSelf = user.id === callerId;
                return (
                  <tr
                    key={user.id}
                    className={`hover:bg-gray-800/50 transition-colors ${isPending ? "opacity-60" : ""}`}
                  >
                    {/* Usuario */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {user.name?.[0]?.toUpperCase() ?? "?"}
                        </div>
                        <div>
                          <p className="font-medium text-gray-100">
                            {user.name ?? "Sin nombre"}
                            {isSelf && (
                              <span className="ml-2 text-xs text-gray-500">(vos)</span>
                            )}
                          </p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Rol */}
                    <td className="px-5 py-4">
                      {isSuperAdmin && !isSelf ? (
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value as Role)}
                          disabled={isPending}
                          className="bg-gray-800 border border-gray-700 rounded-lg px-2 py-1 text-xs text-gray-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
                        >
                          {Object.entries(ROLE_LABELS).map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                          ))}
                        </select>
                      ) : (
                        <span className={`text-xs px-2.5 py-0.5 rounded-full ${ROLE_COLORS[user.role] ?? "bg-gray-800 text-gray-300"}`}>
                          {ROLE_LABELS[user.role] ?? user.role}
                        </span>
                      )}
                    </td>

                    {/* Instrumento */}
                    <td className="px-5 py-4 hidden md:table-cell text-gray-300 text-sm">
                      {user.instrument ? (
                        <span className="flex items-center gap-1.5">
                          {INSTRUMENT_ICONS[user.instrument.slug]}
                          {user.instrument.name}
                        </span>
                      ) : (
                        <span className="text-gray-600 text-xs">Sin asignar</span>
                      )}
                    </td>

                    {/* Módulos */}
                    <td className="px-5 py-4 hidden md:table-cell text-gray-400 text-sm">
                      {user._count.progress}
                    </td>

                    {/* Fecha */}
                    <td className="px-5 py-4 hidden lg:table-cell text-gray-500 text-xs">
                      {new Date(user.createdAt).toLocaleDateString("es-AR", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    {/* Eliminar */}
                    {isSuperAdmin && (
                      <td className="px-5 py-4 text-right">
                        {!isSelf && (
                          <button
                            onClick={() => handleDelete(user.id, user.name)}
                            disabled={isPending}
                            className="text-xs px-3 py-1.5 bg-red-900/30 hover:bg-red-900/60 border border-red-800 text-red-400 hover:text-red-300 rounded-lg transition-colors disabled:opacity-50"
                          >
                            Eliminar
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-xs text-gray-600 mt-3 text-right">
        {filtered.length} de {users.length} usuarios
      </p>
    </div>
  );
}
