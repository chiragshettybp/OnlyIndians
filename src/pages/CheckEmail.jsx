import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import usePageTitle from '../hooks/usePageTitle'
import { useAuth } from '../context/AuthContext'
import { ROLES } from '../lib/constants'
import { useCountdown } from '../hooks/useAsync'
import AuthCard from '../components/auth/AuthCard'
import AuthAlert from '../components/auth/AuthAlert'
import Icon from '../components/ui/Icon'

export default function CheckEmail() {
  const { pathname, state } = useLocation()
  const role = pathname.split('/')[1] === 'creator' ? 'creator' : 'subscriber'
  const cfg = ROLES[role]
  usePageTitle(`Check Your Email · ${cfg.label}`)

  const { resendVerificationEmail, resetPasswordForEmail } = useAuth()
  const isReset = state?.kind === 'reset'
  const email = state?.email ?? ''

  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)
  const left = useCountdown(sent ? 30 : 0)

  const resend = async () => {
    if (!email || left > 0) return
    setError('')
    const { error: e2 } = isReset
      ? await resetPasswordForEmail(email, role)
      : await resendVerificationEmail({ email, role })
    if (e2) { setError(e2.message || 'We could not resend the email. Please try again.'); return }
    setSent(true)
  }

  return (
    <AuthCard
      title={isReset ? 'Check Your Inbox' : 'Verify Your Email'}
      subtitle={`We sent a ${isReset ? 'reset link' : 'verification link'} to ${email ? <strong>{email}</strong> : 'your email'}. It stays valid for 10 minutes.`}
      footer="No SMS, no phone passcodes — ever."
    >
      <AuthAlert error={error} />
      <div className="rounded-2xl bg-white border border-[#e4e6f0] p-5 flex flex-col gap-3">
        <div className="flex items-start gap-3">
          <span className="w-14 h-14 rounded-full bg-[#d7e3ff] grid place-items-center text-[#004ac6] shrink-0">
            <Icon name="mail" size={28} fill />
          </span>
          <div>
            <p className="text-footnote text-[#434655]">
              {isReset
                ? 'Open the email and tap the reset link to choose a new password.'
                : 'Open the email and tap Confirm Email to unlock your account.'}
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 text-footnote">
        <p className="text-[#434655]">
          Didn&apos;t get it?{' '}
          <button
            type="button"
            onClick={resend}
            disabled={Boolean(email) && left > 0}
            className="text-[#004ac6] font-semibold disabled:opacity-50"
          >
            {left > 0 ? `Resend in 0:${String(left).padStart(2, '0')}` : 'Resend email'}
          </button>
        </p>
        <p className="text-[#737686]">Check spam or promotions folders, or correct your email.</p>
        <Link to={cfg.loginRoute} className="text-[#737686] underline">Back to sign in</Link>
      </div>
    </AuthCard>
  )
}