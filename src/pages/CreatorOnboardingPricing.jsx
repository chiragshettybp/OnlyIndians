import { useState } from 'react'
import usePageTitle from '../hooks/usePageTitle'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { upsertCreatorProfile } from '../lib/api'
import { PRICING_TIERS } from '../lib/constants'
import { useOnboardingNav } from '../hooks/useOnboardingNav'
import StepShell from '../components/auth/StepShell'
import AuthAlert from '../components/auth/AuthAlert'
import Button from '../components/ui/Button'

export default function CreatorOnboardingPricing() {
  usePageTitle('Subscription Pricing')
  const { user, refreshProfile } = useAuth()
  const toast = useToast()
  const { goNext, prev, goPrev } = useOnboardingNav('creator')

  const [tier, setTier] = useState(199)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const save = async () => {
    setBusy(true)
    const { error: e } = await upsertCreatorProfile(user.id, { subscription_price: tier })
    setBusy(false)
    if (e) { toast.error('Could not save pricing', e.message); return }
    refreshProfile(user.id)
    goNext()
  }

  return (
    <StepShell
      title="Subscription Pricing"
      subtitle="You keep the full ₹ monthly — OnlyIndians charges no platform fee. You can adjust your rate anytime."
      footer={
        <div className="flex gap-3">
          {prev ? <Button variant="outline" size="lg" onClick={goPrev} disabled={busy}>Back</Button> : null}
          <Button block size="lg" onClick={save} loading={busy}>Save &amp; Continue</Button>
        </div>
      }
    >
      <AuthAlert error={error} />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {PRICING_TIERS.map((p) => {
          const on = tier === p
          return (
            <button
              key={p}
              type="button"
              onClick={() => { setTier(p); setError('') }}
              className={`flex items-center justify-center h-16 rounded-2xl border text-headline font-bold transition-colors ${on ? 'bg-[#d7e3ff] border-[#004ac6] text-[#002f6c]' : 'bg-white border-[#e4e6f0] text-[#1a1c20]'}`}
            >
              ₹{p}
            </button>
          )
        })}
      </div>
      <p className="text-caption-1 text-[#737686]">Rates from ₹99 to ₹9,999/month are supported. Pick one now — fine-tune later in your Studio.</p>
    </StepShell>
  )
}