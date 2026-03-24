/**
 * Calcula el porcentaje de completado de un módulo considerando:
 * - Lecciones leídas (1 punto cada una)
 * - Quiz completado (vale tantos puntos como el total de lecciones)
 *
 * Ejemplo con 5 lecciones:
 *   - 5 leídas + quiz = 10/10 = 100%
 *   - 5 leídas, sin quiz = 5/10 = 50%
 *   - 0 leídas + quiz = 5/10 = 50%
 *   - 3 leídas + quiz = 8/10 = 80%
 */
export function calcModulePct(
  lessonCount: number,
  readCount: number,
  quizCompleted: boolean
): number {
  if (lessonCount === 0) return quizCompleted ? 100 : 0;
  const earned = readCount + (quizCompleted ? lessonCount : 0);
  const total = lessonCount * 2;
  return Math.round((earned / total) * 100);
}
