"use client";

import { useState } from "react";

const DAYS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

export default function CalendarView() {
  const today = new Date();
  const [current, setCurrent] = useState({
    month: today.getMonth(),
    year: today.getFullYear(),
  });

  function prevMonth() {
    setCurrent((c) => {
      const d = new Date(c.year, c.month - 1, 1);
      return { month: d.getMonth(), year: d.getFullYear() };
    });
  }

  function nextMonth() {
    setCurrent((c) => {
      const d = new Date(c.year, c.month + 1, 1);
      return { month: d.getMonth(), year: d.getFullYear() };
    });
  }

  const firstDay = new Date(current.year, current.month, 1).getDay();
  const daysInMonth = new Date(current.year, current.month + 1, 0).getDate();
  const isCurrentMonth =
    current.month === today.getMonth() && current.year === today.getFullYear();

  // Celdas: días vacíos iniciales + días del mes
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  // Completar última fila
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-700/50 rounded-2xl overflow-hidden">
      {/* Header del mes */}
      <div className="flex items-center justify-between px-6 py-5 bg-gradient-to-r from-indigo-900/40 to-purple-900/30 border-b border-slate-700/50">
        <button
          type="button"
          onClick={prevMonth}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Mes anterior"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="text-center">
          <h2 className="text-base font-bold text-white tracking-wide">
            {MONTHS[current.month]}
          </h2>
          <p className="text-xs text-indigo-300/80 mt-0.5">{current.year}</p>
        </div>

        <button
          type="button"
          onClick={nextMonth}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Mes siguiente"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Grilla */}
      <div className="flex flex-col flex-1 min-h-0 px-4 pt-3 pb-0">
        {/* Cabecera de días */}
        <div className="grid grid-cols-7 border-b border-slate-700/60 mb-0">
          {DAYS.map((d, i) => (
            <div
              key={d}
              className={`text-center text-xs font-semibold py-2.5 tracking-wider uppercase ${
                i === 0 || i === 6 ? "text-indigo-400/60" : "text-slate-500"
              }`}
            >
              {d}
            </div>
          ))}
        </div>

        {/* Semanas — cada fila ocupa la misma proporción de altura */}
        <div className="flex-1 flex flex-col divide-y divide-slate-800/80">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex-1 grid grid-cols-7 divide-x divide-slate-800/80">
              {week.map((day, di) => {
                const isToday = isCurrentMonth && day === today.getDate();
                const isWeekend = di === 0 || di === 6;
                return (
                  <div
                    key={di}
                    className={`flex items-start justify-end p-2 transition-colors ${
                      day === null
                        ? isWeekend ? "bg-slate-900/40" : ""
                        : isToday
                        ? "bg-indigo-600/15"
                        : isWeekend
                        ? "bg-slate-900/30 hover:bg-indigo-900/20 cursor-pointer"
                        : "hover:bg-slate-800/50 cursor-pointer"
                    }`}
                  >
                    {day !== null && (
                      <span
                        className={`w-7 h-7 flex items-center justify-center rounded-full text-sm font-medium transition-colors ${
                          isToday
                            ? "bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-500/40"
                            : isWeekend
                            ? "text-indigo-400/70"
                            : "text-slate-300"
                        }`}
                      >
                        {day}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Pie */}
      <div className="px-6 py-3 border-t border-slate-700/50 bg-slate-900/40 flex items-center justify-center gap-2">
        <span className="w-2 h-2 rounded-full bg-indigo-500/60" />
        <p className="text-xs text-slate-500">
          La gestión de eventos estará disponible próximamente.
        </p>
      </div>
    </div>
  );
}
