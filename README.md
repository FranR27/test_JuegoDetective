# CASO 404 — Capítulo 1: La persona que desapareció

Juego de investigación con frontend React + Vite y API Express + Firestore. Reúne el canon y las pantallas del Integrante 2 con el backend del Integrante 3 en una sola aplicación.

> Todo el contenido es ficticio. Personas, empresas, legajos, cuentas y montos fueron inventados para el juego.

## Qué incluye

| Área | Contenido |
|---|---|
| Historia | Canon completo en `src/data/capitulo1.js` y `docs/historia-capitulo-1.md` |
| Personajes | 7 personajes con roles, contactos y estado |
| Archivos | 5 carpetas y 15 documentos con contenido bloqueado por acertijo |
| Correo | 5 correos recibidos + 1 correo enviado (la falsa despedida) |
| Mensajes | 3 conversaciones: Valeria, Tomás y Laura |
| Fotografías | 6 imágenes SVG en `public/case/photos/` |
| Evidencias | 19 evidencias, 9 disponibles desde el inicio y 10 que se desbloquean con los acertijos |
| Acertijos | 3 deducciones encadenadas con reglas, pistas y recompensas |
| Pantallas | `FileExplorer`, `MailApp`, `MessagesApp`, `EvidenceBoard`, `PuzzlePanel` |
| Backend | API de partidas, evidencias y validación de acertijos con persistencia en Firestore o memoria |

## Arranque rápido

Requiere Node.js 20 o superior.

### Backend

```bash
cd backend
npm install
copy .env.example .env      # en Linux/macOS: cp .env.example .env
npm start                   # http://localhost:3001
```

Por defecto usa `STORAGE=memory` (las partidas se pierden al reiniciar). Para Firestore, seguir `backend/README.md`.

### Frontend

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # 24 tests de datos, acertijos y contrato de API
npm run build    # build de producción
```

`npm` en PowerShell puede estar bloqueado por la política de scripts. En ese caso usar `npm.cmd`.

## Modo local y modo backend

Sin configuración, el prototipo valida los acertijos en el cliente. Es el modo pensado para revisar la entrega sin depender del backend.

Para jugar contra la API:

1. Copiar `.env.example` a `.env.local`.
2. Levantar el backend (`cd backend && npm start`).
3. Reiniciar Vite.

El catálogo real ya está aplicado en `backend/src/data/capitulo1.js`: los ids y las respuestas coinciden con los del frontend. El detalle, los ids y los hashes están en [`docs/integracion.md`](docs/integracion.md). Si el backend no responde, la partida sigue funcionando en local y el pie de la app lo indica.

## Documentación

- [`docs/historia-capitulo-1.md`](docs/historia-capitulo-1.md): canon, cronología, reparto y piezas del caso.
- [`docs/reglas-acertijos.md`](docs/reglas-acertijos.md): respuestas, desbloqueos, pistas y validación.
- [`docs/contrato-datos.md`](docs/contrato-datos.md): esquemas de datos y contrato de la API.
- [`docs/integracion.md`](docs/integracion.md): contrato entre frontend y backend, ids y hashes.
- [`docs/backend-capitulo1.ejemplo.js`](docs/backend-capitulo1.ejemplo.js): referencia del catálogo ya aplicado en `backend/src/data/capitulo1.js`.

## Estructura

```text
backend/                         API Express + Firestore/memoria
docs/                            canon, reglas, contrato de datos e integración
public/case/photos/              imágenes del caso
src/
├── components/
│   ├── archivos/FileExplorer.jsx
│   ├── correo/MailApp.jsx
│   ├── mensajes/MessagesApp.jsx
│   ├── evidencias/EvidenceBoard.jsx
│   ├── acertijos/PuzzlePanel.jsx
│   ├── acertijos/ChapterOutro.jsx
│   └── ui/                      componentes compartidos
├── data/                        canon, personajes, archivos, correos, chats, fotos, evidencias, acertijos
├── features/investigation/
│   ├── puzzleEngine.js          reglas puras de desbloqueo
│   └── useInvestigation.js      estado local + sincronización opcional con backend
├── services/apiCapitulo1.js     cliente HTTP, contratos de ids y hashes
├── lib/                         formateo y utilidades
├── styles/                      tema y controles compartidos
└── App.jsx                      harness de demostración (no es el escritorio final)
```

## Alcance y límites

Esta entrega **integra la API y Firestore** para guardar partidas y validar acertijos. No incluye autenticación ni el escritorio general del juego: el `App.jsx` es un harness para montar y probar las pantallas; el escritorio real lo arma el Integrante 1.

Las respuestas canónicas están en `src/data/acertijos.js` para que el prototipo sea jugable y en `backend/src/data/capitulo1.js` como hashes para la API. El backend valida y devuelve solo `correcto` / `incorrecto`.

## Flujo de equipo

- Rama integrada: `feature/integracion` (pasa a `main`).
- El backend vive en `backend/` y el frontend en la raíz, en un solo repositorio.
- Los cambios se integran por Pull Request.
- Antes de cambiar una fecha, un nombre o una prueba hay que actualizar el canon y correr `npm test` en la raíz y en `backend/`: los tests verifican la coherencia entre historia, documentos, evidencias, desbloqueos y API.
