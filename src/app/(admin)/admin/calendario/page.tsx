import CalendarView from "@/components/calendar/CalendarView";

export default function CalendarioAdminPage() {
  return (
    <div className="flex flex-col h-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1 text-white">Calendario</h1>
        <p className="text-sm text-slate-400">
          Seguimiento de clases, eventos y actividades del instituto.
        </p>
      </div>
      <div className="flex-1 min-h-0">
        <CalendarView />
      </div>
    </div>
  );
}
