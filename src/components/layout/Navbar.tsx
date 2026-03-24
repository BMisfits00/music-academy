"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { can, type Role } from "@/lib/permissions";

interface NavbarProps {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role: string;
  };
}

export default function Navbar({ user }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const role = user.role as Role;

  const initials = user.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : user.email?.[0].toUpperCase() ?? "?";

  function navLinkClass(href: string) {
    const isActive = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
    return isActive
      ? "text-white font-semibold border-b-2 border-indigo-400 pb-0.5 transition-colors"
      : "text-gray-400 hover:text-white hover:border-b-2 hover:border-gray-600 pb-0.5 transition-all";
  }

  return (
    <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50 w-full">
      <div className="w-full px-6 h-16 grid grid-cols-3 items-center">
        {/* Logo — izquierda */}
        <Link href="/dashboard" className="text-lg font-bold tracking-tight hover:text-indigo-400 transition-colors justify-self-start">
          Music Academy
        </Link>

        {/* Nav links — centro */}
        <nav className="hidden md:flex items-center justify-center gap-8 text-sm">
          <Link href="/dashboard" className={navLinkClass("/dashboard")}>
            Inicio
          </Link>
          {can(role, "VIEW_TEACHER_PANEL") && (
            <Link href="/teacher" className={navLinkClass("/teacher")}>
              Alumnos
            </Link>
          )}
          {can(role, "VIEW_ADMIN_PANEL") && (
            <Link href="/admin" className={navLinkClass("/admin")}>
              Admin
            </Link>
          )}
        </nav>

        {/* User menu — derecha */}
        <div className="relative justify-self-end">
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-3 hover:opacity-90 transition-opacity"
          >
            <div className="w-8 h-8 rounded-full bg-indigo-600 hover:bg-indigo-500 transition-colors flex items-center justify-center text-xs font-bold">
              {initials}
            </div>
            <span className="hidden md:block text-sm text-gray-300">{user.name ?? user.email}</span>
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-gray-700">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <p className="text-xs text-gray-400 truncate">{user.email}</p>
                <span className="inline-block mt-1.5 text-xs px-2 py-0.5 bg-indigo-900 text-indigo-300 rounded-full">
                  {role}
                </span>
              </div>
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-red-900/40 hover:text-red-300 transition-colors"
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
