import { useState } from 'react'
import { Link } from 'react-router-dom'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Icon from '../components/ui/Icon'
import { usePageTitle } from '../hooks/usePageTitle'
import { STATUS_META, STATUS_SERVICES } from '../lib/constants'

const GOLDEN_STATS = [
  { value: '99.98%', label: 'Avg Response speed' },
  { value: '38 ms', label: 'Normal response' },
  { value: '100%', label: '30-Day SLA verified' },
  { value: '0', label: 'Zero critical outages' }
]

export default function Status() {
  usePageTitle('Platform Status')
  const [checkedAt, setCheckedAt] = useState(() => new Date())

  const refresh = () => setCheckedAt(new Date())

  return (
    <div className="max-w-[520px] mx-auto px-5 py-6 space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-title-1 text-[#1a1c20]">Platform Status</h1>
          <p className="text-footnote text-[#737686] flex items-center gap-1.5 mt-1">
            <Icon name="schedule" size={14} /> Updated {checkedAt.toLocaleTimeString('en-IN')}
          </p>
        </div>
        <Button variant="ghost" size="sm" iconName="refresh" ariaLabel="Refresh status" onClick={refresh}>
          Refresh
        </Button>
      </header>

      <section className="giant-card overflow-hidden border border-[#b8d4b0]">
        <div className="bg-[#e6f4e6] px-5 py-4">
          <div className="flex items-center gap-2.5">
            <span className="w-10 h-10 rounded-full bg-[#2e7d32] text-white grid place-items-center">
              <Icon name="check_circle" size={22} />
            </span>
            <div>
              <p className="text-headline font-semibold text-[#1a1c20]">{STATUS_META.overall}</p>
              <p className="text-footnote text-[#434655]">Core API &amp; critical services running normally</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-px bg-black/[0.06]">
          {GOLDEN_STATS.map((s) => (
            <div key={s.label} className="bg-white px-4 py-3">
              <p className="text-title-2 font-bold text-[#1a1c20]">{s.value}</p>
              <p className="text-caption-1 text-[#434655]">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="giant-card p-4 flex gap-3 bg-[#f4f7ff]">
        <Icon name="info" size={20} className="text-[#004ac6] shrink-0 mt-0.5" />
        <p className="text-footnote text-[#434655]">
          <strong className="text-[#1a1c20]">Design reference — live monitoring pending.</strong> Status
          monitoring is not yet wired to live telemetry. Figures below are the product&apos;s design-time reference
          values and are not live measurements.
        </p>
      </section>

      {/* Services health */}
      <section>
        <div className="flex items-baseline justify-between mb-3">
          <h2 className="text-title-2 text-[#1a1c20]">Services Health</h2>
          <span className="text-footnote text-[#737686]">{STATUS_SERVICES.length} Systems Active</span>
        </div>
        <div className="hairline giant-card overflow-hidden">
          {STATUS_SERVICES.map((svc) => (
            <div key={svc.name} className="flex items-center gap-3 bg-white px-4 py-3.5">
              <span className="w-10 h-10 shrink-0 rounded-2xl bg-[#eef0f7] text-[#004ac6] grid place-items-center">
                <Icon name={svc.icon} size={20} />
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-subheadline font-medium text-[#1a1c20] truncate">{svc.name}</p>
                <p className="text-caption-1 text-[#737686] truncate">{svc.sub}</p>
              </div>
              <div className="flex flex-col items-end shrink-0 gap-0.5">
                <Badge tone="success" icon="check_circle">{svc.uptime}</Badge>
                <span className="text-caption-2 text-[#737686]">{svc.latency === '—' ? '— latency' : `${svc.latency} Latency`}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Incident history */}
      <section className="giant-card p-5">
        <h2 className="text-headline text-[#1a1c20] mb-2">Incident History — Past 30 Days</h2>
        <div className="flex items-start gap-2.5">
          <span className="w-10 h-10 shrink-0 rounded-2xl bg-[#e6f4e6] text-[#2e7d32] grid place-items-center mt-0.5">
            <Icon name="verified" size={20} />
          </span>
          <div>
            <p className="text-subheadline font-semibold text-[#1a1c20]">{STATUS_META.incidents.title}</p>
            <p className="text-footnote text-[#434655] mt-0.5">{STATUS_META.incidents.desc}</p>
          </div>
        </div>
      </section>

      <Link to="/contact">
        <Button block variant="secondary" iconName="support_agent">
          Report an Issue — Contact 24/7 reliability engineering
        </Button>
      </Link>

      <p className="text-center text-caption-1 text-[#737686]">
        Status monitoring &middot; Metrics history &middot; Incident archive
      </p>
    </div>
  )
}