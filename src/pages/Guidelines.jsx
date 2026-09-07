import { Link } from 'react-router-dom'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Icon from '../components/ui/Icon'
import { usePageTitle } from '../hooks/usePageTitle'

const RULES = [
  { icon: 'favorite', title: 'Respect every creator and fan', desc: 'Differ respectfully, never attack. Harassment, hate speech, doxxing, and threats are never allowed.' },
  { icon: 'verified', title: 'Be you — but verified', desc: 'Every account is tied to one real Indian +91 number and verified email. No impersonation or bot accounts.' },
  { icon: 'child_care', title: 'Keep it safe for adults and minors alike', desc: 'No sexually explicit material, no exploitation, no self-harm promotion, and no content targeting minors inappropriately.' },
  { icon: 'copyright', title: 'Honour creators’ work', desc: 'Publish only content you own or have rights to. Reposting without permission — including paid content — is a violation.' },
  { icon: 'gavel', title: 'No abuse of the rails', desc: 'No chargeback fraud, banned-goods sales, financial scams, or misuse of UPI AutoPay facilities.' },
  { icon: 'shield', title: 'Help keep Bharat’s communities in good faith', desc: 'Language here works like a real market — the social fabric survives only if mutual obligations hold.' }
]

const MODERATION = [
  { title: 'Warnings & visibility', desc: 'First or minor violations get a warning and temporary content restrictions.' },
  { title: 'Takedowns', desc: 'Reported content found in violation is removed within hours, aligned with IT Rules (2021) timelines.' },
  { title: 'Removal', desc: 'Repeat or severe violations (fraud, harassment, illegal activity) lead to account removal and referral to relevant authorities.' }
]

export default function Guidelines() {
  usePageTitle('Community Guidelines')
  return (
    <div className="max-w-[520px] mx-auto px-5 py-6 space-y-6">
      <header>
        <Badge tone="primary" icon="verified_user">Community Guidelines</Badge>
        <h1 className="text-title-1 text-[#1a1c20] mt-3">Be safe. Be real. Be generous.</h1>
        <p className="text-callout text-[#434655] mt-2">
          OnlyIndians exists so Indian creators can earn directly and fans can support with trust. These rules
          keep the platform safe, lawful, and worth paying for.
        </p>
      </header>

      <section>
        <h2 className="text-title-2 text-[#1a1c20] mb-3">The ground rules</h2>
        <div className="hairline giant-card overflow-hidden">
          {RULES.map((r) => (
            <div key={r.title} className="flex gap-3.5 bg-white px-4 py-4">
              <span className="w-10 h-10 shrink-0 rounded-2xl bg-[#d7e3ff] text-[#004ac6] grid place-items-center">
                <Icon name={r.icon} size={20} />
              </span>
              <div>
                <h3 className="text-subheadline font-semibold text-[#1a1c20]">{r.title}</h3>
                <p className="text-footnote text-[#434655] mt-0.5">{r.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="giant-card p-5">
        <h2 className="text-headline text-[#1a1c20] mb-2">How we enforce</h2>
        <div className="space-y-3 mt-2">
          {MODERATION.map((m) => (
            <div key={m.title} className="flex gap-2.5">
              <Icon name="check_circle" size={18} className="text-[#004ac6] shrink-0 mt-0.5" />
              <div>
                <p className="text-subheadline font-semibold text-[#1a1c20]">{m.title}</p>
                <p className="text-footnote text-[#434655]">{m.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="giant-card p-5 bg-[#f4f7ff]">
        <div className="flex items-start gap-3">
          <span className="w-10 h-10 shrink-0 rounded-2xl bg-[#004ac6] text-white grid place-items-center">
            <Icon name="gavel" size={20} />
          </span>
          <div>
            <h2 className="text-headline text-[#1a1c20]">Grievance redressal</h2>
            <p className="text-footnote text-[#434655] mt-1">
              As required by the Indian IT Rules (2021), we maintain a resident grievance officer. Reports are
              acknowledged promptly and resolved with written notice. Raise a report from within the portal or
              through the Contact page.
            </p>
          </div>
        </div>
      </section>

      <Link to="/contact">
        <Button block variant="secondary" iconName="support_agent">Report a concern</Button>
      </Link>
      <p className="text-center text-caption-1 text-[#737686]">
        Guidelines may be updated — check this page and your inbox for material changes.
      </p>
    </div>
  )
}