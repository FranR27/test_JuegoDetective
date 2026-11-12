import FilesApp from '../features/files/FilesApp.jsx'
import MailApp from '../features/mail/MailApp.jsx'
import MessagesApp from '../features/messages/MessagesApp.jsx'
import NotesApp from '../features/notes/NotesApp.jsx'
import EvidenceApp from '../features/evidence/EvidenceApp.jsx'

/**
 * Registro de aplicaciones del escritorio.
 * Para sumar una app: crear su componente en features/<nombre>/ y agregar
 * una entrada acá. El escritorio, la barra de tareas y las ventanas la
 * toman automáticamente de esta lista.
 */
export const apps = [
  { id: 'files', title: 'Archivos', icon: 'AR', component: FilesApp },
  { id: 'mail', title: 'Correo', icon: 'CO', component: MailApp },
  { id: 'messages', title: 'Mensajes', icon: 'ME', component: MessagesApp },
  { id: 'notes', title: 'Notas', icon: 'NO', component: NotesApp },
  { id: 'evidence', title: 'Evidencias', icon: 'EV', component: EvidenceApp },
]

export function getApp(appId) {
  return apps.find((app) => app.id === appId)
}
