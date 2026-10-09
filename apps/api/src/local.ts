// Local preview only: this file is never a Lambda build entry point.
import { createServer } from 'node:http';
import type { APIGatewayProxyEventV2WithJWTAuthorizer } from 'aws-lambda';
import { emptyProgress, type StudyPlan } from '@netec/contracts';
import { createApplication } from './application';
import { HttpError } from './auth';
import type { ProgressRepository } from './repository';

const people = new Map<string, ReturnType<typeof emptyProgress>>();
const repository: ProgressRepository = {
 async getProgress(sub) {
  if (!people.has(sub)) people.set(sub, emptyProgress(sub, sub === 'local-candidate' ? 'Candidato local' : 'Administrador local'));
  return structuredClone(people.get(sub)!);
 },
 async savePlan(sub, plan: StudyPlan) {
  const person = await this.getProgress(sub);
  if (person.plan.revision !== plan.revision) throw new HttpError(409, 'El plan cambió. Recarga antes de guardar.');
  person.plan = { ...plan, revision: plan.revision + 1 }; people.set(sub, person); return person.plan;
 },
 async listCandidates() {
  return { items: [...people.values()].filter((person) => person.userId === 'local-candidate').map((person) => ({
   userId: person.userId, displayName: person.displayName, lastActivityAt: null,
   completedAttempts: person.completedAttempts, averageScore: person.averageScore,
   internalInsights: { reviewRequired: false, administrativeNote: 'Cuenta de desarrollo. No es un candidato real.' }
  })), nextCursor: null };
 }
};
const application = createApplication(repository);
createServer(async (request, response) => {
 const origin = request.headers.origin;
 if (origin && !['http://127.0.0.1:5173', 'http://localhost:5173'].includes(origin)) {
  response.writeHead(403); response.end(); return;
 }
 const cors = { 'Access-Control-Allow-Origin': origin ?? 'http://127.0.0.1:5173',
  'Access-Control-Allow-Headers': 'content-type,x-dev-user', 'Access-Control-Allow-Methods': 'GET,PUT,OPTIONS', Vary: 'Origin' };
 if (request.method === 'OPTIONS') { response.writeHead(204, cors); response.end(); return; }
 const url = new URL(request.url ?? '/', 'http://127.0.0.1:3001');
 if (url.pathname === '/health') { response.writeHead(200, cors); response.end('ok'); return; }
 const user = request.headers['x-dev-user'];
 if (!['local-candidate', 'local-administrator'].includes(String(user))) { response.writeHead(401, cors); response.end(); return; }
 let body = '';
 for await (const chunk of request) {
  body += chunk.toString();
  if (Buffer.byteLength(body) > 4096) { response.writeHead(413, cors); response.end(); return; }
 }
 const event = {
  rawPath: url.pathname, body: body || undefined, isBase64Encoded: false,
  queryStringParameters: Object.fromEntries(url.searchParams),
  requestContext: { http: { method: request.method }, authorizer: { jwt: { claims: {
   sub: String(user), 'cognito:groups': user === 'local-administrator' ? 'administrator' : ''
  }}}}
 } as unknown as APIGatewayProxyEventV2WithJWTAuthorizer;
 const result = await application(event);
 response.writeHead(result.statusCode ?? 500, { ...cors, ...result.headers }); response.end(result.body);
}).listen(3001, '127.0.0.1', () => console.log('API local: http://127.0.0.1:3001 (datos temporales; sin AWS)'));
