import { cn } from '../../lib/utils'

export default function ProgressBar({ value = 0, className = '', label }) {
  const pct = Math.round(Math.min(100, Math.max(0, value)))
  return (
    <div className={cn('w-full', className)}>
      {label ? (
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-caption-1 text-[#434655] font-medium">{label}</span>
          <span className="text-caption-1 text-[#004ac6] font-semibold">{pct}%</span>
        </div>
      ) : null}
      <div className="h-1.5 rounded-full bg-[#e7e8ee] overflow-hidden">
        <div className="h-full rounded-full bg-[#004ac6] transition-all duration-300" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}