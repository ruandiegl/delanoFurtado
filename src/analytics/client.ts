import { getSeo } from '@/content/seo'
import { resolvePublicRoute, type PublicRoute } from '@/routes/routeManifest'
import { analyticsConfig, type AnalyticsConfig, type ContactEvent, type LinkLocation } from './config'

declare global {
  interface Window { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void }
}

export function createAnalyticsClient(config: AnalyticsConfig, reload = () => window.location.reload()) {
  let authorized = false
  let started = false
  let failed = false
  let revoked = false
  let current: PublicRoute | null = null
  let script: HTMLScriptElement | null = null
  const allowed = () => typeof window !== 'undefined' && config.streamConfigured && /^G-[A-Z0-9]{6,}$/.test(config.measurementId) && window.location.origin === config.productionOrigin
  const context = (route: PublicRoute) => ({ page_path: route, page_location: `${config.productionOrigin}${route}`, page_title: getSeo(route).title, page_referrer: '' })
  const send = (...args: unknown[]) => { if (authorized && !failed && !revoked) window.gtag?.(...args) }
  function page(pathname: string) {
    const route = resolvePublicRoute(pathname)
    if (!authorized || failed || revoked || route === current) return
    current = route
    if (!route) return
    const values = context(route)
    send('set', values)
    send('event', 'page_view', { ...values, send_to: config.measurementId })
  }
  return {
    page,
    grant(pathname: string) {
      const route = resolvePublicRoute(pathname)
      if (!route) { current = null; return }
      if (!allowed() || failed || revoked) return
      authorized = true
      if (!started) {
        // This application owns its one installation; do not stack another tag.
        if (window.gtag || document.querySelector('[data-delano-analytics]')) { authorized = false; return }
        started = true
        Reflect.set(window, `ga-disable-${config.measurementId}`, false)
        window.dataLayer = []
        // Preserve the arguments-object command format used by Google's bootstrap.
        // eslint-disable-next-line prefer-rest-params
        window.gtag = function () { window.dataLayer?.push(arguments) }
        const denied = { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' }
        send('consent', 'default', denied)
        send('set', { allow_google_signals: false, allow_ad_personalization_signals: false, ads_data_redaction: true, url_passthrough: false })
        send('js', new Date())
        send('consent', 'update', { ...denied, analytics_storage: 'granted' })
        send('config', config.measurementId, { ...context(route), send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false, cookie_expires: 180 * 86400, cookie_flags: 'SameSite=Lax;Secure' })
        script = document.createElement('script')
        script.async = true
        script.dataset.delanoAnalytics = config.measurementId
        script.src = `https://www.googletagmanager.com/gtag/js?id=${config.measurementId}`
        script.onerror = () => { failed = true; authorized = false; window.dataLayer?.splice(0); script?.remove() }
        document.head.append(script)
      }
      page(route)
    },
    track(event: ContactEvent, location: LinkLocation) {
      if (!current) return
      send('event', event, { ...context(current), link_location: location, send_to: config.measurementId })
    },
    revoke(reloadPage = true) {
      authorized = false
      current = null
      if (!started) return
      revoked = true
      Reflect.set(window, `ga-disable-${config.measurementId}`, true)
      window.dataLayer?.splice(0)
      script?.remove()
      delete window.gtag
      const host = window.location.hostname
      const domains = ['', host, host.replace(/^www\./, '')]
      for (const cookie of document.cookie.split(';')) {
        const name = cookie.split('=')[0].trim()
        if (!/^_ga(?:_|$)/.test(name)) continue
        for (const domain of domains) document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax${domain ? `; Domain=${domain}` : ''}`
      }
      if (reloadPage) reload()
    },
  }
}

let instance: ReturnType<typeof createAnalyticsClient> | undefined
export function getAnalyticsClient() { return instance ??= createAnalyticsClient(analyticsConfig) }
