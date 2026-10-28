import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Link, MemoryRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { afterEach, expect, it, vi } from 'vitest'
import { RouteEffects } from '@/components/SiteLayout/RouteEffects'
import { Footer } from '@/components/SiteLayout/Footer'
import { Header } from '@/components/SiteLayout/Header'
function Fixture({ withFooter = false, withHeader = false }: { withFooter?: boolean; withHeader?: boolean }) {
  const navigate = useNavigate()
  const location = useLocation()
  return <>{withHeader && <Header />}<RouteEffects /><output data-testid="location">{location.pathname}{location.search}{location.hash}</output><nav><Link to="/" state={{ scrollTarget: 'areas' }}>Áreas</Link><Link to="/contate-nos">Contato</Link><button onClick={() => navigate(-1)}>Voltar</button><button onClick={() => navigate(1)}>Avançar</button></nav><main id="main-content"><Routes><Route path="/" element={<><h1 tabIndex={-1}>Início</h1><section id="areas"><h2>Atuação</h2></section></>} /><Route path="/contate-nos" element={<h1 tabIndex={-1}>Contato</h1>} /></Routes></main>{withFooter && <Footer />}</>
}
afterEach(() => vi.restoreAllMocks())
it('restores the reading position on browser POP instead of forcing the top', async () => {
  let y = 0
  vi.spyOn(window, 'scrollY', 'get').mockImplementation(() => y)
  const scroll = vi.spyOn(window, 'scrollTo').mockImplementation((options: ScrollToOptions | number) => { if (typeof options === 'object') y = options.top ?? 0 })
  const user = userEvent.setup()
  render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><Fixture /></MemoryRouter>)
  // The latest scroll event can still be pending when navigation starts.
  y = 2160
  await user.click(screen.getByRole('link', { name: 'Contato' }))
  await waitFor(() => expect(screen.getByRole('heading', { level: 1 })).toHaveFocus())
  expect(y).toBe(0)
  await user.click(screen.getByRole('button', { name: 'Voltar' }))
  await waitFor(() => expect(scroll).toHaveBeenLastCalledWith({ top: 2160, left: 0, behavior: 'instant' }))
})
it('scrolls to the section repeatedly without putting a fragment in the URL', async () => {
  const scroll = vi.spyOn(HTMLElement.prototype, 'scrollIntoView')
  const user = userEvent.setup()
  render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><Fixture /></MemoryRouter>)
  await user.click(screen.getByRole('link', { name: 'Áreas' }))
  await waitFor(() => expect(scroll).toHaveBeenCalledTimes(1))
  expect(screen.getByTestId('location')).toHaveTextContent(/^\/$/)
  expect(screen.getByRole('heading', { name: 'Atuação' })).toHaveFocus()
  await user.click(screen.getByRole('link', { name: 'Áreas' }))
  await waitFor(() => expect(scroll).toHaveBeenCalledTimes(2))
})

it('opens a Home section from another page with a clean URL', async () => {
  const scroll = vi.spyOn(HTMLElement.prototype, 'scrollIntoView')
  render(<MemoryRouter initialEntries={['/contate-nos']}><Fixture /></MemoryRouter>)
  await userEvent.setup().click(screen.getByRole('link', { name: 'Áreas' }))
  await waitFor(() => expect(scroll).toHaveBeenCalledWith({ behavior: 'smooth' }))
  expect(screen.getByTestId('location')).toHaveTextContent(/^\/$/)
  expect(screen.getByRole('heading', { name: 'Atuação' })).toHaveFocus()
})

it('cleans an old fragment without losing its target, query or previous history entry', async () => {
  const scroll = vi.spyOn(HTMLElement.prototype, 'scrollIntoView')
  const user = userEvent.setup()
  render(<MemoryRouter initialEntries={['/contate-nos', '/?utm_source=teste#areas']}><Fixture /></MemoryRouter>)
  await waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent(/^\/\?utm_source=teste$/))
  await waitFor(() => expect(scroll).toHaveBeenCalledTimes(1))
  expect(screen.getByRole('heading', { name: 'Atuação' })).toHaveFocus()
  await user.click(screen.getByRole('button', { name: 'Voltar' }))
  expect(screen.getByTestId('location')).toHaveTextContent('/contate-nos')
})

it('restores the saved position when returning to a clean section navigation entry', async () => {
  let y = 0
  vi.spyOn(window, 'scrollY', 'get').mockImplementation(() => y)
  const scroll = vi.spyOn(HTMLElement.prototype, 'scrollIntoView')
  const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation((options: ScrollToOptions | number) => { if (typeof options === 'object') y = options.top ?? 0 })
  const user = userEvent.setup()
  render(<MemoryRouter><Fixture /></MemoryRouter>)
  await user.click(screen.getByRole('link', { name: 'Áreas' }))
  await waitFor(() => expect(scroll).toHaveBeenCalledTimes(1))
  y = 2480
  await user.click(screen.getByRole('link', { name: 'Contato' }))
  scroll.mockClear()
  await user.click(screen.getByRole('button', { name: 'Voltar' }))
  expect(scrollTo).toHaveBeenLastCalledWith({ top: 2480, left: 0, behavior: 'instant' })
  expect(scroll).not.toHaveBeenCalled()
  await user.click(screen.getByRole('button', { name: 'Avançar' }))
  expect(screen.getByTestId('location')).toHaveTextContent('/contate-nos')
})

it('uses immediate section scrolling when reduced motion is enabled', async () => {
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  vi.spyOn(window, 'matchMedia').mockImplementation(query => ({ ...mediaQuery, media: query, matches: query === '(prefers-reduced-motion: reduce)' }))
  const scroll = vi.spyOn(HTMLElement.prototype, 'scrollIntoView')
  render(<MemoryRouter><Fixture /></MemoryRouter>)
  await userEvent.setup().click(screen.getByRole('link', { name: 'Áreas' }))
  await waitFor(() => expect(scroll).toHaveBeenCalledWith({ behavior: 'auto' }))
})

it.each(['/', '/contate-nos'])('smoothly returns to the Home start from the footer on %s, including repeated clicks', async (route) => {
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  vi.spyOn(window, 'matchMedia').mockImplementation(query => ({ ...mediaQuery, media: query, matches: false }))
  const scroll = vi.spyOn(HTMLElement.prototype, 'scrollIntoView')
  const user = userEvent.setup()
  render(<MemoryRouter initialEntries={[route]}><Fixture withFooter /></MemoryRouter>)
  const home = within(screen.getByRole('navigation', { name: 'Navegação do rodapé' })).getByRole('link', { name: 'Início' })
  expect(home).toHaveAttribute('href', '/')
  await user.click(home)
  await waitFor(() => expect(scroll).toHaveBeenCalledWith({ behavior: 'smooth' }))
  expect(scroll.mock.instances.at(-1)).toBe(screen.getByRole('main'))
  expect(screen.getByRole('heading', { level: 1, name: 'Início' })).toHaveFocus()
  expect(screen.getByTestId('location')).toHaveTextContent(/^\/$/)
  await user.click(home)
  await waitFor(() => expect(scroll).toHaveBeenCalledTimes(2))
})

it('returns to the Home start from the footer without animation when reduced motion is enabled', async () => {
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  vi.spyOn(window, 'matchMedia').mockImplementation(query => ({ ...mediaQuery, media: query, matches: query === '(prefers-reduced-motion: reduce)' }))
  const scroll = vi.spyOn(HTMLElement.prototype, 'scrollIntoView')
  render(<MemoryRouter><Fixture withFooter /></MemoryRouter>)
  const footer = screen.getByRole('navigation', { name: 'Navegação do rodapé' })
  await userEvent.setup().click(within(footer).getByRole('link', { name: 'Início' }))
  await waitFor(() => expect(scroll).toHaveBeenCalledWith({ behavior: 'auto' }))
  expect(scroll.mock.instances.at(-1)).toBe(screen.getByRole('main'))
})

it.each(['/', '/contate-nos'])('smoothly returns to the Home start through the logo from %s, including repeated clicks', async (route) => {
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  vi.spyOn(window, 'matchMedia').mockImplementation(query => ({ ...mediaQuery, media: query, matches: false }))
  const scroll = vi.spyOn(HTMLElement.prototype, 'scrollIntoView')
  const user = userEvent.setup()
  render(<MemoryRouter initialEntries={[route]}><Fixture withHeader /></MemoryRouter>)
  const logo = screen.getByRole('link', { name: 'Delano Furtado — início' })
  expect(logo).toHaveAttribute('href', '/')
  await user.click(logo)
  await waitFor(() => expect(scroll).toHaveBeenCalledWith({ behavior: 'smooth' }))
  expect(scroll.mock.instances.at(-1)).toBe(screen.getByRole('main'))
  expect(screen.getByRole('heading', { level: 1, name: 'Início' })).toHaveFocus()
  expect(screen.getByTestId('location')).toHaveTextContent(/^\/$/)
  await user.click(logo)
  await waitFor(() => expect(scroll).toHaveBeenCalledTimes(2))
})

it('returns through the logo without animation when reduced motion is enabled', async () => {
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  vi.spyOn(window, 'matchMedia').mockImplementation(query => ({ ...mediaQuery, media: query, matches: query === '(prefers-reduced-motion: reduce)' }))
  const scroll = vi.spyOn(HTMLElement.prototype, 'scrollIntoView')
  render(<MemoryRouter><Fixture withHeader /></MemoryRouter>)
  await userEvent.setup().click(screen.getByRole('link', { name: 'Delano Furtado — início' }))
  await waitFor(() => expect(scroll).toHaveBeenCalledWith({ behavior: 'auto' }))
  expect(scroll.mock.instances.at(-1)).toBe(screen.getByRole('main'))
})
