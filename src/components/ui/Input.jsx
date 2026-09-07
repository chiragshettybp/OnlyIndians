import { forwardRef } from 'react'
import { cn } from '../../lib/utils'
import Icon from './Icon'

const Input = forwardRef(function Input({ icon, trailing, invalid = false, className = '', prefix, ...rest }, ref) {
  return (
    <div className={cn('relative w-full', className)}>
      {icon ? (
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#737686]"><Icon name={icon} size={20} /></span>
      ) : null}
      {prefix ? (
        <span className={cn('absolute left-4 top-1/2 -translate-y-1/2 text-[16px] font-semibold text-[#737686]', icon && 'left-11')}>{prefix}</span>
      ) : null}
      <input
        ref={ref}
        className={cn(
          'input-field',
          (icon || prefix) && 'pl-12',
          trailing && 'pr-12',
          invalid && '!bg-[#ffedec] !border-[#ba1a1a] !shadow-none'
        )}
        {...rest}
      />
      {trailing ? <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#737686]">{trailing}</span> : null}
    </div>
  )
})

export default Input