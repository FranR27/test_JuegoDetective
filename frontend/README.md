# CASO 404 — Frontend

Esqueleto funcional del primer expediente, **La última conexión**. React + Vite + JavaScript + CSS.
Todo usa datos locales de prueba: no hay backend, base de datos ni autenticación todavía.

## Cómo ejecutarlo

Requiere Node.js 20.19 o superior (o 22.12+).

```bash
cd frontend
npm install
npm run dev      # servidor local (por defecto http://localhost:5173)
npm run build    # compilación de producción en frontend/dist
```

## Estructura

```text
frontend/src/
├── App.jsx                  Elige la pantalla actual (bienvenida / escritorio)
├── main.jsx                 Punto de entrada
├── pages/                   Pantallas completas: WelcomePage, DesktopPage
├── components/
│   ├── desktop/             Desktop, Window, Taskbar, Clock, DesktopIcon
│   └── ui/                  Piezas genéricas: Button, EmptyState
├── features/                Una carpeta por aplicación del escritorio
│   ├── files/  mail/  messages/  notes/  evidence/
├── game/                    Lógica del juego (sin interfaz)
│   ├── apps.js              Registro de aplicaciones del escritorio
│   ├── windowsReducer.js    Reglas de ventanas (abrir, cerrar, minimizar, foco)
│   ├── useWindowManager.js  Hook que expone ese estado a la interfaz
│   └── GameProvider.jsx     Estado global: pantalla actual y evidencias
├── services/gameData.js     Única puerta de entrada a los datos
├── data/                    Datos de prueba (archivos, correos, chats, notas, evidencias)
└── styles/                  CSS global: variables, botones, escritorio, ventanas
```

Cada aplicación importa su propio CSS desde su carpeta en `features/`, para que
no se pisen entre integrantes.

## Cómo agregar una aplicación

1. Crear `src/features/<nombre>/<Nombre>App.jsx` (un componente sin props).
2. Agregar una entrada en `src/game/apps.js`: `{ id, title, icon, component }`.

El ícono del escritorio, la ventana y el botón de la barra de tareas aparecen solos.

## Dónde continúa cada integrante

**Integrante 2 (mecánicas y contenido)**
- Reemplazar el contenido de `src/data/` (archivos, correos, conversaciones, notas).
- Ampliar las carpetas `src/features/*` (por ejemplo, visor de fotos, acertijos).
- Las evidencias viven en `GameProvider`: cualquier app puede registrar una con
  `const { addEvidence } = useGame()`.

**Integrante 3 (backend y base de datos)**
- `src/services/gameData.js` es el único lugar que lee `src/data/`. Al tener la
  API, esas funciones pasan a pedir los datos al servidor.
- `src/game/GameProvider.jsx` es donde se cargará y guardará el progreso
  (evidencias, desbloqueos, partida).
- Hoy las funciones de `gameData.js` son síncronas; al pasar a la API serán
  asíncronas y habrá que adaptar las apps que las llaman (cargando/error).

## Qué falta (a propósito)

Ventanas arrastrables o redimensionables, imágenes, sonidos, animaciones,
acertijos, contraseñas, Tailwind, Framer Motion, backend y despliegue.
