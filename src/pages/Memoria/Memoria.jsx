import { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import RewardModal from '../../components/RewardModal/RewardModal';
import { useProgress } from '../../context/ProgressContext';
import { memoriaAnimales, memoriaLetras, memoriaNumeros } from '../../data/memoria.js';
import styles from './Memoria.module.css';

const MODOS = [
  { id: 'animales', label: '🐾 Animales', datos: memoriaAnimales },
  { id: 'letras',   label: '🔤 Letras',   datos: memoriaLetras },
  { id: 'numeros',  label: '🔢 Números',  datos: memoriaNumeros },
];

function crearBaraja(items) {
  const pares = [...items, ...items.map(i => ({ ...i, id: i.id + '_b' }))];
  return pares.sort(() => Math.random() - 0.5);
}

export default function Memoria() {
  const [modo, setModo] = useState(null);
  const [cartas, setCartas] = useState([]);
  const [volteadas, setVolteadas] = useState([]);
  const [emparejadas, setEmparejadas] = useState([]);
  const [bloqueado, setBloqueado] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { ganarEstrellas } = useProgress();

  const iniciarJuego = (m) => {
    setModo(m);
    setCartas(crearBaraja(m.datos));
    setVolteadas([]);
    setEmparejadas([]);
    setBloqueado(false);
    setShowModal(false);
  };

  const voltearCarta = (idx) => {
    if (bloqueado) return;
    if (volteadas.includes(idx)) return;
    if (emparejadas.includes(cartas[idx].valor)) return;

    const nuevasVolteadas = [...volteadas, idx];
    setVolteadas(nuevasVolteadas);

    if (nuevasVolteadas.length === 2) {
      setBloqueado(true);
      const [i1, i2] = nuevasVolteadas;
      if (cartas[i1].valor === cartas[i2].valor) {
        const nuevasEmp = [...emparejadas, cartas[i1].valor];
        setEmparejadas(nuevasEmp);
        ganarEstrellas(1);
        setVolteadas([]);
        setBloqueado(false);
        if (nuevasEmp.length === modo.datos.length) {
          setTimeout(() => setShowModal(true), 400);
        }
      } else {
        setTimeout(() => {
          setVolteadas([]);
          setBloqueado(false);
        }, 900);
      }
    }
  };

  const esVolteada = (idx) => volteadas.includes(idx) || emparejadas.includes(cartas[idx].valor);

  if (!modo) {
    return (
      <div className={styles.page}>
        <Header titulo="Juego de Memoria" />
        <main className={styles.selector}>
          <p className={styles.instruccion}>¿Con qué quieres jugar?</p>
          {MODOS.map(m => (
            <button key={m.id} className={styles.modoBtn} onClick={() => iniciarJuego(m)}>
              {m.label}
            </button>
          ))}
        </main>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Header titulo="Juego de Memoria" />
      <main className={styles.main}>
        <div className={styles.info}>
          <span className={styles.pares}>✅ {emparejadas.length} / {modo.datos.length} pares</span>
          <button className={styles.btnCambiar} onClick={() => setModo(null)}>Cambiar modo</button>
        </div>

        <div className={styles.grid} style={{ '--cols': modo.datos.length <= 8 ? 4 : 4 }}>
          {cartas.map((carta, idx) => (
            <button
              key={carta.id}
              className={`${styles.carta} ${esVolteada(idx) ? styles.cartaVoltada : ''} ${emparejadas.includes(carta.valor) ? styles.cartaEmparejada : ''}`}
              onClick={() => voltearCarta(idx)}
              aria-label={esVolteada(idx) ? carta.label : 'Carta boca abajo'}
            >
              <span className={styles.cartaFrente}>{carta.valor}</span>
              <span className={styles.cartaDorso}>🌟</span>
            </button>
          ))}
        </div>
      </main>

      {showModal && (
        <RewardModal
          mensaje="¡Encontraste todos los pares! ¡Eres increíble! 🧩"
          estrellas={3}
          onClose={() => iniciarJuego(modo)}
        />
      )}
    </div>
  );
}
