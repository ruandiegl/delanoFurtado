import { useContext, useState } from 'react'
import { ConsentContext, useConsent } from './context'
import { consentConfig } from './config'
import { CookieBanner } from './CookieBanner'
import { CookiePreferencesDialog } from './CookiePreferencesDialog'

export function ConsentControls({ showInitial = consentConfig.capabilities.analytics }: { showInitial?: boolean }) {
  const consent = useConsent()
  const [dismissed, setDismissed] = useState(false)
  if (!consent.ready) return null
  return <>{showInitial && !dismissed && consent.analytics === 'unknown' && <CookieBanner onDismiss={() => setDismissed(true)} />}<CookiePreferencesDialog /></>
}
export function PrivacyPreferencesButton() {
  const consent = useContext(ConsentContext)
  return consent ? <button type="button" data-cookie-preferences className="privacy-preferences" onClick={consent.openPreferences}>Preferências de cookies</button> : null
}
