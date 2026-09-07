import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { ROLES } from '../../lib/constants'
import { isValidPhone, isValidEmail, isValidPassword, isValidUsername, normalizePhone, slugifyUsername, passwordPolicy } from '../../lib/authUtils'
import AuthCard from './AuthCard'
import AuthAlert from './AuthAlert'
import PhoneField from './PhoneField'
import Field from '../ui/Field'
import Input from '../ui/Input'
import Button from '../ui/Button'
import Icon from '../ui/Icon'

const friendly = (e) => {
  const m = String(e?.message ?? '')
  if (/already registered|user_already_exists|email.*exist/i.test(m)) {
    return { error: 'An account already exists for this email or +91 number.', already: true }
  }
  if (/invalid registration role/i.test(m)) return 'Registration is temporarily unavailable.'
  return { error: m || 'We could not create your account. Please try again.', already: false }
}

export default function RegisterForm({ role }) {
  const cfg = ROLES[role]
  const { signUp } = useAuth()
  const nav = useNavigate()

  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [errors, setErrors] = useState({})
  const [already, setAlready] = useState(false)
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    const errs = {}
    if (!isValidPhone(phone)) errs.phone = 'Enter a valid 10-digit Indian mobile number (9…).'
    if (!isValidEmail(email)) errs.email = 'Enter a valid email address — you will need to verify it.'
    if (!isValidPassword(password)) errs.password = passwordPolicy.description
    const slug = slugifyUsername(username)
    if (username.trim() && !isValidUsername(slug)) errs.username = '3–30 characters; letters, numbers, underscores only.'
    setErrors(errs)
    if (Object.keys(errs).length) return

    setBusy(true)
    const { error } = await signUp({
      role,
      email: email.trim(),
      mobile: normalizePhone(phone),
      password,
      username: slug || null,
      displayName: null
    })
    setBusy(false)
    if (error) {
      const f = friendly(error)
      setErrors({ form: f.error })
      setAlready(f.already)
      return
    }
    try { sessionStorage.setItem('oi-check-email', JSON.stringify({ email: email.trim(), role })) } catch { /* ignore */ }
    nav(`/${role}/check-email`, { replace: true, state: { email: email.trim(), role } })
  }

  const switchRole = role === 'subscriber' ? 'creator' : 'subscriber'
  const SwitchLabel = ROLES[switchRole].label

  return (
    <AuthCard
      title={`Create ${cfg.label} Account`}
      subtitle="India-only. Your +91 number is your ID and email verification is required before you start."
      footer="Protected by end-to-end encrypted session keys."
    >
      <AuthAlert error={errors.form}>
        {errors.form && already ? (
          <span className="block mt-1">
            <Link to={`/${role}/forgot-password`} className="underline font-semibold">Reset your password</Link>{' '}
            · <Link to={`/${role}/login`} className="underline font-semibold">Sign in</Link>
          </span>
        ) : null}
      </AuthAlert>
      <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
        <PhoneField id="register-phone" value={phone} onChange={setPhone} error={errors.phone} />
        <Field label="Email Address" id="register-email" required error={errors.email} hint="We send a one-time verification link — no SMS, no phone passcodes.">
          <Input
            id="register-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setErrors((s) => ({ ...s, email: '', form: '' })) }}
            invalid={Boolean(errors.email)}
          />
        </Field>
        <Field label="Username" id="register-username" error={errors.username} hint="Optional — lowercase, 3–30 characters. You can also claim one during onboarding.">
          <Input
            id="register-username"
            type="text"
            autoCapitalize="none"
            autoComplete="off"
            placeholder="iam_desicreator"
            value={username}
            onChange={(e) => { setUsername(e.target.value); setErrors((s) => ({ ...s, username: '' })) }}
            invalid={Boolean(errors.username)}
          />
        </Field>
        <Field label="Password" id="register-password" required error={errors.password}>
          <Input
            id="register-password"
            type={show ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setErrors((s) => ({ ...s, password: '' })) }}
            invalid={Boolean(errors.password)}
            trailing={<button type="button" aria-label={show ? 'Hide password' : 'Show password'} onClick={() => setShow((s) => !s)}><Icon name={show ? 'visibility_off' : 'visibility'} size={20} /></button>}
          />
        </Field>
        <Button type="submit" block size="lg" loading={busy}>Create Account</Button>
      </form>
      <div className="flex flex-col gap-3 text-center text-footnote">
        <p className="text-[#434655]">
          Already a member?{' '}
          <Link to={cfg.loginRoute} className="text-[#004ac6] font-semibold">Sign in</Link>
        </p>
        <p className="text-[#737686]">
          Are you a {SwitchLabel}?{' '}
          <Link to={ROLES[switchRole].registerRoute} className="text-[#004ac6] font-semibold">Create a {SwitchLabel} account</Link>
        </p>
      </div>
    </AuthCard>
  )
}