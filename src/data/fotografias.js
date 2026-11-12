/**
 * Fotografías y capturas del caso.
 * Los archivos viven en public/case/photos y se referencian con `photoSrc`.
 * Al integrar en la app de Integrante 1 hay que copiar esa carpeta a su `public/`.
 */
const BASE_URL =
  typeof import.meta !== 'undefined' && import.meta.env?.BASE_URL
    ? import.meta.env.BASE_URL
    : '/';

export const PHOTOS_PATH = 'case/photos/';

export function photoSrc(fileName) {
  return `${BASE_URL}${PHOTOS_PATH}${fileName}`;
}

export const fotografias = [
  {
    id: 'foto_credencial',
    title: 'Credencial de Alex Morgan',
    file: 'credencial-alex.svg',
    date: '2026-03-13T19:40:00-03:00',
    location: 'Boreal Systems — molinete 1',
    description:
      'Credencial plastificada hallada en el escritorio de Alex, piso 4. Legajo 0847. La foto está desactualizada: Alex tenía el pelo más corto.',
    tags: ['identificación', 'legajo 0847'],
    evidenceId: 'ev_credencial',
  },
  {
    id: 'foto_salida',
    title: 'Cámara 1 — salida del edificio (13/03, 19:42)',
    file: 'camara-salida.svg',
    date: '2026-03-13T19:42:07-03:00',
    location: 'Boreal Systems — molinete principal',
    description:
      'Última imagen confirmada de Alex. Sale con campera oscura y mochila. No vuelve a aparecer en ninguna cámara del perímetro.',
    tags: ['CCTV', 'última vez visto'],
    evidenceId: 'ev_registro_accesos',
  },
  {
    id: 'foto_camara_off',
    title: 'Cámara 3 — sin señal (14/03, 02:05)',
    file: 'camara-offline.svg',
    date: '2026-03-14T02:05:12-03:00',
    location: 'Boreal Systems — estacionamiento, acceso peatonal',
    description:
      'Fotograma del NVR durante el corte. La cámara 3 queda sin señal entre 01:50 y 02:30, justo en la ventana del ingreso manual de la credencial 0847.',
    tags: ['CCTV', 'sabotaje'],
    evidenceId: 'ev_camara_off',
  },
  {
    id: 'foto_nota_caja',
    title: 'Nota encontrada en la caja 404',
    file: 'nota-caja-404.svg',
    date: '2026-03-16T10:20:00-03:00',
    location: 'Subsuelo — lockers del personal',
    description:
      'Nota manuscrita dentro de la caja metálica 404, cerrada con candado. Alguien escribió el legajo de Alex y una instrucción: «no firmar». La letra coincide con la agenda personal.',
    tags: ['nota manuscrita', 'caja 404'],
    evidenceId: 'ev_nota_caja',
  },
  {
    id: 'foto_firmas',
    title: 'Comparación de firmas',
    file: 'firmas.svg',
    date: '2026-03-16T11:05:00-03:00',
    location: 'Mesa de análisis — caso 404',
    description:
      'A la izquierda, la firma de Alex en su legajo (2021): trazo continuo, inclinación constante. A la derecha, la firma escaneada del formulario de renuncia (2026): trazo entrecortado y presión irregular.',
    tags: ['documentoscopia', 'renuncia'],
    evidenceId: 'ev_audit_trail',
  },
  {
    id: 'foto_pizarra',
    title: 'Pizarra de la oficina de auditoría',
    file: 'pizarra-auditoria.svg',
    date: '2026-03-13T18:20:00-03:00',
    location: 'Boreal Systems — piso 4, sala de auditoría',
    description:
      'La pizarra quedó intacta el fin de semana. Se lee «Faro x3 = 480k», «¿quién aprobó?» y, abajo, «404» encerrado en un círculo.',
    tags: ['pizarra', 'Faro Consulting'],
    evidenceId: 'ev_movimientos_faro',
  },
];

export const fotografiasPorId = Object.fromEntries(fotografias.map((f) => [f.id, f]));

export function getFoto(id) {
  return fotografiasPorId[id] ?? null;
}
