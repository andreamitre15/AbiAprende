import { useProgress } from '../../context/ProgressContext';
import Header from '../../components/Header/Header';
import ProgressBar from '../../components/ProgressBar/ProgressBar';
import styles from './Recompensas.module.css';

const PREMIOS = [
  { estrellas: 5,  emoji: '🌟', titulo: 'Primera Estrella',   desc: '¡Empezaste a aprender!' },
  { estrellas: 10, emoji: '👑', titulo: 'Corona de Princesa', desc: '¡Eres una princesa del saber!' },
  { estrellas: 20, emoji: '🦄', titulo: 'Unicornio Mágico',   desc: '¡Eres mágica como un unicornio!' },
  { estrellas: 30, emoji: '🏆', titulo: 'Super Abi',          desc: '¡Eres súper, Abi!' },
  { estrellas: 50, emoji: '🎪', titulo: 'Reina del Saber',    desc: '¡Eres la reina del conocimiento!' },
];

function proximoPremio(estrellas) {
  return PREMIOS.find(p => p.estrellas > estrellas) || null;
}

export default function Recompensas() {
  const { estrellas } = useProgress();
  const proximo = proximoPremio(estrellas);

  return (
    <div className={styles.page}>
      <Header titulo="Mis Recompensas" />
      <main className={styles.main}>
        <div className={styles.totalBox}>
          <span className={styles.totalEmoji}>⭐</span>
          <div>
            <p className={styles.totalNum}>{estrellas}</p>
            <p className={styles.totalLabel}>estrellas ganadas</p>
          </div>
        </div>

        {proximo && (
          <div className={styles.proximoBox}>
            <p className={styles.proximoLabel}>Próxima recompensa: {proximo.emoji} {proximo.titulo}</p>
            <ProgressBar valor={estrellas} maximo={proximo.estrellas} label={`${estrellas} / ${proximo.estrellas} ⭐`} />
          </div>
        )}

        <h2 className={styles.seccionTitulo}>Mis Pegatinas ✨</h2>
        <div className={styles.premiosGrid}>
          {PREMIOS.map((p) => {
            const desbloqueado = estrellas >= p.estrellas;
            return (
              <div
                key={p.titulo}
                className={`${styles.premioCard} ${desbloqueado ? styles.desbloqueado : styles.bloqueado}`}
              >
                <span className={styles.premioEmoji}>{desbloqueado ? p.emoji : '🔒'}</span>
                <p className={styles.premioTitulo}>{p.titulo}</p>
                <p className={styles.premioDesc}>
                  {desbloqueado ? p.desc : `Necesitas ${p.estrellas} ⭐`}
                </p>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
