import { useState } from 'react';
import Header from '../../components/Header/Header';
import { letras } from '../../data/letras.js';
import styles from './Letras.module.css';

export default function Letras() {
  const [seleccionada, setSeleccionada] = useState(null);

  if (seleccionada !== null) {
    const l = letras[seleccionada];
    return (
      <div className={styles.page}>
        <Header titulo="Aprender Letras" />
        <div className={styles.detalle} style={{ background: l.color + '22' }}>
          <div className={styles.letraGrande} style={{ color: l.color }}>
            {l.letra}
          </div>
          <div className={styles.letraMin} style={{ color: l.color }}>
            {l.letra.toLowerCase()}
          </div>
          <div className={styles.emojiGrande}>{l.emoji}</div>
          <p className={styles.palabraEjemplo}>
            <span style={{ color: l.color, fontFamily: 'Fredoka One, cursive' }}>{l.letra}</span>
            {l.palabra.slice(1).toLowerCase()} → <strong>{l.emoji} {l.palabra}</strong>
          </p>
          <button className={styles.btnVolver} onClick={() => setSeleccionada(null)}>
            ← Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Header titulo="Aprender Letras" />
      <main className={styles.main}>
        <p className={styles.instruccion}>Toca una letra para aprender 👇</p>
        <div className={styles.grid}>
          {letras.map((l, i) => (
            <button
              key={l.letra}
              className={styles.card}
              style={{ background: l.color, animationDelay: `${i * 0.03}s` }}
              onClick={() => setSeleccionada(i)}
            >
              <span className={styles.letra}>{l.letra}</span>
              <span className={styles.letraEmoji}>{l.emoji}</span>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
