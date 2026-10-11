import { createContext, useContext, useReducer, useEffect } from 'react';

const ProgressContext = createContext(null);

const initialState = {
  estrellas: 0,
  actividadesCompletadas: [],
};

function loadFromStorage() {
  try {
    const saved = localStorage.getItem('abiAprende');
    return saved ? JSON.parse(saved) : initialState;
  } catch {
    return initialState;
  }
}

function progressReducer(state, action) {
  switch (action.type) {
    case 'GANAR_ESTRELLAS':
      return { ...state, estrellas: state.estrellas + action.cantidad };
    case 'COMPLETAR_ACTIVIDAD':
      if (state.actividadesCompletadas.includes(action.id)) return state;
      return {
        ...state,
        actividadesCompletadas: [...state.actividadesCompletadas, action.id],
      };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

export function ProgressProvider({ children }) {
  const [state, dispatch] = useReducer(progressReducer, undefined, loadFromStorage);

  useEffect(() => {
    localStorage.setItem('abiAprende', JSON.stringify(state));
  }, [state]);

  const ganarEstrellas = (cantidad = 1) => {
    dispatch({ type: 'GANAR_ESTRELLAS', cantidad });
  };

  const completarActividad = (id) => {
    dispatch({ type: 'COMPLETAR_ACTIVIDAD', id });
  };

  const resetProgreso = () => {
    dispatch({ type: 'RESET' });
  };

  return (
    <ProgressContext.Provider value={{ ...state, ganarEstrellas, completarActividad, resetProgreso }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress debe usarse dentro de ProgressProvider');
  return ctx;
}
