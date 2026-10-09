import type { APIGatewayProxyEventV2WithJWTAuthorizer, APIGatewayProxyStructuredResultV2 } from 'aws-lambda';
import { candidateProgressSchema, planUpdateSchema, adminDirectorySchema } from '@netec/contracts';
import { HttpError, identityFromEvent, requireAdministrator } from './auth';
import type { ProgressRepository } from './repository';

export function createApplication(repository: ProgressRepository) {
 return async (event: APIGatewayProxyEventV2WithJWTAuthorizer): Promise<APIGatewayProxyStructuredResultV2> => {
  const respond = (statusCode: number, body: unknown) => ({
   statusCode, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
   body: JSON.stringify(body)
  });
  try {
   const identity = identityFromEvent(event);
   const method = event.requestContext.http.method;
   const path = event.rawPath;
   if (path.startsWith('/admin/')) requireAdministrator(identity);
   if (method === 'GET' && path === '/me/progress') {
    // Project to the candidate contract: never return directory/internal fields.
    return respond(200, candidateProgressSchema.parse(await repository.getProgress(identity.sub)));
   }
   if (method === 'GET' && path === '/me/plan') {
    return respond(200, (await repository.getProgress(identity.sub)).plan);
   }
   if (method === 'PUT' && path === '/me/plan') {
    if (!event.body || Buffer.byteLength(event.body, 'utf8') > 4096) throw new HttpError(400, 'Solicitud inválida.');
    let body: unknown;
    try { body = JSON.parse(event.isBase64Encoded ? Buffer.from(event.body, 'base64').toString('utf8') : event.body); }
    catch { throw new HttpError(400, 'JSON inválido.'); }
    const result = planUpdateSchema.safeParse(body);
    if (!result.success) throw new HttpError(400, 'Duración, disponibilidad o revisión inválidas.');
    return respond(200, await repository.savePlan(identity.sub, result.data));
   }
   if (method === 'GET' && path === '/admin/candidates') {
    return respond(200, adminDirectorySchema.parse(await repository.listCandidates(event.queryStringParameters?.cursor)));
   }
   throw new HttpError(404, 'Ruta no disponible en el scaffold.');
  } catch (error) {
   if (error instanceof HttpError) return respond(error.status, { message: error.message });
   // Do not expose database errors, claims or private fields.
   return respond(500, { message: 'No se pudo completar la operación.' });
  }
 };
}
