import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import usePageTitle from '../hooks/usePageTitle'
import { useAuth } from '../context/AuthContext'
import { ROLES } from '../lib/constants'
import { isValidPassword, passwordPolicy } from '../lib/authUtils'
import AuthCard from '../components/auth/AuthCard'
import AuthAlert from '../components/auth/AuthAlert'
import Field from '../components/ui/Field'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import Icon from '../components/ui/Icon'
import Spinner from '../components/ui/Spinner'

export default function ResetPassword() {
  const { pathname, search } = useLocation()
  const role = pathname.split('/')[1] === 'creator' ? 'creator' : 'subscriber'
  const cfg = ROLES[role]
  usePageTitle(`Set New Password · ${cfg.label}`)

  const { verifyByToken, confirmResetPassword } = useAuth()
  const nav = useNavigate()
  const ran = useRef(false)

  const [phase, setPhase] = useState('checking') // checking | ready | done | failed
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

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

  const submit = async (e) => {
    e.preventDefault()
    if (!isValidPassword(password)) { setError(passwordPolicy.description); return }
    if (password !== confirm) { setError('Passwords do not match.'); return }
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
            <Field label="New Password" id="reset-password" required error={error && ' ' ? null : null} hint={passwordPolicy.description}>
              <Input
                id="reset-password"
                type={show ? 'text' : 'password'}
                autoComplete="new-password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError('') }}
                trailing={<button type="button" aria-label={show ? 'Hide password' : 'Show password'} onClick={() => setShow((s) => !s)}><Icon name={show ? 'visibility_off' : 'visibility'} size={20} /></button>}
              />
            </Field>
            <Field label="Confirm New Password" id="reset-confirm" required>
              <Input
                id="reset-confirm"
                type={show ? 'text' : 'password'}
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => { setConfirm(e.target.value); setError('') }}
              />
            </Field>
            <Button type="submit" block size="lg" loading={busy}>Update Password</Button>
          </form>
        </>
      )}
    </AuthCard>
  )
}