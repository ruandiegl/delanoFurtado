import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, expect, it, vi } from 'vitest'
import { ConsentProvider } from '@/consent/ConsentProvider'
import { ConsentControls, PrivacyPreferencesButton } from '@/consent/ConsentControls'
import { CONSENT_KEY, createConsent, readConsent } from '@/consent/storage'

afterEach(() => { localStorage.clear(); sessionStorage.clear(); vi.restoreAllMocks() })
const mount = () => render(<MemoryRouter><ConsentProvider><a href="/contate-nos">Contato</a><PrivacyPreferencesButton /><ConsentControls showInitial /></ConsentProvider></MemoryRouter>)
const choices = () => screen.getByRole('dialog', { name: 'Preferências de cookies' })

it('applies denial immediately and explains when the browser cannot save it', async () => {
  const user = userEvent.setup()
  localStorage.setItem(CONSENT_KEY, JSON.stringify(createConsent({ analytics: 'granted', advertising: 'denied' }, Date.now())))
  mount()
  await user.click(screen.getByRole('button', { name: 'Preferências de cookies' }))
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw Error('blocked') })
  await user.click(screen.getByRole('button', { name: 'Rejeitar todos' }))
  expect(readConsent(localStorage, Date.now())).toBeNull()
  expect(within(choices()).getByRole('status')).toHaveTextContent('Sua escolha está aplicada nesta visita')
  expect(within(choices()).getByRole('switch', { name: 'Análise' })).not.toBeChecked()
  expect(document.querySelector('[data-delano-analytics]')).toBeNull()
})

it('dismisses the notice without storing a choice and shows it again on a new visit', async () => {
  const user = userEvent.setup()
  const view = mount()
  await user.click(screen.getByRole('button', { name: 'Fechar aviso de cookies' }))
  expect(screen.queryByRole('region', { name: 'Aviso de cookies' })).toBeNull()
  expect(localStorage.getItem(CONSENT_KEY)).toBeNull()
  expect(document.querySelector('[data-delano-analytics]')).toBeNull()
  view.unmount()
  mount()
  expect(screen.getByRole('region', { name: 'Aviso de cookies' })).toBeInTheDocument()
})
it('dismisses without consent if the banner fully obscures an outside keyboard target', async () => {
  const user = userEvent.setup()
  mount()
  const banner = screen.getByRole('region', { name: 'Aviso de cookies' })
  const contact = screen.getByRole('link', { name: 'Contato' })
  vi.spyOn(banner, 'getBoundingClientRect').mockReturnValue(new DOMRect(16, 490, 328, 230))
  vi.spyOn(contact, 'getBoundingClientRect').mockReturnValue(new DOMRect(40, 520, 150, 44))
  const descriptor = Object.getOwnPropertyDescriptor(document, 'elementFromPoint')
  Object.defineProperty(document, 'elementFromPoint', { configurable: true, value: () => banner })
  try {
    await user.tab()
    await waitFor(() => expect(screen.queryByRole('region', { name: 'Aviso de cookies' })).toBeNull())
    expect(localStorage.getItem(CONSENT_KEY)).toBeNull()
    expect(contact).toHaveFocus()
  } finally {
    if (descriptor) Object.defineProperty(document, 'elementFromPoint', descriptor)
    else Reflect.deleteProperty(document, 'elementFromPoint')
  }
})
it('returns focus to persistent preferences after saving removes the initial notice', async () => {
  const user = userEvent.setup()
  mount()
  await user.click(screen.getByRole('button', { name: 'Preferências' }))
  await user.click(within(choices()).getByRole('switch', { name: 'Análise' }))
  await user.click(within(choices()).getByRole('button', { name: 'Salvar preferências' }))
  await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
  await waitFor(() => expect(screen.getByRole('button', { name: 'Preferências de cookies' })).toHaveFocus())
})
it.each(['Rejeitar todos', 'Aceitar todos'])('applies %s only to available services', async label => {
  mount()
  await userEvent.click(screen.getByRole('button', { name: label }))
  expect(readConsent(localStorage, Date.now())?.preferences).toEqual({ analytics: label === 'Aceitar todos' ? 'granted' : 'denied', advertising: 'denied' })
  expect(screen.queryByRole('region', { name: 'Aviso de cookies' })).toBeNull()
})
it('discards edits on Escape, returns focus and saves only an explicit draft', async () => {
  const user = userEvent.setup()
  mount()
  const opener = screen.getByRole('button', { name: 'Preferências' })
  await user.click(opener)
  const toggle = within(choices()).getByRole('switch', { name: 'Análise' })
  expect(toggle).not.toBeChecked()
  expect(within(choices()).queryByText('Medição de anúncios')).toBeNull()
  await user.click(toggle)
  await user.keyboard('{Escape}')
  await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
  expect(localStorage.getItem(CONSENT_KEY)).toBeNull()
  await waitFor(() => expect(opener).toHaveFocus())
  await user.click(screen.getByRole('button', { name: 'Preferências de cookies' }))
  expect(within(choices()).getByRole('switch', { name: 'Análise' })).not.toBeChecked()
  await user.click(within(choices()).getByRole('switch', { name: 'Análise' }))
  await user.click(within(choices()).getByRole('button', { name: 'Salvar preferências' }))
  const saved = localStorage.getItem(CONSENT_KEY)
  expect(readConsent(localStorage, Date.now())?.preferences.analytics).toBe('granted')
  await user.click(screen.getByRole('button', { name: 'Preferências de cookies' }))
  expect(within(choices()).getByRole('switch', { name: 'Análise' })).toBeChecked()
  await user.click(within(choices()).getByRole('button', { name: 'Fechar preferências' }))
  expect(localStorage.getItem(CONSENT_KEY)).toBe(saved)
})
