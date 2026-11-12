const express = require('express');
const cors = require('cors');
const { crearPartidasService } = require('./services/partidasService');
const { crearRouterApi } = require('./routes/api');
const { HttpError } = require('./utils/errores');
const { CAPITULOS } = require('./data/capitulo1');

/**
 * Arma la aplicación Express. Recibe el repositorio y la config para poder usar uno en memoria
 * en los tests. En Express 5 los errores de funciones async llegan solos al manejador de errores.
 */
function crearApp({ repo, config, capitulos = CAPITULOS }) {
  const app = express();
  const service = crearPartidasService({ repo, capitulos });

  app.disable('x-powered-by');
  app.use(cors({ origin: config.origenesCors }));
  app.use(express.json({ limit: '10kb' }));

  app.use('/api', crearRouterApi({ service, config }));

  app.use((req, res) => {
    res.status(404).json({ error: { codigo: 'ruta_no_encontrada', mensaje: `No existe ${req.method} ${req.path}` } });
  });

  // Manejador de errores: HttpError -> su estado; errores del parser (JSON roto, cuerpo muy grande)
  // -> 4xx; cualquier otro -> 500 sin filtrar detalles internos.
  // eslint-disable-next-line no-unused-vars
  app.use((error, req, res, next) => {
    if (error instanceof HttpError) {
      return res.status(error.estado).json({ error: { codigo: error.codigo, mensaje: error.message } });
    }
    if (Number.isInteger(error.status) && error.status >= 400 && error.status < 500) {
      return res.status(error.status).json({
        error: { codigo: 'solicitud_invalida', mensaje: 'El cuerpo de la solicitud no es válido.' },
      });
    }
    console.error('[error]', error);
    res.status(500).json({ error: { codigo: 'error_interno', mensaje: 'Ocurrió un error en el servidor.' } });
  });

  return app;
}

module.exports = { crearApp };
