import { useMemo, useState } from 'react';
import { toSet } from '../../lib/collections.js';
import { formatDateTime, formatShortDate, formatTime, initials } from '../../lib/format.js';
import Badge from '../ui/Badge.jsx';
import EmptyState from '../ui/EmptyState.jsx';
import Icon from '../ui/Icon.jsx';
import PanelShell from '../ui/PanelShell.jsx';
import './MailApp.css';

const BOXES = [
  { id: 'inbox', label: 'Recibidos', icon: 'mail' },
  { id: 'sent', label: 'Enviados', icon: 'arrowRight' },
];

/**
 * Pantalla de Correo.
 * Props: emails, readEmailIds, onOpenEmail(id), onOpenAttachment(attachment),
 * initialEmailId, title, subtitle, actions.
 */
export default function MailApp({
  emails,
  readEmailIds = [],
  onOpenEmail,
  onOpenAttachment,
  initialEmailId,
  title = 'Correo del caso',
  subtitle = 'Bandeja de Alex Morgan. Acceso forense autorizado por Marta Morgan.',
  actions,
}) {
  const readSet = useMemo(() => toSet(readEmailIds), [readEmailIds]);

  const [box, setBox] = useState(
    emails.find((email) => email.id === initialEmailId)?.box ?? 'inbox'
  );
  const [selectedId, setSelectedId] = useState(initialEmailId ?? null);
  const [query, setQuery] = useState('');

  const sortedEmails = useMemo(
    () =>
      [...emails]
        .filter((email) => email.box === box)
        .sort((a, b) => new Date(b.date) - new Date(a.date)),
    [emails, box]
  );

  const visibleEmails = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return sortedEmails;
    return sortedEmails.filter((email) =>
      [
        email.subject,
        email.preview,
        email.from?.name,
        email.from?.email,
        ...(email.tags ?? []),
      ]
        .join(' ')
        .toLowerCase()
        .includes(normalized)
    );
  }, [query, sortedEmails]);

  const selectedEmail = emails.find((email) => email.id === selectedId) ?? null;

  function openEmail(emailId) {
    setSelectedId(emailId);
    onOpenEmail?.(emailId);
  }

  function changeBox(nextBox) {
    setBox(nextBox);
    if (selectedEmail && selectedEmail.box !== nextBox) {
      setSelectedId(null);
    }
  }

  const counts = {
    inbox: emails.filter((email) => email.box === 'inbox').length,
    sent: emails.filter((email) => email.box === 'sent').length,
  };

  return (
    <PanelShell
      eyebrow="Investigación · Correo"
      title={title}
      subtitle={subtitle}
      actions={actions}
      toolbar={
        <div className="case-mail__toolbar">
          <div className="case-segmented" role="tablist" aria-label="Bandejas">
            {BOXES.map((item) => {
              const unread = emails.filter(
                (email) => email.box === item.id && !readSet.has(email.id)
              ).length;
              return (
                <button
                  type="button"
                  key={item.id}
                  role="tab"
                  aria-selected={box === item.id}
                  className={`case-segmented__item ${box === item.id ? 'is-active' : ''}`.trim()}
                  onClick={() => changeBox(item.id)}
                >
                  <Icon name={item.icon} size={14} />
                  {item.label}
                  <span className="case-segmented__count">{counts[item.id]}</span>
                  {unread > 0 ? <span className="case-segmented__dot" aria-label={`${unread} sin leer`} /> : null}
                </button>
              );
            })}
          </div>
          <label className="case-search">
            <Icon name="search" size={15} />
            <span className="case-sr-only">Buscar correos</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar remitente o asunto…"
            />
          </label>
        </div>
      }
    >
      <div className="case-mail">
        <div className="case-mail__grid">
          <div className="case-mail__list" aria-label="Lista de correos">
            {visibleEmails.length === 0 ? (
              <EmptyState
                icon="mail"
                title={query ? 'Sin resultados' : 'Bandeja vacía'}
                description={
                  query
                    ? 'Probá con otro remitente o asunto.'
                    : 'No hay correos en esta bandeja.'
                }
              />
            ) : (
              visibleEmails.map((email) => {
                const isRead = readSet.has(email.id);
                const isActive = email.id === selectedId;
                return (
                  <button
                    type="button"
                    key={email.id}
                    className={`case-mail-row ${isActive ? 'is-active' : ''} ${
                      isRead ? '' : 'is-unread'
                    }`.trim()}
                    onClick={() => openEmail(email.id)}
                    aria-current={isActive ? 'true' : undefined}
                  >
                    <span className="case-mail-row__top">
                      <span className="case-mail-row__from">
                        {email.box === 'sent' ? `Para: ${email.to?.[0]?.name ?? '—'}` : email.from?.name}
                      </span>
                      <span className="case-mail-row__time">
                        {formatShortDate(email.date)} · {formatTime(email.date)}
                      </span>
                    </span>
                    <span className="case-mail-row__subject">{email.subject}</span>
                    <span className="case-mail-row__preview">{email.preview}</span>
                    <span className="case-mail-row__foot">
                      {email.attachments?.length ? (
                        <span className="case-mail-row__clip">
                          <Icon name="file" size={12} /> {email.attachments.length}
                        </span>
                      ) : null}
                      {isRead ? null : <span className="case-mail-row__dot" aria-label="Sin leer" />}
                    </span>
                  </button>
                );
              })
            )}
          </div>

          <div className="case-mail__viewer">
            {selectedEmail ? (
              <article className="case-mail__message" aria-label={selectedEmail.subject}>
                <header className="case-mail__head">
                  <p className="case-overline">
                    {selectedEmail.box === 'sent' ? 'Enviado' : 'Recibido'} ·{' '}
                    {formatDateTime(selectedEmail.date)}
                  </p>
                  <h3 className="case-mail__subject">{selectedEmail.subject}</h3>

                  <div className="case-mail__people">
                    <span className="case-mail__avatar" aria-hidden="true">
                      {initials(selectedEmail.from?.name)}
                    </span>
                    <div className="case-mail__people-body">
                      <strong>{selectedEmail.from?.name}</strong>
                      <span>{selectedEmail.from?.email}</span>
                    </div>
                  </div>

                  <dl className="case-mail__meta">
                    <div>
                      <dt>Para</dt>
                      <dd>{selectedEmail.to?.map((person) => person.email).join(', ')}</dd>
                    </div>
                    <div>
                      <dt>Fecha</dt>
                      <dd>{formatDateTime(selectedEmail.date)}</dd>
                    </div>
                  </dl>

                  <div className="case-mail__tags">
                    {selectedEmail.tags?.map((tag) => (
                      <Badge key={tag}>{tag}</Badge>
                    ))}
                  </div>
                </header>

                <div className="case-mail__body">
                  {selectedEmail.body.map((paragraph, index) => (
                    <p key={`${selectedEmail.id}-p-${index}`}>{paragraph}</p>
                  ))}
                </div>

                {selectedEmail.attachments?.length ? (
                  <footer className="case-mail__attachments">
                    <p className="case-overline">Adjuntos</p>
                    <div className="case-mail__attachment-list">
                      {selectedEmail.attachments.map((attachment) => {
                        const content = (
                          <>
                            <Icon name="file" size={14} />
                            <span>{attachment.name}</span>
                            <span className="case-mail__attachment-kind">{attachment.kind}</span>
                          </>
                        );
                        return onOpenAttachment ? (
                          <button
                            type="button"
                            key={attachment.name}
                            className="case-attachment"
                            onClick={() => onOpenAttachment(attachment)}
                          >
                            {content}
                          </button>
                        ) : (
                          <span className="case-attachment" key={attachment.name}>
                            {content}
                          </span>
                        );
                      })}
                    </div>
                  </footer>
                ) : null}
              </article>
            ) : (
              <EmptyState
                icon="mail"
                title="Elegí un correo"
                description="La bandeja conserva los 5 correos recibidos y el correo de despedida que salió de la cuenta de Alex el sábado a las 02:17."
              />
            )}
          </div>
        </div>
      </div>
    </PanelShell>
  );
}
