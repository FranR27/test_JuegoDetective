# Backend de Caso 404

API (Node.js + Express) que guarda el progreso de las partidas y valida las respuestas de los acertijos. Las soluciones viven solo en el servidor: el frontend nunca las recibe.

## Puesta en marcha

Requisitos: Node.js 20 o superior.

```bash
cd backend
npm install
cp .env.example .env      # en Windows: copy .env.example .env
npm run dev
```

Comprobar que funciona: abrir <http://localhost:3001/api/health>. Debe responder:

```json
{ "estado": "ok", "servicio": "caso404-backend", "almacenamiento": "memory", "hora": "2026-11-12T22:00:00.000Z" }
```

Por defecto (`STORAGE=memory`) las partidas se guardan en memoria, sin necesitar Firebase; se pierden al reiniciar. Sirve para desarrollar el frontend desde el primer día.

### Scripts

| Comando | Qué hace |
|---|---|
| `npm run dev` | Inicia el servidor y lo reinicia al guardar cambios |
| `npm start` | Inicia el servidor (producción) |
| `npm test` | Ejecuta los tests |
| `npm run hash -- "respuesta"` | Genera el hash de la solución de un acertijo |

## Conectar Firestore

1. En la [consola de Firebase](https://console.firebase.google.com) crear un proyecto y activar **Firestore Database** (modo producción).
2. En *Configuración del proyecto → Cuentas de servicio* generar una clave privada (descarga un `.json`).
3. Guardarla en `backend/credenciales/firebase-admin.json` (esa carpeta está en `.gitignore`).
4. En `.env`:
   ```
   STORAGE=firestore
   GOOGLE_APPLICATION_CREDENTIALS=./credenciales/firebase-admin.json
   ```
5. En *Firestore → Reglas*, dejar acceso denegado a clientes (`allow read, write: if false;`). El backend usa el SDK Admin, que no depende de esas reglas, y así nadie puede leer o modificar partidas desde el navegador.

**Nunca subir la clave a GitHub.** Si se sube por error, hay que revocarla desde la consola de Firebase y generar otra: borrarla del repositorio no alcanza porque queda en el historial.

En un hosting sin archivos (por ejemplo Render) se usa `FIREBASE_SERVICE_ACCOUNT_JSON` con el contenido del JSON en una sola línea, cargado como variable de entorno del servicio.

## Modelo de partida

Cada partida es un documento en la colección `partidas`; el `id` lo genera Firestore.

```json
{
  "id": "q3Zk1x9PabC2dEfGhIjK",
  "capitulo": 1,
  "evidenciasEncontradas": ["ev-ultima-conexion", "ev-contradiccion-mensaje"],
  "acertijosResueltos": ["mensaje-despedida"],
  "creadaEn": "2026-11-12T21:30:00.000Z",
  "ultimaActualizacion": "2026-11-12T21:42:10.000Z"
}
```

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | texto | Identificador de la partida (no está dentro del documento, es el id del documento) |
| `capitulo` | número | Capítulo que se está jugando |
| `evidenciasEncontradas` | lista de textos | Ids de las evidencias que el jugador ya tiene |
| `acertijosResueltos` | lista de textos | Ids de los acertijos resueltos |
| `creadaEn` | texto ISO 8601 | Cuándo se creó la partida |
| `ultimaActualizacion` | texto ISO 8601 | Último cambio de progreso |

Las partidas no tienen usuario ni login: quien conoce el `id` puede continuarla. El frontend debería guardar el `id` (por ejemplo en `localStorage`) para retomarla.

## Rutas

Todas bajo `/api`, con JSON en pedido y respuesta.

| Método y ruta | Cuerpo | Respuesta |
|---|---|---|
| `GET /api/health` | — | `200` estado del servidor |
| `POST /api/partidas` | opcional `{ "capitulo": 1 }` | `201` la partida creada (con header `Location`) |
| `GET /api/partidas/:id` | — | `200` la partida |
| `POST /api/partidas/:id/evidencias` | `{ "evidenciaId": "ev-..." }` | `200` la partida actualizada |
| `POST /api/partidas/:id/acertijos/:acertijoId/validar` | `{ "respuesta": "..." }` | `200` resultado de la validación |

### Validar un acertijo

```json
// Pedido
{ "respuesta": "Demo-Clave-2026" }

// Respuesta: correcta
{
  "correcto": true,
  "yaResuelto": false,
  "evidenciasDesbloqueadas": ["ev-documentos-auditoria"],
  "partida": { "id": "...", "acertijosResueltos": ["auditoria-2026"], "evidenciasEncontradas": ["ev-documentos-auditoria"], "...": "..." }
}

// Respuesta: incorrecta (también es 200; no es un error del pedido)
{ "correcto": false, "yaResuelto": false, "evidenciasDesbloqueadas": [], "partida": { "...": "..." } }
```

Resolver un acertijo correctamente agrega a la partida las evidencias que desbloquea. Repetir una respuesta correcta no duplica nada (`yaResuelto: true`). Las evidencias sin acertijo asociado se registran con `POST .../evidencias` cuando el jugador las encuentra; si una evidencia está bloqueada, ese endpoint responde `403` hasta que se resuelva su acertijo.

### Errores

Siempre con esta forma:

```json
{ "error": { "codigo": "partida_no_encontrada", "mensaje": "No existe una partida con ese id." } }
```

| HTTP | `codigo` | Cuándo |
|---|---|---|
| 400 | `id_invalido` | El id de la partida tiene un formato inválido |
| 400 | `capitulo_invalido` | El capítulo no existe |
| 400 | `evidencia_invalida` | Falta `evidenciaId` en el cuerpo |
| 400 | `respuesta_invalida` | Falta `respuesta`, está vacía o supera los 200 caracteres |
| 400 | `solicitud_invalida` | JSON mal formado o cuerpo demasiado grande |
| 403 | `evidencia_bloqueada` | La evidencia exige resolver antes un acertijo |
| 404 | `partida_no_encontrada` | No existe la partida |
| 404 | `acertijo_no_encontrado` / `evidencia_no_encontrada` | El id no está en el catálogo del capítulo |
| 404 | `ruta_no_encontrada` | La ruta no existe |
| 500 | `error_interno` | Error inesperado del servidor |

## Catálogo y acertijos (a acordar con el integrante 2)

Evidencias, acertijos y sus ids están en `src/data/capitulo1.js`. **Los valores actuales son provisorios**: hay que reemplazarlos por los reales y los ids tienen que coincidir con los del frontend.

Las soluciones se guardan como hash SHA-256, no en texto plano, para que no se puedan leer en el repositorio. Para cargar una respuesta real:

```bash
npm run hash -- "respuesta correcta"
npm run hash -- "Clave-Con-Mayusculas" --mayusculas   # si debe distinguir mayúsculas
```

Pegar el resultado en `hashRespuesta` del acertijo (y `distingueMayusculas: true` en el segundo caso). La comparación ignora tildes, espacios sobrantes y mayúsculas, salvo en los acertijos que lo indiquen (como la contraseña de `AUDITORIA_2026`).

Respuestas de prueba actuales, para probar con el frontend mientras tanto:

| Acertijo | Respuesta |
|---|---|
| `mensaje-despedida` | `demo-despedida` |
| `auditoria-2026` | `Demo-Clave-2026` (distingue mayúsculas) |
| `historial-renuncia` | `demo-historial` |

Un hash protege la solución de quien lee el código, pero no de quien prueba respuestas cortas a mano, algo aceptable para un juego.

## Datos que necesita el frontend

Para coordinar con quien arma el frontend:

1. Al empezar: `POST /api/partidas` y guardar el `id` que devuelve.
2. Al retomar: `GET /api/partidas/:id` para restaurar evidencias y acertijos resueltos.
3. Al encontrar una evidencia libre: `POST /api/partidas/:id/evidencias` con `{ "evidenciaId" }`.
4. Al enviar la respuesta de un acertijo: `POST /api/partidas/:id/acertijos/:acertijoId/validar` con `{ "respuesta" }`, y mostrar las `evidenciasDesbloqueadas` si es correcta.

El frontend debe enviar a esta API los mismos ids de evidencias y acertijos que figuran en el catálogo.

## CORS

`CORS_ORIGIN` lista los orígenes del frontend permitidos, separados por comas (por defecto `http://localhost:5173`). Al publicar el frontend hay que agregar su URL.

## Despliegue en Render

Servicio web con estas opciones: *Root Directory* `backend`, *Build Command* `npm install`, *Start Command* `npm start`. Variables de entorno: `STORAGE=firestore`, `FIREBASE_SERVICE_ACCOUNT_JSON` y `CORS_ORIGIN` con la URL del frontend. En el plan gratuito el servicio se duerme tras 15 minutos sin tráfico y el primer pedido tarda cerca de un minuto en responder.

## Estructura

```
backend/
├── src/
│   ├── server.js                  arranque
│   ├── app.js                     Express: middlewares, rutas, errores
│   ├── config.js                  variables de entorno
│   ├── routes/api.js              rutas HTTP
│   ├── services/partidasService.js   lógica del juego
│   ├── data/capitulo1.js          evidencias y acertijos (con hashes)
│   ├── db/                        repositorios: Firestore y memoria
│   └── utils/                     errores y normalización de respuestas
├── scripts/hash-respuesta.js
└── test/
```
