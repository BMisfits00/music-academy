import CalendarView from "@/components/calendar/CalendarView";

export default function CalendarioDashboardPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Calendario</h1>
        <p className="text-sm text-gray-400">
          Seguimiento de clases, eventos y actividades del instituto.
        </p>
      </div>
      <CalendarView />
    </div>
  );
}
