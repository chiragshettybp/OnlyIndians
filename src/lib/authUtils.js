// India-only identity helpers. No country selector, no SMS/phone OTP anywhere.

const PHONE_RE = /^\+91[6-9][0-9]{9}$/

// '98765 43210', '919876543210', '+919876543210', '09876543210' -> '+919876543210' (or '')
export function normalizePhone(input = '') {
  const digits = String(input).replace(/[^0-9]/g, '')
  let bare = digits
  if (bare.length === 13 && bare.startsWith('910')) bare = bare.slice(1)
  if (bare.length === 12 && bare.startsWith('91')) bare = bare.slice(2)
  else if (bare.length === 11 && bare.startsWith('0')) bare = bare.slice(1)
  if (bare.length === 10 && bare[0] >= '6' && bare[0] <= '9') return `+91${bare}`
  return ''
}

export const isValidPhone = (input) => PHONE_RE.test(normalizePhone(input))

export function formatPhoneDisplay(phone = '') {
  const n = normalizePhone(phone)
  if (!n) return phone
  return `+91 ${n.slice(3, 8)} ${n.slice(8)}`
}

export const isValidEmail = (input = '') => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(input).trim())

export const passwordPolicy = {
  min: 8,
  max: 64,
  description: 'At least 8 characters with letters and numbers'
}

export const isValidPassword = (pw = '') => {
  const s = String(pw)
  return s.length >= passwordPolicy.min && s.length <= passwordPolicy.max && /[a-zA-Z]/.test(s) && /\d/.test(s)
}

const COMMON_PASSWORDS = new Set([
  'password', 'password123', '12345678', '123456789', 'qwerty123',
  'admin123', 'welcome123', 'password1', 'abc12345', 'letmein123',
  'monkey123', 'dragon123', 'sunshine1', 'princess1', 'football1',
])

export const PASSWORD_STRENGTH_LABELS = ['', 'Weak', 'Fair', 'Good', 'Strong']
export const PASSWORD_STRENGTH_COLORS = ['transparent', '#ba1a1a', '#e67e22', '#f39c12', '#00a794']

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

export function getPasswordStrengthLabel(password = '') {
  return PASSWORD_STRENGTH_LABELS[calculatePasswordStrength(password)]
}

export function getPasswordStrengthColor(password = '') {
  return PASSWORD_STRENGTH_COLORS[calculatePasswordStrength(password)]
}

export const slugifyUsername = (input = '') => String(input).toLowerCase().replace(/[^a-z0-9_]/g, '')

export const isValidUsername = (slug = '') => /^[a-z0-9_]{3,30}$/.test(slug)

const RESERVED_USERNAMES = new Set([
  'admin', 'administrator', 'root', 'api', 'www', 'mail', 'ftp',
  'support', 'help', 'info', 'contact', 'about', 'terms', 'privacy',
  'login', 'register', 'signup', 'signin', 'logout', 'password',
  'reset', 'verify', 'auth', 'oauth', 'sso', 'dashboard', 'settings',
  'profile', 'account', 'billing', 'subscription', 'creator', 'subscriber',
  'onlyindians', 'india', 'indian', 'official', 'team', 'staff',
  'moderator', 'mod', 'superuser', 'system', 'null', 'undefined',
])

export const isReservedUsername = (username = '') => RESERVED_USERNAMES.has(username.toLowerCase())

export const looksLikePhone = (credential = '') => {
  const c = String(credential).trim()
  if (!c) return false
  if (c.startsWith('+') || c.startsWith('91')) return true
  return /^[0-9]{10,11}$/.test(c.replace(/[\s-]/g, ''))
}

export function readNextPath(search = window.location.search, fallback = '/') {
  if (!search) return fallback
  const next = new URLSearchParams(search).get('next')
  return next && next.startsWith('/') && !next.startsWith('//') ? next : fallback
}

export const EMAIL_REDIRECT = (role) => `/verify?next=/${role}/onboarding/profile`

export const RESEND_COOLDOWN_SECONDS = 60