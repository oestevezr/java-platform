import { useEffect, useState } from 'react';
import { Link, NavLink, Route, Routes, Navigate } from 'react-router-dom';
import type { CandidateProgress } from '@netec/contracts';
import { useAuth, localEnabled } from './auth';
import { api } from './api';
import { writeAccountCache } from './cache';
import { Dashboard } from './pages/Dashboard';
import { Notes, NoteDetail, Exams, Materials } from './pages/Learning';
import { Administration } from './pages/Administration';
import styles from './App.module.css';

export function App() {
 const auth = useAuth();
 const [progress, setProgress] = useState<CandidateProgress | null>(null);
 const [error, setError] = useState<string | null>(null);
 const [loading, setLoading] = useState(false);
 useEffect(() => {
  let active = true;
  setProgress(null); setError(null);
  if (!auth.session) { setLoading(false); return; }
  setLoading(true);
  void api.progress(auth.session).then((value) => {
   if (!active) return;
   setProgress(value);
   void writeAccountCache(value.userId, value).catch(() => { /* Cloud progress remains available without a cache. */ });
  }).catch((reason: Error) => { if (active) setError(reason.message); })
   .finally(() => { if (active) setLoading(false); });
  return () => { active = false; };
 }, [auth.session]);
 return <div className={styles.shell}>
  <a className={styles.skip} href="#main-content">Saltar al contenido</a>
  <aside className={styles.sidebar}>
   <Link to="/" className={styles.brand} aria-label="Java Ruta, inicio"><span className={styles.brandMark}>J.</span><span>JAVA<span className={styles.brandSub}>RUTA DE APRENDIZAJE</span></span></Link>
   <p className={styles.sidebarLabel}>TU ESPACIO DE ESTUDIO</p>
   <nav aria-label="Navegación principal">
    {[['/', 'Mi ruta', '01'], ['/apuntes', 'Apuntes', '02'], ['/examenes', 'Exámenes de prueba', '03'], ['/material', 'Material Extra', '04']].map(([to, title, number]) =>
     <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => isActive ? styles.navActive : styles.navLink}><span aria-hidden="true" className={styles.navNumber}>{number}</span>{title}</NavLink>)}
    {auth.session?.role === 'administrator' && <NavLink to="/admin" className={({ isActive }) => isActive ? styles.navActive : styles.navLink}><span aria-hidden="true" className={styles.navNumber}>05</span>Administración</NavLink>}
   </nav>
   <div className={styles.sidebarBottom}><span className={styles.smallTag}>JAVA 8 — 11</span><p>Aprende la regla.<br/>Entiende el porqué.</p><span className={styles.sidebarFoot}>Preparación NETEC · ASO / APX</span></div>
  </aside>
  <div className={styles.workspace}>
   <header className={styles.topbar}><span className={styles.breadcrumb}>Autoformación <span>/</span> NETEC ASO/APX</span>
    <div className={styles.account}>{auth.session ? <><span className={styles.avatar}>{auth.session.name.charAt(0)}</span><span>{auth.session.name}</span><button onClick={auth.logout} className={styles.textButton}>Salir</button></> :
     <button className={styles.secondary} onClick={auth.login} disabled={!auth.ready}>{auth.ready ? 'Iniciar sesión' : 'Acceso en preparación'}</button>}</div>
   </header>
   {localEnabled && <div className={styles.localBanner}>Vista local · sin datos reales <div><button onClick={() => auth.localLogin('candidate')}>Probar candidato</button><button onClick={() => auth.localLogin('administrator')}>Probar administrador</button></div></div>}
   <main id="main-content" className={styles.main} tabIndex={-1}>
    {(auth.error || error) && <div role="alert" className={styles.error}>{auth.error || error}</div>}
    {loading && <p role="status">Recuperando tu progreso…</p>}
    <Routes>
     <Route path="/" element={<Dashboard key={auth.session?.sub ?? "preview"} progress={progress} onProgress={setProgress}/>}/>
     <Route path="/apuntes" element={<Notes/>}/>
     <Route path="/apuntes/:id" element={<NoteDetail/>}/>
     <Route path="/examenes" element={<Exams/>}/>
     <Route path="/material" element={<Materials/>}/>
     <Route path="/admin" element={auth.session?.role === 'administrator' ? <Administration/> : <Navigate to="/" replace/>}/>
     <Route path="*" element={<section><h1>No encontramos esta página</h1><Link to="/">Volver a mi ruta</Link></section>}/>
    </Routes>
   </main>
   <footer className={styles.footer}>Tu preparación, a tu ritmo.<span>El temario específico se completará con las referencias aportadas.</span></footer>
  </div>
 </div>;
}
