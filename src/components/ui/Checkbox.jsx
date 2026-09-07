import { forwardRef } from 'react'
import { cn } from '../../lib/utils'

const Checkbox = forwardRef(function Checkbox({
  label,
  children,
  href,
  required = false,
  disabled = false,
  error = false,
  className = '',
  ...rest
}, ref) {
  const labelContent = children ?? label
  return (
    <label className={cn('flex items-start gap-3 cursor-pointer select-none', className)}>
      <input
        ref={ref}
        type="checkbox"
        required={required}
        disabled={disabled}
        aria-invalid={error}
        className={cn(
          'mt-0.5 h-5 w-5 shrink-0 appearance-none rounded-[4px] border-2 transition-colors',
          'bg-white',
          disabled ? 'border-[#e4e6f0] cursor-not-allowed opacity-60' : 'border-[#c5c8d8]',
          'focus:outline-none focus:ring-2 focus:ring-[#004ac6]/20',
          'checked:bg-[#004ac6] checked:border-[#004ac6]',
          'checked:after:content-[""] checked:after:block checked:after:w-[5px] checked:after:h-[10px] checked:after:border-2 checked:after:border-white checked:after:border-t-0 checked:after:border-l-0 checked:after:rotate-45 checked:after:ml-[2px] checked:after:mt-[-2px]',
          error && 'border-[#ba1a1a] checked:bg-[#ba1a1a] checked:border-[#ba1a1a]'
        )}
        {...rest}
      />
      <div className="flex flex-col gap-0.5 text-footnote leading-relaxed">
        <span className={cn('text-[#1a1c20]', disabled && 'opacity-60')}>
          {labelContent}
          {required && <span className="text-[#ba1a1a]"> *</span>}
        </span>
        {href && (
          <a href={href} className="text-[#004ac6] underline hover:text-[#002f6c] transition-colors" target="_blank" rel="noopener noreferrer">
            {href}
          </a>
        )}
      </div>
    </label>
  )
})

Checkbox.displayName = 'Checkbox'

export default Checkbox