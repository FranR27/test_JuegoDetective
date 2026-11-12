import { useState } from 'react'
import Button from '../../components/ui/Button.jsx'
import EmptyState from '../../components/ui/EmptyState.jsx'
import { getContacts } from '../../services/gameData.js'
import './messages.css'

export default function MessagesApp() {
  const contacts = getContacts()
  const [contactId, setContactId] = useState(null)
  const contact = contacts.find((c) => c.id === contactId) ?? null

  return (
    <div className="messages" data-has-selection={contact ? 'true' : 'false'}>
      <ul className="messages__contacts item-list" aria-label="Contactos">
        {contacts.map((c) => (
          <li key={c.id}>
            <button
              type="button"
              className={`item${c.id === contactId ? ' item--selected' : ''}`}
              aria-pressed={c.id === contactId}
              onClick={() => setContactId(c.id)}
            >
              <span className="item__title">{c.name}</span>
              <span className="item__meta">{c.messages.length} mensajes</span>
            </button>
          </li>
        ))}
      </ul>

      <section className="messages__chat" aria-label="Conversación">
        {contact ? (
          <>
            <div className="app__toolbar">
              <Button
                size="small"
                className="messages__back"
                onClick={() => setContactId(null)}
              >
                &larr; Contactos
              </Button>
              <strong>{contact.name}</strong>
            </div>
            <ol className="messages__thread">
              {contact.messages.map((message) => (
                <li
                  key={message.id}
                  className={`bubble bubble--${message.from === 'me' ? 'me' : 'them'}`}
                >
                  <span>{message.text}</span>
                  <span className="bubble__time">{message.time}</span>
                </li>
              ))}
            </ol>
          </>
        ) : (
          <EmptyState title="Ninguna conversación abierta">
            Elegí un contacto de la lista.
          </EmptyState>
        )}
      </section>
    </div>
  )
}
