import { describe, expect, it } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../../App'

function renderAt(path) {
  window.history.pushState({}, '', path)
  render(<App />)
}

const PUBLIC_PAGES = [
  { path: '/', needle: 'Choose Your Portal' },
  { path: '/about', needle: /india's creator economy/i },
  { path: '/how-it-works', needle: 'How OnlyIndians Works' },
  { path: '/pricing', needle: 'Zero hidden charges.' },
  { path: '/status', needle: 'Platform Status' },
  { path: '/faq', needle: 'Questions & answers' },
  { path: '/help', needle: 'Help Centre' },
  { path: '/community-guidelines', needle: 'Be safe. Be real. Be generous.' },
  { path: '/terms', needle: 'Terms of Service' },
  { path: '/privacy', needle: 'Privacy Policy' },
  { path: '/contact', needle: 'How can we help?' }
]

describe('T1 — all public routes render', () => {
  PUBLIC_PAGES.forEach(({ path, needle }) => {
    it(`renders ${path}`, async () => {
      renderAt(path)
      expect(await screen.findByText(needle, {}, { timeout: 5000 })).toBeInTheDocument()
    })
  })
})

describe('T2 — marketing nav active state', () => {
  it('marks the Pricing link active on /pricing', async () => {
    renderAt('/pricing')
    await screen.findByText('Zero hidden charges.')
    const header = screen.getByRole('banner', { name: /main/i })
    const pricing = within(header).getByRole('link', { name: 'Pricing' })
    expect(pricing.className).toContain('text-[#004ac6]')
    expect(pricing.className).toContain('font-semibold')
    const home = within(header).getByRole('link', { name: 'Home' })
    expect(home.className).not.toContain('font-semibold')
  })
})

describe('T3 — login/register entry points', () => {
  it('navigates to subscriber login from the header', async () => {
    const user = userEvent.setup()
    renderAt('/')
    await screen.findByText('Choose Your Portal')
    const main = screen.getByRole('banner', { name: /main/i })
    await user.click(within(main).getByRole('button', { name: /sign in/i }))
    await waitFor(() => expect(window.location.pathname).toBe('/subscriber/login'))
  })

  it('navigates to subscriber register from the header', async () => {
    const user = userEvent.setup()
    renderAt('/')
    await screen.findByText('Choose Your Portal')
    const main = screen.getByRole('banner', { name: /main/i })
    await user.click(within(main).getByRole('button', { name: /get started/i }))
    await waitFor(() => expect(window.location.pathname).toBe('/subscriber/register'))
  })
})

describe('T12 — invalid path renders NotFound', () => {
  it('shows the 404 page', async () => {
    renderAt('/this-does-not-exist')
    expect(await screen.findByText('404')).toBeInTheDocument()
  })
})

describe('T13 — legacy /guidelines redirect', () => {
  it('redirects to /community-guidelines', async () => {
    renderAt('/guidelines')
    expect(await screen.findByText('Be safe. Be real. Be generous.')).toBeInTheDocument()
    await waitFor(() => expect(window.location.pathname).toBe('/community-guidelines'))
  })
})

describe('T11 — no phone-verification claims in public copy', () => {
  const SCAN_PAGES = ['/', '/how-it-works', '/pricing', '/faq', '/status']
  SCAN_PAGES.forEach((path) => {
    it(`${path} contains no "phone verification" claim`, async () => {
      renderAt(path)
      await waitFor(() => expect(document.querySelector('main')).not.toBeEmptyDOMElement())
      const text = document.querySelector('main').textContent.toLowerCase()
      expect(text).not.toContain('phone verification')
    })
  })
})