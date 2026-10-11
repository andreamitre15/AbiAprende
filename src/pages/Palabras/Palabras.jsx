import { useState } from 'react';
import Header from '../../components/Header/Header';
import { palabras } from '../../data/palabras.js';
import styles from './Palabras.module.css';

export default function Palabras() {
  const [activa, setActiva] = useState(null);

  return (
    <div className={styles.page}>
      <Header titulo="Aprender Palabras" />
      <main className={styles.main}>
        <p className={styles.instruccion}>Toca una palabra para verla de cerca 👇</p>
        <div className={styles.grid}>
          {palabras.map((p, i) => (
            <button
              key={p.palabra}
              className={styles.card}
              style={{ animationDelay: `${i * 0.04}s` }}
              onClick={() => setActiva(activa === i ? null : i)}
            >
              <span className={styles.emoji}>{p.emoji}</span>
              {activa === i ? (
                <div className={styles.letrasAnimadas}>
                  {p.palabra.split('').map((letra, j) => (
                    <span
                      key={j}
                      className={styles.letraAnim}
                      style={{ animationDelay: `${j * 0.1}s` }}
                    >
                      {letra}
                    </span>
                  ))}
                </div>
              ) : (
                <span className={styles.palabraTexto}>{p.palabra}</span>
              )}
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
