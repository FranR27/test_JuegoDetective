/**
 * Canon del Capítulo 1.
 * Este archivo es la fuente de la verdad narrativa para los datos y los acertijos.
 * Si se cambia una fecha, un nombre o una prueba, hay que actualizar docs/historia-capitulo-1.md
 * y volver a correr `npm test` (los tests verifican la coherencia del caso).
 */
export const capitulo1 = {
  id: 'cap_01',
  casoId: 'caso_404',
  numero: 1,
  caso: 'CASO 404',
  titulo: 'La persona que desapareció',
  lugar: 'Boreal Systems S.A. — Buenos Aires, Argentina',
  fechaInicio: '2026-03-16T09:00:00-03:00',
  fechaDesaparicion: '2026-03-13T19:42:00-03:00',
  denunciante: 'Marta Morgan (madre)',
  investigador: 'Vos',
  sinopsis: [
    'Alex Morgan, auditor interno senior de Boreal Systems, desapareció el viernes 13 de marzo de 2026. Su última salida registrada fue a las 19:42 por el molinete principal del edificio.',
    'El sábado a las 02:17, desde su cuenta de correo, se envió un mensaje de despedida: decía que renunciaba y que se iba a la casa de su hermano en Villa Traful. El lunes, su madre y su amiga Valeria denunciaron que no sabían nada de él.',
    'La empresa sostiene que Alex renunció por motivos personales. El legajo dice otra cosa. La carpeta AUDITORIA_2026 está bloqueada. Y alguien usó su credencial a las 02:05 de la madrugada, cuando Alex ya llevaba más de seis horas fuera del edificio.',
  ],
  objetivo:
    'Reconstruir la última noche de Alex, verificar si el correo de despedida y la renuncia son auténticos y encontrar qué estaba a punto de revelar la auditoría.',
  desenlace: [
    'El correo de despedida no lo escribió Alex: menciona un hermano que no existe y salió desde la terminal HR-02 del sector de RRHH, a la que Alex no volvió a entrar después de las 19:42.',
    'La renuncia REN-2026-0847 tampoco es suya: fue cargada por Laura Ortega desde el escáner HR-SCAN-02 a las 09:12 del 10 de marzo, mientras Alex estaba en una reunión presencial en Rosario. No existe sesión de a.morgan en el registro.',
    'La auditoría escondía tres pagos a Faro Consulting por $480.000, aprobados por Laura Ortega. Alex se negó a firmar el cierre y lo dejó por escrito.',
    'Alex no se retiró voluntariamente. La caja 404 sigue cerrada y alguien dejó un mensaje programado: «No me fui».',
  ],
  cierre: {
    titulo: 'Fin del capítulo 1',
    texto:
      'La renuncia es apócrifa, el correo de despedida también y el móvil está documentado. Alex Morgan no se fue: lo sacaron del tablero. La caja 404 es la única pieza que falta.',
    ganchoCapitulo2:
      'Capítulo 2 — «La caja 404»: la llave no está en el edificio. Alguien la tiene. Y sabe que estás investigando.',
  },
  estado: 'Contenido cerrado para revisión del equipo. Pendiente: integrar en el escritorio de Integrante 1 y mover la validación de respuestas al backend de Integrante 3.',
};

export const resumenCaso = {
  victima: 'Alex Morgan',
  edad: 34,
  legajo: '0847',
  puesto: 'Auditor Interno Senior',
  empresa: 'Boreal Systems S.A.',
  ultimaSalida: '2026-03-13T19:42:00-03:00',
  ultimoContacto: '2026-03-13T18:52:00-03:00',
  correoDespedida: '2026-03-14T02:17:41-03:00',
  denuncia: '2026-03-16T08:10:00-03:00',
  carpetaBloqueada: 'AUDITORIA_2026',
  claveFormato: 'legajo-año',
  claveCorrecta: '0847-2026',
  montoDesviado: 480000,
  proveedor: 'Faro Consulting SRL',
};
