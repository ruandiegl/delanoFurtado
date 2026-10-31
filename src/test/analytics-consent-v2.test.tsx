import { StrictMode } from 'react'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Link, MemoryRouter } from 'react-router-dom'
import { afterEach, expect, it, vi } from 'vitest'
import { ConsentProvider } from '@/consent/ConsentProvider'
import { ConsentControls, PrivacyPreferencesButton } from '@/consent/ConsentControls'
import { AnalyticsBridge } from '@/analytics/AnalyticsBridge'
import { ContactCta } from '@/components/brand/ContactCta'
import { CONSENT_KEY, createConsent } from '@/consent/storage'

const { reload } = vi.hoisted(() => ({ reload: vi.fn() }))
vi.mock('@/analytics/client', async importOriginal => {
  const actual = await importOriginal<typeof import('@/analytics/client')>()
  let instance: ReturnType<typeof actual.createAnalyticsClient> | undefined
  return { ...actual, getAnalyticsClient: () => instance ??= actual.createAnalyticsClient({ measurementId: 'G-6Z7JD1757Y', productionOrigin: window.location.origin, streamConfigured: true }, reload) }
})
afterEach(() => { localStorage.clear(); sessionStorage.clear(); document.querySelector('[data-delano-analytics]')?.remove(); delete window.gtag; delete window.dataLayer })

it('never loads for dismissal/denial, loads once for a saved choice, and revokes before more events', async () => {
  const user = userEvent.setup()
  render(<StrictMode><MemoryRouter><ConsentProvider><AnalyticsBridge /><Link to="/politica-de-cookies">Abrir política</Link><ContactCta location="hero" /><PrivacyPreferencesButton /><ConsentControls showInitial /></ConsentProvider></MemoryRouter></StrictMode>)
  const commands = () => Array.from(window.dataLayer ?? [], item => Array.from(item as ArrayLike<unknown>))
  const dialog = () => screen.getByRole('dialog', { name: 'Preferências de cookies' })
  await user.click(screen.getByRole('button', { name: 'Fechar aviso de cookies' }))
  expect(window.dataLayer).toBeUndefined()
  expect(localStorage.getItem(CONSENT_KEY)).toBeNull()
  await user.click(screen.getByRole('button', { name: 'Preferências de cookies' }))
  await user.click(within(dialog()).getByRole('button', { name: 'Rejeitar todos' }))
  expect(document.querySelector('[data-delano-analytics]')).toBeNull()
  await user.click(screen.getByRole('button', { name: 'Preferências de cookies' }))
  await user.click(within(dialog()).getByRole('switch', { name: 'Análise' }))
  await user.click(within(dialog()).getByRole('button', { name: 'Salvar preferências' }))
  await waitFor(() => expect(commands().filter(c => c[1] === 'page_view')).toHaveLength(1))
  expect(document.querySelectorAll('[data-delano-analytics]')).toHaveLength(1)
  expect(commands().find(c => c[0] === 'consent' && c[1] === 'update')?.[2]).toEqual({ analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' })
  await user.click(screen.getByRole('button', { name: 'Preferências de cookies' }))
  await user.click(within(dialog()).getByRole('button', { name: 'Salvar preferências' }))
  expect(commands().filter(c => c[1] === 'page_view')).toHaveLength(1)
  await user.click(screen.getByRole('link', { name: 'Abrir política' }))
  await waitFor(() => expect(commands().filter(c => c[1] === 'page_view')).toHaveLength(2))
  const click = new MouseEvent('click', { bubbles: true, cancelable: true })
  screen.getByRole('link', { name: 'Agendar atendimento' }).querySelector('svg')!.dispatchEvent(click)
  expect(click.defaultPrevented).toBe(false)
  expect(commands().filter(c => c[1] === 'whatsapp_click')).toHaveLength(1)
  document.cookie = '_ga=fixture; path=/'
  localStorage.setItem(CONSENT_KEY, JSON.stringify(createConsent({ analytics: 'denied', advertising: 'denied' }, Date.now())))
  fireEvent(window, new StorageEvent('storage', { key: CONSENT_KEY }))
  expect(Reflect.get(window, 'ga-disable-G-6Z7JD1757Y')).toBe(true)
  expect(commands()).toHaveLength(0)
  expect(document.querySelector('[data-delano-analytics]')).toBeNull()
  expect(document.cookie).not.toContain('_ga=')
  expect(reload).toHaveBeenCalledOnce()
})
