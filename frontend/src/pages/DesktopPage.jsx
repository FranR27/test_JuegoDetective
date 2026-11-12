import Desktop from '../components/desktop/Desktop.jsx'
import Taskbar from '../components/desktop/Taskbar.jsx'
import { apps, getApp } from '../game/apps.js'
import { useWindowManager } from '../game/useWindowManager.js'
import '../styles/desktop.css'

export default function DesktopPage() {
  const manager = useWindowManager()
  const taskbarItems = manager.windows.map((win) => ({
    appId: win.appId,
    title: getApp(win.appId).title,
    icon: getApp(win.appId).icon,
    minimized: win.minimized,
    active: win.appId === manager.activeAppId,
  }))

  return (
    <div className="desktop-page">
      <Desktop apps={apps} manager={manager} />
      <Taskbar
        apps={apps}
        items={taskbarItems}
        onOpenApp={manager.openApp}
        onToggle={manager.toggleFromTaskbar}
        onShowDesktop={manager.showDesktop}
      />
    </div>
  )
}
