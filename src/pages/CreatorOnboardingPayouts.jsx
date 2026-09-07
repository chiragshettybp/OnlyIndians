import { useState } from 'react'
import usePageTitle from '../hooks/usePageTitle'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { upsertCreatorProfile } from '../lib/api'
import { useOnboardingNav } from '../hooks/useOnboardingNav'
import StepShell from '../components/auth/StepShell'
import AuthAlert from '../components/auth/AuthAlert'
import Field from '../components/ui/Field'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'

export default function CreatorOnboardingPayouts() {
  usePageTitle('Payout Settings')
  const { user, refreshProfile } = useAuth()
  const toast = useToast()
  const { goNext, prev, goPrev } = useOnboardingNav('creator')

  const [holder, setHolder] = useState('')
  const [ifsc, setIfsc] = useState('')
  const [account, setAccount] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const save = async () => {
    if (!holder.trim()) { setError('Enter the account holder&apos;s name.'); return }
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/i.test(ifsc)) { setError('Enter a valid 11-character IFSC (e.g. HDFC0001234).'); return }
    const digits = account.replace(/\s/g, '')
    if (!/^[0-9]{9,18}$/.test(digits)) { setError('Enter a valid bank account number (9–18 digits).'); return }
    setError('')
    setBusy(true)
    const { error: e } = await upsertCreatorProfile(user.id, {
      bank_holder: holder.trim(),
      bank_ifsc: ifsc.toUpperCase(),
      bank_account_tail: digits.slice(-4),
      payout_status: 'not_configured'
    })
    setBusy(false)
    if (e) { toast.error('Could not save payout details', e.message); return }
    refreshProfile(user.id)
    goNext()
  }

  return (
    <StepShell
      title="Payout Settings"
      subtitle="We only store the last 4 digits of your account until payments go live — your full number is never saved."
      footer={
        <div className="flex gap-3">
          {prev ? <Button variant="outline" size="lg" onClick={goPrev} disabled={busy}>Back</Button> : null}
          <Button block size="lg" onClick={save} loading={busy}>Save &amp; Continue</Button>
        </div>
      }
    >
      <AuthAlert error={error} />
      <div className="flex flex-col gap-4">
        <Field label="Account Holder Name" id="ob-holder" required>
          <Input id="ob-holder" autoComplete="name" placeholder="Exactly as on the bank passbook" value={holder} onChange={(e) => { setHolder(e.target.value); setError('') }} />
        </Field>
        <Field label="IFSC Code" id="ob-ifsc" required>
          <Input id="ob-ifsc" autoCapitalize="characters" placeholder="HDFC0001234" value={ifsc} onChange={(e) => { setIfsc(e.target.value.toUpperCase()); setError('') }} />
        </Field>
        <Field label="Bank Account Number" id="ob-account" required hint="9–18 digits. Full number is never stored.">
          <Input id="ob-account" inputMode="numeric" autoComplete="off" placeholder="0000001234567890" value={account} onChange={(e) => { setAccount(e.target.value.replace(/[^0-9\s]/g, '')); setError('') }} />
        </Field>
      </div>
    </StepShell>
  )
}