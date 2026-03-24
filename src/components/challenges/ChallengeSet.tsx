"use client";

import { useState } from "react";
import { submitChallenges, type SubmitChallengesResult } from "@/app/actions/progress";
import { getGrade, PASSING_SCORE } from "@/lib/scoring";
import Link from "next/link";

interface Challenge {
  id: string;
  type: string;
  question: string;
  options: unknown;
  order: number;
}

interface ChallengeSetProps {
  moduleId: string;
  challenges: Challenge[];
  previousScore?: number | null;
  previousCompleted?: boolean;
}

type Phase = "answering" | "results";

export default function ChallengeSet({
  moduleId,
  challenges,
  previousScore,
  previousCompleted,
}: ChallengeSetProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [phase, setPhase] = useState<Phase>("answering");
  const [result, setResult] = useState<SubmitChallengesResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (challenges.length === 0) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
        <h2 className="text-lg font-semibold mb-2">Desafíos</h2>
        <p className="text-gray-400 text-sm">No hay desafíos cargados aún para este módulo.</p>
        <button
          onClick={async () => {
            setIsSubmitting(true);
            const res = await submitChallenges(moduleId, {});
            setResult(res);
            setPhase("results");
            setIsSubmitting(false);
          }}
          disabled={isSubmitting}
          className="mt-4 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 rounded-lg text-sm font-medium transition-colors"
        >
          {isSubmitting ? "Guardando..." : "Marcar módulo como completado"}
        </button>
      </div>
    );
  }

  if (phase === "results" && result) {
    return <ResultsView result={result} previousScore={previousScore} />;
  }

  const allAnswered = challenges.every((c) => answers[c.id] !== undefined);

  async function handleSubmit() {
    setIsSubmitting(true);
    const res = await submitChallenges(moduleId, answers);
    setResult(res);
    setPhase("results");
    setIsSubmitting(false);
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
        <h2 className="font-semibold text-lg">Desafíos</h2>
        <div className="flex items-center gap-3">
          {previousCompleted && (
            <span className="text-xs text-emerald-400">✓ Completado anteriormente</span>
          )}
          {previousScore !== null && previousScore !== undefined && (
            <span className="text-xs text-gray-400">Mejor puntaje: {Math.round(previousScore)}%</span>
          )}
          <span className="text-sm text-gray-400">
            {Object.keys(answers).length}/{challenges.length} respondidas
          </span>
        </div>
      </div>

      <div className="divide-y divide-gray-800">
        {challenges.map((challenge, idx) => (
          <ChallengeItem
            key={challenge.id}
            challenge={challenge}
            index={idx}
            answer={answers[challenge.id]}
            onAnswer={(val) => setAnswers((prev) => ({ ...prev, [challenge.id]: val }))}
          />
        ))}
      </div>

      <div className="px-6 py-4 border-t border-gray-800 flex items-center justify-between">
        <p className="text-sm text-gray-400">
          Necesitás al menos <span className="text-white font-medium">{PASSING_SCORE}%</span> para completar el módulo.
        </p>
        <button
          onClick={handleSubmit}
          disabled={!allAnswered || isSubmitting}
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed rounded-lg text-sm font-semibold transition-colors"
        >
          {isSubmitting ? "Evaluando..." : "Enviar respuestas"}
        </button>
      </div>
    </div>
  );
}

// ─── Item de desafío individual ───────────────────────────────────────────
function ChallengeItem({
  challenge,
  index,
  answer,
  onAnswer,
}: {
  challenge: Challenge;
  index: number;
  answer: string | undefined;
  onAnswer: (val: string) => void;
}) {
  const options = Array.isArray(challenge.options) ? (challenge.options as string[]) : null;

  return (
    <div className="px-6 py-5">
      <p className="text-sm font-medium text-gray-300 mb-4">
        <span className="text-indigo-400 font-bold mr-2">{index + 1}.</span>
        {challenge.question}
      </p>

      {/* Opción múltiple */}
      {(challenge.type === "MULTIPLE_CHOICE" || challenge.type === "TRUE_FALSE") && options && (
        <div className="flex flex-col gap-2">
          {options.map((opt, i) => (
            <label
              key={i}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg border cursor-pointer transition-all ${
                answer === String(i)
                  ? "border-indigo-500 bg-indigo-950 text-white"
                  : "border-gray-700 hover:border-indigo-600 hover:bg-gray-800/60 text-gray-300"
              }`}
            >
              <input
                type="radio"
                name={challenge.id}
                value={String(i)}
                checked={answer === String(i)}
                onChange={() => onAnswer(String(i))}
                className="sr-only"
              />
              <span
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  answer === String(i) ? "border-indigo-400" : "border-gray-600"
                }`}
              >
                {answer === String(i) && (
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
                )}
              </span>
              <span className="text-sm">{opt}</span>
            </label>
          ))}
        </div>
      )}

      {/* Ejercicio práctico — auto-evaluación */}
      {challenge.type === "PRACTICAL" && (
        <div className="flex gap-3 mt-2">
          {["true", "false"].map((val) => (
            <label
              key={val}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border cursor-pointer transition-colors ${
                answer === val
                  ? val === "true"
                    ? "border-emerald-500 bg-emerald-950 text-emerald-300"
                    : "border-red-500 bg-red-950 text-red-300"
                  : "border-gray-700 hover:border-indigo-600 hover:bg-gray-800/60 text-gray-300"
              }`}
            >
              <input
                type="radio"
                name={challenge.id}
                value={val}
                checked={answer === val}
                onChange={() => onAnswer(val)}
                className="sr-only"
              />
              {val === "true" ? "✓ Lo completé" : "✗ Necesito más práctica"}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Vista de resultados ──────────────────────────────────────────────────
function ResultsView({
  result,
  previousScore,
}: {
  result: SubmitChallengesResult;
  previousScore?: number | null;
}) {
  const gradeInfo = getGrade(result.score);
  const improved =
    previousScore !== null && previousScore !== undefined && result.score > previousScore;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      <div className="px-6 py-8 text-center border-b border-gray-800">
        {/* Score */}
        <div
          className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center text-3xl font-bold mb-4 ${gradeInfo.color.badge}`}
        >
          {result.score}%
        </div>

        <h3 className="text-xl font-bold mb-1">
          {gradeInfo.grade !== "FAILED" ? "¡Módulo completado!" : "Seguí practicando"}
        </h3>

        {/* Badge de clasificación */}
        <span className={`inline-block text-sm font-semibold px-3 py-1 rounded-full mt-1 mb-3 ${gradeInfo.color.badge}`}>
          {gradeInfo.label}
          {gradeInfo.grade !== "FAILED" && (
            <span className="ml-2 font-normal opacity-80">· {gradeInfo.sublabel}</span>
          )}
        </span>

        <p className="text-gray-400 text-sm">
          {result.total > 0
            ? `${result.correct} de ${result.total} correctas`
            : "Módulo marcado como completado"}
        </p>

        {improved && (
          <p className="text-indigo-400 text-sm mt-2">
            ↑ Mejoraste tu puntaje anterior ({Math.round(previousScore!)}%)
          </p>
        )}

        {gradeInfo.grade === "FAILED" && (
          <p className="text-gray-400 text-sm mt-2">
            Necesitás al menos {PASSING_SCORE}% para desbloquear el siguiente módulo.
          </p>
        )}
      </div>

      {/* Detalle de respuestas */}
      {result.results.length > 0 && (
        <div className="divide-y divide-gray-800">
          {result.results.map((r, i) => (
            <div key={r.challengeId} className="flex items-center gap-3 px-6 py-3">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  r.isCorrect ? "bg-emerald-900 text-emerald-300" : "bg-red-900 text-red-300"
                }`}
              >
                {r.isCorrect ? "✓" : "✗"}
              </span>
              <span className="text-sm text-gray-300">Pregunta {i + 1}</span>
              {!r.isCorrect && r.correctAnswer && (
                <span className="text-xs text-gray-500 ml-auto">
                  Respuesta correcta: <span className="text-gray-300">{r.correctAnswer}</span>
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Acciones */}
      <div className="px-6 py-4 border-t border-gray-800 flex gap-3 justify-end">
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 text-sm border border-gray-700 hover:border-gray-500 rounded-lg transition-colors"
        >
          Intentar de nuevo
        </button>
        <Link
          href="/dashboard"
          className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors font-medium"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
