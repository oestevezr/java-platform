import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { InMemoryWebStorage, UserManager, WebStorageStateStore, type User } from 'oidc-client-ts';
import { clearAccountCache } from './cache';

interface Session { sub: string; role: 'candidate' | 'administrator'; name: string; accessToken?: string; local: boolean; }
interface AuthState { session: Session | null; ready: boolean; error: string | null; login: () => void; logout: () => void; localLogin: (role: Session['role']) => void; }
const AuthContext = createContext<AuthState | null>(null);
const localEnabled = import.meta.env.DEV && import.meta.env.VITE_LOCAL_DEMO === 'true';
const authority = import.meta.env.VITE_COGNITO_AUTHORITY;
const clientId = import.meta.env.VITE_COGNITO_CLIENT_ID;
const manager = authority && clientId ? new UserManager({
 authority, client_id: clientId, redirect_uri: window.location.origin + '/',
 post_logout_redirect_uri: window.location.origin + '/', response_type: 'code', scope: 'openid email profile learning/read learning/write',
 userStore: new WebStorageStateStore({ store: new InMemoryWebStorage() }),
 stateStore: new WebStorageStateStore({ store: window.sessionStorage }),
 automaticSilentRenew: true
}) : null;

function toSession(user: User): Session {
 const groups = user.profile['cognito:groups'];
 return { sub: user.profile.sub, name: user.profile.name ?? user.profile.email ?? 'Candidato',
  role: Array.isArray(groups) && groups.includes('administrator') ? 'administrator' : 'candidate',
  accessToken: user.access_token, local: false };
}
export function AuthProvider({ children }: { children: ReactNode }) {
 const [session, setSession] = useState<Session | null>(null);
 const [error, setError] = useState<string | null>(null);
 useEffect(() => {
  if (!manager) return;
  const loaded = (user: User) => setSession(toSession(user));
  const removed = () => setSession(null);
  manager.events.addUserLoaded(loaded); manager.events.addUserUnloaded(removed); manager.events.addAccessTokenExpired(removed);
  const callback = new URLSearchParams(window.location.search);
  const promise = callback.has('code') || callback.has('error') ? manager.signinRedirectCallback().then((user) => {
   history.replaceState(null, '', window.location.pathname + window.location.hash); return user;
  }) : manager.getUser();
  void promise.then((user) => { if (user && !user.expired) loaded(user); }).catch(() => setError('No se pudo iniciar la sesión. Vuelve a intentarlo.'));
  return () => { manager.events.removeUserLoaded(loaded); manager.events.removeUserUnloaded(removed); manager.events.removeAccessTokenExpired(removed); };
 }, []);
 const logout = () => {
  if (session) void clearAccountCache(session.sub);
  setSession(null);
  if (manager && !session?.local) void manager.signoutRedirect().catch(() => setError('La sesión local se cerró; no se pudo completar el cierre remoto.'));
 };
 const login = () => {
  if (manager) void manager.signinRedirect().catch(() => setError('No se pudo abrir el acceso.'));
 };
 const localLogin = (role: Session['role']) => {
  if (!localEnabled) return;
  if (session) void clearAccountCache(session.sub);
  setSession({ sub: role === 'candidate' ? 'local-candidate' : 'local-administrator', role,
   name: role === 'candidate' ? 'Candidato local' : 'Administrador local', local: true });
 };
 return <AuthContext.Provider value={{ session, ready: !!manager, error, login, logout, localLogin }}>{children}</AuthContext.Provider>;
}
export function useAuth() { const state = useContext(AuthContext); if (!state) throw new Error('AuthProvider required.'); return state; }
export { localEnabled };
