"use client";

import { useState, useTransition, useRef } from "react";
import { createUser } from "@/app/actions/admin";
import type { Role } from "@/lib/permissions";

const ROLE_OPTIONS: { value: Role; label: string }[] = [
  { value: "STUDENT", label: "Alumno" },
  { value: "TEACHER", label: "Profesor" },
  { value: "ADMIN", label: "Admin" },
  { value: "SUPER_ADMIN", label: "Super Admin" },
];

interface Instrument {
  id: string;
  name: string;
  slug: string;
}

export default function CreateUserForm({
  instruments,
  callerRole,
}: {
  instruments: Instrument[];
  callerRole: Role;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const isSuperAdmin = callerRole === "SUPER_ADMIN";

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    const data = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await createUser(data);
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(true);
        formRef.current?.reset();
        setTimeout(() => {
          setOpen(false);
          setSuccess(false);
        }, 1500);
      }
    });
  }

  return (
    <div>
      <button
        onClick={() => { setOpen(!open); setError(null); setSuccess(false); }}
        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors"
      >
        <span className="text-base leading-none">+</span>
        Crear usuario
      </button>

      {open && (
        <div className="mt-4 bg-gray-900 border border-gray-700 rounded-xl p-6">
          <h3 className="font-semibold mb-4">Nuevo usuario</h3>

          <form ref={formRef} onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Nombre</label>
              <input
                name="name"
                type="text"
                placeholder="Nombre completo"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Email <span className="text-red-400">*</span></label>
              <input
                name="email"
                type="email"
                required
                placeholder="usuario@email.com"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Contraseña <span className="text-red-400">*</span></label>
              <input
                name="password"
                type="password"
                required
                placeholder="Mínimo 6 caracteres"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Rol</label>
              <select
                name="role"
                defaultValue="STUDENT"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {ROLE_OPTIONS.filter((r) =>
                  isSuperAdmin ? true : r.value === "STUDENT" || r.value === "TEACHER"
                ).map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs text-gray-400 mb-1">Instrumento (opcional)</label>
              <select
                name="instrument"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Sin asignar</option>
                {instruments.filter((i) => i.slug !== "teoria").map((inst) => (
                  <option key={inst.slug} value={inst.slug}>{inst.name}</option>
                ))}
              </select>
            </div>

            {error && (
              <div className="sm:col-span-2 px-3 py-2 bg-red-900/40 border border-red-700 rounded-lg text-sm text-red-300">
                {error}
              </div>
            )}

            {success && (
              <div className="sm:col-span-2 px-3 py-2 bg-emerald-900/40 border border-emerald-700 rounded-lg text-sm text-emerald-300">
                Usuario creado exitosamente.
              </div>
            )}

            <div className="sm:col-span-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="px-4 py-2 text-sm text-gray-400 hover:text-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
              >
                {isPending ? "Creando..." : "Crear usuario"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
