import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { acertijosPorId } from '../src/data/index.js';
import {
  ApiError,
  CLAVE_PARTIDA,
  CONTRATO_COMPATIBILIDAD,
  CONTRATO_FRONTEND,
  HASHES_BACKEND,
  crearClienteApi,
  estadoDesdePartida,
  guardarPartidaId,
  leerPartidaId,
  borrarPartidaId,
  respuestaParaBackend,
} from '../src/services/apiCapitulo1.js';

function normalizarComoBackend(texto) {
  return String(texto)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function hashComoBackend(texto) {
  return crypto
    .createHash('sha256')
    .update(normalizarComoBackend(texto), 'utf8')
    .digest('hex');
}

function respuestaFalsa(datos, { ok = true, status = 200 } = {}) {
  return {
    ok,
    status,
    async json() {
      return datos;
    },
  };
}

function crearFetchFalso(handler) {
  const llamadas = [];
  const fetchFalso = async (url, opciones = {}) => {
    const llamada = {
      url,
      metodo: opciones.method ?? 'GET',
      cuerpo: opciones.body ? JSON.parse(opciones.body) : undefined,
      headers: opciones.headers,
    };
    llamadas.push(llamada);
    return handler(llamada);
  };
  return { fetchFalso, llamadas };
}

test('las respuestas se serializan en el formato que valida el backend', () => {
  assert.equal(respuestaParaBackend(acertijosPorId.p1_despedida, ['p1_vpn', 'p1_hermano']), 'p1_hermano|p1_vpn');
  assert.equal(
    respuestaParaBackend(acertijosPorId.p1_despedida, ['p1_hermano', 'p1_hermano', 'p1_vpn']),
    'p1_hermano|p1_vpn'
  );
  assert.equal(respuestaParaBackend(acertijosPorId.p2_auditoria, ' 0847 2026 '), '08472026');
  assert.equal(respuestaParaBackend(acertijosPorId.p2_auditoria, '0847-2026'), '08472026');
  assert.equal(
    respuestaParaBackend(acertijosPorId.p3_renuncia, ['p3_rosario', 'p3_audit_trail']),
    'p3_audit_trail|p3_rosario'
  );
  assert.equal(respuestaParaBackend(null, 'x'), '');
});

test('los hashes documentados coinciden con las respuestas canónicas', () => {
  const casos = [
    ['p1_despedida', ['p1_hermano', 'p1_vpn']],
    ['p2_auditoria', '0847-2026'],
    ['p3_renuncia', ['p3_rosario', 'p3_audit_trail']],
  ];

  for (const [puzzleId, answer] of casos) {
    const puzzle = acertijosPorId[puzzleId];
    const canonica = respuestaParaBackend(puzzle, answer);
    assert.equal(hashComoBackend(canonica), HASHES_BACKEND[puzzleId].hashRespuesta, puzzleId);
    assert.equal(HASHES_BACKEND[puzzleId].distingueMayusculas, false);
  }
});

test('los contratos de ids permiten traducir en los dos sentidos', () => {
  for (const puzzleId of ['p1_despedida', 'p2_auditoria', 'p3_renuncia']) {
    assert.equal(CONTRATO_FRONTEND.acertijos[puzzleId], puzzleId);
  }
  assert.equal(CONTRATO_COMPATIBILIDAD.acertijos.p1_despedida, 'mensaje-despedida');
  assert.equal(CONTRATO_COMPATIBILIDAD.acertijos.p2_auditoria, 'auditoria-2026');
  assert.equal(CONTRATO_COMPATIBILIDAD.acertijos.p3_renuncia, 'historial-renuncia');

  const estado = estadoDesdePartida(
    {
      acertijosResueltos: ['mensaje-despedida', 'historial-renuncia', 'otro'],
      evidenciasEncontradas: ['ev-ultima-conexion'],
    },
    CONTRATO_COMPATIBILIDAD
  );
  assert.deepEqual(estado.solvedPuzzleIds, ['p1_despedida', 'p3_renuncia']);
});

test('crear partida usa POST /partidas y devuelve el id', async () => {
  const { fetchFalso, llamadas } = crearFetchFalso(() =>
    respuestaFalsa({ id: 'partida_1', capitulo: 1, acertijosResueltos: [], evidenciasEncontradas: [] }, { status: 201 })
  );
  const api = crearClienteApi({ baseUrl: 'http://api.test/api/', fetchImpl: fetchFalso });

  const partida = await api.crearPartida();

  assert.equal(partida.id, 'partida_1');
  assert.equal(llamadas.length, 1);
  assert.equal(llamadas[0].url, 'http://api.test/api/partidas');
  assert.equal(llamadas[0].metodo, 'POST');
  assert.deepEqual(llamadas[0].cuerpo, { capitulo: 1 });
  assert.equal(llamadas[0].headers['Content-Type'], 'application/json');
});

test('validar un acertijo traduce el id y la respuesta, y devuelve el estado', async () => {
  const { fetchFalso, llamadas } = crearFetchFalso(() =>
    respuestaFalsa({
      correcto: true,
      yaResuelto: false,
      evidenciasDesbloqueadas: ['ev-contradiccion-mensaje'],
      partida: {
        id: 'partida_1',
        acertijosResueltos: ['mensaje-despedida'],
        evidenciasEncontradas: ['ev-contradiccion-mensaje'],
      },
    })
  );
  const api = crearClienteApi({
    baseUrl: 'http://api.test/api',
    fetchImpl: fetchFalso,
    contrato: CONTRATO_COMPATIBILIDAD,
  });

  const resultado = await api.validarAcertijo(
    'partida_1',
    'p1_despedida',
    acertijosPorId.p1_despedida,
    ['p1_vpn', 'p1_hermano']
  );

  assert.equal(resultado.correcto, true);
  assert.deepEqual(resultado.solvedPuzzleIds, ['p1_despedida']);
  assert.equal(
    llamadas[0].url,
    'http://api.test/api/partidas/partida_1/acertijos/mensaje-despedida/validar'
  );
  assert.deepEqual(llamadas[0].cuerpo, { respuesta: 'p1_hermano|p1_vpn' });
});

test('registrar evidencia traduce el id al catálogo del backend', async () => {
  const { fetchFalso, llamadas } = crearFetchFalso(() =>
    respuestaFalsa({ id: 'partida_1', evidenciasEncontradas: ['ev-ultima-conexion'] })
  );
  const api = crearClienteApi({
    baseUrl: 'http://api.test/api',
    fetchImpl: fetchFalso,
    contrato: CONTRATO_COMPATIBILIDAD,
  });

  await api.registrarEvidencia('partida_1', 'ev_registro_accesos');

  assert.equal(llamadas[0].url, 'http://api.test/api/partidas/partida_1/evidencias');
  assert.deepEqual(llamadas[0].cuerpo, { evidenciaId: 'ev-ultima-conexion' });
});

test('los errores del backend se convierten en ApiError con código', async () => {
  const { fetchFalso } = crearFetchFalso(() =>
    respuestaFalsa(
      { error: { codigo: 'evidencia_bloqueada', mensaje: 'Esa evidencia todavía está bloqueada.' } },
      { ok: false, status: 403 }
    )
  );
  const api = crearClienteApi({ baseUrl: 'http://api.test/api', fetchImpl: fetchFalso });

  await assert.rejects(
    () => api.obtenerPartida('partida_1'),
    (error) => {
      assert.ok(error instanceof ApiError);
      assert.equal(error.estado, 403);
      assert.equal(error.codigo, 'evidencia_bloqueada');
      assert.match(error.message, /bloqueada/);
      return true;
    }
  );
});

test('sin red devuelve un error sin_conexion distinguible', async () => {
  const api = crearClienteApi({
    baseUrl: 'http://api.test/api',
    fetchImpl: async () => {
      throw new Error('ECONNREFUSED');
    },
  });

  await assert.rejects(
    () => api.salud(),
    (error) => {
      assert.ok(error instanceof ApiError);
      assert.equal(error.codigo, 'sin_conexion');
      assert.equal(error.estado, 0);
      return true;
    }
  );
});

test('el id de partida se guarda y se borra sin romper si no hay storage', () => {
  const datos = new Map();
  const storage = {
    getItem: (clave) => datos.get(clave) ?? null,
    setItem: (clave, valor) => datos.set(clave, valor),
    removeItem: (clave) => datos.delete(clave),
  };

  assert.equal(leerPartidaId(storage), null);
  guardarPartidaId('partida_1', storage);
  assert.equal(datos.get(CLAVE_PARTIDA), 'partida_1');
  assert.equal(leerPartidaId(storage), 'partida_1');
  borrarPartidaId(storage);
  assert.equal(leerPartidaId(storage), null);

  assert.equal(leerPartidaId(null), null);
  assert.doesNotThrow(() => guardarPartidaId('x', null));
  assert.doesNotThrow(() => borrarPartidaId(null));
});
