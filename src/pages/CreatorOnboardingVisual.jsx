import { useEffect, useRef, useState } from 'react'
import usePageTitle from '../hooks/usePageTitle'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { updateProfile, uploadPrivateFile } from '../lib/api'
import { STORAGE_BUCKETS } from '../lib/constants'
import { useOnboardingNav } from '../hooks/useOnboardingNav'
import { pickImageFile, avatarKey, bannerKey } from '../lib/onboarding'
import StepShell from '../components/auth/StepShell'
import AuthAlert from '../components/auth/AuthAlert'
import Button from '../components/ui/Button'
import Icon from '../components/ui/Icon'

function Slot({ label, file, onPick, onClear }) {
  const inputRef = useRef(null)
  const [preview, setPreview] = useState('')
  useEffect(() => {
    if (!file) { setPreview(''); return }
    const url = URL.createObjectURL(file)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [file])
  return (
    <div className="flex flex-col gap-2">
      <p className="text-subheadline font-medium text-[#1a1c20]">{label}</p>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={`relative w-full ${label === 'Avatar' ? 'aspect-square max-w-[160px] rounded-full' : 'aspect-[16/6] rounded-2xl'} bg-[#eef0f7] border border-dashed border-[#c3c6d7] overflow-hidden grid place-items-center hover:bg-[#d7e3ff] transition-colors`}
      >
        {preview ? (
          <img src={preview} alt={`${label} preview`} className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-1 text-[#737686]">
            <Icon name="add_a_photo" size={28} />
            <span className="text-caption-1 font-medium">Choose</span>
          </div>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) onPick(f)
          e.target.value = ''
        }}
      />
      {file ? (
        <button type="button" onClick={onClear} className="text-caption-1 text-[#ba1a1a] underline text-left">Remove</button>
      ) : null}
    </div>
  )
}

export default function CreatorOnboardingVisual() {
  usePageTitle('Avatar & Banner')
  const { user, refreshProfile } = useAuth()
  const toast = useToast()
  const { goNext, prev, goPrev } = useOnboardingNav('creator')

  const [avatar, setAvatar] = useState(null)
  const [banner, setBanner] = useState(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const pick = (kind) => (file) => {
    setError('')
    const { file: ok, error: err } = pickImageFile(file, kind === 'avatar' ? 4 * 1024 * 1024 : 6 * 1024 * 1024, kind === 'avatar' ? 'Avatar' : 'Banner')
    if (err) { setError(err); return }
    if (kind === 'avatar') setAvatar(ok)
    else setBanner(ok)
  }

  const save = async () => {
    if (!avatar && !banner) { setError('Add at least an avatar — your banner can be added later.'); return }
    setError('')
    setBusy(true)
    try {
      if (avatar) {
        const path = avatarKey(user.id, avatar.name)
        const up = await uploadPrivateFile(STORAGE_BUCKETS.avatars, path, avatar)
        if (up.error) throw up.error
        const p = await updateProfile(user.id, { avatar_url: up.data.path })
        if (p.error) throw p.error
      }
      if (banner) {
        const path = bannerKey(user.id, banner.name)
        const up = await uploadPrivateFile(STORAGE_BUCKETS.banners, path, banner)
        if (up.error) throw up.error
        const p = await updateProfile(user.id, { banner_url: up.data.path })
        if (p.error) throw p.error
      }
    } catch (e) {
      setBusy(false)
      toast.error('Upload failed', e.message || 'Could not save visuals.')
      return
    }
    setBusy(false)
    refreshProfile(user.id)
    goNext()
  }

  return (
    <StepShell
      title="Visual Identity"
      subtitle="Your avatar and cover banner live in private buckets — fans only ever see them via secure temporary links."
      footer={
        <div className="flex gap-3">
          {prev ? <Button variant="outline" size="lg" onClick={goPrev} disabled={busy}>Back</Button> : null}
          <Button block size="lg" onClick={save} loading={busy}>Save &amp; Continue</Button>
        </div>
      }
    >
      <AuthAlert error={error} />
      <div className="grid grid-cols-1 gap-5">
        <Slot label="Avatar" file={avatar} onPick={pick('avatar')} onClear={() => setAvatar(null)} />
        <Slot label="Banner" file={banner} onPick={pick('banner')} onClear={() => setBanner(null)} />
      </div>
      <p className="text-caption-1 text-[#737686]">Avatar up to 4 MB · banner up to 6 MB · PNG, JPEG, WebP</p>
    </StepShell>
  )
}