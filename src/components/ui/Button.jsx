import { cn } from '../../lib/utils'
import Icon from './Icon'

const VARIANTS = {
  primary: 'bg-[#004ac6] text-white active:opacity-90',
  secondary: 'bg-[#eef0f7] text-[#1a1c20] active:opacity-80',
  tonal: 'bg-[#d7e3ff] text-[#002f6c] active:opacity-80',
  ghost: 'bg-transparent text-[#004ac6] active:opacity-70',
  danger: 'bg-[#ba1a1a] text-white active:opacity-90',
  outline: 'border border-[#c3c6d7] text-[#1a1c20] bg-white active:bg-[#eef0f7]',
  link: 'bg-transparent text-[#004ac6] underline-offset-2 active:opacity-70 p-0'
}

const SIZES = {
  sm: 'h-9 px-3.5 text-[14px] rounded-[8px] gap-1',
  md: 'h-12 px-5 text-[16px] rounded-[12px] gap-2',
  lg: 'h-14 px-7 text-[17px] rounded-[14px] gap-2'
}

export default function Button({ variant = 'primary', size = 'md', icon, iconName, fill, loading = false, block = false, className = '', children, disabled, ...rest }) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-semibold transition-all select-none disabled:opacity-50',
        VARIANTS[variant],
        SIZES[size],
        block && 'w-full',
        variant !== 'link' && 'shadow-[0_1px_2px_rgba(0,0,0,0.04)]',
        className
      )}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? <Icon name="progress_activity" size={size === 'sm' ? 16 : 18} className="animate-spin" /> : null}
      {icon}
      {!loading && iconName ? <Icon name={iconName} size={size === 'sm' ? 16 : 19} fill={fill} /> : null}
      {children}
    </button>
  )
}