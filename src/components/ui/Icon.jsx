/* Material Symbols Outlined icon. Usage: <Icon name="home" fill /> */
export default function Icon({ name, size = 20, fill = false, className = '', onClick, style, ...rest }) {
  const px = typeof size === 'number' ? `${size}px` : size
  return (
    <span
      className={`material-symbols-outlined ${fill ? 'fill-icon' : ''} ${className}`}
      style={{ fontSize: px, lineHeight: 1, ...style }}
      onClick={onClick}
      aria-hidden="true"
      {...rest}
    >
      {name}
    </span>
  )
}