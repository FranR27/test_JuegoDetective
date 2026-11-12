import GameProvider from './game/GameProvider.jsx'
import { useGame } from './game/useGame.js'
import WelcomePage from './pages/WelcomePage.jsx'
import DesktopPage from './pages/DesktopPage.jsx'

// Para agregar una pantalla nueva: registrarla acá y usar su clave en GameProvider.
const SCREENS = {
  welcome: WelcomePage,
  desktop: DesktopPage,
}

function ScreenRouter() {
  const { screen } = useGame()
  const Screen = SCREENS[screen]
  return <Screen />
}

export default function App() {
  return (
    <GameProvider>
      <ScreenRouter />
    </GameProvider>
  )
}
