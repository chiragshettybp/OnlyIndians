import { useState } from 'react'
import usePageTitle from '../hooks/usePageTitle'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { updateProfile, isUsernameAvailable } from '../lib/api'
import { isValidUsername, slugifyUsername } from '../lib/authUtils'
import { useOnboardingNav } from '../hooks/useOnboardingNav'
import StepShell from '../components/auth/StepShell'
import AuthAlert from '../components/auth/AuthAlert'
import Field from '../components/ui/Field'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import Icon from '../components/ui/Icon'

export default function OnboardingUsername() {
  usePageTitle('Claim Your @username')
  const { user, profile, refreshProfile } = useAuth()
  const toast = useToast()
  const { goNext, prev, goPrev } = useOnboardingNav('subscriber')

  const [raw, setRaw] = useState(profile?.username ?? '')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const slug = slugifyUsername(raw)

  const save = async () => {
    if (!slug) { setError('Choose a username — letters, numbers or underscores.'); return }
    if (!isValidUsername(slug)) { setError('3–30 characters; letters, numbers, underscores only.'); return }
    setError('')
    setBusy(true)
    const { data: available } = await isUsernameAvailable(slug)
    if (available === false) { setBusy(false); setError('That username is already taken.'); return }
    const { error: e } = await updateProfile(user.id, { username: slug })
    setBusy(false)
    if (e) {
      if (/duplicate|unique/i.test(String(e.message))) { setError('That username is already taken.'); return }
      toast.error('Could not save username', e.message)
      return
    }
    refreshProfile(user.id)
    goNext()
  }

  return (
    <StepShell
      title="Claim Your @username"
      subtitle="Your handle on OnlyIndians. Appears on your profile only — your +91 stays private."
      footer={
        <div className="flex gap-3">
          {prev ? <Button variant="outline" size="lg" onClick={goPrev} disabled={busy}>Back</Button> : null}
          <Button block size="lg" onClick={save} loading={busy}>Save &amp; Continue</Button>
        </div>
      }
    >
      <AuthAlert error={error} />
      <Field label="Username" id="ob-username" hint={slug && slug !== raw ? `@${slug}` : 'Lowercase, 3–30 characters.'}>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#737686]" aria-hidden="true"><Icon name="alternate_email" size={20} /></span>
          <Input
            id="ob-username"
            className="pl-11"
            autoCapitalize="none"
            autoComplete="off"
            placeholder="iam_desicreator"
            value={raw}
            onChange={(e) => { setRaw(e.target.value); setError('') }}
          />
        </div>
      </Field>
    </StepShell>
  )
}