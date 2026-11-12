# CASO 404 — Capítulo 1: La persona que desapareció

Entrega del **Integrante 2**: canon del capítulo, datos ficticios, pantallas reutilizables de investigación y reglas de los tres acertijos.

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
| Integración | Cliente HTTP opcional para la API del Integrante 3 |

## Arranque rápido

Requiere Node.js 20 o superior.

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # 24 tests de datos, acertijos y contrato de API
npm run build    # build de producción
```

`npm` en PowerShell puede estar bloqueado por la política de scripts. En ese caso usar `npm.cmd`.

## Modo local y modo backend

Sin configuración, el prototipo valida los acertijos en el cliente. Es el modo pensado para revisar la entrega sin depender de otros integrantes.

Para usar la API del Integrante 3:

1. Copiar `.env.example` a `.env.local`.
2. Definir `VITE_API_URL=http://localhost:3001/api`.
3. Levantar el backend con el catálogo real de `docs/backend-capitulo1.ejemplo.js`.
4. Reiniciar Vite.

El detalle paso a paso, los ids y los hashes están en [`docs/integracion.md`](docs/integracion.md). Si el backend no responde, la partida sigue funcionando en local y el pie de la app lo indica.

## Documentación

- [`docs/historia-capitulo-1.md`](docs/historia-capitulo-1.md): canon, cronología, reparto y piezas del caso.
- [`docs/reglas-acertijos.md`](docs/reglas-acertijos.md): respuestas, desbloqueos, pistas y validación.
- [`docs/contrato-datos.md`](docs/contrato-datos.md): esquemas de datos y contrato de la API.
- [`docs/integracion.md`](docs/integracion.md): cómo conectar el backend y qué falta coordinar.
- [`docs/backend-capitulo1.ejemplo.js`](docs/backend-capitulo1.ejemplo.js): catálogo listo para reemplazar el provisional del backend.

## Estructura

```text
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

Esta entrega **no implementa** Firestore, autenticación ni el escritorio general del juego. El `App.jsx` es un harness para montar y probar las pantallas; el escritorio real lo arma el Integrante 1.

Las respuestas canónicas están en `src/data/acertijos.js` para que el prototipo sea jugable. En producción no deben viajar al cliente: el backend del Integrante 3 valida hashes y devuelve solo `correcto` / `incorrecto`. El motor `puzzleEngine.js` y el catálogo de `docs/backend-capitulo1.ejemplo.js` ya están preparados para ese cambio.

## Flujo de equipo

- Rama de esta entrega: `feature/investigacion`.
- No se modifican archivos de las ramas `feature/backend` ni del escritorio del Integrante 1.
- Los cambios se integran por Pull Request.
- Antes de cambiar una fecha, un nombre o una prueba hay que actualizar el canon y correr `npm test`: los tests verifican la coherencia entre historia, documentos, evidencias y desbloqueos.
