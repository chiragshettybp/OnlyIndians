import { Link } from 'react-router-dom'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Icon from '../components/ui/Icon'
import { usePageTitle } from '../hooks/usePageTitle'
import { BRAND, CONCIERGE, CREATOR_USP, EXPLORE_LINKS, HERO_USP, PLATFORM, PLATFORM_FACTS, TRUST_PILLARS } from '../lib/constants'

const EXPLORE_PATHS = ['/how-it-works', '/pricing', '/faq', '/status']

export default function Home() {
  usePageTitle('Home')
  return (
    <div className="max-w-[520px] mx-auto px-5 py-6 space-y-6">
      {/* Hero */}
      <section className="giant-card overflow-hidden">
        <div className="p-6 pb-5 bg-gradient-to-br from-[#002f6c] via-[#004ac6] to-[#0056b3] text-white">
          <Badge tone="primary" icon="all_inclusive">
            <span className="text-white font-semibold">Only Indians · India&apos;s Verified Creator Network</span>
          </Badge>
          <h1 className="text-large-title mt-4 text-white leading-tight">
            {BRAND.tagline}
          </h1>
          <p className="text-callout text-white/85 mt-2 leading-relaxed">
            {BRAND.claim} A dedicated, trusted subscription platform engineered exclusively for Indian
            creators, local UPI settlements, and zero SMS spam.
          </p>
          <div className="flex flex-col sm:flex-row gap-2.5 mt-5">
            <Link to="/auth/subscriber/register" className="flex-1">
              <Button block size="lg" variant="secondary">Get Started — Explore Free</Button>
            </Link>
            <Link to="/auth/creator/register" className="flex-1">
              <Button block size="lg" variant="outline" className="!bg-white/10 !border-white/30 !text-white">
                Join as a Creator
              </Button>
            </Link>
          </div>
          <p className="text-footnote text-white/70 mt-3 flex items-center gap-1.5">
            <Icon name="verified" size={15} className="fill-icon" /> 4,800+ verified Indian creators live
          </p>
        </div>
        <div className="grid grid-cols-2 gap-px bg-black/[0.06]">
          {PLATFORM_FACTS.map((f) => (
            <div key={f.label} className="bg-white px-4 py-3.5">
              <p className="text-title-2 text-[#004ac6] font-bold">{f.value}</p>
              <p className="text-caption-1 text-[#434655]">{f.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Choose Your Portal */}
      <section>
        <h2 className="text-title-2 text-[#1a1c20] mb-3">Choose Your Portal</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="giant-card p-5 flex flex-col">
            <span className="w-11 h-11 rounded-2xl bg-[#d7e3ff] text-[#004ac6] grid place-items-center mb-3">
              <Icon name="subscriptions" size={22} />
            </span>
            <h3 className="text-headline text-[#1a1c20]">For Subscribers</h3>
            <p className="text-footnote text-[#434655] mt-1.5 flex-1">
              Free to join. Discover curated regional creators, ad-free exclusive drops, and pay direct UPI only
              when unlocking content.
            </p>
            <ul className="space-y-2 mt-4">
              {HERO_USP.map((u) => (
                <li key={u.label} className="flex items-center gap-2 text-footnote text-[#1a1c20]">
                  <Icon name={u.icon} size={16} className="text-[#004ac6]" /> {u.label}
                </li>
              ))}
            </ul>
            <Link to="/auth/subscriber/register" className="mt-4">
              <Button block variant="primary" iconName="keyboard_arrow_right">Join Free</Button>
            </Link>
          </div>

          <div className="giant-card p-5 flex flex-col">
            <span className="w-11 h-11 rounded-2xl bg-[#e8def8] text-[#381e72] grid place-items-center mb-3">
              <Icon name="mic" size={22} />
            </span>
            <h3 className="text-headline text-[#1a1c20]">For Creators</h3>
            <p className="text-footnote text-[#434655] mt-1.5 flex-1">
              Keep {Math.round(PLATFORM.creatorNetShare * 100)}% net. ₹0 listing fee. Automated TDS
              compliance, direct fan ownership, and guaranteed daily INR settlements.
            </p>
            <ul className="space-y-2 mt-4">
              {CREATOR_USP.map((u) => (
                <li key={u.label} className="flex items-center gap-2 text-footnote text-[#1a1c20]">
                  <Icon name={u.icon} size={16} className="text-[#381e72]" /> {u.label}
                </li>
              ))}
            </ul>
            <Link to="/auth/creator/register" className="mt-4">
              <Button block variant="secondary" iconName="keyboard_arrow_right">Join as a Creator</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* India-First Trust & Compliance */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <h2 className="text-title-2 text-[#1a1c20]">India-First Trust &amp; Compliance</h2>
        </div>
        <div className="hairline giant-card overflow-hidden">
          {TRUST_PILLARS.map((t) => (
            <div key={t.title} className="flex gap-3.5 bg-white px-4 py-4">
              <span className="w-10 h-10 shrink-0 rounded-2xl bg-[#eef0f7] text-[#004ac6] grid place-items-center">
                <Icon name={t.icon} size={20} />
              </span>
              <div>
                <h3 className="text-subheadline font-semibold text-[#1a1c20]">{t.title}</h3>
                <p className="text-footnote text-[#434655] mt-0.5">{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Concierge */}
      <section className="giant-card overflow-hidden border border-[#d7e3ff]">
        <div className="bg-gradient-to-r from-[#d7e3ff]/60 to-transparent">
          <div className="p-5">
            <span className="w-11 h-11 rounded-2xl bg-[#004ac6] text-white grid place-items-center mb-3">
              <Icon name="rocket_launch" size={22} />
            </span>
            <h3 className="text-headline text-[#1a1c20]">{CONCIERGE.title}</h3>
            <p className="text-footnote text-[#434655] mt-1.5">{CONCIERGE.desc}</p>
            <Link to="/auth/creator/register" className="mt-4 inline-block">
              <Button variant="primary" iconName="arrow_forward" size="sm">{CONCIERGE.cta}</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Explore Platform */}
      <section>
        <h2 className="text-title-2 text-[#1a1c20] mb-3">Explore Platform</h2>
        <div className="hairline giant-card overflow-hidden">
          {EXPLORE_LINKS.map((label, i) => (
            <Link key={label} to={EXPLORE_PATHS[i]} className="inset-row bg-white text-left">
              <span className="text-subheadline text-[#1a1c20]">{label}</span>
              <Icon name="chevron_right" size={20} className="text-[#737686]" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}