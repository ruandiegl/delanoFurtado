import { createContext, useContext } from 'react'
import type { AnalyticsConsent, ConsentRecord } from './storage'
export type ConsentContextValue = { analytics: AnalyticsConsent; preferencesOpen: boolean; ready: boolean; setAnalytics: (value: ConsentRecord['analytics']) => void; openPreferences: () => void; closePreferences: () => void }
export const ConsentContext = createContext<ConsentContextValue | null>(null)
export function useConsent() {
  const context = useContext(ConsentContext)
  if (!context) throw new Error('ConsentProvider ausente')
  return context
}
