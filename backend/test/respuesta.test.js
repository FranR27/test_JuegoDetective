const test = require('node:test');
const assert = require('node:assert/strict');
const { normalizarRespuesta, hashRespuesta, respuestaCoincide } = require('../src/utils/respuesta');

test('normalizarRespuesta quita tildes, espacios repetidos y pasa a minúsculas', () => {
  assert.equal(normalizarRespuesta('  Auditoría   2026 '), 'auditoria 2026');
});

test('normalizarRespuesta respeta mayúsculas si se pide', () => {
  assert.equal(normalizarRespuesta(' Clave-ABC ', { distingueMayusculas: true }), 'Clave-ABC');
});

test('hashRespuesta es estable y tiene 64 caracteres hexadecimales', () => {
  const hash = hashRespuesta('demo-despedida');
  assert.match(hash, /^[0-9a-f]{64}$/);
  assert.equal(hash, hashRespuesta('  DEMO-despedida '));
});

test('respuestaCoincide acepta la correcta y rechaza la incorrecta', () => {
  const hash = hashRespuesta('rosa');
  assert.equal(respuestaCoincide('  Rosa ', hash), true);
  assert.equal(respuestaCoincide('margarita', hash), false);
});

test('respuestaCoincide con un hash mal formado devuelve false sin lanzar error', () => {
  assert.equal(respuestaCoincide('rosa', 'no-es-un-hash'), false);
});
