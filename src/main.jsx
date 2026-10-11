import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ProgressProvider } from './context/ProgressContext';
import './styles/globals.css';
import './styles/animations.css';
import App from './App';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ProgressProvider>
      <App />
    </ProgressProvider>
  </StrictMode>
);
