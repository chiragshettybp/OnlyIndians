import { cn } from '../../lib/utils'

export default function PageHeader({ title, subtitle, back, trailing, className = '' }) {
  return (
    <div className={cn('flex items-center justify-between gap-3', className)}>
      <div className="flex items-center gap-3 min-w-0">
        {back ? <button onClick={back} className="w-10 h-10 shrink-0 grid place-items-center rounded-full text-[#434655] hover:bg-[#eef0f7]" aria-label="Back"><span className="material-symbols-outlined">arrow_back</span></button> : null}
        <div className="min-w-0">
          <h1 className="text-title-1 text-[#1a1c20] truncate">{title}</h1>
          {subtitle ? <p className="text-footnote text-[#737686] mt-0.5">{subtitle}</p> : null}
        </div>
      </div>
      {trailing ? <div className="flex items-center gap-2 shrink-0">{trailing}</div> : null}
    </div>
  )
}