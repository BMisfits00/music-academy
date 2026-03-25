"use client";

import { useTransition } from "react";
import { selectInstrument } from "@/app/actions/user";

const ICONS: Record<string, string> = {
  piano: "🎹",
  guitarra: "🎸",
  bajo: "🎵",
};

// Opción C — gradiente premium por instrumento
const INSTRUMENT_GRADIENTS: Record<string, { card: string; hover: string; text: string; bar: string }> = {
  piano:    { card: "from-indigo-900/70 to-slate-900 border-indigo-700/40", hover: "hover:border-indigo-500/60 hover:shadow-indigo-900/20",  text: "group-hover:text-indigo-300",  bar: "bg-indigo-500" },
  guitarra: { card: "from-amber-900/70 to-slate-900 border-amber-700/40",   hover: "hover:border-amber-500/60 hover:shadow-amber-900/20",    text: "group-hover:text-amber-300",   bar: "bg-amber-500"  },
  bajo:     { card: "from-emerald-900/70 to-slate-900 border-emerald-700/40", hover: "hover:border-emerald-500/60 hover:shadow-emerald-900/20", text: "group-hover:text-emerald-300", bar: "bg-emerald-500" },
};

interface Instrument {
  id: string;
  name: string;
  slug: string;
}

interface Props {
  instruments: Instrument[];
  teoriaCompleted: boolean;
}

export default function InstrumentSelector({ instruments, teoriaCompleted }: Props) {
  const [isPending, startTransition] = useTransition();

  function handleSelect(id: string) {
    if (!teoriaCompleted) return;
    startTransition(() => {
      selectInstrument(id);
    });
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {instruments.map((inst) => {
        const locked = !teoriaCompleted;
        const theme = INSTRUMENT_GRADIENTS[inst.slug] ?? {
          card: "from-slate-800/70 to-slate-900 border-slate-700/40",
          hover: "hover:border-slate-500/60 hover:shadow-slate-900/20",
          text: "group-hover:text-slate-300",
          bar: "bg-slate-500",
        };
        return (
          <button
            key={inst.id}
            type="button"
            onClick={() => handleSelect(inst.id)}
            disabled={isPending || locked}
            title={locked ? "Completá la Teoría Musical para desbloquear" : undefined}
            className={`relative flex flex-col gap-4 rounded-xl border p-5 text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500
              ${locked
                ? "border-slate-800 bg-slate-900/50 opacity-40 cursor-not-allowed"
                : `bg-gradient-to-br ${theme.card} ${theme.hover} hover:shadow-lg cursor-pointer group`
              }
              ${isPending ? "opacity-50 cursor-not-allowed" : ""}
            `}
          >
            {locked && (
              <span className="absolute top-3 right-3 text-slate-500 text-base">🔒</span>
            )}
            <span className="text-4xl">{ICONS[inst.slug] ?? "🎵"}</span>
            <p className={`font-semibold text-base transition-colors ${locked ? "text-slate-500" : `text-slate-200 ${theme.text}`}`}>
              {inst.name}
            </p>
          </button>
        );
      })}
    </div>
  );
}
