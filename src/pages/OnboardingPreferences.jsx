import { useState } from 'react'
import usePageTitle from '../hooks/usePageTitle'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { updateProfile } from '../lib/api'
import { LANGUAGES } from '../lib/constants'
import { useOnboardingNav } from '../hooks/useOnboardingNav'
import StepShell from '../components/auth/StepShell'
import AuthAlert from '../components/auth/AuthAlert'
import Field from '../components/ui/Field'
import Select from '../components/ui/Select'
import Toggle from '../components/ui/Toggle'
import Button from '../components/ui/Button'

export default function OnboardingPreferences() {
  usePageTitle('Preferences')
  const { user, profile, refreshProfile } = useAuth()
  const toast = useToast()
  const { goNext, prev, goPrev } = useOnboardingNav('subscriber')

  const [languages, setLanguages] = useState(profile?.languages ?? ['en'])
  const [contentLanguage, setContentLanguage] = useState(profile?.content_language ?? 'en')
  const [notifyEmail, setNotifyEmail] = useState(profile?.notify_email ?? true)
  const [notifyPush, setNotifyPush] = useState(profile?.notify_push ?? true)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const toggleLang = (code) => {
    setLanguages((prev) => {
      if (prev.includes(code)) return prev.filter((c) => c !== code)
      if (prev.length >= 3) { setError('Pick up to 3 languages.'); return prev }
      setError('')
      return [...prev, code]
    })
  }

  const save = async () => {
    setBusy(true)
    const { error: e } = await updateProfile(user.id, {
      languages,
      content_language: contentLanguage,
      notify_email: notifyEmail,
      notify_push: notifyPush
    })
    setBusy(false)
    if (e) { toast.error('Could not save preferences', e.message); return }
    refreshProfile(user.id)
    goNext()
  }

  return (
    <StepShell
      title="Languages &amp; Alerts"
      subtitle="Pick the languages you speak (up to 3) and how we should reach you."
      footer={
        <div className="flex gap-3">
          {prev ? <Button variant="outline" size="lg" onClick={goPrev} disabled={busy}>Back</Button> : null}
          <Button block size="lg" onClick={save} loading={busy}>Save &amp; Continue</Button>
        </div>
      }
    >
      <AuthAlert error={error} />
      <div className="flex flex-col gap-4">
        <Field label="Languages I speak" hint={`${languages.length}/3 selected`}>
          <div className="flex flex-wrap gap-2">
            {LANGUAGES.map((l) => {
              const on = languages.includes(l.code)
              return (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => toggleLang(l.code)}
                  className={`px-3 h-9 rounded-full text-footnote font-medium border transition-colors ${on ? 'bg-[#d7e3ff] border-[#004ac6] text-[#002f6c]' : 'bg-white border-[#c3c6d7] text-[#434655]'}`}
                >
                  {l.native} · {l.name}
                </button>
              )
            })}
          </div>
        </Field>
        <Field label="Content language">
          <Select value={contentLanguage} onChange={(e) => setContentLanguage(e.target.value)} placeholder="Content language">
            {LANGUAGES.map((l) => <option key={l.code} value={l.code}>{l.name}</option>)}
          </Select>
        </Field>
        <div className="rounded-2xl bg-white border border-[#e4e6f0] p-4 flex flex-col gap-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-subheadline font-medium text-[#1a1c20]">Email alerts</p>
              <p className="text-caption-1 text-[#737686]">New audio DMs and creator updates</p>
            </div>
            <Toggle id="pref-email" checked={notifyEmail} onChange={setNotifyEmail} label="Email alerts" />
          </div>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-subheadline font-medium text-[#1a1c20]">Push alerts</p>
              <p className="text-caption-1 text-[#737686]">Only for high-severity account security</p>
            </div>
            <Toggle id="pref-push" checked={notifyPush} onChange={setNotifyPush} label="Push alerts" />
          </div>
        </div>
      </div>
    </StepShell>
  )
}