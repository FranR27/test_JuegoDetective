import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { acertijosPorId } from '../../data/index.js';
import {
  borrarPartidaId,
  guardarPartidaId,
  leerPartidaId,
} from '../../services/apiCapitulo1.js';
import {
  evaluatePuzzle,
  getProgress,
  getPuzzleStatus,
  getUnlockedContent,
} from './puzzleEngine.js';

export function createInitialState() {
  return {
    solvedPuzzleIds: [],
    attemptsByPuzzle: {},
    hintsByPuzzle: {},
    readDocumentIds: [],
    readEmailIds: [],
    readConversationIds: [],
  };
}

function addUnique(list, id) {
  return list.includes(id) ? list : [...list, id];
}

function mensajeCorrecto(puzzle) {
  return puzzle.type === 'password'
    ? 'Clave correcta. La carpeta se abrió.'
    : 'Deducción correcta. Se desbloquearon nuevas evidencias.';
}

function mensajeIncorrecto(puzzle) {
  return puzzle.type === 'password'
    ? 'La clave no es correcta. Revisá el formato y los dos datos.'
    : 'Todavía no. Alguna de las opciones elegidas no prueba lo que buscás.';
}

const SYNC_LOCAL = Object.freeze({
  enabled: false,
  status: 'local',
  error: null,
  partidaId: null,
  contrato: null,
});

/**
 * Estado de la investigación.
 *
 * Sin `api` valida localmente (modo prototipo/QA). Con `api` crea o retoma una
 * partida en el backend de Integrante 3 y valida los acertijos ahí. Si el
 * backend no responde, sigue jugando en local y lo informa en `sync`.
 *
 * Lo que no viaja al backend: pistas reveladas y estados de lectura. El
 * backend guarda solo acertijos resueltos y evidencias encontradas.
 */
export function useInvestigation({ api = null } = {}) {
  const [state, setState] = useState(createInitialState);
  const [sync, setSync] = useState(() =>
    api ? { ...SYNC_LOCAL, enabled: true, status: 'conectando' } : { ...SYNC_LOCAL }
  );

  const apiRef = useRef(api);
  apiRef.current = api;
  const partidaIdRef = useRef(null);

  useEffect(() => {
    if (!api) {
      partidaIdRef.current = null;
      setSync({ ...SYNC_LOCAL });
      return undefined;
    }

    let cancelado = false;
    setSync({ ...SYNC_LOCAL, enabled: true, status: 'conectando' });

    async function conectar() {
      try {
        let partida = null;
        const guardada = leerPartidaId();

        if (guardada) {
          try {
            partida = await api.obtenerPartida(guardada);
          } catch (error) {
            // Una partida borrada en el servidor se reemplaza por una nueva.
            if (error.estado !== 404) throw error;
          }
        }

        if (!partida) partida = await api.crearPartida();

        if (cancelado) return;

        guardarPartidaId(partida.id);
        partidaIdRef.current = partida.id;

        const { solvedPuzzleIds } = api.estado(partida);
        setState((prev) => ({
          ...prev,
          solvedPuzzleIds: [...new Set([...solvedPuzzleIds, ...prev.solvedPuzzleIds])],
        }));

        setSync({
          enabled: true,
          status: 'conectado',
          error: null,
          partidaId: partida.id,
          contrato: api.contrato,
        });
      } catch (error) {
        if (cancelado) return;
        setSync({
          enabled: true,
          status: 'sin_conexion',
          error: error.message,
          partidaId: null,
          contrato: api.contrato,
        });
      }
    }

    conectar();
    return () => {
      cancelado = true;
    };
  }, [api]);

  const unlocked = useMemo(
    () => getUnlockedContent(state.solvedPuzzleIds),
    [state.solvedPuzzleIds]
  );

  const progress = useMemo(() => getProgress(state), [state]);

  const submitPuzzle = useCallback(
    async (puzzleId, answer) => {
      const puzzle = acertijosPorId[puzzleId];
      if (!puzzle) {
        return { ok: false, message: 'Ese acertijo no existe.' };
      }
      if (state.solvedPuzzleIds.includes(puzzleId)) {
        return { ok: true, message: 'Ya lo habías resuelto.' };
      }
      if (getPuzzleStatus(puzzle, state.solvedPuzzleIds) === 'locked') {
        return { ok: false, message: 'Todavía no tenés acceso a este acertijo.' };
      }

      const sumarIntento = () =>
        setState((prev) => ({
          ...prev,
          attemptsByPuzzle: {
            ...prev.attemptsByPuzzle,
            [puzzleId]: (prev.attemptsByPuzzle[puzzleId] ?? 0) + 1,
          },
        }));

      const marcarResuelto = () =>
        setState((prev) => ({
          ...prev,
          solvedPuzzleIds: addUnique(prev.solvedPuzzleIds, puzzleId),
        }));

      const usarBackend =
        apiRef.current && sync.status === 'conectado' && partidaIdRef.current;

      if (usarBackend) {
        sumarIntento();
        try {
          const resultado = await apiRef.current.validarAcertijo(
            partidaIdRef.current,
            puzzleId,
            puzzle,
            answer
          );

          if (resultado.correcto) {
            if (resultado.solvedPuzzleIds.length) {
              setState((prev) => ({
                ...prev,
                solvedPuzzleIds: [
                  ...new Set([...prev.solvedPuzzleIds, ...resultado.solvedPuzzleIds]),
                ],
              }));
            } else {
              marcarResuelto();
            }
            return { ok: true, source: 'backend', message: mensajeCorrecto(puzzle) };
          }

          return { ok: false, source: 'backend', message: mensajeIncorrecto(puzzle) };
        } catch (error) {
          setSync((prev) => ({
            ...prev,
            status: 'sin_conexion',
            error: error.message,
          }));

          if (error.codigo === 'sin_conexion' || error.estado >= 500) {
            const correctoLocal = evaluatePuzzle(puzzle, answer);
            if (correctoLocal) marcarResuelto();
            return {
              ok: correctoLocal,
              source: 'local',
              message: correctoLocal
                ? `${mensajeCorrecto(puzzle)} El backend no responde: se validó localmente.`
                : mensajeIncorrecto(puzzle),
            };
          }

          return {
            ok: false,
            source: 'backend',
            message: `No se pudo validar con el backend: ${error.message}`,
          };
        }
      }

      sumarIntento();
      const correcto = evaluatePuzzle(puzzle, answer);
      if (correcto) marcarResuelto();

      return {
        ok: correcto,
        source: 'local',
        message: correcto ? mensajeCorrecto(puzzle) : mensajeIncorrecto(puzzle),
      };
    },
    [state.solvedPuzzleIds, sync.status]
  );

  const requestHint = useCallback(
    (puzzleId) => {
      const puzzle = acertijosPorId[puzzleId];
      if (!puzzle) return null;

      const revealed = state.hintsByPuzzle[puzzleId] ?? 0;
      if (revealed >= puzzle.hints.length) return null;

      setState((prev) => ({
        ...prev,
        hintsByPuzzle: {
          ...prev.hintsByPuzzle,
          [puzzleId]: (prev.hintsByPuzzle[puzzleId] ?? 0) + 1,
        },
      }));

      return puzzle.hints[revealed];
    },
    [state.hintsByPuzzle]
  );

  const markDocumentRead = useCallback((documentId) => {
    setState((prev) => ({
      ...prev,
      readDocumentIds: addUnique(prev.readDocumentIds, documentId),
    }));
  }, []);

  const markEmailRead = useCallback((emailId) => {
    setState((prev) => ({
      ...prev,
      readEmailIds: addUnique(prev.readEmailIds, emailId),
    }));
  }, []);

  const markConversationRead = useCallback((conversationId) => {
    setState((prev) => ({
      ...prev,
      readConversationIds: addUnique(prev.readConversationIds, conversationId),
    }));
  }, []);

  const reset = useCallback(async () => {
    setState(createInitialState());

    if (!apiRef.current) {
      partidaIdRef.current = null;
      setSync({ ...SYNC_LOCAL });
      return null;
    }

    borrarPartidaId();
    partidaIdRef.current = null;
    setSync((prev) => ({ ...prev, status: 'conectando', error: null, partidaId: null }));

    try {
      const partida = await apiRef.current.crearPartida();
      guardarPartidaId(partida.id);
      partidaIdRef.current = partida.id;
      setSync({
        enabled: true,
        status: 'conectado',
        error: null,
        partidaId: partida.id,
        contrato: apiRef.current.contrato,
      });
      return partida;
    } catch (error) {
      setSync((prev) => ({
        ...prev,
        status: 'sin_conexion',
        error: error.message,
        partidaId: null,
      }));
      return null;
    }
  }, []);

  return {
    state,
    unlocked,
    progress,
    sync,
    submitPuzzle,
    requestHint,
    markDocumentRead,
    markEmailRead,
    markConversationRead,
    reset,
  };
}
