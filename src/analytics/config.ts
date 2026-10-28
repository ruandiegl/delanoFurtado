import { publicOrigin } from '@/content/seo'

export const analyticsConfig = {
  measurementId: 'G-6Z7JD1757Y',
  productionOrigin: publicOrigin,
  // Owner confirmed disabling Enhanced Measurement on 27/10/2026.
  // Validate ingestion and remote tag settings after publishing this release.
  streamConfigured: true,
} as const

export type AnalyticsConfig = { measurementId: string; productionOrigin: string; streamConfigured: boolean }
export type LinkLocation = 'header' | 'hero' | 'about' | 'coverage' | 'contact_section' | 'contact_page' | 'location_page' | 'floating' | 'footer' | 'reviews'
export type ContactEvent = 'whatsapp_click' | 'phone_click' | 'email_click' | 'map_click' | 'review_click'
