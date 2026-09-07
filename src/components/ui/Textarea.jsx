import { forwardRef } from 'react'
import { cn } from '../../lib/utils'

const Textarea = forwardRef(function Textarea({ className = '', invalid = false, ...rest }, ref) {
  return (
    <textarea
      ref={ref}
      className={cn('input-field resize-none min-h-[100px]', invalid && '!bg-[#ffedec] !border-[#ba1a1a] !shadow-none', className)}
      {...rest}
    />
  )
})

export default Textarea