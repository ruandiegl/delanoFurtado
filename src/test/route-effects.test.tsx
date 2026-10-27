import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Link, MemoryRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { afterEach, expect, it, vi } from 'vitest'
import { RouteEffects } from '@/components/SiteLayout/RouteEffects'
function Fixture() {
  const navigate = useNavigate()
  const location = useLocation()
  return <><RouteEffects /><output data-testid="location">{location.pathname}{location.search}{location.hash}</output><nav><Link to="/" state={{ scrollTarget: 'areas' }}>Áreas</Link><Link to="/contate-nos">Contato</Link><button onClick={() => navigate(-1)}>Voltar</button><button onClick={() => navigate(1)}>Avançar</button></nav><main><Routes><Route path="/" element={<><h1 tabIndex={-1}>Início</h1><section id="areas"><h2>Atuação</h2></section></>} /><Route path="/contate-nos" element={<h1 tabIndex={-1}>Contato</h1>} /></Routes></main></>
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
