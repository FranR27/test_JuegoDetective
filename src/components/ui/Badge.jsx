import './Badge.css';

export default function Badge({ children, tone = 'neutral', className = '', ...rest }) {
  return (
    <span className={`case-badge case-badge--${tone} ${className}`.trim()} {...rest}>
      {children}
    </span>
  );
}
