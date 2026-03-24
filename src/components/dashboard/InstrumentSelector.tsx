"use client";

import { useTransition } from "react";
import { selectInstrument } from "@/app/actions/user";

const ICONS: Record<string, string> = {
  piano: "🎹",
  guitarra: "🎸",
  bajo: "🎵",
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
        return (
          <button
            key={inst.id}
            type="button"
            onClick={() => handleSelect(inst.id)}
            disabled={isPending || locked}
            title={locked ? "Completá la Teoría Musical para desbloquear" : undefined}
            className={`relative flex flex-col gap-4 rounded-xl border p-5 text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500
              ${locked
                ? "border-gray-800 bg-gray-900/40 opacity-50 cursor-not-allowed"
                : "border-gray-800 bg-gray-900 hover:border-indigo-500 hover:bg-gray-800 cursor-pointer group"
              }
              ${isPending ? "opacity-50 cursor-not-allowed" : ""}
            `}
          >
            {locked && (
              <span className="absolute top-3 right-3 text-gray-600 text-base">🔒</span>
            )}
            <span className="text-4xl">{ICONS[inst.slug] ?? "🎵"}</span>
            <p className={`font-semibold text-base transition-colors ${!locked ? "group-hover:text-indigo-400" : ""}`}>
              {inst.name}
            </p>
          </button>
        );
      })}
    </div>
  );
}
