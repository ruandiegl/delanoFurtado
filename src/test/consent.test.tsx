import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, expect, it, vi } from 'vitest'
import { CONSENT_KEY, createConsent, readConsent } from '@/consent/storage'
import { ConsentProvider } from '@/consent/ConsentProvider'
import { useConsent } from '@/consent/context'
import { ConsentControls, PrivacyPreferencesButton } from '@/consent/ConsentControls'
import { createConsentStore } from '@/consent/store'

afterEach(() => { localStorage.clear(); sessionStorage.clear(); vi.useRealTimers(); vi.restoreAllMocks() })

it('rejects missing, expired, future, malformed and incompatible records', () => {
  const now = Date.now()
  expect(readConsent(null, now)).toBeNull()
  for (const value of ['broken', '{}', JSON.stringify({ ...createConsent('granted', now), version: 2 }), JSON.stringify(createConsent('granted', now + 1000)), JSON.stringify(createConsent('granted', now - 181 * 86400000))]) {
    expect(readConsent({ getItem: () => value }, now)).toBeNull()
  }
  expect(readConsent({ getItem: () => { throw Error('blocked') } }, now)).toBeNull()
  expect(readConsent({ getItem: () => JSON.stringify(createConsent('granted', now)) }, now)?.analytics).toBe('granted')
})

function Fixture() {
  const { analytics } = useConsent()
  return <><output>{analytics}</output><PrivacyPreferencesButton /><ConsentControls showInitial /></>
}

it('allows rejection, then reopens preferences and accepts explicitly', async () => {
  const user = userEvent.setup()
  render(<ConsentProvider><Fixture /></ConsentProvider>)
  expect(screen.getByRole('region', { name: 'Preferências de privacidade' })).toBeInTheDocument()
  await user.click(screen.getByRole('button', { name: 'Recusar análise' }))
  expect(screen.getByText('denied')).toBeInTheDocument()
  expect(screen.queryByRole('region')).toBeNull()
  await user.click(screen.getByRole('button', { name: 'Preferências de privacidade' }))
  await user.click(screen.getByRole('button', { name: 'Aceitar análise' }))
  expect(screen.getByText('granted')).toBeInTheDocument()
  expect(readConsent(localStorage, Date.now())?.analytics).toBe('granted')
})

it('synchronizes a denial from another tab and handles unavailable storage', async () => {
  localStorage.setItem(CONSENT_KEY, JSON.stringify(createConsent('granted', Date.now())))
  render(<ConsentProvider><Fixture /></ConsentProvider>)
  await waitFor(() => expect(screen.getByText('granted')).toBeInTheDocument())
  localStorage.setItem(CONSENT_KEY, JSON.stringify(createConsent('denied', Date.now())))
  fireEvent(window, new StorageEvent('storage', { key: CONSENT_KEY }))
  await waitFor(() => expect(screen.getByText('denied')).toBeInTheDocument())
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw Error('blocked') })
  await userEvent.click(screen.getByRole('button', { name: 'Preferências de privacidade' }))
  await userEvent.click(screen.getByRole('button', { name: 'Recusar análise' }))
  expect(screen.getByText('denied')).toBeInTheDocument()
})

it('expires a stored permission while the page remains open', async () => {
  const now = Date.now()
  localStorage.setItem(CONSENT_KEY, JSON.stringify(createConsent('granted', now - 180 * 86400000 + 20)))
  render(<ConsentProvider><Fixture /></ConsentProvider>)
  await waitFor(() => expect(screen.getByText('unknown')).toBeInTheDocument(), { timeout: 1500 })
})

it('keeps checking long-lived consent after subscription cleanup and remount', () => {
  vi.useFakeTimers()
  const now = Date.now()
  localStorage.setItem(CONSENT_KEY, JSON.stringify(createConsent('granted', now)))
  const store = createConsentStore()
  const unsubscribe = store.subscribe(() => {})
  expect(store.getSnapshot().record?.analytics).toBe('granted')
  unsubscribe()
  const cleanup = store.subscribe(() => {})
  vi.advanceTimersByTime(180 * 86400000 + 1)
  expect(store.getSnapshot().record).toBeNull()
  cleanup()
})

it('expires the session fallback too when the persistent preference cannot be written', () => {
  vi.useFakeTimers()
  const original = Storage.prototype.setItem
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(function (this: Storage, key: string, value: string) {
    if (this === localStorage && key === CONSENT_KEY) throw Error('read-only preference')
    original.call(this, key, value)
  })
  const first = createConsentStore()
  first.set('denied')
  const restored = createConsentStore()
  const cleanup = restored.subscribe(() => {})
  try {
    expect(restored.getSnapshot().record?.analytics).toBe('denied')
    vi.advanceTimersByTime(181 * 86400000)
    fireEvent(window, new Event('focus'))
    expect(restored.getSnapshot().record).toBeNull()
  } finally { cleanup() }
})
