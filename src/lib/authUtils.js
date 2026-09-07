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
  description: 'At least 8 characters with letters and numbers'
}
export const isValidPassword = (pw = '') => String(pw).length >= passwordPolicy.min && /[a-zA-Z]/.test(pw) && /\d/.test(pw)

// Lowercase alphanumeric + underscore, 3-30 chars (mirrors check_username_available RPC).
export const slugifyUsername = (input = '') => String(input).toLowerCase().replace(/[^a-z0-9_]/g, '')
export const isValidUsername = (slug = '') => /^[a-z0-9_]{3,30}$/.test(slug)

// A credential is "phone-like" when the user typed +91/leading digits (phone-first UX).
export const looksLikePhone = (credential = '') => {
  const c = String(credential).trim()
  if (!c) return false
  if (c.startsWith('+') || c.startsWith('91')) return true
  return /^[0-9]{10,11}$/.test(c.replace(/[\s-]/g, ''))
}

// Reads ?next= from the current URL (used to route post-verification).
// Only in-app paths are accepted; protocol-relative strings are refused.
export function readNextPath(search = window.location.search, fallback = '/') {
  if (!search) return fallback
  const next = new URLSearchParams(search).get('next')
  return next && next.startsWith('/') && !next.startsWith('//') ? next : fallback
}

export const EMAIL_REDIRECT = (role) => `/verify?next=/${role}/onboarding/profile`