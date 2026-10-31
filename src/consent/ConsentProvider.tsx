import { useRef, useState, useSyncExternalStore, type ReactNode } from 'react'
import { ConsentContext } from './context'
import { createConsentStore } from './store'
import type { ConsentPreferences } from './storage'

export function ConsentProvider({ children }: { children: ReactNode }) {
  const [store] = useState(createConsentStore)
  const { record, ready } = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot)
  const [preferencesOpen, setPreferencesOpen] = useState(false)
  const [storageWarning, setStorageWarning] = useState(false)
  const preferencesTrigger = useRef<HTMLElement | null>(null)
  function closePreferences() {
    setPreferencesOpen(false)
  }
  function setPreferences(value: ConsentPreferences) {
    const saved = store.setPreferences(value)
    setStorageWarning(!saved)
    if (saved) closePreferences()
    else setPreferencesOpen(true)
  }
  function setAnalytics(value: ConsentPreferences['analytics']) { setPreferences({ analytics: value, advertising: 'denied' }) }
  return <ConsentContext.Provider value={{ analytics: record?.preferences.analytics ?? 'unknown', record, ready, preferencesOpen, preferencesTrigger, storageWarning, setAnalytics, setPreferences, openPreferences: () => { preferencesTrigger.current = document.activeElement instanceof HTMLElement ? document.activeElement : null; setPreferencesOpen(true) }, closePreferences }}>{children}</ConsentContext.Provider>
}
