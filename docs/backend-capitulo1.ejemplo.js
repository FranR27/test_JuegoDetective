/**
 * Referencia del catálogo real del capítulo 1.
 *
 * La fuente de la verdad es backend/src/data/capitulo1.js, ya integrado en
 * esta rama. Este archivo se mantiene para documentar el contrato; no hace
 * falta copiarlo a ningún lado.
 *
 * Los ids son exactamente los del frontend, así que no se traduce nada
 * (VITE_API_IDS=frontend).
 *
 * Las soluciones no están en texto plano: solo su hash SHA-256, calculado con
 * la normalización de backend/src/utils/respuesta.js.
 *
 * Respuestas canónicas (solo para QA del equipo, no van al frontend):
 *   p1_despedida -> p1_hermano|p1_vpn
 *   p2_auditoria -> 08472026
 *   p3_renuncia  -> p3_audit_trail|p3_rosario
 */
const CAPITULO_1 = {
  id: 1,
  titulo: 'La persona que desapareció',

  // desbloqueadaPor: id del acertijo que hay que resolver antes, o null si está disponible desde el inicio.
  evidencias: [
    {
      id: 'ev_credencial',
      titulo: 'Credencial de Alex (legajo 0847)',
      desbloqueadaPor: null,
    },
    {
      id: 'ev_correo_despedida',
      titulo: 'Correo de despedida',
      desbloqueadaPor: null,
    },
    {
      id: 'ev_legajo',
      titulo: 'Legajo de personal',
      desbloqueadaPor: null,
    },
    {
      id: 'ev_acta_rosario',
      titulo: 'Acta de la reunión en Rosario',
      desbloqueadaPor: null,
    },
    {
      id: 'ev_registro_accesos',
      titulo: 'Registro de accesos del 13 y 14/03',
      desbloqueadaPor: null,
    },
    {
      id: 'ev_camara_off',
      titulo: 'Cámara 3 fuera de servicio',
      desbloqueadaPor: null,
    },
    {
      id: 'ev_chat_valeria',
      titulo: 'Conversación con Valeria',
      desbloqueadaPor: null,
    },
    {
      id: 'ev_chat_tomas',
      titulo: 'Conversación con Tomás',
      desbloqueadaPor: null,
    },
    {
      id: 'ev_chat_laura',
      titulo: 'Conversación con Laura',
      desbloqueadaPor: null,
    },
    {
      id: 'ev_metadatos',
      titulo: 'Metadatos del correo de despedida',
      desbloqueadaPor: 'p1_despedida',
    },
    {
      id: 'ev_declaracion_marta',
      titulo: 'Declaración de Marta Morgan',
      desbloqueadaPor: 'p1_despedida',
    },
    {
      id: 'ev_nota_caja',
      titulo: 'Nota de la caja 404',
      desbloqueadaPor: 'p1_despedida',
    },
    {
      id: 'ev_nota_auditoria',
      titulo: 'Nota preliminar de auditoría',
      desbloqueadaPor: 'p2_auditoria',
    },
    {
      id: 'ev_movimientos_faro',
      titulo: 'Mayor analítico — pagos a Faro',
      desbloqueadaPor: 'p2_auditoria',
    },
    {
      id: 'ev_correo_interno',
      titulo: 'Correo interno de Laura a Finanzas',
      desbloqueadaPor: 'p2_auditoria',
    },
    {
      id: 'ev_acta_12_03',
      titulo: 'Acta de la reunión del 12/03',
      desbloqueadaPor: 'p2_auditoria',
    },
    {
      id: 'ev_audit_trail',
      titulo: 'Audit trail de la renuncia',
      desbloqueadaPor: 'p3_renuncia',
    },
    {
      id: 'ev_renuncia_falsa',
      titulo: 'Renuncia fabricada',
      desbloqueadaPor: 'p3_renuncia',
    },
    {
      id: 'ev_mensaje_alex',
      titulo: 'Mensaje programado de Alex',
      desbloqueadaPor: 'p3_renuncia',
    },
  ],

  // desbloquea: evidencias que se agregan a la partida al resolver el acertijo.
  acertijos: [
    {
      id: 'p1_despedida',
      titulo: 'La despedida que no cierra',
      hashRespuesta: '879d1a83472b99ebcba505f387b2ed8973a647efea180565e9e2e0bc6adb591f',
      distingueMayusculas: false,
      desbloquea: [
        'ev_metadatos',
        'ev_declaracion_marta',
        'ev_nota_caja',
      ],
    },
    {
      id: 'p2_auditoria',
      titulo: 'La carpeta AUDITORIA_2026',
      hashRespuesta: 'e2f489d0059c34576b86132e479c8521f2f18895b57dfbf5dd0156f901c6da17',
      distingueMayusculas: false,
      desbloquea: [
        'ev_nota_auditoria',
        'ev_movimientos_faro',
        'ev_correo_interno',
        'ev_acta_12_03',
      ],
    },
    {
      id: 'p3_renuncia',
      titulo: 'El historial de renuncia',
      hashRespuesta: 'fcb65099d57bb66fb0b9599c3a3b15a8f9d14ef6307fd90a07eb9e18ee7742d8',
      distingueMayusculas: false,
      desbloquea: [
        'ev_audit_trail',
        'ev_renuncia_falsa',
        'ev_mensaje_alex',
      ],
    },
  ],
};

// Capítulos disponibles, indexados por número.
const CAPITULOS = { 1: CAPITULO_1 };

module.exports = { CAPITULO_1, CAPITULOS };
