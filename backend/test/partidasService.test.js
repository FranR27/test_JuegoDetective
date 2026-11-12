const test = require('node:test');
const assert = require('node:assert/strict');
const { crearPartidasService } = require('../src/services/partidasService');
const { crearRepoMemoria } = require('../src/db/partidasRepo.memory');
const { CAPITULOS } = require('../src/data/capitulo1');
const { HttpError } = require('../src/utils/errores');

function crearServicio() {
  return crearPartidasService({ repo: crearRepoMemoria(), capitulos: CAPITULOS });
}

async function rechazaCon(promesa, estado, codigo) {
  await assert.rejects(promesa, (error) => {
    assert.ok(error instanceof HttpError, 'debería ser un HttpError');
    assert.equal(error.estado, estado);
    assert.equal(error.codigo, codigo);
    return true;
  });
}

test('crearPartida usa el capítulo 1 por defecto y arranca vacía', async () => {
  const service = crearServicio();
  const partida = await service.crearPartida();
  assert.ok(partida.id);
  assert.equal(partida.capitulo, 1);
  assert.deepEqual(partida.evidenciasEncontradas, []);
  assert.deepEqual(partida.acertijosResueltos, []);
  assert.equal(partida.creadaEn, partida.ultimaActualizacion);
});

test('crearPartida rechaza capítulos que no existen o no son enteros', async () => {
  const service = crearServicio();
  await rechazaCon(service.crearPartida({ capitulo: 99 }), 400, 'capitulo_invalido');
  await rechazaCon(service.crearPartida({ capitulo: '1' }), 400, 'capitulo_invalido');
});

test('obtenerPartida valida el formato del id y distingue partidas inexistentes', async () => {
  const service = crearServicio();
  await rechazaCon(service.obtenerPartida('a/b'), 400, 'id_invalido');
  await rechazaCon(service.obtenerPartida('no-existe'), 404, 'partida_no_encontrada');
  const { id } = await service.crearPartida();
  assert.equal((await service.obtenerPartida(id)).id, id);
});

test('una respuesta incorrecta no cambia la partida ni revela nada', async () => {
  const service = crearServicio();
  const { id } = await service.crearPartida();
  const resultado = await service.validarAcertijo(id, 'mensaje-despedida', { respuesta: 'cualquier cosa' });
  assert.equal(resultado.correcto, false);
  assert.deepEqual(resultado.evidenciasDesbloqueadas, []);
  assert.deepEqual((await service.obtenerPartida(id)).acertijosResueltos, []);
});

test('una respuesta correcta resuelve el acertijo y agrega la evidencia que desbloquea', async () => {
  const service = crearServicio();
  const { id } = await service.crearPartida();
  const resultado = await service.validarAcertijo(id, 'mensaje-despedida', { respuesta: ' Demo-Despedida ' });
  assert.equal(resultado.correcto, true);
  assert.equal(resultado.yaResuelto, false);
  assert.deepEqual(resultado.evidenciasDesbloqueadas, ['ev-contradiccion-mensaje']);
  assert.deepEqual(resultado.partida.acertijosResueltos, ['mensaje-despedida']);
  assert.deepEqual(resultado.partida.evidenciasEncontradas, ['ev-contradiccion-mensaje']);
});

test('resolver dos veces el mismo acertijo es idempotente', async () => {
  const service = crearServicio();
  const { id } = await service.crearPartida();
  await service.validarAcertijo(id, 'historial-renuncia', { respuesta: 'demo-historial' });
  const segunda = await service.validarAcertijo(id, 'historial-renuncia', { respuesta: 'demo-historial' });
  assert.equal(segunda.correcto, true);
  assert.equal(segunda.yaResuelto, true);
  assert.deepEqual(segunda.partida.acertijosResueltos, ['historial-renuncia']);
  assert.deepEqual(segunda.partida.evidenciasEncontradas, ['ev-historial-comparado']);
});

test('la contraseña de AUDITORIA_2026 distingue mayúsculas', async () => {
  const service = crearServicio();
  const { id } = await service.crearPartida();
  const mal = await service.validarAcertijo(id, 'auditoria-2026', { respuesta: 'demo-clave-2026' });
  assert.equal(mal.correcto, false);
  const bien = await service.validarAcertijo(id, 'auditoria-2026', { respuesta: 'Demo-Clave-2026' });
  assert.equal(bien.correcto, true);
});

test('validarAcertijo rechaza respuestas vacías, largas o que no son texto', async () => {
  const service = crearServicio();
  const { id } = await service.crearPartida();
  await rechazaCon(service.validarAcertijo(id, 'mensaje-despedida', {}), 400, 'respuesta_invalida');
  await rechazaCon(service.validarAcertijo(id, 'mensaje-despedida', { respuesta: '   ' }), 400, 'respuesta_invalida');
  await rechazaCon(service.validarAcertijo(id, 'mensaje-despedida', { respuesta: 42 }), 400, 'respuesta_invalida');
  await rechazaCon(service.validarAcertijo(id, 'mensaje-despedida', { respuesta: 'x'.repeat(201) }), 400, 'respuesta_invalida');
});

test('validarAcertijo distingue acertijo y partida inexistentes', async () => {
  const service = crearServicio();
  const { id } = await service.crearPartida();
  await rechazaCon(service.validarAcertijo(id, 'inventado', { respuesta: 'x' }), 404, 'acertijo_no_encontrado');
  await rechazaCon(service.validarAcertijo('no-existe', 'mensaje-despedida', { respuesta: 'x' }), 404, 'partida_no_encontrada');
});

test('una evidencia libre se puede registrar y repetirla no la duplica', async () => {
  const service = crearServicio();
  const { id } = await service.crearPartida();
  await service.registrarEvidencia(id, { evidenciaId: 'ev-ultima-conexion' });
  const partida = await service.registrarEvidencia(id, { evidenciaId: 'ev-ultima-conexion' });
  assert.deepEqual(partida.evidenciasEncontradas, ['ev-ultima-conexion']);
});

test('una evidencia bloqueada exige resolver antes su acertijo', async () => {
  const service = crearServicio();
  const { id } = await service.crearPartida();
  await rechazaCon(service.registrarEvidencia(id, { evidenciaId: 'ev-documentos-auditoria' }), 403, 'evidencia_bloqueada');
  await service.validarAcertijo(id, 'auditoria-2026', { respuesta: 'Demo-Clave-2026' });
  const partida = await service.obtenerPartida(id);
  assert.ok(partida.evidenciasEncontradas.includes('ev-documentos-auditoria'));
});

test('registrarEvidencia valida el cuerpo y que la evidencia exista', async () => {
  const service = crearServicio();
  const { id } = await service.crearPartida();
  await rechazaCon(service.registrarEvidencia(id, {}), 400, 'evidencia_invalida');
  await rechazaCon(service.registrarEvidencia(id, { evidenciaId: 'ev-inventada' }), 404, 'evidencia_no_encontrada');
});

test('ultimaActualizacion cambia al guardar progreso', async () => {
  let reloj = 0;
  const service = crearPartidasService({
    repo: crearRepoMemoria(),
    capitulos: CAPITULOS,
    ahora: () => `2026-01-01T00:00:0${reloj++}.000Z`,
  });
  const inicial = await service.crearPartida();
  const despues = await service.registrarEvidencia(inicial.id, { evidenciaId: 'ev-ultima-conexion' });
  assert.equal(despues.creadaEn, inicial.creadaEn);
  assert.notEqual(despues.ultimaActualizacion, inicial.ultimaActualizacion);
});
