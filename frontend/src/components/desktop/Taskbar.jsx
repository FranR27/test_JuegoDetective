import Clock from './Clock.jsx'

export default function Taskbar({ items, onToggle, onShowDesktop }) {
  return (
    <footer className="taskbar">
      <button
        type="button"
        className="taskbar__desktop"
        onClick={onShowDesktop}
        disabled={items.every((item) => item.minimized)}
        title="Minimizar todas las ventanas"
      >
        Escritorio
      </button>

      <nav className="taskbar__items" aria-label="Ventanas abiertas">
        {items.map((item) => (
          <button
            key={item.appId}
            type="button"
            className={`taskbar__item${item.active ? ' taskbar__item--active' : ''}${
              item.minimized ? ' taskbar__item--minimized' : ''
            }`}
            aria-pressed={item.active}
            onClick={() => onToggle(item.appId)}
          >
            {item.title}
          </button>
        ))}
      </nav>

      <Clock />
    </footer>
  )
}
