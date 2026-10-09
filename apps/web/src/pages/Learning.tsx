import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Intro from '../notes/intro.mdx';
import { objectives, resources, profile } from '../content';
import styles from '../App.module.css';

function Heading({ label, title, description }: { label: string; title: string; description: string }) {
 return <div className={styles.pageHeading}><div><p className={styles.eyebrow}>{label}</p><h1>{title}</h1><p className={styles.lead}>{description}</p></div></div>;
}
export function Notes() {
 const [scope, setScope] = useState('all');
 return <><Heading label="02 / APUNTES" title="Entiende antes de memorizar." description="Recorre las reglas, sigue el código y comprueba tu razonamiento."/>
  <div className={styles.filterRow}><label>Ámbito<select value={scope} onChange={(event) => setScope(event.target.value)}><option value="all">Todos los temas</option><option value="java">Java 8–11</option><option value="aso">ASO</option><option value="apx">APX</option></select></label><span className={styles.muted}>Temario NETEC por confirmar</span></div>
  <div className={styles.topicGrid}>{objectives.filter((objective) => scope === 'all' || objective.scope === scope).map((objective, index) => <article className={styles.panel} key={objective.id}><span className={styles.cardNumber}>{String(index + 1).padStart(2,'0')}</span><p className={styles.eyebrow}>{objective.scope.toUpperCase()} · JAVA {objective.javaVersions.join(' / ')}</p><h2>{objective.title}</h2><p>{objective.note ?? 'La cobertura del examen se ajustará cuando contemos con las referencias.'}</p>
   {objective.id === 'java-fundamentals' ? <Link className={styles.cardAction} to={'/apuntes/' + objective.id}>Abrir apunte de muestra <span aria-hidden="true">↗</span></Link> : <span className={styles.pending}>{objective.status === 'pending' ? 'Referencias pendientes' : 'Contenido en preparación'}</span>}</article>)}</div>
 </>;
}
export function NoteDetail() {
 const { id } = useParams();
 const objective = objectives.find((item) => item.id === id);
 return <><Link to="/apuntes" className={styles.backLink}>← Todos los apuntes</Link>{objective?.id === 'java-fundamentals' ? <article className={styles.note}><p className={styles.eyebrow}>APUNTE INTERACTIVO DE MUESTRA</p><Intro/></article> : <section className={styles.panel}><h1>{objective?.title ?? 'Tema no encontrado'}</h1><p>Este contenido se incorporará cuando esté documentado.</p></section>}</>;
}
export function Exams() {
 const [mode, setMode] = useState<'practice' | 'timed'>('practice');
 return <><Heading label="03 / EXÁMENES DE PRUEBA" title="Practica con intención." description="Elige cómo estudiar. Aprende del resultado y del razonamiento."/>
  <div className={styles.modeGrid}>{[{ id:'practice', title:'Práctica libre', tag:'A TU RITMO', text:'Sin límite de tiempo. Recibe una explicación al confirmar cada respuesta, sea correcta o incorrecta.' },
   { id:'timed', title:'Simulación con tiempo', tag:'ENFOQUE DE EXAMEN', text:'Responde y revisa sin interrupciones. Las explicaciones se muestran al finalizar el intento.' }].map((item) =>
    <button aria-pressed={mode === item.id} key={item.id} onClick={() => setMode(item.id as 'practice' | 'timed')} className={mode === item.id ? styles.modeSelected : styles.modeCard}><span className={styles.eyebrow}>{item.tag}</span><h2>{item.title}</h2><p>{item.text}</p><span className={styles.cardAction}>{mode === item.id ? 'Modo seleccionado' : 'Seleccionar modo'} <span aria-hidden="true">↗</span></span></button>)}</div>
  <section className={styles.panel}><div className={styles.sectionHeading}><h2>Banco de preguntas</h2><span className={styles.pending}>En preparación</span></div><p>Las preguntas se incorporarán desde contenidos revisados y las referencias aportadas. La selección será aleatoria, sin repetir preguntas dentro de un intento.</p>
   <div className={styles.emptyState}><span className={styles.emptySymbol} aria-hidden="true">[]</span><h3>Aún no hay preguntas publicadas.</h3><p>El objetivo es contar con al menos 600 preguntas verificadas, con explicación de cada opción.</p><button className={styles.primary} disabled>Banco en preparación</button></div>
   <div className={styles.callout}>{profile.title}: duración, cantidad de preguntas y umbral todavía por confirmar. No se aplican parámetros de exámenes Oracle.</div>
  </section>
 </>;
}
export function Materials() {
 const [search, setSearch] = useState('');
 const [version, setVersion] = useState('all');
 const filtered = resources.filter((resource) => resource.title.toLowerCase().includes(search.toLowerCase()) && (version === 'all' || resource.javaVersions.some((value) => value === version)));
 return <><Heading label="04 / MATERIAL EXTRA" title="Más contexto. Menos ruido." description="Un catálogo que crecerá con referencias útiles y pertinentes para tu evaluación."/>
  <div className={styles.filterRow}><label>Buscar recurso<input type="search" placeholder="Título o referencia" value={search} onChange={(event) => setSearch(event.target.value)}/></label><label>Versión de Java<select value={version} onChange={(event) => setVersion(event.target.value)}><option value="all">Todas las versiones</option><option value="8">Java 8</option><option value="11">Java 11</option></select></label></div>
  <div className={styles.topicGrid}>{filtered.map((resource) => <article key={resource.id} className={styles.panel}><p className={styles.eyebrow}>DOCUMENTACIÓN · JAVA {resource.javaVersions.join(' / ')}</p><h2>{resource.title}</h2><p>{resource.reason}</p><p className={styles.muted}>Inglés · Gratuito · Revisión editorial pendiente</p><a className={styles.cardAction} href={resource.url} target="_blank" rel="noreferrer">Consultar referencia <span aria-hidden="true">↗</span></a></article>)}</div>
  {!filtered.length && <p role="status" className={styles.emptyState}>No hay recursos que coincidan con tu búsqueda.</p>}
 </>;
}
