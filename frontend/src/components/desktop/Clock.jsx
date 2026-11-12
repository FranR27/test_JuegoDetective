import { useEffect, useState } from 'react'

const timeFormat = new Intl.DateTimeFormat('es-AR', { hour: '2-digit', minute: '2-digit' })
const dateFormat = new Intl.DateTimeFormat('es-AR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
})

export default function Clock() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <time className="clock" dateTime={now.toISOString()}>
      <span className="clock__time">{timeFormat.format(now)}</span>
      <span className="clock__date">{dateFormat.format(now)}</span>
    </time>
  )
}
