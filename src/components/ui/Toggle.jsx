import { cn } from '../../lib/utils'

export default function Toggle({ checked = false, onChange, disabled = false, label, className = '', id }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      id={id}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={cn(
        'relative w-[52px] h-[32px] rounded-full transition-colors shrink-0',
        checked ? 'bg-[#004ac6]' : 'bg-[#c3c6d7]',
        disabled && 'opacity-40',
        className
      )}
    >
      <span
        className={cn(
          'absolute top-[2px] w-[28px] h-[28px] rounded-full bg-white shadow transition-all',
          checked ? 'left-[22px]' : 'left-[2px]'
        )}
      />
    </button>
  )
}