import type { AdminDirectory, CandidateProgress, StudyPlan } from '@netec/contracts';
export interface ProgressRepository {
 getProgress(sub: string): Promise<CandidateProgress>;
 savePlan(sub: string, plan: StudyPlan): Promise<StudyPlan>;
 listCandidates(cursor?: string): Promise<AdminDirectory>;
}
export const keys = {
 profile: (sub: string) => ({ PK: 'USER#' + sub, SK: 'PROFILE' }),
 plan: (sub: string) => ({ PK: 'USER#' + sub, SK: 'PLAN' }),
 progress: (sub: string) => ({ PK: 'USER#' + sub, SK: 'SUMMARY' }),
 attempt: (sub: string, id: string) => ({ PK: 'USER#' + sub, SK: 'ATTEMPT#' + id }),
 answer: (sub: string, attemptId: string, questionId: string) => ({ PK: 'USER#' + sub, SK: 'ANSWER#' + attemptId + '#' + questionId })
};
