import type { APIGatewayProxyEventV2WithJWTAuthorizer } from 'aws-lambda';

export class HttpError extends Error {
 constructor(public status: number, message: string) { super(message); }
}
export interface Identity { sub: string; role: 'candidate' | 'administrator'; }
export function identityFromEvent(event: APIGatewayProxyEventV2WithJWTAuthorizer): Identity {
 const claims = event.requestContext.authorizer?.jwt?.claims;
 if (!claims || typeof claims.sub !== 'string' || !claims.sub) throw new HttpError(401, 'Se requiere una sesión válida.');
 // HTTP API JWT authorizer validates issuer, audience, signature and expiry upstream.
 const raw = claims['cognito:groups'];
 const groups = Array.isArray(raw) ? raw : typeof raw === 'string' ? raw.replaceAll('[', '').replaceAll(']', '').replaceAll('"', '').split(',').map((group) => group.trim()) : [];
 return { sub: claims.sub, role: groups.includes('administrator') ? 'administrator' : 'candidate' };
}
export function requireAdministrator(identity: Identity) {
 if (identity.role !== 'administrator') throw new HttpError(403, 'Acceso exclusivo de administración.');
}
