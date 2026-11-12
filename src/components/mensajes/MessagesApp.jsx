import { useEffect, useMemo, useRef, useState } from 'react';
import { toSet } from '../../lib/collections.js';
import { formatLongDay, formatShortDate, formatTime, initials } from '../../lib/format.js';
import { personajesPorId } from '../../data/personajes.js';
import EmptyState from '../ui/EmptyState.jsx';
import Icon from '../ui/Icon.jsx';
import PanelShell from '../ui/PanelShell.jsx';
import './MessagesApp.css';

function lastPreview(conversation) {
  const last = conversation.messages[conversation.messages.length - 1];
  if (!last) return '';
  if (last.kind === 'file') return `Archivo: ${last.fileName}`;
  return last.text;
}

/**
 * Pantalla de Mensajes.
 * Props: conversations, readConversationIds, onOpenConversation(id),
 * selfId (por defecto 'alex'), title, subtitle, actions.
 */
export default function MessagesApp({
  conversations,
  readConversationIds = [],
  onOpenConversation,
  initialConversationId,
  selfId = 'alex',
  title = 'Mensajes del caso',
  subtitle = 'Conversaciones recuperadas del teléfono de Alex Morgan.',
  actions,
}) {
  const readSet = useMemo(() => toSet(readConversationIds), [readConversationIds]);

  const [selectedId, setSelectedId] = useState(initialConversationId ?? null);
  const [query, setQuery] = useState('');
  const threadRef = useRef(null);

  useEffect(() => {
    if (!initialConversationId) return;
    setSelectedId(initialConversationId);
    onOpenConversation?.(initialConversationId);
  }, [initialConversationId, onOpenConversation]);

  const sortedConversations = useMemo(
    () =>
      [...conversations].sort(
        (a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt)
      ),
    [conversations]
  );

  const visibleConversations = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return sortedConversations;
    return sortedConversations.filter((conversation) =>
      [
        conversation.contactName,
        conversation.contactRole,
        ...conversation.messages.map((message) => message.text ?? message.fileName ?? ''),
      ]
        .join(' ')
        .toLowerCase()
        .includes(normalized)
    );
  }, [query, sortedConversations]);

  const selectedConversation =
    conversations.find((conversation) => conversation.id === selectedId) ?? null;

  useEffect(() => {
    if (!threadRef.current) return;
    threadRef.current.scrollTop = threadRef.current.scrollHeight;
  }, [selectedId]);

  function openConversation(conversationId) {
    setSelectedId(conversationId);
    onOpenConversation?.(conversationId);
  }

  function authorName(authorId) {
    const person = personajesPorId[authorId];
    if (person) return person.nombre;
    return authorId === selfId ? 'Alex Morgan' : 'Contacto';
  }

  return (
    <PanelShell
      eyebrow="Investigación · Mensajes"
      title={title}
      subtitle={subtitle}
      actions={actions}
      toolbar={
        <div className="case-msg__toolbar">
          <label className="case-search">
            <Icon name="search" size={15} />
            <span className="case-sr-only">Buscar conversaciones</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar contacto o mensaje…"
            />
          </label>
          <span className="case-msg__count">
            {conversations.length} conversaciones ·{' '}
            {conversations.reduce((total, chat) => total + chat.messages.length, 0)} mensajes
          </span>
        </div>
      }
    >
      <div className="case-msg">
        <div className="case-msg__grid">
          <div className="case-msg__list" aria-label="Conversaciones">
            {visibleConversations.length === 0 ? (
              <EmptyState
                icon="chat"
                title="Sin resultados"
                description="Probá con otro nombre o palabra."
              />
            ) : (
              visibleConversations.map((conversation) => {
                const isRead = readSet.has(conversation.id);
                const isActive = conversation.id === selectedId;
                return (
                  <button
                    type="button"
                    key={conversation.id}
                    className={`case-chat-row ${isActive ? 'is-active' : ''} ${
                      isRead ? '' : 'is-unread'
                    }`.trim()}
                    onClick={() => openConversation(conversation.id)}
                    aria-current={isActive ? 'true' : undefined}
                  >
                    <span className="case-chat-row__avatar" aria-hidden="true">
                      {initials(conversation.contactName)}
                    </span>
                    <span className="case-chat-row__body">
                      <span className="case-chat-row__top">
                        <span className="case-chat-row__name">{conversation.contactName}</span>
                        <span className="case-chat-row__date">
                          {formatShortDate(conversation.lastMessageAt)}
                        </span>
                      </span>
                      <span className="case-chat-row__role">{conversation.contactRole}</span>
                      <span className="case-chat-row__preview">{lastPreview(conversation)}</span>
                    </span>
                    {isRead ? null : <span className="case-chat-row__dot" aria-label="Sin leer" />}
                  </button>
                );
              })
            )}
          </div>

          <div className="case-msg__viewer">
            {selectedConversation ? (
              <article className="case-msg__thread-wrap" aria-label={`Conversación con ${selectedConversation.contactName}`}>
                <header className="case-msg__head">
                  <span className="case-msg__avatar" aria-hidden="true">
                    {initials(selectedConversation.contactName)}
                  </span>
                  <div className="case-msg__head-body">
                    <h3>{selectedConversation.contactName}</h3>
                    <p>
                      {selectedConversation.contactRole} · {selectedConversation.platform}
                    </p>
                  </div>
                  <span className="case-msg__end">{selectedConversation.messages.length} mensajes</span>
                </header>

                <div className="case-msg__thread" ref={threadRef}>
                  {selectedConversation.messages.map((message, index) => {
                    const previous = selectedConversation.messages[index - 1];
                    const showDay =
                      !previous || formatShortDate(previous.at) !== formatShortDate(message.at);
                    const isSelf = message.authorId === selfId;

                    return (
                      <div key={message.id}>
                        {showDay ? (
                          <div className="case-msg__day">
                            <span>{formatLongDay(message.at)}</span>
                          </div>
                        ) : null}
                        <div className={`case-bubble-row ${isSelf ? 'is-self' : 'is-other'}`}>
                          <div className={`case-bubble ${isSelf ? 'is-self' : 'is-other'}`}>
                            {!isSelf ? (
                              <p className="case-bubble__author">{authorName(message.authorId)}</p>
                            ) : null}
                            {message.kind === 'file' ? (
                              <span className="case-bubble__file">
                                <Icon name="file" size={16} />
                                <span>
                                  <strong>{message.fileName}</strong>
                                  {message.caption ? <small>{message.caption}</small> : null}
                                </span>
                              </span>
                            ) : message.kind === 'image' && message.image ? (
                              <figure className="case-bubble__image">
                                <img src={message.image} alt={message.caption ?? 'Imagen adjunta'} />
                                {message.caption ? <figcaption>{message.caption}</figcaption> : null}
                              </figure>
                            ) : (
                              <p className="case-bubble__text">{message.text}</p>
                            )}
                            <span className="case-bubble__time">{formatTime(message.at)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </article>
            ) : (
              <EmptyState
                icon="chat"
                title="Elegí una conversación"
                description="Hay 3 conversaciones recuperadas: Valeria, Tomás y Laura. Cada una aporta una pieza distinta del caso."
              />
            )}
          </div>
        </div>
      </div>
    </PanelShell>
  );
}
