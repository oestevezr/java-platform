import { useState } from 'react';
import styles from '../App.module.css';
export function Prediction() {
 const [selected, setSelected] = useState('');
 const [answered, setAnswered] = useState(false);
 return <section className={styles.prediction} aria-labelledby="prediction-title">
  <p className={styles.eyebrow}>ACTIVIDAD DE MUESTRA · JAVA 8 / 11</p>
  <h3 id="prediction-title">Piensa primero. Comprueba después.</h3>
  <p>¿Qué imprime este fragmento?</p>
  <pre><code>{'int x = 1;\nint y = x++;\nSystem.out.println(x + " " + y);'}</code></pre>
  <fieldset disabled={answered}><legend>Selecciona una salida</legend>{['1 1', '2 1', '2 2'].map((option) =>
   <label className={styles.option} key={option}><input type="radio" name="prediction" value={option} checked={selected === option} onChange={() => setSelected(option)}/><code>{option}</code></label>
  )}</fieldset>
  {!answered && <button className={styles.primary} disabled={!selected} onClick={() => setAnswered(true)}>Comprobar razonamiento</button>}
  {answered && <div role="status" className={styles.feedback}><strong>{selected === '2 1' ? 'Correcto.' : 'La salida es 2 1.'}</strong>
   <p>El postincremento devuelve el valor anterior de x y después lo incrementa. Por eso y recibe 1 y x termina en 2.</p>
   <ol><li>x empieza en 1.</li><li>y recibe el valor 1.</li><li>x aumenta a 2.</li></ol>
   <button className={styles.secondary} onClick={() => { setSelected(''); setAnswered(false); }}>Volver a practicar</button></div>}
 </section>;
}
