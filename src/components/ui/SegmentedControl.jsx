import { cn } from '../../lib/utils'
import Icon from './Icon'

export default function SegmentedControl({ options, value, onChange, className = '', size = 'md' }) {
  const inner = size === 'lg' ? 'p-1 rounded-[12px]' : 'p-0.5 rounded-[10px]'
  const button = size === 'lg' ? 'px-4 py-2.5 text-[15px] rounded-[10px]' : 'px-3 py-1.5 text-[13px] rounded-[8px]'
  return (
    <div className={cn('inline-flex bg-[#e7e8ee]', inner, className)} role="tablist">
      {options.map((opt) => {
        const selected = opt.value === value
        const item = typeof opt === 'string' ? { label: opt, value: opt } : opt
        return (
          <button
            key={item.value}
            role="tab"
            aria-selected={selected}
            onClick={() => onChange?.(item.value)}
            className={cn(
              'inline-flex items-center justify-center gap-1.5 font-semibold transition-all whitespace-nowrap',
              button,
              selected ? 'bg-white text-[#004ac6] shadow-sm' : 'text-[#434655] hover:text-[#1a1c20]'
            )}
          >
            {item.icon ? <Icon name={item.icon} size={15} /> : null}
            {item.label}
          </button>
        )
      })}
    </div>
  )
}