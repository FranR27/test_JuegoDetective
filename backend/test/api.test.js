const test = require('node:test');
const assert = require('node:assert/strict');

// Estos tests levantan el servidor real y necesitan las dependencias instaladas (npm install).
// Si Express no está instalado se omiten en lugar de fallar.
let express = true;
try {
  require.resolve('express');
} catch {
  express = false;
}

test('API HTTP', { skip: !express && 'Express no está instalado (ejecutar npm install)' }, async (t) => {
  const { crearApp } = require('../src/app');
  const { crearRepoMemoria } = require('../src/db/partidasRepo.memory');

  const config = { almacenamiento: 'memory', origenesCors: ['http://localhost:5173'] };
  const app = crearApp({ repo: crearRepoMemoria(), config });

  const servidor = await new Promise((resolve) => {
    const instancia = app.listen(0, '127.0.0.1', () => resolve(instancia));
  });
  t.after(() => servidor.close());
  const base = `http://127.0.0.1:${servidor.address().port}`;

  const pedir = (ruta, { metodo = 'GET', cuerpo, crudo } = {}) =>
    fetch(`${base}${ruta}`, {
      method: metodo,
      headers: cuerpo !== undefined || crudo !== undefined ? { 'Content-Type': 'application/json' } : {},
      body: crudo ?? (cuerpo !== undefined ? JSON.stringify(cuerpo) : undefined),
    });

  await t.test('GET /api/health responde ok', async () => {
    const respuesta = await pedir('/api/health');
    assert.equal(respuesta.status, 200);
    const datos = await respuesta.json();
    assert.equal(datos.estado, 'ok');
    assert.equal(datos.almacenamiento, 'memory');
  });

  let partidaId;

  await t.test('POST /api/partidas crea una partida (201 + Location)', async () => {
    const respuesta = await pedir('/api/partidas', { metodo: 'POST', cuerpo: {} });
    assert.equal(respuesta.status, 201);
    const partida = await respuesta.json();
    partidaId = partida.id;
    assert.equal(respuesta.headers.get('location'), `/api/partidas/${partidaId}`);
    assert.equal(partida.capitulo, 1);
  });

  await t.test('GET /api/partidas/:id devuelve la partida y 404 si no existe', async () => {
    const existente = await pedir(`/api/partidas/${partidaId}`);
    assert.equal(existente.status, 200);
    const inexistente = await pedir('/api/partidas/no-existe');
    assert.equal(inexistente.status, 404);
    assert.equal((await inexistente.json()).error.codigo, 'partida_no_encontrada');
  });

  await t.test('validar acertijo: incorrecto y luego correcto', async () => {
    const ruta = `/api/partidas/${partidaId}/acertijos/mensaje-despedida/validar`;
    const mal = await (await pedir(ruta, { metodo: 'POST', cuerpo: { respuesta: 'nope' } })).json();
    assert.equal(mal.correcto, false);
    const bien = await (await pedir(ruta, { metodo: 'POST', cuerpo: { respuesta: 'demo-despedida' } })).json();
    assert.equal(bien.correcto, true);
    assert.deepEqual(bien.evidenciasDesbloqueadas, ['ev-contradiccion-mensaje']);
  });

  await t.test('registrar evidencia bloqueada responde 403', async () => {
    const respuesta = await pedir(`/api/partidas/${partidaId}/evidencias`, {
      metodo: 'POST',
      cuerpo: { evidenciaId: 'ev-documentos-auditoria' },
    });
    assert.equal(respuesta.status, 403);
  });

  await t.test('un JSON mal formado responde 400', async () => {
    const respuesta = await pedir('/api/partidas', { metodo: 'POST', crudo: '{roto' });
    assert.equal(respuesta.status, 400);
    assert.equal((await respuesta.json()).error.codigo, 'solicitud_invalida');
  });

  await t.test('una ruta inexistente responde 404 en JSON', async () => {
    const respuesta = await pedir('/api/lo-que-sea');
    assert.equal(respuesta.status, 404);
    assert.equal((await respuesta.json()).error.codigo, 'ruta_no_encontrada');
  });
});
