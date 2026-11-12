import { useEffect, useMemo, useRef, useState } from 'react';
import { toSet } from '../../lib/collections.js';
import { formatShortDate } from '../../lib/format.js';
import DocumentView from '../ui/DocumentView.jsx';
import EmptyState from '../ui/EmptyState.jsx';
import Icon from '../ui/Icon.jsx';
import PanelShell from '../ui/PanelShell.jsx';
import Badge from '../ui/Badge.jsx';
import './FileExplorer.css';

const KIND_LABEL = { pdf: 'PDF', txt: 'TXT', csv: 'CSV', img: 'IMG' };

/**
 * Pantalla de Archivos, data-driven.
 * Props:
 * - folders / documents: datos del caso (por defecto los del capítulo 1).
 * - unlockedFolderIds / unlockedDocumentIds: Sets o arrays con lo visible.
 * - readDocumentIds: para el punto de "no leído".
 * - onOpenDocument(id): marca como leído en el estado de la investigación.
 * - onUnlockFolder(folderId, password): valida la clave (hoy local; mañana backend).
 */
export default function FileExplorer({
  folders,
  documents,
  unlockedFolderIds,
  unlockedDocumentIds,
  readDocumentIds = [],
  onOpenDocument,
  onUnlockFolder,
  initialFolderId,
  initialDocumentId,
  title = 'Archivos del caso',
  subtitle = 'Carpetas y documentos recuperados. Los documentos bloqueados se abren al resolver acertijos.',
  actions,
}) {
  const folderSet = useMemo(() => toSet(unlockedFolderIds), [unlockedFolderIds]);
  const documentSet = useMemo(() => toSet(unlockedDocumentIds), [unlockedDocumentIds]);
  const readSet = useMemo(() => toSet(readDocumentIds), [readDocumentIds]);

  const firstAvailableFolder =
    initialFolderId ??
    folders.find((folder) => folderSet.has(folder.id))?.id ??
    folders[0]?.id;

  const [activeFolderId, setActiveFolderId] = useState(firstAvailableFolder);
  const [selectedDocumentId, setSelectedDocumentId] = useState(initialDocumentId ?? null);
  const [query, setQuery] = useState('');
  const [onlyUnread, setOnlyUnread] = useState(false);
  const [password, setPassword] = useState('');
  const [unlockError, setUnlockError] = useState('');
  const [unlocking, setUnlocking] = useState(false);
  const firstFolderRender = useRef(true);

  useEffect(() => {
    if (firstFolderRender.current) {
      firstFolderRender.current = false;
      return;
    }
    setSelectedDocumentId(null);
    setPassword('');
    setUnlockError('');
  }, [activeFolderId]);

  useEffect(() => {
    if (initialDocumentId) setSelectedDocumentId(initialDocumentId);
  }, [initialDocumentId]);

  useEffect(() => {
    if (selectedDocumentId && !documentSet.has(selectedDocumentId)) {
      setSelectedDocumentId(null);
    }
  }, [documentSet, selectedDocumentId]);

  const activeFolder =
    folders.find((folder) => folder.id === activeFolderId) ?? folders[0] ?? null;
  const folderUnlocked = activeFolder ? folderSet.has(activeFolder.id) : false;

  const folderDocuments = useMemo(
    () => (activeFolder ? documents.filter((doc) => doc.folderId === activeFolder.id) : []),
    [activeFolder, documents]
  );

  const unlockedDocuments = useMemo(
    () => folderDocuments.filter((doc) => documentSet.has(doc.id)),
    [folderDocuments, documentSet]
  );

  const lockedDocuments = useMemo(
    () => folderDocuments.filter((doc) => !documentSet.has(doc.id)),
    [folderDocuments, documentSet]
  );

  const visibleDocuments = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return unlockedDocuments.filter((doc) => {
      if (onlyUnread && readSet.has(doc.id)) return false;
      if (!normalizedQuery) return true;
      return [doc.title, doc.summary, doc.author, ...(doc.tags ?? [])]
        .join(' ')
        .toLowerCase()
        .includes(normalizedQuery);
    });
  }, [unlockedDocuments, onlyUnread, query, readSet]);

  const selectedDocument =
    unlockedDocuments.find((doc) => doc.id === selectedDocumentId) ?? null;

  function openDocument(documentId) {
    setSelectedDocumentId(documentId);
    onOpenDocument?.(documentId);
  }

  async function handleUnlock(event) {
    event.preventDefault();
    if (!activeFolder || !onUnlockFolder) return;

    setUnlocking(true);
    setUnlockError('');
    try {
      const result = await onUnlockFolder(activeFolder.id, password);
      if (result && result.ok === false) {
        setUnlockError(result.message ?? 'No se pudo abrir la carpeta.');
      } else {
        setPassword('');
        setSelectedDocumentId(null);
      }
    } catch {
      setUnlockError('No se pudo abrir la carpeta. Intentá de nuevo.');
    } finally {
      setUnlocking(false);
    }
  }

  const unreadCount = unlockedDocuments.filter((doc) => !readSet.has(doc.id)).length;

  return (
    <PanelShell
      eyebrow="Investigación · Archivos"
      title={title}
      subtitle={subtitle}
      actions={actions}
      toolbar={
        <div className="case-files__toolbar">
          <label className="case-search">
            <Icon name="search" size={15} />
            <span className="case-sr-only">Buscar documentos</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar por título, autor o etiqueta…"
            />
          </label>
          <label className="case-check">
            <input
              type="checkbox"
              checked={onlyUnread}
              onChange={(event) => setOnlyUnread(event.target.checked)}
            />
            Sin leer
          </label>
          <span className="case-files__count">
            {unlockedDocuments.length} documento{unlockedDocuments.length === 1 ? '' : 's'} ·{' '}
            {unreadCount} sin leer
          </span>
        </div>
      }
    >
      <div className="case-files">
        <div className="case-files__grid">
          <nav className="case-files__folders" aria-label="Carpetas del caso">
            <p className="case-files__label">Carpetas</p>
            {folders.map((folder) => {
              const isUnlocked = folderSet.has(folder.id);
              const total = documents.filter((doc) => doc.folderId === folder.id).length;
              const available = documents.filter(
                (doc) => doc.folderId === folder.id && documentSet.has(doc.id)
              ).length;
              const isActive = activeFolder?.id === folder.id;

              return (
                <button
                  type="button"
                  key={folder.id}
                  className={[
                    'case-folder',
                    isActive ? 'is-active' : '',
                    isUnlocked ? '' : 'is-locked',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => setActiveFolderId(folder.id)}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span className="case-folder__icon">
                    <Icon name={isUnlocked ? 'folder' : 'lock'} size={17} />
                  </span>
                  <span className="case-folder__body">
                    <span className="case-folder__name">{folder.name}</span>
                    <span className="case-folder__code">{folder.code}</span>
                  </span>
                  <span className="case-folder__count">
                    {isUnlocked ? `${available}/${total}` : '—'}
                  </span>
                </button>
              );
            })}
          </nav>

          {!folderUnlocked && activeFolder ? (
            <div className="case-files__locked">
              <div className="case-lock">
                <div className="case-lock__mark">
                  <Icon name="lock" size={30} />
                </div>
                <p className="case-lock__code">{activeFolder.code}</p>
                <h3 className="case-lock__title">{activeFolder.name}</h3>
                <p className="case-lock__text">
                  {activeFolder.lock?.label ?? 'Carpeta protegida'} · {activeFolder.description}
                </p>

                {activeFolder.lock?.type === 'password' ? (
                  <form className="case-lock__form" onSubmit={handleUnlock}>
                    <label htmlFor="case-folder-password">Clave de acceso</label>
                    <div className="case-lock__row">
                      <input
                        id="case-folder-password"
                        type="password"
                        autoComplete="off"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder={activeFolder.lock.placeholder ?? 'Clave'}
                        disabled={unlocking}
                      />
                      <button type="submit" className="case-btn case-btn--primary" disabled={unlocking}>
                        {unlocking ? 'Abriendo…' : 'Desbloquear'}
                      </button>
                    </div>
                    {unlockError ? (
                      <p className="case-lock__error" role="alert">
                        {unlockError}
                      </p>
                    ) : null}
                    <p className="case-lock__help">
                      El formato de la clave está en la política interna de auditoría. También podés
                      resolverlo desde el panel de acertijos.
                    </p>
                  </form>
                ) : (
                  <p className="case-lock__help">Esta carpeta se abre al resolver un acertijo.</p>
                )}
              </div>
            </div>
          ) : (
            <>
              <div className="case-files__list" aria-label={`Documentos de ${activeFolder?.name ?? ''}`}>
                <div className="case-files__list-head">
                  <p className="case-files__label">Documentos</p>
                  <Badge tone="neutral">{visibleDocuments.length}</Badge>
                </div>

                {visibleDocuments.length === 0 && lockedDocuments.length === 0 ? (
                  <EmptyState
                    icon="file"
                    title={query ? 'Sin resultados' : 'Carpeta vacía'}
                    description={
                      query
                        ? 'Probá con otra palabra o quitá el filtro de «Sin leer».'
                        : 'No hay documentos disponibles en esta carpeta.'
                    }
                  />
                ) : null}

                <div className="case-doc-list">
                  {visibleDocuments.map((doc) => {
                    const isRead = readSet.has(doc.id);
                    const isSelected = doc.id === selectedDocumentId;
                    return (
                      <button
                        type="button"
                        key={doc.id}
                        className={`case-doc-row ${isSelected ? 'is-active' : ''} ${
                          isRead ? '' : 'is-unread'
                        }`.trim()}
                        onClick={() => openDocument(doc.id)}
                        aria-current={isSelected ? 'true' : undefined}
                      >
                        <span className="case-doc-row__icon">
                          <Icon name={doc.kind === 'img' ? 'photo' : 'file'} size={16} />
                        </span>
                        <span className="case-doc-row__body">
                          <span className="case-doc-row__title">{doc.title}</span>
                          <span className="case-doc-row__meta">
                            {KIND_LABEL[doc.kind] ?? doc.kind} · {formatShortDate(doc.date)} ·{' '}
                            {doc.author}
                          </span>
                        </span>
                        {isRead ? null : <span className="case-doc-row__dot" aria-label="Sin leer" />}
                      </button>
                    );
                  })}

                  {query || onlyUnread
                    ? null
                    : lockedDocuments.map((doc) => (
                        <div className="case-doc-row is-locked" key={doc.id}>
                          <span className="case-doc-row__icon">
                            <Icon name="lock" size={15} />
                          </span>
                          <span className="case-doc-row__body">
                            <span className="case-doc-row__title">Documento bloqueado</span>
                            <span className="case-doc-row__meta">
                              Se habilita al resolver un acertijo
                            </span>
                          </span>
                        </div>
                      ))}
                </div>
              </div>

              <div className="case-files__viewer">
                <DocumentView document={selectedDocument} />
              </div>
            </>
          )}
        </div>
      </div>
    </PanelShell>
  );
}
