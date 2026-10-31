import { analyticsConfig } from '@/analytics/config'

export type ConsentPolicyVersion = 'analytics-v1' | 'analytics-ads-v1'
export type ConsentCapabilities = { analytics: boolean; advertising: boolean }
export const consentConfig = {
  policyVersion: 'analytics-v1' as ConsentPolicyVersion,
  lifetime: 180 * 86400000,
  // Ads remains unavailable until its real conversion action is confirmed.
  capabilities: { analytics: analyticsConfig.streamConfigured, advertising: false } satisfies ConsentCapabilities,
}
