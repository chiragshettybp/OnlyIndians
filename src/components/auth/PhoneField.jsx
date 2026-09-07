import Field from '../ui/Field'
import Input from '../ui/Input'

// India-only phone input: fixed +91 prefix (no country selector, no OTP).
export default function PhoneField({ id = 'phone', value, onChange, error, hint, disabled = false }) {
  return (
    <Field label="Mobile Number" id={id} required error={error} hint={hint}>
      <Input
        id={id}
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        placeholder="98765 43210"
        prefix="+91"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        invalid={Boolean(error)}
        disabled={disabled}
      />
    </Field>
  )
}