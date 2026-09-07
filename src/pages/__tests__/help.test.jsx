import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Help from '../Help'

function renderHelp() {
  return render(
    <MemoryRouter>
      <Help />
    </MemoryRouter>
  )
}

describe('T10 — Help category filter', () => {
  it('filters categories by search query', async () => {
    const user = userEvent.setup()
    renderHelp()
    expect(screen.getByText('Payments & Billing')).toBeInTheDocument()
    expect(screen.getByText('Creator Studio')).toBeInTheDocument()

    const search = screen.getByPlaceholderText('Search for help…')
    await user.type(search, 'payout')
    expect(screen.queryByText('Creator Studio')).not.toBeInTheDocument()
    expect(screen.getByText('Payments & Billing')).toBeInTheDocument()
    expect(screen.getByText('Creator payouts (T+1 settlements)')).toBeInTheDocument()
  })

  it('shows the empty state when nothing matches', async () => {
    const user = userEvent.setup()
    renderHelp()
    const search = screen.getByPlaceholderText('Search for help…')
    await user.type(search, 'zzzz-not-a-topic')
    expect(screen.getByText('No matching topics')).toBeInTheDocument()
  })
})