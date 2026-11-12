/**
 * Motor puro de los acertijos y de los desbloqueos.
 * No depende de React: se puede testear con Node y reutilizar en el backend.
 */
import {
  acertijos,
  acertijosPorId,
  carpetas,
  documentos,
  evidencias,
} from '../../data/index.js';

export function normalizeText(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();
}

/**
 * Normaliza la clave de una carpeta: ignora mayúsculas, acentos, espacios y
 * separadores. "0847-2026", "0847 2026" y "08472026" son equivalentes.
 */
export function normalizePassword(value) {
  return normalizeText(value).replace(/[^a-z0-9]/g, '');
}

export function isPuzzleAvailable(puzzle, solvedPuzzleIds = []) {
  if (!puzzle) return false;
  const solved = new Set(solvedPuzzleIds);
  return (puzzle.requiresSolved ?? []).every((id) => solved.has(id));
}

export function getPuzzleStatus(puzzle, solvedPuzzleIds = []) {
  if (!puzzle) return 'locked';
  if (solvedPuzzleIds.includes(puzzle.id)) return 'solved';
  return isPuzzleAvailable(puzzle, solvedPuzzleIds) ? 'available' : 'locked';
}

export function evaluatePuzzle(puzzle, answer) {
  if (!puzzle) return false;

  if (puzzle.type === 'password') {
    return normalizePassword(answer) === normalizePassword(puzzle.answer);
  }

  const given = Array.isArray(answer) ? [...new Set(answer)] : [];
  const expected = [...new Set(puzzle.answer)];
  if (given.length !== expected.length) return false;
  return expected.every((id) => given.includes(id));
}

/**
 * Contenido visible según los acertijos resueltos.
 * Se deriva de los `lockedByPuzzleId` / `unlockedByPuzzleId`, que son la fuente
 * de la verdad. Los arrays `unlocks` de cada acertijo se validan en los tests.
 */
export function getUnlockedContent(solvedPuzzleIds = []) {
  const solved = new Set(solvedPuzzleIds);

  const folderIds = new Set(
    carpetas
      .filter((folder) => !folder.lockedByPuzzleId || solved.has(folder.lockedByPuzzleId))
      .map((folder) => folder.id)
  );

  const documentIds = new Set(
    documentos
      .filter(
        (doc) =>
          folderIds.has(doc.folderId) &&
          (!doc.lockedByPuzzleId || solved.has(doc.lockedByPuzzleId))
      )
      .map((doc) => doc.id)
  );

  const evidenceIds = new Set(
    evidencias
      .filter(
        (evidence) =>
          !evidence.unlockedByPuzzleId || solved.has(evidence.unlockedByPuzzleId)
      )
      .map((evidence) => evidence.id)
  );

  return { folderIds, documentIds, evidenceIds };
}

export function getPuzzlePrerequisites(puzzle) {
  return (puzzle?.requiresSolved ?? [])
    .map((id) => acertijosPorId[id]?.title ?? id)
    .filter(Boolean);
}

export function getProgress(state) {
  const unlocked = getUnlockedContent(state?.solvedPuzzleIds ?? []);
  const solvedPuzzles = state?.solvedPuzzleIds?.length ?? 0;
  const totalEvidence = evidencias.length;
  const foundEvidence = unlocked.evidenceIds.size;

  return {
    solvedPuzzles,
    totalPuzzles: acertijos.length,
    foundEvidence,
    totalEvidence,
    percent: totalEvidence ? Math.round((foundEvidence / totalEvidence) * 100) : 0,
    chapterComplete: solvedPuzzles === acertijos.length,
  };
}

export function getUnlockSummary(puzzle) {
  if (!puzzle) return [];
  const summary = [];
  const { evidenceIds = [], documentIds = [], folderIds = [] } = puzzle.unlocks ?? {};

  for (const folderId of folderIds) {
    const folder = carpetas.find((item) => item.id === folderId);
    if (folder) summary.push(`Carpeta: ${folder.name}`);
  }
  for (const documentId of documentIds) {
    const doc = documentos.find((item) => item.id === documentId);
    if (doc) summary.push(`Documento: ${doc.title}`);
  }
  for (const evidenceId of evidenceIds) {
    const evidence = evidencias.find((item) => item.id === evidenceId);
    if (evidence) summary.push(`Evidencia: ${evidence.title}`);
  }

  return summary;
}

export { acertijos, acertijosPorId };
