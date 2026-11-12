const { crearRepoMemoria } = require('./partidasRepo.memory');

/** Elige el repositorio según STORAGE. Firebase solo se carga si realmente se usa. */
function crearRepositorio(config) {
  if (config.almacenamiento === 'firestore') {
    const { iniciarFirestore } = require('./firestore');
    const { crearRepoFirestore } = require('./partidasRepo.firestore');
    return crearRepoFirestore(iniciarFirestore(), config.coleccionFirestore);
  }

  console.warn('[db] STORAGE=memory: las partidas se guardan en memoria y se pierden al reiniciar.');
  return crearRepoMemoria();
}

module.exports = { crearRepositorio };
