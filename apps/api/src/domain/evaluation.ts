import type { Question } from '@netec/contracts';
export function evaluate(question: Question, selectedIds: string[]) {
 const selected = new Set(selectedIds);
 if (selected.size !== selectedIds.length || selectedIds.some((id) => !question.options.some((option) => option.id === id)))
  throw new Error('Opciones seleccionadas inválidas.');
 const correct = selected.size === question.correctOptionIds.length && question.correctOptionIds.every((id) => selected.has(id));
 return { correct, explanation: question.explanation, options: question.options.map((option) => ({
  id: option.id, selected: selected.has(option.id), correct: question.correctOptionIds.includes(option.id), explanation: option.explanation
 })) };
}
