/**
 * Catálogo de evidencias.
 * Las evidencias con `unlockedByPuzzleId: null` están disponibles desde el inicio;
 * el resto se desbloquea al resolver el acertijo indicado.
 *
 * `source` apunta al documento, correo, chat o foto del que sale la evidencia.
 */

export const TIPOS_EVIDENCIA = {
  documento: 'Documento',
  digital: 'Digital',
  testimonio: 'Testimonio',
  fisica: 'Física',
};

export const evidencias = [
  {
    id: 'ev_credencial',
    code: 'EV-01',
    title: 'Credencial de Alex (legajo 0847)',
    type: 'fisica',
    description: 'Credencial plastificada con el legajo 0847, hallada en el escritorio del piso 4.',
    detail:
      'La credencial confirma el número de legajo y el nivel de acceso de Alex. El nivel 2 no habilita el piso 3 de RRHH, donde está la terminal HR-02. La foto es anterior al ingreso a la empresa.',
    source: { type: 'photo', id: 'foto_credencial', label: 'Credencial de Alex Morgan' },
    unlockedByPuzzleId: null,
    optionalClue: 'El legajo que aparece acá es uno de los dos datos que pide la carpeta AUDITORIA_2026.',
    tags: ['identificación', 'legajo'],
  },
  {
    id: 'ev_correo_despedida',
    code: 'EV-02',
    title: 'Correo de despedida',
    type: 'digital',
    description: 'Mensaje enviado el 14/03 a las 02:17 desde la cuenta de Alex.',
    detail:
      'Dice que Alex se va a la casa de su hermano en Villa Traful y que ya dejó la renuncia firmada. Fue enviado a Valeria, a Marta y a RRHH. Es la base de la hipótesis de retiro voluntario.',
    source: { type: 'email', id: 'mail_006', label: 'Cuenta de Alex — correo saliente' },
    unlockedByPuzzleId: null,
    optionalClue: 'Leé el correo completo y compará cada afirmación con el legajo y el registro de accesos.',
    tags: ['correo', 'despedida'],
  },
  {
    id: 'ev_legajo',
    code: 'EV-03',
    title: 'Legajo de personal',
    type: 'documento',
    description: 'Legajo 0847: Alex Morgan es hijo único y su contacto de emergencia es su madre.',
    detail:
      'El legajo no registra hermanos. El único contacto de emergencia es Marta Morgan. La observación de 2024 confirma que Alex redujo los viajes para acompañar el tratamiento de su madre.',
    source: { type: 'document', id: 'doc_legajo', label: 'Legajo de personal 0847' },
    unlockedByPuzzleId: null,
    optionalClue: 'La composición familiar es la clave para una de las frases del correo de despedida.',
    tags: ['RRHH', 'familia'],
  },
  {
    id: 'ev_acta_rosario',
    code: 'EV-04',
    title: 'Acta de la reunión en Rosario',
    type: 'documento',
    description: 'Alex estuvo en la planta del cliente el 10/03 de 08:47 a 10:30.',
    detail:
      'El acta y la credencial de visitante V-2291 ubican a Alex en Rosario a la hora exacta en que RRHH registró su renuncia en Buenos Aires. Es la coartada central del capítulo.',
    source: { type: 'document', id: 'doc_acta_10_03', label: 'Acta del 10/03 — Logística del Sur' },
    unlockedByPuzzleId: null,
    optionalClue: 'Cruzá la hora del acta con la hora del registro de la renuncia.',
    tags: ['coartada', 'Rosario'],
  },
  {
    id: 'ev_registro_accesos',
    code: 'EV-05',
    title: 'Registro de accesos del 13 y 14/03',
    type: 'digital',
    description: 'Alex salió a las 19:42; su credencial volvió a usarse a las 02:05.',
    detail:
      'El molinete principal registra la salida de Alex a las 19:42. A las 02:05 del sábado, la credencial 0847 entra por el estacionamiento con habilitación manual. A las 02:17 hay una sesión VPN en la terminal HR-02.',
    source: { type: 'document', id: 'doc_registro_accesos', label: 'Registro de accesos (CSV)' },
    unlockedByPuzzleId: null,
    optionalClue: 'La ventana de las 02:05 coincide con el corte de la cámara 3.',
    tags: ['accesos', 'timeline'],
  },
  {
    id: 'ev_camara_off',
    code: 'EV-06',
    title: 'Cámara 3 fuera de servicio',
    type: 'digital',
    description: 'La cámara del acceso peatonal estuvo sin señal entre 01:50 y 02:30.',
    detail:
      'El NVR no registró una falla técnica. La cámara volvió a transmitir después del ingreso manual de la credencial 0847. No hay orden de mantenimiento asociada.',
    source: { type: 'document', id: 'doc_incidente_camara', label: 'Informe de incidente SEG-2026-0314' },
    unlockedByPuzzleId: null,
    optionalClue: 'El corte no fue una falla: alguien necesitaba que esa cámara no viera el ingreso.',
    tags: ['CCTV', 'sabotaje'],
  },
  {
    id: 'ev_chat_valeria',
    code: 'EV-07',
    title: 'Conversación con Valeria',
    type: 'testimonio',
    description: 'Alex le cuenta que encontró una renuncia firmada con su nombre.',
    detail:
      'La conversación del jueves 12/03 a las 23:02 muestra que Alex descubrió la renuncia antes de desaparecer y que le pidió a Valeria revisar su correo si no contestaba. También le pide guardar la conversación.',
    source: { type: 'chat', id: 'chat_valeria', label: 'Chat con Valeria Ruiz' },
    unlockedByPuzzleId: null,
    optionalClue: 'Alex ya sabía que la renuncia era falsa antes del viernes.',
    tags: ['testimonio', 'renuncia'],
  },
  {
    id: 'ev_chat_tomas',
    code: 'EV-08',
    title: 'Conversación con Tomás',
    type: 'testimonio',
    description: 'Tomás detecta una sesión de Alex desde la terminal de RRHH.',
    detail:
      'El viernes 13/03 a las 18:43, Tomás confirma que el usuario de Alex inició sesión desde la terminal HR-02, en el piso 3. Alex estaba en el piso 4 y le pide guardar el registro sin avisar a Laura.',
    source: { type: 'chat', id: 'chat_tomas', label: 'Chat con Tomás Ferrer' },
    unlockedByPuzzleId: null,
    optionalClue: 'La terminal HR-02 vuelve a aparecer en los metadatos del correo de despedida.',
    tags: ['testimonio', 'logs'],
  },
  {
    id: 'ev_chat_laura',
    code: 'EV-09',
    title: 'Conversación con Laura',
    type: 'testimonio',
    description: 'Laura amenaza a Alex si no firma el cierre de la auditoría.',
    detail:
      'El viernes 13/03, Laura le pide a Alex que firme el cierre y le dice: «Si no firmás, esto va a ser peor para vos». Alex la enfrenta por la renuncia en su legajo. La conversación ocurre 1 hora 47 minutos antes de su salida del edificio.',
    source: { type: 'chat', id: 'chat_laura', label: 'Chat con Laura Ortega' },
    unlockedByPuzzleId: null,
    optionalClue: 'La amenaza ocurre después de la reunión del 12/03 y antes de la desaparición.',
    tags: ['testimonio', 'amenaza'],
  },
  {
    id: 'ev_metadatos',
    code: 'EV-10',
    title: 'Metadatos del correo de despedida',
    type: 'digital',
    description: 'El correo salió desde la terminal HR-02, en RRHH, a las 02:17.',
    detail:
      'La sesión de Outlook se abrió a las 02:16:58 desde una PC fija del sector de RRHH, con credencial de nivel 3. Alex no registró ingresos al edificio después de las 19:42 del viernes. El envío no fue programado: fue manual.',
    source: { type: 'document', id: 'doc_metadatos_despedida', label: 'Análisis forense del correo' },
    unlockedByPuzzleId: 'p1_despedida',
    optionalClue: 'El correo no salió de la casa de Alex: salió del piso 3 de la empresa.',
    tags: ['forense', 'correo'],
  },
  {
    id: 'ev_declaracion_marta',
    code: 'EV-11',
    title: 'Declaración de Marta Morgan',
    type: 'testimonio',
    description: 'La madre de Alex confirma que es hijo único y que el correo es falso.',
    detail:
      'Marta Morgan reconoció el correo de despedida como apócrifo. Aportó la partida de nacimiento de Alex y confirmó que no tiene hermanos ni medios hermanos. También declaró que Alex la llamó el jueves hablando de «una caja 404».',
    source: { type: 'email', id: 'mail_005', label: 'Correo de Marta Morgan' },
    unlockedByPuzzleId: 'p1_despedida',
    optionalClue: 'La declaración de Marta cierra la contradicción del hermano en Villa Traful.',
    tags: ['testimonio', 'familia'],
  },
  {
    id: 'ev_nota_caja',
    code: 'EV-12',
    title: 'Nota de la caja 404',
    type: 'fisica',
    description: 'Nota manuscrita con el legajo y la instrucción «no firmar».',
    detail:
      'La nota estaba dentro del locker 404, cerrado con candado. La letra coincide con la agenda y la firma del legajo. La carpeta completa de la auditoría no estaba allí: solo una copia parcial de la nota preliminar.',
    source: { type: 'photo', id: 'foto_nota_caja', label: 'Nota encontrada en el locker 404' },
    unlockedByPuzzleId: 'p1_despedida',
    optionalClue: 'La caja 404 es el hilo que queda abierto para el capítulo 2.',
    tags: ['nota', 'caja 404'],
  },
  {
    id: 'ev_nota_auditoria',
    code: 'EV-13',
    title: 'Nota preliminar de auditoría',
    type: 'documento',
    description: 'Alex documenta tres pagos a Faro Consulting por $480.000.',
    detail:
      'La nota identifica las tres facturas, el monto total y la aprobación de Laura Ortega. Alex dejó escrito que no iba a firmar el informe final y que la copia completa estaba en la caja 404.',
    source: { type: 'document', id: 'doc_nota_preliminar', label: 'Nota preliminar Q1 (borrador)' },
    unlockedByPuzzleId: 'p2_auditoria',
    optionalClue: 'El monto total y las tres facturas coinciden con el mayor analítico.',
    tags: ['auditoría', 'Faro Consulting'],
  },
  {
    id: 'ev_movimientos_faro',
    code: 'EV-14',
    title: 'Mayor analítico — pagos a Faro',
    type: 'documento',
    description: 'Tres pagos aprobados por Laura Ortega, sin orden de compra.',
    detail:
      'Las tres filas de Faro suman $480.000. Faro Consulting no está en el registro de proveedores aprobados. La cuenta 4.2.3 fue renombrada para ocultar los pagos.',
    source: { type: 'document', id: 'doc_movimientos', label: 'Mayor analítico Q1 (CSV)' },
    unlockedByPuzzleId: 'p2_auditoria',
    optionalClue: 'Compará las fechas y los importes con la nota preliminar: coinciden exactamente.',
    tags: ['finanzas', 'Faro Consulting'],
  },
  {
    id: 'ev_correo_interno',
    code: 'EV-15',
    title: 'Correo interno de Laura a Finanzas',
    type: 'digital',
    description: 'Laura pide reclasificar Faro y ocultar la cuenta 4.2.3.',
    detail:
      'El correo del 11/03 a las 18:04 instruye a Finanzas para que los pagos a Faro queden como «servicios de consultoría» antes del cierre y que Alex no vea la cuenta 4.2.3. Es la prueba directa del encubrimiento.',
    source: { type: 'document', id: 'doc_correo_laura', label: 'Copia del correo interno' },
    unlockedByPuzzleId: 'p2_auditoria',
    optionalClue: 'El correo es anterior a la desaparición y posterior a la primera factura de Faro.',
    tags: ['correo', 'encubrimiento'],
  },
  {
    id: 'ev_acta_12_03',
    code: 'EV-16',
    title: 'Acta de la reunión del 12/03',
    type: 'documento',
    description: 'Dos testigos registran la negativa de Alex y la amenaza de Laura.',
    detail:
      'El acta transcribe la frase de Laura Ortega: «Si no firmás, esto va a ser peor para vos». Valeria Ruiz y Tomás Ferrer autorizaron la transcripción. Laura se retiró sin firmar.',
    source: { type: 'document', id: 'doc_acta_12_03', label: 'Acta de reunión — auditoría Q1' },
    unlockedByPuzzleId: 'p2_auditoria',
    optionalClue: 'La amenaza ocurre un día antes de la desaparición y dos días antes del correo falso.',
    tags: ['acta', 'amenaza'],
  },
  {
    id: 'ev_audit_trail',
    code: 'EV-17',
    title: 'Audit trail de la renuncia',
    type: 'digital',
    description: 'La renuncia la cargó l.ortega; no hay sesión de a.morgan.',
    detail:
      'El registro de RRHH muestra tres acciones de l.ortega entre las 09:12 y las 09:14 del 10/03. No existe ninguna sesión de a.morgan en el sistema. La firma fue escaneada desde HR-SCAN-02, sin validación biométrica.',
    source: { type: 'document', id: 'doc_renuncia', label: 'Audit trail REN-2026-0847' },
    unlockedByPuzzleId: 'p3_renuncia',
    optionalClue: 'El sistema dice quién hizo cada acción. Ninguna es de Alex.',
    tags: ['audit trail', 'renuncia'],
  },
  {
    id: 'ev_renuncia_falsa',
    code: 'EV-18',
    title: 'Renuncia fabricada',
    type: 'documento',
    description: 'La renuncia es apócrifa: Alex estaba en Rosario a la hora del registro.',
    detail:
      'La comparación entre la renuncia, el acta de Rosario y el audit trail demuestra que Alex no firmó ni cargó el formulario. La renuncia se registró a las 09:12 del 10/03, mientras Alex estaba en la planta del cliente, a 300 km de distancia.',
    source: { type: 'document', id: 'doc_conclusion', label: 'Cierre del capítulo 1' },
    unlockedByPuzzleId: 'p3_renuncia',
    optionalClue: 'La coartada de Rosario y el audit trail son las dos pruebas que no se pueden rebatir.',
    tags: ['conclusión', 'renuncia'],
  },
  {
    id: 'ev_mensaje_alex',
    code: 'EV-19',
    title: 'Mensaje programado de Alex',
    type: 'digital',
    description: 'Un mensaje aparece al cerrar el caso: «No me fui».',
    detail:
      'Mensaje programado para el 16/03 a las 21:00, entregado al cerrar la investigación: «Si llegaste hasta acá, no me fui. Buscá la caja 404. La llave no está en el edificio. — A.». El remitente y la hora están siendo verificados.',
    source: { type: 'document', id: 'doc_conclusion', label: 'Anexo — mensaje programado' },
    unlockedByPuzzleId: 'p3_renuncia',
    optionalClue: 'La llave de la caja 404 no está en el edificio. El capítulo 2 empieza ahí.',
    tags: ['cliffhanger', 'caja 404'],
  },
];

export const evidenciasPorId = Object.fromEntries(evidencias.map((e) => [e.id, e]));

export function getEvidencia(id) {
  return evidenciasPorId[id] ?? null;
}
