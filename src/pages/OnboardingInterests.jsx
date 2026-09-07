import { useState } from 'react'
import usePageTitle from '../hooks/usePageTitle'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { updateProfile } from '../lib/api'
import { INTERESTS } from '../lib/constants'
import { useOnboardingNav } from '../hooks/useOnboardingNav'
import StepShell from '../components/auth/StepShell'
import AuthAlert from '../components/auth/AuthAlert'
import Button from '../components/ui/Button'
import Icon from '../components/ui/Icon'

export default function OnboardingInterests() {
  usePageTitle('Pick Your Interests')
  const { user, profile, refreshProfile } = useAuth()
  const toast = useToast()
  const { goNext, prev, goPrev } = useOnboardingNav('subscriber')

  const [selected, setSelected] = useState(profile?.interests ?? [])
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const toggle = (id) => {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((i) => i !== id)
      if (prev.length >= 5) { setError('Pick up to 5 interests. You can change these later.'); return prev }
      setError('')
      return [...prev, id]
    })
  }

  const save = async () => {
    if (!selected.length) { setError('Pick at least one interest.'); return }
    setBusy(true)
    const { error: e } = await updateProfile(user.id, { interests: selected })
    setBusy(false)
    if (e) { toast.error('Could not save interests', e.message); return }
    refreshProfile(user.id)
    goNext()
  }

  return (
    <StepShell
      title="What Drives You?"
      subtitle="These curate your No-Algorithms feed later. Nothing is ever shown publicly."
      footer={
        <div className="flex gap-3">
          {prev ? <Button variant="outline" size="lg" onClick={goPrev} disabled={busy}>Back</Button> : null}
          <Button block size="lg" onClick={save} loading={busy}>{selected.length ? 'Save' : 'Skip'}</Button>
        </div>
      }
    >
      <AuthAlert error={error} />
      <div className="grid grid-cols-1 gap-3">
        {INTERESTS.map((it) => {
          const on = selected.includes(it.id)
          return (
            <button
              key={it.id}
              type="button"
              onClick={() => toggle(it.id)}
              className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition-colors ${on ? 'bg-[#d7e3ff] border-[#004ac6]' : 'bg-white border-[#e4e6f0]'}`}
            >
              <Icon name={on ? 'check_circle' : 'circle'} size={24} fill={on} className={on ? 'text-[#004ac6]' : 'text-[#c3c6d7]'} />
              <div className="flex-1 min-w-0">
                <p className="text-subheadline font-medium text-[#1a1c20]">{it.label}</p>
                <p className="text-caption-1 text-[#737686]">{it.desc}</p>
              </div>
            </button>
          )
        })}
      </div>
    </StepShell>
  )
}