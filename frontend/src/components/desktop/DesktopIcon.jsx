export default function DesktopIcon({ app, isOpen, onOpen }) {
  return (
    <button
      type="button"
      className={`desktop-icon${isOpen ? ' desktop-icon--open' : ''}`}
      onClick={() => onOpen(app.id)}
    >
      <span className="desktop-icon__glyph" aria-hidden="true">
        {app.icon}
      </span>
      <span className="desktop-icon__label">{app.title}</span>
    </button>
  )
}
