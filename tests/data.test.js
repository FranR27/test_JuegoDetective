import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  acertijos,
  acertijosPorId,
  capitulo1,
  carpetas,
  carpetasPorId,
  conversaciones,
  conversacionesPorId,
  correos,
  correosPorId,
  correosEnviados,
  correosRecibidos,
  documentos,
  documentosPorId,
  evidencias,
  evidenciasPorId,
  fotografias,
  fotografiasPorId,
  personajes,
  personajesPorId,
  resumenCaso,
} from '../src/data/index.js';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const PHOTO_DIR = path.resolve(TEST_DIR, '../public/case/photos');

const BLOCK_TYPES = new Set([
  'heading',
  'paragraph',
  'kv',
  'table',
  'list',
  'note',
  'quote',
  'signature',
  'image',
]);

function assertUniqueIds(collection, label) {
  const ids = collection.map((item) => item.id);
  assert.equal(ids.length, new Set(ids).size, `${label}: hay IDs duplicados`);
  for (const id of ids) {
    assert.ok(typeof id === 'string' && id.length > 0, `${label}: ID vacío`);
  }
}

function docText(doc) {
  return JSON.stringify(doc.blocks);
}

test('el capítulo define la historia base y los totales de la entrega', () => {
  assert.equal(capitulo1.caso, 'CASO 404');
  assert.equal(capitulo1.numero, 1);
  assert.equal(resumenCaso.victima, 'Alex Morgan');
  assert.equal(resumenCaso.legajo, '0847');
  assert.equal(resumenCaso.carpetaBloqueada, 'AUDITORIA_2026');
  assert.equal(resumenCaso.claveCorrecta, '0847-2026');
  assert.equal(resumenCaso.montoDesviado, 480000);

  assert.equal(carpetas.length, 5, 'deben existir 5 carpetas');
  assert.equal(documentos.length, 15, 'deben existir 15 documentos');
  assert.equal(correosRecibidos.length, 5, 'deben existir exactamente 5 correos recibidos');
  assert.equal(correosEnviados.length, 1, 'debe existir exactamente 1 correo enviado');
  assert.equal(correos.length, 6);
  assert.equal(conversaciones.length, 3, 'deben existir exactamente 3 conversaciones');
  assert.equal(evidencias.length, 19);
  assert.equal(acertijos.length, 3);
  assert.equal(fotografias.length, 6);
});

test('todos los IDs son únicos y las referencias entre colecciones existen', () => {
  assertUniqueIds(carpetas, 'carpetas');
  assertUniqueIds(documentos, 'documentos');
  assertUniqueIds(correos, 'correos');
  assertUniqueIds(conversaciones, 'conversaciones');
  assertUniqueIds(evidencias, 'evidencias');
  assertUniqueIds(acertijos, 'acertijos');
  assertUniqueIds(fotografias, 'fotografías');
  assertUniqueIds(personajes, 'personajes');

  const allMessageIds = conversaciones.flatMap((chat) => chat.messages.map((message) => message.id));
  assert.equal(allMessageIds.length, new Set(allMessageIds).size, 'IDs de mensajes duplicados');

  for (const doc of documentos) {
    assert.ok(carpetasPorId[doc.folderId], `${doc.id}: carpeta inexistente ${doc.folderId}`);
    assert.ok(Array.isArray(doc.blocks) && doc.blocks.length > 0, `${doc.id}: sin bloques`);
    for (const block of doc.blocks) {
      assert.ok(BLOCK_TYPES.has(block.type), `${doc.id}: bloque desconocido ${block.type}`);
      if (block.type === 'image') {
        assert.ok(fotografiasPorId[block.photoId], `${doc.id}: foto inexistente ${block.photoId}`);
      }
    }
    assert.ok(!Number.isNaN(Date.parse(doc.date)), `${doc.id}: fecha inválida`);
  }

  for (const email of correos) {
    assert.ok(email.box === 'inbox' || email.box === 'sent', `${email.id}: bandeja inválida`);
    assert.ok(email.from?.name && email.from?.email, `${email.id}: remitente incompleto`);
    assert.ok(Array.isArray(email.to) && email.to.length > 0, `${email.id}: destinatarios vacíos`);
    assert.ok(Array.isArray(email.body) && email.body.length > 0, `${email.id}: cuerpo vacío`);
    assert.ok(!Number.isNaN(Date.parse(email.date)), `${email.id}: fecha inválida`);
    for (const attachment of email.attachments ?? []) {
      assert.ok(documentosPorId[attachment.ref], `${email.id}: adjunto inexistente ${attachment.ref}`);
    }
    for (const evidenceId of email.relatedEvidenceIds ?? []) {
      assert.ok(evidenciasPorId[evidenceId], `${email.id}: evidencia inexistente ${evidenceId}`);
    }
  }

  for (const chat of conversaciones) {
    assert.ok(personajesPorId[chat.contactId], `${chat.id}: contacto inexistente`);
    assert.ok(chat.messages.length > 0, `${chat.id}: sin mensajes`);
    const timestamps = chat.messages.map((message) => Date.parse(message.at));
    for (const timestamp of timestamps) assert.ok(!Number.isNaN(timestamp), `${chat.id}: fecha inválida`);
    assert.deepEqual(timestamps, [...timestamps].sort((a, b) => a - b), `${chat.id}: mensajes fuera de orden`);
    assert.equal(
      Date.parse(chat.lastMessageAt),
      timestamps[timestamps.length - 1],
      `${chat.id}: lastMessageAt no coincide con el último mensaje`
    );
    for (const message of chat.messages) {
      assert.ok(personajesPorId[message.authorId], `${chat.id}/${message.id}: autor inexistente`);
    }
  }

  for (const evidence of evidencias) {
    const { source } = evidence;
    assert.ok(source?.type && source?.id && source?.label, `${evidence.id}: fuente incompleta`);
    const collection = {
      photo: fotografiasPorId,
      email: correosPorId,
      document: documentosPorId,
      chat: conversacionesPorId,
    }[source.type];
    assert.ok(collection, `${evidence.id}: tipo de fuente desconocido ${source.type}`);
    assert.ok(collection[source.id], `${evidence.id}: fuente inexistente ${source.type}/${source.id}`);
  }

  for (const photo of fotografias) {
    assert.ok(evidenciasPorId[photo.evidenceId], `${photo.id}: evidencia inexistente ${photo.evidenceId}`);
    const file = path.join(PHOTO_DIR, photo.file);
    assert.ok(fs.existsSync(file), `${photo.id}: falta el archivo ${photo.file}`);
    const svg = fs.readFileSync(file, 'utf8');
    assert.match(svg, /<svg[\s>]/, `${photo.file}: no parece un SVG`);
    assert.match(svg, /<\/svg>\s*$/, `${photo.file}: SVG incompleto`);
    assert.ok(!/[^\x00-\x7F]/.test(photo.file), `${photo.id}: nombre de archivo no ASCII`);
  }
});

test('los acertijos tienen opciones, respuestas y pistas coherentes', () => {
  assert.deepEqual(
    acertijos.map((puzzle) => puzzle.id),
    ['p1_despedida', 'p2_auditoria', 'p3_renuncia']
  );
  assert.deepEqual(
    acertijos.map((puzzle) => puzzle.order),
    [1, 2, 3]
  );

  for (const puzzle of acertijos) {
    assert.ok(puzzle.title && puzzle.question && puzzle.instructions, `${puzzle.id}: texto incompleto`);
    assert.ok(Array.isArray(puzzle.hints) && puzzle.hints.length >= 2, `${puzzle.id}: faltan pistas`);
    assert.ok(Array.isArray(puzzle.rewardSummary) && puzzle.rewardSummary.length > 0);

    if (puzzle.type === 'multiple') {
      assert.equal(puzzle.answer.length, 2, `${puzzle.id}: se esperan exactamente 2 respuestas`);
      assert.equal(new Set(puzzle.answer).size, 2, `${puzzle.id}: respuestas repetidas`);
      assert.ok(puzzle.options.length > puzzle.answer.length, `${puzzle.id}: faltan distractores`);
      const optionIds = puzzle.options.map((option) => option.id);
      assert.equal(optionIds.length, new Set(optionIds).size, `${puzzle.id}: opciones duplicadas`);
      for (const answerId of puzzle.answer) {
        assert.ok(optionIds.includes(answerId), `${puzzle.id}: respuesta sin opción ${answerId}`);
      }
      for (const option of puzzle.options) {
        assert.ok(option.text?.length > 10, `${puzzle.id}/${option.id}: texto vacío`);
      }
    } else {
      assert.equal(puzzle.type, 'password', `${puzzle.id}: tipo desconocido`);
      assert.equal(puzzle.answer, '0847-2026');
      assert.ok(puzzle.password?.placeholder && puzzle.password?.help);
    }
  }

  assert.deepEqual(acertijos[0].answer, ['p1_hermano', 'p1_vpn']);
  assert.deepEqual(acertijos[2].answer, ['p3_rosario', 'p3_audit_trail']);
  assert.deepEqual(acertijos[0].requiresSolved, []);
  assert.deepEqual(acertijos[1].requiresSolved, ['p1_despedida']);
  assert.deepEqual(acertijos[2].requiresSolved, ['p2_auditoria']);
});

test('cada acertijo desbloquea exactamente lo que declara y nada queda huérfano', () => {
  for (const puzzle of acertijos) {
    const unlocks = puzzle.unlocks ?? {};
    for (const folderId of unlocks.folderIds ?? []) {
      const folder = carpetasPorId[folderId];
      assert.ok(folder, `${puzzle.id}: carpeta inexistente ${folderId}`);
      assert.equal(folder.lockedByPuzzleId, puzzle.id, `${folderId}: bloqueo cruzado`);
    }
    for (const documentId of unlocks.documentIds ?? []) {
      const doc = documentosPorId[documentId];
      assert.ok(doc, `${puzzle.id}: documento inexistente ${documentId}`);
      assert.equal(doc.lockedByPuzzleId, puzzle.id, `${documentId}: bloqueo cruzado`);
    }
    for (const evidenceId of unlocks.evidenceIds ?? []) {
      const evidence = evidenciasPorId[evidenceId];
      assert.ok(evidence, `${puzzle.id}: evidencia inexistente ${evidenceId}`);
      assert.equal(evidence.unlockedByPuzzleId, puzzle.id, `${evidenceId}: desbloqueo cruzado`);
    }
  }

  for (const folder of carpetas.filter((item) => item.lockedByPuzzleId)) {
    const puzzle = acertijosPorId[folder.lockedByPuzzleId];
    assert.ok(puzzle, `${folder.id}: acertijo inexistente`);
    assert.ok(puzzle.unlocks.folderIds.includes(folder.id), `${folder.id}: no figura en unlocks`);
    assert.equal(folder.lock?.puzzleId, puzzle.id, `${folder.id}: lock.puzzleId inconsistente`);
  }
  for (const doc of documentos.filter((item) => item.lockedByPuzzleId)) {
    const puzzle = acertijosPorId[doc.lockedByPuzzleId];
    assert.ok(puzzle, `${doc.id}: acertijo inexistente`);
    assert.ok(puzzle.unlocks.documentIds.includes(doc.id), `${doc.id}: no figura en unlocks`);
  }
  for (const evidence of evidencias.filter((item) => item.unlockedByPuzzleId)) {
    const puzzle = acertijosPorId[evidence.unlockedByPuzzleId];
    assert.ok(puzzle, `${evidence.id}: acertijo inexistente`);
    assert.ok(puzzle.unlocks.evidenceIds.includes(evidence.id), `${evidence.id}: no figura en unlocks`);
  }

  const chapterUnlocks = acertijos.filter((puzzle) => puzzle.unlocks?.chapterComplete);
  assert.equal(chapterUnlocks.length, 1);
  assert.equal(chapterUnlocks[0].id, 'p3_renuncia');
});

test('el canon del caso sostiene las tres deducciones', () => {
  const farewell = correosPorId.mail_006;
  const farewellText = [farewell.subject, ...farewell.body].join(' ');
  assert.equal(farewell.box, 'sent');
  assert.equal(farewell.date, resumenCaso.correoDespedida);
  assert.equal(farewell.from.email, 'a.morgan@borealsystems.com');
  assert.equal(farewell.to.length, 3);
  assert.match(farewellText, /hermano/i);
  assert.match(farewellText, /Villa Traful/i);
  assert.match(farewellText, /renuncia firmada/i);
  assert.match(farewellText, /Nos vemos en la costa/i);
  assert.ok(
    Date.parse(farewell.date) > Date.parse(capitulo1.fechaDesaparicion) + 6 * 60 * 60 * 1000,
    'el correo de despedida debe ser posterior a la salida de Alex'
  );

  const alex = personajesPorId.alex;
  assert.equal(alex.legajo, '0847');
  assert.match(alex.descripcion, /Hijo único/i);
  assert.ok(
    !personajes.some(
      (person) => /hermano/i.test(person.nombre) || /hermano/i.test(person.relacion)
    ),
    'no debe existir un hermano en el reparto'
  );

  const legajoText = docText(documentosPorId.doc_legajo);
  assert.match(legajoText, /Hijo único/i);
  assert.match(legajoText, /Sin hermanos registrados/i);

  const farewellMeta = docText(documentosPorId.doc_metadatos_despedida);
  assert.match(farewellMeta, /02:17:41/);
  assert.match(farewellMeta, /HR-02/);

  const renuncia = documentosPorId.doc_renuncia;
  assert.equal(renuncia.date, '2026-03-10T09:12:00-03:00');
  const renunciaText = docText(renuncia);
  assert.match(renunciaText, /l\.ortega/i);
  assert.match(renunciaText, /HR-SCAN-02/);
  assert.match(renunciaText, /No existe ninguna sesión de a\.morgan/i);

  const acta = documentosPorId.doc_acta_10_03;
  const actaText = docText(acta);
  assert.match(actaText, /Rosario/i);
  assert.match(actaText, /08:47/);
  assert.match(actaText, /10:30/);
  assert.match(actaText, /V-2291/);

  const movimientos = documentosPorId.doc_movimientos;
  const faroRows = movimientos.blocks
    .filter((block) => block.type === 'table')
    .flatMap((block) => block.rows)
    .filter((row) => row[1] === 'Faro Consulting SRL');
  assert.equal(faroRows.length, 3);
  const faroTotal = faroRows.reduce(
    (total, row) => total + Number(row[3].replace(/[^0-9]/g, '')),
    0
  );
  assert.equal(faroTotal, resumenCaso.montoDesviado);
});

test('la carpeta AUDITORIA_2026 está protegida y la clave se explica en los datos', () => {
  const folder = carpetasPorId.f_auditoria;
  assert.equal(folder.lockedByPuzzleId, 'p2_auditoria');
  assert.equal(folder.lock.type, 'password');
  assert.equal(folder.lock.puzzleId, 'p2_auditoria');

  const policyText = docText(documentosPorId.doc_politica);
  assert.match(policyText, /número de legajo/i);
  assert.match(policyText, /año fiscal/i);
  assert.match(policyText, /guion/i);

  const credencialText = docText(documentosPorId.doc_legajo);
  assert.match(credencialText, /0847/);
});
