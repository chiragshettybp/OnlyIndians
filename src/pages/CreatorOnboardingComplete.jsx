import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import usePageTitle from '../hooks/usePageTitle'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { completeOnboarding } from '../lib/api'
import { useOnboardingNav } from '../hooks/useOnboardingNav'
import StepShell from '../components/auth/StepShell'
import AuthAlert from '../components/auth/AuthAlert'
import Button from '../components/ui/Button'
import Icon from '../components/ui/Icon'

const ITEMS = [
  { icon: 'theater_comedy', label: 'Category, discipline & about' },
  { icon: 'collections', label: 'Avatar & banner (private buckets)' },
  { icon: 'verified_user', label: 'Identity submitted — pending review' },
  { icon: 'account_balance', label: 'Payout bank details (masked)' },
  { icon: 'currency_rupee', label: 'Subscription tier set' }
]

export default function CreatorOnboardingComplete() {
  usePageTitle('Creator Studio Ready')
  const { user, refreshProfile } = useAuth()
  const { prev, goPrev } = useOnboardingNav('creator')
  const toast = useToast()
  const nav = useNavigate()

  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const finish = async () => {
    setBusy(true)
    setError('')
    const { error: e } = await completeOnboarding(user.id)
    if (e) {
      setBusy(false)
      setError(e.message || 'Could not finish setup. Please try again.')
      return
    }
    await refreshProfile(user.id)
    toast.success('Welcome to your Creator Studio!')
    nav('/creator', { replace: true })
  }

  return (
    <StepShell
      title="Your Studio Awaits"
      subtitle="Your identity is under manual review. You can start creating while we verify it."
      footer={
        <div className="flex flex-col gap-3">
          {prev ? <Button variant="outline" size="lg" onClick={goPrev} disabled={busy}>Review a Step</Button> : null}
          <Button block size="lg" onClick={finish} loading={busy}>Open Creator Studio</Button>
        </div>
      }
    >
      <AuthAlert error={error} />
      <div className="rounded-2xl bg-white border border-[#e4e6f0] p-5 flex flex-col gap-3">
        {ITEMS.map((it) => (
          <div key={it.label} className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-[#d7e3ff] grid place-items-center text-[#004ac6]"><Icon name={it.icon} size={18} /></span>
            <p className="text-footnote text-[#1a1c20]">{it.label}</p>
          </div>
        ))}
      </div>
    </StepShell>
  )
}