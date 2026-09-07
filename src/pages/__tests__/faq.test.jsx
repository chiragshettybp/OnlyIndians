import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import FAQ from '../FAQ'

function renderFaq(path = '/faq') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <FAQ />
    </MemoryRouter>
  )
}

describe('T8 — accordion toggle + ARIA', () => {
  it('toggles aria-expanded and reveals the panel', async () => {
    const user = userEvent.setup()
    renderFaq()
    const button = await screen.findByRole('button', { name: /what is onlyindians\?/i })
    expect(button.getAttribute('aria-expanded')).toBe('false')
    await user.click(button)
    expect(button.getAttribute('aria-expanded')).toBe('true')
    const panel = screen.getByRole('region', { name: /what is onlyindians\?/i })
    expect(panel.textContent).toContain('India-only')
  })
})

describe('T9 — deep-link hash', () => {
  it('auto-expands the item matching the URL hash', async () => {
    renderFaq('/faq#cancellation')
    const button = await screen.findByRole('button', { name: /can i cancel anytime\?/i })
    await new Promise((r) => setTimeout(r, 120))
    expect(button.getAttribute('aria-expanded')).toBe('true')
  })
})

describe('T16 — keyboard navigation', () => {
  it('moves focus with Arrow keys and toggles with Enter', async () => {
    const user = userEvent.setup()
    renderFaq()
    const first = await screen.findByRole('button', { name: /what is onlyindians\?/i })
    first.focus()
    await user.keyboard('{ArrowDown}')
    const second = screen.getByRole('button', { name: /who can use it\?/i })
    expect(second).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(second.getAttribute('aria-expanded')).toBe('true')
  })
})