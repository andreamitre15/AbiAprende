import { useState } from 'react';
import Header from '../../components/Header/Header';
import RewardModal from '../../components/RewardModal/RewardModal';
import { useProgress } from '../../context/ProgressContext';
import { numeros } from '../../data/numeros.js';
import styles from './Numeros.module.css';

function generarOpciones(correcto) {
  const set = new Set([correcto]);
  while (set.size < 3) {
    set.add(Math.floor(Math.random() * 10) + 1);
  }
  return [...set].sort(() => Math.random() - 0.5);
}

export default function Numeros() {
  const [vista, setVista] = useState('grid'); // grid | detalle | actividad
  const [seleccionado, setSeleccionado] = useState(null);
  const [opciones, setOpciones] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { ganarEstrellas } = useProgress();

  const abrirDetalle = (i) => {
    setSeleccionado(i);
    setVista('detalle');
  };

  const iniciarActividad = (i) => {
    setSeleccionado(i);
    setOpciones(generarOpciones(numeros[i].numero));
    setFeedback(null);
    setVista('actividad');
  };

  const responder = (opcion) => {
    const correcto = opcion === numeros[seleccionado].numero;
    setFeedback(correcto ? 'correcto' : 'incorrecto');
    if (correcto) {
      ganarEstrellas(1);
      setShowModal(true);
    }
  };

  const siguiente = () => {
    const siguiente = (seleccionado + 1) % numeros.length;
    iniciarActividad(siguiente);
    setShowModal(false);
  };

  if (vista === 'detalle') {
    const n = numeros[seleccionado];
    return (
      <div className={styles.page}>
        <Header titulo="Números" />
        <div className={styles.detalle}>
          <div className={styles.numGrande}>{n.numero}</div>
          <div className={styles.nombre}>{n.nombre}</div>
          <div className={styles.emojisWrap}>
            {Array.from({ length: n.numero }).map((_, i) => (
              <span key={i} className={styles.emojiItem} style={{ animationDelay: `${i * 0.08}s` }}>{n.emoji}</span>
            ))}
          </div>
          <div className={styles.btnGroup}>
            <button className={styles.btnVolver} onClick={() => setVista('grid')}>← Volver</button>
            <button className={styles.btnActividad} onClick={() => iniciarActividad(seleccionado)}>¡Jugar! 🎮</button>
          </div>
        </div>
      </div>
    );
  }

  if (vista === 'actividad') {
    const n = numeros[seleccionado];
    return (
      <div className={styles.page}>
        <Header titulo="Números" />
        <div className={styles.actividad}>
          <p className={styles.pregunta}>¿Cuántos {n.emoji} hay?</p>
          <div className={styles.emojisWrap}>
            {Array.from({ length: n.numero }).map((_, i) => (
              <span key={i} className={styles.emojiItem}>{n.emoji}</span>
            ))}
          </div>
          <div className={styles.opciones}>
            {opciones.map((op) => (
              <button
                key={op}
                className={`${styles.opcion} ${feedback ? (op === n.numero ? styles.opcionCorrecta : styles.opcionWrong) : ''}`}
                onClick={() => !feedback && responder(op)}
              >
                {op}
              </button>
            ))}
          </div>
          {feedback === 'incorrecto' && <p className={styles.fbMal}>❌ ¡Inténtalo de nuevo!</p>}
          <button className={styles.btnVolver} onClick={() => setVista('grid')}>← Volver</button>
        </div>
        {showModal && <RewardModal mensaje="¡Contaste bien! 🔢" estrellas={1} onClose={siguiente} />}
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Header titulo="Números" />
      <main className={styles.main}>
        <p className={styles.instruccion}>Toca un número para aprender 👇</p>
        <div className={styles.grid}>
          {numeros.map((n, i) => (
            <button key={n.numero} className={styles.card} style={{ animationDelay: `${i * 0.05}s` }} onClick={() => abrirDetalle(i)}>
              <span className={styles.num}>{n.numero}</span>
              <span className={styles.emojiCard}>{n.emoji}</span>
              <span className={styles.nombreCard}>{n.nombre}</span>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
