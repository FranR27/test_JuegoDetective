/**
 * Ventana reutilizable. No conoce qué app contiene: solo dibuja el marco,
 * la barra de título y los botones de minimizar / cerrar.
 * (Sin arrastre ni redimensionado en esta versión.)
 */
export default function Window({
  title,
  icon,
  slot,
  zIndex,
  active,
  minimized,
  onFocus,
  onMinimize,
  onClose,
  children,
}) {
  return (
    <section
      className={`window${active ? ' window--active' : ''}`}
      style={{ '--slot': slot % 8, zIndex: 10 + zIndex }}
      aria-label={title}
      hidden={minimized}
      onPointerDown={onFocus}
    >
      <header className="window__bar">
        <div className="window__heading">
          <span className="window__icon" aria-hidden="true">
            {icon}
          </span>
          <h2 className="window__title">{title}</h2>
        </div>
        <div className="window__actions">
          <button
            type="button"
            className="window__button"
            aria-label={`Minimizar ${title}`}
            title="Minimizar"
            onClick={onMinimize}
          >
            &minus;
          </button>
          <button
            type="button"
            className="window__button window__button--close"
            aria-label={`Cerrar ${title}`}
            title="Cerrar"
            onClick={onClose}
          >
            &times;
          </button>
        </div>
      </header>
      <div className="window__content">{children}</div>
    </section>
  )
}
