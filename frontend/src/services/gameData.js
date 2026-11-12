/**
 * Única puerta de entrada a los datos del juego.
 *
 * Hoy devuelve datos locales (carpeta src/data). Cuando exista la API
 * (Integrante 3), los reemplazos se hacen ACÁ: estas funciones pasarán a
 * pedir los datos al backend (por ejemplo con fetch) y las apps seguirán
 * consumiéndolas igual, sin importar archivos de src/data directamente.
 */
import { folders } from '../data/files.js'
import { emails } from '../data/emails.js'
import { contacts } from '../data/conversations.js'
import { notes } from '../data/notes.js'
import { evidenceSamples } from '../data/evidenceSamples.js'

export const getFolders = () => folders
export const getEmails = () => emails
export const getContacts = () => contacts
export const getNotes = () => notes
export const getEvidenceSamples = () => evidenceSamples
