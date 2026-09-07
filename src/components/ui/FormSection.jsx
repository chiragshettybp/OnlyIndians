import { cn } from '../../lib/utils'
import Badge from './Badge'

export default function FormSection({ step, title, caption, required = false, children, className = '' }) {
  return (
    <section className={cn('giant-card p-5', className)}>
      <div className="flex items-start gap-3 mb-4">
        <span className="w-8 h-8 shrink-0 rounded-full bg-[#d7e3ff] text-[#004ac6] grid place-items-center text-subheadline font-bold">
          {step}
        </span>
        <div className="flex-1">
          <h3 className="text-headline text-[#1a1c20]">{title}</h3>
          {caption ? <p className="text-footnote text-[#737686] mt-0.5">{caption}</p> : null}
        </div>
        {required ? <Badge tone="danger">Required</Badge> : null}
      </div>
      {children}
    </section>
  )
}