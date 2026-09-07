import { useEffect, useRef, useState } from 'react'
import usePageTitle from '../hooks/usePageTitle'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { updateProfile, uploadPrivateFile } from '../lib/api'
import { STORAGE_BUCKETS } from '../lib/constants'
import { useOnboardingNav } from '../hooks/useOnboardingNav'
import { pickImageFile, avatarKey } from '../lib/onboarding'
import StepShell from '../components/auth/StepShell'
import AuthAlert from '../components/auth/AuthAlert'
import Button from '../components/ui/Button'
import Icon from '../components/ui/Icon'

export default function OnboardingAvatar() {
  usePageTitle('Add a Profile Photo')
  const { user, refreshProfile } = useAuth()
  const toast = useToast()
  const { goNext, prev, goPrev } = useOnboardingNav('subscriber')
  const inputRef = useRef(null)

  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!file) { setPreview(''); return }
    const url = URL.createObjectURL(file)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  const onPick = (e) => {
    const f = e.target.files?.[0]
    setError('')
    if (!f) return
    const { file: ok, error: err } = pickImageFile(f, 4 * 1024 * 1024, 'Profile photo')
    if (err) { setError(err); setFile(null); return }
    setFile(ok)
    e.target.value = ''
  }

  const save = async () => {
    if (!file) { setError('Choose a photo or skip this step for now.'); return }
    setError('')
    setBusy(true)
    const path = avatarKey(user.id, file.name)
    const { data, error: e } = await uploadPrivateFile(STORAGE_BUCKETS.avatars, path, file)
    if (e) { setBusy(false); toast.error('Upload failed', e.message); return }
    const { error: e2 } = await updateProfile(user.id, { avatar_url: data.path })
    setBusy(false)
    if (e2) { toast.error('Could not save photo', e2.message); return }
    refreshProfile(user.id)
    goNext()
  }

  const skip = () => goNext()

  return (
    <StepShell
      title="Add a Profile Photo"
      subtitle="A clear, friendly photo helps creators recognize you. Stored privately — only you can see it in storage."
      footer={
        <div className="flex gap-3">
          {prev ? <Button variant="outline" size="lg" onClick={goPrev} disabled={busy}>Back</Button> : null}
          <Button block size="lg" onClick={save} loading={busy}>Save &amp; Continue</Button>
        </div>
      }
    >
      <AuthAlert error={error} />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="relative w-full aspect-square max-w-[200px] mx-auto rounded-full bg-[#eef0f7] border border-[#c3c6d7] overflow-hidden grid place-items-center hover:bg-[#d7e3ff] transition-colors"
        aria-label="Choose profile photo"
      >
        {preview ? (
          <img src={preview} alt="Profile photo preview" className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-1 text-[#737686]">
            <Icon name="add_a_photo" size={32} />
            <span className="text-caption-1 font-medium">Choose photo</span>
          </div>
        )}
      </button>
      <input ref={inputRef} type="file" accept="image/png,image/jpeg,image/webp" onChange={onPick} className="hidden" />
      <p className="text-center text-caption-1 text-[#737686]">PNG, JPEG or WebP · up to 4 MB · square</p>
      <div className="text-center">
        <button type="button" onClick={skip} className="text-[#004ac6] font-semibold text-footnote underline">Skip for now</button>
      </div>
    </StepShell>
  )
}