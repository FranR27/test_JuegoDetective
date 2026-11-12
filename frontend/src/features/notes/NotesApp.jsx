import { useState } from 'react'
import Button from '../../components/ui/Button.jsx'
import { getNotes } from '../../services/gameData.js'

export default function NotesApp() {
  const notes = getNotes()
  const [noteId, setNoteId] = useState(null)
  const note = notes.find((n) => n.id === noteId) ?? null

  if (note) {
    return (
      <div className="app">
        <div className="app__toolbar">
          <Button size="small" onClick={() => setNoteId(null)}>
            &larr; Volver a las notas
          </Button>
        </div>
        <article className="app__body">
          <h3 className="mail-subject">{note.title}</h3>
          <p className="item__meta">{note.date}</p>
          <pre className="doc">{note.content}</pre>
        </article>
      </div>
    )
  }

  return (
    <div className="app">
      <div className="app__toolbar">
        <strong>Notas de Alex</strong>
      </div>
      <ul className="app__body item-list">
        {notes.map((n) => (
          <li key={n.id}>
            <button type="button" className="item" onClick={() => setNoteId(n.id)}>
              <span className="item__title">{n.title}</span>
              <span className="item__meta">{n.date}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
