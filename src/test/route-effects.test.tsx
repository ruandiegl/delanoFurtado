import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Link, MemoryRouter, Route, Routes, useNavigate } from 'react-router-dom'
import { afterEach, expect, it, vi } from 'vitest'
import { RouteEffects } from '@/components/SiteLayout/RouteEffects'
function Fixture() {
  const navigate = useNavigate()
  return <><RouteEffects /><nav><Link to="/#areas">Áreas</Link><Link to="/contate-nos">Contato</Link><button onClick={() => navigate(-1)}>Voltar</button></nav><main><Routes><Route path="/" element={<><h1 tabIndex={-1}>Início</h1><section id="areas">Atuação</section></>} /><Route path="/contate-nos" element={<h1 tabIndex={-1}>Contato</h1>} /></Routes></main></>
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
it('scrolls to the anchor again when the same fragment is selected twice', async () => {
  const scroll = vi.spyOn(HTMLElement.prototype, 'scrollIntoView')
  const user = userEvent.setup()
  render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><Fixture /></MemoryRouter>)
  await user.click(screen.getByRole('link', { name: 'Áreas' }))
  await waitFor(() => expect(scroll).toHaveBeenCalledTimes(1))
  await user.click(screen.getByRole('link', { name: 'Áreas' }))
  await waitFor(() => expect(scroll).toHaveBeenCalledTimes(2))
})
