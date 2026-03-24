"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { can, type Role } from "@/lib/permissions";

interface SidebarProps {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role: string;
  };
}

export default function Sidebar({ user }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const role = user.role as Role;

  const initials = user.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : user.email?.[0].toUpperCase() ?? "?";

  const navItems = [
    {
      href: "/dashboard",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      label: "Inicio",
    },
    ...(can(role, "VIEW_TEACHER_PANEL")
      ? [
          {
            href: "/teacher",
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            ),
            label: "Alumnos",
          },
        ]
      : []),
    ...(can(role, "VIEW_ADMIN_PANEL")
      ? [
          {
            href: "/admin",
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            ),
            label: "Admin",
          },
        ]
      : []),
  ];

  function isActive(href: string) {
    return pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
  }

  return (
    <aside
      className={`relative flex flex-col h-screen sticky top-0 bg-gray-900 border-r border-gray-800 flex-shrink-0 transition-all duration-300 ease-in-out ${
        collapsed ? "w-16" : "w-60"
      }`}
    >
      {/* Header */}
      <div className="flex items-center h-16 px-3 border-b border-gray-800 gap-2 overflow-hidden">
        {!collapsed && (
          <Link
            href="/dashboard"
            className="flex-1 text-base font-bold tracking-tight text-white hover:text-indigo-400 transition-colors truncate"
          >
            Music Academy
          </Link>
        )}
        <button
          type="button"
          onClick={() => setCollapsed((v) => !v)}
          title={collapsed ? "Expandir menú" : "Colapsar menú"}
          className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:text-white hover:bg-gray-800 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`w-4 h-4 transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 flex flex-col gap-1 overflow-hidden">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={`flex items-center gap-3 px-2.5 py-2.5 rounded-lg text-sm font-medium transition-all overflow-hidden ${
                collapsed ? "justify-center" : ""
              } ${
                active
                  ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white border border-transparent"
              }`}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {!collapsed && (
                <span className="truncate whitespace-nowrap">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="border-t border-gray-800 p-2 flex flex-col gap-1">
        <div
          className={`flex items-center gap-3 px-2.5 py-2 overflow-hidden ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white">
            {initials}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-200 truncate">
                {user.name ?? user.email}
              </p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/" })}
          title={collapsed ? "Cerrar sesión" : undefined}
          className={`flex items-center gap-3 px-2.5 py-2.5 rounded-lg text-sm text-gray-400 hover:bg-red-900/30 hover:text-red-300 transition-colors overflow-hidden ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          {!collapsed && <span className="whitespace-nowrap">Cerrar sesión</span>}
        </button>
      </div>
    </aside>
  );
}
