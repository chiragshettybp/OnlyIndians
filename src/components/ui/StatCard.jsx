import { cn } from '../../lib/utils'
import { formatCompactINR } from '../../lib/utils'
import Icon from './Icon'

export default function StatCard({ label, value, sub, icon, tone = 'brand', currency = false, trend, caption, onPress }) {
  const tones = {
    brand: 'bg-[#004ac6] text-white',
    brandSoft: 'bg-[#d7e3ff] text-[#002f6c]',
    success: 'bg-[#d3e8d6] text-[#1b5e20]',
    warning: 'bg-[#fbe8c2] text-[#7a5b00]',
    danger: 'bg-[#ffedec] text-[#ba1a1a]',
    neutral: 'bg-[#eef0f7] text-[#434655]',
    violet: 'bg-[#e8def8] text-[#381e72]'
  }
  const Tag = onPress ? 'button' : 'div'
  return (
    <Tag
      onClick={onPress}
      className={cn('giant-card p-4 flex items-start gap-3.5 text-left transition-transform', onPress && 'active:scale-[0.98]')}
    >
      {icon ? <span className={cn('w-11 h-11 rounded-2xl grid place-items-center shrink-0', tones[tone])}><Icon name={icon} size={22} /></span> : null}
      <div className="min-w-0 flex-1">
        <p className="text-caption-1 text-[#434655] font-medium">{label}</p>
        <p className="text-title-2 text-[#1a1c20] mt-0.5 truncate">{currency ? formatCompactINR(value) : value}</p>
        {caption ? <p className="text-footnote text-[#737686] mt-0.5 flex items-center gap-1">
          {trend ? <Icon name={trend >= 0 ? 'trending_up' : 'trending_down'} size={14} className={trend >= 0 ? 'text-[#1b5e20]' : 'text-[#ba1a1a]'} /> : null}
          {sub ?? caption}
        </p> : null}
      </div>
    </Tag>
  )
}

export { cn }