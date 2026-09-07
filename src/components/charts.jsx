import { useId } from 'react'

// Dependency-free SVG line + bar charts using the Stitch accent palette.
const GRID = '#e7e8ee'
const BRAND = '#004ac6'

export function Sparkline({ data = [], height = 40, color = BRAND, strokeWidth = 2.5, className = '' }) {
  const uid = useId().replace(/:/g, '')
  const id = `spark-${uid}`
  if (!data.length) return null
  const w = 100
  const h = 36
  const max = Math.max(...data, 1)
  const min = Math.min(...data, 0)
  const pts = data.map((v, i) => [i / (data.length - 1) * w, h - ((v - min) / (max - min || 1)) * h])
  const d = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
  const area = `${d}L${w},${h}L0,${h}Z`
  return (
    <svg width="100%" height={height} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${id})`} />
      <path d={d} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function BarChart({ data = [], height = 160, color = BRAND, showLabels = true }) {
  if (!data.length) return null
  const w = data.length * 28 + 20
  const h = 120
  const max = Math.max(...data.map((d) => d.value), 1)
  const barW = 18
  return (
    <div className="w-full">
      <svg width="100%" height={height} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" aria-hidden="true">
        {[0.25, 0.5, 0.75, 1].map((f) => (
          <line key={f} x1="0" x2={w} y1={h - h * f} y2={h - h * f} stroke={GRID} strokeWidth="1" strokeDasharray="3 4" />
        ))}
        {data.map((d, i) => {
          const bh = (d.value / max) * (h - 10)
          const x = 10 + i * 28
          return (
            <rect key={i} x={x} y={h - bh} width={barW} height={Math.max(bh, 2)} rx="4" fill={d.color ?? color} opacity={d.opacity ?? 1} />
          )
        })}
      </svg>
      {showLabels ? (
        <div className="flex justify-between mt-1" style={{ width: `${w}px`, maxWidth: '100%' }}>
          {data.map((d, i) => (
            <span key={i} className="text-caption-2 text-[#434655] truncate" style={{ width: 28, textAlign: 'center' }}>{d.label ?? ''}</span>
          ))}
        </div>
      ) : null}
    </div>
  )
}

export function Donut({ segments = [], size = 140, thickness = 16, centerLabel, centerSub }) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1
  const r = (size - thickness) / 2
  const c = 2 * Math.PI * r
  let acc = 0
  return (
    <div className="relative inline-flex items-center justify-center" role="img" aria-label={centerLabel}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={GRID} strokeWidth={thickness} />
        {segments.map((s, i) => {
          const frac = s.value / total
          const dash = frac * c
          const offset = -acc * c
          acc += frac
          return (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={s.color ?? BRAND}
              strokeWidth={thickness}
              strokeDasharray={`${dash} ${c - dash}`}
              strokeDashoffset={offset}
              strokeLinecap="round"
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
          )
        })}
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-title-2 text-[#1a1c20]">{centerLabel}</span>
        {centerSub ? <span className="text-caption-1 text-[#737686]">{centerSub}</span> : null}
      </div>
    </div>
  )
}

export const CHART_TONES = ['#004ac6', '#00a794', '#f2a700', '#e5484d', '#8b5cf6', '#0ea5e9', '#c026d3', '#64748b']