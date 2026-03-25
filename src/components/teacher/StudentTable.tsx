"use client";

import { useState } from "react";
import Link from "next/link";
import { getGrade } from "@/lib/scoring";

const INSTRUMENT_ICONS: Record<string, string> = {
  piano: "🎹",
  guitarra: "🎸",
  bajo: "🎵",
};

interface StudentRow {
  id: string;
  name: string | null;
  email: string | null;
  instrument: { id: string; name: string; slug: string } | null;
  completedModules: number;
  totalModules: number;
  bestScore: number | null;
  lastActivity: Date | null;
  createdAt: Date;
}

function formatDate(date: Date | null): string {
  if (!date) return "—";
  const now = Date.now();
  return new Intl.RelativeTimeFormat("es", { numeric: "auto" }).format(
    Math.round((new Date(date).getTime() - now) / (1000 * 60 * 60 * 24)),
    "day"
  );
}

export default function StudentTable({ students }: { students: StudentRow[] }) {
  const [search, setSearch] = useState("");
  const [filterInstrument, setFilterInstrument] = useState("all");

  const instruments = Array.from(
    new Map(
      students
        .filter((s) => s.instrument)
        .map((s) => [s.instrument!.slug, s.instrument!])
    ).values()
  );

  const filtered = students.filter((s) => {
    const matchesSearch =
      s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.email?.toLowerCase().includes(search.toLowerCase());
    const matchesInstrument =
      filterInstrument === "all" || s.instrument?.slug === filterInstrument;
    return matchesSearch && matchesInstrument;
  });

  return (
    <div>
      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          type="text"
          placeholder="Buscar por nombre o email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-slate-800/60 border border-slate-700/50 rounded-lg px-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <select
          aria-label="Filtrar por instrumento"
          value={filterInstrument}
          onChange={(e) => setFilterInstrument(e.target.value)}
          className="bg-slate-800/60 border border-slate-700/50 rounded-lg px-4 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">Todos los instrumentos</option>
          {instruments.map((inst) => (
            <option key={inst.slug} value={inst.slug}>
              {INSTRUMENT_ICONS[inst.slug]} {inst.name}
            </option>
          ))}
        </select>
      </div>

      {/* Tabla */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-500 bg-slate-900/50 border border-slate-800 rounded-xl">
          {students.length === 0 ? "No hay alumnos registrados aún." : "No hay resultados para esa búsqueda."}
        </div>
      ) : (
        <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-800/50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="text-left px-5 py-3 font-medium">Alumno</th>
                <th className="text-left px-5 py-3 font-medium">Instrumento</th>
                <th className="text-left px-5 py-3 font-medium">Progreso</th>
                <th className="text-left px-5 py-3 font-medium">Mejor puntaje</th>
                <th className="text-left px-5 py-3 font-medium">Última actividad</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.map((student) => {
                const grade = student.bestScore !== null ? getGrade(student.bestScore) : null;
                const progressPct =
                  student.totalModules > 0
                    ? Math.round((student.completedModules / student.totalModules) * 100)
                    : 0;

                return (
                  <tr key={student.id} className="hover:bg-slate-800/40 transition-colors">
                    {/* Alumno */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {student.name?.[0]?.toUpperCase() ?? "?"}
                        </div>
                        <div>
                          <p className="font-medium text-slate-200">{student.name ?? "Sin nombre"}</p>
                          <p className="text-xs text-slate-500">{student.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Instrumento */}
                    <td className="px-5 py-4">
                      {student.instrument ? (
                        <span className="flex items-center gap-1.5 text-slate-300 text-xs">
                          {INSTRUMENT_ICONS[student.instrument.slug]}
                          {student.instrument.name}
                        </span>
                      ) : (
                        <span className="text-slate-600 text-xs">Sin asignar</span>
                      )}
                    </td>

                    {/* Progreso */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 min-w-[120px]">
                        <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-500 rounded-full"
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-400 tabular-nums w-8 text-right">
                          {progressPct}%
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">
                        {student.completedModules}/{student.totalModules} módulos
                      </p>
                    </td>

                    {/* Mejor puntaje */}
                    <td className="px-5 py-4">
                      {grade ? (
                        <span className={`text-sm font-semibold ${grade.color.text}`}>
                          {student.bestScore}%
                          <span className="ml-1.5 text-xs font-normal text-slate-500">
                            {grade.label}
                          </span>
                        </span>
                      ) : (
                        <span className="text-slate-600 text-xs">Sin actividad</span>
                      )}
                    </td>

                    {/* Última actividad */}
                    <td className="px-5 py-4 text-slate-500 text-xs">
                      {formatDate(student.lastActivity)}
                    </td>

                    {/* Acción */}
                    <td className="px-5 py-4 text-right">
                      <Link
                        href={`/teacher/student/${student.id}`}
                        className="text-xs px-3 py-1.5 bg-slate-800 hover:bg-indigo-900/40 border border-slate-700/50 hover:border-indigo-500/60 text-slate-400 hover:text-indigo-300 rounded-lg transition-colors"
                      >
                        Ver detalle
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-xs text-slate-600 mt-3 text-right">
        {filtered.length} de {students.length} alumnos
      </p>
    </div>
  );
}
