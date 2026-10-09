import { z } from 'zod';

export const javaVersionSchema = z.enum(['8', '9', '10', '11']);
export const scopeSchema = z.enum(['java', 'aso', 'apx']);
export const coverageStatusSchema = z.enum(['provisional', 'confirmed', 'pending']);
export const objectiveSchema = z.object({
 id: z.string().min(1), title: z.string().min(1), scope: scopeSchema,
 javaVersions: z.array(javaVersionSchema).min(1), status: coverageStatusSchema,
 references: z.array(z.string().url()), note: z.string().optional()
}).strict();
export const examProfileSchema = z.object({
 id: z.string().min(1), version: z.number().int().positive(), title: z.string(),
 verified: z.boolean(), source: z.string().nullable(), questionCount: z.number().int().positive().nullable(),
 durationMinutes: z.number().int().positive().nullable(), passPercentage: z.number().min(0).max(100).nullable()
}).strict();
export const studyPlanSchema = z.object({
 durationDays: z.number().int().positive().max(365),
 dailyMinutes: z.number().int().positive().max(1440), revision: z.number().int().nonnegative()
}).strict();
export const planUpdateSchema = studyPlanSchema;
export const candidateProgressSchema = z.object({
 userId: z.string().min(1), displayName: z.string(), completedAttempts: z.number().int().nonnegative(),
 answeredQuestions: z.number().int().nonnegative(), averageScore: z.number().min(0).max(100).nullable(),
 objectives: z.array(z.object({ objectiveId: z.string(), answered: z.number().int().nonnegative(), correct: z.number().int().nonnegative() })),
 plan: studyPlanSchema
}).strict();
export const internalInsightsSchema = z.object({ reviewRequired: z.boolean(), administrativeNote: z.string() }).strict();
export const adminCandidateSchema = z.object({
 userId: z.string(), displayName: z.string(), lastActivityAt: z.string().nullable(),
 completedAttempts: z.number().int().nonnegative(), averageScore: z.number().nullable(),
 internalInsights: internalInsightsSchema
}).strict();
export const adminDirectorySchema = z.object({ items: z.array(adminCandidateSchema), nextCursor: z.string().nullable() }).strict();
export const provenanceSchema = z.object({
 kind: z.enum(['original', 'incorporated', 'adapted']), sourceId: z.string().nullable(),
 sourceVersion: z.string().nullable(), locator: z.string().nullable()
}).strict().superRefine((value, ctx) => {
 if (value.kind !== 'original' && (!value.sourceId || !value.sourceVersion || !value.locator)) {
  ctx.addIssue({ code: 'custom', message: 'Las preguntas incorporadas necesitan fuente, versión y localizador.' });
 }
});
export const questionSchema = z.object({
 id: z.string().min(1), version: z.number().int().positive(), familyId: z.string().min(1),
 objectiveIds: z.array(z.string().min(1)).min(1), scope: scopeSchema,
 javaVersion: javaVersionSchema, difficulty: z.enum(['JR', 'Standard', 'Senior']),
 stem: z.string().min(1), code: z.string().optional(),
 options: z.array(z.object({ id: z.string().min(1), text: z.string().min(1), explanation: z.string().min(1) })).min(2),
 correctOptionIds: z.array(z.string()).min(1), explanation: z.string().min(1), provenance: provenanceSchema,
 reviewStatus: z.enum(['draft', 'reviewed']), evidence: z.string().nullable()
}).strict().superRefine((question, ctx) => {
 const optionIds = question.options.map((option) => option.id);
 if (new Set(optionIds).size !== optionIds.length) ctx.addIssue({ code: 'custom', message: 'Opciones duplicadas.' });
 if (new Set(question.correctOptionIds).size !== question.correctOptionIds.length ||
     question.correctOptionIds.some((id) => !optionIds.includes(id))) ctx.addIssue({ code: 'custom', message: 'Solución inválida.' });
 if (question.reviewStatus === 'reviewed' && !question.evidence) ctx.addIssue({ code: 'custom', message: 'Falta evidencia de revisión.' });
});
export const questionBankSchema = z.array(questionSchema).superRefine((questions, ctx) => {
 if (new Set(questions.map((question) => question.id)).size !== questions.length)
  ctx.addIssue({ code: 'custom', message: 'IDs de pregunta duplicados.' });
});
export const resourceSchema = z.object({
 id: z.string(), title: z.string(), url: z.string().url(), type: z.enum(['documentation', 'video', 'practice']),
 language: z.string(), scope: scopeSchema, javaVersions: z.array(javaVersionSchema), objectiveIds: z.array(z.string()),
 cost: z.enum(['free', 'paid', 'unknown']), reviewedAt: z.string().nullable(), reason: z.string()
}).strict();

export type StudyPlan = z.infer<typeof studyPlanSchema>;
export type CandidateProgress = z.infer<typeof candidateProgressSchema>;
export type AdminCandidate = z.infer<typeof adminCandidateSchema>;
export type AdminDirectory = z.infer<typeof adminDirectorySchema>;
export type Question = z.infer<typeof questionSchema>;
export type Objective = z.infer<typeof objectiveSchema>;

export function emptyProgress(userId: string, displayName = 'Candidato'): CandidateProgress {
 return { userId, displayName, completedAttempts: 0, answeredQuestions: 0, averageScore: null, objectives: [],
  plan: { durationDays: 21, dailyMinutes: 180, revision: 0 } };
}
