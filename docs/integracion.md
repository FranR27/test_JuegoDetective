# Integración con el backend (Integrante 3)

La API Express para crear partidas, registrar evidencias y validar acertijos está integrada en esta misma rama, junto con el catálogo real y el cliente HTTP del frontend.

## Estado actual

| Pieza | Estado |
|---|---|
| API de partidas, evidencias y acertijos | Integrada en `backend/` |
| Persistencia en memoria | Lista (`STORAGE=memory`) |
| Firestore | Probado de punta a punta con la partida real |
| Catálogo real del capítulo 1 | Aplicado en `backend/src/data/capitulo1.js` |
| Cliente HTTP del frontend | En `src/services/apiCapitulo1.js` |
| Sincronización de partida | En `src/features/investigation/useInvestigation.js` |
| Validación local sin backend | Sigue disponible y es el modo por defecto |

El catálogo del backend usa exactamente los ids del frontend y las respuestas reales. Ya no hace falta traducir ids ni reemplazar archivos.

## Puesta en marcha

### 1. Levantar el backend

```powershell
cd backend
Copy-Item .env.example .env
npm.cmd install
npm.cmd run dev
```

Por defecto escucha en `http://localhost:3001`, con `STORAGE=memory` y CORS para `http://localhost:5173`. Comprobar:

```bash
curl http://localhost:3001/api/health
```

Para persistir las partidas en Firestore, seguir `backend/README.md`.

### 2. Configurar el frontend

En la raíz del repositorio:

```powershell
Copy-Item .env.example .env.local
```

Contenido:

```dotenv
VITE_API_URL=http://localhost:3001/api
VITE_API_IDS=frontend
```

Reiniciar Vite (`npm.cmd run dev`). El pie de la app debe mostrar **Backend conectado · partida …**.

### 3. Jugar

- Al entrar se crea una partida y se guarda su id en `localStorage` (`caso404:partidaId`).
- Al recargar se retoma la misma partida con `GET /api/partidas/:id`.
- Al resolver un acertijo se llama a `POST /api/partidas/:id/acertijos/:acertijoId/validar`.
- Al reiniciar con el botón **Reiniciar** se crea una partida nueva y se borra el id anterior.
- Si el backend no responde, la app sigue en local y lo indica en el pie. La caída de red no bloquea la revisión del prototipo.

## Contrato de ids

Con `VITE_API_IDS=frontend` (recomendado) no hay traducción: el backend usa los mismos ids que `src/data/`.

| Frontend | Backend con catálogo nuevo | Backend provisional (`compat`) |
|---|---|---|
| `p1_despedida` | `p1_despedida` | `mensaje-despedida` |
| `p2_auditoria` | `p2_auditoria` | `auditoria-2026` |
| `p3_renuncia` | `p3_renuncia` | `historial-renuncia` |
| `ev_registro_accesos` | `ev_registro_accesos` | `ev-ultima-conexion` |
| `ev_metadatos` | `ev_metadatos` | `ev-contradiccion-mensaje` |
| `ev_nota_auditoria` | `ev_nota_auditoria` | `ev-documentos-auditoria` |
| `ev_renuncia_falsa` | `ev_renuncia_falsa` | `ev-historial-comparado` |
| `ev_credencial` | `ev_credencial` | `ev-fotografia-oficina` |

`CONTRATO_COMPATIBILIDAD` existe solo para probar la API provisional sin tocar el backend. No permite validar las respuestas reales porque los hashes siguen siendo de demo.

## Respuestas que viajan al backend

El frontend no envía la respuesta "correcta": envía la selección del jugador en forma canónica.

| Acertijo | Respuesta enviada | Hash |
|---|---|---|
| `p1_despedida` | `p1_hermano|p1_vpn` | `879d1a83…db591f` |
| `p2_auditoria` | `08472026` | `e2f489d0…c6da17` |
| `p3_renuncia` | `p3_audit_trail|p3_rosario` | `fcb65099…7742d8` |

Los ids de opción múltiple se ordenan alfabéticamente y se unen con `|`. La clave se normaliza a letras y números. El backend normaliza sin tildes, sin espacios extra y en minúsculas, y compara contra el hash. Los hashes completos están en `src/services/apiCapitulo1.js` (`HASHES_BACKEND`) y en el catálogo de ejemplo.

Si se cambia una respuesta, hay que regenerar el hash con el script del backend:

```bash
npm run hash -- "p1_hermano|p1_vpn"
```

## Evidencias: quién muestra qué

Hay dos capas distintas y conviene no mezclarlas:

1. **Visibilidad en el frontend:** se deriva de `solvedPuzzleIds` con `getUnlockedContent`. Si P1 está resuelto, se ven sus 3 evidencias y los 2 documentos; las 9 evidencias base siempre están visibles. Esto no depende de la API.
2. **Registro en el backend:** `evidenciasEncontradas` guarda lo que el jugador encontró o lo que el backend agregó al resolver un acertijo. Al validar P1, P2 y P3 se agregan 10 evidencias (3 + 4 + 3). Las 9 base se registran con `POST /partidas/:id/evidencias` cuando corresponde.

Por eso, después de resolver los tres acertijos en una partida nueva, el backend puede tener 10 evidencias de acertijos (más las base que se hayan registrado) mientras el frontend muestra 19/19. Es correcto: el progreso visual se deriva de los acertijos, y el backend acumula lo encontrado.

## Verificación realizada

- `npm test` en la raíz: **24 tests** de canon, referencias, acertijos, contrato de API y hashes.
- `npm test` en `backend/`: **26 tests** con el catálogo real aplicado.
- `npm run build`: build de producción correcto.
- Prueba real de punta a punta contra `STORAGE=firestore`:
  - `POST /partidas` → partida creada;
  - evidencia bloqueada → **403** `evidencia_bloqueada`;
  - evidencia libre → registrada;
  - P1 con una sola opción → `correcto: false`;
  - P1, P2 y P3 con las respuestas reales (incluida la clave `0847-2026` normalizada por el cliente) → `correcto: true` y 3 + 4 + 3 evidencias desbloqueadas;
  - partida final → 3 acertijos resueltos;
  - la UI mostró **Backend conectado** y resolvió P1 desde el navegador.

## Pendientes de coordinación

### Con Integrante 3

- Decidir si el catálogo público (títulos, pistas, opciones) también se sirve desde la API. Hoy el frontend lo tiene embebido; las respuestas no.
- Confirmar si se persisten intentos, pistas o estados de lectura. Hoy el backend no los guarda.
- Configurar `CORS_ORIGIN` con la URL del frontend publicado al desplegar.

### Con Integrante 1

- Importar los componentes `FileExplorer`, `MailApp`, `MessagesApp`, `EvidenceBoard` y `PuzzlePanel` en el escritorio.
- Copiar `public/case/photos/` a su `public/`.
- Pasar `unlocked.*` y los callbacks de `useInvestigation` a las pantallas.
- Respetar el modo QA fuera de producción.

### Sobre el material del Drive

El enlace `https://drive.google.com/drive/folders/1mZzWKjdC_0hbUc_2iyNI4KZt3msPmuzR` pide iniciar sesión y no se pudo leer. Si ahí están los avances de los otros integrantes, hace falta:

- compartirlo como «cualquiera con el enlace puede ver», o
- exportar los archivos y subirlos a la rama correspondiente, o
- pegar acá los nombres/ids/contratos que haya que respetar.

Mientras tanto, esta entrega se alineó con la única rama nueva disponible: `origin/feature/backend`.
