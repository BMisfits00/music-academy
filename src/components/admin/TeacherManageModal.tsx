"use client";

import { useState, useTransition } from "react";
import {
  updateTeacherInstruments,
  assignStudentToTeacher,
  removeStudentFromTeacher,
} from "@/app/actions/admin";

const INSTRUMENT_ICONS: Record<string, string> = {
  piano: "🎹",
  guitarra: "🎸",
  bajo: "🎵",
};

interface Instrument {
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

interface TeacherManageModalProps {
  teacher: {
    id: string;
    name: string | null;
  };
  allInstruments: Instrument[];
  currentInstrumentIds: string[];
  allStudents: StudentOption[];
  assignedStudentIds: string[];
  onClose: () => void;
}

export default function TeacherManageModal({
  teacher,
  allInstruments,
  currentInstrumentIds,
  allStudents,
  assignedStudentIds,
  onClose,
}: TeacherManageModalProps) {
  const [tab, setTab] = useState<"instruments" | "students">("instruments");
  const [selectedInstrumentIds, setSelectedInstrumentIds] =
    useState<string[]>(currentInstrumentIds);
  const [assigned, setAssigned] = useState<string[]>(assignedStudentIds);
  const [studentSearch, setStudentSearch] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  function toggleInstrument(id: string) {
    setSelectedInstrumentIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
    setSaved(false);
  }

  function handleSaveInstruments() {
    setError(null);
    setSaved(false);
    startTransition(async () => {
      const result = await updateTeacherInstruments(
        teacher.id,
        selectedInstrumentIds
      );
      if ("error" in result) {
        setError(result.error ?? null);
      } else {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    });
  }

  function handleAssign(studentId: string) {
    setError(null);
    startTransition(async () => {
      const result = await assignStudentToTeacher(teacher.id, studentId);
      if ("error" in result) {
        setError(result.error ?? null);
      } else {
        setAssigned((prev) => [...prev, studentId]);
      }
    });
  }

  function handleRemove(studentId: string) {
    setError(null);
    startTransition(async () => {
      const result = await removeStudentFromTeacher(teacher.id, studentId);
      if ("error" in result) {
        setError(result.error ?? null);
      } else {
        setAssigned((prev) => prev.filter((id) => id !== studentId));
      }
    });
  }

  const hasInstruments = selectedInstrumentIds.length > 0;

  // Slugs de los instrumentos que el profesor tiene seleccionados
  const teacherSlugs = allInstruments
    .filter((i) => selectedInstrumentIds.includes(i.id))
    .map((i) => i.slug);

  // Solo alumnos cuyo instrumento coincide con alguno del profesor
  const assignedStudents = allStudents.filter(
    (s) => assigned.includes(s.id) && teacherSlugs.includes(s.instrumentSlug ?? "")
  );
  const availableStudents = allStudents.filter(
    (s) =>
      !assigned.includes(s.id) &&
      teacherSlugs.includes(s.instrumentSlug ?? "") &&
      (studentSearch === "" ||
        s.name?.toLowerCase().includes(studentSearch.toLowerCase()) ||
        s.email?.toLowerCase().includes(studentSearch.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-800 flex items-center justify-center text-sm font-bold">
              {teacher.name?.[0]?.toUpperCase() ?? "?"}
            </div>
            <div>
              <p className="font-semibold text-sm">{teacher.name ?? "Sin nombre"}</p>
              <p className="text-xs text-gray-500">Gestionar profesor</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white transition-colors"
            aria-label="Cerrar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-800 flex-shrink-0">
          <button
            type="button"
            onClick={() => setTab("instruments")}
            className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
              tab === "instruments"
                ? "text-indigo-400 border-b-2 border-indigo-500"
                : "text-gray-500 hover:text-gray-300"
            }`}
          >
            Instrumentos
          </button>
          <button
            type="button"
            onClick={() => hasInstruments && setTab("students")}
            title={!hasInstruments ? "Primero guardá al menos un instrumento" : undefined}
            className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
              !hasInstruments
                ? "text-gray-700 cursor-not-allowed"
                : tab === "students"
                ? "text-indigo-400 border-b-2 border-indigo-500"
                : "text-gray-500 hover:text-gray-300"
            }`}
          >
            Alumnos
            {!hasInstruments && (
              <span className="ml-1.5 text-xs">🔒</span>
            )}
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 py-5">
          {error && (
            <div className="mb-4 px-3 py-2 bg-red-900/40 border border-red-700 rounded-lg text-sm text-red-300">
              {error}
            </div>
          )}

          {/* Instruments tab */}
          {tab === "instruments" && (
            <div className="space-y-2">
              <p className="text-xs text-gray-500 mb-3">
                Seleccioná los instrumentos que enseña este profesor.
              </p>
              {allInstruments
                .filter((i) => i.slug !== "teoria")
                .map((inst) => {
                  const checked = selectedInstrumentIds.includes(inst.id);
                  return (
                    <label
                      key={inst.id}
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                        checked
                          ? "border-indigo-500 bg-indigo-950/40"
                          : "border-gray-800 bg-gray-800/40 hover:border-gray-700"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleInstrument(inst.id)}
                        className="accent-indigo-500 w-4 h-4"
                      />
                      <span className="text-lg">
                        {INSTRUMENT_ICONS[inst.slug] ?? "🎵"}
                      </span>
                      <span className="text-sm font-medium">{inst.name}</span>
                    </label>
                  );
                })}
            </div>
          )}

          {/* Students tab */}
          {tab === "students" && (
            <div className="space-y-5">
              {/* Assigned */}
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                  Alumnos asignados ({assignedStudents.length})
                </p>
                {assignedStudents.length === 0 ? (
                  <p className="text-sm text-gray-600 italic">
                    Sin alumnos asignados aún.
                  </p>
                ) : (
                  <div className="space-y-1.5">
                    {assignedStudents.map((s) => (
                      <div
                        key={s.id}
                        className="flex items-center justify-between gap-2 px-3 py-2 bg-gray-800 rounded-lg"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-6 h-6 rounded-full bg-indigo-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                            {s.name?.[0]?.toUpperCase() ?? "?"}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm text-gray-100 truncate">
                              {s.name ?? "Sin nombre"}
                            </p>
                            {s.instrumentName && (
                              <p className="text-xs text-gray-500">
                                {INSTRUMENT_ICONS[s.instrumentSlug ?? ""] ?? "🎵"}{" "}
                                {s.instrumentName}
                              </p>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemove(s.id)}
                          disabled={isPending}
                          className="text-xs px-2.5 py-1 bg-red-900/30 hover:bg-red-900/60 border border-red-900 text-red-400 rounded-lg transition-colors disabled:opacity-50 flex-shrink-0"
                        >
                          Quitar
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Available */}
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                  Agregar alumno
                </p>
                <input
                  type="text"
                  placeholder="Buscar por nombre o email..."
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-2"
                />
                {availableStudents.length === 0 ? (
                  <p className="text-sm text-gray-600 italic">
                    {studentSearch
                      ? "Sin resultados."
                      : "Todos los alumnos ya están asignados."}
                  </p>
                ) : (
                  <div className="space-y-1.5 max-h-48 overflow-y-auto">
                    {availableStudents.map((s) => (
                      <div
                        key={s.id}
                        className="flex items-center justify-between gap-2 px-3 py-2 bg-gray-800/60 border border-gray-800 rounded-lg"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                            {s.name?.[0]?.toUpperCase() ?? "?"}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm text-gray-200 truncate">
                              {s.name ?? "Sin nombre"}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {s.email}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleAssign(s.id)}
                          disabled={isPending}
                          className="text-xs px-2.5 py-1 bg-indigo-700 hover:bg-indigo-600 text-white rounded-lg transition-colors disabled:opacity-50 flex-shrink-0"
                        >
                          Asignar
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-800 flex-shrink-0">
          {tab === "instruments" ? (
            <>
              {saved && (
                <span className="text-xs text-emerald-400">Guardado</span>
              )}
              {!saved && <span />}
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm text-gray-400 hover:text-white bg-gray-800 border border-gray-700 rounded-lg transition-colors"
                >
                  Cerrar
                </button>
                <button
                  onClick={handleSaveInstruments}
                  disabled={isPending}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors disabled:opacity-50"
                >
                  {isPending ? "Guardando…" : "Guardar instrumentos"}
                </button>
              </div>
            </>
          ) : (
            <>
              <span className="text-xs text-gray-600">
                Los cambios se aplican al instante.
              </span>
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm text-gray-400 hover:text-white bg-gray-800 border border-gray-700 rounded-lg transition-colors"
              >
                Cerrar
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
