import { describe, expect, it } from 'vitest';
import { questionSchema } from '@netec/contracts';
import { evaluate } from '../apps/api/src/domain/evaluation';
import { fixture } from './fixtures/question';
const question = questionSchema.parse(fixture);
describe('Exact multi-select evaluation', () => {
 it('accepts the exact answer regardless of ordering', () => expect(evaluate(question,['b','a']).correct).toBe(true));
 it('rejects partial answers', () => expect(evaluate(question,['a']).correct).toBe(false));
 it('rejects additional distractors', () => expect(evaluate(question,['a','b','c']).correct).toBe(false));
 it('rejects duplicate/unknown option IDs', () => { expect(() => evaluate(question,['a','a'])).toThrow(); expect(() => evaluate(question,['unknown'])).toThrow(); });
 it('explains both correct options and distractors', () => expect(evaluate(question,['c']).options.every((option) => option.explanation)).toBe(true));
});
