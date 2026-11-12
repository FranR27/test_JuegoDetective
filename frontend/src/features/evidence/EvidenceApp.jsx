import Button from '../../components/ui/Button.jsx'
import EmptyState from '../../components/ui/EmptyState.jsx'
import { useGame } from '../../game/useGame.js'
import { getEvidenceSamples } from '../../services/gameData.js'

const timeFormat = new Intl.DateTimeFormat('es-AR', { hour: '2-digit', minute: '2-digit' })

export default function EvidenceApp() {
  const { evidences, addEvidence, clearEvidences } = useGame()

  // Acción de PRUEBA: registra la próxima evidencia ficticia que todavía no esté en el cuaderno.
  const nextSample = getEvidenceSamples().find(
    (sample) => !evidences.some((item) => item.id === sample.id),
  )

  return (
    <div className="app">
      <div className="app__toolbar">
        <strong>Cuaderno de investigación</strong>
        <span className="item__meta">{evidences.length} registradas</span>
        <span className="app__spacer" />
        <Button
          size="small"
          variant="primary"
          disabled={!nextSample}
          onClick={() => addEvidence(nextSample)}
        >
          {nextSample ? 'Registrar evidencia de prueba' : 'Sin más pruebas disponibles'}
        </Button>
        <Button size="small" disabled={evidences.length === 0} onClick={clearEvidences}>
          Vaciar cuaderno
        </Button>
      </div>

      <div className="app__body">
        {evidences.length === 0 ? (
          <EmptyState title="El cuaderno está vacío">
            Todavía no registraste ninguna evidencia.
          </EmptyState>
        ) : (
          <ol className="item-list">
            {evidences.map((evidence) => (
              <li key={evidence.id} className="item item--static">
                <span className="item__title">{evidence.title}</span>
                <span className="item__meta">
                  {evidence.source} &middot; registrada a las{' '}
                  {timeFormat.format(new Date(evidence.registeredAt))}
                </span>
                <span>{evidence.description}</span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  )
}
