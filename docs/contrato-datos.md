# Contrato de datos

Este documento describe las estructuras que consume el frontend del capítulo 1 y el contrato con la API del Integrante 3. La fuente de la verdad es `src/data/`; los tests de `tests/data.test.js` verifican las referencias y los totales.

## Convenciones

- Los ids son strings estables, en `snake_case`, con prefijo por colección:
  - `doc_` documentos, `f_` carpetas, `mail_` correos, `chat_` conversaciones, `foto_` fotografías, `ev_` evidencias, `p1_` / `p2_` / `p3_` acertijos y opciones.
- Las fechas son ISO 8601 con zona horaria de Buenos Aires (`-03:00`).
- Los montos son números enteros en pesos argentinos.
- Los textos son ficticios. No usar datos reales de personas ni empresas.
- Nada de lo que está bloqueado se muestra antes de resolver su acertijo.

## Resumen de colecciones

| Colección | Archivo | Cantidad |
|---|---|---|
| Capítulo | `capitulo1.js` | 1 |
| Personajes | `personajes.js` | 7 |
| Fotografías | `fotografias.js` | 6 |
| Carpetas | `archivos.js` | 5 |
| Documentos | `archivos.js` | 15 |
| Correos | `correos.js` | 6 (5 recibidos + 1 enviado) |
| Conversaciones | `mensajes.js` | 3 |
| Evidencias | `evidencias.js` | 19 |
| Acertijos | `acertijos.js` | 3 |

## Capítulo

```js
{
  id: 'cap_01',
  casoId: 'caso_404',
  numero: 1,
  caso: 'CASO 404',
  titulo: 'La persona que desapareció',
  lugar: 'Boreal Systems S.A. — Buenos Aires, Argentina',
  fechaInicio: '2026-03-16T09:00:00-03:00',
  fechaDesaparicion: '2026-03-13T19:42:00-03:00',
  denunciante: 'Marta Morgan (madre)',
  investigador: 'Vos',
  sinopsis: ['...'],
  objetivo: '...',
  desenlace: ['...'],
  cierre: {
    titulo: 'Fin del capítulo 1',
    texto: '...',
    ganchoCapitulo2: '...'
  },
  estado: '...'
}
```

`resumenCaso` agrupa los datos que se muestran en el HUD: víctima, legajo, última salida, correo de despedida, carpeta bloqueada, clave correcta y monto desviado.

## Personaje

```js
{
  id: 'alex',
  nombre: 'Alex Morgan',
  iniciales: 'AM',
  edad: 34,
  rol: 'Auditor interno senior',
  legajo: '0847',              // solo si aplica
  relacion: 'Persona desaparecida',
  estado: 'Desaparecido desde el 13/03/2026',
  telefono: '+54 9 11 5555-0107',
  email: 'a.morgan@borealsystems.com',
  descripcion: '...',
  nota: '...'
}
```

## Fotografía

```js
{
  id: 'foto_credencial',
  title: 'Credencial de Alex Morgan',
  file: 'credencial-alex.svg',       // relativo a public/case/photos/
  date: '2026-03-13T19:40:00-03:00',
  location: 'Boreal Systems — molinete 1',
  description: '...',
  tags: ['identificación', 'legajo 0847'],
  evidenceId: 'ev_credencial'        // evidencia que ilustra
}
```

`photoSrc(file)` antepone `BASE_URL + 'case/photos/'`, así funciona tanto en desarrollo como en un deploy bajo subruta.

## Carpeta

```js
{
  id: 'f_auditoria',
  name: 'AUDITORIA_2026',
  code: 'AUD',
  description: '...',
  lockedByPuzzleId: 'p2_auditoria',   // null si está disponible desde el inicio
  lock: {
    type: 'password',
    puzzleId: 'p2_auditoria',
    label: 'Carpeta cifrada',
    placeholder: 'Clave'
  }
}
```

Una carpeta bloqueada puede seguir mostrándose en la lista, pero sus documentos no se pueden abrir hasta que se resuelva el acertijo.

## Documento

```js
{
  id: 'doc_legajo',
  folderId: 'f_rrhh',
  title: 'Legajo de personal — A. Morgan (0847)',
  kind: 'pdf',                    // pdf | txt | csv | img
  date: '2021-04-05T09:00:00-03:00',
  author: 'Recursos Humanos',
  summary: '...',
  tags: ['legajo', 'RRHH', 'familia'],
  lockedByPuzzleId: null,
  blocks: [ ... ]
}
```

### Bloques de documento

| `type` | Campos | Uso |
|---|---|---|
| `heading` | `text` | Título interno del documento |
| `paragraph` | `text` | Párrafo |
| `kv` | `items: [{ label, value }]` | Ficha de datos |
| `table` | `columns`, `rows` | Tabla de movimientos, logs, etc. |
| `list` | `items` | Lista de puntos |
| `note` | `text`, `tone` | Aviso o nota al margen (`info`, `warning`, `danger`) |
| `quote` | `text`, `source` | Cita textual |
| `signature` | `name`, `role`, `date` | Firma |
| `image` | `photoId`, `caption` | Imagen embebida |

Un documento con `lockedByPuzzleId` no aparece en el visor hasta que el acertijo está resuelto. Los tests validan que todos los `photoId` existan y que los bloques usen tipos conocidos.

## Correo

```js
{
  id: 'mail_006',
  box: 'sent',                    // inbox | sent
  from: { name: 'Alex Morgan', email: 'a.morgan@borealsystems.com' },
  to: [{ name: 'Valeria Ruiz', email: 'valeria.ruiz@borealsystems.com' }],
  subject: 'Me voy. No me busquen',
  preview: '...',
  date: '2026-03-14T02:17:41-03:00',
  body: ['...'],                  // párrafos
  attachments: [{ ref: 'doc_metadatos_despedida', title: '...' }],
  tags: ['enviado', 'despedida'],
  relatedEvidenceIds: ['ev_correo_despedida']
}
```

Requisitos:
- Exactamente **5 recibidos** y **1 enviado**.
- Los adjuntos referencian documentos existentes.
- El correo enviado es la falsa despedida y es la fuente de `ev_correo_despedida`.

## Conversación

```js
{
  id: 'chat_valeria',
  contactId: 'valeria',           // personaje existente
  lastMessageAt: '2026-03-12T23:19:00-03:00',
  messages: [
    {
      id: 'cv_01',
      authorId: 'valeria',        // personaje existente
      at: '2026-03-12T23:02:00-03:00',
      text: '...'
    }
  ],
  relatedEvidenceIds: ['ev_chat_valeria']
}
```

Los mensajes deben estar ordenados por fecha y `lastMessageAt` debe coincidir con el último.

## Evidencia

```js
{
  id: 'ev_credencial',
  code: 'EV-01',
  title: 'Credencial de Alex (legajo 0847)',
  type: 'fisica',                 // documento | digital | testimonio | fisica
  description: '...',
  detail: '...',
  source: {
    type: 'photo',                // photo | email | document | chat
    id: 'foto_credencial',
    label: 'Credencial de Alex Morgan'
  },
  unlockedByPuzzleId: null,       // null = disponible desde el inicio
  optionalClue: '...',
  tags: ['identificación', 'legajo']
}
```

- `source` debe apuntar a una pieza existente de la colección correspondiente.
- `unlockedByPuzzleId` debe coincidir con el `unlocks.evidenceIds` del acertijo.
- Una evidencia bloqueada no se muestra en el tablero; su pista opcional tampoco.

## Acertijo

```js
{
  id: 'p1_despedida',
  order: 1,
  title: 'La despedida que no cierra',
  subtitle: 'Correo de despedida — 14/03/2026, 02:17',
  type: 'multiple',               // multiple | password
  question: '...',
  instructions: '...',
  options: [{ id: 'p1_hermano', text: '...' }],  // solo multiple
  answer: ['p1_hermano', 'p1_vpn'],               // multiple: exactamente 2
  password: {                                     // solo password
    placeholder: 'Ej.: 0000-0000',
    maxLength: 24,
    help: '...'
  },
  requiresSolved: [],             // ids de acertijos previos
  unlocks: {
    evidenceIds: ['ev_metadatos', 'ev_declaracion_marta', 'ev_nota_caja'],
    documentIds: ['doc_metadatos_despedida', 'doc_nota_caja'],
    folderIds: [],
    chapterComplete: false
  },
  hints: ['...'],                 // no revelan la respuesta literal
  rewardSummary: ['...']          // texto para el jugador
}
```

### Invariantes

- `answer` de un acertijo `multiple` tiene exactamente 2 ids, sin repetir, y todos existen en `options`.
- Hay más opciones que respuestas (al menos un distractor por respuesta).
- `requiresSolved` forma la cadena `p1 → p2 → p3`.
- Solo `p3_renuncia` tiene `chapterComplete: true`.
- Cada documento, carpeta o evidencia bloqueada figura en el `unlocks` de **su** acertijo y en ningún otro.
- Las pistas no copian el texto de una opción correcta ni contienen la clave completa.

## Estado de la investigación

El estado local que mantiene `useInvestigation` es:

```js
{
  solvedPuzzleIds: ['p1_despedida'],
  attemptsByPuzzle: { p1_despedida: 2 },
  hintsByPuzzle: { p1_despedida: 1 },
  readDocumentIds: ['doc_legajo'],
  readEmailIds: ['mail_006'],
  readConversationIds: ['chat_valeria']
}
```

De `solvedPuzzleIds` se derivan las carpetas, documentos y evidencias visibles (`getUnlockedContent`). El progreso se calcula con `getProgress`.

El backend **no** guarda intentos, pistas ni estados de lectura: solo `acertijosResueltos` y `evidenciasEncontradas`. Si se quiere persistir la lectura, se puede agregar más adelante sin cambiar el contrato de los acertijos.

## Contrato de la API

Base: `VITE_API_URL`, por defecto `http://localhost:3001/api`.

| Método y ruta | Cuerpo | Respuesta |
|---|---|---|
| `GET /health` | — | `{ estado, servicio, almacenamiento, hora }` |
| `POST /partidas` | `{ capitulo: 1 }` | `201` partida creada |
| `GET /partidas/:id` | — | partida |
| `POST /partidas/:id/evidencias` | `{ evidenciaId }` | partida actualizada |
| `POST /partidas/:id/acertijos/:acertijoId/validar` | `{ respuesta }` | resultado de validación |

### Partida

```js
{
  id: 'q3Zk1x9PabC2dEfGhIjK',
  capitulo: 1,
  evidenciasEncontradas: ['ev_credencial', 'ev_metadatos'],
  acertijosResueltos: ['p1_despedida'],
  creadaEn: '2026-11-12T21:30:00.000Z',
  ultimaActualizacion: '2026-11-12T21:42:10.000Z'
}
```

### Validación

Pedido:

```json
{ "respuesta": "p1_hermano|p1_vpn" }
```

Respuesta correcta:

```json
{
  "correcto": true,
  "yaResuelto": false,
  "evidenciasDesbloqueadas": ["ev_metadatos", "ev_declaracion_marta", "ev_nota_caja"],
  "partida": { "id": "...", "acertijosResueltos": ["p1_despedida"], "...": "..." }
}
```

Respuesta incorrecta (HTTP 200):

```json
{ "correcto": false, "yaResuelto": false, "evidenciasDesbloqueadas": [], "partida": { "...": "..." } }
```

### Errores

```json
{ "error": { "codigo": "evidencia_bloqueada", "mensaje": "Esa evidencia todavía está bloqueada." } }
```

Códigos: `id_invalido`, `capitulo_invalido`, `evidencia_invalida`, `respuesta_invalida`, `solicitud_invalida`, `evidencia_bloqueada`, `partida_no_encontrada`, `acertijo_no_encontrado`, `evidencia_no_encontrada`, `ruta_no_encontrada`, `error_interno`.

## Serialización de respuestas

| Tipo | Respuesta enviada |
|---|---|
| `multiple` | ids de las opciones elegidas, ordenados y unidos por `|`: `p1_hermano|p1_vpn` |
| `password` | texto normalizado a letras y números: `08472026` |

El backend normaliza (sin tildes, sin espacios extra, minúsculas) y compara contra el hash SHA-256 del catálogo. Los hashes reales están en `src/services/apiCapitulo1.js` (`HASHES_BACKEND`) y en `docs/backend-capitulo1.ejemplo.js`.

## Compatibilidad con el catálogo provisional

La rama `feature/backend` trae ids provisionales (`mensaje-despedida`, `auditoria-2026`, `historial-renuncia`) y solo 5 evidencias. El cliente puede traducirlos con `CONTRATO_COMPATIBILIDAD` y `VITE_API_IDS=compat`, pero ese catálogo conserva respuestas de demo. Para jugar de verdad hay que reemplazarlo por `docs/backend-capitulo1.ejemplo.js`. Ver `docs/integracion.md`.
