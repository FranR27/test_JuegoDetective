import { useState } from 'react';
import { respuestaLegible } from '../../data/acertijos.js';
import {
  getPuzzlePrerequisites,
  getPuzzleStatus,
  getUnlockSummary,
} from '../../features/investigation/puzzleEngine.js';
import Badge from '../ui/Badge.jsx';
import Icon from '../ui/Icon.jsx';
import PanelShell from '../ui/PanelShell.jsx';
import ChapterOutro from './ChapterOutro.jsx';
import './PuzzlePanel.css';

const STATUS = {
  available: { label: 'Disponible', tone: 'accent' },
  locked: { label: 'Bloqueado', tone: 'neutral' },
  solved: { label: 'Resuelto', tone: 'success' },
};

function PuzzleCard({
  puzzle,
  status,
  attempts,
  hintCount,
  onSubmit,
  onRequestHint,
  showSolutions,
}) {
  const [selected, setSelected] = useState([]);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [pending, setPending] = useState(false);

  const isPassword = puzzle.type === 'password';
  const expectedCount = isPassword ? 1 : puzzle.answer.length;
  const canSubmit = isPassword ? password.trim().length > 0 : selected.length === expectedCount;
  const prerequisites = getPuzzlePrerequisites(puzzle);
  const rewards = getUnlockSummary(puzzle);

  function toggleOption(optionId) {
    setSelected((current) => {
      if (current.includes(optionId)) return current.filter((id) => id !== optionId);
      if (current.length >= expectedCount) return current;
      return [...current, optionId];
    });
    setFeedback(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!onSubmit || !canSubmit || pending) return;
    setPending(true);
    try {
      const result = await onSubmit(puzzle.id, isPassword ? password : selected);
      setFeedback(result ?? null);
    } catch {
      setFeedback({
        ok: false,
        message: 'No se pudo validar la respuesta. Revisá la conexión e intentá de nuevo.',
      });
    } finally {
      setPending(false);
    }
  }

  function handleHint() {
    if (!onRequestHint) return;
    onRequestHint(puzzle.id);
  }

  return (
    <section className={`case-puzzle case-puzzle--${status}`} aria-label={puzzle.title}>
      <header className="case-puzzle__head">
        <span className="case-puzzle__order">{String(puzzle.order).padStart(2, '0')}</span>
        <div className="case-puzzle__heading">
          <p className="case-puzzle__subtitle">{puzzle.subtitle}</p>
          <h3 className="case-puzzle__title">{puzzle.title}</h3>
        </div>
        <Badge tone={STATUS[status].tone}>{STATUS[status].label}</Badge>
      </header>

      {status === 'locked' ? (
        <div className="case-puzzle__locked">
          <Icon name="lock" size={18} />
          <p>
            Se habilita al resolver{' '}
            <strong>{prerequisites.join(', ') || 'el acertijo anterior'}</strong>. Seguí la
            investigación en las otras pantallas.
          </p>
        </div>
      ) : (
        <>
          <p className="case-puzzle__question">{puzzle.question}</p>
          <p className="case-puzzle__instructions">{puzzle.instructions}</p>

          {puzzle.comparison ? (
            <div className="case-compare">
              <div className="case-compare__side">
                <p className="case-overline">{puzzle.comparison.left.subtitle}</p>
                <h4>{puzzle.comparison.left.title}</h4>
                <ul>
                  {puzzle.comparison.left.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="case-compare__vs" aria-hidden="true">
                vs
              </div>
              <div className="case-compare__side">
                <p className="case-overline">{puzzle.comparison.right.subtitle}</p>
                <h4>{puzzle.comparison.right.title}</h4>
                <ul>
                  {puzzle.comparison.right.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : null}

          {status === 'solved' ? (
            <div className="case-puzzle__solved">
              <Icon name="check" size={22} />
              <div>
                <strong>Acertijo resuelto</strong>
                <ul>
                  {puzzle.rewardSummary.map((reward) => (
                    <li key={reward}>{reward}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <form
              className="case-puzzle__form"
              onSubmit={handleSubmit}
              aria-busy={pending ? 'true' : undefined}
            >
              {isPassword ? (
                <div className="case-puzzle__password">
                  <label htmlFor={`puzzle-password-${puzzle.id}`}>Clave de la carpeta</label>
                  <div className="case-puzzle__password-row">
                    <input
                      id={`puzzle-password-${puzzle.id}`}
                      className="case-input"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(event) => {
                        setPassword(event.target.value);
                        setFeedback(null);
                      }}
                      placeholder={puzzle.password?.placeholder ?? 'Clave'}
                      maxLength={puzzle.password?.maxLength ?? 24}
                      autoComplete="off"
                      spellCheck="false"
                    />
                    <button
                      type="button"
                      className="case-btn case-btn--ghost case-btn--sm"
                      onClick={() => setShowPassword((value) => !value)}
                    >
                      {showPassword ? 'Ocultar' : 'Mostrar'}
                    </button>
                    <button type="submit" className="case-btn case-btn--primary" disabled={!canSubmit || pending}>
                      {pending ? 'Validando…' : 'Abrir carpeta'}
                    </button>
                  </div>
                  <p className="case-puzzle__help">{puzzle.password?.help}</p>
                </div>
              ) : (
                <fieldset className="case-puzzle__options">
                  <legend className="case-sr-only">{puzzle.question}</legend>
                  {puzzle.options.map((option) => {
                    const checked = selected.includes(option.id);
                    const atLimit = selected.length >= expectedCount && !checked;
                    return (
                      <label
                        className={`case-option ${checked ? 'is-checked' : ''} ${
                          atLimit ? 'is-disabled' : ''
                        }`.trim()}
                        key={option.id}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleOption(option.id)}
                          disabled={atLimit}
                        />
                        <span className="case-option__text">{option.text}</span>
                      </label>
                    );
                  })}
                </fieldset>
              )}

              <div className="case-puzzle__actions">
                {isPassword ? null : (
                  <button type="submit" className="case-btn case-btn--primary" disabled={!canSubmit || pending}>
                    {pending ? 'Validando…' : 'Confirmar deducción'}
                  </button>
                )}
                <span className="case-puzzle__counter">
                  {isPassword
                    ? `Intentos: ${attempts}`
                    : `${selected.length} de ${expectedCount} seleccionadas · Intentos: ${attempts}`}
                </span>
              </div>

              {feedback ? (
                <p
                  className={`case-puzzle__feedback ${
                    feedback.ok ? 'is-success' : 'is-error'
                  }`.trim()}
                  role="status"
                  aria-live="polite"
                >
                  <Icon name={feedback.ok ? 'check' : 'warning'} size={15} />
                  {feedback.message}
                </p>
              ) : null}
            </form>
          )}
        </>
      )}

      {status !== 'locked' ? (
        <div className="case-puzzle__hints">
          <div className="case-puzzle__hints-head">
            <p>
              <Icon name="bulb" size={14} /> Pistas opcionales · {hintCount}/{puzzle.hints.length}
            </p>
            {status === 'solved' ? null : (
              <button
                type="button"
                className="case-btn case-btn--ghost case-btn--sm"
                onClick={handleHint}
                disabled={!onRequestHint || hintCount >= puzzle.hints.length}
              >
                {hintCount >= puzzle.hints.length ? 'Sin más pistas' : 'Pedir pista'}
              </button>
            )}
          </div>
          {hintCount > 0 ? (
            <ol className="case-puzzle__hint-list">
              {puzzle.hints.slice(0, hintCount).map((hint) => (
                <li key={hint}>{hint}</li>
              ))}
            </ol>
          ) : (
            <p className="case-puzzle__help">
              Las pistas no son obligatorias. Si querés deducirlo solo, ignorá este bloque.
            </p>
          )}
        </div>
      ) : null}

      {showSolutions ? (
        <div className="case-puzzle__solution">
          <p className="case-overline">Solución · modo QA (no mostrar al jugador)</p>
          <code>{respuestaLegible(puzzle)}</code>
          {rewards.length ? (
            <p>{rewards.length} recompensas registradas en las reglas del acertijo.</p>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

/**
 * Panel de acertijos. Sirve para probar las reglas sin esperar al escritorio.
 * Props: puzzles, solvedPuzzleIds, attemptsByPuzzle, hintsByPuzzle,
 * onSubmit(id, answer), onRequestHint(id), showSolutions, progress.
 */
export default function PuzzlePanel({
  puzzles,
  solvedPuzzleIds = [],
  attemptsByPuzzle = {},
  hintsByPuzzle = {},
  onSubmit,
  onRequestHint,
  showSolutions = false,
  progress,
  title = 'Acertijos del capítulo',
  subtitle = 'Tres deducciones encadenadas. Cada una abre documentos y evidencias nuevas.',
  actions,
}) {
  const solvedSet = new Set(solvedPuzzleIds);
  const solvedCount = puzzles.filter((puzzle) => solvedSet.has(puzzle.id)).length;
  const allSolved = solvedCount === puzzles.length;

  return (
    <PanelShell
      eyebrow="Investigación · Acertijos"
      title={title}
      subtitle={subtitle}
      actions={actions}
      toolbar={
        <div className="case-puzzles__toolbar">
          <div className="case-puzzles__progress">
            <div className="case-puzzles__progress-head">
              <span>
                {solvedCount} de {puzzles.length} resueltos
              </span>
              <span>{Math.round((solvedCount / puzzles.length) * 100)}%</span>
            </div>
            <div className="case-progress" aria-hidden="true">
              <div
                className="case-progress__bar"
                style={{ width: `${(solvedCount / puzzles.length) * 100}%` }}
              />
            </div>
          </div>
          {showSolutions ? <Badge tone="danger">Modo QA activo</Badge> : null}
        </div>
      }
    >
      <div className="case-puzzles">
        <div className="case-puzzles__list">
          {puzzles.map((puzzle) => (
            <PuzzleCard
              key={puzzle.id}
              puzzle={puzzle}
              status={getPuzzleStatus(puzzle, solvedPuzzleIds)}
              attempts={attemptsByPuzzle[puzzle.id] ?? 0}
              hintCount={hintsByPuzzle[puzzle.id] ?? 0}
              onSubmit={onSubmit}
              onRequestHint={onRequestHint}
              showSolutions={showSolutions}
            />
          ))}
          {allSolved ? <ChapterOutro progress={progress} /> : null}
        </div>
      </div>
    </PanelShell>
  );
}
