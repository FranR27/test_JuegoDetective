export default function FileViewer({ file }) {
  return (
    <article className="viewer">
      <h3 className="viewer__name">{file.name}</h3>
      {file.kind === 'image' && (
        <div className="viewer__placeholder" role="img" aria-label="Vista previa no disponible">
          Vista previa no disponible
        </div>
      )}
      <pre className="doc">{file.content}</pre>
    </article>
  )
}
