require('dotenv').config();

const ALMACENAMIENTOS = ['memory', 'firestore'];

function leerOrigenes(valor) {
  return (valor ?? 'http://localhost:5173,http://127.0.0.1:5173')
    .split(',')
    .map((origen) => origen.trim())
    .filter(Boolean);
}

function cargarConfig(env = process.env) {
  const almacenamiento = (env.STORAGE ?? 'memory').toLowerCase();
  if (!ALMACENAMIENTOS.includes(almacenamiento)) {
    throw new Error(
      `STORAGE inválido: "${env.STORAGE}". Valores permitidos: ${ALMACENAMIENTOS.join(', ')}.`
    );
  }

  return {
    entorno: env.NODE_ENV ?? 'development',
    puerto: Number(env.PORT) || 3001,
    origenesCors: leerOrigenes(env.CORS_ORIGIN),
    almacenamiento,
    coleccionFirestore: env.FIRESTORE_COLLECTION || 'partidas',
  };
}

module.exports = { cargarConfig };
