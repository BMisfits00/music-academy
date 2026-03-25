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
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
      {/* Header del mes */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
        <button
          type="button"
          onClick={prevMonth}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          aria-label="Mes anterior"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <h2 className="text-base font-semibold">
          {MONTHS[current.month]} {current.year}
        </h2>

        <button
          type="button"
          onClick={nextMonth}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          aria-label="Mes siguiente"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Grilla */}
      <div className="p-4">
        {/* Cabecera de días */}
        <div className="grid grid-cols-7 mb-2">
          {DAYS.map((d) => (
            <div
              key={d}
              className="text-center text-xs font-medium text-gray-500 py-1"
            >
              {d}
            </div>
          ))}
        </div>

        {/* Semanas */}
        <div className="space-y-1">
          {weeks.map((week, wi) => (
            <div key={wi} className="grid grid-cols-7 gap-1">
              {week.map((day, di) => {
                const isToday = isCurrentMonth && day === today.getDate();
                return (
                  <div
                    key={di}
                    className={`aspect-square flex items-center justify-center rounded-lg text-sm transition-colors ${
                      day === null
                        ? ""
                        : isToday
                        ? "bg-indigo-600 text-white font-bold"
                        : "text-gray-300 hover:bg-gray-800 cursor-pointer"
                    }`}
                  >
                    {day ?? ""}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Pie: próximamente */}
      <div className="px-6 py-4 border-t border-gray-800 text-center">
        <p className="text-xs text-gray-600">
          La gestión de eventos y clases estará disponible próximamente.
        </p>
      </div>
    </div>
  );
}
