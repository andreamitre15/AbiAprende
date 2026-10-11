import { HashRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Letras from './pages/Letras/Letras';
import Palabras from './pages/Palabras/Palabras';
import Escribir from './pages/Escribir/Escribir';
import Trazado from './pages/Trazado/Trazado';
import Numeros from './pages/Numeros/Numeros';
import Colores from './pages/Colores/Colores';
import Formas from './pages/Formas/Formas';
import Memoria from './pages/Memoria/Memoria';
import Recompensas from './pages/Recompensas/Recompensas';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/"            element={<Home />} />
        <Route path="/letras"      element={<Letras />} />
        <Route path="/palabras"    element={<Palabras />} />
        <Route path="/escribir"    element={<Escribir />} />
        <Route path="/trazado"     element={<Trazado />} />
        <Route path="/numeros"     element={<Numeros />} />
        <Route path="/colores"     element={<Colores />} />
        <Route path="/formas"      element={<Formas />} />
        <Route path="/memoria"     element={<Memoria />} />
        <Route path="/recompensas" element={<Recompensas />} />
      </Routes>
    </HashRouter>
  );
}
