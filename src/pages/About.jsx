import { Link } from 'react-router-dom'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Icon from '../components/ui/Icon'
import { usePageTitle } from '../hooks/usePageTitle'

const PRINCIPLES = [
  { icon: 'currency_rupee', title: 'Subscriptions in INR, settled in INR', desc: 'No forex markups, no token conversions, no hidden platform markup.' },
  { icon: 'verified_user', title: 'Verification before reach', desc: 'Creators pass Government ID verification aligned with Indian IT Rules (2021) before monetising.' },
  { icon: 'no_adjustments', title: 'No algorithms', desc: 'Publishers are never throttled by engagement algorithms; supporters choose what they see.' },
  { icon: 'contactless', title: 'RBI-aligned payments', desc: 'Tokenized UPI AutoPay through NPCI rails, with 1-tap cancellation and 48h renewal alerts.' },
  { icon: 'payments', title: 'Industry-leading payouts', desc: 'Creators keep 88% net with automated GST/TDS statements and T+1 settlements.' },
  { icon: 'groups', title: 'Fans, not followers', desc: 'Direct ownership of your audience — creators talk to supporters, not feeds.' }
]

export default function About() {
  usePageTitle('About')
  return (
    <div className="max-w-[520px] mx-auto px-5 py-6 space-y-6">
      <header>
        <Badge tone="primary" icon="all_inclusive">About OnlyIndians</Badge>
        <h1 className="text-title-1 text-[#1a1c20] mt-3">India&apos;s creator economy, owned by its creators.</h1>
        <p className="text-callout text-[#434655] mt-2">
          {`OnlyIndians is an India-only, verified creator-subscription platform where fans support creators
          directly and creators keep more of every rupee.`}
        </p>
      </header>

      <section className="giant-card p-5">
        <h2 className="text-headline text-[#1a1c20] mb-2">What we solve</h2>
        <p className="text-footnote text-[#434655] leading-relaxed">
          Indian creators are squeezed by ad-revenue middlemen, opaque foreign platforms, forex deductions, and
          delayed payouts. Fans are trapped between ads, auto-renewal dark patterns, and content that rewards
          outrage over craft. OnlyIndians removes all of it: direct subscriptions in INR, honest payouts, and
          full consumer control.
        </p>
      </section>

      <section className="hairline giant-card overflow-hidden">
        <div className="flex flex-col sm:flex-row bg-white px-4 py-4 gap-1">
          <h3 className="text-subheadline font-semibold text-[#1a1c20] w-32 shrink-0">Who it&apos;s for</h3>
          <p className="text-footnote text-[#434655]">
            <strong className="text-[#1a1c20]">Subscribers</strong> across Bharat who want ad-free, direct access to
            the creators they trust. <strong className="text-[#1a1c20]">Creators</strong> — journalists, stand-ups,
            classical artists, tech reviewers, gamers, chefs, and pod hosts — who want to own their audience and
            earnings without algorithm roulette.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row bg-white px-4 py-4 gap-1">
          <h3 className="text-subheadline font-semibold text-[#1a1c20] w-32 shrink-0">Subscriber experience</h3>
          <p className="text-footnote text-[#434655]">
            Free to browse, subscribe to individual creators with 1-click UPI AutoPay, and cancel any time. Zero
            ads, direct Q&amp;A, and a strict +91 India-only network.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row bg-white px-4 py-4 gap-1">
          <h3 className="text-subheadline font-semibold text-[#1a1c20] w-32 shrink-0">Creator experience</h3>
          <p className="text-footnote text-[#434655]">
            Free to join, ₹0 setup cost, 88% net payout, automated GST/TDS, and daily T+1 INR settlements straight
            to bank/UPI.
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-title-2 text-[#1a1c20] mb-3">Platform principles</h2>
        <div className="hairline giant-card overflow-hidden">
          {PRINCIPLES.map((p) => (
            <div key={p.title} className="flex gap-3.5 bg-white px-4 py-4">
              <span className="w-10 h-10 shrink-0 rounded-2xl bg-[#d7e3ff] text-[#004ac6] grid place-items-center">
                <Icon name={p.icon} size={20} />
              </span>
              <div>
                <h3 className="text-subheadline font-semibold text-[#1a1c20]">{p.title}</h3>
                <p className="text-footnote text-[#434655] mt-0.5">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="giant-card p-5 bg-[#f4f7ff]">
        <div className="flex items-start gap-3">
          <span className="w-10 h-10 shrink-0 rounded-2xl bg-[#004ac6] text-white grid place-items-center">
            <Icon name="shield" size={20} />
          </span>
          <div>
            <h2 className="text-headline text-[#1a1c20]">Trust &amp; safety commitment</h2>
            <p className="text-footnote text-[#434655] mt-1">
              Every account is anchored to a verified Indian +91 number, creators pass Government ID verification
              before monetising, and we honour both RBI payment norms and the Indian IT Rules (2021) — including a
              resident grievance officer. See our&nbsp;
              <Link to="/community-guidelines" className="text-[#004ac6] font-semibold">Community Guidelines</Link>.
            </p>
          </div>
        </div>
      </section>

      <Link to="/contact">
        <Button block variant="secondary" iconName="support_agent">Contact Support</Button>
      </Link>
    </div>
  )
}