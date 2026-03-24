// ─── Clasificación de puntaje ──────────────────────────────────────────────
// SPECIAL  → ≥ 70%  — Aprobado especial (rinde final corto)
// NORMAL   → 60–69% — Aprobado normal   (rinde final largo)
// FAILED   → < 60%  — No aprueba

export type ScoreGrade = "SPECIAL" | "NORMAL" | "FAILED";

export interface GradeInfo {
  grade: ScoreGrade;
  label: string;
  sublabel: string;
  color: {
    badge: string;      // clases Tailwind para badge/circle
    text: string;       // color del texto del puntaje
    border: string;     // color del borde
  };
}

export function getGrade(score: number): GradeInfo {
  if (score >= 70) {
    return {
      grade: "SPECIAL",
      label: "Aprobado especial",
      sublabel: "Final corto",
      color: {
        badge: "bg-emerald-900 text-emerald-300",
        text: "text-emerald-400",
        border: "border-emerald-700",
      },
    };
  }
  if (score >= 60) {
    return {
      grade: "NORMAL",
      label: "Aprobado",
      sublabel: "Final largo",
      color: {
        badge: "bg-amber-900 text-amber-300",
        text: "text-amber-400",
        border: "border-amber-700",
      },
    };
  }
  return {
    grade: "FAILED",
    label: "No aprobado",
    sublabel: "Necesitás al menos 60%",
    color: {
      badge: "bg-red-900 text-red-300",
      text: "text-red-400",
      border: "border-red-800",
    },
  };
}

// Un módulo se considera completado (desbloquea el siguiente) si score >= 60
export const PASSING_SCORE = 60;

export function isPassing(score: number): boolean {
  return score >= PASSING_SCORE;
}
