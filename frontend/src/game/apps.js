import FilesApp from '../features/files/FilesApp.jsx'
import MailApp from '../features/mail/MailApp.jsx'
import MessagesApp from '../features/messages/MessagesApp.jsx'
import NotesApp from '../features/notes/NotesApp.jsx'
import EvidenceApp from '../features/evidence/EvidenceApp.jsx'

/** Registro de aplicaciones: una entrada por funcionalidad. */
export const apps = [
  { id: 'files', title: 'Archivos', icon: '▣', component: FilesApp },
  { id: 'mail', title: 'Correo', icon: '✉', component: MailApp },
  { id: 'messages', title: 'Mensajes', icon: '☏', component: MessagesApp },
  { id: 'notes', title: 'Notas', icon: '▤', component: NotesApp },
  { id: 'evidence', title: 'Evidencias', icon: '⌕', component: EvidenceApp },
]

export function getApp(appId) {
  return apps.find((app) => app.id === appId)
}
