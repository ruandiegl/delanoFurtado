// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { renderPage } from '@/entry-server'
import { resolvePreviewPage } from '@/routes/previewManifest'

describe('public privacy documents', () => {
  it.each([
    ['/politica-de-privacidade', 'Política de Privacidade'],
    ['/politica-de-cookies', 'Política de Cookies'],
  ])('serves %s as readable initial HTML with its own SEO and contact', (route, heading) => {
    const page = renderPage(route)
    expect(page.html).toContain(heading)
    expect(page.html).toContain('contato@delanofurtado.adv.br')
    expect(page.seo.title).toBe(`${heading} | Delano Furtado`)
    expect(page.seo.canonical).toBe(`https://www.delanofurtado.adv.br${route}`)
    expect(page.seo.noindex).toBe(false)
    expect(page.html).not.toContain('googletagmanager.com/gtag/js')
    expect(resolvePreviewPage(route)).toEqual({ file: `${route.slice(1)}/index.html`, status: 200 })
    expect(resolvePreviewPage(`${route}/index.html`)).toEqual({ redirect: route, status: 308 })
    expect(page.html).toContain('href="/politica-de-cookies"')
    expect(page.html).toContain('href="/politica-de-privacidade"')
  })
  it('distinguishes local preferences from analytics cookies and account retention', () => {
    const html = renderPage('/politica-de-cookies').html
    expect(html).toContain('localStorage')
    expect(html).toContain('sessionStorage')
    expect(html).toContain('_ga')
    expect(html).toContain('180 dias')
    expect(html).toContain('Google Ads não está instalado')
  })
})
