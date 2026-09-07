import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import usePageTitle from '../hooks/usePageTitle'
import { useAuth } from '../context/AuthContext'
import { readNextPath } from '../lib/authUtils'
import AuthCard from '../components/auth/AuthCard'
import AuthAlert from '../components/auth/AuthAlert'
import Button from '../components/ui/Button'
import Icon from '../components/ui/Icon'
import Spinner from '../components/ui/Spinner'

export default function VerifyEmail() {
  usePageTitle('Verify Email')
  const { search } = useLocation()
  const nav = useNavigate()
  const { verifyByToken, user, completeVerification } = useAuth()
  const ran = useRef(false)

  const [status, setStatus] = useState('checking') // checking | success | failed

  useEffect(() => {
    if (ran.current) return
    ran.current = true
    const params = new URLSearchParams(search)
    const token = params.get('token_hash')
    const type = params.get('type') || 'email'
    if (!token) { setStatus('failed'); return }
    const doVerify = async () => {
      const { data, error } = await verifyByToken({ token_hash: token, type })
      if (error) { setStatus('failed'); return }
      const uid = user?.id ?? data?.session?.user?.id
      if (uid) await completeVerification(uid)
      setStatus('success')
    }
    doVerify()
  }, [search, verifyByToken, user, completeVerification])

  if (status === 'checking') {
    return <div className="min-h-[50vh] grid place-items-center"><Spinner label="Confirming your email…" /></div>
  }

  const next = readNextPath(search, '/verify/success')

  if (status === 'failed') {
    return (
      <AuthCard title="Verification Link Invalid" subtitle="This link is invalid or has expired." logo={false}>
        <AuthAlert error="Please request a fresh verification email to continue." />
        <Button block size="lg" onClick={() => nav('/verify/failed', { replace: true })}>Continue</Button>
      </AuthCard>
    )
  }

  return (
    <AuthCard title="Email Verified" subtitle="Your email is confirmed — welcome to OnlyIndians." logo={false}>
      <div className="rounded-2xl bg-white border border-[#e4e6f0] p-5 flex flex-col gap-3">
        <div className="flex items-start gap-3">
          <span className="w-14 h-14 rounded-full bg-[#d7e3ff] grid place-items-center text-[#004ac6] shrink-0">
            <Icon name="verified" size={28} fill />
          </span>
          <div>
            <p className="text-footnote text-[#434655]">
              {next !== '/verify/success' ? 'Continue to finish your account setup.' : "You're all set to dive in."}
            </p>
          </div>
        </div>
      </div>
      <Button block size="lg" onClick={() => nav(next, { replace: true })}>Continue</Button>
    </AuthCard>
  )
}