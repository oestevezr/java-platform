import { adminDirectorySchema, candidateProgressSchema, studyPlanSchema, type StudyPlan } from '@netec/contracts';
type Credentials = { accessToken?: string; sub: string; local: boolean };
async function request(path: string, credentials: Credentials, init?: RequestInit) {
 const base = import.meta.env.VITE_API_URL;
 if (!base) throw new Error('El servicio todavía no está disponible.');
 const response = await fetch(base.replace(/\/$/, '') + path, { ...init, headers: {
  'content-type': 'application/json',
  ...(credentials.local && import.meta.env.DEV ? { 'x-dev-user': credentials.sub } : { authorization: 'Bearer ' + credentials.accessToken }),
  ...init?.headers
 } });
 const body = await response.json().catch(() => null);
 if (!response.ok) throw new Error(body?.message ?? (response.status === 401 ? 'Inicia sesión para continuar.' : 'No se pudo guardar. Vuelve a intentarlo.'));
 return body;
}
export const api = {
 async progress(credentials: Credentials) { return candidateProgressSchema.parse(await request('/me/progress', credentials)); },
 async savePlan(credentials: Credentials, plan: StudyPlan) { return studyPlanSchema.parse(await request('/me/plan', credentials, { method: 'PUT', body: JSON.stringify(plan) })); },
 async candidates(credentials: Credentials, cursor?: string) { return adminDirectorySchema.parse(await request('/admin/candidates' + (cursor ? '?cursor=' + encodeURIComponent(cursor) : ''), credentials)); }
};
