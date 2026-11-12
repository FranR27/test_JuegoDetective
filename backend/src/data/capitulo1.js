/**
 * Catálogo del capítulo 1: "La persona que desapareció".
 *
 * IMPORTANTE: los ids, títulos y respuestas de este archivo son PROVISORIOS.
 * Hay que acordarlos con el integrante 2 (mecánicas y contenido) y reemplazarlos
 * por los reales. Los ids deben coincidir con los que use el frontend.
 *
 * Las soluciones NO se guardan en texto plano: solo su hash SHA-256 (campo hashRespuesta).
 * Para generar el hash de una respuesta real:
 *
 *     npm run hash -- "respuesta correcta"
 *     npm run hash -- "Clave-Con-Mayusculas" --mayusculas
 *
 * Respuestas de prueba actuales (para probar con el frontend mientras tanto):
 *   mensaje-despedida  ->  demo-despedida
 *   auditoria-2026     ->  Demo-Clave-2026   (distingue mayúsculas)
 *   historial-renuncia ->  demo-historial
 */
const CAPITULO_1 = {
  id: 1,
  titulo: 'La persona que desapareció',

  // desbloqueadaPor: id del acertijo que hay que resolver antes, o null si está disponible desde el inicio.
  evidencias: [
    { id: 'ev-ultima-conexion', titulo: 'Última conexión de Alex', desbloqueadaPor: null },
    { id: 'ev-fotografia-oficina', titulo: 'Fotografía de la oficina', desbloqueadaPor: null },
    { id: 'ev-contradiccion-mensaje', titulo: 'Contradicción en el mensaje de despedida', desbloqueadaPor: 'mensaje-despedida' },
    { id: 'ev-documentos-auditoria', titulo: 'Documentos de AUDITORIA_2026', desbloqueadaPor: 'auditoria-2026' },
    { id: 'ev-historial-comparado', titulo: 'Historial de renuncia comparado', desbloqueadaPor: 'historial-renuncia' },
  ],

  // desbloquea: evidencias que se agregan a la partida al resolver el acertijo.
  acertijos: [
    {
      id: 'mensaje-despedida',
      titulo: 'Contradicción del mensaje de despedida',
      hashRespuesta: '1633d465a4efb69b530db5fac7b39957c9334fbf269a3aa55ca63f5df8318c4c',
      distingueMayusculas: false,
      desbloquea: ['ev-contradiccion-mensaje'],
    },
    {
      id: 'auditoria-2026',
      titulo: 'Contraseña de la carpeta AUDITORIA_2026',
      hashRespuesta: '1d299b44ce0d07ee96702863cea7673f71d0a1427981bff51d7a0cbc4326183a',
      distingueMayusculas: true,
      desbloquea: ['ev-documentos-auditoria'],
    },
    {
      id: 'historial-renuncia',
      titulo: 'Comparación del historial de renuncia',
      hashRespuesta: '177d78a61b910c9f71799231a2c25e46c9b0407df4c7d8bfa8399e71568f8559',
      distingueMayusculas: false,
      desbloquea: ['ev-historial-comparado'],
    },
  ],
};

// Capítulos disponibles, indexados por número.
const CAPITULOS = { 1: CAPITULO_1 };

module.exports = { CAPITULO_1, CAPITULOS };
