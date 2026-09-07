import { describe, expect, it } from 'vitest'
import {
  normalizePhone,
  isValidPhone,
  formatPhoneDisplay,
  isValidEmail,
  isValidPassword,
  slugifyUsername,
  isValidUsername,
  looksLikePhone,
  readNextPath
} from '../authUtils'

describe('T1a — phone normalization (India-only, +91)', () => {
  it('normalizes national dial variants to +91 10-digit', () => {
    expect(normalizePhone('98765 43210')).toBe('+919876543210')
    expect(normalizePhone('919876543210')).toBe('+919876543210')
    expect(normalizePhone('+919876543210')).toBe('+919876543210')
    expect(normalizePhone('09876543210')).toBe('+919876543210')
    expect(normalizePhone('+91 98765 43210')).toBe('+919876543210')
  })

  it('rejects invalid / non-Indian numbers', () => {
    expect(normalizePhone('12345')).toBe('')
    expect(normalizePhone('987654321')).toBe('')
    expect(normalizePhone('1234567890')).toBe('') // starts with 1
    expect(normalizePhone('+1 9876543210')).toBe('')
    expect(normalizePhone(+919876543210)).toBe('+919876543210') // number type tolerated
  })

  it('isValidPhone gates on the +91[6-9]... pattern', () => {
    expect(isValidPhone('+919876543210')).toBe(true)
    expect(isValidPhone('919876543210')).toBe(true)
    expect(isValidPhone('19876543210')).toBe(false)
    expect(isValidPhone('+911234567890')).toBe(false)
  })

  it('formatPhoneDisplay groups as +91 xxxxx xxxxx', () => {
    expect(formatPhoneDisplay('+919876543210')).toBe('+91 98765 43210')
    expect(formatPhoneDisplay('bad')).toBe('bad')
  })
})

describe('T2a — email & password validation', () => {
  it('accepts standard emails, rejects junk', () => {
    expect(isValidEmail('a.b@example.co.in')).toBe(true)
    expect(isValidEmail('a@b.c')).toBe(false)
    expect(isValidEmail('  @x.com')).toBe(false)
    expect(isValidEmail('')).toBe(false)
  })

  it('password needs 8+ chars with letters and digits', () => {
    expect(isValidPassword('creat1ve')).toBe(true)
    expect(isValidPassword('Creator@123')).toBe(true)
    expect(isValidPassword('short')).toBe(false)
    expect(isValidPassword('onlyletters')).toBe(false)
    expect(isValidPassword('12345678')).toBe(false)
  })
})

describe('T3a — username slug rules', () => {
  it('slugs to lowercase alphanumeric + underscore', () => {
    expect(slugifyUsername('My Creator !@#')).toBe('mycreator')
    expect(slugifyUsername('Dev Rai')).toBe('devrai')
  })

  it('validates 3-30 char slugs', () => {
    expect(isValidUsername('ab_c12')).toBe(true)
    expect(isValidUsername('ab')).toBe(false)
    expect(isValidUsername('has space')).toBe(false)
  })

  it('looksLikePhone detects typed numbers', () => {
    expect(looksLikePhone('+919876543210')).toBe(true)
    expect(looksLikePhone('9876543210')).toBe(true)
    expect(looksLikePhone('91 98765 43210')).toBe(true)
    expect(looksLikePhone('dev@x.com')).toBe(false)
  })
})

describe('T4a — next-path parsing for post-verification routing', () => {
  it('returns fallback when query is empty or path is relative', () => {
    expect(readNextPath('', '/creator')).toBe('/creator')
    expect(readNextPath('?next=//evil.com', '/subscriber')).toBe('/subscriber')
  })

  it('returns a leading-slash next target', () => {
    expect(readNextPath('?next=/subscriber/onboarding/profile', '/')).toBe('/subscriber/onboarding/profile')
  })
})