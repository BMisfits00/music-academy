"use client";

import { useState } from "react";
import { getGrade } from "@/lib/scoring";
import TeacherManageModal from "./TeacherManageModal";

const INSTRUMENT_ICONS: Record<string, string> = {
  piano: "🎹",
  guitarra: "🎸",
  bajo: "🎵",
};

export interface TeacherData {
  id: string;
  name: string | null;
  instruments: { id: string; name: string; slug: string }[];
  assignedStudentIds: string[];
  studentCount: number;
  answersEvaluated: number;
}

export interface StudentData {
  id: string;
  name: string | null;
  email: string | null;
  instrumentId: string | null;
  instrumentName: string | null;
  instrumentSlug: string | null;
  completedModules: number;
  totalModules: number;
  progressPct: number;
  isApproved: boolean;
  bestScore: number | null;
  lastActivity: Date | null;
}

export interface InstrumentOption {
  id: string;
  name: string;
  slug: string;
}

function StatCard({
  label,
  value,
  color,
  sub,
}: {
  label: string;
  value: string | number;
  color: string;
  sub?: string;
}) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl px-5 py-4">
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className="text-xs text-gray-500 mt-1">{label}</p>
      {sub && <p className="text-xs text-gray-600 mt-0.5">{sub}</p>}
    </div>
  );
}

export default function AdminOverviewPanel({
  teachers,
  students,
  allInstruments,
}: {
  teachers: TeacherData[];
  students: StudentData[];
  allInstruments: InstrumentOption[];
}) {
  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(null);
  const [managingTeacher, setManagingTeacher] = useState<TeacherData | null>(null);

  const selectedTeacher = teachers.find((t) => t.id === selectedTeacherId) ?? null;

  const filteredStudents = selectedTeacher
    ? students.filter((s) => selectedTeacher.assignedStudentIds.includes(s.id))
    : students;

  const approvedCount = filteredStudents.filter((s) => s.isApproved).length;
  const approvalPct =
    filteredStudents.length > 0
      ? Math.round((approvedCount / filteredStudents.length) * 100)
      : 0;
  const avgProgress =
    filteredStudents.length > 0
      ? Math.round(
          filteredStudents.reduce((sum, s) => sum + s.progressPct, 0) /
            filteredStudents.length
        )
      : 0;

  // Para el modal: todos los alumnos como opciones de asignación
  const studentOptions = students.map((s) => ({
    id: s.id,
    name: s.name,
    email: s.email,
    instrumentName: s.instrumentName,
    instrumentSlug: s.instrumentSlug,
  }));

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Todos los alumnos"
          value={filteredStudents.length}
          color="text-gray-200"
          sub={selectedTeacher ? `de ${students.length} totales` : undefined}
        />
        <StatCard
          label="Aprobados"
          value={`${approvalPct}%`}
          color="text-emerald-400"
          sub={`${approvedCount} de ${filteredStudents.length}`}
        />
        <StatCard
          label="Avance promedio"
          value={`${avgProgress}%`}
          color="text-indigo-400"
        />
        <StatCard
          label="Profesores"
          value={teachers.length}
          color="text-amber-300"
        />
      </div>

      {/* Teachers */}
      <div>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Profesores
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {teachers.map((teacher) => {
            const isSelected = selectedTeacherId === teacher.id;

            return (
              <div
                key={teacher.id}
                className={`rounded-xl border transition-colors ${
                  isSelected
                    ? "border-indigo-500 bg-indigo-950/50"
                    : "border-gray-800 bg-gray-900"
                }`}
              >
                {/* Clickable area para filtrar */}
                <button
                  type="button"
                  onClick={() =>
                    setSelectedTeacherId(isSelected ? null : teacher.id)
                  }
                  className="w-full text-left p-4 pb-3"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-full bg-indigo-800 flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {teacher.name?.[0]?.toUpperCase() ?? "?"}
                    </div>
                    <span className="font-medium text-sm text-gray-100 truncate">
                      {teacher.name ?? "Sin nombre"}
                    </span>
                  </div>

                  {/* Instrumentos */}
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {teacher.instruments.length === 0 ? (
                      <span className="text-xs text-gray-600 italic">
                        Sin instrumentos
                      </span>
                    ) : (
                      teacher.instruments.map((inst) => (
                        <span
                          key={inst.id}
                          className="text-xs px-2 py-0.5 bg-gray-800 border border-gray-700 rounded-full text-gray-300"
                        >
                          {INSTRUMENT_ICONS[inst.slug] ?? "🎵"} {inst.name}
                        </span>
                      ))
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span>
                      {teacher.studentCount} alumno
                      {teacher.studentCount !== 1 ? "s" : ""}
                    </span>
                    {teacher.answersEvaluated > 0 && (
                      <>
                        <span className="text-gray-700">·</span>
                        <span>{teacher.answersEvaluated} respuestas evaluadas</span>
                      </>
                    )}
                  </div>
                </button>

                {/* Botón gestionar */}
                <div className="px-4 pb-3">
                  <button
                    type="button"
                    onClick={() => setManagingTeacher(teacher)}
                    className="w-full text-xs py-1.5 border border-gray-700 hover:border-indigo-500 hover:text-indigo-400 text-gray-500 rounded-lg transition-colors"
                  >
                    Gestionar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Students table */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
            Alumnos
            {selectedTeacher
              ? ` — ${selectedTeacher.name ?? "Profesor"}`
              : ""}
          </h2>
          <span className="text-xs text-gray-600">
            {filteredStudents.length} resultado
            {filteredStudents.length !== 1 ? "s" : ""}
          </span>
        </div>

        {filteredStudents.length === 0 ? (
          <div className="text-center py-10 text-gray-500 bg-gray-900 border border-gray-800 rounded-xl text-sm">
            {selectedTeacher
              ? "Este profesor no tiene alumnos asignados. Usá el botón Gestionar para asignarlos."
              : "No hay alumnos registrados."}
          </div>
        ) : (
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800 text-gray-400 text-xs uppercase tracking-wider">
                  <th className="text-left px-5 py-3 font-medium">Alumno</th>
                  <th className="text-left px-5 py-3 font-medium hidden sm:table-cell">
                    Instrumento
                  </th>
                  <th className="text-left px-5 py-3 font-medium">Avance</th>
                  <th className="text-left px-5 py-3 font-medium">Estado</th>
                  <th className="text-left px-5 py-3 font-medium hidden md:table-cell">
                    Mejor puntaje
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredStudents.map((student) => {
                  const grade =
                    student.bestScore !== null
                      ? getGrade(student.bestScore)
                      : null;

                  return (
                    <tr
                      key={student.id}
                      className="hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                            {student.name?.[0]?.toUpperCase() ?? "?"}
                          </div>
                          <div>
                            <p className="font-medium text-gray-100 text-sm">
                              {student.name ?? "Sin nombre"}
                            </p>
                            <p className="text-xs text-gray-500">
                              {student.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-3.5 hidden sm:table-cell text-gray-400 text-xs">
                        {student.instrumentSlug ? (
                          <>
                            {INSTRUMENT_ICONS[student.instrumentSlug] ?? "🎵"}{" "}
                            {student.instrumentName}
                          </>
                        ) : (
                          <span className="text-gray-600">Sin asignar</span>
                        )}
                      </td>

                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2 min-w-[100px]">
                          <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-indigo-500 rounded-full"
                              style={{"--progress": `${student.progressPct}%`, width: "var(--progress)"} as React.CSSProperties}
                            />
                          </div>
                          <span className="text-xs text-gray-400 w-8 text-right tabular-nums">
                            {student.progressPct}%
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mt-0.5">
                          {student.completedModules}/{student.totalModules} módulos
                        </p>
                      </td>

                      <td className="px-5 py-3.5">
                        {student.isApproved ? (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-900/50 text-emerald-400 border border-emerald-800">
                            Aprobado
                          </span>
                        ) : student.totalModules > 0 ? (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-red-900/30 text-red-400 border border-red-900">
                            No aprobado
                          </span>
                        ) : (
                          <span className="text-xs text-gray-600">
                            Sin actividad
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-3.5 hidden md:table-cell">
                        {grade ? (
                          <div>
                            <span
                              className={`text-sm font-semibold ${grade.color.text}`}
                            >
                              {student.bestScore}%
                            </span>
                            <p className="text-xs text-gray-600 mt-0.5">
                              {grade.label}
                            </p>
                          </div>
                        ) : (
                          <span className="text-gray-600 text-xs">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de gestión de profesor */}
      {managingTeacher && (
        <TeacherManageModal
          teacher={{ id: managingTeacher.id, name: managingTeacher.name }}
          allInstruments={allInstruments}
          currentInstrumentIds={managingTeacher.instruments.map((i) => i.id)}
          allStudents={studentOptions}
          assignedStudentIds={managingTeacher.assignedStudentIds}
          onClose={() => setManagingTeacher(null)}
        />
      )}
    </div>
  );
}
