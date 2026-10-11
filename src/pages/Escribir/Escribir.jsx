import { useState, useRef } from 'react';
import Header from '../../components/Header/Header';
import RewardModal from '../../components/RewardModal/RewardModal';
import { useProgress } from '../../context/ProgressContext';
import { palabras } from '../../data/palabras.js';
import styles from './Escribir.module.css';

function normalizar(str) {
  return str
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export default function Escribir() {
  const [indice, setIndice] = useState(0);
  const [input, setInput] = useState('');
  const [estado, setEstado] = useState('idle'); // idle | correcto | incorrecto
  const [showModal, setShowModal] = useState(false);
  const { ganarEstrellas } = useProgress();
  const inputRef = useRef(null);

  const palabra = palabras[indice];

  const verificar = () => {
    if (!input.trim()) return;
    const correcto = normalizar(input.trim()) === normalizar(palabra.palabra);
    if (correcto) {
      setEstado('correcto');
      ganarEstrellas(1);
      setShowModal(true);
    } else {
      setEstado('incorrecto');
      setTimeout(() => setEstado('idle'), 800);
    }
  };

  const siguiente = () => {
    setIndice((prev) => (prev + 1) % palabras.length);
    setInput('');
    setEstado('idle');
    setShowModal(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') verificar();
  };

  return (
    <div className={styles.page}>
      <Header titulo="Escribir Palabras" />
      <main className={styles.main}>
        <p className={styles.instruccion}>¿Qué ves en la imagen? ¡Escríbelo!</p>

        <div className={styles.tarjeta}>
          <span className={styles.emoji}>{palabra.emoji}</span>
          <p className={styles.pista}>Empieza con: <strong>{palabra.palabra[0]}</strong></p>
        </div>

        <div className={styles.inputWrap}>
          <input
            ref={inputRef}
            type="text"
            className={`${styles.input} ${estado === 'correcto' ? styles.correcto : ''} ${estado === 'incorrecto' ? styles.incorrecto : ''}`}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribe aquí..."
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
          />
        </div>

        {estado === 'correcto' && (
          <p className={styles.feedbackOk}>✅ ¡Correcto! ¡Eres una campeona!</p>
        )}
        {estado === 'incorrecto' && (
          <p className={styles.feedbackMal}>❌ ¡Casi! Inténtalo de nuevo 💪</p>
        )}

        <div className={styles.botones}>
          <button className={styles.btnVerificar} onClick={verificar}>
            ✅ Verificar
          </button>
          <button className={styles.btnSiguiente} onClick={siguiente}>
            Siguiente →
          </button>
        </div>

        <p className={styles.progreso}>{indice + 1} / {palabras.length}</p>
      </main>

      {showModal && (
        <RewardModal
          mensaje={`¡Escribiste "${palabra.palabra}" perfecto! 🎉`}
          estrellas={1}
          onClose={siguiente}
        />
      )}
    </div>
  );
}
