import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import App from '@/App'

describe('public navigation', () => {
  it('opens the named mobile menu and restores focus after Escape', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter><App /></MemoryRouter>)
    const trigger = screen.getByRole('button', { name: 'Abrir menu' })
    await user.click(trigger)
    const menu = screen.getByRole('dialog', { name: 'Navegação' })
    expect(menu).toBeVisible()
    expect(within(menu).getByRole('link', { name: 'Localização' })).toHaveAttribute('href', '/localizacao')
    expect(screen.getAllByRole('main', { hidden: true })).toHaveLength(1)
    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(trigger).toHaveFocus()
  })
  it('supports the existing location URL directly', () => {
    render(<MemoryRouter initialEntries={['/localizacao']}><App /></MemoryRouter>)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Escritório em Volta Redonda')
  })
  it('shows a clear not-found page rather than silently redirecting', () => {
    render(<MemoryRouter initialEntries={['/nao-existe']}><App /></MemoryRouter>)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Página não encontrada')
  })
})
