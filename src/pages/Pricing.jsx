import { useState } from 'react'
import { Link } from 'react-router-dom'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Icon from '../components/ui/Icon'
import SegmentedControl from '../components/ui/SegmentedControl'
import { usePageTitle } from '../hooks/usePageTitle'
import { PLATFORM, PRICING_BENEFITS, PRICING_GUARANTEES } from '../lib/constants'

export default function Pricing() {
  usePageTitle('Pricing')
  const [tab, setTab] = useState('subscriber')
  const isCreator = tab === 'creator'

  return (
    <div className="max-w-[520px] mx-auto px-5 py-6 space-y-6">
      <header className="text-center">
        <Badge tone="primary" icon="verified">Transparent Pricing &amp; Fees · RBI Mandated</Badge>
        <h1 className="text-title-1 text-[#1a1c20] mt-3">Zero hidden charges.</h1>
        <p className="text-callout text-[#434655] mt-2">
          {isCreator
            ? `Creators keep ${Math.round(PLATFORM.creatorNetShare * 100)}% of every rupee.`
            : 'Free to join. Pay only the individual creators you unlock.'}
        </p>
      </header>

      <div className="flex items-center justify-center">
        <SegmentedControl
          size="lg"
          value={tab}
          onChange={setTab}
          options={[
            { value: 'subscriber', label: 'For Subscribers' },
            { value: 'creator', label: `For Creators (${Math.round(PLATFORM.creatorNetShare * 100)}% Payout)` }
          ]}
        />
      </div>

      {isCreator ? (
        <>
          {/* Creator economics */}
          <section className="giant-card overflow-hidden">
            <div className="bg-gradient-to-br from-[#002f6c] to-[#004ac6] text-white p-5">
              <div className="flex items-center gap-2">
                <Icon name="account_balance_wallet" size={20} className="text-white" />
                <h2 className="text-headline">Creator Economics</h2>
              </div>
              <p className="text-title-1 font-bold mt-2">
                {Math.round(PLATFORM.creatorNetShare * 100)}% Payout
              </p>
              <p className="text-callout text-white/85 mt-1">Direct to Indian Bank / UPI</p>
            </div>
            <div className="bg-white p-5">
              <p className="text-footnote text-[#434655] leading-relaxed">
                Creators take home {Math.round(PLATFORM.creatorNetShare * 100)}% of all gross subscriber receipts
                with zero platform fees, itemized GST invoicing, and next-day T+1 sovereign settlements.
              </p>
              <div className="hairline mt-5 rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between bg-white px-4 py-3.5">
                  <div className="flex items-center gap-2">
                    <Icon name="savings" size={20} className="text-[#004ac6]" />
                    <span className="text-subheadline text-[#1a1c20]">₹0 Platform Setup Cost</span>
                  </div>
                  <span className="text-footnote text-[#737686]">Launch exclusive tiers immediately</span>
                </div>
              </div>
            </div>
          </section>
        </>
      ) : (
        <>
          {/* Subscriber — free to join */}
          <section className="giant-card p-5">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="verified_user" size={20} className="text-[#004ac6]" />
              <h2 className="text-headline text-[#1a1c20]">100% Free to Join</h2>
            </div>
            <p className="text-footnote text-[#434655]">
              Zero joining fees or platform membership taxes. Browse creator profiles for free, and pay directly
              only for the individual creator tiers you choose to unlock.
            </p>
            <ul className="grid grid-cols-2 gap-2.5 mt-4">
              {PRICING_BENEFITS.map((b) => (
                <li key={b.label} className="flex items-center gap-2 text-footnote text-[#1a1c20]">
                  <Icon name={b.icon} size={18} className="text-[#004ac6]" />
                  {b.label}
                </li>
              ))}
            </ul>
            <div className="flex gap-2 items-start bg-[#f4f7ff] rounded-2xl px-4 py-3 mt-4">
              <Icon name="info" size={18} className="text-[#004ac6] shrink-0 mt-0.5" />
              <p className="text-footnote text-[#434655]">
                The final price is always shown before you confirm any payment — no surprise charges, no lock-in.
              </p>
            </div>
          </section>
        </>
      )}

      {/* Guarantees & compliance */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Icon name="tune" size={20} className="text-[#004ac6]" />
          <h2 className="text-title-2 text-[#1a1c20]">Guarantees &amp; Compliance</h2>
        </div>
        <div className="hairline giant-card overflow-hidden">
          {PRICING_GUARANTEES.map((g) => (
            <div key={g.label} className="flex gap-3.5 bg-white px-4 py-4">
              <span className="w-10 h-10 shrink-0 rounded-2xl bg-[#d7e3ff] text-[#004ac6] grid place-items-center">
                <Icon name={g.icon} size={20} />
              </span>
              <div>
                <h3 className="text-subheadline font-semibold text-[#1a1c20]">{g.label}</h3>
                <p className="text-footnote text-[#434655] mt-0.5">{g.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Questions & policies */}
      <section>
        <h2 className="text-title-2 text-[#1a1c20] mb-3">Questions &amp; Policies</h2>
        <div className="hairline giant-card overflow-hidden">
          <Link to="/faq#billing" className="inset-row bg-white text-left">
            <span className="text-subheadline text-[#1a1c20]">How does billing work?</span>
            <Icon name="chevron_right" size={20} className="text-[#737686]" />
          </Link>
          <Link to="/faq#cancellation" className="inset-row bg-white text-left">
            <span className="text-subheadline text-[#1a1c20]">Instant Refunds &amp; Cancellations</span>
            <Icon name="chevron_right" size={20} className="text-[#737686]" />
          </Link>
          <Link to="/contact" className="inset-row bg-white text-left">
            <span className="text-subheadline text-[#1a1c20]">24/7 Concierge Support</span>
            <Icon name="chevron_right" size={20} className="text-[#737686]" />
          </Link>
        </div>
      </section>

      <Link to="/auth/subscriber/register">
        <Button block size="lg" iconName="arrow_forward">Join Free — Start Exploring</Button>
      </Link>

      <p className="text-center text-footnote text-[#737686] flex items-center justify-center gap-1.5">
        <Icon name="shield" size={16} /> Encrypted sovereign banking · 1-click cancel
      </p>
    </div>
  )
}