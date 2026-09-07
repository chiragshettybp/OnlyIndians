import { cn } from '../../lib/utils'

export default function Tabs({ tabs, active, onChange, className = '' }) {
  return (
    <div className={cn('flex gap-1 border-b border-black/[0.06] overflow-x-auto', className)}>
      {tabs.map((t) => {
        const value = typeof t === 'string' ? t : t.value
        const label = typeof t === 'string' ? t : t.label
        const icon = typeof t === 'string' ? null : t.icon
        const count = typeof t === 'string' ? null : t.count
        const selected = active === value
        return (
          <button
            key={value}
            onClick={() => onChange?.(value)}
            className={cn(
              'relative flex items-center gap-1.5 px-4 h-11 text-subheadline font-medium whitespace-nowrap transition-colors',
              selected ? 'text-[#004ac6]' : 'text-[#434655]'
            )}
          >
            {icon ? <span className="material-symbols-outlined text-[17px]">{icon}</span> : null}
            {label}
            {count != null ? (
              <span className={cn('ml-0.5 px-1.5 rounded-full text-caption-2', selected ? 'bg-[#d7e3ff] text-[#002f6c]' : 'bg-[#eef0f7] text-[#434655]')}>
                {count}
              </span>
            ) : null}
            {selected ? <span className="absolute bottom-0 left-0 right-0 h-[3px] rounded-full bg-[#004ac6]" /> : null}
          </button>
        )
      })}
    </div>
  )
}