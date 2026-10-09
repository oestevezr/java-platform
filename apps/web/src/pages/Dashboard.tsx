import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { CandidateProgress } from '@netec/contracts';
import { useAuth } from '../auth';
import { api } from '../api';
import { objectives } from '../content';
import styles from '../App.module.css';

export function Dashboard({ progress, onProgress }: { progress: CandidateProgress | null; onProgress: (value: CandidateProgress) => void }) {
 const { session } = useAuth();
 const [draftDays, setDays] = useState<number | null>(null);
 const [draftMinutes, setMinutes] = useState<number | null>(null);
 const days = draftDays ?? progress?.plan.durationDays ?? 21;
 const minutes = draftMinutes ?? progress?.plan.dailyMinutes ?? 180;
 const [status, setStatus] = useState('');
 const [saving, setSaving] = useState(false);
 const currentDays = progress?.plan.durationDays ?? days;
 async function save() {
  if (!session || !progress) return;
  if (!Number.isInteger(days) || days < 1 || days > 365 || !Number.isInteger(minutes) || minutes < 1 || minutes > 1440) { setStatus('Introduce días y minutos válidos.'); return; }
  setSaving(true); setStatus('');
  try {
   const plan = await api.savePlan(session, { durationDays: days, dailyMinutes: minutes, revision: progress.plan.revision });
   onProgress({ ...progress, plan }); setStatus('Ruta guardada.');
  } catch (reason) { setStatus(reason instanceof Error ? reason.message : 'No se pudo guardar.'); }
  finally { setSaving(false); }
 }
 return <>
  <div className={styles.pageHeading}><div><p className={styles.eyebrow}>MI RUTA / PREPARACIÓN INTENSIVA</p><h1>El siguiente paso,<br/><span>más claro.</span></h1><p className={styles.lead}>Una ruta para entender Java, practicar con intención<br className={styles.desktopBreak}/> y llegar con confianza a tu evaluación.</p></div><span className={styles.outlineBadge}>NETEC · ASO/APX</span></div>
  <section className={styles.hero} aria-labelledby="route-title">
   <div className={styles.heroContent}><p className={styles.eyebrow}>UN PLAN QUE SE ADAPTA A TI</p><h2 id="route-title">Tres semanas de enfoque.<br/>Tu ritmo, tus objetivos.</h2><p>Empieza por lo que necesitas reforzar. Combina apuntes, razonamiento y práctica, sin perder de vista tu progreso.</p><Link className={styles.primaryLight} to="/apuntes">Explorar los apuntes <span aria-hidden="true">↗</span></Link></div>
   <div className={styles.heroGraphic} aria-hidden="true"><div className={styles.routeLine}/><span className={styles.routeDot}/><div className={styles.heroNumber}>03<span>SEMANAS<br/>RECOMENDADAS</span></div><span className={styles.heroCaption}>RECUPERAR → RAZONAR → PRACTICAR</span></div>
  </section>
  <section className={styles.statGrid} aria-label="Tu progreso">
   {[['Ruta elegida', currentDays + ' días', 'Duración flexible'], ['Preguntas respondidas', progress ? String(progress.answeredQuestions) : '—', 'Aprende de cada respuesta'],
     ['Promedio en exámenes', progress?.averageScore != null ? progress.averageScore + '%' : '—', 'Se mostrará tras tus intentos']].map(([label, value, detail]) =>
      <div key={label} className={styles.stat}><p>{label}</p><strong>{value}</strong><span>{detail}</span></div>)}
  </section>
  <div className={styles.sectionHeading}><h2>Tu espacio de aprendizaje</h2><span>De la regla a la práctica</span></div>
  <section className={styles.learningGrid}>
   {[['01','Apuntes','Conceptos claros y explicaciones que puedes recorrer paso a paso.','/apuntes','Explorar temas'],
     ['02','Exámenes de prueba','Práctica libre o con tiempo. Refuerza el porqué de cada respuesta.','/examenes','Ver los modos'],
     ['03','Material Extra','Referencias para profundizar, resolver dudas y seguir practicando.','/material','Consultar recursos']].map(([n,title,description,to,action]) =>
      <Link to={to} key={to} className={styles.learningCard}><span className={styles.cardNumber}>{n}</span><h3>{title}</h3><p>{description}</p><span className={styles.cardAction}>{action}<span aria-hidden="true">↗</span></span></Link>)}
  </section>
  <div className={styles.bottomGrid}>
   <section className={styles.panel}><p className={styles.eyebrow}>CONFIGURA TU RITMO</p><h2>¿Cuánto tiempo tienes?</h2><p>Tres semanas es el foco recomendado. Puedes elegir otra duración y ajustar el tiempo diario.</p>
    <fieldset className={styles.duration}><legend>Duración de la ruta</legend>{[14,21,28].map((value) => <label key={value} className={days === value ? styles.durationSelected : styles.durationChoice}>
     <input type="radio" name="duration" checked={days === value} onChange={() => setDays(value)}/><strong>{value / 7} semanas</strong>{value === 21 && <small>Recomendada</small>}</label>)}</fieldset>
    <div className={styles.formRow}><label>Días personalizados<input type="number" min="1" max="365" value={days} onChange={(event) => setDays(Number(event.target.value))}/></label><label>Minutos al día<input type="number" min="1" max="1440" value={minutes} onChange={(event) => setMinutes(Number(event.target.value))}/></label></div>
    <button className={styles.primary} onClick={() => void save()} disabled={!session || !progress || saving}>{saving ? 'Guardando…' : 'Guardar mi ruta'}</button>
    {!session && <p className={styles.muted}>Inicia sesión para conservar tu ruta y tu progreso.</p>}<p role="status" className={styles.muted}>{status}</p>
   </section>
   <section className={styles.panel}><p className={styles.eyebrow}>EL PUNTO DE PARTIDA</p><h2>Contenido con contexto.</h2><p>Java 8–11 es la base. El temario y las reglas específicas de ASO/APX se incorporarán con documentación.</p>
    <ul className={styles.coverageList}>{objectives.filter((objective) => objective.scope !== 'java').map((objective) => <li key={objective.id}><span>{objective.title}</span><span className={styles.pending}>Referencias pendientes</span></li>)}</ul>
    <div className={styles.callout}>La duración es una recomendación de estudio. Tu preparación se evaluará por práctica y comprensión, no por días transcurridos.</div>
   </section>
  </div>
 </>;
}
