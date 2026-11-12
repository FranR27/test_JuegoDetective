import { useEffect, useMemo, useState } from 'react';
import {
  acertijos,
  capitulo1,
  carpetas,
  carpetasPorId,
  conversaciones,
  correos,
  documentos,
  documentosPorId,
  evidencias,
  fotografias,
  fotografiasPorId,
  resumenCaso,
} from './data/index.js';
import { respuestaLegible } from './data/acertijos.js';
import { photoSrc } from './data/fotografias.js';
import { useInvestigation } from './features/investigation/useInvestigation.js';
import { apiDesdeEntorno } from './services/apiCapitulo1.js';
import { formatShortDate, formatTime } from './lib/format.js';
import Badge from './components/ui/Badge.jsx';
import DocumentView from './components/ui/DocumentView.jsx';
import Icon from './components/ui/Icon.jsx';
import FileExplorer from './components/archivos/FileExplorer.jsx';
import MailApp from './components/correo/MailApp.jsx';
import MessagesApp from './components/mensajes/MessagesApp.jsx';
import EvidenceBoard from './components/evidencias/EvidenceBoard.jsx';
import PuzzlePanel from './components/acertijos/PuzzlePanel.jsx';
import './App.css';

const TABS = [
  { id: 'archivos', label: 'Archivos', icon: 'folder' },
  { id: 'correo', label: 'Correo', icon: 'mail' },
  { id: 'mensajes', label: 'Mensajes', icon: 'chat' },
  { id: 'evidencias', label: 'Evidencias', icon: 'evidence' },
  { id: 'acertijos', label: 'Acertijos', icon: 'key' },
];

const PUZZLE_TITLES = Object.fromEntries(acertijos.map((puzzle) => [puzzle.id, puzzle.title]));

function Modal({ children, onClose, label, wide = false }) {
  useEffect(() => {
    function handleKey(event) {
      if (event.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div
      className="case-modal"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className={`case-modal__panel ${wide ? 'is-wide' : ''}`.trim()}
        role="dialog"
        aria-modal="true"
        aria-label={label}
      >
        <button type="button" className="case-modal__close" onClick={onClose} aria-label="Cerrar">
          <Icon name="close" size={18} />
        </button>
        {children}
      </div>
    </div>
  );
}

function PhotoModal({ photo, onClose }) {
  if (!photo) return null;

  return (
    <Modal onClose={onClose} label={photo.title} wide>
      <img className="case-photo" src={photoSrc(photo.file)} alt={photo.title} />
      <div className="case-photo__caption">
        <p className="case-overline">
          {formatShortDate(photo.date)} · {formatTime(photo.date)} · {photo.location}
        </p>
        <h3>{photo.title}</h3>
        <p>{photo.description}</p>
        {photo.tags?.length ? (
          <div className="case-photo__tags">
            {photo.tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
        ) : null}
      </div>
    </Modal>
  );
}

function AttachmentModal({ attachment, onClose }) {
  if (!attachment) return null;
  const { doc, unlocked } = attachment;

  return (
    <Modal onClose={onClose} label={`Adjunto ${doc.title}`} wide>
      {unlocked ? (
        <div className="case-modal__doc">
          <DocumentView document={doc} />
        </div>
      ) : (
        <div className="case-modal__locked">
          <span className="case-modal__locked-icon">
            <Icon name="lock" size={30} />
          </span>
          <p className="case-overline">Adjunto protegido</p>
          <h3>{doc.title}</h3>
          <p>
            Este adjunto forma parte de una evidencia que todavía no desbloqueaste. Resolvé el
            acertijo correspondiente y volvé a abrirlo desde el correo.
          </p>
          <button type="button" className="case-btn case-btn--ghost" onClick={onClose}>
            Cerrar
          </button>
        </div>
      )}
    </Modal>
  );
}

/**
 * Harness de demostración de la entrega del Integrante 2.
 * No es el escritorio del juego: sirve para montar y probar las cinco pantallas
 * reutilizables y el motor de acertijos sin Firestore.
 */
export default function App() {
  const api = useMemo(() => apiDesdeEntorno(), []);

  const {
    state,
    unlocked,
    progress,
    sync,
    submitPuzzle,
    requestHint,
    markDocumentRead,
    markEmailRead,
    markConversationRead,
    reset,
  } = useInvestigation({ api });

  const [tab, setTab] = useState('archivos');
  const [qaMode, setQaMode] = useState(false);
  const [mailFocus, setMailFocus] = useState(null);
  const [docFocus, setDocFocus] = useState(null);
  const [chatFocus, setChatFocus] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [attachment, setAttachment] = useState(null);

  const counters = useMemo(() => {
    const inboxUnread = correos.filter(
      (email) => email.box === 'inbox' && !state.readEmailIds.includes(email.id)
    ).length;
    const chatsUnread = conversaciones.filter(
      (conversation) => !state.readConversationIds.includes(conversation.id)
    ).length;

    return {
      archivos: `${unlocked.documentIds.size}/${documentos.length}`,
      correo: inboxUnread > 0 ? `${inboxUnread} sin leer` : `${correos.length} correos`,
      mensajes: chatsUnread > 0 ? `${chatsUnread} sin abrir` : `${conversaciones.length} chats`,
      evidencias: `${progress.foundEvidence}/${progress.totalEvidence}`,
      acertijos: `${progress.solvedPuzzles}/${progress.totalPuzzles}`,
    };
  }, [progress, state.readConversationIds, state.readEmailIds, unlocked.documentIds]);

  const focusedDoc = docFocus ? documentosPorId[docFocus] ?? null : null;

  const syncLabel =
    sync.status === 'conectado'
      ? `Backend conectado · partida ${sync.partidaId?.slice(0, 8)}`
      : sync.status === 'conectando'
        ? 'Conectando con el backend…'
        : sync.status === 'sin_conexion'
          ? 'Backend sin conexión · validación local'
          : 'Validación local';

  const syncTitle =
    sync.status === 'sin_conexion'
      ? `${sync.error ?? 'No se pudo conectar.'} El prototipo sigue funcionando en local.`
      : sync.status === 'conectado'
        ? `Contrato de ids: ${sync.contrato}. La partida se retoma desde localStorage.`
        : sync.status === 'conectando'
          ? 'Conectando con el backend configurado en VITE_API_URL.'
          : 'Definí VITE_API_URL para validar los acertijos en el backend.';

  function changeTab(nextTab) {
    setTab(nextTab);
    setMailFocus(null);
    setDocFocus(null);
    setChatFocus(null);
  }

  async function handleUnlockFolder(folderId, password) {
    const folder = carpetasPorId[folderId];
    const puzzleId = folder?.lock?.puzzleId;

    if (!puzzleId) {
      return { ok: false, message: 'Esta carpeta no tiene una clave asociada en el prototipo.' };
    }

    const result = await submitPuzzle(puzzleId, password);
    return {
      ok: result.ok,
      message: result.ok ? 'Carpeta desbloqueada.' : result.message,
    };
  }

  function handleOpenAttachment(attachmentData) {
    const doc = documentosPorId[attachmentData.ref];
    if (!doc) return;

    const isUnlocked = unlocked.documentIds.has(doc.id);
    if (isUnlocked) markDocumentRead(doc.id);
    setAttachment({ doc, unlocked: isUnlocked });
  }

  function handleOpenEvidenceSource(evidence) {
    const source = evidence?.source;
    if (!source) return;

    if (source.type === 'photo') {
      const found = fotografiasPorId[source.id];
      if (found) setPhoto(found);
      return;
    }
    if (source.type === 'email') {
      setMailFocus(source.id);
      setTab('correo');
      return;
    }
    if (source.type === 'document') {
      setDocFocus(source.id);
      setTab('archivos');
      return;
    }
    if (source.type === 'chat') {
      setChatFocus(source.id);
      setTab('mensajes');
    }
  }

  function handleReset() {
    const confirmed = window.confirm(
      '¿Reiniciar la investigación? Se borran los acertijos resueltos, las lecturas y las evidencias encontradas.'
    );
    if (!confirmed) return;
    reset();
    setPhoto(null);
    setAttachment(null);
    changeTab('archivos');
  }

  return (
    <div className="case-app case-ui">
      <header className="case-app__bar">
        <div className="case-app__brand">
          <span className="case-app__casename">{capitulo1.caso}</span>
          <div>
            <h1 className="case-app__title">{capitulo1.titulo}</h1>
            <p className="case-app__place">
              Capítulo {capitulo1.numero} · {capitulo1.lugar}
            </p>
          </div>
        </div>

        <div className="case-app__hud" aria-label="Datos del caso">
          <span>
            <Icon name="user" size={14} /> {resumenCaso.victima} · legajo {resumenCaso.legajo}
          </span>
          <span>
            <Icon name="clock" size={14} /> Última salida {formatShortDate(resumenCaso.ultimaSalida)} ·{' '}
            {formatTime(resumenCaso.ultimaSalida)}
          </span>
          <span>
            <Icon name="lock" size={14} /> {resumenCaso.carpetaBloqueada}
          </span>
        </div>

        <div className="case-app__actions">
          <button
            type="button"
            className={`case-btn case-btn--ghost case-btn--sm ${qaMode ? 'is-active' : ''}`.trim()}
            aria-pressed={qaMode}
            onClick={() => setQaMode((value) => !value)}
          >
            <Icon name="spark" size={14} />
            {qaMode ? 'QA activo' : 'Modo QA'}
          </button>
          <button type="button" className="case-btn case-btn--ghost case-btn--sm" onClick={handleReset}>
            <Icon name="reset" size={14} />
            Reiniciar
          </button>
        </div>
      </header>

      <div className="case-app__rail">
        <nav className="case-app__tabs" role="tablist" aria-label="Pantallas de investigación">
          {TABS.map((item) => {
            const active = tab === item.id;
            return (
              <button
                type="button"
                key={item.id}
                role="tab"
                aria-selected={active}
                className={`case-app__tab ${active ? 'is-active' : ''}`.trim()}
                onClick={() => changeTab(item.id)}
              >
                <Icon name={item.icon} size={16} />
                <span>{item.label}</span>
                <span className="case-app__tab-count">{counters[item.id]}</span>
              </button>
            );
          })}
        </nav>

        <div className="case-app__progress" aria-label="Progreso de la investigación">
          <span className="case-app__progress-label">
            {progress.chapterComplete ? (
              <>
                <Icon name="check" size={14} /> Capítulo completo
              </>
            ) : (
              <>
                <Icon name="shield" size={14} /> {progress.foundEvidence} de {progress.totalEvidence}{' '}
                evidencias
              </>
            )}
          </span>
          <div className="case-progress" aria-hidden="true">
            <div className="case-progress__bar" style={{ width: `${progress.percent}%` }} />
          </div>
          <span className="case-app__progress-value">{progress.percent}%</span>
        </div>
      </div>

      {qaMode ? (
        <aside className="case-app__qa" aria-label="Información de QA">
          <Badge tone="danger">Modo QA</Badge>
          <span>Soluciones visibles en Acertijos. Este modo es solo para revisión del equipo.</span>
          <details>
            <summary>Ver respuestas canónicas</summary>
            <ol>
              {acertijos.map((puzzle) => (
                <li key={puzzle.id}>
                  <strong>{puzzle.title}:</strong> {respuestaLegible(puzzle)}
                </li>
              ))}
            </ol>
          </details>
        </aside>
      ) : null}

      <main className="case-app__main">
        {tab === 'archivos' ? (
          <FileExplorer
            folders={carpetas}
            documents={documentos}
            unlockedFolderIds={unlocked.folderIds}
            unlockedDocumentIds={unlocked.documentIds}
            readDocumentIds={state.readDocumentIds}
            onOpenDocument={markDocumentRead}
            onUnlockFolder={handleUnlockFolder}
            initialFolderId={focusedDoc?.folderId}
            initialDocumentId={docFocus}
          />
        ) : null}

        {tab === 'correo' ? (
          <MailApp
            emails={correos}
            readEmailIds={state.readEmailIds}
            onOpenEmail={markEmailRead}
            onOpenAttachment={handleOpenAttachment}
            initialEmailId={mailFocus}
          />
        ) : null}

        {tab === 'mensajes' ? (
          <MessagesApp
            conversations={conversaciones}
            readConversationIds={state.readConversationIds}
            onOpenConversation={markConversationRead}
            initialConversationId={chatFocus}
          />
        ) : null}

        {tab === 'evidencias' ? (
          <EvidenceBoard
            evidence={evidencias}
            photos={fotografias}
            unlockedEvidenceIds={unlocked.evidenceIds}
            puzzleTitles={PUZZLE_TITLES}
            onOpenSource={handleOpenEvidenceSource}
            onOpenPhoto={setPhoto}
          />
        ) : null}

        {tab === 'acertijos' ? (
          <PuzzlePanel
            puzzles={acertijos}
            solvedPuzzleIds={state.solvedPuzzleIds}
            attemptsByPuzzle={state.attemptsByPuzzle}
            hintsByPuzzle={state.hintsByPuzzle}
            onSubmit={submitPuzzle}
            onRequestHint={requestHint}
            showSolutions={qaMode}
            progress={progress}
          />
        ) : null}
      </main>

      <footer className="case-app__foot">
        <span>
          Prototipo Integrante 2 · datos ficticios ·{' '}
          {sync.status === 'conectado'
            ? 'acertijos validados por el backend de Integrante 3.'
            : 'validación local de acertijos; el backend de Integrante 3 queda preparado.'}
        </span>
        <span className="case-app__sync" data-status={sync.status} title={syncTitle}>
          <span className="case-app__sync-dot" aria-hidden="true" />
          {syncLabel}
        </span>
        <span className="case-app__foot-version">{capitulo1.caso} · v0.1</span>
      </footer>

      <PhotoModal photo={photo} onClose={() => setPhoto(null)} />
      <AttachmentModal attachment={attachment} onClose={() => setAttachment(null)} />
    </div>
  );
}
