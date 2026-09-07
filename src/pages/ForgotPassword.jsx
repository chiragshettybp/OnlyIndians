import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import usePageTitle from '../hooks/usePageTitle'
import { useAuth } from '../context/AuthContext'
import { ROLES } from '../lib/constants'
import { isValidEmail } from '../lib/authUtils'
import AuthCard from '../components/auth/AuthCard'
import AuthAlert from '../components/auth/AuthAlert'
import Field from '../components/ui/Field'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'

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

  const submit = async (e) => {
    e.preventDefault()
    if (!isValidEmail(email)) { setError('Enter a valid email address.'); return }
    setBusy(true)
    setError('')
    const { error: e2 } = await resetPasswordForEmail(email.trim(), role)
    setBusy(false)
    if (e2) { setError(e2.message || 'We could not send a reset link. Please try again.'); return }
    nav(`/${role}/check-email`, { replace: true, state: { email: email.trim(), role, kind: 'reset' } })
  }

  return (
    <AuthCard
      title="Reset Your Password"
      subtitle="Enter the email on your OnlyIndians account and we&apos;ll email a secure reset link."
      footer="Protected by end-to-end encrypted session keys."
    >
      <AuthAlert error={error} />
      <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
        <Field label="Email Address" id="forgot-email" required error={error && ' ' ? null : null}>
          <Input
            id="forgot-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError('') }}
          />
        </Field>
        <Button type="submit" block size="lg" loading={busy}>Send Reset Link</Button>
      </form>
      <p className="text-center text-footnote text-[#434655]">
        Remembered it? <Link to={cfg.loginRoute} className="text-[#004ac6] font-semibold">Sign in</Link>
      </p>
    </AuthCard>
  )
}