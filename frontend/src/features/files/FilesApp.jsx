import { useState } from 'react'
import Button from '../../components/ui/Button.jsx'
import { getFolders } from '../../services/gameData.js'
import FileViewer from './FileViewer.jsx'
import './files.css'

export default function FilesApp() {
  const folders = getFolders()
  const [folderId, setFolderId] = useState(null)
  const [fileId, setFileId] = useState(null)

  const folder = folders.find((f) => f.id === folderId) ?? null
  const file = folder?.files.find((f) => f.id === fileId) ?? null

  const goRoot = () => {
    setFolderId(null)
    setFileId(null)
  }
  const goFolder = () => setFileId(null)
  const goBack = () => (file ? goFolder() : goRoot())

  const crumbs = [
    { label: 'Archivos', onClick: goRoot, current: !folder },
    folder && { label: folder.name, onClick: goFolder, current: !file },
    file && { label: file.name, current: true },
  ].filter(Boolean)

  return (
    <div className="app">
      <nav className="app__toolbar" aria-label="Ruta">
        <Button size="small" onClick={goBack} disabled={!folder}>
          &larr; Volver
        </Button>
        <ol className="breadcrumb">
          {crumbs.map((crumb) => (
            <li key={crumb.label}>
              {crumb.current ? (
                <span aria-current="page">{crumb.label}</span>
              ) : (
                <button type="button" className="breadcrumb__link" onClick={crumb.onClick}>
                  {crumb.label}
                </button>
              )}
            </li>
          ))}
        </ol>
      </nav>

      <div className="app__body">
        {!folder && (
          <ul className="folder-grid">
            {folders.map((f) => (
              <li key={f.id}>
                <button type="button" className="folder-card" onClick={() => setFolderId(f.id)}>
                  <span className="folder-card__glyph" aria-hidden="true">
                    [ ]
                  </span>
                  <span className="folder-card__name">{f.name}</span>
                  <span className="folder-card__meta">{f.files.length} archivos</span>
                </button>
              </li>
            ))}
          </ul>
        )}

        {folder && !file && (
          <ul className="item-list">
            {folder.files.map((f) => (
              <li key={f.id}>
                <button type="button" className="item" onClick={() => setFileId(f.id)}>
                  <span className="item__title">{f.name}</span>
                  <span className="item__meta">{f.kind === 'image' ? 'Imagen' : 'Texto'}</span>
                </button>
              </li>
            ))}
          </ul>
        )}

        {file && <FileViewer file={file} />}
      </div>
    </div>
  )
}
