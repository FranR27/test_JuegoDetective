import Button from '../components/ui/Button.jsx'
import { useGame } from '../game/useGame.js'
import '../styles/welcome.css'

const dossierPoints = [
  'Última actividad registrada: 06/11/2026 · 21:04',
  'Copia recuperada: equipo personal de Alex Morgan',
  'Objetivo inicial: verificar si la desaparición fue voluntaria',
]

export default function WelcomePage() {
  const { startInvestigation } = useGame()

  return (
    <main className="welcome">
      <div className="welcome__glow" aria-hidden="true" />

      <article className="welcome__card">
        <header className="welcome__header">
          <p className="welcome__eyebrow">Unidad de análisis digital</p>
          <p className="welcome__file">Expediente 001</p>
          <h1 className="welcome__title">CASO 404</h1>
          <p className="welcome__subtitle">La última conexión</p>
        </header>

        <div className="welcome__divider" aria-hidden="true" />

        <section className="welcome__summary">
          <p className="welcome__intro">
            Puerto Bruma, Argentina. El 6 de noviembre de 2026 desapareció Alex
            Morgan, de 29 años. La policía considera posible que haya abandonado
            la ciudad por decisión propia, pero una copia recuperada de su
            computadora contiene indicios que podrían contradecir esa hipótesis.
          </p>
          <p className="welcome__intro">
            Tu función es reconstruir lo ocurrido a partir de archivos, correos,
            mensajes y notas. No busques intuiciones rápidas: registrá hechos,
            detectá contradicciones y seguí las pruebas.
          </p>
        </section>

        <section className="welcome__dossier" aria-label="Resumen del expediente">
          <h2 className="welcome__section-title">Resumen inicial</h2>
          <ul className="welcome__facts">
            {dossierPoints.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </section>

        <section className="welcome__notice" aria-label="Observación del sistema">
          <span className="welcome__notice-label">Observación</span>
          <p>
            La evidencia disponible puede estar incompleta o haber sido
            manipulada. Ninguna declaración debe considerarse un hecho sin
            corroboración.
          </p>
        </section>

        <footer className="welcome__actions">
          <Button variant="primary" size="large" onClick={startInvestigation}>
            Iniciar investigación
          </Button>
          <p className="welcome__hint">
            Primera versión funcional del caso · sin imágenes ni audio.
          </p>
        </footer>
      </article>
    </main>
  )
}
