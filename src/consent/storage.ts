import { consentConfig, type ConsentPolicyVersion } from './config'

export const CONSENT_KEY = 'delano:consent:v2'
export const LEGACY_CONSENT_KEY = 'delano:consent:v1'
export const DENIED_SESSION_KEY = 'delano:consent-denied:v2'
export const CONSENT_LIFETIME = consentConfig.lifetime
export type AnalyticsConsent = 'unknown' | 'denied' | 'granted'
export type ConsentPreferences = { analytics: 'granted' | 'denied'; advertising: 'granted' | 'denied' }
export type ConsentRecord = { version: 2; policyVersion: ConsentPolicyVersion; preferences: ConsentPreferences; decidedAt: number; expiresAt: number }

export function effectivePreferences(value: ConsentPreferences): ConsentPreferences {
  return { analytics: consentConfig.capabilities.analytics && value.analytics === 'granted' ? 'granted' : 'denied', advertising: consentConfig.capabilities.advertising && value.advertising === 'granted' ? 'granted' : 'denied' }
}
export function createConsent(preferences: ConsentPreferences, now: number, policyVersion = consentConfig.policyVersion): ConsentRecord {
  return { version: 2, policyVersion, preferences: effectivePreferences(preferences), decidedAt: now, expiresAt: now + CONSENT_LIFETIME }
}
function dated(value: object, now: number): value is { decidedAt: number; expiresAt: number } {
  return 'decidedAt' in value && typeof value.decidedAt === 'number' && Number.isFinite(value.decidedAt) && value.decidedAt >= 0 && value.decidedAt <= now && 'expiresAt' in value && value.expiresAt === value.decidedAt + CONSENT_LIFETIME && value.expiresAt > now
}
const choice = (value: unknown): value is 'granted' | 'denied' => value === 'granted' || value === 'denied'
export function migrateLegacyConsent(value: unknown, now: number, policyVersion = consentConfig.policyVersion): ConsentRecord | null {
  if (policyVersion !== 'analytics-v1' || !value || typeof value !== 'object' || !('version' in value) || value.version !== 1 || !('analytics' in value) || !choice(value.analytics) || !dated(value, now)) return null
  return { version: 2, policyVersion, preferences: effectivePreferences({ analytics: value.analytics, advertising: 'denied' }), decidedAt: value.decidedAt, expiresAt: value.expiresAt }
}
export function readConsent(storage: Pick<Storage, 'getItem'> | null, now: number, policyVersion = consentConfig.policyVersion): ConsentRecord | null {
  try {
    const raw = storage?.getItem(CONSENT_KEY)
    if (raw == null) return migrateLegacyConsent(JSON.parse(storage?.getItem(LEGACY_CONSENT_KEY) ?? 'null'), now, policyVersion)
    const value: unknown = JSON.parse(raw)
    if (!value || typeof value !== 'object' || !('version' in value) || value.version !== 2 || !('policyVersion' in value) || value.policyVersion !== policyVersion || !dated(value, now) || !('preferences' in value) || !value.preferences || typeof value.preferences !== 'object' || !('analytics' in value.preferences) || !choice(value.preferences.analytics) || !('advertising' in value.preferences) || !choice(value.preferences.advertising)) return null
    return { version: 2, policyVersion, preferences: effectivePreferences({ analytics: value.preferences.analytics, advertising: value.preferences.advertising }), decidedAt: value.decidedAt, expiresAt: value.expiresAt }
  } catch { return null }
}
