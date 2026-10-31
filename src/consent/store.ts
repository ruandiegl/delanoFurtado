import { getAnalyticsClient } from '@/analytics/client'
import { CONSENT_KEY, DENIED_SESSION_KEY, LEGACY_CONSENT_KEY, createConsent, readConsent, type ConsentPreferences, type ConsentRecord } from './storage'

const initial = { ready: false, record: null as ConsentRecord | null }
function readBrowserConsent() {
  try {
    const fallback = readConsent({ getItem: key => window.sessionStorage.getItem(key === CONSENT_KEY ? DENIED_SESSION_KEY : 'delano:analytics-denied') }, Date.now())
    if (fallback?.preferences.analytics === 'denied' && fallback.preferences.advertising === 'denied') return fallback
  } catch { /* Optional fallback. */ }
  try {
    // Ignore stale grants if storage is no longer writable after revocation.
    window.localStorage.setItem('delano:consent-probe', '1')
    window.localStorage.removeItem('delano:consent-probe')
    const record = readConsent(window.localStorage, Date.now())
    if (record && !window.localStorage.getItem(CONSENT_KEY)) {
      window.localStorage.setItem(CONSENT_KEY, JSON.stringify(record))
      window.localStorage.removeItem(LEGACY_CONSENT_KEY)
    }
    return record
  } catch { return null }
}
export function createConsentStore() {
  let snapshot = initial
  let memoryChoice: ConsentRecord | null = null
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
  function update(record: ConsentRecord | null, reloadOnRevoke = true) {
    const revoke = snapshot.record?.preferences.analytics === 'granted' && record?.preferences.analytics !== 'granted'
    if (snapshot.ready && JSON.stringify(snapshot.record) === JSON.stringify(record)) { scheduleExpiry(); return }
    snapshot = { ready: true, record }
    scheduleExpiry()
    if (revoke) getAnalyticsClient().revoke(reloadOnRevoke)
    listeners.forEach(listener => listener())
  }
  const sync = () => update(memoryChoice && memoryChoice.expiresAt > Date.now() ? memoryChoice : readBrowserConsent())
  const storage = (event: StorageEvent) => { if (event.key === CONSENT_KEY || event.key === LEGACY_CONSENT_KEY || event.key === null) { if (memoryChoice?.preferences.analytics !== 'denied') memoryChoice = null; sync() } }
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
    setPreferences(value: ConsentPreferences) {
      const record = createConsent(value, Date.now())
      let saved = false
      try { localStorage.setItem(CONSENT_KEY, JSON.stringify(record)); saved = true } catch { /* Explicit choice still applies now. */ }
      if (!saved && record.preferences.analytics === 'denied') {
        // A quota/read-only failure must not leave a stale grant ready for reload.
        for (const key of [CONSENT_KEY, LEGACY_CONSENT_KEY]) {
          try { localStorage.removeItem(key) } catch { /* Keep the denial latched in memory. */ }
        }
      }
      memoryChoice = saved ? null : record
      try {
        // A rollback to v1 must not revive a previously saved grant.
        if (record.preferences.analytics === 'denied') localStorage.setItem(LEGACY_CONSENT_KEY, JSON.stringify({ version: 1, analytics: 'denied', decidedAt: record.decidedAt, expiresAt: record.expiresAt }))
        else if (saved) localStorage.removeItem(LEGACY_CONSENT_KEY)
      } catch { /* The current decision still applies in memory. */ }
      try { if (record.preferences.analytics === 'denied' && !saved) sessionStorage.setItem(DENIED_SESSION_KEY, JSON.stringify(record)); else sessionStorage.removeItem(DENIED_SESSION_KEY); sessionStorage.removeItem('delano:analytics-denied') } catch { /* Blocked storage never grants on a subsequent visit. */ }
      // Never reload into a stale grant if the new decision could not be saved.
      update(record, saved)
      return saved
    },
  }
}
