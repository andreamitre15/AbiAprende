import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import styles from './Home.module.css';

const modulos = [
  { ruta: '/letras',      emoji: '🔤', titulo: 'Letras',         color: '#FF6B6B', bg: '#FFE5E5' },
  { ruta: '/palabras',    emoji: '📖', titulo: 'Palabras',       color: '#4ECDC4', bg: '#E5F9F8' },
  { ruta: '/escribir',    emoji: '✏️', titulo: 'Escribir',       color: '#45B7D1', bg: '#E5F4FA' },
  { ruta: '/trazado',     emoji: '✍️', titulo: 'Trazado',        color: '#DDA0DD', bg: '#F5E5F5' },
  { ruta: '/numeros',     emoji: '🔢', titulo: 'Números',        color: '#F7DC6F', bg: '#FEFAE5' },
  { ruta: '/colores',     emoji: '🎨', titulo: 'Colores',        color: '#96CEB4', bg: '#EAF7F0' },
  { ruta: '/formas',      emoji: '🔷', titulo: 'Formas',         color: '#AED6F1', bg: '#EAF4FB' },
  { ruta: '/memoria',     emoji: '🧩', titulo: 'Memoria',        color: '#FAD7A0', bg: '#FEF5E7' },
  { ruta: '/recompensas', emoji: '⭐', titulo: 'Recompensas',    color: '#FFD700', bg: '#FFFBE5' },
];

const frases = [
  '¡Hola Abi! 🌟',
  '¡Qué bueno verte! ✨',
  'Hoy vamos a aprender jugando 🎉',
];

export default function Home() {
  const navigate = useNavigate();
  const frase = frases[Math.floor(Date.now() / 10000) % frases.length];

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <div className={styles.bienvenida}>
          <div className={styles.princesa}>👸</div>
          <h2 className={styles.frase}>{frase}</h2>
          <p className={styles.subtitulo}>¿Qué quieres aprender hoy?</p>
        </div>

        <div className={styles.grid}>
          {modulos.map((m) => (
            <button
              key={m.ruta}
              className={styles.card}
              style={{ background: m.bg, borderColor: m.color }}
              onClick={() => navigate(m.ruta)}
            >
              <span className={styles.cardEmoji}>{m.emoji}</span>
              <span className={styles.cardTitulo} style={{ color: m.color }}>
                {m.titulo}
              </span>
            </button>
          ))}
        </div>
      </main>

      {/* Estrellas decorativas */}
      <div className={styles.starsDecor} aria-hidden="true">
        {['✨','🌟','💫','⭐','✨','🌟','💫'].map((s, i) => (
          <span key={i} className={styles.star} style={{ '--delay': `${i * 0.4}s`, '--left': `${10 + i * 12}%` }}>{s}</span>
        ))}
      </div>
    </div>
  );
}
