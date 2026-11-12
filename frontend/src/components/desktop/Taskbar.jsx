import { useState } from 'react'
import Clock from './Clock.jsx'

export default function Taskbar({ apps, items, onOpenApp, onToggle, onShowDesktop }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const openFromMenu = (appId) => {
    onOpenApp(appId)
    setMenuOpen(false)
  }

  return (
    <footer className="taskbar">
      {menuOpen && (
        <section className="start-menu" aria-label="Menú de aplicaciones">
          <div className="start-menu__header">
            <span className="start-menu__label">CASO 404 · SISTEMA RECUPERADO</span>
            <button type="button" className="start-menu__close" onClick={() => setMenuOpen(false)} aria-label="Cerrar menú">×</button>
          </div>
          <h2>Aplicaciones</h2>
          <div className="start-menu__grid">
            {apps.map((app) => (
              <button type="button" className="start-menu__app" key={app.id} onClick={() => openFromMenu(app.id)}>
                <span className="start-menu__app-icon" aria-hidden="true">{app.icon}</span>
                <span>{app.title}</span>
              </button>
            ))}
          </div>
          <p className="start-menu__foot">Entorno de análisis digital · Expediente 001</p>
        </section>
      )}

      <div className="taskbar__center">
        <button type="button" className={`taskbar__start${menuOpen ? ' taskbar__start--active' : ''}`} title="Inicio" aria-label="Abrir menú de inicio" aria-expanded={menuOpen} onClick={() => setMenuOpen(v => !v)}>
          <span className="win-mark" aria-hidden="true"><i /><i /><i /><i /></span>
        </button>
        <button type="button" className="taskbar__desktop" onClick={() => { setMenuOpen(false); onShowDesktop() }} disabled={items.every((item) => item.minimized)} title="Mostrar escritorio">▤ <span>Escritorio</span></button>
        <nav className="taskbar__items" aria-label="Ventanas abiertas">
          {items.map((item) => (
            <button key={item.appId} type="button" className={`taskbar__item${item.active ? ' taskbar__item--active' : ''}${item.minimized ? ' taskbar__item--minimized' : ''}`} aria-pressed={item.active} title={item.title} onClick={() => {setMenuOpen(false); onToggle(item.appId)}}>
              <span className="taskbar__item-icon" aria-hidden="true">{item.icon}</span>
              <span className="taskbar__item-label">{item.title}</span>
            </button>
          ))}
        </nav>
      </div>
      <div className="taskbar__right"><span className="taskbar__system-status" aria-label="Sistema disponible">●</span><Clock /></div>
    </footer>
  )
}
