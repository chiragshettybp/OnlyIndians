import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { ROLES } from '../../lib/constants'
import { looksLikePhone, normalizePhone, isValidPhone } from '../../lib/authUtils'
import AuthCard from './AuthCard'
import AuthAlert from './AuthAlert'
import PhoneField from './PhoneField'
import Field from '../ui/Field'
import Input from '../ui/Input'
import Button from '../ui/Button'
import Icon from '../ui/Icon'

// Phone-first login form shared by subscriber and creator pipelines.
const friendly = (e) => {
  const m = String(e?.message ?? '')
  if (/invalid_credentials|invalid login|invalid log in/i.test(m)) {
    return 'Your +91 number or email and password did not match.'
  }
  return m || 'We could not sign you in. Please try again.'
}

export default function LoginForm({ role }) {
  const cfg = ROLES[role]
  const { signIn } = useAuth()
  const nav = useNavigate()
  const { state } = useLocation()

  const [credential, setCredential] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const [fieldError, setFieldError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setFieldError('')
    const isPhone = looksLikePhone(credential)
    if (isPhone && !isValidPhone(credential)) {
      setFieldError('Enter a valid 10-digit Indian mobile number (9…).')
      return
    }
    if (!String(credential || '').trim() || !password) {
      setError('Enter your +91 number or email and your password.')
      return
    }
    setBusy(true)
    setError('')
    const { error: e2 } = await signIn({ credential: normalizePhone(credential) || credential, password })
    setBusy(false)
    if (e2) { setError(friendly(e2)); return }
    nav(state?.from || cfg.homePath, { replace: true })
  }

  const switchRole = role === 'subscriber' ? 'creator' : 'subscriber'
  const SwitchLabel = ROLES[switchRole].label

  return (
    <AuthCard
      title={`Sign In · ${cfg.label}`}
      subtitle={`Your +91 number is your OnlyIndians ID. No SMS or phone passcodes — ever.`}
      footer="Protected by end-to-end encrypted session keys."
    >
      <AuthAlert error={error} />
      <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
        <PhoneField
          id="login-phone"
          value={credential}
          onChange={(v) => { setCredential(v); setError('') }}
          error={fieldError}
          hint="Or use the email you registered with."
        />
        <Field label="Password" id="login-password" required error={error && ' ' ? null : null}>
          <Input
            id="login-password"
            type={show ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError('') }}
            trailing={<button type="button" aria-label={show ? 'Hide password' : 'Show password'} onClick={() => setShow((s) => !s)}><Icon name={show ? 'visibility_off' : 'visibility'} size={20} /></button>}
          />
        </Field>
        <Button type="submit" block size="lg" loading={busy}>Sign In</Button>
      </form>
      <div className="flex flex-col gap-3 text-center text-footnote">
        <Link to={`/${role}/forgot-password`} className="text-[#004ac6] font-semibold">Forgot password?</Link>
        <p className="text-[#434655]">
          New to OnlyIndians?{' '}
          <Link to={cfg.registerRoute} className="text-[#004ac6] font-semibold">Create a free account</Link>
        </p>
        <p className="text-[#737686]">
          Looking for the {SwitchLabel} portal?{' '}
          <Link to={ROLES[switchRole].loginRoute} className="text-[#004ac6] font-semibold">Sign in as {SwitchLabel}</Link>
        </p>
      </div>
    </AuthCard>
  )
}