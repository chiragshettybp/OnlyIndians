import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Accordion, { openByHash } from '../components/ui/Accordion'
import Badge from '../components/ui/Badge'
import Icon from '../components/ui/Icon'
import { usePageTitle } from '../hooks/usePageTitle'
import { PLATFORM } from '../lib/constants'

const NET = `${Math.round(PLATFORM.creatorNetShare * 100)}%`

const GROUPS = [
  {
    title: 'General',
    icon: 'all_inclusive',
    items: [
      {
        value: 'what-is-onlyindians',
        title: 'What is OnlyIndians?',
        content: 'OnlyIndians is an India-only, verified creator-subscription platform. Fans subscribe to Indian creators directly in INR, and creators keep 88% of every rupee. There are no ads, no engagement algorithms, and no foreign-platform middlemen.'
      },
      {
        value: 'who-can-use-it',
        title: 'Who can use it?',
        content: 'Anyone with a verified Indian +91 mobile number and a working email address. Both subscribers and creators must be based in India — OnlyIndians is Indian-IT-Rules (2021) and RBI compliant by design.'
      },
      {
        value: 'is-it-india-only',
        title: 'Is it really India-only?',
        content: 'Yes. Registration requires an Indian +91 mobile number, all pricing is in INR, and all settlements go to Indian bank accounts or UPI. This keeps pricing transparent with no forex markups.'
      },
      {
        value: 'how-does-it-work',
        title: 'How does it work?',
        content: 'Creators set monthly or annual subscription tiers in INR and publish exclusive content. Subscribers join free, subscribe to individual creators they trust, and pay directly via UPI AutoPay. See the How It Works page for the full journeys.'
      }
    ]
  },
  {
    title: 'Account & Authentication',
    icon: 'fingerprint',
    items: [
      {
        value: 'register-with-phone',
        title: 'Can I register with just my phone number?',
        content: 'Your +91 mobile number is your primary account identifier, but a working email address is also required. Email is used to verify your account and to send account notifications.'
      },
      {
        value: 'is-email-required',
        title: 'Is email required?',
        content: 'Yes. Email is compulsory and is used only for email verification and account-related communication — we never send bulk marketing or SMS spam. Phone numbers are never used for OTP spam.'
      },
      {
        value: 'phone-verification-required',
        title: 'Do I need to verify my phone number?',
        content: 'No. We do not send SMS OTPs. Account verification happens through a secure email verification link delivered to your inbox. Your +91 number is stored as your primary identifier without requiring SMS verification.'
      },
      {
        value: 'how-is-email-verified',
        title: 'How is email verification handled?',
        content: 'After you sign up with your +91 number and email, a confirmation email is sent to your inbox. Click the link inside to verify. If you do not see it, check Spam or use the "resend verification" option.'
      },
      {
        value: 'choose-role-at-signup',
        title: 'Can I change between Subscriber and Creator later?',
        content: 'No. You choose your role (Subscriber or Creator) during signup, and the role is fixed. The two profiles operate on separate secure paths to comply with RBI payment norms and Indian IT Rules (2021).'
      }
    ]
  },
  {
    title: 'Subscribers',
    icon: 'subscriptions',
    items: [
      {
        value: 'how-do-subscriptions-work',
        title: 'How do recurring subscriptions work?',
        content: 'Subscriptions are recurring and managed by direct INR collections. You enable a one-time UPI AutoPay mandate, then subscribe to a creator\'s tier. You are charged only what each creator advertises — the final price is always shown before you confirm payment.'
      },
      {
        value: 'cancellation',
        title: 'Can I cancel anytime?',
        content: 'Yes. Cancellation is 1-click and immediate — it takes effect at the end of the current billing period, with no lock-in and no dark patterns. You will still have access until that period ends.'
      },
      {
        value: 'view-transactions',
        title: 'Where can I see my payments and receipts?',
        content: 'Inside the Subscriber portal under Transactions. Every payment produces a receipt, and creators publish itemized GST invoices for paid tiers.'
      },
      {
        value: 'contact-creator',
        title: 'Can I message a creator I subscribe to?',
        content: 'Supported creators offer direct Q&A and member discussions inside your portal. Verification and moderation rules from the Community Guidelines apply to all messages.'
      }
    ]
  },
  {
    title: 'Creators',
    icon: 'mic',
    items: [
      {
        value: 'become-a-creator',
        title: 'How do I become a creator?',
        content: `Choose the Creator path at registration, complete your KYC (Government ID and PAN verification aligned with Indian IT Rules 2021), set your subscription tiers in INR, and start publishing. It is free — there is a ₹0 listing or setup fee.`
      },
      {
        value: 'why-verification',
        title: 'Why do creators need verification?',
        content: `${NET} payouts are guaranteed to creators and 100% subscriber protections only because every creator is verified against Indian IDs. Verification satisfies RBI payment-settlement norms and keeps bots and bad actors out.`
      },
      {
        value: 'set-pricing',
        title: 'How do I set pricing?',
        content: 'You control your rates directly — monthly and annual tiers between ₹99 and ₹9,999 per month. You can also offer customised perks such as AMAs. Subscribers always see your exact price before paying.'
      },
      {
        value: 'upload-content',
        title: 'What content can I publish?',
        content: 'HD video, podcast/audio, photo galleries, and written posts — delivered directly to your paid supporters with no algorithm throttling. Content on this platform is for subscribers only and is not indexed publicly.'
      },
      {
        value: 'payouts',
        title: 'When and how do I get paid?',
        content: `Settlements are T+1 — earnings land the next working day directly into your linked Indian bank account via NEFT/RTGS/UPI. You keep ${NET} net; tax (GST/TDS) is automated with comprehensive statements.`
      }
    ]
  },
  {
    title: 'Safety & Support',
    icon: 'shield',
    items: [
      {
        value: 'reporting',
        title: 'How do I report someone?',
        content: 'Use the built-in report action on any profile, post, or message. Reports are reviewed by our moderation and grievance team under the Indian IT Rules (2021).'
      },
      {
        value: 'what-happens-after-report',
        title: 'What happens after I report?',
        content: 'Every report is reviewed. Verified violations lead to takedowns, warnings, or account removal, and reporters receive a resolution notice. Emergencies are prioritised through the 24/7 concierge channel.'
      },
      {
        value: 'contact-support',
        title: 'How do I contact support?',
        content: 'Use the Contact page — we respond through your verified email. Everything is handled 24/7 by our concierge reliability engineering team.'
      }
    ]
  }
]

const FLAT_ALL = GROUPS.flatMap((g) => g.items)

export default function FAQ() {
  usePageTitle('Frequently Asked Questions')
  const { hash } = useLocation()
  const [open, setOpen] = useState(() => openByHash(FLAT_ALL, hash))

  useEffect(() => {
    if (hash) {
      const targets = openByHash(FLAT_ALL, hash)
      setOpen((prev) => [...new Set([...prev, ...targets])])
      if (targets[0]) {
        const id = `acc-btn-${targets[0]}`
        const t = setTimeout(() => {
          const el = document.getElementById(id)
          if (el && typeof el.scrollIntoView === 'function') {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' })
          }
        }, 60)
        return () => clearTimeout(t)
      }
    }
  }, [hash])

  const groupOpen = (group) => group.items.filter((i) => open.includes(i.value)).map((i) => i.value)

  const toggleIn = (group, next) => {
    const prev = groupOpen(group)
    const changed = next.find((v) => !prev.includes(v)) || prev.find((v) => !next.includes(v))
    if (!changed) return
    setOpen((cur) => {
      const s = new Set(cur)
      if (s.has(changed)) s.delete(changed)
      else s.add(changed)
      return [...s]
    })
  }

  return (
    <div className="max-w-[520px] mx-auto px-5 py-6 space-y-6">
      <header>
        <Badge tone="primary" icon="quiz">Frequently Asked Questions</Badge>
        <h1 className="text-title-1 text-[#1a1c20] mt-3">Questions &amp; answers</h1>
        <p className="text-callout text-[#434655] mt-2">
          Everything about OnlyIndians — from signing up to payouts. Still stuck?{' '}
          <span className="text-[#004ac6] font-semibold">Contact support</span>.
        </p>
      </header>

      {GROUPS.map((group) => (
        <section key={group.title}>
          <div className="flex items-center gap-2 mb-3">
            <Icon name={group.icon} size={20} className="text-[#004ac6]" />
            <h2 className="text-title-2 text-[#1a1c20]">{group.title}</h2>
          </div>
          <Accordion
            items={group.items}
            single={false}
            value={groupOpen(group)}
            onValueChange={(next) => toggleIn(group, next)}
          />
        </section>
      ))}

      <section className="giant-card p-5 bg-[#f4f7ff]">
        <div className="flex items-start gap-3">
          <span className="w-10 h-10 shrink-0 rounded-2xl bg-[#004ac6] text-white grid place-items-center">
            <Icon name="support_agent" size={20} />
          </span>
          <div>
            <h2 className="text-headline text-[#1a1c20]">Still need help?</h2>
            <p className="text-footnote text-[#434655] mt-1">
              Our 24/7 concierge team replies via your verified email — or visit the Help centre or Contact page.
            </p>
            <Link to="/contact" className="inline-block mt-3">
              <span className="text-[#004ac6] font-semibold">Get in touch →</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}