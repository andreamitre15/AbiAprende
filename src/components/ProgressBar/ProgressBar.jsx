import styles from './ProgressBar.module.css';

export default function ProgressBar({ valor, maximo, label }) {
  const porcentaje = Math.min((valor / maximo) * 100, 100);

  return (
    <div className={styles.container}>
      {label && <p className={styles.label}>{label}</p>}
      <div className={styles.bar}>
        <div className={styles.fill} style={{ width: `${porcentaje}%` }} />
      </div>
      <span className={styles.texto}>{valor} / {maximo}</span>
    </div>
  );
}
