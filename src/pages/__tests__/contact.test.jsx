import { describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'

vi.mock('../../lib/api', async (importOriginal) => {
  const actual = await importOriginal()
  return { ...actual, submitContact: vi.fn() }
})

import { submitContact } from '../../lib/api'
import { rpcQueue } from '../../test/setup'
import Contact from '../Contact'

const mockedSubmit = vi.mocked(submitContact)

function renderContact() {
  return render(
    <MemoryRouter>
      <Contact />
    </MemoryRouter>
  )
}

const VALID = {
  name: 'Priya Sharma',
  phone: '9876543210',
  email: 'priya@example.com',
  subject: 'Billing question',
  body: 'I would like to know about my recent subscription charge, please.'
}

async function fillForm(user, values) {
  await user.type(screen.getByLabelText(/full name/i), values.name)
  if (values.phone) await user.type(screen.getByLabelText(/phone \(india/i), values.phone)
  await user.type(screen.getByLabelText(/email/i), values.email)
  await user.type(screen.getByLabelText(/subject/i), values.subject)
  await user.type(screen.getByLabelText(/message/i), values.body)
}

describe('T4 — required-field validation', () => {
  it('shows errors for missing name, email, subject, message', async () => {
    const user = userEvent.setup()
    renderContact()
    await user.click(screen.getByRole('button', { name: /send message/i }))
    expect(await screen.findByText('Please enter your full name.')).toBeInTheDocument()
    expect(screen.getByText('Please enter a valid email address.')).toBeInTheDocument()
    expect(screen.getByText(/short subject/)).toBeInTheDocument()
    expect(screen.getByText(/at least 10 characters/)).toBeInTheDocument()
    expect(mockedSubmit).not.toHaveBeenCalled()
  })
})

describe('T5 — email validation', () => {
  it('rejects an invalid email', async () => {
    const user = userEvent.setup()
    renderContact()
    await fillForm(user, { ...VALID, email: 'not-an-email' })
    await user.click(screen.getByRole('button', { name: /send message/i }))
    expect(await screen.findByText('Please enter a valid email address.')).toBeInTheDocument()
    expect(mockedSubmit).not.toHaveBeenCalled()
  })
})

describe('T6 — successful submit', () => {
  it('shows the success state and passes +91-prefixed payload', async () => {
    mockedSubmit.mockResolvedValueOnce({ data: 'ticket-abc-123', error: null })
    const user = userEvent.setup()
    renderContact()
    await fillForm(user, VALID)
    await user.click(screen.getByRole('button', { name: /send message/i }))
    expect(await screen.findByText('Thanks for reaching out.')).toBeInTheDocument()
    expect(screen.getByText('ticket-abc-123')).toBeInTheDocument()
    expect(mockedSubmit).toHaveBeenCalledWith({
      name: VALID.name,
      email: VALID.email,
      phone: `+91${VALID.phone}`,
      subject: VALID.subject,
      body: VALID.body
    })
  })

  it('silently accepts honeypot submissions without calling the API', async () => {
    const user = userEvent.setup()
    renderContact()
    await fillForm(user, VALID)
    const honeypot = screen.getByLabelText('Do not fill this field')
    await user.type(honeypot, 'spam')
    await user.click(screen.getByRole('button', { name: /send message/i }))
    expect(await screen.findByText('Thanks for reaching out.')).toBeInTheDocument()
    expect(mockedSubmit).not.toHaveBeenCalled()
  })
})

describe('T7 — failure state', () => {
  it('surfaces the server error and keeps the form for retry', async () => {
    mockedSubmit.mockResolvedValueOnce({ data: null, error: { message: 'Submission server down', code: '500' } })
    const user = userEvent.setup()
    renderContact()
    await fillForm(user, VALID)
    await user.click(screen.getByRole('button', { name: /send message/i }))
    expect(await screen.findByText('Submission server down')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /send message/i })).toBeEnabled()
  })

  it('maps backend INVALID_PHONE to a friendly message', async () => {
    rpcQueue.push({ data: null, error: { message: 'INVALID_PHONE', code: 'PGRST_FK' } })
    const realApi = await vi.importActual('../../lib/api')
    const out = await realApi.submitContact({
      name: VALID.name,
      email: VALID.email,
      phone: `+91${VALID.phone}`,
      subject: VALID.subject,
      body: VALID.body
    })
    expect(out.error.message).toBe('Phone must be a valid +91 Indian mobile number.')
  })
})

describe('phone input', () => {
  it('strips non-digits and limits to 10', async () => {
    const user = userEvent.setup()
    renderContact()
    const input = screen.getByLabelText(/phone \(india/i)
    await user.type(input, '91-988-776 65 43')
    await waitFor(() => expect(input.value).toBe('9198877665'))
  })
})