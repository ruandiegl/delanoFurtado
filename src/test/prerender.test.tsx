// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { renderPage } from '@/entry-server'
import { services } from '@/content/services'
describe('renderPage without browser APIs', () => {
  it('treats non-canonical letter case consistently as not found', () => {
    const page = renderPage('/LOCALIZACAO')
    expect(page.html).toContain('Página não encontrada')
    expect(page.seo.noindex).toBe(true)
  })
  it.each([
    ['/', 'Advocacia e consultoria jurídica em Volta Redonda'],
    ['/localizacao', 'Escritório em Volta Redonda'],
    ['/contate-nos', 'Vamos conversar sobre o seu caso?'],
    ['/rota-inexistente', 'Página não encontrada'],
  ])('renders distinct content and collected styles for %s', (path, heading) => {
    const page = renderPage(path)
    expect(page.html).toContain(heading)
    expect(page.html.match(/<main/g)).toHaveLength(1)
    expect(page.styleTags).toContain('data-styled')
    expect(page.seo.noindex).toBe(path === '/rota-inexistente')
  })
  it('uses the real address, canonical and all service details in initial HTML', () => {
    const location = renderPage('/localizacao')
    expect(location.html).toContain('Rua 18 - B, 45 - Vila Santa Cecília')
    expect(location.seo.canonical).toBe('https://www.delanofurtado.adv.br/localizacao')
    const home = renderPage('/').html
    for (const service of services) for (const item of service.items) expect(home).toContain(item)
  })
})
