const { HttpError } = require('../utils/errores');
const { respuestaCoincide } = require('../utils/respuesta');

// Los ids de partida los genera Firestore (alfanuméricos). Se valida el formato para no
// pasar a la base valores raros (por ejemplo con "/", que Firestore no permite en un id).
const FORMATO_ID = /^[A-Za-z0-9_-]{1,64}$/;
const LARGO_MAX_RESPUESTA = 200;

/**
 * Lógica del juego. No conoce Express ni Firestore: recibe un repositorio y los capítulos,
 * así se puede probar sin servidor ni base de datos.
 */
function crearPartidasService({ repo, capitulos, ahora = () => new Date().toISOString() }) {
  function validarId(id, nombre = 'id') {
    if (typeof id !== 'string' || !FORMATO_ID.test(id)) {
      throw new HttpError(400, 'id_invalido', `El ${nombre} no tiene un formato válido.`);
    }
  }

  async function cargarPartida(id) {
    validarId(id, 'id de la partida');
    const partida = await repo.obtener(id);
    if (!partida) {
      throw new HttpError(404, 'partida_no_encontrada', 'No existe una partida con ese id.');
    }
    return partida;
  }

  function capituloDe(partida) {
    const capitulo = capitulos[partida.capitulo];
    if (!capitulo) {
      throw new HttpError(500, 'capitulo_inexistente', 'La partida apunta a un capítulo que no existe.');
    }
    return capitulo;
  }

  return {
    async crearPartida({ capitulo = 1 } = {}) {
      if (!Number.isInteger(capitulo) || !capitulos[capitulo]) {
        throw new HttpError(400, 'capitulo_invalido', 'El capítulo indicado no existe.');
      }
      const momento = ahora();
      return repo.crear({
        capitulo,
        evidenciasEncontradas: [],
        acertijosResueltos: [],
        creadaEn: momento,
        ultimaActualizacion: momento,
      });
    },

    obtenerPartida(id) {
      return cargarPartida(id);
    },

    /** Marca una evidencia como encontrada. Las bloqueadas requieren haber resuelto su acertijo. */
    async registrarEvidencia(id, { evidenciaId } = {}) {
      if (typeof evidenciaId !== 'string' || evidenciaId.length === 0) {
        throw new HttpError(400, 'evidencia_invalida', 'Falta "evidenciaId" (texto) en el cuerpo.');
      }

      const partida = await cargarPartida(id);
      const evidencia = capituloDe(partida).evidencias.find((e) => e.id === evidenciaId);
      if (!evidencia) {
        throw new HttpError(404, 'evidencia_no_encontrada', 'No existe esa evidencia en el capítulo.');
      }

      if (evidencia.desbloqueadaPor && !partida.acertijosResueltos.includes(evidencia.desbloqueadaPor)) {
        throw new HttpError(403, 'evidencia_bloqueada', 'Esa evidencia todavía está bloqueada.');
      }

      if (partida.evidenciasEncontradas.includes(evidenciaId)) return partida;

      const actualizada = await repo.registrarEvidencia(id, evidenciaId, ahora());
      if (!actualizada) {
        throw new HttpError(404, 'partida_no_encontrada', 'No existe una partida con ese id.');
      }
      return actualizada;
    },

    /**
     * Valida la respuesta de un acertijo. La solución nunca sale del servidor: solo se informa
     * si es correcta o no. Un acertijo correcto se guarda y agrega a la partida las evidencias
     * que desbloquea.
     */
    async validarAcertijo(id, acertijoId, { respuesta } = {}) {
      if (typeof respuesta !== 'string' || respuesta.trim().length === 0 || respuesta.length > LARGO_MAX_RESPUESTA) {
        throw new HttpError(
          400,
          'respuesta_invalida',
          `Falta "respuesta" (texto de hasta ${LARGO_MAX_RESPUESTA} caracteres) en el cuerpo.`
        );
      }

      const partida = await cargarPartida(id);
      const acertijo = capituloDe(partida).acertijos.find((a) => a.id === acertijoId);
      if (!acertijo) {
        throw new HttpError(404, 'acertijo_no_encontrado', 'No existe ese acertijo en el capítulo.');
      }

      const correcto = respuestaCoincide(respuesta, acertijo.hashRespuesta, {
        distingueMayusculas: acertijo.distingueMayusculas,
      });
      if (!correcto) {
        return { correcto: false, yaResuelto: false, evidenciasDesbloqueadas: [], partida };
      }

      if (partida.acertijosResueltos.includes(acertijo.id)) {
        return { correcto: true, yaResuelto: true, evidenciasDesbloqueadas: [], partida };
      }

      const actualizada = await repo.registrarAcertijoResuelto(id, acertijo.id, acertijo.desbloquea, ahora());
      if (!actualizada) {
        throw new HttpError(404, 'partida_no_encontrada', 'No existe una partida con ese id.');
      }
      return {
        correcto: true,
        yaResuelto: false,
        evidenciasDesbloqueadas: acertijo.desbloquea,
        partida: actualizada,
      };
    },
  };
}

module.exports = { crearPartidasService };
