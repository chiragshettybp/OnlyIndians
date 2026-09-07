import Field from '../ui/Field'
import Input from '../ui/Input'

export default function PhoneField({
  id = 'phone',
  value,
  onChange,
  onBlur,
  error,
  hint,
  disabled = false,
  autoFocus = false,
}) {
  const handleChange = (e) => {
    let inputValue = e.target.value

    if (inputValue.startsWith('+91')) {
      inputValue = inputValue.slice(3)
    }
    const digits = inputValue.replace(/[^0-9]/g, '')

    if (digits.length > 10) {
      inputValue = digits.slice(0, 10)
    }

    const formatted = inputValue.replace(/(\d{5})(\d{0,5})/, '$1 $2').trim()
    onChange(formatted.replace(/\s/g, ''))
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text')
    let digits = pasted.replace(/[^0-9]/g, '')

    if (digits.length === 13 && digits.startsWith('910')) digits = digits.slice(1)
    if (digits.length === 12 && digits.startsWith('91')) digits = digits.slice(2)
    else if (digits.length === 11 && digits.startsWith('0')) digits = digits.slice(1)

    if (digits.length > 10) digits = digits.slice(0, 10)

    const formatted = digits.replace(/(\d{5})(\d{0,5})/, '$1 $2').trim()
    onChange(formatted.replace(/\s/g, ''))
  }

  const handleBlur = (e) => {
    const digits = e.target.value.replace(/[^0-9]/g, '')
    if (digits.length === 10 && digits[0] >= '6' && digits[0] <= '9') {
      onChange(digits)
    }
    onBlur?.(e)
  }

  return (
    <Field label="Mobile Number" id={id} required error={error} hint={hint}>
      <div className="relative w-full">
        <div className="absolute left-0 top-0 bottom-0 flex items-center pl-4 bg-[#f5f5f7] border border-[#e4e6f0] border-r-0 rounded-l-[8px] text-[16px] font-semibold text-[#737686] select-none pointer-events-none" aria-hidden="true">
          +91
        </div>
        <Input
          id={id}
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="98765 43210"
          value={value ? value.replace(/(\d{5})(\d{0,5})/, '$1 $2').trim() : ''}
          onChange={handleChange}
          onBlur={handleBlur}
          onPaste={handlePaste}
          invalid={Boolean(error)}
          disabled={disabled}
          autoFocus={autoFocus}
          className="pl-14 pr-4"
          aria-label="Mobile number (10 digits)"
        />
      </div>
      {error && <span className="text-caption-1 text-[#ba1a1a] font-medium" role="alert">{error}</span>}
      {hint && !error && <span className="text-caption-1 text-[#737686]">{hint}</span>}
    </Field>
  )
}