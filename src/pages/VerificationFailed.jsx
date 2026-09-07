import { Link } from 'react-router-dom'
import usePageTitle from '../hooks/usePageTitle'
import AuthCard from '../components/auth/AuthCard'
import AuthAlert from '../components/auth/AuthAlert'
import Icon from '../components/ui/Icon'

export default function VerificationFailed() {
  usePageTitle('Verification Failed')
  return (
    <AuthCard title="We Couldn&apos;t Verify Your Email" subtitle="This link is invalid, expired, or already used." logo={false}>
      <AuthAlert error="Request a fresh verification email from your sign-in screen to continue." />
      <div className="rounded-2xl bg-white border border-[#e4e6f0] p-5 flex flex-col gap-3">
        <div className="flex items-start gap-3">
          <span className="w-14 h-14 rounded-full bg-[#ffedec] grid place-items-center text-[#ba1a1a] shrink-0">
            <Icon name="error" size={28} fill />
          </span>
          <div>
            <p className="text-footnote text-[#434655]">Verification links expire after 10 minutes. No SMS or phone passcodes are ever used.</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 text-footnote">
        <Link to="/subscriber/login" className="text-[#004ac6] font-semibold">Resend from Subscriber sign in</Link>
        <Link to="/creator/login" className="text-[#004ac6] font-semibold">Resend from Creator sign in</Link>
        <Link to="/help" className="text-[#737686] underline">Contact support</Link>
      </div>
    </AuthCard>
  )
}