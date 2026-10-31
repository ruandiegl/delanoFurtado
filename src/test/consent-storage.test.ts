import { describe, expect, it } from 'vitest'
import { CONSENT_LIFETIME, createConsent, readConsent } from '@/consent/storage'

const now = 1793360000000
const granted = { analytics: 'granted', advertising: 'denied' } as const
const stored = (v2: unknown, v1?: unknown) => ({ getItem: (key: string) => key === 'delano:consent:v2' ? (v2 === undefined ? null : JSON.stringify(v2)) : key === 'delano:consent:v1' ? (v1 === undefined ? null : JSON.stringify(v1)) : null })

describe('consent purposes and migration', () => {
  it.each(['granted', 'denied'] as const)('migrates a legacy %s without renewing dates or authorizing ads', analytics => {
    const decidedAt = now - 5 * 86400000
    expect(readConsent(stored(undefined, { version: 1, analytics, decidedAt, expiresAt: decidedAt + CONSENT_LIFETIME }), now)).toEqual({ version: 2, policyVersion: 'analytics-v1', preferences: { analytics, advertising: 'denied' }, decidedAt, expiresAt: decidedAt + CONSENT_LIFETIME })
  })
  it('creates a dated choice, reads v2 first and rejects incompatible purposes', () => {
    const record = createConsent(granted, now)
    expect(record).toEqual({ version: 2, policyVersion: 'analytics-v1', preferences: granted, decidedAt: now, expiresAt: now + 15552000000 })
    expect(readConsent(stored(record), now)).toEqual(record)
    expect(readConsent(stored(record), now, 'analytics-ads-v1')).toBeNull()
    expect(readConsent(stored(undefined, { version: 1, analytics: 'granted', decidedAt: now, expiresAt: now + CONSENT_LIFETIME }), now, 'analytics-ads-v1')).toBeNull()
  })
  it('does not revive a legacy grant when v2 is invalid or expired', () => {
    const legacy = { version: 1, analytics: 'granted', decidedAt: now, expiresAt: now + CONSENT_LIFETIME }
    expect(readConsent(stored({}, legacy), now)).toBeNull()
    expect(readConsent(stored(createConsent(granted, now - CONSENT_LIFETIME), legacy), now)).toBeNull()
  })
  it.each([
    { version: 3 }, { preferences: { analytics: 'granted' } },
    { preferences: { analytics: 'yes', advertising: 'denied' } },
    { decidedAt: now + 1, expiresAt: now + 1 + CONSENT_LIFETIME },
    { decidedAt: -1, expiresAt: CONSENT_LIFETIME - 1 },
    { expiresAt: now + CONSENT_LIFETIME + 1 }, { policyVersion: 'unknown' },
  ])('fails closed for invalid record %o', override => {
    expect(readConsent(stored({ ...createConsent(granted, now), ...override }), now)).toBeNull()
  })
  it('masks advertising grants without an installed service', () => {
    expect(readConsent(stored({ version: 2, policyVersion: 'analytics-v1', preferences: { analytics: 'granted', advertising: 'granted' }, decidedAt: now, expiresAt: now + CONSENT_LIFETIME }), now)?.preferences.advertising).toBe('denied')
  })
})
