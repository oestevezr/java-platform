import { z } from 'zod';
import { objectiveSchema, resourceSchema, examProfileSchema } from '@netec/contracts';
import objectivesRaw from '../../../content/objectives.json';
import resourcesRaw from '../../../content/resources.json';
import profileRaw from '../../../content/exam-profile.json';
// Client-safe manifests only. Never import content/questions.json here.
export const objectives = z.array(objectiveSchema).parse(objectivesRaw);
export const resources = z.array(resourceSchema).parse(resourcesRaw);
export const profile = examProfileSchema.parse(profileRaw);
