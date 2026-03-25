"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { registerUser, type RegisterState } from "@/app/actions/auth";

const initialState: RegisterState = {};

const INSTRUMENTS = [
  { id: "", label: "Seleccionar más tarde" },
  { id: "piano", label: "🎹 Piano" },
  { id: "guitarra", label: "🎸 Guitarra" },
  { id: "bajo", label: "🎵 Bajo" },
];

export default function RegisterPage() {
  const [state, action, isPending] = useActionState(registerUser, initialState);
  const [instrumentOptions, setInstrumentOptions] = useState(INSTRUMENTS);

  // Cargar los IDs reales de instrumentos desde la DB
  useEffect(() => {
    fetch("/api/instruments")
      .then((r) => r.json())
      .then((data) => {
        if (data?.instruments) {
          const opts = [
            { id: "", label: "Seleccionar más tarde" },
            ...data.instruments.map((i: { id: string; name: string; slug: string }) => ({
              id: i.id,
              label:
                i.slug === "piano" ? `🎹 ${i.name}`
                : i.slug === "guitarra" ? `🎸 ${i.name}`
                : `🎵 ${i.name}`,
            })),
          ];
          setInstrumentOptions(opts);
        }
      })
      .catch(() => {}); // Falla silenciosa, usa el placeholder
  }, []);

  return (
    <div className="w-full max-w-md">
      {/* Logo / título */}
      <div className="text-center mb-8">
        <Link href="/" className="text-2xl font-bold tracking-tight text-white">
          Music Academy
        </Link>
        <p className="text-slate-400 mt-2">Creá tu cuenta</p>
      </div>

      <div className="bg-slate-900/80 border border-slate-700 rounded-2xl p-8 backdrop-blur">
        <form action={action} className="flex flex-col gap-5">
          {/* Error global */}
          {state.error && (
            <div className="bg-red-950/60 border border-red-800 text-red-300 text-sm px-4 py-3 rounded-lg">
              {state.error}
            </div>
          )}

          {/* Nombre */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="text-sm font-medium text-slate-300">
              Nombre completo
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              disabled={isPending}
              className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50"
              placeholder="Juan García"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-medium text-slate-300">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              disabled={isPending}
              className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50"
              placeholder="tu@email.com"
            />
          </div>

          {/* Instrumento */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="instrumentId" className="text-sm font-medium text-slate-300">
              Instrumento principal
            </label>
            <select
              id="instrumentId"
              name="instrumentId"
              disabled={isPending}
              className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50"
            >
              {instrumentOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Contraseña */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-medium text-slate-300">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              disabled={isPending}
              className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50"
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          {/* Confirmar contraseña */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="confirmPassword" className="text-sm font-medium text-slate-300">
              Confirmar contraseña
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              disabled={isPending}
              className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50"
              placeholder="••••••••"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending}
            className="mt-1 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-900 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition-colors shadow-lg shadow-indigo-900/40"
          >
            {isPending ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>
      </div>

      <p className="text-center text-sm text-slate-500 mt-6">
        ¿Ya tenés cuenta?{" "}
        <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-medium">
          Iniciá sesión
        </Link>
      </p>
    </div>
  );
}
