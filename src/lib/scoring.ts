// ─── Clasificación de puntaje ──────────────────────────────────────────────
// PASSED → ≥ 60% — Aprobado
// FAILED → < 60% — No aprueba

export type ScoreGrade = "PASSED" | "FAILED";

export interface GradeInfo {
  grade: ScoreGrade;
  label: string;
  color: {
    badge: string;
    text: string;
    border: string;
  };
}

export function getGrade(score: number): GradeInfo {
  if (score >= 60) {
    return {
      grade: "PASSED",
      label: "Aprobado",
      color: {
        badge: "bg-emerald-900 text-emerald-300",
        text: "text-emerald-400",
        border: "border-emerald-700",
      },
    };
  }
  return {
    grade: "FAILED",
    label: "No aprobado",
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
