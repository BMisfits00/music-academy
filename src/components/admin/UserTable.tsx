"use client";

import { useState, useTransition } from "react";
import { updateUserRole, updateUser, deleteUser } from "@/app/actions/admin";
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
  teoria: "📖",
};

interface UserRow {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  instrument: { id: string; name: string; slug: string } | null;
  createdAt: Date;
  _count: { progress: number };
}

interface InstrumentOption {
  id: string;
  name: string;
  slug: string;
}

interface EditState {
  name: string;
  email: string;
  instrumentId: string;
}

function EditModal({
  user,
  instruments,
  onClose,
  onSave,
  isPending,
  error,
}: {
  user: UserRow;
  instruments: InstrumentOption[];
  onClose: () => void;
  onSave: (data: EditState) => void;
  isPending: boolean;
  error: string | null;
}) {
  const [form, setForm] = useState<EditState>({
    name: user.name ?? "",
    email: user.email ?? "",
    instrumentId: user.instrument?.id ?? "",
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <h2 className="text-base font-semibold">
            Editar usuario
          </h2>
          <button
            type="button"
            onClick={onClose}
            title="Cerrar"
            aria-label="Cerrar modal"
            className="text-gray-500 hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Avatar + identity */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-800/60">
          <div className="w-10 h-10 rounded-full bg-indigo-700 flex items-center justify-center text-sm font-bold flex-shrink-0">
            {user.name?.[0]?.toUpperCase() ?? "?"}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-200">{user.name ?? "Sin nombre"}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
        </div>

        {/* Form */}
        <div className="px-6 py-5 flex flex-col gap-4">
          {error && (
            <div className="px-4 py-3 bg-red-900/40 border border-red-700 rounded-lg text-sm text-red-300">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              Nombre
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Nombre completo"
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              Email
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="email@ejemplo.com"
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              Instrumento principal
            </label>
            <select
              value={form.instrumentId}
              onChange={(e) => setForm((f) => ({ ...f, instrumentId: e.target.value }))}
              title="Instrumento principal"
              aria-label="Instrumento principal"
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Sin asignar</option>
              {instruments.filter((i) => i.slug !== "teoria").map((inst) => (
                <option key={inst.id} value={inst.id}>
                  {INSTRUMENT_ICONS[inst.slug] ?? "🎵"} {inst.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-800">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="px-4 py-2 text-sm text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => onSave(form)}
            disabled={isPending || !form.email}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors disabled:opacity-50"
          >
            {isPending ? "Guardando…" : "Guardar cambios"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function UserTable({
  users,
  instruments,
  callerRole,
  callerId,
}: {
  users: UserRow[];
  instruments: InstrumentOption[];
  callerRole: Role;
  callerId: string;
}) {
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [isPending, startTransition] = useTransition();
  const [actionError, setActionError] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<UserRow | null>(null);
  const [editError, setEditError] = useState<string | null>(null);

  const canEdit = callerRole === "ADMIN" || callerRole === "SUPER_ADMIN";
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

  function handleEditSave(data: EditState) {
    if (!editingUser) return;
    setEditError(null);
    startTransition(async () => {
      const result = await updateUser(editingUser.id, {
        name: data.name,
        email: data.email,
        instrumentId: data.instrumentId || null,
      });
      if (result.error) {
        setEditError(result.error);
      } else {
        setEditingUser(null);
      }
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
                <th className="px-5 py-3" scope="col"><span className="sr-only">Acciones</span></th>
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

                    {/* Acciones */}
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {canEdit && !isSelf && (
                          <button
                            type="button"
                            onClick={() => { setEditingUser(user); setEditError(null); }}
                            disabled={isPending}
                            className="text-xs px-3 py-1.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 hover:text-white rounded-lg transition-colors disabled:opacity-50"
                          >
                            Editar
                          </button>
                        )}
                        {isSuperAdmin && !isSelf && (
                          <button
                            type="button"
                            onClick={() => handleDelete(user.id, user.name)}
                            disabled={isPending}
                            className="text-xs px-3 py-1.5 bg-red-900/30 hover:bg-red-900/60 border border-red-800 text-red-400 hover:text-red-300 rounded-lg transition-colors disabled:opacity-50"
                          >
                            Eliminar
                          </button>
                        )}
                      </div>
                    </td>
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

      {/* Modal de edición */}
      {editingUser && (
        <EditModal
          user={editingUser}
          instruments={instruments}
          onClose={() => setEditingUser(null)}
          onSave={handleEditSave}
          isPending={isPending}
          error={editError}
        />
      )}
    </div>
  );
}
