/**
 * Bandeja de Alex Morgan (acceso autorizado por Marta Morgan).
 * 5 correos recibidos + 1 enviado, según la consigna del Integrante 2.
 */

const PERSONAS = {
  alex: { name: 'Alex Morgan', email: 'a.morgan@borealsystems.com' },
  laura: { name: 'Laura Ortega', email: 'laura.ortega@borealsystems.com' },
  valeria: { name: 'Valeria Ruiz', email: 'valeria.ruiz@borealsystems.com' },
  tomas: { name: 'Tomás Ferrer', email: 'tomas.ferrer@borealsystems.com' },
  diego: { name: 'Diego Sosa', email: 'diego.sosa@borealsystems.com' },
  marta: { name: 'Marta Morgan', email: 'marta.morgan@correo.com' },
  rrhh: { name: 'RRHH Boreal', email: 'rrhh@borealsystems.com' },
};

export const correos = [
  {
    id: 'mail_001',
    box: 'inbox',
    from: PERSONAS.laura,
    to: [PERSONAS.alex],
    subject: 'Auditoría 2026: acceso y plazos',
    preview: 'La carpeta AUDITORIA_2026 estará habilitada desde el lunes…',
    date: '2026-03-09T10:12:00-03:00',
    body: [
      'Alex:',
      'La carpeta AUDITORIA_2026 estará habilitada desde el lunes. Recordá que la clave sigue el formato de la política interna (legajo-año) y que el acceso queda registrado.',
      'El informe preliminar vence el 31/03 y el cierre lo firma la dirección. Cualquier duda, pasá por mi oficina.',
      '— Laura Ortega, Recursos Humanos',
    ],
    attachments: [
      { name: 'DIR-2026-02_politica_acceso.pdf', kind: 'pdf', ref: 'doc_politica' },
    ],
    tags: ['auditoría', 'clave', 'plazos'],
    relatedEvidenceIds: [],
  },
  {
    id: 'mail_003',
    box: 'inbox',
    from: PERSONAS.tomas,
    to: [PERSONAS.alex],
    subject: 'Backup y log de tu usuario',
    preview: 'En el log hay una sesión tuya el sábado a las 02:17 desde HR-02…',
    date: '2026-03-14T09:40:00-03:00',
    body: [
      'Alex:',
      'Dejaste la notebook en el piso 4. Hice el backup como pediste. Revisé el log y hay una sesión de tu usuario el sábado a las 02:17 desde la terminal HR-02, en RRHH.',
      'Vos te fuiste a las 19:42 del viernes y no volviste a entrar. No toqué nada y guardé el registro en el ticket INC-4471.',
      'Si no aparecés, esto va a estar acá. — Tomás',
    ],
    attachments: [
      { name: 'INC-4471_log_sesion.txt', kind: 'txt', ref: 'doc_metadatos_despedida' },
    ],
    tags: ['logs', 'sesión', 'RRHH'],
    relatedEvidenceIds: ['ev_metadatos'],
  },
  {
    id: 'mail_004',
    box: 'inbox',
    from: PERSONAS.diego,
    to: [PERSONAS.alex],
    subject: 'Registro del molinete que me pediste',
    preview: 'A las 02:05 alguien usó tu credencial. No eras vos…',
    date: '2026-03-15T23:12:00-03:00',
    body: [
      'Alex:',
      'Como me pediste el viernes, te paso el registro del molinete. Vos saliste a las 19:42 y no volviste a entrar. Pero a las 02:05 del sábado alguien usó tu credencial en el estacionamiento y entró caminando.',
      'Yo estaba en la ronda y vi a una persona de campera oscura. No eras vos. La cámara 3 estuvo caída justo en ese rango. Lo informé a RRHH y me dijeron que no haga ruido.',
      'Te dejo la exportación. — Diego Sosa',
    ],
    attachments: [
      { name: 'registro_molinete_1303.csv', kind: 'csv', ref: 'doc_registro_accesos' },
    ],
    tags: ['accesos', 'credencial', 'cámara 3'],
    relatedEvidenceIds: ['ev_registro_accesos', 'ev_camara_off'],
  },
  {
    id: 'mail_005',
    box: 'inbox',
    from: PERSONAS.marta,
    to: [PERSONAS.alex],
    subject: '¿Saben algo de Alex?',
    preview: 'Recibí un correo tuyo que no parece escrito por vos…',
    date: '2026-03-16T07:58:00-03:00',
    body: [
      'Alex, hijo:',
      'Recibí un correo tuyo el sábado a la madrugada que no parece escrito por vos. Decía que te ibas a lo de tu hermano, pero vos sos hijo único. Siempre lo fuiste.',
      'No me mientas, no me dejes así. Llamé a Valeria y me dijo que tampoco sabe nada. Ya presenté la denuncia.',
      'Si alguien está leyendo esto: por favor, encuentren a mi hijo. — Marta Morgan',
    ],
    attachments: [],
    tags: ['familia', 'hijo único', 'denuncia'],
    relatedEvidenceIds: ['ev_declaracion_marta'],
  },
  {
    id: 'mail_002',
    box: 'inbox',
    from: PERSONAS.valeria,
    to: [PERSONAS.alex],
    subject: '¿Dónde estás?',
    preview: 'Es lunes y no apareciste. Laura dice que renunciaste…',
    date: '2026-03-16T08:02:00-03:00',
    body: [
      'Alex:',
      'Es lunes y no apareciste. No contestás el teléfono desde el viernes. Laura dice que renunciaste y que te fuiste al sur, pero vos no tenés hermano. No tiene sentido.',
      'Me dijiste que si te pasaba algo revisara tu correo. Estoy revisando. Si alguien más está leyendo esto: Alex tenía miedo. No era de irse sin avisar.',
      '— V.',
    ],
    attachments: [],
    tags: ['amiga', 'desaparición', 'testimonio'],
    relatedEvidenceIds: ['ev_chat_valeria'],
  },
  {
    id: 'mail_006',
    box: 'sent',
    from: PERSONAS.alex,
    to: [PERSONAS.valeria, PERSONAS.marta, PERSONAS.rrhh],
    subject: 'Me voy. No me busquen',
    preview: 'Renuncié a Boreal y me voy a la casa de mi hermano en Villa Traful…',
    date: '2026-03-14T02:17:41-03:00',
    body: [
      'Valeria, mamá, equipo de RRHH:',
      'Escribo esto porque necesito cortar. Renuncié a Boreal y me voy unos días a la casa de mi hermano en Villa Traful. No quiero que me busquen.',
      'Dejé la renuncia firmada en RRHH y el cierre de la auditoría en manos de quien corresponda. Perdón por hacerlo así.',
      'Nos vemos en la costa.',
      '— Alex Morgan',
    ],
    attachments: [],
    tags: ['enviado', 'despedida', 'Villa Traful'],
    relatedEvidenceIds: ['ev_correo_despedida'],
  },
];

export const correosPorId = Object.fromEntries(correos.map((c) => [c.id, c]));

export const correosRecibidos = correos.filter((c) => c.box === 'inbox');
export const correosEnviados = correos.filter((c) => c.box === 'sent');

export function getCorreo(id) {
  return correosPorId[id] ?? null;
}
