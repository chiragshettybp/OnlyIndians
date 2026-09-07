import { Link } from 'react-router-dom'
import Badge from '../components/ui/Badge'
import Icon from '../components/ui/Icon'
import { usePageTitle } from '../hooks/usePageTitle'
import { PLATFORM } from '../lib/constants'

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

export default function Privacy() {
  usePageTitle('Privacy Policy')
  return (
    <div className="max-w-[520px] mx-auto px-5 py-6 space-y-4">
      {/* legal-review: placeholder legal text — requires counsel approval before launch */}
      <header>
        <Badge tone="primary" icon="lock">Legal</Badge>
        <h1 className="text-title-1 text-[#1a1c20] mt-3">Privacy Policy</h1>
        <p className="text-footnote text-[#737686] mt-1.5">Last updated: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
      </header>

      <Section num={1} title="What we collect">
        <ul className="list-disc pl-5 space-y-1">
          <li>Identity & contact: your Indian (+91) mobile number, email address, and chosen role (Subscriber or Creator).</li>
          <li>Creator verification: Government ID and PAN details, collected solely for KYC aligned with Indian IT Rules (2021) and settlement compliance.</li>
          <li>Payment data: tokens and transaction records from payment gateways. We never store card numbers or raw mandate data.</li>
          <li>Usage data: pages and features you interact with, used to operate and secure the service.</li>
        </ul>
      </Section>

      <Section num={2} title="How we use your data">
        <p>To operate your account, deliver subscriptions and content, settle payouts, prevent fraud, send verification and account notices, and comply with Indian law.</p>
      </Section>

      <Section num={3} title="Legal bases">
        <p>Processing is based on contract performance (the service you signed up for), legal compliance (RBI payment-settlement norms and Indian IT Rules 2021), and our legitimate interests in platform security and fraud prevention.</p>
      </Section>

      <Section num={4} title="Payments & third-party gateways">
        <p>Payments are processed by regulated providers (including RBI-compliant UPI/NPCI rails). Those providers receive only what is necessary to process each transaction, under their own agreements and security obligations.</p>
      </Section>

      <Section num={5} title="Sharing">
        <p>We never sell your personal data. We share it only with processors who help run the service, or where Indian law or a lawful request requires disclosure. Creators see only the details needed to serve you (such as your public display name).</p>
      </Section>

      <Section num={6} title="Retention">
        <p>We keep data only as long as needed to operate your account and meet legal (including tax and anti-money-laundering) retention periods, then delete or anonymise it.</p>
      </Section>

      <Section num={7} title="Your rights">
        <p>You may access, correct, or request deletion of your personal data, and object to or restrict certain processing. Requests are handled through your account or the Contact page, consistent with applicable Indian law.</p>
      </Section>

      <Section num={8} title="Security">
        <p>Data is protected with encryption in transit and at rest, least-privilege access controls, and continuous monitoring. Accounts use passwordless email verification with no SMS OTPs.</p>
      </Section>

      <Section num={9} title="Children">
        <p>The Platform is not directed to anyone under 18 and we do not knowingly collect their data. If you believe a minor has registered, contact the grievance officer immediately.</p>
      </Section>

      <Section num={10} title="International transfers">
        <p>None by design. All operations, people, and data stay within India, consistent with our India-only positioning.</p>
      </Section>

      <Section num={11} title="Changes">
        <p>We will notify you via your verified email about material privacy changes and post the updated policy here.</p>
      </Section>

      <Section num={12} title="Contact">
        <p>Privacy questions or data requests? Contact our data protection/grievance team through the Contact page.</p>
      </Section>

      <p className="flex items-center justify-center gap-1.5 text-caption-1 text-[#737686]">
        <Icon name="shield" size={16} /> {PLATFORM.note}
        <span>·</span><Link to="/terms" className="text-[#004ac6]">Terms of Service</Link>
      </p>
    </div>
  )
}