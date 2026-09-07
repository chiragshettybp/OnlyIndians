import { cn } from '../lib/utils'

const TRI = ['#ff9933', '#ffffff', '#138808']

export default function Logo({ size = 34, mono = false, fontSize = 'inherit', className = '' }) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <span
        className="relative shrink-0 rounded-full grid place-items-center ring-2 ring-black/[0.06] shadow-sm"
        style={{ width: size, height: size, background: 'linear-gradient(135deg,#004ac6 0%,#002f6c 100%)' }}
      >
        {mono ? (
          <span className="text-white font-bold" style={{ fontSize: size * 0.44 }}>OI</span>
        ) : (
          <span className="flex rounded-full overflow-hidden" style={{ width: size * 0.5, height: size * 0.5 }}>
            {TRI.map((c, i) => (
              <span key={i} style={{ width: '33.4%', background: c }} />
            ))}
          </span>
        )}
      </span>
      <span className="font-bold tracking-tight text-[#1a1c20]" style={{ fontSize: fontSize === 'inherit' ? undefined : fontSize }}>
        Only<span style={{ color: '#004ac6' }}>Indians</span>
      </span>
    </span>
  )
}