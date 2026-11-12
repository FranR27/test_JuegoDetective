import { getApp } from '../../game/apps.js'
import DesktopIcon from './DesktopIcon.jsx'
import Window from './Window.jsx'

export default function Desktop({ apps, manager }) {
  const { windows, activeAppId, openApp, closeApp, minimizeApp, focusApp } = manager
  const openIds = new Set(windows.map((win) => win.appId))

  return (
    <main className="desktop" aria-label="Escritorio">
      <ul className="desktop__icons">
        {apps.map((app) => (
          <li key={app.id}>
            <DesktopIcon app={app} isOpen={openIds.has(app.id)} onOpen={openApp} />
          </li>
        ))}
      </ul>

      {/* Las ventanas minimizadas siguen montadas (ocultas) para conservar su estado. */}
      {windows.map((win) => {
        const app = getApp(win.appId)
        const AppComponent = app.component
        return (
          <Window
            key={win.appId}
            title={app.title}
            slot={win.slot}
            zIndex={win.z}
            active={win.appId === activeAppId}
            minimized={win.minimized}
            onFocus={() => focusApp(win.appId)}
            onMinimize={() => minimizeApp(win.appId)}
            onClose={() => closeApp(win.appId)}
          >
            <AppComponent />
          </Window>
        )
      })}
    </main>
  )
}
