import { createContext, useContext, type RefObject } from 'react'
import type { AnalyticsConsent, ConsentPreferences, ConsentRecord } from './storage'
export type ConsentContextValue = { analytics: AnalyticsConsent; record: ConsentRecord | null; preferencesOpen: boolean; preferencesTrigger: RefObject<HTMLElement | null>; storageWarning: boolean; ready: boolean; setAnalytics: (value: ConsentPreferences['analytics']) => void; setPreferences: (value: ConsentPreferences) => void; openPreferences: () => void; closePreferences: () => void }
export const ConsentContext = createContext<ConsentContextValue | null>(null)
export function useConsent() {
  const context = useContext(ConsentContext)
  if (!context) throw new Error('ConsentProvider ausente')
  return context
}
