import { describe, expect, it } from 'vitest';
import type { APIGatewayProxyEventV2WithJWTAuthorizer } from 'aws-lambda';
import { emptyProgress } from '@netec/contracts';
import { createApplication } from '../apps/api/src/application';
import type { ProgressRepository } from '../apps/api/src/repository';
import { HttpError } from '../apps/api/src/auth';

function event(path: string, sub?: string, group = '', method = 'GET', body?: unknown) {
 return { rawPath:path, isBase64Encoded:false, body:body ? JSON.stringify(body) : undefined,
 requestContext:{http:{method},authorizer:sub ? {jwt:{claims:{sub,'cognito:groups':group}}} : undefined} } as unknown as APIGatewayProxyEventV2WithJWTAuthorizer;
}
const users = new Map([['alice',emptyProgress('alice')],['bob',emptyProgress('bob')]]);
const repository: ProgressRepository = {
 async getProgress(sub) { return structuredClone(users.get(sub) ?? emptyProgress(sub)); },
 async savePlan(sub, plan) {
  const progress = await this.getProgress(sub);
  if (plan.revision !== progress.plan.revision) throw new HttpError(409,'Conflicto');
  return {...plan,revision:plan.revision+1};
 },
 async listCandidates() { return {items:[{userId:'alice',displayName:'Alice',lastActivityAt:null,completedAttempts:0,averageScore:null,
 internalInsights:{reviewRequired:true,administrativeNote:'ADMIN_ONLY'}}],nextCursor:null}; }
};
describe('API authorization and projections', () => {
 const application = createApplication(repository);
 it('requires a verified JWT context', async () => expect((await application(event('/me/progress'))).statusCode).toBe(401));
 it('does not accept development headers in Lambda', async () => {
  const request = {...event('/me/progress'),headers:{'x-dev-user':'local-administrator'}};
  expect((await application(request)).statusCode).toBe(401);
 });
 it('isolates users using token sub, not request data', async () => {
  const result = await application({...event('/me/progress','alice'),queryStringParameters:{userId:'bob'}});
  expect(JSON.parse(result.body!).userId).toBe('alice');
 });
 it('does not expose administrative stats to candidate', async () => {
  const result = await application(event('/me/progress','alice'));
  expect(result.body).not.toContain('internalInsights'); expect(result.body).not.toContain('ADMIN_ONLY');
 });
 it('denies administrator API to a candidate', async () => expect((await application(event('/admin/candidates','alice'))).statusCode).toBe(403));
 it('returns internal insights only to verified administrator', async () => {
  const result = await application(event('/admin/candidates','operator','[administrator]'));
  expect(result.statusCode).toBe(200); expect(result.body).toContain('ADMIN_ONLY');
 });
 it('rejects malformed/extra plan properties', async () => {
  expect((await application(event('/me/plan','alice','','PUT',{durationDays:14,dailyMinutes:180,revision:0,role:'administrator'}))).statusCode).toBe(400);
 });
 it('returns conflict instead of overwriting another revision', async () => expect((await application(event('/me/plan','alice','','PUT',{durationDays:14,dailyMinutes:180,revision:3}))).statusCode).toBe(409));
});
