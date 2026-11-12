/**
 * Conversaciones del teléfono de Alex.
 * `authorId` compara con `selfId` en <MessagesApp /> para alinear los mensajes.
 */

export const conversaciones = [
  {
    id: 'chat_valeria',
    contactId: 'valeria',
    contactName: 'Valeria Ruiz',
    contactRole: 'Compliance · amiga',
    platform: 'Mensajes',
    lastMessageAt: '2026-03-12T23:19:00-03:00',
    unread: 0,
    messages: [
      {
        id: 'cv_01',
        authorId: 'valeria',
        at: '2026-03-12T23:02:00-03:00',
        text: '¿Estás bien? Me asustaste en la reunión de hoy.',
      },
      {
        id: 'cv_02',
        authorId: 'alex',
        at: '2026-03-12T23:03:00-03:00',
        text: 'Encontré una renuncia en mi legajo. Firmada con mi nombre. Yo nunca la firmé.',
      },
      {
        id: 'cv_03',
        authorId: 'valeria',
        at: '2026-03-12T23:05:00-03:00',
        text: '¿Laura?',
      },
      {
        id: 'cv_04',
        authorId: 'alex',
        at: '2026-03-12T23:06:00-03:00',
        text: 'Tiene que ser ella. Firmó las aprobaciones de Faro. Y hoy me dijo que no firme el cierre.',
      },
      {
        id: 'cv_05',
        authorId: 'valeria',
        at: '2026-03-12T23:08:00-03:00',
        text: '¿Vas a ir a RRHH?',
      },
      {
        id: 'cv_06',
        authorId: 'alex',
        at: '2026-03-12T23:11:00-03:00',
        text: 'Mañana. Si no te contesto para el mediodía, revisá mi correo. Dejé algo preparado.',
      },
      {
        id: 'cv_07',
        authorId: 'alex',
        at: '2026-03-12T23:12:00-03:00',
        text: 'Y guardá esta conversación. No la borres.',
        kind: 'file',
        fileName: 'captura_renuncia.pdf',
        caption: 'Captura del formulario REN-2026-0847',
      },
      {
        id: 'cv_08',
        authorId: 'valeria',
        at: '2026-03-12T23:19:00-03:00',
        text: 'No me gusta nada esto. Contestame.',
      },
    ],
  },
  {
    id: 'chat_tomas',
    contactId: 'tomas',
    contactName: 'Tomás Ferrer',
    contactRole: 'Soporte técnico · IT',
    platform: 'Mensajes',
    lastMessageAt: '2026-03-13T18:52:00-03:00',
    unread: 0,
    messages: [
      {
        id: 'ct_01',
        authorId: 'alex',
        at: '2026-03-13T18:40:00-03:00',
        text: '¿Podés ver quién usó mi usuario hoy a la tarde?',
      },
      {
        id: 'ct_02',
        authorId: 'tomas',
        at: '2026-03-13T18:43:00-03:00',
        text: 'El log dice sesión desde la terminal de RRHH, piso 3. 16:12.',
      },
      {
        id: 'ct_03',
        authorId: 'alex',
        at: '2026-03-13T18:44:00-03:00',
        text: 'Yo estaba en el piso 4. No bajé en toda la tarde.',
      },
      {
        id: 'ct_04',
        authorId: 'tomas',
        at: '2026-03-13T18:46:00-03:00',
        text: '¿Querés que lo reporte?',
      },
      {
        id: 'ct_05',
        authorId: 'alex',
        at: '2026-03-13T18:48:00-03:00',
        text: 'No. Guardá el registro y no se lo des a nadie. Ni a Laura.',
      },
      {
        id: 'ct_06',
        authorId: 'tomas',
        at: '2026-03-13T18:52:00-03:00',
        text: 'Listo. Si no aparecés, esto va a estar acá.',
      },
    ],
  },
  {
    id: 'chat_laura',
    contactId: 'laura',
    contactName: 'Laura Ortega',
    contactRole: 'Recursos Humanos',
    platform: 'Mensajes',
    lastMessageAt: '2026-03-13T18:10:00-03:00',
    unread: 0,
    messages: [
      {
        id: 'cl_01',
        authorId: 'laura',
        at: '2026-03-13T17:55:00-03:00',
        text: 'Alex, necesito que firmes el cierre hoy.',
      },
      {
        id: 'cl_02',
        authorId: 'alex',
        at: '2026-03-13T17:57:00-03:00',
        text: 'No voy a firmar un informe que oculta tres pagos.',
      },
      {
        id: 'cl_03',
        authorId: 'laura',
        at: '2026-03-13T17:59:00-03:00',
        text: 'Podemos arreglarlo. No tiene que ser tan difícil.',
      },
      {
        id: 'cl_04',
        authorId: 'alex',
        at: '2026-03-13T18:01:00-03:00',
        text: 'La renuncia que pusiste en mi legajo tampoco fue difícil, ¿no?',
      },
      {
        id: 'cl_05',
        authorId: 'laura',
        at: '2026-03-13T18:04:00-03:00',
        text: 'Pensalo. Si no firmás, esto va a ser peor para vos.',
      },
      {
        id: 'cl_06',
        authorId: 'alex',
        at: '2026-03-13T18:06:00-03:00',
        text: '¿Eso es una amenaza?',
      },
      {
        id: 'cl_07',
        authorId: 'laura',
        at: '2026-03-13T18:10:00-03:00',
        text: 'Es un consejo.',
      },
    ],
  },
];

export const conversacionesPorId = Object.fromEntries(
  conversaciones.map((c) => [c.id, c])
);

export function getConversacion(id) {
  return conversacionesPorId[id] ?? null;
}
