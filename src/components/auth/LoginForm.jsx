import { useState, useRef, useEffect, useCallback } from 'react'
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

const friendly = (e) => {
  const m = String(e?.message ?? '')
  if (/invalid_credentials|invalid login|invalid log in/i.test(m)) {
    return 'Your +91 number or email and password did not match.'
  }
  return m || 'We could not sign you in. Please try again.'
}

const REVEAL_DURATION = 1000

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

  const revealTimersRef = useRef(new Map())
  const passwordInputRef = useRef(null)

  const clearRevealTimers = useCallback(() => {
    revealTimersRef.current.forEach((timer) => clearTimeout(timer))
    revealTimersRef.current.clear()
  }, [])

  const handlePasswordChange = useCallback((e) => {
    const newValue = e.target.value
    const prevValue = password
    setPassword(newValue)
    setError('')

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
  }, [password, clearRevealTimers])

  const handlePasswordBlur = useCallback(() => {
    clearRevealTimers()
    setShow(false)
  }, [clearRevealTimers])

  const handleShowToggle = useCallback(() => {
    setShow((s) => !s)
  }, [])

  useEffect(() => {
    return () => clearRevealTimers()
  }, [clearRevealTimers])

  const submit = async (e) => {
    e.preventDefault()
    clearRevealTimers()
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
          onBlur={() => setFieldError(v => validatePhone(v))}
          error={fieldError}
          hint="Or use the email you registered with."
        />
        <Field label="Password" id="login-password" required error={error && ' ' ? null : null}>
          <Input
            ref={passwordInputRef}
            id="login-password"
            type={show ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={handlePasswordChange}
            onBlur={handlePasswordBlur}
            trailing={
              <button
                type="button"
                aria-label={show ? 'Hide password' : 'Show password'}
                onClick={handleShowToggle}
                onMouseDown={(e) => e.preventDefault()}
              >
                <Icon name={show ? 'visibility_off' : 'visibility'} size={20} />
              </button>
            }
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

function validatePhone(value) {
  if (!value) return 'Enter your 10-digit Indian mobile number.'
  const digits = value.replace(/[^0-9]/g, '')
  if (digits.length !== 10) return 'Enter a valid 10-digit Indian mobile number.'
  if (!/^[6-9]/.test(digits)) return 'Indian mobile numbers must start with 6, 7, 8, or 9.'
  return ''
}