"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginUser, type LoginState } from "@/app/actions/auth";

const initialState: LoginState = {};

export default function LoginPage() {
  const [state, action, isPending] = useActionState(loginUser, initialState);

  return (
    <div className="w-full max-w-md">
      {/* Logo / título */}
      <div className="text-center mb-8">
        <Link href="/" className="text-2xl font-bold tracking-tight text-white">
          Music Academy
        </Link>
        <p className="text-slate-400 mt-2">Ingresá a tu cuenta</p>
      </div>

      <div className="bg-slate-900/80 border border-slate-700 rounded-2xl p-8 backdrop-blur">
        <form action={action} className="flex flex-col gap-5">
          {/* Error global */}
          {state.error && (
            <div className="bg-red-950/60 border border-red-800 text-red-300 text-sm px-4 py-3 rounded-lg">
              {state.error}
            </div>
          )}

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

          {/* Contraseña */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-medium text-slate-300">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
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
            {isPending ? "Ingresando..." : "Iniciar sesión"}
          </button>
        </form>
      </div>

      <p className="text-center text-sm text-slate-500 mt-6">
        ¿No tenés cuenta?{" "}
        <Link href="/register" className="text-indigo-400 hover:text-indigo-300 font-medium">
          Registrate
        </Link>
      </p>
    </div>
  );
}
