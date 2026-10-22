import { act } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { expect, it, vi } from 'vitest'
import App from '@/App'
import { renderPage } from '@/entry-server'
import { registerClientMotion } from '@/motion/gsap'
it.each(['/', '/localizacao', '/contate-nos'])('hydrates %s without recoverable errors and retains interaction', async route => {
  const root = document.createElement('div')
  document.body.appendChild(root)
  root.innerHTML = renderPage(route).html
  const recoverableError = vi.fn()
  const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
  registerClientMotion()
  let hydrated: ReturnType<typeof hydrateRoot> | undefined
  try {
    await act(async () => { hydrated = hydrateRoot(root, <MemoryRouter initialEntries={[route]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><App /></MemoryRouter>, { onRecoverableError: recoverableError }) })
    expect(recoverableError).not.toHaveBeenCalled()
    expect(consoleError).not.toHaveBeenCalled()
    expect(within(root).getByRole('heading', { level: 1 })).toBeVisible()
    // The first service is targeted by its accessible title, not visual order.
    if (route === '/') {
      const control = root.querySelector('summary[aria-label="Ver atuações — Direito de Família"]')!
      await userEvent.setup().click(control)
      expect(control.closest('details')).toHaveAttribute('open')
    } else {
      expect(within(root).getByRole('main').querySelector('a[href^="https://wa.me/"]')).toHaveAttribute('href', expect.stringContaining('wa.me'))
    }
  } finally {
    await act(async () => hydrated?.unmount())
    root.remove(); consoleError.mockRestore()
  }
})
