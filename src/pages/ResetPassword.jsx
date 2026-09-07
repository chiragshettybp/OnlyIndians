import { useEffect, useRef, useState, useCallback } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import usePageTitle from '../hooks/usePageTitle'
import { useAuth } from '../context/AuthContext'
import { ROLES } from '../lib/constants'
import {
  passwordPolicy,
  calculatePasswordStrength,
  getPasswordStrengthLabel,
} from '../lib/authUtils'
import AuthCard from '../components/auth/AuthCard'
import AuthAlert from '../components/auth/AuthAlert'
import Field from '../components/ui/Field'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import Icon from '../components/ui/Icon'
import Spinner from '../components/ui/Spinner'
import PasswordStrength from '../components/ui/PasswordStrength'

const REVEAL_DURATION = 1000

export default function ResetPassword() {
  const { pathname, search } = useLocation()
  const role = pathname.split('/')[1] === 'creator' ? 'creator' : 'subscriber'
  const cfg = ROLES[role]
  usePageTitle(`Set New Password · ${cfg.label}`)

  const { verifyByToken, confirmResetPassword } = useAuth()
  const nav = useNavigate()
  const ran = useRef(false)

  const [phase, setPhase] = useState('checking')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
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

  useEffect(() => {
    return () => clearRevealTimers()
  }, [clearRevealTimers])

  useEffect(() => {
    if (ran.current) return
    ran.current = true
    const params = new URLSearchParams(search)
    const token = params.get('token_hash')
    const type = params.get('type') || 'recovery'
    if (!token) { setPhase('failed'); return }
    const doVerify = async () => {
      const { error: e2 } = await verifyByToken({ token_hash: token, type })
      setPhase(e2 ? 'failed' : 'ready')
    }
    doVerify()
  }, [search, verifyByToken])

  const validatePassword = useCallback((value) => {
    if (!value) return 'Enter a new password.'
    if (value.length < passwordPolicy.min) return `Password must be at least ${passwordPolicy.min} characters.`
    if (value.length > passwordPolicy.max) return `Password cannot exceed ${passwordPolicy.max} characters.`
    if (!/[a-zA-Z]/.test(value)) return 'Password must contain at least one letter.'
    if (!/\d/.test(value)) return 'Password must contain at least one number.'
    return ''
  }, [])

  const validateConfirm = useCallback((value, pwd) => {
    if (!value) return 'Confirm your new password.'
    if (value !== pwd) return 'Passwords do not match.'
    return ''
  }, [])

  const submit = async (e) => {
    e.preventDefault()
    clearRevealTimers()

    const pwdErr = validatePassword(password)
    if (pwdErr) { setError(pwdErr); return }

    const confirmErr = validateConfirm(confirm, password)
    if (confirmErr) { setError(confirmErr); return }

    setBusy(true)
    setError('')
    const { error: e2 } = await confirmResetPassword(password)
    setBusy(false)
    if (e2) { setError(e2.message || 'We could not update your password. Please try again.'); return }
    setPhase('done')
  }

  if (phase === 'checking') {
    return <div className="min-h-[50vh] grid place-items-center"><Spinner label="Checking your reset link…" /></div>
  }

  calculatePasswordStrength(password)
  getPasswordStrengthLabel(password)

  return (
    <AuthCard
      title={phase === 'done' ? 'Password Updated' : 'Set a New Password'}
      subtitle={phase === 'done'
        ? 'Your password has been updated. Sign in with your new password.'
        : 'Create a strong password for your OnlyIndians account.'}
      footer="Protected by end-to-end encrypted session keys."
    >
      {phase === 'failed' ? (
        <>
          <AuthAlert error="This reset link is invalid or has expired." />
          <div className="flex flex-col gap-3 text-center text-footnote">
            <Link to={`/${role}/forgot-password`} className="text-[#004ac6] font-semibold">Request a new reset link</Link>
            <Link to={cfg.loginRoute} className="text-[#737686]">Back to sign in</Link>
          </div>
        </>
      ) : phase === 'done' ? (
        <div className="flex flex-col gap-3">
          <Button block size="lg" onClick={() => nav(cfg.loginRoute, { replace: true })}>Sign In</Button>
        </div>
      ) : (
        <>
          <AuthAlert error={error} />
          <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
            <Field label="New Password" id="reset-password" required error={error} hint={passwordPolicy.description}>
              <Input
                ref={passwordInputRef}
                id="reset-password"
                type={show ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="••••••••"
                value={password}
                onChange={handlePasswordChange}
                onBlur={handlePasswordBlur}
                invalid={Boolean(error)}
                trailing={
                  <button
                    type="button"
                    aria-label={show ? 'Hide password' : 'Show password'}
                    onClick={() => setShow((s) => !s)}
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    <Icon name={show ? 'visibility_off' : 'visibility'} size={20} />
                  </button>
                }
              />
            </Field>
            {password && <PasswordStrength password={password} />}
            <Field label="Confirm New Password" id="reset-confirm" required error={error}>
              <Input
                id="reset-confirm"
                type={show ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="••••••••"
                value={confirm}
                onChange={(e) => { setConfirm(e.target.value); setError('') }}
                invalid={Boolean(error)}
              />
            </Field>
            <Button type="submit" block size="lg" loading={busy}>Update Password</Button>
          </form>
        </>
      )}
    </AuthCard>
  )
}