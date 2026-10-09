import { describe, expect, it } from 'vitest';
import { questionBankSchema, questionSchema, provenanceSchema, studyPlanSchema } from '@netec/contracts';
import { fixture } from './fixtures/question';
describe('Content contracts', () => {
 it('rejects duplicate question IDs', () => expect(questionBankSchema.safeParse([fixture,fixture]).success).toBe(false));
 it('rejects nonexistent answer IDs', () => expect(questionSchema.safeParse({...fixture,correctOptionIds:['unknown']}).success).toBe(false));
 it('requires traceability for internal questions', () => expect(provenanceSchema.safeParse({kind:'incorporated',sourceId:null,sourceVersion:null,locator:null}).success).toBe(false));
 it('does not accept reviewed content without evidence', () => expect(questionSchema.safeParse({...fixture,reviewStatus:'reviewed'}).success).toBe(false));
 it.each([0,-1,1.5])('rejects invalid duration %s', (durationDays) => expect(studyPlanSchema.safeParse({durationDays,dailyMinutes:180,revision:0}).success).toBe(false));
 it.each([14,21,28])('accepts flexible duration %s', (durationDays) => expect(studyPlanSchema.safeParse({durationDays,dailyMinutes:180,revision:0}).success).toBe(true));
});
