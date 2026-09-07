import { useState } from 'react'
import usePageTitle from '../hooks/usePageTitle'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { updateProfile } from '../lib/api'
import { formatPhoneDisplay } from '../lib/authUtils'
import { useOnboardingNav } from '../hooks/useOnboardingNav'
import StepShell from '../components/auth/StepShell'
import AuthAlert from '../components/auth/AuthAlert'
import Field from '../components/ui/Field'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'

export default function OnboardingProfile() {
  const { user, profile, refreshProfile } = useAuth()
  const toast = useToast()
  const { goNext } = useOnboardingNav('subscriber')
  usePageTitle('Your Profile')

  const [name, setName] = useState(profile?.display_name ?? '')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const save = async () => {
    if (!name.trim()) { setError('Add your name so creators know it&apos;s really you.'); return }
    setError('')
    setBusy(true)
    const { error: e } = await updateProfile(user.id, { display_name: name.trim() })
    setBusy(false)
    if (e) { toast.error('Could not save profile', e.message); return }
    refreshProfile(user.id)
    goNext()
  }

  return (
    <StepShell
      title="Profile Details"
      subtitle="This is how OnlyIndians shows your name. Your +91 number is your ID — it&apos;s never shown to creators."
      footer={
        <div className="flex gap-3">
          <Button block size="lg" onClick={save} loading={busy}>Save &amp; Continue</Button>
        </div>
      }
    >
      <AuthAlert error={error} />
      <div className="flex flex-col gap-4">
        <Field label="Your Name" id="ob-profile-name" required error={error && ' ' ? null : null}>
          <Input
            id="ob-profile-name"
            autoComplete="name"
            placeholder="e.g. Priya Sharma"
            value={name}
            onChange={(e) => { setName(e.target.value); setError('') }}
          />
        </Field>
        <Field label="Mobile Number" hint={formatPhoneDisplay(profile?.phone)}>
          <Input id="ob-profile-phone" value={formatPhoneDisplay(profile?.phone)} readOnly className="opacity-70" />
        </Field>
        <Field label="Email" hint="Verified — used only for account security.">
          <Input id="ob-profile-email" value={profile?.email ?? ''} readOnly className="opacity-70" />
        </Field>
      </div>
    </StepShell>
  )
}