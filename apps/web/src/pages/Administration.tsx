import { useEffect, useState } from 'react';
import type { AdminDirectory } from '@netec/contracts';
import { useAuth } from '../auth';
import { api } from '../api';
import styles from '../App.module.css';

export function Administration() {
 const { session } = useAuth();
 const [directory, setDirectory] = useState<AdminDirectory | null>(null);
 const [error, setError] = useState('');
 const [loading, setLoading] = useState(false);
 useEffect(() => {
  if (!session) return;
  let active = true;
  setDirectory(null); setLoading(true);
  void api.candidates(session).then((value) => { if (active) setDirectory(value); })
   .catch((reason: Error) => { if (active) setError(reason.message); }).finally(() => { if (active) setLoading(false); });
  return () => { active = false; };
 }, [session]);
 async function next() {
  if (!session || !directory?.nextCursor) return;
  setLoading(true);
  try { const result = await api.candidates(session, directory.nextCursor); setDirectory(result); }
  catch (reason) { setError(reason instanceof Error ? reason.message : 'No se pudo consultar.'); }
  finally { setLoading(false); }
 }
 return <><div className={styles.pageHeading}><div><p className={styles.eyebrow}>05 / ADMINISTRACIÓN</p><h1>Acompaña el progreso.</h1><p className={styles.lead}>Resultados y seguimiento de los candidatos en un solo espacio.</p></div><span className={styles.outlineBadge}>ACCESO ADMINISTRATIVO</span></div>
  {error && <p role="alert" className={styles.error}>{error}</p>}{loading && <p role="status">Consultando candidatos…</p>}
  <section className={styles.panel}><div className={styles.sectionHeading}><h2>Candidatos</h2><span>Última actividad de estudio</span></div>
   {!loading && !directory?.items.length ? <div className={styles.emptyState}><h3>Aún no hay candidatos con progreso.</h3><p>El seguimiento aparecerá cuando comiencen a estudiar y registrar intentos.</p></div> :
    <div className={styles.tableWrap}><table><thead><tr><th>Candidato</th><th>Intentos</th><th>Promedio</th><th>Última actividad</th><th>Seguimiento interno</th></tr></thead><tbody>{directory?.items.map((candidate) =>
     <tr key={candidate.userId}><td><strong>{candidate.displayName}</strong></td><td>{candidate.completedAttempts}</td><td>{candidate.averageScore == null ? 'Sin intentos' : candidate.averageScore + '%'}</td><td>{candidate.lastActivityAt ? new Date(candidate.lastActivityAt).toLocaleDateString('es-MX') : 'Sin actividad'}</td><td>{candidate.internalInsights.administrativeNote || (candidate.internalInsights.reviewRequired ? 'Revisar seguimiento' : 'Sin observaciones')}</td></tr>)}</tbody></table></div>}
   {directory?.nextCursor && <button disabled={loading} className={styles.secondary} onClick={() => void next()}>Página siguiente</button>}
  </section>
 </>;
}
