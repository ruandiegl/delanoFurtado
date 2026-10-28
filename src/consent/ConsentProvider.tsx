import { useRef, useState, useSyncExternalStore, type ReactNode } from 'react'
import { ConsentContext } from './context'
import { createConsentStore } from './store'
import type { ConsentRecord } from './storage'

export function ConsentProvider({ children }: { children: ReactNode }) {
  const [store] = useState(createConsentStore)
  const { record, ready } = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot)
  const [preferencesOpen, setPreferencesOpen] = useState(false)
  const trigger = useRef<HTMLElement | null>(null)
  function closePreferences() {
    setPreferencesOpen(false)
    requestAnimationFrame(() => { if (trigger.current?.isConnected) trigger.current.focus() })
  }
  function setAnalytics(value: ConsentRecord['analytics']) { store.set(value); closePreferences() }
  return <ConsentContext.Provider value={{ analytics: record?.analytics ?? 'unknown', ready, preferencesOpen, setAnalytics, openPreferences: () => { trigger.current = document.activeElement instanceof HTMLElement ? document.activeElement : null; setPreferencesOpen(true) }, closePreferences }}>{children}</ConsentContext.Provider>
}
