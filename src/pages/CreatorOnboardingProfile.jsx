import { useState } from 'react'
import usePageTitle from '../hooks/usePageTitle'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { upsertCreatorProfile, updateProfile } from '../lib/api'
import { CREATOR_CATEGORIES, CREATOR_PRIMARY_DISCIPLINES } from '../lib/constants'
import { useOnboardingNav } from '../hooks/useOnboardingNav'
import StepShell from '../components/auth/StepShell'
import AuthAlert from '../components/auth/AuthAlert'
import Field from '../components/ui/Field'
import Select from '../components/ui/Select'
import Textarea from '../components/ui/Textarea'
import Button from '../components/ui/Button'

export default function CreatorOnboardingProfile() {
  usePageTitle('Creator Profile')
  const { user, refreshProfile } = useAuth()
  const toast = useToast()
  const { goNext, prev, goPrev } = useOnboardingNav('creator')

  const [category, setCategory] = useState('')
  const [discipline, setDiscipline] = useState('')
  const [blurb, setBlurb] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const save = async () => {
    if (!category) { setError('Pick a category so fans find you.'); return }
    if (!discipline) { setError('Pick your primary discipline.'); return }
    setError('')
    setBusy(true)
    const { error: e1 } = await upsertCreatorProfile(user.id, { category, primary_discipline: discipline, blurb: blurb.trim() || null })
    if (e1) { setBusy(false); toast.error('Could not save creator profile', e1.message); return }
    if (blurb.trim()) {
      const { error: e2 } = await updateProfile(user.id, { bio: blurb.trim() })
      if (e2) { setBusy(false); toast.error('Could not save bio', e2.message); return }
    }
    setBusy(false)
    refreshProfile(user.id)
    goNext()
  }

  return (
    <StepShell
      title="Creator Profile"
      subtitle="Tell fans what you create and the voice they&apos;ll hear."
      footer={
        <div className="flex gap-3">
          {prev ? <Button variant="outline" size="lg" onClick={goPrev} disabled={busy}>Back</Button> : null}
          <Button block size="lg" onClick={save} loading={busy}>Save &amp; Continue</Button>
        </div>
      }
    >
      <AuthAlert error={error} />
      <div className="flex flex-col gap-4">
        <Field label="Category" id="ob-cat" required error={error && ' ' ? null : null}>
          <Select value={category} onChange={(e) => { setCategory(e.target.value); setError('') }} placeholder="Choose a category">
            {CREATOR_CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
          </Select>
        </Field>
        <Field label="Primary Discipline" id="ob-disc" required>
          <div className="flex flex-wrap gap-2">
            {CREATOR_PRIMARY_DISCIPLINES.map((d) => {
              const on = discipline === d.label
              return (
                <button
                  key={d.label}
                  type="button"
                  onClick={() => { setDiscipline(d.label); setError('') }}
                  className={`px-3 h-9 rounded-full text-footnote font-medium border transition-colors ${on ? 'bg-[#d7e3ff] border-[#004ac6] text-[#002f6c]' : 'bg-white border-[#c3c6d7] text-[#434655]'}`}
                >
                  {d.label}
                </button>
              )
            })}
          </div>
        </Field>
        <Field label="About You" id="ob-blurb" hint="A short intro shown on your public profile (up to 280 characters).">
          <Textarea
            id="ob-blurb"
            maxLength={280}
            placeholder="Stand-up on the absurd side of modern India. New bits every Friday."
            value={blurb}
            onChange={(e) => setBlurb(e.target.value)}
          />
        </Field>
      </div>
    </StepShell>
  )
}