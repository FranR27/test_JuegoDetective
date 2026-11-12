import { useState } from 'react'
import Button from '../../components/ui/Button.jsx'
import { getEmails } from '../../services/gameData.js'

export default function MailApp() {
  const emails = getEmails()
  const [openId, setOpenId] = useState(null)
  const [readIds, setReadIds] = useState(() => new Set())

  const openEmail = emails.find((email) => email.id === openId) ?? null

  const open = (id) => {
    setOpenId(id)
    setReadIds((current) => new Set(current).add(id))
  }

  if (openEmail) {
    return (
      <div className="app">
        <div className="app__toolbar">
          <Button size="small" onClick={() => setOpenId(null)}>
            &larr; Volver a la bandeja
          </Button>
        </div>
        <article className="app__body">
          <h3 className="mail-subject">{openEmail.subject}</h3>
          <p className="item__meta">De: {openEmail.from}</p>
          <p className="item__meta">Fecha: {openEmail.date}</p>
          <pre className="doc">{openEmail.body}</pre>
        </article>
      </div>
    )
  }

  const unread = emails.filter((email) => !readIds.has(email.id)).length

  return (
    <div className="app">
      <div className="app__toolbar">
        <strong>Bandeja de entrada</strong>
        <span className="item__meta">{unread} sin leer</span>
      </div>
      <ul className="app__body item-list">
        {emails.map((email) => (
          <li key={email.id}>
            <button
              type="button"
              className={`item${readIds.has(email.id) ? '' : ' item--unread'}`}
              onClick={() => open(email.id)}
            >
              <span className="item__title">{email.subject}</span>
              <span className="item__meta">
                {email.from} &middot; {email.date}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
