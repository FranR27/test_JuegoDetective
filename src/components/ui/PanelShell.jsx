import './PanelShell.css';

export default function PanelShell({
  eyebrow,
  title,
  subtitle,
  actions,
  toolbar,
  children,
  className = '',
}) {
  return (
    <section className={`case-panel case-ui ${className}`.trim()}>
      <header className="case-panel__head">
        <div className="case-panel__heading">
          {eyebrow ? <p className="case-panel__eyebrow">{eyebrow}</p> : null}
          <h2 className="case-panel__title">{title}</h2>
          {subtitle ? <p className="case-panel__subtitle">{subtitle}</p> : null}
        </div>
        {actions ? <div className="case-panel__actions">{actions}</div> : null}
      </header>
      {toolbar ? <div className="case-panel__toolbar">{toolbar}</div> : null}
      <div className="case-panel__body">{children}</div>
    </section>
  );
}
