import { Link } from 'react-router-dom'
import Badge from '../components/ui/Badge'
import Icon from '../components/ui/Icon'
import { usePageTitle } from '../hooks/usePageTitle'
import { PLATFORM, BRAND } from '../lib/constants'

function Section({ num, title, children }) {
  return (
    <section className="giant-card p-5">
      <h2 className="text-headline text-[#1a1c20] mb-2 flex items-baseline gap-2">
        <span className="text-[#004ac6] font-bold text-subheadline">{num}.</span> {title}
      </h2>
      <div className="text-footnote text-[#434655] space-y-2 leading-relaxed">{children}</div>
    </section>
  )
}

export default function Terms() {
  usePageTitle('Terms of Service')
  return (
    <div className="max-w-[520px] mx-auto px-5 py-6 space-y-4">
      {/* legal-review: placeholder legal text — requires counsel approval before launch */}
      <header>
        <Badge tone="primary" icon="description">Legal</Badge>
        <h1 className="text-title-1 text-[#1a1c20] mt-3">Terms of Service</h1>
        <p className="text-footnote text-[#737686] mt-1.5">Last updated: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
      </header>

      <Section num={1} title="Acceptance of Terms">
        <p>By accessing or using {BRAND.name} (the “Platform”), you agree to be bound by these Terms of Service and our Community Guidelines. If you do not agree, do not use the Platform.</p>
      </Section>

      <Section num={2} title="Eligibility">
        <ul className="list-disc pl-5 space-y-1">
          <li>You must be at least 18 years old.</li>
          <li>You must be resident in India and register with your own Indian (+91) mobile number and a valid email address.</li>
          <li>The Platform is India-only. Non-Indian residents may not use it.</li>
        </ul>
      </Section>

      <Section num={3} title="Accounts & Roles">
        <p>At registration you choose either a Subscriber or a Creator account. The role is fixed and cannot be swapped later. You are responsible for safeguarding your credentials; login is passwordless via your verified email.</p>
      </Section>

      <Section num={4} title="Subscriptions & Billing">
        <p>Creators set their own recurring prices in INR (₹). You will always see the final price before you confirm any payment. Subscriptions renew automatically via the UPI AutoPay mandates described below until cancelled. You may cancel with one click; cancellation takes effect at the end of the current billing period, giving you access until that period completes.</p>
      </Section>

      <Section num={5} title="Payments & UPI AutoPay">
        <p>Payments are processed through RBI-compliant, tokenized UPI AutoPay rails (including RuPay cards and popular UPI apps). We never store your card or mandate data unencrypted. GST charges appear in your receipts and invoices as applicable.</p>
      </Section>

      <Section num={6} title="Content & Intellectual Property">
        <p>Creators own the content they publish and grant the Platform a limited licence to host, transmit, and display that content solely to enable the service. Subscribers may access paid content only for personal, non-commercial use and may not redistribute it.</p>
      </Section>

      <Section num={7} title="Prohibited Conduct">
        <p>You may not use the Platform for harassment, hate speech, doxxing, fraud, chargeback abuse, unlawful goods or services, sexual exploitation, or any activity that violates Indian law or our Community Guidelines.</p>
      </Section>

      <Section num={8} title="Moderation & Grievance">
        <p>We proactively moderate content and honour the Indian IT Rules (2021), including a resident grievance officer. Complaints are acknowledged and resolved on the timelines mandated by law. See the Community Guidelines for enforcement details.</p>
      </Section>

      <Section num={9} title="Creator Payouts">
        <p>Verified Creators retain {Math.round(PLATFORM.creatorNetShare * 100)}% of gross subscriber receipts. Settlements are delivered on a next-working-day (T+1) basis to the creator’s linked Indian bank account or UPI. Tax (TDS/GST) is deducted and reported automatically.</p>
      </Section>

      <Section num={10} title="Termination">
        <p>We may suspend or terminate accounts that violate these Terms or the law, with or without notice. You may stop using the Platform at any time; you remain responsible for sums due before termination.</p>
      </Section>

      <Section num={11} title="Disclaimers">
        <p>The Platform is provided “as is” and “as available”, without warranties of any kind, express or implied. We do not guarantee uninterrupted availability.</p>
      </Section>

      <Section num={12} title="Limitation of Liability">
        <p>To the fullest extent permitted by Indian law, {BRAND.name} shall not be liable for indirect, incidental, or consequential damages arising from use of the Platform or services purchased through it.</p>
      </Section>

      <Section num={13} title="Governing Law & Disputes">
        <p>These Terms are governed by the laws of India. Disputes are subject to the exclusive jurisdiction of the courts at Mumbai, Maharashtra, subject to any mandatory consumer-protection provisions that apply to you.</p>
      </Section>

      <Section num={14} title="Changes to These Terms">
        <p>We may update these Terms from time to time. Material changes will be communicated to your verified email and posted on this page. Continued use after changes constitutes acceptance.</p>
      </Section>

      <Section num={15} title="Contact">
        <p>Questions about these Terms? Reach us through the Contact page — our grievance and support team responds via your verified email.</p>
      </Section>

      <p className="flex items-center justify-center gap-1.5 text-caption-1 text-[#737686]">
        <Icon name="shield" size={16} /> {PLATFORM.note}
        <span>·</span><Link to="/privacy" className="text-[#004ac6]">Privacy Policy</Link>
      </p>
    </div>
  )
}