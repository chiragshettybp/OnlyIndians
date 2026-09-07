import { describe, expect, it } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../../App'
import { authMocks, rpcQueue } from '../../test/setup'

function renderAt(path) {
  window.history.pushState({}, '', path)
  render(<App />)
}

const SESSION = (role) => ({
  access_token: 't',
  refresh_token: 'r',
  user: {
    id: 'u1',
    email: 'dev@example.com',
    email_confirmed_at: '2026-09-07T00:00:00.000Z',
    user_metadata: { role }
  }
})

const PROFILE = (role, { verified = true, onboarded = false } = {}) => ({
  id: 'u1',
  role,
  email: 'dev@example.com',
  phone: '+919876543210',
  status: 'active',
  email_verified_at: verified ? '2026-09-07T00:00:00.000Z' : null,
  onboarded,
  display_name: null,
  username: null,
  suspended_at: null
})

describe('T-13 — RequireRole guard matrix', () => {
  it('redirects guests from a portal to that role&apos;s login', async () => {
    renderAt('/subscriber')
    await waitFor(() => expect(window.location.pathname).toBe('/subscriber/login'))
    expect(await screen.findByText('Sign In · Subscriber')).toBeInTheDocument()
  })

  it('redirects a subscriber away from the creator portal', async () => {
    authMocks.setSession(SESSION('subscriber'))
    authMocks.setProfileRow(PROFILE('subscriber', { onboarded: true }))
    renderAt('/creator')
    await waitFor(() => expect(window.location.pathname).toBe('/subscriber/login'))
  })

  it('sends unverified users to /verify', async () => {
    authMocks.setSession(SESSION('subscriber'))
    authMocks.setProfileRow(PROFILE('subscriber', { verified: false }))
    renderAt('/subscriber/onboarding/profile')
    await waitFor(() => expect(window.location.pathname).toBe('/verify'))
  })

  it('sends verified-but-unfinished users to their onboarding start', async () => {
    authMocks.setSession(SESSION('subscriber'))
    authMocks.setProfileRow(PROFILE('subscriber', { verified: true, onboarded: false }))
    renderAt('/subscriber')
    await waitFor(() => expect(window.location.pathname).toBe('/subscriber/onboarding/profile'))
  })

  it('lets a finished subscriber into their dashboard', async () => {
    authMocks.setSession(SESSION('subscriber'))
    authMocks.setProfileRow(PROFILE('subscriber', { onboarded: true }))
    renderAt('/subscriber')
    await waitFor(() => expect(window.location.pathname).toBe('/subscriber'))
    expect(await screen.findByText('SubHome')).toBeInTheDocument()
  })
})

describe('T-14 — GuestOnly + phone-first sign-in', () => {
  it('bounces a logged-in subscriber away from guest auth pages', async () => {
    authMocks.setSession(SESSION('subscriber'))
    authMocks.setProfileRow(PROFILE('subscriber', { onboarded: true }))
    renderAt('/subscriber/login')
    await waitFor(() => expect(window.location.pathname).toBe('/subscriber'))
  })

  it('resolves a +91 number to the account email before email+password sign-in', async () => {
    const user = userEvent.setup()
    renderAt('/subscriber/login')
    await screen.findByText('Sign In · Subscriber')

    rpcQueue.push({ data: [{ email: 'dev@example.com' }], error: null })
    authMocks.queue.signInWithPassword.push({
      data: { user: SESSION('subscriber').user },
      error: null
    })

    await user.type(screen.getByLabelText(/mobile number/i), '98765 43210')
    await user.type(screen.getByLabelText(/^password \*/i), 'Secret@123')
    await user.click(screen.getByRole('button', { name: 'Sign In' }))

    await waitFor(() => expect(authMocks.lastSignInArgs).not.toBeNull(), { timeout: 5000 })
    expect(authMocks.lastSignInArgs.email).toBe('dev@example.com')
    expect(authMocks.lastSignInArgs.password).toBe('Secret@123')
  })

  it('blocks a non-Indian phone at the client', async () => {
    const user = userEvent.setup()
    renderAt('/subscriber/login')
    await screen.findByText('Sign In · Subscriber')

    await user.type(screen.getByLabelText(/mobile number/i), '1234567890')
    await user.type(screen.getByLabelText(/^password \*/i), 'Secret@123')
    await user.click(screen.getByRole('button', { name: 'Sign In' }))

    expect(await screen.findByText(/enter a valid 10-digit indian mobile/i)).toBeInTheDocument()
    expect(authMocks.lastSignInArgs).toBeNull()
  })
})

describe('T-15 — subscriber registration + verification flow', () => {
  it('registers with metadata and lands on check-email', async () => {
    const user = userEvent.setup()
    renderAt('/subscriber/register')
    await screen.findByText('Create Subscriber Account')

    await user.type(screen.getByLabelText(/mobile number/i), '9876543210')
    await user.type(screen.getByLabelText(/email address/i), 'dev@example.com')
    await user.type(screen.getByLabelText(/^password \*/i), 'Creator@123')
    await user.click(screen.getByRole('button', { name: 'Create Account' }))

    await waitFor(() => expect(window.location.pathname).toBe('/subscriber/check-email'))
    expect(await screen.findByText('Verify Your Email')).toBeInTheDocument()
    expect(authMocks.lastSignUpArgs.options.data).toMatchObject({
      role: 'subscriber',
      mobile: '+919876543210'
    })
  })

  it('verifies the email token and continues into onboarding', async () => {
    authMocks.setSession(SESSION('subscriber'))
    authMocks.setProfileRow(PROFILE('subscriber', { verified: true, onboarded: false }))
    authMocks.queue.verifyOtp.push({ data: { session: SESSION('subscriber') }, error: null })

    const user = userEvent.setup()
    renderAt('/verify?next=/subscriber/onboarding/profile&token_hash=abc123&type=email')

    expect(await screen.findByText('Email Verified')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Continue' }))

    await waitFor(() => expect(window.location.pathname).toBe('/subscriber/onboarding/profile'))
    expect(await screen.findByText('Profile Details')).toBeInTheDocument()
  })
})

describe('T-16 — creator onboarding pricing → complete', () => {
  it('saves a tier and completes onboarding into the Studio', async () => {
    authMocks.setSession(SESSION('creator'))
    authMocks.setProfileRow(PROFILE('creator', { verified: true, onboarded: true }))

    const user = userEvent.setup()
    renderAt('/creator/onboarding/pricing')
    await screen.findByText('Subscription Pricing')

    await user.click(screen.getByRole('button', { name: '₹499' }))
    await user.click(screen.getByRole('button', { name: 'Save & Continue' }))

    await waitFor(() => expect(window.location.pathname).toBe('/creator/onboarding/complete'))
    expect(await screen.findByText('Your Studio Awaits')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Open Creator Studio' }))
    await waitFor(() => expect(window.location.pathname).toBe('/creator'))
    expect(await screen.findByText('CrStudio')).toBeInTheDocument()
  })
})

describe('T-17 — reset password round trip', () => {
  it('sends a reset link from forgot-password', async () => {
    const user = userEvent.setup()
    renderAt('/subscriber/forgot-password')
    await screen.findByText('Reset Your Password')

    await user.type(screen.getByLabelText(/email address/i), 'dev@example.com')
    await user.click(screen.getByRole('button', { name: 'Send Reset Link' }))

    await waitFor(() => expect(window.location.pathname).toBe('/subscriber/check-email'))
    expect(await screen.findByText('Check Your Inbox')).toBeInTheDocument()
  })

  it('accepts a recovery token and updates the password', async () => {
    authMocks.queue.verifyOtp.push({ data: { session: null }, error: null })
    authMocks.queue.updateUser.push({ data: { user: { id: 'u1' } }, error: null })

    const user = userEvent.setup()
    renderAt('/subscriber/reset-password?token_hash=reset123&type=recovery')

    await screen.findByText('Set a New Password')
    await user.type(screen.getByLabelText(/^New Password/i), 'NewSecret@123')
    await user.type(screen.getByLabelText(/^Confirm New Password/i), 'NewSecret@123')
    await user.click(screen.getByRole('button', { name: 'Update Password' }))

    expect(await screen.findByText('Password Updated')).toBeInTheDocument()
    expect(authMocks.lastUpdateArgs).toEqual({ password: 'NewSecret@123' })
  })
})