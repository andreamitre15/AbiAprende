import { useRef, useEffect, useState } from 'react';
import Header from '../../components/Header/Header';
import RewardModal from '../../components/RewardModal/RewardModal';
import { useProgress } from '../../context/ProgressContext';
import styles from './Trazado.module.css';

const letrasDisponibles = ['A', 'B', 'C', 'M', 'O', 'S'];
const coloresTrazado = ['#FF69B4', '#45B7D1', '#FFD700', '#96CEB4', '#DDA0DD', '#FF8C00'];

export default function Trazado() {
  const canvasRef = useRef(null);
  const [indice, setIndice] = useState(0);
  const [dibujando, setDibujando] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const posRef = useRef(null);
  const { ganarEstrellas } = useProgress();

  const letra = letrasDisponibles[indice];
  const color = coloresTrazado[indice];
  const esUltima = indice === letrasDisponibles.length - 1;

  const dibujarGuia = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = `bold ${canvas.height * 0.75}px Fredoka One, cursive`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(200,200,200,0.35)';
    ctx.fillText(letra, canvas.width / 2, canvas.height / 2);
  };

  useEffect(() => {
    dibujarGuia();
  }, [indice]);

  const getPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if (e.touches) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const startDraw = (e) => {
    e.preventDefault();
    setDibujando(true);
    posRef.current = getPos(e, canvasRef.current);
  };

  const draw = (e) => {
    e.preventDefault();
    if (!dibujando) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const pos = getPos(e, canvas);
    ctx.beginPath();
    ctx.moveTo(posRef.current.x, posRef.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = color;
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
    posRef.current = pos;
  };

  const stopDraw = (e) => {
    e.preventDefault();
    setDibujando(false);
  };

  const limpiar = () => dibujarGuia();

  const siguiente = () => {
    if (esUltima) {
      // Terminó todas las letras → mostrar felicitación
      ganarEstrellas(2);
      setShowModal(true);
    } else {
      setIndice((prev) => prev + 1);
    }
  };

  const reiniciar = () => {
    setIndice(0);
    setShowModal(false);
  };

  return (
    <div className={styles.page}>
      <Header titulo="Trazado de Letras" />
      <main className={styles.main}>

        <div className={styles.progresoBarra}>
          {letrasDisponibles.map((l, i) => (
            <div
              key={l}
              className={`${styles.progresoItem} ${i < indice ? styles.progresoHecho : ''} ${i === indice ? styles.progresoActual : ''}`}
            >
              {i < indice ? '✅' : l}
            </div>
          ))}
        </div>

        <p className={styles.instruccion}>
          Sigue la letra con tu dedo ✍️
        </p>

        <div className={styles.letraLabel} style={{ color }}>
          {letra}
        </div>

        <canvas
          ref={canvasRef}
          width={320}
          height={320}
          className={styles.canvas}
          style={{ borderColor: color }}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={stopDraw}
          onMouseLeave={stopDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={stopDraw}
        />

        <div className={styles.botones}>
          <button className={styles.btnLimpiar} onClick={limpiar}>
            🧹 Limpiar
          </button>
          <button
            className={styles.btnSiguiente}
            style={{ background: `linear-gradient(135deg, ${color}, #FFD700)` }}
            onClick={siguiente}
          >
            {esUltima ? '¡Terminé! 🎉' : 'Siguiente →'}
          </button>
        </div>

      </main>

      {showModal && (
        <RewardModal
          mensaje="¡Trazaste todas las letras! ¡Eres una artista! 🎨"
          estrellas={2}
          onClose={reiniciar}
        />
      )}
    </div>
  );
}
