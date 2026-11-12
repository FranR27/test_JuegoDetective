import test from 'node:test';
import assert from 'node:assert/strict';
import { acertijos, acertijosPorId, evidencias } from '../src/data/index.js';
import {
  evaluatePuzzle,
  getProgress,
  getPuzzlePrerequisites,
  getPuzzleStatus,
  getUnlockSummary,
  getUnlockedContent,
  isPuzzleAvailable,
  normalizePassword,
} from '../src/features/investigation/puzzleEngine.js';

const P1 = acertijosPorId.p1_despedida;
const P2 = acertijosPorId.p2_auditoria;
const P3 = acertijosPorId.p3_renuncia;

test('P1 acepta las dos pruebas de la despedida en cualquier orden', () => {
  assert.equal(evaluatePuzzle(P1, ['p1_hermano', 'p1_vpn']), true);
  assert.equal(evaluatePuzzle(P1, ['p1_vpn', 'p1_hermano']), true);
  assert.equal(evaluatePuzzle(P1, ['p1_hermano', 'p1_hermano', 'p1_vpn']), true);
});

test('P1 rechaza una sola opción, opciones de más y distractores', () => {
  assert.equal(evaluatePuzzle(P1, ['p1_hermano']), false);
  assert.equal(evaluatePuzzle(P1, ['p1_hermano', 'p1_vpn', 'p1_costa']), false);
  assert.equal(evaluatePuzzle(P1, ['p1_hermano', 'p1_renuncia']), false);
  assert.equal(evaluatePuzzle(P1, []), false);
  assert.equal(evaluatePuzzle(P1, 'p1_hermano'), false);
});

test('P2 normaliza la clave: mayúsculas, espacios y separadores son equivalentes', () => {
  for (const answer of ['0847-2026', '08472026', ' 0847 2026 ', '0847/2026', '0847_2026']) {
    assert.equal(evaluatePuzzle(P2, answer), true, `debería aceptar "${answer}"`);
  }
  for (const answer of ['0847-2025', '08472025', '0847', '2026', '', '   ', '0000-2026']) {
    assert.equal(evaluatePuzzle(P2, answer), false, `no debería aceptar "${answer}"`);
  }
  assert.equal(normalizePassword(' 0847-2026 '), '08472026');
});

test('P3 acepta Rosario y el audit trail, y rechaza datos reales que no prueban nada', () => {
  assert.equal(evaluatePuzzle(P3, ['p3_rosario', 'p3_audit_trail']), true);
  assert.equal(evaluatePuzzle(P3, ['p3_audit_trail', 'p3_rosario']), true);
  assert.equal(evaluatePuzzle(P3, ['p3_rosario', 'p3_motivo']), false);
  assert.equal(evaluatePuzzle(P3, ['p3_firma', 'p3_audit_trail']), false);
  assert.equal(evaluatePuzzle(P3, ['p3_rosario']), false);
});

test('el orden de los acertijos es p1 -> p2 -> p3', () => {
  assert.equal(isPuzzleAvailable(P1, []), true);
  assert.equal(isPuzzleAvailable(P2, []), false);
  assert.equal(isPuzzleAvailable(P3, []), false);

  assert.equal(getPuzzleStatus(P1, []), 'available');
  assert.equal(getPuzzleStatus(P2, []), 'locked');
  assert.equal(getPuzzleStatus(P3, []), 'locked');

  assert.equal(getPuzzleStatus(P2, ['p1_despedida']), 'available');
  assert.equal(getPuzzleStatus(P3, ['p1_despedida']), 'locked');
  assert.equal(getPuzzleStatus(P3, ['p1_despedida', 'p2_auditoria']), 'available');
  assert.equal(getPuzzleStatus(P3, ['p1_despedida', 'p2_auditoria', 'p3_renuncia']), 'solved');

  assert.deepEqual(getPuzzlePrerequisites(P2), ['La despedida que no cierra']);
  assert.deepEqual(getPuzzlePrerequisites(P3), ['La carpeta AUDITORIA_2026']);
});

test('los desbloqueos se acumulan y coinciden con las reglas declaradas', () => {
  const initial = getUnlockedContent([]);
  assert.equal(initial.folderIds.size, 4);
  assert.equal(initial.documentIds.size, 8);
  assert.equal(initial.evidenceIds.size, 9);
  assert.equal(initial.folderIds.has('f_auditoria'), false);

  const afterP1 = getUnlockedContent(['p1_despedida']);
  assert.equal(afterP1.documentIds.size, 10);
  assert.equal(afterP1.evidenceIds.size, 12);
  assert.equal(afterP1.documentIds.has('doc_metadatos_despedida'), true);
  assert.equal(afterP1.documentIds.has('doc_nota_caja'), true);
  assert.equal(afterP1.evidenceIds.has('ev_declaracion_marta'), true);
  assert.equal(afterP1.folderIds.has('f_auditoria'), false);

  const afterP2 = getUnlockedContent(['p1_despedida', 'p2_auditoria']);
  assert.equal(afterP2.folderIds.size, 5);
  assert.equal(afterP2.folderIds.has('f_auditoria'), true);
  assert.equal(afterP2.documentIds.size, 14);
  assert.equal(afterP2.evidenceIds.size, 16);
  for (const id of ['doc_nota_preliminar', 'doc_movimientos', 'doc_correo_laura', 'doc_acta_12_03']) {
    assert.equal(afterP2.documentIds.has(id), true, `${id} debería estar disponible tras P2`);
  }

  const afterP3 = getUnlockedContent(['p1_despedida', 'p2_auditoria', 'p3_renuncia']);
  assert.equal(afterP3.documentIds.size, 15);
  assert.equal(afterP3.evidenceIds.size, evidencias.length);
  assert.equal(afterP3.documentIds.has('doc_conclusion'), true);
  for (const evidence of evidencias) {
    assert.equal(afterP3.evidenceIds.has(evidence.id), true, `${evidence.id} debería estar disponible`);
  }
});

test('el progreso refleja evidencias y acertijos resueltos', () => {
  const initial = getProgress({ solvedPuzzleIds: [] });
  assert.equal(initial.solvedPuzzles, 0);
  assert.equal(initial.totalPuzzles, 3);
  assert.equal(initial.foundEvidence, 9);
  assert.equal(initial.totalEvidence, 19);
  assert.equal(initial.percent, 47);
  assert.equal(initial.chapterComplete, false);

  const mid = getProgress({ solvedPuzzleIds: ['p1_despedida', 'p2_auditoria'] });
  assert.equal(mid.foundEvidence, 16);
  assert.equal(mid.percent, 84);
  assert.equal(mid.chapterComplete, false);

  const done = getProgress({
    solvedPuzzleIds: ['p1_despedida', 'p2_auditoria', 'p3_renuncia'],
  });
  assert.equal(done.foundEvidence, 19);
  assert.equal(done.percent, 100);
  assert.equal(done.chapterComplete, true);
});

test('el resumen de recompensas no muestra IDs crudos', () => {
  for (const puzzle of acertijos) {
    const summary = getUnlockSummary(puzzle);
    assert.ok(summary.length > 0, `${puzzle.id}: sin recompensas`);
    for (const line of summary) {
      assert.match(line, /^(Carpeta|Documento|Evidencia): /);
    }
  }
  assert.ok(getUnlockSummary(P2).some((line) => line.includes('AUDITORIA_2026')));
});

test('las pistas no revelan la respuesta literal', () => {
  for (const puzzle of acertijos) {
    const joined = puzzle.hints.join(' ').toLowerCase();
    if (puzzle.type === 'password') {
      assert.ok(!joined.includes('0847-2026'), 'la pista no debe contener la clave completa');
    } else {
      for (const answerId of puzzle.answer) {
        const option = puzzle.options.find((item) => item.id === answerId);
        assert.ok(
          !joined.includes(option.text.toLowerCase()),
          `${puzzle.id}: una pista copia la opción correcta`
        );
      }
    }
  }
});
