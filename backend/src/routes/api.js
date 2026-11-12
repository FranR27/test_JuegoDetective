const { Router } = require('express');

/** Rutas bajo /api. Solo traducen HTTP <-> servicio; la lógica está en partidasService. */
function crearRouterApi({ service, config }) {
  const router = Router();

  // Comprobación rápida de que el servidor está vivo (también sirve para "despertar" Render).
  router.get('/health', (req, res) => {
    res.json({
      estado: 'ok',
      servicio: 'caso404-backend',
      almacenamiento: config.almacenamiento,
      hora: new Date().toISOString(),
    });
  });

  // Crear partida. Cuerpo opcional: { "capitulo": 1 }
  router.post('/partidas', async (req, res) => {
    const partida = await service.crearPartida(req.body ?? {});
    res.status(201).location(`/api/partidas/${partida.id}`).json(partida);
  });

  // Consultar partida
  router.get('/partidas/:id', async (req, res) => {
    res.json(await service.obtenerPartida(req.params.id));
  });

  // Registrar una evidencia encontrada. Cuerpo: { "evidenciaId": "ev-..." }
  router.post('/partidas/:id/evidencias', async (req, res) => {
    res.json(await service.registrarEvidencia(req.params.id, req.body ?? {}));
  });

  // Validar la respuesta de un acertijo. Cuerpo: { "respuesta": "..." }
  router.post('/partidas/:id/acertijos/:acertijoId/validar', async (req, res) => {
    res.json(await service.validarAcertijo(req.params.id, req.params.acertijoId, req.body ?? {}));
  });

  return router;
}

module.exports = { crearRouterApi };
