import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, expect, it, vi } from 'vitest'
import { CONSENT_KEY, LEGACY_CONSENT_KEY, createConsent, readConsent } from '@/consent/storage'
import { ConsentProvider } from '@/consent/ConsentProvider'
import { useConsent } from '@/consent/context'
import { ConsentControls, PrivacyPreferencesButton } from '@/consent/ConsentControls'
import { createConsentStore } from '@/consent/store'

afterEach(() => { localStorage.clear(); sessionStorage.clear(); vi.useRealTimers(); vi.restoreAllMocks() })

it('removes a stale grant when a denial cannot be written to either storage', () => {
  localStorage.setItem(CONSENT_KEY, JSON.stringify(createConsent({ analytics: 'granted', advertising: 'denied' }, Date.now())))
  const store = createConsentStore()
  const stop = store.subscribe(() => {})
  const original = Storage.prototype.setItem
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(function(this: Storage, key: string, value: string) {
    if (this === sessionStorage || key === CONSENT_KEY) throw Error('read-only preference')
    original.call(this, key, value)
  })
  store.setPreferences({ analytics: 'denied', advertising: 'denied' })
  expect(localStorage.getItem(CONSENT_KEY)).toBeNull()
  expect(readConsent(localStorage, Date.now())?.preferences.analytics).not.toBe('granted')
  stop()
})

it('persists a legacy migration before removing the original and keeps its expiry', () => {
  const decidedAt = Date.now() - 86400000
  const expiresAt = decidedAt + 15552000000
  localStorage.setItem(LEGACY_CONSENT_KEY, JSON.stringify({ version: 1, analytics: 'granted', decidedAt, expiresAt }))
  const store = createConsentStore()
  const stop = store.subscribe(() => {})
  expect(readConsent(localStorage, Date.now())).toMatchObject({ version: 2, decidedAt, expiresAt })
  expect(localStorage.getItem(LEGACY_CONSENT_KEY)).toBeNull()
  localStorage.clear()
  fireEvent(window, new StorageEvent('storage', { key: null }))
  expect(store.getSnapshot().record).toBeNull()
  stop()
})

it('keeps a current denial when writing fails, and protects a v1 rollback', () => {
  const store = createConsentStore()
  const stop = store.subscribe(() => {})
  store.setPreferences({ analytics: 'denied', advertising: 'denied' })
  const current = store.getSnapshot().record!
  expect(JSON.parse(localStorage.getItem(LEGACY_CONSENT_KEY)!)).toEqual({ version: 1, analytics: 'denied', decidedAt: current.decidedAt, expiresAt: current.expiresAt })
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw Error('blocked') })
  store.setPreferences({ analytics: 'denied', advertising: 'denied' })
  fireEvent(window, new Event('focus'))
  expect(store.getSnapshot().record?.preferences.analytics).toBe('denied')
  stop()
})

it('rejects missing, expired, future, malformed and incompatible records', () => {
  const now = Date.now()
  expect(readConsent(null, now)).toBeNull()
  for (const value of ['broken', '{}', JSON.stringify({ ...createConsent({ analytics: 'granted', advertising: 'denied' }, now), version: 3 }), JSON.stringify(createConsent({ analytics: 'granted', advertising: 'denied' }, now + 1000)), JSON.stringify(createConsent({ analytics: 'granted', advertising: 'denied' }, now - 181 * 86400000))]) {
    expect(readConsent({ getItem: () => value }, now)).toBeNull()
  }
  expect(readConsent({ getItem: () => { throw Error('blocked') } }, now)).toBeNull()
  expect(readConsent({ getItem: () => JSON.stringify(createConsent({ analytics: 'granted', advertising: 'denied' }, now)) }, now)?.preferences.analytics).toBe('granted')
})

function Fixture() {
  const { analytics } = useConsent()
  return <><output>{analytics}</output><PrivacyPreferencesButton /><MemoryRouter><ConsentControls showInitial /></MemoryRouter></>
}

it('allows rejection, then reopens preferences and accepts explicitly', async () => {
  const user = userEvent.setup()
  render(<ConsentProvider><Fixture /></ConsentProvider>)
  expect(screen.getByRole('region', { name: 'Aviso de cookies' })).toBeInTheDocument()
  await user.click(screen.getByRole('button', { name: 'Rejeitar todos' }))
  expect(screen.getByText('denied')).toBeInTheDocument()
  expect(screen.queryByRole('region')).toBeNull()
  await user.click(screen.getByRole('button', { name: 'Preferências de cookies' }))
  await user.click(screen.getByRole('button', { name: 'Aceitar todos' }))
  expect(screen.getByText('granted')).toBeInTheDocument()
  expect(readConsent(localStorage, Date.now())?.preferences.analytics).toBe('granted')
})

it('synchronizes a denial from another tab and handles unavailable storage', async () => {
  localStorage.setItem(CONSENT_KEY, JSON.stringify(createConsent({ analytics: 'granted', advertising: 'denied' }, Date.now())))
  render(<ConsentProvider><Fixture /></ConsentProvider>)
  await waitFor(() => expect(screen.getByText('granted')).toBeInTheDocument())
  localStorage.setItem(CONSENT_KEY, JSON.stringify(createConsent({ analytics: 'denied', advertising: 'denied' }, Date.now())))
  fireEvent(window, new StorageEvent('storage', { key: CONSENT_KEY }))
  await waitFor(() => expect(screen.getByText('denied')).toBeInTheDocument())
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw Error('blocked') })
  await userEvent.click(screen.getByRole('button', { name: 'Preferências de cookies' }))
  await userEvent.click(screen.getByRole('button', { name: 'Rejeitar todos' }))
  expect(screen.getByText('denied')).toBeInTheDocument()
})

it('expires a stored permission while the page remains open', async () => {
  const now = Date.now()
  localStorage.setItem(CONSENT_KEY, JSON.stringify(createConsent({ analytics: 'granted', advertising: 'denied' }, now - 180 * 86400000 + 20)))
  render(<ConsentProvider><Fixture /></ConsentProvider>)
  await waitFor(() => expect(screen.getByText('unknown')).toBeInTheDocument(), { timeout: 1500 })
})

it('keeps checking long-lived consent after subscription cleanup and remount', () => {
  vi.useFakeTimers()
  const now = Date.now()
  localStorage.setItem(CONSENT_KEY, JSON.stringify(createConsent({ analytics: 'granted', advertising: 'denied' }, now)))
  const store = createConsentStore()
  const unsubscribe = store.subscribe(() => {})
  expect(store.getSnapshot().record?.preferences.analytics).toBe('granted')
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
  first.setPreferences({ analytics: 'denied', advertising: 'denied' })
  const restored = createConsentStore()
  const cleanup = restored.subscribe(() => {})
  try {
    expect(restored.getSnapshot().record?.preferences.analytics).toBe('denied')
    vi.advanceTimersByTime(181 * 86400000)
    fireEvent(window, new Event('focus'))
    expect(restored.getSnapshot().record).toBeNull()
  } finally { cleanup() }
})
