import { afterEach, expect, it, vi } from 'vitest'
import { createAnalyticsClient } from '@/analytics/client'

const config = { measurementId: 'G-6Z7JD1757Y', productionOrigin: window.location.origin, streamConfigured: true }
afterEach(() => { document.head.querySelectorAll('[data-delano-analytics]').forEach(node => node.remove()); delete window.gtag; delete window.dataLayer; vi.restoreAllMocks() })

it('blocks loading and events without consent, on preview, or while stream settings are pending', () => {
  const client = createAnalyticsClient(config)
  client.page('/'); client.track('whatsapp_click', 'hero')
  expect(document.querySelector('[data-delano-analytics]')).toBeNull()
  for (const input of [{ ...config, streamConfigured: false }, { ...config, productionOrigin: 'https://other.example' }, { ...config, measurementId: '' }]) {
    const blocked = createAnalyticsClient(input)
    blocked.grant('/'); blocked.track('whatsapp_click', 'hero')
  }
  expect(document.querySelector('[data-delano-analytics]')).toBeNull()
  expect(window.dataLayer).toBeUndefined()
})

it('loads once and only measures the current canonical page after consent', () => {
  const client = createAnalyticsClient(config)
  client.page('/'); client.page('/contate-nos')
  client.grant('/localizacao?email=private#case')
  // Unknown/raw inputs are never emitted; the bridge supplies pathname only.
  expect(window.dataLayer).toBeUndefined()
  client.grant('/localizacao'); client.grant('/localizacao/'); client.page('/localizacao/index.html')
  expect(document.querySelectorAll('[data-delano-analytics]')).toHaveLength(1)
  const commands = Array.from(window.dataLayer ?? [], item => Array.from(item as ArrayLike<unknown>))
  expect(commands.filter(item => item[0] === 'config')).toHaveLength(1)
  expect(commands.filter(item => item[0] === 'event')).toEqual([['event', 'page_view', expect.objectContaining({ page_path: '/localizacao', page_location: `${window.location.origin}/localizacao`, page_referrer: '', send_to: config.measurementId })]])
  expect(commands.find(item => item[0] === 'config')?.[2]).toMatchObject({ send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false })
})

it('records real route changes and allowed contact metadata without personal information', () => {
  const client = createAnalyticsClient(config)
  client.grant('/localizacao'); client.page('/contate-nos'); client.track('whatsapp_click', 'contact_page'); client.page('/localizacao')
  const commands = Array.from(window.dataLayer ?? [], item => Array.from(item as ArrayLike<unknown>))
  expect(commands.filter(item => item[0] === 'event' && item[1] === 'page_view')).toHaveLength(3)
  expect(commands.find(item => item[1] === 'whatsapp_click')?.[2]).toEqual(expect.objectContaining({ page_path: '/contate-nos', link_location: 'contact_page' }))
  expect(JSON.stringify(commands)).not.toMatch(/wa\.me|5524999|mailto:|private|#case/)
  client.page('/unknown-private-case'); client.track('whatsapp_click', 'hero')
  expect(Array.from(window.dataLayer ?? [], item => Array.from(item as ArrayLike<unknown>)).filter(item => item[0] === 'event')).toHaveLength(4)
})

it('revokes synchronously, invalidates pending load and clears queued events', () => {
  const reload = vi.fn()
  const client = createAnalyticsClient(config, reload)
  client.grant('/')
  const script = document.querySelector<HTMLScriptElement>('[data-delano-analytics]')!
  client.revoke(); script.dispatchEvent(new Event('load')); client.track('whatsapp_click', 'hero'); client.page('/localizacao')
  expect(reload).toHaveBeenCalledOnce()
  expect(Reflect.get(window, `ga-disable-${config.measurementId}`)).toBe(true)
  expect(window.dataLayer).toHaveLength(0)
  expect(document.querySelector('[data-delano-analytics]')).toBeNull()
})

it('a blocked tag cannot interrupt site navigation or start sending later', () => {
  const client = createAnalyticsClient(config)
  client.grant('/')
  document.querySelector('[data-delano-analytics]')!.dispatchEvent(new Event('error'))
  expect(() => { client.page('/contate-nos'); client.track('phone_click', 'contact_page') }).not.toThrow()
  expect(window.dataLayer).toHaveLength(0)
})

it('allows a new explicit grant after revocation when no SDK ever started', () => {
  const reload = vi.fn()
  const client = createAnalyticsClient(config, reload)
  client.grant('/unknown')
  client.revoke()
  expect(reload).not.toHaveBeenCalled()
  client.grant('/')
  expect(document.querySelectorAll('[data-delano-analytics]')).toHaveLength(1)
})

it('invalidates the previous page through the bridge grant path on unknown URLs', () => {
  const client = createAnalyticsClient(config)
  client.grant('/')
  client.grant('/unknown-private-case')
  client.track('whatsapp_click', 'floating')
  client.grant('/')
  const commands = Array.from(window.dataLayer ?? [], item => Array.from(item as ArrayLike<unknown>))
  expect(commands.filter(item => item[1] === 'whatsapp_click')).toHaveLength(0)
  expect(commands.filter(item => item[1] === 'page_view')).toHaveLength(2)
})
