"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { isPassing } from "@/lib/scoring";

export type SubmitChallengesResult = {
  score: number;
  correct: number;
  total: number;
  completed: boolean;
  results: { challengeId: string; isCorrect: boolean; correctAnswer: string }[];
  error?: string;
};

export async function submitChallenges(
  moduleId: string,
  answers: Record<string, string> // { [challengeId]: respuesta }
): Promise<SubmitChallengesResult> {
  const session = await auth();
  if (!session?.user?.id) return { error: "No autenticado.", score: 0, correct: 0, total: 0, completed: false, results: [] };

  const userId = session.user.id;

  // Obtener todos los desafíos y lecciones del módulo en paralelo
  const [challenges, moduleLessons] = await Promise.all([
    prisma.challenge.findMany({ where: { moduleId }, orderBy: { order: "asc" } }),
    prisma.lesson.findMany({ where: { moduleId }, select: { id: true } }),
  ]);

  if (challenges.length === 0) {
    // Sin desafíos → marcar como completado directamente
    await upsertProgress(userId, moduleId, 100, true);
    revalidatePath("/dashboard", "layout");
    return { score: 100, correct: 0, total: 0, completed: true, results: [] };
  }

  // Evaluar respuestas
  const results: SubmitChallengesResult["results"] = [];
  let correct = 0;

  for (const challenge of challenges) {
    const userAnswer = answers[challenge.id] ?? "";
    let isCorrect = false;

    if (challenge.type === "PRACTICAL") {
      // Auto-evaluación: el alumno decide si lo completó
      isCorrect = userAnswer === "true";
    } else {
      isCorrect =
        userAnswer.trim().toLowerCase() ===
        (challenge.correctAnswer ?? "").trim().toLowerCase();
    }

    if (isCorrect) correct++;

    results.push({
      challengeId: challenge.id,
      isCorrect,
      correctAnswer: challenge.correctAnswer ?? "",
    });

    // Guardar respuesta individual
    await prisma.challengeAnswer.create({
      data: {
        userId,
        challengeId: challenge.id,
        answer: userAnswer,
        isCorrect,
      },
    });
  }

  const score = Math.round((correct / challenges.length) * 100);
  const completed = isPassing(score);

  // Actualizar o crear progreso del módulo
  await upsertProgress(userId, moduleId, score, completed);

  // Si aprobó, marcar automáticamente todas las lecciones como leídas
  if (completed && moduleLessons.length > 0) {
    await prisma.lessonProgress.createMany({
      data: moduleLessons.map((l) => ({ userId, lessonId: l.id })),
      skipDuplicates: true,
    });
  }

  revalidatePath("/dashboard", "layout");
  return { score, correct, total: challenges.length, completed, results };
}

async function upsertProgress(
  userId: string,
  moduleId: string,
  score: number,
  completed: boolean
) {
  const existing = await prisma.progress.findUnique({
    where: { userId_moduleId: { userId, moduleId } },
  });

  if (existing) {
    // Solo actualizar si mejora el puntaje
    if (score > (existing.score ?? 0)) {
      await prisma.progress.update({
        where: { userId_moduleId: { userId, moduleId } },
        data: {
          score,
          completed: existing.completed || completed,
          attempts: { increment: 1 },
          completedAt: completed && !existing.completed ? new Date() : existing.completedAt,
        },
      });
    } else {
      await prisma.progress.update({
        where: { userId_moduleId: { userId, moduleId } },
        data: { attempts: { increment: 1 } },
      });
    }
  } else {
    await prisma.progress.create({
      data: {
        userId,
        moduleId,
        score,
        completed,
        attempts: 1,
        completedAt: completed ? new Date() : null,
      },
    });
  }
}
