export default function Button({
  variant = 'default',
  size = 'medium',
  type = 'button',
  className = '',
  ...props
}) {
  const classes = ['btn', `btn--${variant}`, `btn--${size}`, className]
    .filter(Boolean)
    .join(' ')
  return <button type={type} className={classes} {...props} />
}
