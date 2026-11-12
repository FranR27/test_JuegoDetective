import Button from '../components/ui/Button.jsx'
import { useGame } from '../game/useGame.js'
import '../styles/welcome.css'

export default function WelcomePage() {
  const { startInvestigation } = useGame()

  return (
    <main className="welcome">
      <article className="welcome__card">
        <p className="welcome__file">Expediente 001</p>
        <h1 className="welcome__title">CASO 404</h1>
        <p className="welcome__subtitle">La última conexión</p>

        <p className="welcome__intro">
          Puerto Bruma, Argentina. El 6 de noviembre de 2026 desapareció Alex
          Morgan, de 29 años. La policía sospecha que se fue de la ciudad por
          decisión propia, pero una copia recuperada de su computadora contiene
          información que podría contradecir esa hipótesis.
        </p>
        <p className="welcome__intro">
          Sos el analista digital del caso: revisá archivos, correos, mensajes y
          notas para reconstruir lo que ocurrió.
        </p>

        <Button variant="primary" size="large" onClick={startInvestigation}>
          Iniciar investigación
        </Button>
      </article>
    </main>
  )
}
