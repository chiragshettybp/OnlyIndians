import { cn } from '../../lib/utils'

export default function Field({ label, hint, error, required = false, children, className = '', id }) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label ? (
        <label htmlFor={id} className="text-subheadline font-medium text-[#1a1c20]">
          {label}
          {required ? <span className="text-[#ba1a1a]"> *</span> : null}
        </label>
      ) : null}
      {children}
      {hint && !error ? <span className="text-caption-1 text-[#737686]">{hint}</span> : null}
      {error ? <span className="text-caption-1 text-[#ba1a1a] font-medium">{error}</span> : null}
    </div>
  )
}