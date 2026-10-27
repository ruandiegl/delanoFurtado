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
    expect(within(menu).getByRole('link', { name: 'Áreas de atuação' })).toHaveAttribute('href', '/')
    expect(within(menu).getByRole('link', { name: 'Sobre' })).toHaveAttribute('href', '/')
    expect(screen.getAllByRole('main', { hidden: true })).toHaveLength(1)
    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(trigger).toHaveFocus()
  })
  it('supports the existing location URL directly', () => {
    render(<MemoryRouter initialEntries={['/localizacao']}><App /></MemoryRouter>)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Escritório em Volta Redonda')
  })
  it('keeps section destinations clean in the header, hero and footer', () => {
    render(<MemoryRouter><App /></MemoryRouter>)
    for (const name of ['Áreas de atuação', 'Sobre', 'Conheça a atuação', 'Entre em contato']) {
      expect(screen.getByText(name, { selector: 'a' })).toHaveAttribute('href', '/')
    }
  })
  it('skips to the current page content without adding a fragment or leaving the page', async () => {
    render(<MemoryRouter initialEntries={['/localizacao']}><App /></MemoryRouter>)
    const skipLink = screen.getByRole('link', { name: 'Pular para o conteúdo' })
    const hash = window.location.hash
    await userEvent.setup().click(skipLink)
    await waitFor(() => expect(screen.getByRole('heading', { level: 1 })).toHaveFocus())
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Escritório em Volta Redonda')
    expect(window.location.hash).toBe(hash)
  })
  it('shows a clear not-found page rather than silently redirecting', () => {
    render(<MemoryRouter initialEntries={['/nao-existe']}><App /></MemoryRouter>)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Página não encontrada')
  })
})
