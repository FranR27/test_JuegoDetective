const crypto = require('node:crypto');

/**
 * Repositorio de partidas en memoria. Sirve para desarrollar y para los tests sin necesitar
 * Firebase. Los datos se pierden al reiniciar el servidor.
 *
 * Tiene el mismo contrato que el repositorio de Firestore:
 *   crear(datos)                                              -> partida (con id)
 *   obtener(id)                                               -> partida | null
 *   registrarEvidencia(id, evidenciaId, ahora)                -> partida | null
 *   registrarAcertijoResuelto(id, acertijoId, evidencias, ahora) -> partida | null
 */
function crearRepoMemoria() {
  const partidas = new Map();

  const copia = (partida) => structuredClone(partida);

  function agregarSinRepetir(lista, elementos) {
    for (const elemento of elementos) {
      if (!lista.includes(elemento)) lista.push(elemento);
    }
  }

  return {
    async crear(datos) {
      const partida = { id: crypto.randomUUID(), ...structuredClone(datos) };
      partidas.set(partida.id, partida);
      return copia(partida);
    },

    async obtener(id) {
      const partida = partidas.get(id);
      return partida ? copia(partida) : null;
    },

    async registrarEvidencia(id, evidenciaId, ahora) {
      const partida = partidas.get(id);
      if (!partida) return null;
      agregarSinRepetir(partida.evidenciasEncontradas, [evidenciaId]);
      partida.ultimaActualizacion = ahora;
      return copia(partida);
    },

    async registrarAcertijoResuelto(id, acertijoId, evidenciasIds, ahora) {
      const partida = partidas.get(id);
      if (!partida) return null;
      agregarSinRepetir(partida.acertijosResueltos, [acertijoId]);
      agregarSinRepetir(partida.evidenciasEncontradas, evidenciasIds);
      partida.ultimaActualizacion = ahora;
      return copia(partida);
    },
  };
}

module.exports = { crearRepoMemoria };
