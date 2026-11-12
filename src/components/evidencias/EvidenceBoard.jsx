import { useMemo, useState } from 'react';
import { TIPOS_EVIDENCIA } from '../../data/evidencias.js';
import { photoSrc } from '../../data/fotografias.js';
import { toSet } from '../../lib/collections.js';
import Badge from '../ui/Badge.jsx';
import EmptyState from '../ui/EmptyState.jsx';
import Icon from '../ui/Icon.jsx';
import PanelShell from '../ui/PanelShell.jsx';
import './EvidenceBoard.css';

const TYPE_ICON = {
  documento: 'file',
  digital: 'shield',
  testimonio: 'chat',
  fisica: 'evidence',
};

const SOURCE_LABEL = {
  photo: 'Ver fotografía',
  email: 'Ver correo',
  document: 'Ver documento',
  chat: 'Ver conversación',
};

const SOURCE_ICON = {
  photo: 'photo',
  email: 'mail',
  document: 'file',
  chat: 'chat',
};

/**
 * Pantalla de Evidencias.
 * Props: evidence, unlockedEvidenceIds, puzzleTitles (id -> título),
 * onOpenEvidence(id), title, subtitle, actions.
 */
export default function EvidenceBoard({
  evidence,
  photos = [],
  unlockedEvidenceIds,
  puzzleTitles = {},
  onOpenEvidence,
  onOpenSource,
  onOpenPhoto,
  title = 'Evidencias',
  subtitle = 'Cada evidencia desbloqueada queda registrada acá. Las bloqueadas no revelan su contenido.',
  actions,
}) {
  const unlockedSet = useMemo(() => toSet(unlockedEvidenceIds), [unlockedEvidenceIds]);

  const [filter, setFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(null);

  const foundCount = evidence.filter((item) => unlockedSet.has(item.id)).length;
  const lockedCount = evidence.length - foundCount;

  const visibleEvidence = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return evidence.filter((item) => {
      const isFound = unlockedSet.has(item.id);
      if (filter === 'found' && !isFound) return false;
      if (filter === 'locked' && isFound) return false;
      if (typeFilter !== 'all' && item.type !== typeFilter) return false;
      if (!normalized) return true;
      if (!isFound) return false;
      return [item.title, item.description, item.code, ...(item.tags ?? [])]
        .join(' ')
        .toLowerCase()
        .includes(normalized);
    });
  }, [evidence, filter, query, typeFilter, unlockedSet]);

  const selectedEvidence = evidence.find((item) => item.id === selectedId) ?? null;
  const selectedUnlocked = selectedEvidence ? unlockedSet.has(selectedEvidence.id) : false;
  const puzzleTitle = selectedEvidence?.unlockedByPuzzleId
    ? puzzleTitles[selectedEvidence.unlockedByPuzzleId] ?? 'un acertijo'
    : null;

  const unlockedPhotos = useMemo(
    () => photos.filter((photo) => photo.evidenceId && unlockedSet.has(photo.evidenceId)),
    [photos, unlockedSet]
  );

  function openEvidence(evidenceId) {
    setSelectedId(evidenceId);
    if (unlockedSet.has(evidenceId)) onOpenEvidence?.(evidenceId);
  }

  return (
    <PanelShell
      eyebrow="Investigación · Evidencias"
      title={title}
      subtitle={subtitle}
      actions={actions}
      toolbar={
        <div className="case-evidence__toolbar">
          <div className="case-segmented" role="group" aria-label="Filtro de evidencias">
            {[
              { id: 'all', label: 'Todas', count: evidence.length },
              { id: 'found', label: 'Encontradas', count: foundCount },
              { id: 'locked', label: 'Bloqueadas', count: lockedCount },
            ].map((option) => (
              <button
                type="button"
                key={option.id}
                className={`case-segmented__item ${filter === option.id ? 'is-active' : ''}`.trim()}
                onClick={() => setFilter(option.id)}
                aria-pressed={filter === option.id}
              >
                {option.label}
                <span className="case-segmented__count">{option.count}</span>
              </button>
            ))}
          </div>

          <label className="case-search">
            <Icon name="search" size={15} />
            <span className="case-sr-only">Buscar evidencias</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar evidencia…"
            />
          </label>

          <label className="case-check case-evidence__type">
            <span className="case-sr-only">Tipo de evidencia</span>
            <select
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value)}
              className="case-input case-evidence__select"
            >
              <option value="all">Todos los tipos</option>
              {Object.entries(TIPOS_EVIDENCIA).map(([value, label]) => (
                <option value={value} key={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        </div>
      }
    >
      <div className="case-evidence">
        <div className="case-evidence__grid">
          <div className="case-evidence__board">
            <div className="case-evidence__progress">
              <div className="case-evidence__progress-head">
                <span>
                  {foundCount} de {evidence.length} evidencias
                </span>
                <span>{Math.round((foundCount / evidence.length) * 100)}%</span>
              </div>
              <div className="case-progress" aria-hidden="true">
                <div
                  className="case-progress__bar"
                  style={{ width: `${(foundCount / evidence.length) * 100}%` }}
                />
              </div>
            </div>

            {unlockedPhotos.length ? (
              <div className="case-evidence__photos" aria-label="Fotografías habilitadas">
                <div className="case-evidence__photos-head">
                  <p className="case-overline">Fotografías del caso</p>
                  <Badge>{unlockedPhotos.length}</Badge>
                </div>
                <div className="case-evidence__photos-grid">
                  {unlockedPhotos.map((photo) => (
                    <button
                      type="button"
                      className="case-evidence-thumb"
                      key={photo.id}
                      onClick={() => onOpenPhoto?.(photo)}
                      title={photo.title}
                    >
                      <img src={photoSrc(photo.file)} alt={photo.title} loading="lazy" />
                      <span>{photo.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {visibleEvidence.length === 0 ? (
              <EmptyState
                icon="evidence"
                title="Sin evidencias con ese filtro"
                description="Cambiá el filtro o resolvé un acertijo para sumar piezas."
              />
            ) : (
              <div className="case-evidence__cards">
                {visibleEvidence.map((item) => {
                  const isFound = unlockedSet.has(item.id);
                  const isActive = item.id === selectedId;

                  return (
                    <button
                      type="button"
                      key={item.id}
                      className={[
                        'case-evidence-card',
                        isFound ? 'is-found' : 'is-locked',
                        isActive ? 'is-active' : '',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      onClick={() => openEvidence(item.id)}
                      aria-current={isActive ? 'true' : undefined}
                    >
                      <span className="case-evidence-card__top">
                        <span className="case-evidence-card__code">{item.code}</span>
                        {isFound ? (
                          <Badge tone="accent">{TIPOS_EVIDENCIA[item.type]}</Badge>
                        ) : (
                          <Icon name="lock" size={14} />
                        )}
                      </span>
                      <span className="case-evidence-card__icon">
                        <Icon name={isFound ? TYPE_ICON[item.type] : 'lock'} size={20} />
                      </span>
                      <span className="case-evidence-card__title">
                        {isFound ? item.title : 'Evidencia bloqueada'}
                      </span>
                      <span className="case-evidence-card__text">
                        {isFound
                          ? item.description
                          : 'Se obtiene al resolver un acertijo. Seguí la investigación.'}
                      </span>
                      {isFound ? (
                        <span className="case-evidence-card__foot">
                          <Icon name="pin" size={12} />
                          {item.source.label}
                        </span>
                      ) : (
                        <span className="case-evidence-card__foot is-locked">Sin datos</span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <aside className="case-evidence__detail" aria-label="Detalle de la evidencia">
            {selectedEvidence && selectedUnlocked ? (
              <article className="case-evidence-detail">
                <p className="case-overline">{selectedEvidence.code}</p>
                <h3 className="case-evidence-detail__title">{selectedEvidence.title}</h3>
                <div className="case-evidence-detail__badges">
                  <Badge tone="accent">{TIPOS_EVIDENCIA[selectedEvidence.type]}</Badge>
                  {selectedEvidence.tags?.map((tag) => (
                    <Badge key={tag}>{tag}</Badge>
                  ))}
                </div>

                <p className="case-evidence-detail__lead">{selectedEvidence.description}</p>
                <p className="case-evidence-detail__text">{selectedEvidence.detail}</p>

                <dl className="case-evidence-detail__meta">
                  <div>
                    <dt>Fuente</dt>
                    <dd>{selectedEvidence.source.label}</dd>
                  </div>
                  <div>
                    <dt>Obtenida</dt>
                    <dd>
                      {selectedEvidence.unlockedByPuzzleId
                        ? `Al resolver «${puzzleTitle}»`
                        : 'Disponible desde el inicio'}
                    </dd>
                  </div>
                </dl>

                {onOpenSource ? (
                  <div className="case-evidence-detail__actions">
                    <button
                      type="button"
                      className="case-btn case-btn--sm"
                      onClick={() => onOpenSource(selectedEvidence)}
                    >
                      <Icon
                        name={SOURCE_ICON[selectedEvidence.source.type] ?? 'search'}
                        size={14}
                      />
                      {SOURCE_LABEL[selectedEvidence.source.type] ?? 'Abrir fuente'}
                    </button>
                  </div>
                ) : null}

                {selectedEvidence.optionalClue ? (
                  <div className="case-evidence-detail__clue">
                    <p className="case-overline">Pista opcional</p>
                    <p>{selectedEvidence.optionalClue}</p>
                  </div>
                ) : null}
              </article>
            ) : selectedEvidence && !selectedUnlocked ? (
              <div className="case-evidence-detail case-evidence-detail--locked">
                <div className="case-evidence-detail__lock">
                  <Icon name="lock" size={26} />
                </div>
                <h3>Todavía no la encontraste</h3>
                <p>
                  Esta evidencia se desbloquea al resolver un acertijo. Revisá Archivos, Correo y
                  Mensajes: la respuesta está en los datos.
                </p>
                <button type="button" className="case-btn case-btn--ghost" onClick={() => setSelectedId(null)}>
                  Cerrar
                </button>
              </div>
            ) : (
              <div className="case-evidence-detail case-evidence-detail--idle">
                <p className="case-overline">Tablero de evidencias</p>
                <h3>CASO 404</h3>
                <p>
                  Cada pieza que encuentres queda acá. Las bloqueadas no muestran su título ni su
                  contenido: no queremos spoilear la investigación.
                </p>
                <div className="case-evidence-detail__summary">
                  <span>{foundCount}</span>
                  <p>evidencias encontradas de {evidence.length}</p>
                </div>
                <p className="case-evidence-detail__foot">
                  Las pistas opcionales aparecen al abrir una evidencia encontrada. No son
                  obligatorias.
                </p>
              </div>
            )}
          </aside>
        </div>
      </div>
    </PanelShell>
  );
}
