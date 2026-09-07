import { cn, initials } from '../../lib/utils'

const SIZES = {
  xs: 'w-8 h-8 text-[12px]',
  sm: 'w-10 h-10 text-[14px]',
  md: 'w-14 h-14 text-[18px]',
  lg: 'w-24 h-24 text-[28px]',
  xl: 'w-32 h-32 text-[38px]'
}

export default function Avatar({ src, name = '', size = 'md', verified = false, className = '', shape = 'circle' }) {
  if (src) {
    return (
      <span className={cn('relative inline-block shrink-0', shape === 'circle' ? SIZES[size] : 'rounded-2xl', className)}>
        <img src={src} alt={name} className={cn('w-full h-full object-cover bg-[#eef0f7]', shape === 'circle' ? 'rounded-full' : 'rounded-2xl', verified && 'ring-2 ring-[#004ac6]')} />
        {verified ? (
          <span className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-[#004ac6] border-2 border-white grid place-items-center">
            <span className="material-symbols-outlined fill-icon text-white text-[12px]">verified</span>
          </span>
        ) : null}
      </span>
    )
  }
  const tone = ['bg-[#d7e3ff] text-[#002f6c]', 'bg-[#e8def8] text-[#381e72]', 'bg-[#ffe7c2] text-[#7b2f00]', 'bg-[#d3e8d6] text-[#1b5e20]'][(name || '').length % 4]
  return (
    <span className={cn('inline-grid place-items-center font-semibold shrink-0', tone, SIZES[size], shape === 'circle' ? 'rounded-full' : 'rounded-2xl', className)}>
      {initials(name) || <span className="material-symbols-outlined text-[inherit]">person</span>}
    </span>
  )
}