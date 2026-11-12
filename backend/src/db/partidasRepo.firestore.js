const { FieldValue } = require('firebase-admin/firestore');

// Código gRPC que devuelve Firestore cuando se intenta actualizar un documento que no existe.
const NOT_FOUND = 5;

/**
 * Repositorio de partidas sobre Firestore (colección "partidas" por defecto).
 * Cada partida es un documento; su id lo genera Firestore.
 *
 * Las actualizaciones usan arrayUnion, que es atómico y no repite elementos, así que dos
 * pedidos simultáneos no se pisan entre sí.
 */
function crearRepoFirestore(db, nombreColeccion = 'partidas') {
  const coleccion = db.collection(nombreColeccion);

  async function obtener(id) {
    const snapshot = await coleccion.doc(id).get();
    return snapshot.exists ? { id: snapshot.id, ...snapshot.data() } : null;
  }

  async function actualizar(id, cambios) {
    try {
      await coleccion.doc(id).update(cambios);
    } catch (error) {
      if (error.code === NOT_FOUND) return null;
      throw error;
    }
    return obtener(id);
  }

  return {
    async crear(datos) {
      const referencia = coleccion.doc();
      await referencia.set(datos);
      return { id: referencia.id, ...datos };
    },

    obtener,

    registrarEvidencia(id, evidenciaId, ahora) {
      return actualizar(id, {
        evidenciasEncontradas: FieldValue.arrayUnion(evidenciaId),
        ultimaActualizacion: ahora,
      });
    },

    registrarAcertijoResuelto(id, acertijoId, evidenciasIds, ahora) {
      const cambios = {
        acertijosResueltos: FieldValue.arrayUnion(acertijoId),
        ultimaActualizacion: ahora,
      };
      if (evidenciasIds.length > 0) {
        cambios.evidenciasEncontradas = FieldValue.arrayUnion(...evidenciasIds);
      }
      return actualizar(id, cambios);
    },
  };
}

module.exports = { crearRepoFirestore };
