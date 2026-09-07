import { cn } from '../../lib/utils'

const TONES = {
  neutral: 'bg-[#eef0f7] text-[#434655]',
  brand: 'bg-[#d7e3ff] text-[#002f6c]',
  primary: 'bg-[#004ac6] text-white',
  success: 'bg-[#d3e8d6] text-[#1b5e20]',
  warning: 'bg-[#fbe8c2] text-[#7a5b00]',
  danger: 'bg-[#ffdad6] text-[#8c1d18]',
  violet: 'bg-[#e8def8] text-[#381e72]',
  orange: 'bg-[#ffdcc2] text-[#7b2f00]'
}

export default function Badge({ tone = 'neutral', children, icon, dot = false, className = '', ...rest }) {
  return (
    <span
      className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-caption-1 font-semibold whitespace-nowrap', TONES[tone], className)}
      {...rest}
    >
      {dot ? <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" /> : null}
      {icon ? <span className="material-symbols-outlined text-[14px]">{icon}</span> : null}
      {children}
    </span>
  )
}