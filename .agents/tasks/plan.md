# Plan de Implementación — Abi Aprende MVP

## Contexto del proyecto

- **Framework:** React 18 + Vite 5
- **Lenguaje:** JavaScript (sin TypeScript)
- **Estilos:** CSS puro con variables CSS (sin librerías de UI externas)
- **Routing:** react-router-dom v6
- **Persistencia:** localStorage vía React Context
- **Público:** niña de 4 años (Abril / Abi) — interfaz mobile-first, botones grandes, tipografía grande, colores vivos
- **Idioma:** español latino en toda la UI
- **Directorio raíz del proyecto:** `c:\Users\Andrea\Desktop\Coder\AbiAprende`

---

## Decisiones de arquitectura

1. **CSS puro con variables CSS** en lugar de Tailwind/styled-components: evita dependencias extra y permite control total del tema visual infantil (colores pastel, fuentes redondeadas, animaciones CSS).
2. **React Context + localStorage** para progreso: simple, sin Redux; persiste estrellas, pegatinas y módulos completados entre sesiones.
3. **Una ruta por módulo** con react-router-dom; la raíz `/` es el menú principal (Home).
4. **Archivos de datos en `src/data/`**: los datos de letras, palabras, números, colores, formas y memoria se declaran en archivos JS separados para que sean fáciles de ampliar sin tocar los componentes.
5. **Web Speech API (SpeechSynthesis)** para pronunciación de letras y palabras — no requiere archivos de audio externos, funciona en Chrome/Edge/Safari en tablets y móviles modernos.
6. **Canvas API nativo** para el módulo de trazado de letras — no requiere librerías de canvas externas.
7. **Fuente Google Fonts "Nunito"** — redondeada, legible, amigable para niños; se carga vía `<link>` en `index.html`.

---

## Estructura de carpetas objetivo

```
AbiAprende/
├── index.html
├── vite.config.js
├── package.json
├── public/
│   └── favicon.svg          (estrella de princesa)
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css             (variables CSS, reset, estilos globales)
    ├── data/
    │   ├── letras.js
    │   ├── palabras.js
    │   ├── numeros.js
    │   ├── colores.js
    │   ├── formas.js
    │   └── memoria.js
    ├── context/
    │   └── ProgressContext.jsx
    ├── components/
    │   ├── Header.jsx / Header.css
    │   ├── StarCounter.jsx / StarCounter.css
    │   ├── ProgressBar.jsx / ProgressBar.css
    │   ├── RewardModal.jsx / RewardModal.css
    │   ├── LetterCard.jsx / LetterCard.css
    │   ├── WordCard.jsx / WordCard.css
    │   ├── NumberCard.jsx / NumberCard.css
    │   └── MemoryGame.jsx / MemoryGame.css
    └── pages/
        ├── Home.jsx / Home.css
        ├── AprendizajeLetras.jsx / AprendizajeLetras.css
        ├── AprendizajePalabras.jsx / AprendizajePalabras.css
        ├── EscribirPalabras.jsx / EscribirPalabras.css
        ├── TrazadoLetras.jsx / TrazadoLetras.css
        ├── Numeros.jsx / Numeros.css
        ├── Colores.jsx / Colores.css
        ├── Formas.jsx / Formas.css
        ├── JuegoMemoria.jsx / JuegoMemoria.css
        └── Recompensas.jsx / Recompensas.css
```

---

## Pasos de implementación

---

- [ ] 1. **Inicializar el proyecto Vite**

  Ejecutar dentro de `c:\Users\Andrea\Desktop\Coder\AbiAprende`:
  ```
  npm create vite@latest . -- --template react
  ```
  Cuando Vite pregunte si sobreescribir archivos existentes, seleccionar "Ignore files and continue" (opción que permite continuar sin borrar `.agents/`).
  Luego:
  ```
  npm install
  npm install react-router-dom
  ```
  Limpiar los archivos de plantilla que Vite genera y que no se usarán:
  - Borrar `src/App.css` (se reemplaza con estilos propios)
  - Borrar `src/assets/react.svg`
  - Vaciar `src/App.jsx` (se reescribe en el paso 7)
  - Vaciar `src/index.css` (se reescribe en el paso 8)

  **Archivos afectados:** `package.json`, `vite.config.js`, `index.html`, `src/main.jsx`

  **Verificación:** `npm run dev` — la app corre en `http://localhost:5173` sin errores en consola.

---

- [ ] 2. **Configurar `index.html` y `src/main.jsx`**

  En `index.html`:
  - Título: `Abi Aprende 🌟`
  - Agregar en `<head>` el link de Google Fonts Nunito:
    ```html
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap" rel="stylesheet">
    ```
  - `<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">`
  - `<meta name="theme-color" content="#ff6eb4">`

  En `src/main.jsx`:
  - Importar `BrowserRouter` de `react-router-dom`
  - Envolver `<App />` con `<BrowserRouter>`
  - Envolver también con `<ProgressProvider>` (del Context creado en el paso 4)

  **Archivos:** `index.html`, `src/main.jsx`

  **Verificación:** `npm run dev` sin errores. El título en el navegador dice "Abi Aprende 🌟".

---

- [ ] 3. **Crear archivos de datos en `src/data/`**

  Crear el directorio `src/data/` y los siguientes archivos:

  ### `src/data/letras.js`
  Array de 27 objetos (A-Z + CH opcional):
  ```js
  export const LETRAS = [
    { letra: 'A', emoji: '🐝', palabra: 'Abeja', color: '#FF6B6B' },
    { letra: 'B', emoji: '⛵', palabra: 'Barco', color: '#4ECDC4' },
    { letra: 'C', emoji: '🏠', palabra: 'Casa', color: '#FFE66D' },
    { letra: 'D', emoji: '🦷', palabra: 'Diente', color: '#A8E6CF' },
    { letra: 'E', emoji: '⭐', palabra: 'Estrella', color: '#FF8B94' },
    { letra: 'F', emoji: '🌸', palabra: 'Flor', color: '#B5EAD7' },
    { letra: 'G', emoji: '🐱', palabra: 'Gato', color: '#C7CEEA' },
    { letra: 'H', emoji: '🧊', palabra: 'Hielo', color: '#FFDAC1' },
    { letra: 'I', emoji: '🏝️', palabra: 'Isla', color: '#FF9AA2' },
    { letra: 'J', emoji: '🦒', palabra: 'Jirafa', color: '#FFB7B2' },
    { letra: 'K', emoji: '🥝', palabra: 'Kiwi', color: '#FFEAA7' },
    { letra: 'L', emoji: '🦁', palabra: 'León', color: '#DDA0DD' },
    { letra: 'M', emoji: '🍎', palabra: 'Manzana', color: '#98D8C8' },
    { letra: 'N', emoji: '⛄', palabra: 'Nieve', color: '#F7D794' },
    { letra: 'Ñ', emoji: '🎵', palabra: 'Ñoño', color: '#B8B3E9' },
    { letra: 'O', emoji: '🐑', palabra: 'Oveja', color: '#FCE4D6' },
    { letra: 'P', emoji: '🦋', palabra: 'Pájaro', color: '#D4F1F4' },
    { letra: 'Q', emoji: '🧀', palabra: 'Queso', color: '#FED9B7' },
    { letra: 'R', emoji: '🐸', palabra: 'Rana', color: '#C9F7C5' },
    { letra: 'S', emoji: '☀️', palabra: 'Sol', color: '#FFD3B6' },
    { letra: 'T', emoji: '🐢', palabra: 'Tortuga', color: '#D5E8D4' },
    { letra: 'U', emoji: '🍇', palabra: 'Uvas', color: '#E1D5E7' },
    { letra: 'V', emoji: '🐄', palabra: 'Vaca', color: '#DAE8FC' },
    { letra: 'W', emoji: '🌊', palabra: 'Waves', color: '#D5E8D4' },
    { letra: 'X', emoji: '🎸', palabra: 'Xilófono', color: '#FFE6CC' },
    { letra: 'Y', emoji: '🌿', palabra: 'Yerba', color: '#D5E8D4' },
    { letra: 'Z', emoji: '🦓', palabra: 'Zorro', color: '#F8CECC' },
  ];
  ```

  ### `src/data/palabras.js`
  ```js
  export const PALABRAS = [
    { palabra: 'ABI',   emoji: '👧', descripcion: 'Abi' },
    { palabra: 'MAMÁ',  emoji: '👩', descripcion: 'Mamá' },
    { palabra: 'PAPÁ',  emoji: '👨', descripcion: 'Papá' },
    { palabra: 'CASA',  emoji: '🏠', descripcion: 'Casa' },
    { palabra: 'SOL',   emoji: '☀️', descripcion: 'Sol' },
    { palabra: 'LUNA',  emoji: '🌙', descripcion: 'Luna' },
    { palabra: 'PERRO', emoji: '🐶', descripcion: 'Perro' },
    { palabra: 'GATO',  emoji: '🐱', descripcion: 'Gato' },
    { palabra: 'FLOR',  emoji: '🌸', descripcion: 'Flor' },
    { palabra: 'ÁRBOL', emoji: '🌳', descripcion: 'Árbol' },
    { palabra: 'NUBE',  emoji: '☁️', descripcion: 'Nube' },
    { palabra: 'PATO',  emoji: '🦆', descripcion: 'Pato' },
  ];
  ```

  ### `src/data/numeros.js`
  ```js
  export const NUMEROS = [
    { numero: 1, emoji: '⭐', texto: 'uno',   objetos: ['⭐'] },
    { numero: 2, emoji: '🌙', texto: 'dos',   objetos: ['🌙','🌙'] },
    { numero: 3, emoji: '🍎', texto: 'tres',  objetos: ['🍎','🍎','🍎'] },
    { numero: 4, emoji: '🌸', texto: 'cuatro',objetos: ['🌸','🌸','🌸','🌸'] },
    { numero: 5, emoji: '⭐', texto: 'cinco', objetos: ['⭐','⭐','⭐','⭐','⭐'] },
    { numero: 6, emoji: '🐝', texto: 'seis',  objetos: ['🐝','🐝','🐝','🐝','🐝','🐝'] },
    { numero: 7, emoji: '🦋', texto: 'siete', objetos: ['🦋','🦋','🦋','🦋','🦋','🦋','🦋'] },
    { numero: 8, emoji: '🍇', texto: 'ocho',  objetos: ['🍇','🍇','🍇','🍇','🍇','🍇','🍇','🍇'] },
    { numero: 9, emoji: '🐠', texto: 'nueve', objetos: ['🐠','🐠','🐠','🐠','🐠','🐠','🐠','🐠','🐠'] },
    { numero: 10,emoji: '🎉', texto: 'diez',  objetos: ['🎉','🎉','🎉','🎉','🎉','🎉','🎉','🎉','🎉','🎉'] },
  ];
  ```

  ### `src/data/colores.js`
  ```js
  export const COLORES = [
    { nombre: 'Rojo',    hex: '#FF4444', emoji: '❤️' },
    { nombre: 'Azul',    hex: '#4488FF', emoji: '💙' },
    { nombre: 'Verde',   hex: '#44BB44', emoji: '💚' },
    { nombre: 'Amarillo',hex: '#FFDD00', emoji: '💛' },
    { nombre: 'Rosa',    hex: '#FF88BB', emoji: '🩷' },
    { nombre: 'Violeta', hex: '#9944DD', emoji: '💜' },
    { nombre: 'Naranja', hex: '#FF8833', emoji: '🧡' },
    { nombre: 'Celeste', hex: '#44CCFF', emoji: '🩵' },
  ];
  ```

  ### `src/data/formas.js`
  ```js
  export const FORMAS = [
    { nombre: 'Círculo',     svgType: 'circle',    color: '#FF6B6B', descripcion: 'redondo como una pelota' },
    { nombre: 'Cuadrado',    svgType: 'rect',      color: '#4ECDC4', descripcion: 'cuatro lados iguales' },
    { nombre: 'Triángulo',   svgType: 'triangle',  color: '#FFE66D', descripcion: 'tres esquinas' },
    { nombre: 'Rectángulo',  svgType: 'rectangle', color: '#A8E6CF', descripcion: 'más largo que ancho' },
    { nombre: 'Estrella',    svgType: 'star',       color: '#FFB347', descripcion: 'como las estrellas del cielo' },
    { nombre: 'Corazón',     svgType: 'heart',      color: '#FF69B4', descripcion: 'como el amor' },
  ];
  ```

  ### `src/data/memoria.js`
  ```js
  export const MEMORIA_SETS = {
    animales: [
      { id: 'a1', emoji: '🐶', nombre: 'Perro' },
      { id: 'a2', emoji: '🐱', nombre: 'Gato' },
      { id: 'a3', emoji: '🐸', nombre: 'Rana' },
      { id: 'a4', emoji: '🐮', nombre: 'Vaca' },
      { id: 'a5', emoji: '🦁', nombre: 'León' },
      { id: 'a6', emoji: '🐘', nombre: 'Elefante' },
    ],
    letras: [
      { id: 'l1', emoji: 'A', nombre: 'A' },
      { id: 'l2', emoji: 'B', nombre: 'B' },
      { id: 'l3', emoji: 'C', nombre: 'C' },
      { id: 'l4', emoji: 'D', nombre: 'D' },
      { id: 'l5', emoji: 'E', nombre: 'E' },
      { id: 'l6', emoji: 'F', nombre: 'F' },
    ],
    numeros: [
      { id: 'n1', emoji: '1️⃣', nombre: '1' },
      { id: 'n2', emoji: '2️⃣', nombre: '2' },
      { id: 'n3', emoji: '3️⃣', nombre: '3' },
      { id: 'n4', emoji: '4️⃣', nombre: '4' },
      { id: 'n5', emoji: '5️⃣', nombre: '5' },
      { id: 'n6', emoji: '6️⃣', nombre: '6' },
    ],
  };
  ```

  **Archivos:** todos los archivos en `src/data/`

  **Verificación:** `npm run build` — sin errores de importación.

---

- [ ] 4. **Crear `src/context/ProgressContext.jsx`**

  Este contexto gestiona el progreso global con localStorage:

  ```jsx
  // Estado inicial
  const initialState = {
    estrellas: 0,          // total acumulado
    modulosCompletados: [], // array de strings: 'letras', 'palabras', etc.
    pegatinas: [],          // array de ids de pegatinas desbloqueadas
    coronas: 0,
  };
  ```

  Funciones expuestas por el contexto:
  - `agregarEstrellas(cantidad)` — suma estrellas y guarda en localStorage
  - `completarModulo(nombreModulo)` — agrega módulo a `modulosCompletados` si no está
  - `desbloquearPegatina(id)` — agrega pegatina si no existe
  - `progreso` — el estado completo

  Usar `useReducer` con un reducer que maneje los actions: `ADD_STARS`, `COMPLETE_MODULE`, `UNLOCK_STICKER`, `RESET`.

  Al inicializar, leer de `localStorage.getItem('abi-progreso')` y parsear con fallback a `initialState`.

  En cada cambio de estado, usar `useEffect` para guardar en localStorage con `JSON.stringify`.

  Exportar `ProgressContext`, `ProgressProvider`, y el hook `useProgress`.

  **Archivos:** `src/context/ProgressContext.jsx`

  **Verificación:** `npm run build` — sin errores.

---

- [ ] 5. **Crear componentes compartidos**

  ### 5a. `src/components/Header.jsx` y `Header.css`

  Props: `titulo` (string), `onBack` (función opcional — si se pasa, muestra botón "← Atrás").

  Muestra:
  - Botón "← Atrás" (solo si `onBack` existe) — grande, accesible
  - Título centrado con emoji de estrella
  - `<StarCounter />` en la esquina derecha

  Estilo: fondo degradado rosa-violeta, altura mínima 70px, sticky top.

  ### 5b. `src/components/StarCounter.jsx` y `StarCounter.css`

  Consume `useProgress()`. Muestra: `⭐ {progreso.estrellas}`.
  Animación CSS de "bounce" cuando `estrellas` cambia (usar `key={estrellas}` para re-trigger).

  ### 5c. `src/components/ProgressBar.jsx` y `ProgressBar.css`

  Props: `actual` (número), `total` (número), `color` (string, default `#FF6EB4`).
  Barra de progreso animada con fill CSS. Muestra `{actual}/{total}`.

  ### 5d. `src/components/RewardModal.jsx` y `RewardModal.css`

  Props: `visible` (bool), `onClose` (fn), `mensaje` (string), `estrellasGanadas` (número).

  Cuando `visible === true`:
  - Overlay semitransparente
  - Card centrada con animación de "pop-in" (scale 0 → 1)
  - Lluvia de estrellas animadas (5–8 estrellas CSS con `@keyframes` de caída diagonal)
  - Mensaje grande: `"{mensaje}"`
  - Estrellas: `"⭐ +{estrellasGanadas}"`
  - Botón "¡Seguir!" grande y colorido

  Al presionar "¡Seguir!": llama `onClose()`.

  **Archivos:** 4 componentes × 2 archivos = 8 archivos en `src/components/`

  **Verificación:** `npm run build` — sin errores.

---

- [ ] 6. **Crear componentes de tarjetas reutilizables**

  ### 6a. `src/components/LetterCard.jsx` y `LetterCard.css`

  Props: `letra` (obj de `letras.js`), `onClick` (fn).

  Muestra: emoji grande, letra grande, nombre de la palabra.
  Tamaño mínimo: 120×120px. `border-radius: 20px`. Sombra suave.
  Al click: animación de "wiggle" (rotate ±5° con `@keyframes`).

  ### 6b. `src/components/WordCard.jsx` y `WordCard.css`

  Props: `palabra` (obj de `palabras.js`), `onClick` (fn).

  Muestra: emoji grande centrado, palabra escrita en mayúsculas, botón de audio (🔊).
  Al click en audio: llama `speechSynthesis.speak()` con `lang: 'es-AR'`.

  ### 6c. `src/components/NumberCard.jsx` y `NumberCard.css`

  Props: `numero` (obj de `numeros.js`), `onClick` (fn).

  Muestra: número grande, texto del número, objetos emoji en grid.
  Colores alternados por índice.

  **Archivos:** 3 componentes × 2 archivos = 6 archivos en `src/components/`

  **Verificación:** `npm run build` — sin errores.

---

- [ ] 7. **Crear `src/pages/Home.jsx` y `Home.css`**

  La pantalla principal. **No usa `<Header />`** — tiene su propio encabezado especial.

  Contenido:
  - Encabezado animado con:
    ```
    🌟 ¡Hola, Abi! 🌟
    ¡Qué bueno verte hoy!
    Elige una actividad para aprender jugando
    ```
  - Frase de bienvenida rotante (cambiar cada 5 segundos entre 3 frases usando `useState` + `useEffect` con `setInterval`)
  - Grid de 8 tarjetas de actividades (4 columnas en tablet, 2 en móvil):
    ```
    1. 🔤 Aprender Letras      → /letras
    2. 📖 Aprender Palabras    → /palabras
    3. ✏️  Escribir Palabras    → /escribir
    4. 🖊️  Trazado de Letras    → /trazado
    5. 🔢 Números              → /numeros
    6. 🎨 Colores              → /colores
    7. ⭐ Formas               → /formas
    8. 🃏 Juego de Memoria     → /memoria
    9. 🏆 Mis Recompensas      → /recompensas
    ```
  - Cada tarjeta: fondo de color único, emoji grande, texto, indicador de módulo completado (✅) si ya fue completado (leer de `useProgress()`).
  - Tarjetas con `border-radius: 24px`, sombra, hover/active scale transform.
  - Fondo general: degradado suave de cielo (azul claro → violeta claro).

  **Archivos:** `src/pages/Home.jsx`, `src/pages/Home.css`

  **Verificación:** `npm run dev` — la Home se ve correctamente con grid de tarjetas.

---

- [ ] 8. **Crear `src/pages/AprendizajeLetras.jsx` y `AprendizajeLetras.css`**

  Funcionalidad:
  - Usa `<Header titulo="🔤 Aprender Letras" onBack={() => navigate('/')} />`
  - Importa `LETRAS` de `src/data/letras.js`
  - Estado: `letraSeleccionada` (null o objeto letra)
  - Vista de grilla: muestra todas las letras como `<LetterCard />` en grid responsivo (5 col tablet, 4 col móvil)
  - Al seleccionar una letra, abre un panel/modal lateral con:
    - La letra en mayúscula y minúscula (muy grande, 120px+)
    - El emoji de ejemplo
    - La palabra de ejemplo
    - Botón 🔊 que llama `speechSynthesis.speak(letra.letra, { lang: 'es-AR' })`
    - Botón 🔊 que pronuncia la palabra de ejemplo
    - Botón "✕ Cerrar"
  - Animación: al abrir la letra seleccionada, slide-in desde abajo con `@keyframes`
  - Al cerrar la letra tras haberla escuchado, llamar `agregarEstrellas(1)` (máximo 1 vez por letra, guardar letras ya escuchadas en estado local o localStorage)
  - Botón "✅ ¡Terminé!" que llama `completarModulo('letras')` y muestra `<RewardModal />`

  **Archivos:** `src/pages/AprendizajeLetras.jsx`, `src/pages/AprendizajeLetras.css`

  **Verificación:** `npm run dev` — navegar a `/letras`, ver grilla, seleccionar letra, escuchar sonido.

---

- [ ] 9. **Crear `src/pages/AprendizajePalabras.jsx` y `AprendizajePalabras.css`**

  Funcionalidad:
  - Usa `<Header titulo="📖 Aprender Palabras" onBack={() => navigate('/')} />`
  - Importa `PALABRAS` de `src/data/palabras.js`
  - Vista de grilla con `<WordCard />` para cada palabra
  - Al hacer click en una tarjeta, pronuncia la palabra con Web Speech API (`lang: 'es-AR'`)
  - Muestra debajo de la grilla un panel de "Palabra del día" — elegida aleatoriamente al montar
  - Botón "✅ ¡Terminé!" al final → `completarModulo('palabras')` + `agregarEstrellas(3)` + `<RewardModal />`

  **Archivos:** `src/pages/AprendizajePalabras.jsx`, `src/pages/AprendizajePalabras.css`

  **Verificación:** `npm run dev` — navegar a `/palabras`, ver tarjetas, click pronuncia la palabra.

---

- [ ] 10. **Crear `src/pages/EscribirPalabras.jsx` y `EscribirPalabras.css`**

  Funcionalidad (drag-and-drop de letras):
  - Usa `<Header titulo="✏️ Escribir Palabras" onBack={() => navigate('/')} />`
  - Muestra la palabra objetivo (empezar con `PALABRAS[0]`): emoji grande + palabra (con letras ocultas como `_ _ _ _`)
  - Debajo: pool de letras barajadas (las letras de la palabra + 3–4 letras "distractoras" aleatorias)
  - Mecánica: drag-and-drop HTML5 nativo (`draggable`, `onDragStart`, `onDrop`, `onDragOver`)
    - En móvil: usar touch events (`onTouchStart`, `onTouchMove`, `onTouchEnd`) como alternativa — al tocar una letra del pool, se "selecciona" (highlight), luego al tocar un slot vacío se coloca
  - Los slots vacíos tienen el mismo ancho que una letra; letras colocadas muestran la letra real
  - Al completar la palabra correctamente:
    - Animar estrellas (CSS)
    - `speechSynthesis.speak(palabra)` en español
    - Mostrar mensaje "¡Muy bien, Abi! 🎉"
    - `agregarEstrellas(5)`
    - Botón "→ Siguiente palabra"
  - Avanzar por todas las palabras de `PALABRAS`; al terminar todas → `completarModulo('escribir')` + `<RewardModal />`
  - Botón "← Anterior" / "→ Siguiente" para navegar manualmente
  - `<ProgressBar actual={indiceActual + 1} total={PALABRAS.length} />`

  **Archivos:** `src/pages/EscribirPalabras.jsx`, `src/pages/EscribirPalabras.css`

  **Verificación:** `npm run dev` — navegar a `/escribir`, arrastrar letras, completar palabra.

---

- [ ] 11. **Crear `src/pages/TrazadoLetras.jsx` y `TrazadoLetras.css`**

  Funcionalidad (dibujo libre en Canvas):
  - Usa `<Header titulo="🖊️ Trazar Letras" onBack={() => navigate('/')} />`
  - Selección de letra: botonera con A, B, C, D, E, F, G, H, M, P, S (las más usadas para niños de 4 años)
  - Canvas (`<canvas>`) de 300×300px aproximadamente, responsivo con `devicePixelRatio`
  - Fondo del canvas: letra guía grande punteada (dibujada con `ctx.setLineDash([10, 10])`, color gris claro, tamaño ~200px)
  - El usuario pinta encima con el dedo/mouse en color de arco iris (cambiar color cada 20px recorridos usando `hsl`)
  - Eventos: mouse (`mousedown`, `mousemove`, `mouseup`) + touch (`touchstart`, `touchmove`, `touchend`)
  - Botón "🗑️ Borrar" — limpia el canvas y redibuja la letra guía
  - Botón "✅ ¡Lista!" — `agregarEstrellas(2)` + mostrar animación de aplauso
  - Al terminar con todas las letras del set → `completarModulo('trazado')` + `<RewardModal />`

  Implementación de la letra guía: usar `ctx.font = '200px Nunito'`, `ctx.fillText(letra, x, y)` con color semitransparente (`rgba(200, 200, 200, 0.5)`) como fondo, y encima el trazo del usuario.

  **Archivos:** `src/pages/TrazadoLetras.jsx`, `src/pages/TrazadoLetras.css`

  **Verificación:** `npm run dev` — navegar a `/trazado`, seleccionar letra, dibujar con mouse/dedo.

---

- [ ] 12. **Crear `src/pages/Numeros.jsx` y `Numeros.css`**

  Funcionalidad:
  - Usa `<Header titulo="🔢 Números" onBack={() => navigate('/')} />`
  - Modo "Aprender": grilla de `<NumberCard />` para cada número del 1 al 10
  - Al seleccionar un número: panel expandido con:
    - El número grande (font-size 120px, color vivo)
    - El texto ("uno", "dos", etc.)
    - Objetos emoji en fila (tantos como indica el número)
    - Botón 🔊 que pronuncia el número en español
  - Modo "Contar": actividad interactiva — mostrar N objetos emoji en pantalla, preguntar "¿Cuántos hay?", dar 3 opciones de respuesta (botones grandes). Al acertar: `agregarEstrellas(2)` + animación. Al fallar: efecto de "sacudida" (shake animation) en el botón incorrecto.
  - Botón toggle "Aprender / Contar" para cambiar de modo
  - Al completar 5 preguntas correctas → `completarModulo('numeros')` + `<RewardModal />`

  **Archivos:** `src/pages/Numeros.jsx`, `src/pages/Numeros.css`

  **Verificación:** `npm run dev` — navegar a `/numeros`, aprender números, hacer actividad de contar.

---

- [ ] 13. **Crear `src/pages/Colores.jsx` y `Colores.css`**

  Funcionalidad:
  - Usa `<Header titulo="🎨 Colores" onBack={() => navigate('/')} />`
  - Importa `COLORES` de `src/data/colores.js`
  - Modo "Aprender": mostrar cada color como tarjeta grande con: círculo del color, nombre del color, botón 🔊 pronuncia el nombre
  - Modo "Actividad": mostrar 4 círculos de diferentes colores; consigna: "¿Cuál es el color {nombre}?". El usuario toca el correcto.
    - Acierto: animación de estrella + `agregarEstrellas(2)` + pasar al siguiente
    - Error: shake + sin perder estrella, pregunta de nuevo
  - Progreso: `<ProgressBar actual={aciertos} total={8} />`
  - Al completar 8 aciertos → `completarModulo('colores')` + `<RewardModal />`

  **Archivos:** `src/pages/Colores.jsx`, `src/pages/Colores.css`

  **Verificación:** `npm run dev` — `/colores`, ver tarjetas de colores, jugar actividad.

---

- [ ] 14. **Crear `src/pages/Formas.jsx` y `Formas.css`**

  Funcionalidad:
  - Usa `<Header titulo="⭐ Formas" onBack={() => navigate('/')} />`
  - Importa `FORMAS` de `src/data/formas.js`
  - Modo "Aprender": tarjetas con la forma dibujada en SVG inline + nombre + descripción
    - SVG de cada forma como componente inline dentro de la tarjeta:
      - `circle`: `<svg><circle cx="50" cy="50" r="45" /></svg>`
      - `rect` (cuadrado): `<svg><rect x="5" y="5" width="90" height="90" /></svg>`
      - `triangle`: `<svg><polygon points="50,5 95,95 5,95" /></svg>`
      - `rectangle`: `<svg><rect x="5" y="20" width="90" height="60" /></svg>`
      - `star`: `<svg><polygon points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" /></svg>`
      - `heart`: `<svg><path d="M50,30 C50,20 35,10 25,20 C10,30 10,50 50,80 C90,50 90,30 75,20 C65,10 50,20 50,30Z" /></svg>`
  - Modo "Actividad": mostrar 4 formas, consigna "¿Dónde está el/la {nombre}?". Usuario toca la correcta.
  - Al completar 6 aciertos → `completarModulo('formas')` + `<RewardModal />`

  **Archivos:** `src/pages/Formas.jsx`, `src/pages/Formas.css`

  **Verificación:** `npm run dev` — `/formas`, ver formas SVG, jugar actividad.

---

- [ ] 15. **Crear `src/components/MemoryGame.jsx` y `MemoryGame.css`**

  Componente reutilizable de juego de memoria (pares de cartas):

  Props: `items` (array de 6 objetos `{id, emoji, nombre}`), `onComplete` (fn llamada al completar todos los pares).

  Lógica interna:
  - Al montar: crear array de `items.length * 2` cartas (duplicar cada item) y barajar con Fisher-Yates
  - Estado: `cartas[]` (cada una con `{ ...item, voltada: bool, encontrada: bool }`)
  - Al hacer click en carta no volteada:
    - Si menos de 2 cartas volteadas: voltear la carta
    - Si 2 cartas volteadas: comparar. Si coinciden (`id` igual): marcarlas como `encontrada`. Si no: `setTimeout` 1000ms y darlas vuelta
  - Render: grid 3×4 (6 pares). Cada carta: cuadrado con `backface-visibility: hidden`, animación de flip 3D CSS (`rotateY(0) → rotateY(180deg)`). Cara posterior: emoji/texto. Cara frontal: `❓` con fondo de color.
  - Al encontrar todos los pares: llamar `onComplete()`

  **Archivos:** `src/components/MemoryGame.jsx`, `src/components/MemoryGame.css`

  **Verificación:** se importa desde la página (paso 16).

---

- [ ] 16. **Crear `src/pages/JuegoMemoria.jsx` y `JuegoMemoria.css`**

  Funcionalidad:
  - Usa `<Header titulo="🃏 Juego de Memoria" onBack={() => navigate('/')} />`
  - Importa `MEMORIA_SETS` de `src/data/memoria.js`
  - Selector de categoría: "Animales 🐶" / "Letras 🔤" / "Números 🔢" — botones grandes
  - Render `<MemoryGame items={setActual} onComplete={handleComplete} />`
  - Al completar: `agregarEstrellas(5)` + mostrar tiempo transcurrido + `<RewardModal />`
  - Botón "🔄 Jugar de nuevo" que reinicia el juego
  - `completarModulo('memoria')` la primera vez que se completa

  **Archivos:** `src/pages/JuegoMemoria.jsx`, `src/pages/JuegoMemoria.css`

  **Verificación:** `npm run dev` — `/memoria`, jugar memoria con animales, completar.

---

- [ ] 17. **Crear `src/pages/Recompensas.jsx` y `Recompensas.css`**

  Funcionalidad:
  - Usa `<Header titulo="🏆 Mis Recompensas" onBack={() => navigate('/')} />`
  - Consume `useProgress()`
  - Sección "Mis Estrellas": muestra `progreso.estrellas` estrellas grandes con animación
  - Sección "Mis Medallas": muestra una medalla por cada módulo completado:
    ```
    letras     → 📚 Lectora de Letras
    palabras   → 📖 Lectora de Palabras
    escribir   → ✏️ Escritora
    trazado    → 🖊️ Trazadora
    numeros    → 🔢 Matemática
    colores    → 🎨 Artista de Colores
    formas     → ⭐ Experta en Formas
    memoria    → 🃏 Campeona de Memoria
    ```
    Las medallas no desbloqueadas se muestran en gris con candado (🔒).
  - Sección "Mis Coronas": mostrar `progreso.coronas` coronas animadas (👑)
  - Fondo especial: degradado de arco iris animado (CSS `@keyframes` en `background-position`)
  - Mensaje personalizado según cantidad de estrellas:
    - 0–10: "¡Estás empezando, Abi! ¡Tú puedes! 💪"
    - 11–30: "¡Muy bien, Abi! Sigue aprendiendo 🌟"
    - 31+: "¡Abi es una superestrella! 🦄👑"

  **Archivos:** `src/pages/Recompensas.jsx`, `src/pages/Recompensas.css`

  **Verificación:** `npm run dev` — `/recompensas`, ver estrellas y medallas del progreso.

---

- [ ] 18. **Configurar rutas en `src/App.jsx`**

  ```jsx
  import { Routes, Route } from 'react-router-dom';
  import Home from './pages/Home';
  import AprendizajeLetras from './pages/AprendizajeLetras';
  import AprendizajePalabras from './pages/AprendizajePalabras';
  import EscribirPalabras from './pages/EscribirPalabras';
  import TrazadoLetras from './pages/TrazadoLetras';
  import Numeros from './pages/Numeros';
  import Colores from './pages/Colores';
  import Formas from './pages/Formas';
  import JuegoMemoria from './pages/JuegoMemoria';
  import Recompensas from './pages/Recompensas';

  function App() {
    return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/letras" element={<AprendizajeLetras />} />
        <Route path="/palabras" element={<AprendizajePalabras />} />
        <Route path="/escribir" element={<EscribirPalabras />} />
        <Route path="/trazado" element={<TrazadoLetras />} />
        <Route path="/numeros" element={<Numeros />} />
        <Route path="/colores" element={<Colores />} />
        <Route path="/formas" element={<Formas />} />
        <Route path="/memoria" element={<JuegoMemoria />} />
        <Route path="/recompensas" element={<Recompensas />} />
      </Routes>
    );
  }

  export default App;
  ```

  **Archivos:** `src/App.jsx`

  **Verificación:** `npm run dev` — navegar entre rutas, ninguna da 404.

---

- [ ] 19. **Crear `src/index.css` — estilos globales y tema visual**

  Definir variables CSS en `:root`:
  ```css
  :root {
    --color-primary: #FF6EB4;
    --color-secondary: #7C5CBF;
    --color-accent: #FFD700;
    --color-success: #4CAF50;
    --color-danger: #FF5252;
    --color-bg: #FFF5FB;
    --font-main: 'Nunito', 'Comic Sans MS', cursive;
    --border-radius-card: 24px;
    --shadow-card: 0 8px 24px rgba(0,0,0,0.12);
    --shadow-btn: 0 4px 12px rgba(0,0,0,0.2);
  }
  ```

  Reset base:
  ```css
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { height: 100%; overflow-x: hidden; }
  body {
    font-family: var(--font-main);
    background-color: var(--color-bg);
    color: #333;
    -webkit-font-smoothing: antialiased;
    touch-action: manipulation; /* elimina el retraso de 300ms en mobile */
  }
  ```

  Clases de utilidad globales:
  - `.btn-primary` — botón grande redondeado con degradado rosa
  - `.btn-secondary` — botón con borde
  - `.card` — tarjeta base con sombra y border-radius
  - `.page-container` — padding lateral 16px, max-width 900px centrado
  - `.animate-bounce` — animación de rebote keyframe
  - `.animate-wiggle` — animación de sacudida keyframe
  - `.animate-pop` — scale 0.8 → 1.1 → 1.0
  - `.animate-shake` — translateX ida y vuelta (para error)
  - `.animate-star-fall` — keyframe para lluvia de estrellas en RewardModal
  - `.star-emoji` — emoji de estrella grande con animación

  Media queries:
  ```css
  /* Mobile first — base es móvil */
  /* Tablet: min-width 600px */
  /* Desktop: min-width 1024px */
  ```

  **Archivos:** `src/index.css`

  **Verificación:** `npm run dev` — estilos globales aplicados, fuente Nunito visible.

---

- [ ] 20. **Actualizar `public/` y `index.html` para favicons y meta**

  - Crear `public/favicon.svg` con un SVG de estrella en colores rosa/dorado
  - En `index.html`: `<link rel="icon" type="image/svg+xml" href="/favicon.svg">`
  - Agregar `<meta name="description" content="Abi Aprende - App educativa para Abril">`
  - Agregar `<meta name="apple-mobile-web-app-capable" content="yes">` para iOS PWA básica

  **Archivos:** `public/favicon.svg`, `index.html`

  **Verificación:** `npm run dev` — favicon visible en el tab del navegador.

---

- [ ] 21. **Verificación final con build de producción**

  ```bash
  npm run build
  ```

  Verificar que:
  - El build termina sin errores ni warnings críticos
  - La carpeta `dist/` se genera correctamente
  - `npm run preview` sirve la app en `http://localhost:4173` y todas las rutas funcionan

  Si hay errores: revisar imports faltantes, props sin propTypes (no son errores, solo warnings), y que todos los archivos de datos exportan correctamente.

  **Archivos:** ninguno nuevo — verificación del estado completo del proyecto

  **Verificación:**
  ```
  npm run build   # debe terminar con "built in Xs"
  npm run preview # abrir http://localhost:4173 y navegar todas las rutas
  ```

---

## Notas para el implementador

1. **Pronunciación (Web Speech API):** usar siempre `lang: 'es-AR'` o `'es-ES'` (el primero es español argentino / latinoamericano). Verificar soporte con `if ('speechSynthesis' in window)` antes de llamar. No todos los navegadores tienen la voz instalada; en ese caso, silencio sin error.

2. **Drag-and-drop en móvil:** el HTML5 drag-and-drop nativo NO funciona en iOS Safari. La solución está en el paso 10: implementar ambos conjuntos de eventos (drag events para desktop + touch events para mobile). La mecánica de touch es: `touchstart` = seleccionar letra, `touchend` en slot = soltar letra.

3. **Canvas y DPR:** para pantallas Retina/HiDPI, usar `devicePixelRatio` al crear el canvas:
   ```js
   const dpr = window.devicePixelRatio || 1;
   canvas.width = rect.width * dpr;
   canvas.height = rect.height * dpr;
   ctx.scale(dpr, dpr);
   ```

4. **Orden de rutas en App.jsx:** las rutas más específicas primero, `/` al final no es necesario con react-router-dom v6 (Routes usa matching exacto por defecto).

5. **localStorage key:** usar siempre `'abi-progreso'` como clave para consistencia. El JSON guardado tiene la forma exacta de `initialState` del ProgressContext.

6. **Idioma:** toda la UI en español latino. No usar anglicismos. "Atrás" (no "Back"), "¡Muy bien!" (no "Great job!"), "Colores" (no "Colors"), etc.

7. **Accesibilidad básica (para pasar auditoría básica):**
   - Todos los botones tienen texto o `aria-label`
   - Las imágenes/emojis tienen `role="img"` y `aria-label`
   - Contraste de texto: verificar que texto oscuro sobre fondo claro y viceversa cumplen WCAG AA (4.5:1)
   - `<canvas>` tiene `role="img"` y `aria-label="Área de trazado"`

8. **Performance:** todos los módulos de página son componentes normales (no lazy). El bundle es lo suficientemente pequeño para una app educativa simple. Agregar `React.lazy` solo si el build supera 1MB gzip.
