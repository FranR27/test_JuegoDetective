const { cargarConfig } = require('./config');
const { crearRepositorio } = require('./db');
const { crearApp } = require('./app');

const config = cargarConfig();
const app = crearApp({ repo: crearRepositorio(config), config });

const servidor = app.listen(config.puerto, () => {
  console.log(`[servidor] Caso 404 backend escuchando en el puerto ${config.puerto} (${config.entorno}, almacenamiento: ${config.almacenamiento})`);
});

// Cierre ordenado cuando el hosting detiene el servicio.
for (const senal of ['SIGINT', 'SIGTERM']) {
  process.on(senal, () => {
    servidor.close(() => process.exit(0));
  });
}
