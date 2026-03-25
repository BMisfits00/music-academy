"use client";

import { useState, useMemo } from "react";
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

// Challenge con opciones mezcladas para mostrar al alumno
interface ShuffledChallenge extends Challenge {
  displayOptions: string[] | null;
  // optionMap[displayIdx] = originalIdx — para remapear la respuesta al enviar
  optionMap: number[] | null;
}

interface ChallengeSetProps {
  moduleId: string;
  challenges: Challenge[];
  previousScore?: number | null;
  previousCompleted?: boolean;
}

function fisherYates(arr: number[]): number[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildShuffled(challenges: Challenge[]): ShuffledChallenge[] {
  // Mezclar el orden de las preguntas
  const indices = fisherYates(challenges.map((_, i) => i));
  return indices.map((origIdx) => {
    const c = challenges[origIdx];
    const opts = Array.isArray(c.options) ? (c.options as string[]) : null;
    if (!opts || (c.type !== "MULTIPLE_CHOICE" && c.type !== "TRUE_FALSE")) {
      return { ...c, displayOptions: null, optionMap: null };
    }
    // Mezclar opciones
    const optIndices = fisherYates(opts.map((_, i) => i));
    return {
      ...c,
      displayOptions: optIndices.map((i) => opts[i]),
      optionMap: optIndices, // optionMap[displayIdx] = originalIdx
    };
  });
}

type Phase = "answering" | "results";

export default function ChallengeSet({
  moduleId,
  challenges,
  previousScore,
  previousCompleted,
}: ChallengeSetProps) {
  // Shuffle se calcula una sola vez por montaje del componente
  const shuffled = useMemo(() => buildShuffled(challenges), []); // eslint-disable-line react-hooks/exhaustive-deps

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
          type="button"
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
    return (
      <ResultsView
        result={result}
        previousScore={previousScore}
        shuffled={shuffled}
        answers={answers}
      />
    );
  }

  const allAnswered = shuffled.every((c) => answers[c.id] !== undefined);

  async function handleSubmit() {
    setIsSubmitting(true);
    // Remapear respuestas de índice-display a índice-original antes de enviar
    const remapped: Record<string, string> = {};
    for (const [cId, displayAns] of Object.entries(answers)) {
      const sc = shuffled.find((x) => x.id === cId);
      if (sc?.optionMap) {
        const displayIdx = parseInt(displayAns);
        remapped[cId] = isNaN(displayIdx) ? displayAns : String(sc.optionMap[displayIdx]);
      } else {
        remapped[cId] = displayAns;
      }
    }
    const res = await submitChallenges(moduleId, remapped);
    setResult(res);
    setPhase("results");
    setIsSubmitting(false);
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
        <h2 className="font-semibold text-lg">Preguntas</h2>
        <div className="flex items-center gap-3">
          {previousCompleted && (
            <span className="text-xs text-emerald-400">✓ Completado anteriormente</span>
          )}
          {previousScore !== null && previousScore !== undefined && (
            <span className="text-xs text-gray-400">Mejor puntaje: {Math.round(previousScore)}%</span>
          )}
          <span className="text-sm text-gray-400">
            {Object.keys(answers).length}/{shuffled.length} respondidas
          </span>
        </div>
      </div>

      <div className="divide-y divide-gray-800">
        {shuffled.map((challenge, idx) => (
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
          Necesitás al menos <span className="text-white font-medium">{PASSING_SCORE}%</span> para aprobar.
        </p>
        <button
          type="button"
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
  challenge: ShuffledChallenge;
  index: number;
  answer: string | undefined;
  onAnswer: (val: string) => void;
}) {
  const opts = challenge.displayOptions;

  return (
    <div className="px-6 py-5">
      <p className="text-sm font-medium text-gray-300 mb-4">
        <span className="text-indigo-400 font-bold mr-2">{index + 1}.</span>
        {challenge.question}
      </p>

      {/* Opción múltiple */}
      {(challenge.type === "MULTIPLE_CHOICE" || challenge.type === "TRUE_FALSE") && opts && (
        <div className="flex flex-col gap-2">
          {opts.map((opt, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onAnswer(String(i))}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg border cursor-pointer transition-all text-left ${
                answer === String(i)
                  ? "border-indigo-500 bg-indigo-950 text-white"
                  : "border-gray-700 hover:border-indigo-600 hover:bg-gray-800/60 text-gray-300"
              }`}
            >
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
            </button>
          ))}
        </div>
      )}

      {/* Ejercicio práctico — auto-evaluación */}
      {challenge.type === "PRACTICAL" && (
        <div className="flex gap-3 mt-2">
          {["true", "false"].map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => onAnswer(val)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border cursor-pointer transition-colors ${
                answer === val
                  ? val === "true"
                    ? "border-emerald-500 bg-emerald-950 text-emerald-300"
                    : "border-red-500 bg-red-950 text-red-300"
                  : "border-gray-700 hover:border-indigo-600 hover:bg-gray-800/60 text-gray-300"
              }`}
            >
              {val === "true" ? "✓ Lo completé" : "✗ Necesito más práctica"}
            </button>
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
  shuffled,
  answers,
}: {
  result: SubmitChallengesResult;
  previousScore?: number | null;
  shuffled: ShuffledChallenge[];
  answers: Record<string, string>;
}) {
  const gradeInfo = getGrade(result.score);
  const improved =
    previousScore !== null && previousScore !== undefined && result.score > previousScore;

  const resultMap = new Map(result.results.map((r) => [r.challengeId, r]));

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      {/* Puntaje general */}
      <div className="px-6 py-8 text-center border-b border-gray-800">
        <div
          className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center text-3xl font-bold mb-4 ${gradeInfo.color.badge}`}
        >
          {result.score}%
        </div>

        <h3 className="text-xl font-bold mb-1">
          {gradeInfo.grade === "PASSED" ? "¡Aprobado!" : "Seguí practicando"}
        </h3>

        <span className={`inline-block text-sm font-semibold px-3 py-1 rounded-full mt-1 mb-3 ${gradeInfo.color.badge}`}>
          {gradeInfo.label}
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
            Necesitás al menos {PASSING_SCORE}% para aprobar.
          </p>
        )}
      </div>

      {/* Corrección por pregunta */}
      {shuffled.length > 0 && (
        <div className="divide-y divide-gray-800">
          {shuffled.map((challenge, idx) => {
            const r = resultMap.get(challenge.id);
            if (!r) return null;

            // El correctAnswer del servidor está en índice-original.
            // Convertirlo a índice-display para resaltar la opción correcta.
            const correctOriginal = parseInt(r.correctAnswer);
            const correctDisplay = challenge.optionMap
              ? challenge.optionMap.indexOf(correctOriginal)
              : correctOriginal;

            const userDisplayIdx = answers[challenge.id];
            const opts = challenge.displayOptions;

            return (
              <div key={challenge.id} className="px-6 py-5">
                <div className="flex items-start gap-3 mb-3">
                  <span
                    className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 ${
                      r.isCorrect ? "bg-emerald-900 text-emerald-300" : "bg-red-900 text-red-300"
                    }`}
                  >
                    {r.isCorrect ? "✓" : "✗"}
                  </span>
                  <p className="text-sm font-medium text-gray-200">
                    <span className="text-indigo-400 font-bold mr-1">{idx + 1}.</span>
                    {challenge.question}
                  </p>
                </div>

                {(challenge.type === "MULTIPLE_CHOICE" || challenge.type === "TRUE_FALSE") && opts && (
                  <div className="flex flex-col gap-2 ml-9">
                    {opts.map((opt, i) => {
                      const isSelected = userDisplayIdx === String(i);
                      const isCorrectOpt = correctDisplay === i;

                      let cls = "flex items-center gap-3 px-4 py-3 rounded-lg border text-sm ";
                      if (isSelected && r.isCorrect) {
                        cls += "border-emerald-500 bg-emerald-950/60 text-emerald-200";
                      } else if (isSelected && !r.isCorrect) {
                        cls += "border-red-500 bg-red-950/60 text-red-300";
                      } else if (!isSelected && isCorrectOpt && !r.isCorrect) {
                        cls += "border-emerald-500/70 bg-emerald-950/20 text-emerald-300";
                      } else {
                        cls += "border-gray-800 text-gray-500";
                      }

                      return (
                        <div key={i} className={cls}>
                          <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center text-xs font-bold">
                            {isSelected && r.isCorrect && "✓"}
                            {isSelected && !r.isCorrect && "✗"}
                            {!isSelected && isCorrectOpt && !r.isCorrect && "✓"}
                          </span>
                          <span>{opt}</span>
                          {!isSelected && isCorrectOpt && !r.isCorrect && (
                            <span className="ml-auto text-xs text-emerald-400 font-medium">Correcta</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {challenge.type === "PRACTICAL" && (
                  <div className="ml-9 text-sm text-gray-400">
                    {r.isCorrect ? "Marcaste que lo completaste." : "Marcaste que necesitás más práctica."}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Acciones */}
      <div className="px-6 py-4 border-t border-gray-800 flex gap-3 justify-end">
        <button
          type="button"
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
