import { useState, useCallback, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { ROLES } from '../../lib/constants'
import {
  isValidEmail,
  normalizePhone,
  slugifyUsername,
  calculatePasswordStrength,
  getPasswordStrengthLabel,
  getPasswordStrengthColor,
  isReservedUsername,
  passwordPolicy,
} from '../../lib/authUtils'
import AuthCard from './AuthCard'
import AuthAlert from './AuthAlert'
import PhoneField from './PhoneField'
import Field from '../ui/Field'
import Input from '../ui/Input'
import Button from '../ui/Button'
import Icon from '../ui/Icon'
import Checkbox from '../ui/Checkbox'
import PasswordStrength from '../ui/PasswordStrength'

const friendly = (e) => {
  const m = String(e?.message ?? '')
  if (/already registered|user_already_exists|email.*exist/i.test(m)) {
    return { error: 'An account already exists for this email or +91 number.', already: true }
  }
  if (/invalid registration role/i.test(m)) return 'Registration is temporarily unavailable.'
  return { error: m || 'We could not create your account. Please try again.', already: false }
}

const USERNAME_DEBOUNCE_MS = 300
const REVEAL_DURATION = 1000

export default function RegisterForm({ role }) {
  const cfg = ROLES[role]
  const { signUp } = useAuth()
  const nav = useNavigate()

  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [ageConfirmed, setAgeConfirmed] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [errors, setErrors] = useState({})
  const [already, setAlready] = useState(false)
  const [busy, setBusy] = useState(false)
  const [usernameStatus, setUsernameStatus] = useState('idle')
  const usernameDebounceRef = useRef(null)

  const revealTimersRef = useRef(new Map())
  const passwordInputRef = useRef(null)
  const confirmInputRef = useRef(null)

  const clearRevealTimers = useCallback(() => {
    revealTimersRef.current.forEach((timer) => clearTimeout(timer))
    revealTimersRef.current.clear()
  }, [])

  const handlePasswordChange = useCallback((e) => {
    const newValue = e.target.value
    const prevValue = password
    setPassword(newValue)
    setErrors((s) => ({ ...s, password: '', form: '' }))

    clearRevealTimers()

    if (newValue.length > prevValue.length) {
      const addedChars = newValue.length - prevValue.length
      for (let i = 0; i < addedChars; i++) {
        const index = prevValue.length + i
        const timer = setTimeout(() => {
          if (passwordInputRef.current) {
            passwordInputRef.current.setSelectionRange(index + 1, index + 1)
          }
        }, REVEAL_DURATION)
        revealTimersRef.current.set(index, timer)
      }
    }

    if (confirmPassword) {
      setErrors((s) => ({ ...s, confirmPassword: '' }))
    }
  }, [password, confirmPassword, clearRevealTimers])

  const handleConfirmChange = useCallback((e) => {
    const newValue = e.target.value
    const prevValue = confirmPassword
    setConfirmPassword(newValue)
    setErrors((s) => ({ ...s, confirmPassword: '' }))

    clearRevealTimers()

    if (newValue.length > prevValue.length) {
      const addedChars = newValue.length - prevValue.length
      for (let i = 0; i < addedChars; i++) {
        const index = prevValue.length + i
        const timer = setTimeout(() => {
          if (confirmInputRef.current) {
            confirmInputRef.current.setSelectionRange(index + 1, index + 1)
          }
        }, REVEAL_DURATION)
        revealTimersRef.current.set(index, timer)
      }
    }
  }, [confirmPassword, clearRevealTimers])

  const handlePasswordBlur = useCallback(() => {
    clearRevealTimers()
    setShowPassword(false)
  }, [clearRevealTimers])

  useEffect(() => {
    return () => clearRevealTimers()
  }, [clearRevealTimers])

  const validatePhone = useCallback((value) => {
    if (!value) return 'Enter your 10-digit Indian mobile number.'
    const digits = value.replace(/[^0-9]/g, '')
    if (digits.length !== 10) return 'Enter a valid 10-digit Indian mobile number.'
    if (!/^[6-9]/.test(digits)) return 'Indian mobile numbers must start with 6, 7, 8, or 9.'
    return ''
  }, [])

  const validateEmail = useCallback((value) => {
    if (!value) return 'Enter your email address.'
    if (!isValidEmail(value)) return 'Enter a valid email address — you will need to verify it.'
    return ''
  }, [])

  const validateUsername = useCallback((value) => {
    if (!value) return ''
    const slug = slugifyUsername(value)
    if (slug.length < 3) return 'Username must be at least 3 characters.'
    if (slug.length > 30) return 'Username cannot exceed 30 characters.'
    if (!/^[a-z0-9_]+$/.test(slug)) return 'Only lowercase letters, numbers, and underscores allowed.'
    if (isReservedUsername(slug)) return 'This username is reserved.'
    return ''
  }, [])

  const validatePassword = useCallback((value) => {
    if (!value) return 'Create a password.'
    if (value.length < passwordPolicy.min) return `Password must be at least ${passwordPolicy.min} characters.`
    if (value.length > passwordPolicy.max) return `Password cannot exceed ${passwordPolicy.max} characters.`
    if (!/[a-zA-Z]/.test(value)) return 'Password must contain at least one letter.'
    if (!/\d/.test(value)) return 'Password must contain at least one number.'
    return ''
  }, [])

  const validateConfirmPassword = useCallback((value, pwd) => {
    if (!value) return 'Confirm your password.'
    if (value !== pwd) return 'Passwords do not match.'
    return ''
  }, [])

  const checkUsernameAvailability = useCallback(async (slug) => {
    if (!slug || slug.length < 3) {
      setUsernameStatus('idle')
      return
    }
    setUsernameStatus('checking')
    try {
      const res = await fetch(`/api/check-username?username=${encodeURIComponent(slug)}`)
      if (res.ok) {
        const data = await res.json()
        setUsernameStatus(data.available ? 'available' : 'taken')
      } else {
        setUsernameStatus('idle')
      }
    } catch {
      setUsernameStatus('idle')
    }
  }, [])

  const handleUsernameChange = (e) => {
    const value = e.target.value
    const slug = slugifyUsername(value)
    setUsername(value)
    setErrors((s) => ({ ...s, username: '', form: '' }))
    setUsernameStatus('idle')

    if (usernameDebounceRef.current) clearTimeout(usernameDebounceRef.current)
    usernameDebounceRef.current = setTimeout(() => {
      checkUsernameAvailability(slug)
    }, USERNAME_DEBOUNCE_MS)
  }

  const submit = async (e) => {
    e.preventDefault()
    clearRevealTimers()

    const errs = {}
    const phoneErr = validatePhone(phone)
    if (phoneErr) errs.phone = phoneErr

    const emailErr = validateEmail(email)
    if (emailErr) errs.email = emailErr

    const usernameErr = validateUsername(username)
    if (usernameErr) errs.username = usernameErr

    const pwdErr = validatePassword(password)
    if (pwdErr) errs.password = pwdErr

    const confirmErr = validateConfirmPassword(confirmPassword, password)
    if (confirmErr) errs.confirmPassword = confirmErr

    if (!ageConfirmed) errs.age = 'You must confirm that you are 18 years of age or older.'
    if (!termsAccepted) errs.terms = 'You must accept the Terms of Service and Privacy Policy.'

    if (usernameStatus === 'checking') errs.username = 'Checking username availability…'
    if (usernameStatus === 'taken') errs.username = 'This username is already taken.'

    setErrors(errs)
    if (Object.keys(errs).length) return

    setBusy(true)
    const { error } = await signUp({
      role,
      email: email.trim(),
      mobile: normalizePhone(phone),
      password,
      username: slugifyUsername(username) || null,
      displayName: null,
      ageConfirmed: true,
      termsAccepted: true,
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

  calculatePasswordStrength(password)
  getPasswordStrengthLabel(password)
  getPasswordStrengthColor(password)

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
        <PhoneField
          id="register-phone"
          value={phone}
          onChange={setPhone}
          onBlur={() => setErrors((s) => ({ ...s, phone: validatePhone(phone) }))}
          error={errors.phone}
          hint="Enter your 10-digit Indian mobile number."
        />
        <Field label="Email Address" id="register-email" required error={errors.email} hint="We send a one-time verification link — no SMS, no phone passcodes.">
          <Input
            id="register-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setErrors((s) => ({ ...s, email: '', form: '' })) }}
            onBlur={(e) => setErrors((s) => ({ ...s, email: validateEmail(e.target.value) }))}
            invalid={Boolean(errors.email)}
          />
        </Field>
        <Field label="Username" id="register-username" error={errors.username} hint="Lowercase, 3–30 characters. Letters, numbers, underscores only.">
          <div className="relative">
            <Input
              id="register-username"
              type="text"
              autoCapitalize="none"
              autoComplete="username"
              placeholder="iam_desicreator"
              value={username}
              onChange={handleUsernameChange}
              onBlur={() => {
                setErrors((s) => ({ ...s, username: validateUsername(username) }))
              }}
              invalid={Boolean(errors.username)}
              className="pr-12"
            />
            {usernameStatus === 'checking' && (
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#004ac6] flex items-center gap-1.5 text-caption-1" aria-live="polite">
                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Checking…
              </span>
            )}
            {usernameStatus === 'available' && (
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#00a794] flex items-center gap-1.5 text-caption-1" aria-live="polite">
                <Icon name="check_circle" size={16} fill /> Available
              </span>
            )}
            {usernameStatus === 'taken' && (
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#ba1a1a] flex items-center gap-1.5 text-caption-1" aria-live="polite">
                <Icon name="error" size={16} fill /> Taken
              </span>
            )}
          </div>
        </Field>
        <Field label="Password" id="register-password" required error={errors.password} hint={passwordPolicy.description}>
          <Input
            ref={passwordInputRef}
            id="register-password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="••••••••"
            value={password}
            onChange={handlePasswordChange}
            onBlur={handlePasswordBlur}
            invalid={Boolean(errors.password)}
            trailing={
              <button
                type="button"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword((s) => !s)}
                onMouseDown={(e) => e.preventDefault()}
              >
                <Icon name={showPassword ? 'visibility_off' : 'visibility'} size={20} />
              </button>
            }
          />
        </Field>
        {password && <PasswordStrength password={password} />}
        <Field label="Confirm Password" id="register-confirm" required error={errors.confirmPassword}>
          <Input
            ref={confirmInputRef}
            id="register-confirm"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={handleConfirmChange}
            onBlur={handlePasswordBlur}
            invalid={Boolean(errors.confirmPassword)}
          />
        </Field>
        <Checkbox
          id="age-confirm"
          checked={ageConfirmed}
          onChange={(e) => setAgeConfirmed(e.target.checked)}
          required
          error={Boolean(errors.age)}
          label="I confirm that I am 18 years of age or older."
        />
        <Checkbox
          id="terms-accept"
          checked={termsAccepted}
          onChange={(e) => setTermsAccepted(e.target.checked)}
          required
          error={Boolean(errors.terms)}
          label="I agree to the "
        >
          <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-[#004ac6] underline hover:text-[#002f6c]">Terms of Service</a>{' '}
          and{' '}
          <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-[#004ac6] underline hover:text-[#002f6c]">Privacy Policy</a>.
        </Checkbox>
        <Button type="submit" block size="lg" loading={busy} disabled={!ageConfirmed || !termsAccepted}>
          Create Account
        </Button>
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