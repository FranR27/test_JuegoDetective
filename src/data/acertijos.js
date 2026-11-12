/**
 * Los 3 acertijos del capítulo 1 y sus reglas de desbloqueo.
 *
 * IMPORTANTE (coordinación con Integrante 3):
 * - `answer` es la verdad canónica. En el prototipo se valida en el cliente para
 *   poder jugar; en producción el backend debe validar y el frontend no debe
 *   recibir la respuesta.
 * - `unlocks` describe exactamente qué evidencia, documento o carpeta se abre.
 * - `requiresSolved` define el orden: p1 -> p2 -> p3.
 */

export const acertijos = [
  {
    id: 'p1_despedida',
    order: 1,
    title: 'La despedida que no cierra',
    subtitle: 'Correo de despedida — 14/03/2026, 02:17',
    type: 'multiple',
    question:
      'El correo de despedida parece escrito por Alex. Marcá los dos datos que demuestran que no lo escribió él.',
    instructions: 'Elegí exactamente 2 opciones. Las demás pueden ser raras, pero no prueban nada.',
    options: [
      {
        id: 'p1_hermano',
        text: 'Dice que se va a la casa de su hermano en Villa Traful.',
      },
      {
        id: 'p1_vpn',
        text: 'Fue enviado a las 02:17 desde la terminal HR-02 del edificio, cuando Alex ya había salido y no volvió a entrar.',
      },
      {
        id: 'p1_renuncia',
        text: 'Afirma que dejó su renuncia firmada en RRHH.',
      },
      {
        id: 'p1_auditoria',
        text: 'Dice que deja el cierre de la auditoría en manos de otra persona.',
      },
      {
        id: 'p1_costa',
        text: 'Se despide con la frase «nos vemos en la costa».',
      },
      {
        id: 'p1_silencio',
        text: 'Pide que no lo busquen.',
      },
    ],
    answer: ['p1_hermano', 'p1_vpn'],
    requiresSolved: [],
    unlocks: {
      evidenceIds: ['ev_metadatos', 'ev_declaracion_marta', 'ev_nota_caja'],
      documentIds: ['doc_metadatos_despedida', 'doc_nota_caja'],
      folderIds: [],
      chapterComplete: false,
    },
    hints: [
      'El correo dice que Alex se va a lo de su hermano. Buscá la composición familiar en el legajo de RRHH.',
      'El correo salió a las 02:17. Compará esa hora con la última salida registrada y con el origen de la sesión.',
      'La terminal HR-02 está en el piso de RRHH. Alex no volvió a entrar al edificio después de las 19:42, y el ingreso manual de las 02:05 no tiene imagen.',
    ],
    rewardSummary: [
      'Se abre el análisis forense del correo en Seguridad.',
      'Se suma la declaración de Marta Morgan a Evidencias.',
      'Se habilita la nota manuscrita de la caja 404.',
    ],
  },
  {
    id: 'p2_auditoria',
    order: 2,
    title: 'La carpeta AUDITORIA_2026',
    subtitle: 'Carpeta cifrada — piso 4',
    type: 'password',
    question: 'La carpeta AUDITORIA_2026 pide una clave. El formato está en la política interna.',
    instructions:
      'La clave combina el legajo del auditor responsable y el año fiscal. Se admiten guion, espacio o sin separador.',
    answer: '0847-2026',
    password: {
      placeholder: 'Ej.: 0000-0000',
      maxLength: 24,
      help: 'El legajo aparece en la credencial y en el legajo de RRHH. El año está en el nombre de la carpeta.',
    },
    requiresSolved: ['p1_despedida'],
    unlocks: {
      evidenceIds: [
        'ev_nota_auditoria',
        'ev_movimientos_faro',
        'ev_correo_interno',
        'ev_acta_12_03',
      ],
      documentIds: [
        'doc_nota_preliminar',
        'doc_movimientos',
        'doc_correo_laura',
        'doc_acta_12_03',
      ],
      folderIds: ['f_auditoria'],
      chapterComplete: false,
    },
    hints: [
      'La política DIR-2026-02 explica cómo se arma la clave. Está en la carpeta de RRHH.',
      'Necesitás dos datos: el legajo del auditor responsable y el año fiscal. El legajo de Alex aparece en la credencial y en el legajo.',
      'Uní 0847 y 2026 con un guion. La carpeta se llama, literalmente, AUDITORIA_2026.',
    ],
    rewardSummary: [
      'Se desbloquea la carpeta AUDITORIA_2026.',
      'Se abren la nota preliminar, el mayor analítico, el correo interno de Laura y el acta del 12/03.',
      'Se suman cuatro evidencias nuevas.',
    ],
  },
  {
    id: 'p3_renuncia',
    order: 3,
    title: 'El historial de renuncia',
    subtitle: 'Comparación documental — 10/03/2026, 09:12',
    type: 'multiple',
    question:
      'Compará la renuncia con el acta de Rosario y el audit trail. Marcá las dos pruebas que demuestran que Alex no firmó su renuncia.',
    instructions: 'Elegí exactamente 2 opciones. Las demás son datos reales, pero no prueban la falsificación.',
    options: [
      {
        id: 'p3_rosario',
        text: 'A las 09:12 del 10/03, Alex estaba en una reunión presencial en Rosario, a 300 km de la oficina.',
      },
      {
        id: 'p3_audit_trail',
        text: 'El formulario lo cargó l.ortega desde el escáner HR-SCAN-02 y no existe ninguna sesión de a.morgan.',
      },
      {
        id: 'p3_motivo',
        text: 'El motivo declarado es «motivos personales».',
      },
      {
        id: 'p3_firma',
        text: 'La firma del formulario está escaneada.',
      },
      {
        id: 'p3_vigencia',
        text: 'La fecha de vigencia de la renuncia es el 20/03/2026.',
      },
      {
        id: 'p3_formato',
        text: 'El documento está guardado en formato PDF.',
      },
    ],
    answer: ['p3_rosario', 'p3_audit_trail'],
    requiresSolved: ['p2_auditoria'],
    unlocks: {
      evidenceIds: ['ev_audit_trail', 'ev_renuncia_falsa', 'ev_mensaje_alex'],
      documentIds: ['doc_conclusion'],
      folderIds: [],
      chapterComplete: true,
    },
    comparison: {
      left: {
        title: 'Renuncia REN-2026-0847',
        subtitle: 'Sistema de RRHH',
        items: [
          'Registrada el 10/03/2026 a las 09:12.',
          'Cargada por l.ortega (Laura Ortega).',
          'Formulario escaneado desde HR-SCAN-02.',
          'Firma escaneada, sin validación biométrica.',
          'Sin sesión de a.morgan en el sistema.',
        ],
      },
      right: {
        title: 'Acta del 10/03 + accesos',
        subtitle: 'Logística del Sur — Rosario',
        items: [
          '09:00 a 10:30: Alex en la planta del cliente.',
          '08:47: ingreso con credencial de visitante V-2291.',
          '10:34: firma digital del acta.',
          'Alex no registra accesos en CABA esa mañana.',
          'El acta la firma Iván Petrov; Alex figura como expositor.',
        ],
      },
    },
    hints: [
      'Compará la hora del registro de la renuncia con la agenda y el acta del 10/03.',
      'El acta de Rosario tiene hora de ingreso y participantes. La renuncia se registró a las 09:12, en plena reunión.',
      'El audit trail de RRHH muestra quién subió el formulario. Buscá una sesión de a.morgan: no existe.',
    ],
    rewardSummary: [
      'Se abre el cierre del capítulo 1.',
      'Se suman el audit trail, la renuncia fabricada y el mensaje programado de Alex.',
      'Se completa el capítulo y se habilita el gancho del capítulo 2.',
    ],
  },
];

export const acertijosPorId = Object.fromEntries(acertijos.map((a) => [a.id, a]));

export function getAcertijo(id) {
  return acertijosPorId[id] ?? null;
}

/** Respuesta canónica legible para el modo QA del harness. */
export function respuestaLegible(acertijo) {
  if (!acertijo) return '';
  if (acertijo.type === 'password') return acertijo.answer;
  return acertijo.answer
    .map((id) => acertijo.options.find((o) => o.id === id)?.text ?? id)
    .join(' | ');
}
