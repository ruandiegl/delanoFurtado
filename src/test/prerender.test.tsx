// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { renderPage } from '@/entry-server'
import { services } from '@/content/services'
describe('renderPage without browser APIs', () => {
  it.each([
    ['/LOCALIZACAO', '/localizacao', 'Escritório em Volta Redonda'],
    ['/LoCaLiZaCaO/', '/localizacao', 'Escritório em Volta Redonda'],
    ['/CONTATE-NOS/INDEX.HTML', '/contate-nos', 'Vamos conversar sobre o seu caso?'],
    ['/INDEX.HTML', '/', 'Advocacia e consultoria jurídica em Volta Redonda'],
  ])('accepts the static host alias %s with a canonical URL', (alias, canonical, heading) => {
    const page = renderPage(alias)
    expect(page.html.replace(/<[^>]+>/g, '')).toContain(heading)
    expect(page.seo.canonical).toBe(`https://www.delanofurtado.adv.br${canonical}`)
    expect(page.seo.noindex).toBe(false)
  })
  it.each([
    ['/', 'Advocacia e consultoria jurídica em Volta Redonda'],
    ['/localizacao', 'Escritório em Volta Redonda'],
    ['/contate-nos', 'Vamos conversar sobre o seu caso?'],
    ['/rota-inexistente', 'Página não encontrada'],
  ])('renders distinct content and collected styles for %s', (path, heading) => {
    const page = renderPage(path)
    expect(page.html.replace(/<[^>]+>/g, '')).toContain(heading)
    expect(page.html.match(/<main/g)).toHaveLength(1)
    expect(page.styleTags).toContain('data-styled')
    expect(page.seo.noindex).toBe(path === '/rota-inexistente')
  })
  it('uses the real address, canonical, hero cutout and all service details in initial HTML', () => {
    const location = renderPage('/localizacao')
    expect(location.html).toContain('Rua 18 - B, 45 - Vila Santa Cecília')
    expect(location.seo.canonical).toBe('https://www.delanofurtado.adv.br/localizacao')
    const home = renderPage('/').html
    expect(home).toContain('/media/delano-hero-686.webp')
    expect(home).toContain('OAB/RJ 235.314')
    for (const service of services) for (const item of service.items) expect(home).toContain(item)
  })
})
