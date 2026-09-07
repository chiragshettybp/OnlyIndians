import { useState, useCallback } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import usePageTitle from '../hooks/usePageTitle'
import { useAuth } from '../context/AuthContext'
import { ROLES } from '../lib/constants'
import { isValidEmail, RESEND_COOLDOWN_SECONDS } from '../lib/authUtils'
import AuthCard from '../components/auth/AuthCard'
import AuthAlert from '../components/auth/AuthAlert'
import Field from '../components/ui/Field'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import { useCountdown } from '../hooks/useAsync'

export default function ForgotPassword() {
  const { pathname } = useLocation()
  const role = pathname.split('/')[1] === 'creator' ? 'creator' : 'subscriber'
  const cfg = ROLES[role]
  usePageTitle(`Reset Password · ${cfg.label}`)

  const { resetPasswordForEmail } = useAuth()
  const nav = useNavigate()

  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [sent, setSent] = useState(false)
  const left = useCountdown(sent ? RESEND_COOLDOWN_SECONDS : 0)

  const validateEmail = useCallback((value) => {
    if (!value) return 'Enter your email address.'
    if (!isValidEmail(value)) return 'Enter a valid email address.'
    return ''
  }, [])

  const submit = async (e) => {
    e.preventDefault()
    const err = validateEmail(email)
    if (err) { setError(err); return }
    setBusy(true)
    setError('')
    const { error: e2 } = await resetPasswordForEmail(email.trim(), role)
    setBusy(false)
    if (e2) { setError(e2.message || 'We could not send a reset link. Please try again.'); return }
    setSent(true)
    nav(`/${role}/check-email`, { replace: true, state: { email: email.trim(), role, kind: 'reset' } })
  }

  const resend = useCallback(async () => {
    if (!email || left > 0) return
    setError('')
    const { error: e2 } = await resetPasswordForEmail(email.trim(), role)
    if (e2) { setError(e2.message || 'We could not resend the email. Please try again.'); return }
    setSent(true)
  }, [email, left, role, resetPasswordForEmail])

  return (
    <AuthCard
      title="Reset Your Password"
      subtitle="Enter the email on your OnlyIndians account and we&apos;ll email a secure reset link."
      footer="Protected by end-to-end encrypted session keys."
    >
      <AuthAlert error={error} />
      <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
        <Field label="Email Address" id="forgot-email" required error={error}>
          <Input
            id="forgot-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError('') }}
            onBlur={() => setError(validateEmail(email))}
            invalid={Boolean(error)}
          />
        </Field>
        <Button type="submit" block size="lg" loading={busy}>Send Reset Link</Button>
      </form>
      {sent && (
        <div className="flex flex-col gap-2 text-center text-footnote">
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
      )}
      <p className="text-center text-footnote text-[#434655]">
        Remembered it? <Link to={cfg.loginRoute} className="text-[#004ac6] font-semibold">Sign in</Link>
      </p>
    </AuthCard>
  )
}