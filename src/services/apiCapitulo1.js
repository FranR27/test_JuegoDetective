/**
 * Cliente de la API del capítulo 1 (Integrante 3).
 *
 * El prototipo funciona sin backend: `useInvestigation` valida los acertijos
 * localmente. Si se define `VITE_API_URL`, el mismo hook usa esta API y el
 * backend pasa a ser la fuente de verdad de los acertijos resueltos.
 *
 * Contrato acordado con el backend:
 * - Las respuestas de opción múltiple se envían como ids ordenados unidos por "|".
 *   Ej.: `p1_hermano|p1_vpn`. Así el backend valida sin que el frontend conozca
 *   cuál de las opciones es la correcta.
 * - La clave de carpeta se envía normalizada a letras y números: `08472026`.
 * - El backend devuelve `acertijosResueltos`, y el frontend deriva de ahí los
 *   documentos, carpetas y evidencias visibles (no hace falta duplicar reglas).
 */

import { normalizePassword } from '../features/investigation/puzzleEngine.js';

export const API_POR_DEFECTO = 'http://localhost:3001/api';
export const CLAVE_PARTIDA = 'caso404:partidaId';

/** Ids reales del frontend -> ids del catálogo provisional de feature/backend. */
export const CONTRATO_COMPATIBILIDAD = Object.freeze({
  nombre: 'compatibilidad',
  acertijos: Object.freeze({
    p1_despedida: 'mensaje-despedida',
    p2_auditoria: 'auditoria-2026',
    p3_renuncia: 'historial-renuncia',
  }),
  evidencias: Object.freeze({
    ev_credencial: 'ev-fotografia-oficina',
    ev_registro_accesos: 'ev-ultima-conexion',
    ev_metadatos: 'ev-contradiccion-mensaje',
    ev_nota_auditoria: 'ev-documentos-auditoria',
    ev_renuncia_falsa: 'ev-historial-comparado',
  }),
});

const ACERTIJOS_FRONTEND = ['p1_despedida', 'p2_auditoria', 'p3_renuncia'];

/** Contrato recomendado: el backend usa exactamente los ids del frontend. */
export const CONTRATO_FRONTEND = Object.freeze({
  nombre: 'frontend',
  acertijos: Object.freeze(
    Object.fromEntries(ACERTIJOS_FRONTEND.map((id) => [id, id]))
  ),
  evidencias: Object.freeze({}),
});

/**
 * Hashes SHA-256 de las respuestas canónicas, calculados con la misma
 * normalización que `backend/src/utils/respuesta.js`.
 *
 * Se usan en los tests y en `docs/integracion.md` para que Integrante 3 cargue
 * el catálogo sin equivocarse. No se envían al navegador en producción: el
 * backend es el único que debe guardarlos.
 */
export const HASHES_BACKEND = Object.freeze({
  p1_despedida: Object.freeze({
    hashRespuesta: '879d1a83472b99ebcba505f387b2ed8973a647efea180565e9e2e0bc6adb591f',
    distingueMayusculas: false,
  }),
  p2_auditoria: Object.freeze({
    hashRespuesta: 'e2f489d0059c34576b86132e479c8521f2f18895b57dfbf5dd0156f901c6da17',
    distingueMayusculas: false,
  }),
  p3_renuncia: Object.freeze({
    hashRespuesta: 'fcb65099d57bb66fb0b9599c3a3b15a8f9d14ef6307fd90a07eb9e18ee7742d8',
    distingueMayusculas: false,
  }),
});

export class ApiError extends Error {
  constructor(mensaje, { estado = 0, codigo = 'error_api', causa = null } = {}) {
    super(mensaje);
    this.name = 'ApiError';
    this.estado = estado;
    this.codigo = codigo;
    this.causa = causa;
  }
}

function invertirMapa(mapa) {
  const inverso = {};
  for (const [frontendId, backendId] of Object.entries(mapa)) {
    if (!(backendId in inverso)) inverso[backendId] = frontendId;
  }
  return inverso;
}

/** Respuesta que viaja al backend, en el formato canónico acordado. */
export function respuestaParaBackend(puzzle, answer) {
  if (!puzzle) return '';
  if (puzzle.type === 'password') return normalizePassword(answer);
  const selected = Array.isArray(answer) ? [...new Set(answer)] : [];
  return selected.sort().join('|');
}

/** Partida del backend -> estado local del frontend. */
export function estadoDesdePartida(partida, contrato = CONTRATO_FRONTEND) {
  const inverso = invertirMapa(contrato.acertijos);
  const solvedPuzzleIds = (partida?.acertijosResueltos ?? [])
    .map((backendId) => inverso[backendId])
    .filter(Boolean);

  return { solvedPuzzleIds };
}

function unirUrl(baseUrl, ruta) {
  return `${String(baseUrl).replace(/\/+$/, '')}${ruta}`;
}

/**
 * Crea un cliente HTTP. Se puede inyectar `fetchImpl` en los tests.
 */
export function crearClienteApi({
  baseUrl = API_POR_DEFECTO,
  fetchImpl = globalThis.fetch,
  contrato = CONTRATO_FRONTEND,
} = {}) {
  if (typeof fetchImpl !== 'function') {
    throw new Error('No hay fetch disponible para crear el cliente de la API.');
  }

  const inversoAcertijos = invertirMapa(contrato.acertijos);

  async function pedir(ruta, { metodo = 'GET', cuerpo } = {}) {
    let respuesta;
    try {
      respuesta = await fetchImpl(unirUrl(baseUrl, ruta), {
        method: metodo,
        headers: cuerpo === undefined ? {} : { 'Content-Type': 'application/json' },
        body: cuerpo === undefined ? undefined : JSON.stringify(cuerpo),
      });
    } catch (error) {
      throw new ApiError('No se pudo conectar con el backend del caso.', {
        codigo: 'sin_conexion',
        causa: error,
      });
    }

    let datos = null;
    try {
      datos = await respuesta.json();
    } catch {
      datos = null;
    }

    if (!respuesta.ok) {
      throw new ApiError(
        datos?.error?.mensaje ?? `El backend respondió con HTTP ${respuesta.status}.`,
        {
          estado: respuesta.status,
          codigo: datos?.error?.codigo ?? 'error_http',
        }
      );
    }

    return datos;
  }

  function idAcertijo(puzzleId) {
    return contrato.acertijos[puzzleId] ?? puzzleId;
  }

  function idEvidencia(evidenciaId) {
    return contrato.evidencias[evidenciaId] ?? evidenciaId;
  }

  return {
    contrato: contrato.nombre,

    salud() {
      return pedir('/health');
    },

    crearPartida(capitulo = 1) {
      return pedir('/partidas', { metodo: 'POST', cuerpo: { capitulo } });
    },

    obtenerPartida(partidaId) {
      return pedir(`/partidas/${encodeURIComponent(partidaId)}`);
    },

    async registrarEvidencia(partidaId, evidenciaId) {
      const partida = await pedir(`/partidas/${encodeURIComponent(partidaId)}/evidencias`, {
        metodo: 'POST',
        cuerpo: { evidenciaId: idEvidencia(evidenciaId) },
      });
      return partida;
    },

    /** Envía la respuesta y devuelve el resultado ya traducido al frontend. */
    async validarAcertijo(partidaId, puzzleId, puzzle, answer) {
      const respuesta = respuestaParaBackend(puzzle, answer);
      const resultado = await pedir(
        `/partidas/${encodeURIComponent(partidaId)}/acertijos/${encodeURIComponent(
          idAcertijo(puzzleId)
        )}/validar`,
        { metodo: 'POST', cuerpo: { respuesta } }
      );

      return {
        correcto: Boolean(resultado?.correcto),
        yaResuelto: Boolean(resultado?.yaResuelto),
        evidenciasDesbloqueadas: resultado?.evidenciasDesbloqueadas ?? [],
        partida: resultado?.partida ?? null,
        solvedPuzzleIds: estadoDesdePartida(resultado?.partida, contrato).solvedPuzzleIds,
      };
    },

    /** Traduce los ids del backend a los del frontend para hidratar la partida. */
    estado(partida) {
      return estadoDesdePartida(partida, contrato);
    },
  };
}

/**
 * Devuelve un cliente si el proyecto define `VITE_API_URL`; si no, `null` y el
 * prototipo sigue funcionando con validación local.
 *
 * Variables:
 * - `VITE_API_URL`: por ejemplo `http://localhost:3001/api`.
 * - `VITE_API_IDS`: `frontend` (recomendado) o `compat` para el catálogo
 *   provisional de la rama feature/backend.
 */
export function apiDesdeEntorno() {
  const env = import.meta.env ?? {};
  const baseUrl = env.VITE_API_URL?.trim();
  if (!baseUrl) return null;

  const compat = String(env.VITE_API_IDS ?? '').toLowerCase() === 'compat';
  return crearClienteApi({
    baseUrl,
    contrato: compat ? CONTRATO_COMPATIBILIDAD : CONTRATO_FRONTEND,
  });
}

export function leerPartidaId(storage = globalThis.localStorage) {
  try {
    return storage?.getItem(CLAVE_PARTIDA) || null;
  } catch {
    return null;
  }
}

export function guardarPartidaId(partidaId, storage = globalThis.localStorage) {
  try {
    if (partidaId) storage?.setItem(CLAVE_PARTIDA, partidaId);
  } catch {
    // El navegador puede bloquear localStorage; la partida sigue en memoria.
  }
}

export function borrarPartidaId(storage = globalThis.localStorage) {
  try {
    storage?.removeItem(CLAVE_PARTIDA);
  } catch {
    // Nada que hacer.
  }
}
