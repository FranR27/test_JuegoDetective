import { useCallback, useMemo, useState } from 'react'
import { GameContext } from './gameContext.js'

/**
 * Estado global del juego (en memoria).
 * Hoy: pantalla actual y cuaderno de evidencias.
 * Más adelante (Integrante 3): acá se puede sincronizar con la API
 * (cargar partida, guardar progreso) sin tocar los componentes de UI.
 */
export default function GameProvider({ children }) {
  const [screen, setScreen] = useState('welcome')
  const [evidences, setEvidences] = useState([])

  const startInvestigation = useCallback(() => setScreen('desktop'), [])

  const addEvidence = useCallback((evidence) => {
    setEvidences((current) =>
      current.some((item) => item.id === evidence.id)
        ? current
        : [...current, { ...evidence, registeredAt: new Date().toISOString() }],
    )
  }, [])

  const clearEvidences = useCallback(() => setEvidences([]), [])

  const value = useMemo(
    () => ({ screen, startInvestigation, evidences, addEvidence, clearEvidences }),
    [screen, startInvestigation, evidences, addEvidence, clearEvidences],
  )

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}
