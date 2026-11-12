import Icon from './Icon.jsx';
import './EmptyState.css';

export default function EmptyState({
  icon = 'search',
  title = 'Nada por acá',
  description,
  action,
}) {
  return (
    <div className="case-empty">
      <div className="case-empty__mark">
        <Icon name={icon} size={26} />
      </div>
      <h3 className="case-empty__title">{title}</h3>
      {description ? <p className="case-empty__text">{description}</p> : null}
      {action ? <div className="case-empty__action">{action}</div> : null}
    </div>
  );
}
