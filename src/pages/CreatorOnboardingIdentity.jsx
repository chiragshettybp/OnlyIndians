import { useRef, useState } from 'react'
import usePageTitle from '../hooks/usePageTitle'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { submitIdentityVerification, uploadPrivateFile, upsertCreatorProfile } from '../lib/api'
import { STORAGE_BUCKETS } from '../lib/constants'
import { useOnboardingNav } from '../hooks/useOnboardingNav'
import { pickDocFile, extOf } from '../lib/onboarding'
import StepShell from '../components/auth/StepShell'
import AuthAlert from '../components/auth/AuthAlert'
import Field from '../components/ui/Field'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import Button from '../components/ui/Button'
import Icon from '../components/ui/Icon'

const ID_TYPES = [
  { value: 'PAN', label: 'PAN Card' },
  { value: 'AADHAAR', label: 'Aadhaar' },
  { value: 'PASSPORT', label: 'Passport' },
  { value: 'DRIVING_LICENSE', label: 'Driving License' }
]

export default function CreatorOnboardingIdentity() {
  usePageTitle('Identity Verification')
  const { user, refreshProfile } = useAuth()
  const toast = useToast()
  const { goNext, prev, goPrev } = useOnboardingNav('creator')

  const [idType, setIdType] = useState('')
  const [idLast4, setIdLast4] = useState('')
  const [front, setFront] = useState(null)
  const [back, setBack] = useState(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const frontRef = useRef(null)
  const backRef = useRef(null)

  const onPick = (kind) => (e) => {
    setError('')
    const f = e.target.files?.[0]
    if (!f) return
    const { file: ok, error: err } = pickDocFile(f)
    if (err) { setError(err); return }
    if (kind === 'front') setFront(ok)
    else setBack(ok)
    e.target.value = ''
  }

  const docChip = (label, file, ref, kind) => (
    <div className="flex items-center gap-3 rounded-2xl bg-white border border-[#e4e6f0] p-4">
      <span className="w-9 h-9 rounded-full bg-[#eef0f7] grid place-items-center text-[#004ac6]"><Icon name={file ? 'description' : 'upload_file'} size={20} /></span>
      <div className="flex-1 min-w-0">
        <p className="text-subheadline font-medium text-[#1a1c20]">{label}</p>
        <p className="text-caption-1 text-[#737686] truncate">{file ? file.name : 'PDF, JPG, PNG, WebP · up to 8 MB'}</p>
      </div>
      <button type="button" onClick={() => ref.current?.click()} className="text-footnote text-[#004ac6] font-semibold shrink-0">
        {file ? 'Change' : 'Choose'}
      </button>
      <input ref={ref} type="file" accept="application/pdf,image/png,image/jpeg,image/webp" className="hidden" onChange={onPick(kind)} />
    </div>
  )

  const submit = async () => {
    if (!idType) { setError('Select the ID document type.'); return }
    if (!/^[0-9A-Za-z]{4}$/.test(idLast4)) { setError('Enter the last 4 characters of your ID.'); return }
    if (!front) { setError('Upload the front copy of your ID.'); return }
    setError('')
    setBusy(true)
    const paths = []
    try {
      const rnd = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : String(Date.now())
      const upF = await uploadPrivateFile(STORAGE_BUCKETS.documents, `${user.id}/kyc/${rnd}-front.${extOf(front.name)}`, front)
      if (upF.error) throw upF.error
      paths.push(upF.data.path)
      if (back) {
        const upB = await uploadPrivateFile(STORAGE_BUCKETS.documents, `${user.id}/kyc/${rnd}-back.${extOf(back.name)}`, back)
        if (upB.error) throw upB.error
        paths.push(upB.data.path)
      }
    } catch (e) {
      setBusy(false)
      toast.error('Upload failed', e.message || 'Could not upload your documents.')
      return
    }
    const { error: e } = await submitIdentityVerification({ idType, idLast4: idLast4.toUpperCase(), docPaths: paths })
    if (e) {
      setBusy(false)
      toast.error('Could not submit identity', e.message || 'Please try again.')
      return
    }
    await upsertCreatorProfile(user.id, { kyc_status: 'pending' })
    await refreshProfile(user.id)
    setBusy(false)
    goNext()
  }

  return (
    <StepShell
      title="Identity Verification"
      subtitle="This powers creator payouts and keeps the platform fraud-free. Documents are stored in a private bucket and never made public."
      footer={
        <div className="flex flex-col gap-2">
          <div className="flex gap-3">
            {prev ? <Button variant="outline" size="lg" onClick={goPrev} disabled={busy}>Back</Button> : null}
            <Button block size="lg" onClick={submit} loading={busy}>Submit &amp; Continue</Button>
          </div>
          <p className="text-caption-1 text-[#737686] text-center">Approval is manual and usually takes under 24 hours. You can finish the rest of setup now.</p>
        </div>
      }
    >
      <AuthAlert error={error} />
      <div className="flex flex-col gap-4">
        <Field label="Document Type" id="ob-idtype" required>
          <Select value={idType} onChange={(e) => { setIdType(e.target.value); setError('') }} placeholder="Select document">
            {ID_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </Select>
        </Field>
        <Field label="Last 4 characters of your ID" id="ob-idlast4" required hint="Only the last 4 are kept — full numbers are never stored.">
          <Input id="ob-idlast4" maxLength={4} value={idLast4} onChange={(e) => setIdLast4(e.target.value.toUpperCase())} placeholder="A1B2" className="tracking-[0.25em]" autoComplete="off" />
        </Field>
        <div className="flex flex-col gap-3">
          {docChip('Front copy', front, frontRef, 'front')}
          {docChip('Back copy (if issued)', back, backRef, 'back')}
        </div>
      </div>
    </StepShell>
  )
}