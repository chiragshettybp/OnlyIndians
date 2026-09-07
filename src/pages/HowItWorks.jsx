import { useState } from 'react'
import { Link } from 'react-router-dom'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Icon from '../components/ui/Icon'
import SegmentedControl from '../components/ui/SegmentedControl'
import { usePageTitle } from '../hooks/usePageTitle'

const SUBSCRIBER_STEPS = [
  { num: 1, icon: 'phone_iphone', title: 'Register with +91 & Verify Email', desc: 'Instant passwordless authentication with your mobile (+91) and verified primary email. High-grade security with no SIM-swap risks.', chips: [] },
  { num: 2, icon: 'public', title: 'Personalize Vernacular Preferences', desc: 'Tailor your feed by selecting regional languages and creative genres.', chips: ['Hindi', 'Tamil', 'Telugu', 'Bengali', 'Podcasts', 'Comedy'] },
  { num: 3, icon: 'travel_explore', title: 'Discover Homegrown Creators', desc: 'Explore verified independent journalists, classical artists, tech gurus, and entertainers across Bharat.', chips: [] },
  { num: 4, icon: 'currency_rupee', title: 'Direct INR Subscriptions', desc: '1-click UPI AutoPay, cards, and NetBanking with direct transparent creator pricing in ₹. No hidden platform markup or token conversions.', chips: [] },
  { num: 5, icon: 'play_circle', title: 'Access Exclusive Content', desc: 'Instant access to HD video masterclasses, backstage audio feeds, curated photo galleries, and member discussions.', chips: [] },
  { num: 6, icon: 'manage_accounts', title: 'Complete Consumer Control', desc: 'Full autonomy. 1-tap cancellation anytime with zero lock-in or dark patterns directly from iOS settings.', chips: [] }
]

const CREATOR_STEPS = [
  { num: 1, icon: 'rocket_launch', title: 'Zero-Fee Registration', desc: 'Sign up free with an Indian (+91) mobile number. No listing or setup fees to create your studio profile.', chips: [] },
  { num: 2, icon: 'verified_user', title: 'KYC & RBI Compliance', desc: 'Frictionless Government ID verification aligned with Indian IT and financial settlement regulations.', chips: [] },
  { num: 3, icon: 'sell', title: 'Sovereign Pricing', desc: 'Set your monthly and annual tiers in INR (₹) and offer customized subscriber perks or direct AMAs.', chips: [] },
  { num: 4, icon: 'podcasts', title: 'Publish Without Algorithm Filters', desc: 'Deliver 4K videos, podcasts, and articles directly to paid supporters with zero reach throttling.', chips: [] },
  { num: 5, icon: 'account_balance', title: 'Automated Indian Bank Payouts', desc: 'Earnings settled directly into your linked Indian bank account via NEFT/RTGS/UPI with comprehensive tax statements.', chips: [] }
]

export default function HowItWorks() {
  usePageTitle('How It Works')
  const [tab, setTab] = useState('subscriber')
  const steps = tab === 'subscriber' ? SUBSCRIBER_STEPS : CREATOR_STEPS
  const subtitle =
    tab === 'subscriber' ? 'Direct INR · UPI AutoPay' : '100% Free Setup · Direct Payouts'

  return (
    <div className="max-w-[520px] mx-auto px-5 py-6 space-y-6">
      <header className="text-center">
        <Badge tone="primary" icon="verified_user">Verified Indian Creator Ecosystem</Badge>
        <h1 className="text-title-1 text-[#1a1c20] mt-3">How OnlyIndians Works</h1>
        <p className="text-callout text-[#434655] mt-2">
          Two distinct, dedicated journeys tailored for Indian subscribers and creators.
        </p>
      </header>

      <div className="flex items-center justify-center">
        <SegmentedControl
          size="lg"
          value={tab}
          onChange={setTab}
          options={[
            { value: 'subscriber', label: 'Subscriber Journey', icon: 'person' },
            { value: 'creator', label: 'Creator Journey', icon: 'palette' }
          ]}
        />
      </div>

      <section>
        <div className="mb-4">
          <h2 className="text-headline text-[#1a1c20]">
            {tab === 'subscriber' ? '6' : '5'} {tab} Pathway
          </h2>
          <p className="text-footnote text-[#737686]">{subtitle}</p>
        </div>

        <div className="hairline giant-card overflow-hidden">
          {steps.map((s, i) => (
            <div key={s.num} className="flex gap-3.5 bg-white px-4 py-4">
              <div className="flex flex-col items-center shrink-0">
                <span className="w-9 h-9 rounded-full bg-[#d7e3ff] text-[#004ac6] grid place-items-center text-subheadline font-bold">
                  {s.num}
                </span>
                {i < steps.length - 1 ? <span className="w-px flex-1 bg-[#e7e8ee] my-1 min-h-[12px]" /> : null}
              </div>
              <div className="min-w-0 pb-1">
                <h3 className="text-subheadline font-semibold text-[#1a1c20] flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-[#eef0f7] grid place-items-center"><Icon name={s.icon} size={15} className="text-[#004ac6]" /></span>
                  {s.title}
                </h3>
                <p className="text-footnote text-[#434655] mt-1">{s.desc}</p>
                {s.chips.length ? (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {s.chips.map((c) => (
                      <span key={c} className="px-2 py-0.5 rounded-full bg-[#eef0f7] text-caption-1 text-[#434655]">{c}</span>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="giant-card p-4 flex gap-3 bg-[#f4f7ff]">
        <Icon name="info" size={20} className="text-[#004ac6] shrink-0 mt-0.5" />
        <p className="text-footnote text-[#434655]">
          <strong className="text-[#1a1c20]">Separate Onboarding.</strong> Subscriber and Creator profiles operate
          on distinct secure paths to comply with RBI payment norms and Indian IT Rules (2021). You choose your
          path at registration; onboarding for each role is handled separately inside your portal.
        </p>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Link to="/auth/subscriber/register">
          <Button block iconName="person">Start as Subscriber</Button>
        </Link>
        <Link to="/auth/creator/register">
          <Button block variant="secondary" iconName="mic">Start as Creator</Button>
        </Link>
      </section>

      <p className="text-center text-footnote text-[#737686]">
        Already registered? <Link to="/auth/subscriber/login" className="text-[#004ac6] font-semibold">Sign in</Link>
      </p>
    </div>
  )
}