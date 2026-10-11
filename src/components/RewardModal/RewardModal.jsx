import styles from './RewardModal.module.css';

export default function RewardModal({ mensaje, estrellas = 1, onClose }) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.confetti}>
          {Array.from({ length: 12 }).map((_, i) => (
            <span key={i} className={styles.confettiPiece} style={{ '--i': i }}>
              {['⭐', '✨', '🌟', '💫'][i % 4]}
            </span>
          ))}
        </div>
        <div className={styles.emoji}>🎉</div>
        <h2 className={styles.titulo}>¡Muy bien, Abi!</h2>
        <p className={styles.mensaje}>{mensaje || '¡Lo lograste!'}</p>
        <div className={styles.estrellasGanadas}>
          {Array.from({ length: estrellas }).map((_, i) => (
            <span key={i} className={styles.estrellaAnim} style={{ animationDelay: `${i * 0.1}s` }}>⭐</span>
          ))}
        </div>
        <button className={styles.btn} onClick={onClose}>
          ¡Seguir! 🚀
        </button>
      </div>
    </div>
  );
}
