/**
 * Archivos del caso: carpetas y documentos.
 *
 * Cada documento se renderiza con bloques para que la pantalla de Archivos sea
 * data-driven (no hay HTML hardcodeado por documento).
 *
 * `lockedByPuzzleId` indica que el documento no existe para el jugador hasta
 * resolver ese acertijo. `null` = disponible desde el inicio.
 */

export const carpetas = [
  {
    id: 'f_caso',
    name: 'Caso 404',
    code: 'CASO-404',
    description: 'Expediente abierto por la desaparición de Alex Morgan.',
    order: 1,
    lockedByPuzzleId: null,
  },
  {
    id: 'f_rrhh',
    name: 'Recursos Humanos',
    code: 'RRHH',
    description: 'Legajo, renuncia y política interna de auditoría.',
    order: 2,
    lockedByPuzzleId: null,
  },
  {
    id: 'f_seguridad',
    name: 'Seguridad',
    code: 'SEG',
    description: 'Registros de acceso, incidentes y metadatos del correo de despedida.',
    order: 3,
    lockedByPuzzleId: null,
  },
  {
    id: 'f_personal',
    name: 'Pertenencias de Alex',
    code: 'PER',
    description: 'Objetos recuperados del escritorio y del locker personal.',
    order: 4,
    lockedByPuzzleId: null,
  },
  {
    id: 'f_auditoria',
    name: 'AUDITORIA_2026',
    code: 'AUD',
    description: 'Carpeta cifrada de la auditoría del primer trimestre.',
    order: 5,
    lockedByPuzzleId: 'p2_auditoria',
    lock: {
      type: 'password',
      puzzleId: 'p2_auditoria',
      label: 'Carpeta protegida',
      placeholder: 'Clave de la carpeta',
    },
  },
];

export const documentos = [
  {
    id: 'doc_informe_caso',
    folderId: 'f_caso',
    title: 'Informe de investigación — borrador',
    kind: 'txt',
    date: '2026-03-16T09:15:00-03:00',
    author: 'Mesa 404',
    classification: 'interno',
    summary: 'Punto de partida: persona, hipótesis y contactos.',
    tags: ['caso', 'borrador'],
    lockedByPuzzleId: null,
    blocks: [
      { type: 'heading', text: 'CASO 404 — INFORME DE INVESTIGACIÓN' },
      {
        type: 'paragraph',
        text: 'Expediente abierto el lunes 16 de marzo de 2026 a las 09:15. La denuncia fue presentada por Marta Morgan, madre de la persona desaparecida, y por Valeria Ruiz, compañera de trabajo.',
      },
      {
        type: 'kv',
        items: [
          { label: 'Persona', value: 'Alex Morgan' },
          { label: 'Edad', value: '34 años' },
          { label: 'Legajo', value: '0847' },
          { label: 'Empresa', value: 'Boreal Systems S.A.' },
          { label: 'Última salida registrada', value: '13/03/2026 — 19:42' },
          { label: 'Último contacto confirmado', value: '13/03/2026 — 18:52 (mensaje a T. Ferrer)' },
          { label: 'Denunciante', value: 'Marta Morgan (madre)' },
        ],
      },
      { type: 'heading', text: 'Hipótesis de trabajo' },
      {
        type: 'list',
        ordered: true,
        items: [
          'Retiro voluntario: la empresa sostiene que Alex renunció y se fue al sur. Se apoya en el correo de despedida del 14/03 a las 02:17.',
          'Desaparición forzada: el correo y la renuncia podrían haber sido fabricados para encubrir una salida no voluntaria.',
          'Accidente o crisis personal: no hay registros médicos ni denuncias previas que la respalden.',
        ],
      },
      { type: 'heading', text: 'Contactos' },
      {
        type: 'list',
        items: [
          'Valeria Ruiz — analista de compliance; amiga y última persona que habló con Alex.',
          'Tomás Ferrer — soporte técnico; guardó los logs de la sesión sospechosa.',
          'Laura Ortega — jefa de RRHH; registró la renuncia y aprobó los pagos a Faro Consulting.',
          'Diego Sosa — guardia nocturno; presenció el ingreso manual de la credencial 0847.',
          'Marta Morgan — madre de Alex; recibió el correo de despedida.',
          'Iván Petrov — socio director; coordinó la reunión de Rosario del 10/03.',
        ],
      },
      {
        type: 'note',
        tone: 'warning',
        text: 'El correo de despedida menciona a un hermano en Villa Traful. El legajo de RRHH registra a Alex como hijo único. Verificar antes de cerrar la hipótesis de retiro voluntario.',
      },
      { type: 'signature', name: 'Mesa 404', role: 'Investigación privada', date: '16/03/2026' },
    ],
  },
  {
    id: 'doc_legajo',
    folderId: 'f_rrhh',
    title: 'Legajo de personal — A. Morgan (0847)',
    kind: 'pdf',
    date: '2021-04-05T09:00:00-03:00',
    author: 'Recursos Humanos',
    classification: 'confidencial',
    summary: 'Datos filiatorios, contacto de emergencia y composición familiar.',
    tags: ['legajo', 'RRHH', 'familia'],
    lockedByPuzzleId: null,
    blocks: [
      { type: 'heading', text: 'BOREAL SYSTEMS S.A. — LEGAJO DE PERSONAL' },
      {
        type: 'kv',
        items: [
          { label: 'Legajo', value: '0847' },
          { label: 'Nombre', value: 'Alex Morgan' },
          { label: 'Documento', value: '35.884.120' },
          { label: 'Puesto', value: 'Auditor Interno Senior — Dirección de Auditoría' },
          { label: 'Ingreso', value: '05/04/2021' },
          { label: 'Modalidad', value: 'Híbrida — 3 días presenciales' },
          { label: 'Domicilio', value: 'Av. Independencia 2240, 6.º B, CABA' },
          { label: 'Contacto de emergencia', value: 'Marta Morgan (madre) — +54 9 11 5555-0142' },
          { label: 'Composición familiar', value: 'Hijo único. Sin hermanos registrados.' },
          { label: 'Alergias', value: 'Penicilina' },
        ],
      },
      {
        type: 'paragraph',
        text: 'Observaciones: en 2024 Alex solicitó una reducción de viajes para acompañar el tratamiento médico de su madre. La solicitud fue aprobada por la dirección de Auditoría.',
      },
      {
        type: 'note',
        tone: 'warning',
        text: 'Este legajo no registra hermanos, medios hermanos ni familiares a cargo. El único contacto de emergencia es la madre.',
      },
      { type: 'signature', name: 'Laura Ortega', role: 'Recursos Humanos', date: '05/04/2021' },
    ],
  },
  {
    id: 'doc_renuncia',
    folderId: 'f_rrhh',
    title: 'Formulario de renuncia REN-2026-0847',
    kind: 'pdf',
    date: '2026-03-10T09:12:00-03:00',
    author: 'Laura Ortega — RRHH',
    classification: 'confidencial',
    summary: 'Renuncia voluntaria registrada por RRHH. Firma escaneada y audit trail.',
    tags: ['renuncia', 'RRHH', 'documento firmado'],
    lockedByPuzzleId: null,
    blocks: [
      { type: 'heading', text: 'FORMULARIO DE RENUNCIA — REN-2026-0847' },
      {
        type: 'kv',
        items: [
          { label: 'Empleado', value: 'Alex Morgan — legajo 0847' },
          { label: 'Fecha de registro', value: '10/03/2026 — 09:12' },
          { label: 'Registrado por', value: 'l.ortega — Laura Ortega (RRHH)' },
          { label: 'Motivo declarado', value: 'Motivos personales' },
          { label: 'Último día trabajado', value: '20/03/2026' },
          { label: 'Forma', value: 'Formulario escaneado (HR-SCAN-02)' },
          { label: 'Firma', value: 'A. Morgan (escaneada)' },
        ],
      },
      { type: 'heading', text: 'Registro de auditoría del sistema' },
      {
        type: 'table',
        columns: ['Fecha', 'Hora', 'Usuario', 'Acción'],
        rows: [
          ['10/03/2026', '09:12', 'l.ortega', 'Alta manual del formulario REN-2026-0847'],
          ['10/03/2026', '09:13', 'l.ortega', 'Adjunto de escaneo desde HR-SCAN-02'],
          ['10/03/2026', '09:14', 'l.ortega', 'Cambio de estado a «renuncia voluntaria»'],
        ],
      },
      {
        type: 'note',
        tone: 'danger',
        text: 'No existe ninguna sesión de a.morgan en el sistema de RRHH entre el 09/03 y el 10/03. La firma escaneada no cuenta con validación biométrica.',
      },
      { type: 'signature', name: 'A. Morgan', role: 'Empleado', date: '10/03/2026' },
    ],
  },
  {
    id: 'doc_politica',
    folderId: 'f_rrhh',
    title: 'Política de acceso a carpetas de auditoría',
    kind: 'pdf',
    date: '2026-01-02T10:00:00-03:00',
    author: 'Dirección de Auditoría',
    classification: 'interno',
    summary: 'Formato de las claves de las carpetas de auditoría.',
    tags: ['política', 'claves', 'auditoría'],
    lockedByPuzzleId: null,
    blocks: [
      { type: 'heading', text: 'DIR-2026-02 — POLÍTICA DE ACCESO A CARPETAS DE AUDITORÍA' },
      {
        type: 'paragraph',
        text: 'Las carpetas de auditoría se identifican con el año fiscal y permanecen cifradas hasta que el auditor responsable las habilita.',
      },
      {
        type: 'paragraph',
        text: 'La clave de acceso combina el número de legajo del auditor responsable y el año fiscal, separados por un guion. No se admiten espacios ni otros caracteres.',
      },
      {
        type: 'quote',
        text: 'Ejemplo de formato: 0000-2025',
        source: 'Anexo A — Claves de carpeta',
      },
      {
        type: 'paragraph',
        text: 'Solo el auditor responsable y la dirección pueden solicitar la clave. Toda apertura queda registrada en el log de auditoría.',
      },
      { type: 'note', tone: 'info', text: 'Vigente desde el 01/01/2026. Reemplaza a la política DIR-2024-07.' },
      { type: 'signature', name: 'Dirección de Auditoría', role: 'Boreal Systems', date: '02/01/2026' },
    ],
  },
  {
    id: 'doc_acta_10_03',
    folderId: 'f_rrhh',
    title: 'Acta de reunión — cliente Logística del Sur (10/03)',
    kind: 'pdf',
    date: '2026-03-10T10:34:00-03:00',
    author: 'Iván Petrov',
    classification: 'interno',
    summary: 'Reunión presencial en Rosario. Alex Morgan estuvo en planta toda la mañana.',
    tags: ['acta', 'Rosario', 'coartada'],
    lockedByPuzzleId: null,
    blocks: [
      { type: 'heading', text: 'ACTA DE REUNIÓN — LOGÍSTICA DEL SUR' },
      {
        type: 'kv',
        items: [
          { label: 'Fecha', value: '10/03/2026' },
          { label: 'Hora', value: '09:00 — 10:30' },
          { label: 'Modalidad', value: 'Presencial' },
          { label: 'Lugar', value: 'Planta del cliente — Rosario, Santa Fe' },
          { label: 'Coordina', value: 'Iván Petrov (Boreal Systems)' },
        ],
      },
      { type: 'heading', text: 'Participantes' },
      {
        type: 'list',
        items: [
          'Alex Morgan — Auditoría (Boreal Systems)',
          'Valeria Ruiz — Compliance (Boreal Systems)',
          'Iván Petrov — Socio director (Boreal Systems)',
          'Camila Duarte — Logística del Sur (cliente)',
        ],
      },
      {
        type: 'paragraph',
        text: 'Temas: avance del relevamiento del primer trimestre, muestras de facturación y cronograma de cierre. Alex Morgan presentó el estado de las muestras y se comprometió a entregar el informe preliminar el 13/03.',
      },
      {
        type: 'kv',
        items: [
          { label: 'Ingreso a planta', value: '08:47 — credencial de visitante V-2291 a nombre de Alex Morgan' },
          { label: 'Cierre y firma digital', value: '10:34' },
        ],
      },
      {
        type: 'note',
        tone: 'info',
        text: 'Alex Morgan permaneció en la planta del cliente durante toda la mañana. El registro de visitante y la cámara de acceso coinciden con el horario del acta.',
      },
      { type: 'signature', name: 'Iván Petrov', role: 'Socio director — Auditoría', date: '10/03/2026' },
    ],
  },
  {
    id: 'doc_registro_accesos',
    folderId: 'f_seguridad',
    title: 'Registro de accesos — 13 y 14 de marzo',
    kind: 'csv',
    date: '2026-03-15T23:10:00-03:00',
    author: 'Seguridad — Diego Sosa',
    classification: 'interno',
    summary: 'Salida de Alex, ingreso manual con su credencial y sesión VPN en RRHH.',
    tags: ['accesos', 'credencial 0847', 'timeline'],
    lockedByPuzzleId: null,
    blocks: [
      { type: 'heading', text: 'REGISTRO DE ACCESOS — MOLINETES Y VPN' },
      {
        type: 'paragraph',
        text: 'Exportación solicitada por Alex Morgan el viernes 13/03 y entregada por el guardia Diego Sosa el domingo 15/03. Horas en UTC-3.',
      },
      {
        type: 'table',
        columns: ['Fecha', 'Hora', 'Evento', 'Credencial', 'Ubicación', 'Observación'],
        highlightRows: [3, 4, 5],
        rows: [
          ['13/03/2026', '19:42:07', 'SALIDA', '0847', 'Molinete principal', 'Alex Morgan'],
          ['13/03/2026', '19:42:31', 'SALIDA', '0847', 'Estacionamiento', 'Alex Morgan'],
          ['13/03/2026', '20:05:00', 'SIN SEÑAL', 'teléfono 0107', '—', 'Última señal del celular de Alex'],
          ['14/03/2026', '02:05:12', 'ENTRADA', '0847', 'Estacionamiento', 'Ingreso manual — sin foto'],
          ['14/03/2026', '02:06:44', 'ENTRADA', '0847', 'Piso 3 — RRHH', 'Acceso autorizado nivel 3'],
          ['14/03/2026', '02:17:03', 'SESIÓN VPN', 'a.morgan', 'Terminal HR-02 — piso 3', 'Envío de correo'],
          ['14/03/2026', '02:31:20', 'SALIDA', '0847', 'Estacionamiento', 'Sin registro de imagen'],
        ],
      },
      {
        type: 'note',
        tone: 'danger',
        text: 'La credencial 0847 no volvió a registrarse en el molinete principal después de las 19:42 del viernes. El ingreso de las 02:05 fue habilitado a mano por el guardia de turno: la persona no mostró documento y la cámara 3 estaba sin señal.',
      },
    ],
  },
  {
    id: 'doc_incidente_camara',
    folderId: 'f_seguridad',
    title: 'Informe de incidente — cámara 3',
    kind: 'txt',
    date: '2026-03-14T03:10:00-03:00',
    author: 'Diego Sosa — Seguridad',
    classification: 'interno',
    summary: 'Corte de señal de la cámara 3 entre 01:50 y 02:30.',
    tags: ['CCTV', 'incidente', 'NVR'],
    lockedByPuzzleId: null,
    blocks: [
      { type: 'heading', text: 'INFORME DE INCIDENTE — SEG-2026-0314' },
      {
        type: 'kv',
        items: [
          { label: 'Fecha', value: '14/03/2026' },
          { label: 'Turno', value: 'Noche — Diego Sosa' },
          { label: 'Cámara afectada', value: 'Cámara 3 — estacionamiento, acceso peatonal' },
          { label: 'Duración del corte', value: '01:50 — 02:30' },
        ],
      },
      {
        type: 'paragraph',
        text: 'A las 01:50 la cámara 3 dejó de transmitir. El NVR no registró una alerta de falla. La señal volvió a las 02:30, después de que se registrara un ingreso manual por el acceso peatonal.',
      },
      {
        type: 'paragraph',
        text: 'La cámara 7, ubicada en el pasillo del piso 3, detectó movimiento a las 02:06. La imagen está fuera de foco y no permite identificar a la persona.',
      },
      {
        type: 'note',
        tone: 'warning',
        text: 'El reinicio del NVR no figura en el plan de mantenimiento. No hay orden de trabajo asociada. Se informó a RRHH y se recibió la instrucción de no presentar denuncia.',
      },
    ],
  },
  {
    id: 'doc_metadatos_despedida',
    folderId: 'f_seguridad',
    title: 'Análisis forense — correo de despedida',
    kind: 'txt',
    date: '2026-03-16T12:40:00-03:00',
    author: 'Mesa 404 — análisis digital',
    classification: 'restringido',
    summary: 'El correo salió desde la terminal HR-02, en RRHH, a las 02:17.',
    tags: ['forense', 'correo', 'VPN'],
    lockedByPuzzleId: 'p1_despedida',
    blocks: [
      { type: 'heading', text: 'ANÁLISIS FORENSE — CORREO DE DESPEDIDA' },
      {
        type: 'kv',
        items: [
          { label: 'Remitente', value: 'a.morgan@borealsystems.com' },
          { label: 'Fecha de envío', value: '14/03/2026 — 02:17:41' },
          { label: 'Origen', value: 'VPN corporativa — terminal HR-02 (piso 3, RRHH)' },
          { label: 'IP interna', value: '10.24.8.17' },
          { label: 'Cliente', value: 'Outlook Web — sesión iniciada 02:16:58' },
          { label: 'Dispositivo', value: 'PC fija no registrada como equipo de Alex' },
          { label: 'Destinatarios', value: 'valeria.ruiz@…, marta.morgan@…, rrhh@…' },
          { label: 'Programado', value: 'No. Envío manual.' },
        ],
      },
      {
        type: 'paragraph',
        text: 'La sesión se abrió con la contraseña de Alex, pero desde la terminal fija del sector de RRHH. Esa terminal requiere credencial de nivel 3 y no tiene acceso de visitantes.',
      },
      {
        type: 'note',
        tone: 'danger',
        text: 'Alex Morgan no registró ingresos al edificio después de las 19:42 del 13/03. La terminal HR-02 está en el piso 3, dentro del sector de RRHH.',
      },
    ],
  },
  {
    id: 'doc_agenda',
    folderId: 'f_personal',
    title: 'Agenda personal de Alex — semana del 09/03',
    kind: 'txt',
    date: '2026-03-13T18:00:00-03:00',
    author: 'Alex Morgan',
    classification: 'personal',
    summary: 'Viaje a Rosario, reunión con Laura y anotación «caja 404».',
    tags: ['agenda', 'manuscrito', 'timeline'],
    lockedByPuzzleId: null,
    blocks: [
      { type: 'heading', text: 'AGENDA PERSONAL — ALEX MORGAN' },
      {
        type: 'table',
        columns: ['Día', 'Hora', 'Compromiso'],
        rows: [
          ['Lun 09/03', '10:00', 'Comité de auditoría'],
          ['Lun 09/03', '15:00', 'Revisión de muestras Q1'],
          ['Mar 10/03', '07:30', 'Viaje a Rosario'],
          ['Mar 10/03', '09:00', 'Reunión Logística del Sur (planta del cliente)'],
          ['Mar 10/03', '18:40', 'Regreso a CABA'],
          ['Mié 11/03', '19:00', 'Gimnasio'],
          ['Jue 12/03', '16:30', 'RRHH: renuncia (?)'],
          ['Jue 12/03', '22:00', 'Hablar con Laura'],
          ['Jue 12/03', '23:00', 'V: carpeta'],
          ['Vie 13/03', '09:00', 'Hablar con T. (logs)'],
          ['Vie 13/03', '18:30', 'Caja 404'],
          ['Vie 13/03', '19:30', 'Salir'],
        ],
      },
      {
        type: 'paragraph',
        text: 'Al pie de la página, con la misma letra: «Si no vuelvo, la copia está en la caja 404. V. sabe».',
      },
      {
        type: 'note',
        tone: 'info',
        text: 'La letra coincide con la firma del legajo 2021. El cuaderno estaba en el cajón del escritorio, no en la mochila que Alex llevó al salir.',
      },
    ],
  },
  {
    id: 'doc_nota_caja',
    folderId: 'f_personal',
    title: 'Nota manuscrita — caja 404',
    kind: 'img',
    date: '2026-03-16T10:20:00-03:00',
    author: 'Hallazgo de la investigación',
    classification: 'personal',
    summary: 'Nota con el legajo y la instrucción de no firmar.',
    tags: ['caja 404', 'nota', 'legajo'],
    lockedByPuzzleId: 'p1_despedida',
    blocks: [
      { type: 'heading', text: 'HALLAZGO - LOCKER 404 (subsuelo)' },
      {
        type: 'paragraph',
        text: 'La caja metálica 404 estaba cerrada con un candado de combinación. Adentro había una carpeta con una copia de la nota preliminar y esta hoja amarilla doblada al medio.',
      },
      { type: 'image', photoId: 'foto_nota_caja', caption: 'Nota manuscrita encontrada dentro de la caja 404.' },
      {
        type: 'paragraph',
        text: 'Texto: «0847 — no firmar. Copia acá. Si no vuelvo, V.». La letra coincide con la agenda personal y con la firma del legajo 2021.',
      },
      {
        type: 'note',
        tone: 'warning',
        text: 'La carpeta completa de la auditoría no está en el locker. Solo quedó la nota y una copia parcial de la nota preliminar. La caja 404 aparece mencionada en el correo que Alex envió a Laura el 12/03.',
      },
    ],
  },
  {
    id: 'doc_nota_preliminar',
    folderId: 'f_auditoria',
    title: 'Nota preliminar de auditoría Q1',
    kind: 'txt',
    date: '2026-03-12T21:58:00-03:00',
    author: 'Alex Morgan',
    classification: 'restringido',
    summary: 'Tres pagos a Faro Consulting por $480.000 sin orden de compra.',
    tags: ['auditoría', 'Faro Consulting', 'borrador'],
    lockedByPuzzleId: 'p2_auditoria',
    blocks: [
      { type: 'heading', text: 'NOTA PRELIMINAR — AUDITORÍA Q1 2026 (BORRADOR)' },
      {
        type: 'paragraph',
        text: 'Encontré tres pagos a Faro Consulting SRL que no coinciden con ninguna orden de compra ni con el registro de proveedores aprobados.',
      },
      {
        type: 'list',
        items: [
          '12/01/2026 — factura F-2026-0112 — $180.000 — aprobada por L. Ortega.',
          '02/02/2026 — factura F-2026-0207 — $150.000 — aprobada por L. Ortega.',
          '05/03/2026 — factura F-2026-0311 — $150.000 — aprobada por L. Ortega.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Total desviado: $480.000. Las facturas están duplicadas en el mayor y las aprobaciones llevan la firma de Laura Ortega. No voy a firmar el informe final.',
      },
      {
        type: 'paragraph',
        text: 'Si alguien más está leyendo esto: la copia completa está en la caja 404. No la abras desde la red de la empresa.',
      },
      { type: 'note', tone: 'danger', text: 'Documento sin firma digital. Guardado el 12/03/2026 a las 21:58, dos horas antes del correo a Laura.' },
    ],
  },
  {
    id: 'doc_movimientos',
    folderId: 'f_auditoria',
    title: 'Mayor analítico — pagos Q1 2026',
    kind: 'csv',
    date: '2026-03-11T17:40:00-03:00',
    author: 'Finanzas — exportación',
    classification: 'restringido',
    summary: 'Pagos del trimestre. Tres filas de Faro Consulting resaltadas.',
    tags: ['finanzas', 'Faro Consulting', 'csv'],
    lockedByPuzzleId: 'p2_auditoria',
    blocks: [
      { type: 'heading', text: 'MAYOR ANALÍTICO — PRIMER TRIMESTRE 2026' },
      {
        type: 'table',
        columns: ['Fecha', 'Proveedor', 'Factura', 'Importe', 'Aprobado por', 'Estado'],
        highlightRows: [0, 2, 4],
        rows: [
          ['12/01/2026', 'Faro Consulting SRL', 'F-2026-0112', '$180.000', 'L. Ortega', 'APROBADO'],
          ['22/01/2026', 'Insumos Delta SA', 'F-2026-0198', '$42.300', 'M. Vidal', 'PAGADO'],
          ['02/02/2026', 'Faro Consulting SRL', 'F-2026-0207', '$150.000', 'L. Ortega', 'APROBADO'],
          ['18/02/2026', 'Soporte Norte SRL', 'F-2026-0261', '$18.900', 'M. Vidal', 'PAGADO'],
          ['05/03/2026', 'Faro Consulting SRL', 'F-2026-0311', '$150.000', 'L. Ortega', 'APROBADO'],
          ['08/03/2026', 'Limpieza Andina', 'F-2026-0320', '$7.400', 'M. Vidal', 'PAGADO'],
        ],
      },
      { type: 'paragraph', text: 'Total Faro Consulting: $480.000. El resto de los pagos coincide con órdenes de compra vigentes.' },
      {
        type: 'note',
        tone: 'danger',
        text: 'Faro Consulting SRL no figura en el registro de proveedores aprobados. La cuenta contable 4.2.3 no aparece en el mayor oficial entregado a la dirección.',
      },
    ],
  },
  {
    id: 'doc_correo_laura',
    folderId: 'f_auditoria',
    title: 'Copia de correo interno — L. Ortega a Finanzas',
    kind: 'pdf',
    date: '2026-03-11T18:04:00-03:00',
    author: 'Laura Ortega',
    classification: 'restringido',
    summary: 'Instrucción para reclasificar los pagos a Faro antes del cierre.',
    tags: ['correo', 'Laura Ortega', 'encubrimiento'],
    lockedByPuzzleId: 'p2_auditoria',
    blocks: [
      { type: 'heading', text: 'COPIA DE CORREO INTERNO — 11/03/2026 18:04' },
      {
        type: 'kv',
        items: [
          { label: 'De', value: 'Laura Ortega <laura.ortega@borealsystems.com>' },
          { label: 'Para', value: 'finanzas@borealsystems.com' },
          { label: 'CC', value: 'direccion@borealsystems.com' },
          { label: 'Asunto', value: 'Reclasificación Faro — antes del 15/03' },
        ],
      },
      {
        type: 'paragraph',
        text: 'Necesito que los pagos a Faro queden como «servicios de consultoría» antes del cierre. Alex está revisando el mayor y no debe ver la cuenta 4.2.3.',
      },
      {
        type: 'paragraph',
        text: 'Si pregunta, derivarlo a mí. No respondan este correo desde sus casillas personales y no lo reenvíen a Auditoría.',
      },
      {
        type: 'note',
        tone: 'danger',
        text: 'Correo recuperado del servidor de Finanzas. La cuenta 4.2.3 fue renombrada como «Servicios profesionales — otros» el 11/03 a las 18:22.',
      },
    ],
  },
  {
    id: 'doc_acta_12_03',
    folderId: 'f_auditoria',
    title: 'Acta de reunión — auditoría Q1 (12/03)',
    kind: 'pdf',
    date: '2026-03-12T17:30:00-03:00',
    author: 'Valeria Ruiz / Tomás Ferrer',
    classification: 'restringido',
    summary: 'Alex se negó a firmar el cierre. Laura Ortega lo amenazó frente a testigos.',
    tags: ['acta', 'testigos', 'amenaza'],
    lockedByPuzzleId: 'p2_auditoria',
    blocks: [
      { type: 'heading', text: 'ACTA DE REUNIÓN — AUDITORÍA Q1' },
      {
        type: 'kv',
        items: [
          { label: 'Fecha', value: '12/03/2026' },
          { label: 'Hora', value: '17:30 — 18:10' },
          { label: 'Lugar', value: 'Sala de auditoría — piso 4' },
          { label: 'Participantes', value: 'Alex Morgan, Laura Ortega, Valeria Ruiz, Tomás Ferrer' },
        ],
      },
      {
        type: 'paragraph',
        text: 'Alex presentó los tres pagos a Faro Consulting por $480.000 y solicitó explicaciones. Laura Ortega pidió postergar el informe hasta la semana siguiente y ofreció «revisar el alcance de la muestra».',
      },
      {
        type: 'paragraph',
        text: 'Alex se negó a firmar el cierre y pidió que la reunión quedara registrada. Al cierre, Laura Ortega manifestó: «Si no firmás, esto va a ser peor para vos».',
      },
      { type: 'quote', text: '«Si no firmás, esto va a ser peor para vos».', source: 'Laura Ortega, según dos testigos' },
      {
        type: 'note',
        tone: 'warning',
        text: 'Transcripción autorizada por Valeria Ruiz y Tomás Ferrer. Laura Ortega se retiró sin firmar el acta.',
      },
    ],
  },
  {
    id: 'doc_conclusion',
    folderId: 'f_caso',
    title: 'Cierre del capítulo 1 — informe del investigador',
    kind: 'txt',
    date: '2026-03-16T21:00:00-03:00',
    author: 'Mesa 404',
    classification: 'interno',
    summary: 'La renuncia y el correo son falsos. Móvil: los pagos a Faro. Fin del capítulo.',
    tags: ['cierre', 'conclusión', 'capítulo 1'],
    lockedByPuzzleId: 'p3_renuncia',
    blocks: [
      { type: 'heading', text: 'CIERRE DEL CAPÍTULO 1 — INFORME DEL INVESTIGADOR' },
      {
        type: 'paragraph',
        text: 'La renuncia REN-2026-0847 es apócrifa. Fue cargada por Laura Ortega desde el escáner HR-SCAN-02 a las 09:12 del 10/03, mientras Alex Morgan estaba en una reunión presencial en Rosario. No existe ninguna sesión de a.morgan en el sistema de RRHH.',
      },
      {
        type: 'paragraph',
        text: 'El correo de despedida también es falso. Se envió a las 02:17 del 14/03 desde la terminal HR-02, en el piso de RRHH. Alex había salido del edificio a las 19:42 del viernes y no volvió a ingresar. La cámara 3 estuvo sin señal justo en la ventana del acceso manual con su credencial.',
      },
      { type: 'heading', text: 'Hallazgos' },
      {
        type: 'list',
        ordered: true,
        items: [
          'El correo menciona un hermano inexistente: Alex es hijo único.',
          'La renuncia fue registrada por Laura Ortega sin participación de Alex.',
          'Los tres pagos a Faro Consulting ($480.000) tienen la aprobación de Laura Ortega.',
          'Laura amenazó a Alex frente a dos testigos el 12/03.',
          'Alguien usó la credencial 0847 a las 02:05 del sábado y accedió al piso 3.',
        ],
      },
      {
        type: 'note',
        tone: 'warning',
        text: 'Alex Morgan no se retiró voluntariamente. La caja 404 permanece cerrada y su contenido no fue localizado. Recomendación: preservar la evidencia y localizar a Laura Ortega.',
      },
      { type: 'signature', name: 'Mesa 404', role: 'Investigación privada', date: '16/03/2026 — 21:00' },
      {
        type: 'note',
        tone: 'info',
        text: 'Fin del capítulo 1. Capítulo 2 — «La caja 404»: la llave no está en el edificio.',
      },
    ],
  },
];

export const documentosPorId = Object.fromEntries(documentos.map((d) => [d.id, d]));

export const carpetasPorId = Object.fromEntries(carpetas.map((c) => [c.id, c]));

export function getDocumento(id) {
  return documentosPorId[id] ?? null;
}

export function getCarpeta(id) {
  return carpetasPorId[id] ?? null;
}

export function documentosDeCarpeta(folderId) {
  return documentos.filter((d) => d.folderId === folderId);
}
