import { useNavigate, useLocation } from 'react-router-dom';
import { useProgress } from '../../context/ProgressContext';
import styles from './Header.module.css';

export default function Header({ titulo }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { estrellas } = useProgress();
  const isHome = location.pathname === '/';

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        {!isHome && (
          <button className={styles.backBtn} onClick={() => navigate(-1)} aria-label="Volver">
            ←
          </button>
        )}
        {isHome && <span className={styles.logo}>✨</span>}
      </div>

      <h1 className={styles.titulo}>{titulo || 'Abi Aprende'}</h1>

      <div className={styles.right}>
        <span className={styles.stars}>⭐ {estrellas}</span>
      </div>
    </header>
  );
}
