import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import EmptyState from '../components/ui/EmptyState'
import Icon from '../components/ui/Icon'
import SearchBar from '../components/ui/SearchBar'
import { usePageTitle } from '../hooks/usePageTitle'

const CATEGORIES = [
  {
    title: 'Payments & Billing',
    icon: 'payments',
    topics: [
      { label: 'How billing works', route: '/faq#how-do-subscriptions-work' },
      { label: 'UPI AutoPay & RuPay mandates', route: '/faq#how-do-subscriptions-work' },
      { label: 'Refunds & cancellation', route: '/faq#cancellation' },
      { label: 'Creator payouts (T+1 settlements)', route: '/faq#payouts' }
    ]
  },
  {
    title: 'Account & Security',
    icon: 'fingerprint',
    topics: [
      { label: 'Registering with your +91 number', route: '/faq#register-with-phone' },
      { label: 'Email verification', route: '/faq#how-is-email-verified' },
      { label: 'Subscriber vs Creator role', route: '/faq#choose-role-at-signup' },
      { label: 'Reporting someone', route: '/faq#reporting' }
    ]
  },
  {
    title: 'Subscribing & Content',
    icon: 'subscriptions',
    topics: [
      { label: 'How subscriptions work', route: '/faq#how-do-subscriptions-work' },
      { label: 'Cancelling anytime', route: '/faq#cancellation' },
      { label: 'Viewing your transactions', route: '/faq#view-transactions' },
      { label: 'Contacting a creator', route: '/faq#contact-creator' }
    ]
  },
  {
    title: 'Creator Studio',
    icon: 'mic',
    topics: [
      { label: 'Becoming a creator', route: '/faq#become-a-creator' },
      { label: 'Verification & KYC', route: '/faq#why-verification' },
      { label: 'Setting your pricing', route: '/faq#set-pricing' },
      { label: 'Content rules', route: '/community-guidelines' }
    ]
  },
  {
    title: 'Legal & Trust',
    icon: 'shield',
    topics: [
      { label: 'Terms of Service', route: '/terms' },
      { label: 'Privacy Policy', route: '/privacy' },
      { label: 'Community Guidelines', route: '/community-guidelines' },
      { label: 'Platform Status', route: '/status' }
    ]
  }
]

export default function Help() {
  usePageTitle('Help Centre')
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return CATEGORIES
    return CATEGORIES.map((c) => ({
      ...c,
      topics: c.topics.filter((t) => t.label.toLowerCase().includes(q))
    })).filter((c) => c.topics.length)
  }, [query])

  const allEmpty = filtered.length === 0

  return (
    <div className="max-w-[520px] mx-auto px-5 py-6 space-y-6">
      <header className="text-center">
        <h1 className="text-title-1 text-[#1a1c20]">Help Centre</h1>
        <p className="text-callout text-[#434655] mt-2">
          Search help topics, or browse by category below.
        </p>
      </header>

      <SearchBar value={query} onChange={setQuery} placeholder="Search for help…" />

      {allEmpty ? (
        <EmptyState icon="search_off" title="No matching topics" desc={`Nothing matched “${query}”. Try a different keyword or contact our concierge team.`} />
      ) : (
        filtered.map((category) => (
          <section key={category.title}>
            <div className="flex items-center gap-2 mb-3">
              <Icon name={category.icon} size={20} className="text-[#004ac6]" />
              <h2 className="text-title-2 text-[#1a1c20]">{category.title}</h2>
            </div>
            <div className="hairline giant-card overflow-hidden">
              {category.topics.map((t) => (
                <Link key={`${category.title}-${t.label}`} to={t.route} className="inset-row bg-white text-left">
                  <span className="text-subheadline text-[#1a1c20]">{t.label}</span>
                  <Icon name="chevron_right" size={20} className="text-[#737686]" />
                </Link>
              ))}
            </div>
          </section>
        ))
      )}

      <section className="giant-card p-5 bg-[#f4f7ff]">
        <div className="flex items-start gap-3">
          <span className="w-10 h-10 shrink-0 rounded-2xl bg-[#004ac6] text-white grid place-items-center">
            <Icon name="support_agent" size={20} />
          </span>
          <div>
            <h2 className="text-headline text-[#1a1c20]">Still need help?</h2>
            <p className="text-footnote text-[#434655] mt-1">
              Our 24/7 concierge team replies via your verified email. Get the full FAQ, or raise a ticket.
            </p>
            <div className="flex flex-wrap gap-2.5 mt-3">
              <Link to="/faq" className="inline-block">
                <span className="bg-white border border-[#004ac6] text-[#004ac6] rounded-full px-4 py-1.5 text-caption-1 font-semibold">Full FAQ</span>
              </Link>
              <Link to="/contact" className="inline-block">
                <span className="bg-[#004ac6] text-white rounded-full px-4 py-1.5 text-caption-1 font-semibold">Contact Support</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}