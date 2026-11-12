import { getApp } from '../../game/apps.js'
import DesktopIcon from './DesktopIcon.jsx'
import Window from './Window.jsx'

export default function Desktop({ apps, manager }) {
  const { windows, activeAppId, openApp, closeApp, minimizeApp, focusApp } = manager
  const openIds = new Set(windows.map((win) => win.appId))

  return (
    <main className="desktop" aria-label="Escritorio">
      <div className="desktop__wallpaper" aria-hidden="true" />
      <div className="desktop__label" aria-hidden="true">CASO <span>404</span><small>LA ÚLTIMA CONEXIÓN</small></div>
      <ul className="desktop__icons">
        {apps.map((app) => <li key={app.id}><DesktopIcon app={app} isOpen={openIds.has(app.id)} onOpen={openApp} /></li>)}
      </ul>
      <aside className="desktop__status" aria-label="Estado del expediente">
        <p className="desktop__status-label">EXPEDIENTE 001 / ABIERTO</p>
        <h2 className="desktop__status-title">Alex Morgan</h2>
        <p className="desktop__status-copy">Revisá el material recuperado. La desaparición voluntaria aún no fue confirmada.</p>
      </aside>
      {windows.map((win) => {
        const app = getApp(win.appId)
        const AppComponent = app.component
        return (
          <Window key={win.appId} title={app.title} icon={app.icon} slot={win.slot} zIndex={win.z} active={win.appId === activeAppId} minimized={win.minimized} onFocus={() => focusApp(win.appId)} onMinimize={() => minimizeApp(win.appId)} onClose={() => closeApp(win.appId)}>
            <AppComponent />
          </Window>
        )
      })}
    </main>
  )
}
