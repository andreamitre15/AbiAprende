import { useState } from 'react';
import Header from '../../components/Header/Header';
import RewardModal from '../../components/RewardModal/RewardModal';
import { useProgress } from '../../context/ProgressContext';
import { colores } from '../../data/colores.js';
import styles from './Colores.module.css';

function mezclar(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function generarRonda(colores) {
  const correcto = colores[Math.floor(Math.random() * colores.length)];
  const otros = colores.filter(c => c.nombre !== correcto.nombre);
  const opciones = mezclar([correcto, ...mezclar(otros).slice(0, 3)]);
  return { correcto, opciones };
}

export default function Colores() {
  const [vista, setVista] = useState('grid');
  const [ronda, setRonda] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { ganarEstrellas } = useProgress();

  const iniciarJuego = () => {
    setRonda(generarRonda(colores));
    setFeedback(null);
    setVista('juego');
  };

  const responder = (color) => {
    if (feedback) return;
    const correcto = color.nombre === ronda.correcto.nombre;
    setFeedback(correcto ? 'correcto' : 'incorrecto');
    if (correcto) {
      ganarEstrellas(1);
      setShowModal(true);
    }
  };

  const siguiente = () => {
    setRonda(generarRonda(colores));
    setFeedback(null);
    setShowModal(false);
  };

  if (vista === 'juego') {
    return (
      <div className={styles.page}>
        <Header titulo="Colores" />
        <div className={styles.juego}>
          <p className={styles.pregunta}>
            ¿Dónde está el color <span style={{ color: ronda.correcto.hex, fontFamily: 'Fredoka One, cursive' }}>
              {ronda.correcto.nombre}
            </span>?
          </p>
          <div className={styles.opcionesGrid}>
            {ronda.opciones.map((c) => (
              <button
                key={c.nombre}
                className={`${styles.circulo} ${feedback && c.nombre === ronda.correcto.nombre ? styles.circuloCorrecto : ''}`}
                style={{ background: c.hex, borderColor: c.hex }}
                onClick={() => responder(c)}
                aria-label={c.nombre}
              />
            ))}
          </div>
          {feedback === 'correcto' && <p className={styles.fbOk}>✅ ¡Correcto!</p>}
          {feedback === 'incorrecto' && <p className={styles.fbMal}>❌ ¡Inténtalo!</p>}
          <button className={styles.btnVolver} onClick={() => setVista('grid')}>← Volver</button>
        </div>
        {showModal && <RewardModal mensaje={`¡Encontraste el ${ronda.correcto.nombre}! 🎨`} estrellas={1} onClose={siguiente} />}
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Header titulo="Colores" />
      <main className={styles.main}>
        <p className={styles.instruccion}>Conoce los colores 🌈</p>
        <div className={styles.grid}>
          {colores.map((c, i) => (
            <div key={c.nombre} className={styles.card} style={{ background: c.hex, animationDelay: `${i * 0.05}s` }}>
              <span className={styles.emoji}>{c.emoji}</span>
              <span className={styles.nombre} style={{ color: c.textColor }}>{c.nombre}</span>
            </div>
          ))}
        </div>
        <button className={styles.btnJugar} onClick={iniciarJuego}>
          🎮 ¡Jugar!
        </button>
      </main>
    </div>
  );
}
