export const CONSENT_KEY = 'delano:consent:v1'
export const CONSENT_LIFETIME = 180 * 86400000
export type AnalyticsConsent = 'unknown' | 'denied' | 'granted'
export type ConsentRecord = { version: 1; analytics: 'granted' | 'denied'; decidedAt: number; expiresAt: number }
export function createConsent(analytics: ConsentRecord['analytics'], now: number): ConsentRecord {
  return { version: 1, analytics, decidedAt: now, expiresAt: now + CONSENT_LIFETIME }
}
export function readConsent(storage: Pick<Storage, 'getItem'> | null, now: number): ConsentRecord | null {
  try {
    const value: unknown = JSON.parse(storage?.getItem(CONSENT_KEY) ?? 'null')
    if (!value || typeof value !== 'object' || !('version' in value) || value.version !== 1 || !('analytics' in value) || !['denied', 'granted'].includes(String(value.analytics)) || !('decidedAt' in value) || typeof value.decidedAt !== 'number' || !Number.isFinite(value.decidedAt) || value.decidedAt > now || !('expiresAt' in value) || value.expiresAt !== value.decidedAt + CONSENT_LIFETIME || value.expiresAt <= now) return null
    return { version: 1, analytics: value.analytics === 'granted' ? 'granted' : 'denied', decidedAt: value.decidedAt, expiresAt: value.expiresAt }
  } catch { return null }
}
