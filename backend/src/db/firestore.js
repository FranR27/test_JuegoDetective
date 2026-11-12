const { initializeApp, cert, applicationDefault, getApps } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

/**
 * Inicializa el SDK Admin de Firebase y devuelve la instancia de Firestore.
 *
 * Credenciales (se usa la primera que exista):
 *  1. FIREBASE_SERVICE_ACCOUNT_JSON: el JSON completo de la cuenta de servicio en una sola línea
 *     (cómodo para Render y otros hostings donde no hay archivos).
 *  2. GOOGLE_APPLICATION_CREDENTIALS: ruta al archivo JSON (cómodo en local).
 *
 * Las claves nunca deben estar en el código ni en GitHub.
 */
function iniciarFirestore(env = process.env) {
  if (getApps().length === 0) {
    const jsonEnLinea = env.FIREBASE_SERVICE_ACCOUNT_JSON;

    if (jsonEnLinea) {
      let cuenta;
      try {
        cuenta = JSON.parse(jsonEnLinea);
      } catch {
        throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON no es un JSON válido.');
      }
      initializeApp({ credential: cert(cuenta) });
    } else if (env.GOOGLE_APPLICATION_CREDENTIALS) {
      initializeApp({ credential: applicationDefault() });
    } else {
      throw new Error(
        'Falta configurar las credenciales de Firebase: definí FIREBASE_SERVICE_ACCOUNT_JSON ' +
          'o GOOGLE_APPLICATION_CREDENTIALS (o usá STORAGE=memory para desarrollar sin Firebase).'
      );
    }
  }

  return getFirestore();
}

module.exports = { iniciarFirestore };
