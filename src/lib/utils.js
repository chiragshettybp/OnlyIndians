export function cn(...parts) {
  return parts.filter(Boolean).join(' ')
}

export const clamp = (v, min, max) => Math.min(Math.max(v, min), max)

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

export function debounce(fn, ms = 300) {
  let t
  return function (...args) {
    clearTimeout(t)
    t = setTimeout(() => fn.apply(this, args), ms)
  }
}

export function pick(obj, keys) {
  const out = {}
  for (const k of keys) if (obj && k in obj) out[k] = obj[k]
  return out
}

export const VALID_USERNAME = /^[a-zA-Z0-9_]{3,20}$/

export function sanitizeUsername(value) {
  return String(value || '').trim().toLowerCase().replace(/[^a-z0-9_]/g, '')
}

export function initials(name = '') {
  return String(name)
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('')
}

export function formatINR(amount, opts = {}) {
  const n = Number(amount || 0)
  const digits = opts.decimals ? 2 : 0
  return '₹' + n.toLocaleString('en-IN', { maximumFractionDigits: digits, minimumFractionDigits: opts.decimals ? 2 : 0 })
}

export function formatCompactINR(amount) {
  const n = Number(amount || 0)
  return '₹' + (n >= 10000000 ? (n / 10000000).toFixed(1).replace(/\.0$/, '') + ' Cr'
    : n >= 100000 ? (n / 100000).toFixed(1).replace(/\.0$/, '') + ' Lakh'
    : n >= 1000 ? (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k'
    : String(n))
}

export function formatDate(iso, opts = {}) {
  if (!iso) return '—'
  const d = new Date(iso)
  if (isNaN(d)) return '—'
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', ...opts })
}

export function timeAgo(iso) {
  if (!iso) return '—'
  const s = (Date.now() - new Date(iso).getTime()) / 1000
  if (s < 60) return 'just now'
  if (s < 3600) return `${Math.floor(s / 60)}m ago`
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`
  if (s < 604800) return `${Math.floor(s / 86400)}d ago`
  return formatDate(iso)
}

export function maskMobile(mobile = '') {
  const m = String(mobile).replace(/\D/g, '')
  if (m.length < 10) return mobile || '—'
  return '+91 ' + m.slice(0, 5) + ' ••••' + m.slice(-4)
}

export function clampText(str = '', max) {
  return str.length > max ? str.slice(0, max) : str
}

export async function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(r.result)
    r.onerror = reject
    r.readAsDataURL(file)
  })
}

export function formatBytes(bytes = 0) {
  const n = Number(bytes)
  if (n < 1024) return `${n} B`
  if (n < 1048576) return `${(n / 1024).toFixed(1)} KB`
  return `${(n / 1048576).toFixed(1)} MB`
}

export function isDev() {
  return import.meta.env.DEV
}