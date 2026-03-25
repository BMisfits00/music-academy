"use client";

import { useState } from "react";
import TeacherManageModal from "./TeacherManageModal";

const INSTRUMENT_ICONS: Record<string, string> = {
  piano: "🎹",
  guitarra: "🎸",
  bajo: "🎵",
};

export interface TeacherRow {
  id: string;
  name: string | null;
  email: string | null;
  instruments: { id: string; name: string; slug: string }[];
  assignedStudentIds: string[];
  studentCount: number;
  answersEvaluated: number;
  createdAt: Date;
}

interface InstrumentOption {
  id: string;
  name: string;
  slug: string;
}

interface StudentOption {
  id: string;
  name: string | null;
  email: string | null;
  instrumentName: string | null;
  instrumentSlug: string | null;
}

export default function TeacherTable({
  teachers,
  allInstruments,
  allStudents,
}: {
  teachers: TeacherRow[];
  allInstruments: InstrumentOption[];
  allStudents: StudentOption[];
}) {
  const [search, setSearch] = useState("");
  const [filterInstrument, setFilterInstrument] = useState("all");
  const [managingTeacher, setManagingTeacher] = useState<TeacherRow | null>(null);

  const filtered = teachers.filter((t) => {
    const matchesSearch =
      t.name?.toLowerCase().includes(search.toLowerCase()) ||
      t.email?.toLowerCase().includes(search.toLowerCase());
    const matchesInstrument =
      filterInstrument === "all" ||
      t.instruments.some((i) => i.slug === filterInstrument);
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
          value={filterInstrument}
          onChange={(e) => setFilterInstrument(e.target.value)}
          title="Filtrar por instrumento"
          aria-label="Filtrar por instrumento"
          className="bg-slate-800/60 border border-slate-700/50 rounded-lg px-4 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">Todos los instrumentos</option>
          {allInstruments
            .filter((i) => i.slug !== "teoria")
            .map((inst) => (
              <option key={inst.slug} value={inst.slug}>
                {INSTRUMENT_ICONS[inst.slug] ?? "🎵"} {inst.name}
              </option>
            ))}
        </select>
      </div>

      {/* Tabla */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-500 bg-slate-900/50 border border-slate-800 rounded-xl">
          {teachers.length === 0
            ? "No hay profesores registrados aún."
            : "No hay resultados para esa búsqueda."}
        </div>
      ) : (
        <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-800/50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="text-left px-5 py-3 font-medium">Profesor</th>
                <th className="text-left px-5 py-3 font-medium">Instrumentos</th>
                <th className="text-left px-5 py-3 font-medium hidden md:table-cell">
                  Alumnos
                </th>
                <th className="text-left px-5 py-3 font-medium hidden lg:table-cell">
                  Resp. evaluadas
                </th>
                <th className="text-left px-5 py-3 font-medium hidden lg:table-cell">
                  Registrado
                </th>
                <th className="px-5 py-3">
                  <span className="sr-only">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.map((teacher) => (
                <tr
                  key={teacher.id}
                  className="hover:bg-slate-800/40 transition-colors"
                >
                  {/* Profesor */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {teacher.name?.[0]?.toUpperCase() ?? "?"}
                      </div>
                      <div>
                        <p className="font-medium text-slate-200">
                          {teacher.name ?? "Sin nombre"}
                        </p>
                        <p className="text-xs text-slate-500">{teacher.email}</p>
                      </div>
                    </div>
                  </td>

                  {/* Instrumentos */}
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-1.5">
                      {teacher.instruments.length === 0 ? (
                        <span className="text-xs text-slate-600 italic">
                          Sin asignar
                        </span>
                      ) : (
                        teacher.instruments.map((inst) => (
                          <span
                            key={inst.id}
                            className="text-xs px-2 py-0.5 bg-indigo-900/50 border border-indigo-700/40 rounded-full text-indigo-300"
                          >
                            {INSTRUMENT_ICONS[inst.slug] ?? "🎵"} {inst.name}
                          </span>
                        ))
                      )}
                    </div>
                  </td>

                  {/* Alumnos */}
                  <td className="px-5 py-4 hidden md:table-cell">
                    <span
                      className={`text-sm font-semibold ${
                        teacher.studentCount > 0
                          ? "text-indigo-300"
                          : "text-slate-600"
                      }`}
                    >
                      {teacher.studentCount}
                    </span>
                    <span className="text-xs text-slate-500 ml-1">
                      alumno{teacher.studentCount !== 1 ? "s" : ""}
                    </span>
                  </td>

                  {/* Respuestas evaluadas */}
                  <td className="px-5 py-4 hidden lg:table-cell text-slate-400 text-sm">
                    {teacher.answersEvaluated > 0 ? (
                      teacher.answersEvaluated
                    ) : (
                      <span className="text-slate-700">—</span>
                    )}
                  </td>

                  {/* Registrado */}
                  <td className="px-5 py-4 hidden lg:table-cell text-slate-500 text-xs">
                    {new Date(teacher.createdAt).toLocaleDateString("es-AR", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>

                  {/* Acciones */}
                  <td className="px-5 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => setManagingTeacher(teacher)}
                      className="text-xs px-3 py-1.5 bg-slate-800 hover:bg-indigo-900/40 border border-slate-700/50 hover:border-indigo-500/60 text-slate-400 hover:text-indigo-300 rounded-lg transition-colors"
                    >
                      Gestionar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-xs text-slate-600 mt-3 text-right">
        {filtered.length} de {teachers.length} profesores
      </p>

      {managingTeacher && (
        <TeacherManageModal
          teacher={{ id: managingTeacher.id, name: managingTeacher.name }}
          allInstruments={allInstruments}
          currentInstrumentIds={managingTeacher.instruments.map((i) => i.id)}
          allStudents={allStudents}
          assignedStudentIds={managingTeacher.assignedStudentIds}
          onClose={() => setManagingTeacher(null)}
        />
      )}
    </div>
  );
}
