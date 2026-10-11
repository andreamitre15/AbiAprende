import { useState } from 'react';
import Header from '../../components/Header/Header';
import RewardModal from '../../components/RewardModal/RewardModal';
import { useProgress } from '../../context/ProgressContext';
import { formas } from '../../data/formas.js';
import styles from './Formas.module.css';

function mezclar(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function generarRonda(formas) {
  const correcta = formas[Math.floor(Math.random() * formas.length)];
  const otras = formas.filter(f => f.nombre !== correcta.nombre);
  const opciones = mezclar([correcta, ...mezclar(otras).slice(0, 3)]);
  return { correcta, opciones };
}

export default function Formas() {
  const [vista, setVista] = useState('grid');
  const [seleccionada, setSeleccionada] = useState(null);
  const [ronda, setRonda] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { ganarEstrellas } = useProgress();

  const abrirDetalle = (i) => {
    setSeleccionada(i);
    setVista('detalle');
  };

  const iniciarJuego = () => {
    setRonda(generarRonda(formas));
    setFeedback(null);
    setVista('juego');
  };

  const responder = (forma) => {
    if (feedback) return;
    const correcto = forma.nombre === ronda.correcta.nombre;
    setFeedback(correcto ? 'correcto' : 'incorrecto');
    if (correcto) {
      ganarEstrellas(1);
      setShowModal(true);
    }
  };

  const siguiente = () => {
    setRonda(generarRonda(formas));
    setFeedback(null);
    setShowModal(false);
  };

  if (vista === 'detalle') {
    const f = formas[seleccionada];
    return (
      <div className={styles.page}>
        <Header titulo="Formas" />
        <div className={styles.detalle}>
          <div className={styles.formaGrande}>{f.emoji}</div>
          <h2 className={styles.nombre}>{f.nombre}</h2>
          <p className={styles.descripcion}>{f.descripcion}</p>
          {f.lados > 0 && <p className={styles.lados}>Lados: <strong>{f.lados}</strong></p>}
          <div className={styles.btnGroup}>
            <button className={styles.btnVolver} onClick={() => setVista('grid')}>← Volver</button>
            <button className={styles.btnJugar} onClick={iniciarJuego}>¡Jugar! 🎮</button>
          </div>
        </div>
      </div>
    );
  }

  if (vista === 'juego') {
    return (
      <div className={styles.page}>
        <Header titulo="Formas" />
        <div className={styles.juego}>
          <p className={styles.pregunta}>¿Cuál es el <span className={styles.nombreForma}>{ronda.correcta.nombre}</span>?</p>
          <div className={styles.opcionesGrid}>
            {ronda.opciones.map((f) => (
              <button
                key={f.nombre}
                className={`${styles.opcion} ${feedback && f.nombre === ronda.correcta.nombre ? styles.opcionCorrecta : ''} ${feedback && f.nombre !== ronda.correcta.nombre ? styles.opcionWrong : ''}`}
                onClick={() => responder(f)}
              >
                <span className={styles.opcionEmoji}>{f.emoji}</span>
                <span className={styles.opcionNombre}>{f.nombre}</span>
              </button>
            ))}
          </div>
          {feedback === 'incorrecto' && <p className={styles.fbMal}>❌ ¡Inténtalo!</p>}
          <button className={styles.btnVolver} onClick={() => setVista('grid')}>← Volver</button>
        </div>
        {showModal && <RewardModal mensaje={`¡Encontraste el ${ronda.correcta.nombre}! 🔷`} estrellas={1} onClose={siguiente} />}
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Header titulo="Formas" />
      <main className={styles.main}>
        <p className={styles.instruccion}>Aprende las formas 🔷</p>
        <div className={styles.grid}>
          {formas.map((f, i) => (
            <button key={f.nombre} className={styles.card} style={{ animationDelay: `${i * 0.05}s` }} onClick={() => abrirDetalle(i)}>
              <span className={styles.emoji}>{f.emoji}</span>
              <span className={styles.cardNombre}>{f.nombre}</span>
            </button>
          ))}
        </div>
        <button className={styles.btnJugar} onClick={iniciarJuego}>🎮 ¡Jugar!</button>
      </main>
    </div>
  );
}
