const crypto = require('node:crypto');

/**
 * Deja la respuesta del jugador en una forma comparable:
 * sin tildes, sin espacios repetidos o en los bordes y (salvo que se indique lo contrario)
 * en minúsculas. Así "  Auditoría  2026 " y "auditoria 2026" cuentan como lo mismo.
 */
function normalizarRespuesta(texto, { distingueMayusculas = false } = {}) {
  let resultado = String(texto)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (!distingueMayusculas) resultado = resultado.toLowerCase();
  return resultado;
}

/** Hash SHA-256 (hex) de la respuesta normalizada. Es lo que se guarda en el catálogo. */
function hashRespuesta(texto, opciones) {
  return crypto
    .createHash('sha256')
    .update(normalizarRespuesta(texto, opciones), 'utf8')
    .digest('hex');
}

/** Compara la respuesta del jugador contra el hash guardado, en tiempo constante. */
function respuestaCoincide(texto, hashEsperado, opciones) {
  const recibido = Buffer.from(hashRespuesta(texto, opciones), 'hex');
  const esperado = Buffer.from(hashEsperado, 'hex');
  return recibido.length === esperado.length && crypto.timingSafeEqual(recibido, esperado);
}

module.exports = { normalizarRespuesta, hashRespuesta, respuestaCoincide };
