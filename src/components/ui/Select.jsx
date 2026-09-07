import { forwardRef } from 'react'
import { cn } from '../../lib/utils'
import Icon from './Icon'

const Select = forwardRef(function Select({ invalid = false, children, placeholder = 'Select', ...rest }, ref) {
  return (
    <div className="relative w-full">
      <select
        ref={ref}
        defaultValue=""
        className={cn(
          'input-field appearance-none pr-10',
          invalid && '!bg-[#ffedec] !border-[#ba1a1a] !shadow-none'
        )}
        {...rest}
      >
        <option value="" disabled hidden>{placeholder}</option>
        {children}
      </select>
      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#737686] pointer-events-none">
        <Icon name="expand_more" size={20} />
      </span>
    </div>
  )
})

export default Select