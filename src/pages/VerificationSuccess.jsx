import { useNavigate } from 'react-router-dom'
import usePageTitle from '../hooks/usePageTitle'
import { useAuth } from '../context/AuthContext'
import { ROLES } from '../lib/constants'
import AuthCard from '../components/auth/AuthCard'
import Button from '../components/ui/Button'
import Icon from '../components/ui/Icon'

export default function VerificationSuccess() {
  usePageTitle('Email Verified')
  const nav = useNavigate()
  const { profile } = useAuth()
  const role = profile?.role === 'creator' ? 'creator' : 'subscriber'
  const cfg = ROLES[role]

  return (
    <AuthCard title="Email Verified" subtitle="Your email is confirmed." logo={false}>
      <div className="rounded-2xl bg-white border border-[#e4e6f0] p-5 flex flex-col gap-3">
        <div className="flex items-start gap-3">
          <span className="w-14 h-14 rounded-full bg-[#d7e3ff] grid place-items-center text-[#004ac6] shrink-0">
            <Icon name="verified" size={28} fill />
          </span>
          <div>
            <p className="text-footnote text-[#434655]">
              {profile?.onboarded
                ? 'Welcome back — open your portal.'
                : 'Finish a few quick setup steps before your account goes live.'}
            </p>
          </div>
        </div>
      </div>
      <Button block size="lg" onClick={() => nav(profile?.onboarded ? cfg.homePath : cfg.onboardingFirst, { replace: true })}>
        {profile?.onboarded ? 'Open Portal' : 'Start Setup'}
      </Button>
    </AuthCard>
  )
}