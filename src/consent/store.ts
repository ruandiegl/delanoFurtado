import { getAnalyticsClient } from '@/analytics/client'
import { CONSENT_KEY, createConsent, readConsent, type ConsentRecord } from './storage'

const deniedSessionKey = 'delano:analytics-denied'
const initial = { ready: false, record: null as ConsentRecord | null }
function readBrowserConsent() {
  try {
    const fallback = readConsent({ getItem: () => window.sessionStorage.getItem(deniedSessionKey) }, Date.now())
    if (fallback?.analytics === 'denied') return fallback
  } catch { /* Optional fallback. */ }
  try {
    // Ignore stale grants if storage is no longer writable after revocation.
    window.localStorage.setItem('delano:consent-probe', '1')
    window.localStorage.removeItem('delano:consent-probe')
    return readConsent(window.localStorage, Date.now())
  } catch { return null }
}
export function createConsentStore() {
  let snapshot = initial
  let timer: ReturnType<typeof setTimeout> | undefined
  const listeners = new Set<() => void>()
  function scheduleExpiry() {
    clearTimeout(timer)
    const record = snapshot.record
    if (!record) return
    timer = setTimeout(() => {
      if (record.expiresAt <= Date.now()) update(null)
      else scheduleExpiry()
    }, Math.max(0, Math.min(record.expiresAt - Date.now(), 2147483647)))
  }
  function update(record: ConsentRecord | null) {
    const revoke = snapshot.record?.analytics === 'granted' && record?.analytics !== 'granted'
    if (snapshot.ready && JSON.stringify(snapshot.record) === JSON.stringify(record)) { scheduleExpiry(); return }
    snapshot = { ready: true, record }
    scheduleExpiry()
    if (revoke) getAnalyticsClient().revoke()
    listeners.forEach(listener => listener())
  }
  const sync = () => update(readBrowserConsent())
  const storage = (event: StorageEvent) => { if (event.key === CONSENT_KEY || event.key === null) sync() }
  return {
    getSnapshot: () => snapshot,
    getServerSnapshot: () => initial,
    subscribe(listener: () => void) {
      listeners.add(listener)
      if (listeners.size === 1) {
        sync()
        window.addEventListener('storage', storage)
        window.addEventListener('focus', sync)
        document.addEventListener('visibilitychange', sync)
      }
      return () => {
        listeners.delete(listener)
        if (!listeners.size) { clearTimeout(timer); window.removeEventListener('storage', storage); window.removeEventListener('focus', sync); document.removeEventListener('visibilitychange', sync) }
      }
    },
    set(value: ConsentRecord['analytics']) {
      const record = createConsent(value, Date.now())
      let saved = false
      try { localStorage.setItem(CONSENT_KEY, JSON.stringify(record)); saved = true } catch { /* Explicit choice still applies now. */ }
      try { if (value === 'denied' && !saved) sessionStorage.setItem(deniedSessionKey, JSON.stringify(record)); else sessionStorage.removeItem(deniedSessionKey) } catch { /* Blocked storage is ignored on subsequent initialization. */ }
      update(record)
    },
  }
}
