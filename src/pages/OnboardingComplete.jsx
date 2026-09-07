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
  { icon: 'person', label: 'Your name and +91 ID' },
  { icon: 'badge', label: 'Email verified' },
  { icon: 'palette', label: 'Languages, alerts & interests' },
  { icon: 'alternate_email', label: 'Your @username claimed' }
]

export default function OnboardingComplete() {
  usePageTitle("You're Ready")
  const { user, refreshProfile } = useAuth()
  const { goPrev, prev } = useOnboardingNav('subscriber')
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
    toast.success('Welcome to your Subscriber Portal!')
    nav('/subscriber', { replace: true })
  }

  return (
    <StepShell
      title="You&apos;re Ready!"
      subtitle="Everything is set. Dive into your subscriber portal."
      footer={
        <div className="flex flex-col gap-3">
          {prev ? <Button variant="outline" size="lg" onClick={goPrev} disabled={busy}>Review a Step</Button> : null}
          <Button block size="lg" onClick={finish} loading={busy}>Open Subscriber Portal</Button>
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