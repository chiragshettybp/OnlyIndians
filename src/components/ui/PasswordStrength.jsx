import { cn } from '../../lib/utils'

export const PASSWORD_STRENGTH = {
  0: { label: '', color: 'transparent', bg: 'bg-[#e4e6f0]', width: '0%' },
  1: { label: 'Weak', color: 'text-[#ba1a1a]', bg: 'bg-[#ba1a1a]', width: '25%' },
  2: { label: 'Fair', color: 'text-[#e67e22]', bg: 'bg-[#e67e22]', width: '50%' },
  3: { label: 'Good', color: 'text-[#f39c12]', bg: 'bg-[#f39c12]', width: '75%' },
  4: { label: 'Strong', color: 'text-[#00a794]', bg: 'bg-[#00a794]', width: '100%' },
}

const COMMON_PASSWORDS = new Set([
  'password', 'password123', '12345678', '123456789', 'qwerty123',
  'admin123', 'welcome123', 'password1', 'abc12345', 'letmein123',
  'monkey123', 'dragon123', 'sunshine1', 'princess1', 'football1',
])

export function calculatePasswordStrength(password = '') {
  if (!password) return 0
  if (COMMON_PASSWORDS.has(password.toLowerCase())) return 1

  let score = 0
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++
  if (/\d/.test(password)) score++
  if (/[^a-zA-Z0-9]/.test(password)) score++

  return Math.min(score, 4)
}

export default function PasswordStrength({ password, className = '' }) {
  const strength = calculatePasswordStrength(password)
  const { label, color, bg, width } = PASSWORD_STRENGTH[strength]

  if (!password) return null

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <div className="relative h-1.5 rounded-full bg-[#e4e6f0] overflow-hidden" role="progressbar" aria-valuenow={strength * 25} aria-valuemin={0} aria-valuemax={100} aria-label={`Password strength: ${label}`}>
        <div className={cn('h-full rounded-full transition-all duration-300', bg)} style={{ width }} />
      </div>
      <p className={cn('text-caption-1 font-medium', color)}>{label}</p>
    </div>
  )
}