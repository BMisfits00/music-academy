interface CircularProgressProps {
  pct: number;
  size?: number;
  arcClass?: string;
  trackClass?: string;
  textClass?: string;
}

export default function CircularProgress({
  pct,
  size = 56,
  arcClass,
  trackClass = "text-gray-700/60",
  textClass,
}: CircularProgressProps) {
  const r = 15.9155; // circumference ≈ 100
  const isComplete = pct === 100;

  const arc = arcClass ?? (isComplete ? "text-emerald-400" : pct > 0 ? "text-indigo-400" : "text-gray-600");
  const label = textClass ?? (isComplete ? "text-emerald-400" : pct > 0 ? "text-slate-200" : "text-slate-500");
  const fontSize = Math.round(size * 0.22);

  return (
    <div style={{ width: size, height: size }} className="relative flex-shrink-0">
      <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
        <circle
          cx="18" cy="18" r={r}
          fill="none" strokeWidth="2.5" stroke="currentColor"
          className={trackClass}
        />
        <circle
          cx="18" cy="18" r={r}
          fill="none" strokeWidth="2.5" stroke="currentColor"
          strokeDasharray={`${pct} ${100 - pct}`}
          strokeLinecap="round"
          className={`${arc} transition-all duration-500`}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {isComplete ? (
          <span className="text-emerald-400 font-bold" style={{ fontSize }}>✓</span>
        ) : (
          <span className={`font-bold leading-none ${label}`} style={{ fontSize }}>
            {pct}%
          </span>
        )}
      </div>
    </div>
  );
}
