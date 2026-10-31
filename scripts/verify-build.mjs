import assert from 'node:assert/strict'
import { readFile, access } from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { publicRoutes, getSeo, services, siteData } from '../.prerender/entry-server.js'
const dist = fileURLToPath(new URL('../dist/', import.meta.url))
const headings = { '/': 'Advocacia e consultoria jurídica em Volta Redonda', '/localizacao': 'Escritório em Volta Redonda', '/contate-nos': 'Vamos conversar sobre o seu caso?', '/politica-de-privacidade': 'Política de Privacidade', '/politica-de-cookies': 'Política de Cookies', '/404': 'Página não encontrada' }
for (const route of [...publicRoutes, '/404']) {
  const path = route === '/' ? 'index.html' : route === '/404' ? '404.html' : `${route.slice(1)}/index.html`
  const html = await readFile(resolve(dist, path), 'utf8')
  const plainText = html.replace(/<[^>]+>/g, '')
  assert(plainText.includes(headings[route]), `${route}: heading`)
  assert.equal((html.match(/rel="canonical"/g) ?? []).length, 1, `${route}: one canonical`)
  assert(html.includes(getSeo(route).canonical), `${route}: correct canonical`)
  assert(html.includes('data-styled'), `${route}: collected styles`)
  assert.equal((html.match(/<main/g) ?? []).length, 1)
  assert(!html.includes('<!--app-'), `${route}: no unresolved injection`)
  assert(!html.includes('aggregateRating'), 'No invented ratings')
  assert(html.includes('sizes="96x96" href="/media/favicon-96.png"'), `${route}: shared high-resolution favicon`)
  if (route === '/') {
    assert(html.includes('/media/delano-hero-686.webp'), 'Hero cutout image present')
    for (const service of services) for (const item of service.items) assert(html.includes(item), `Missing service item: ${item}`)
  }
  if (route === '/localizacao') assert(html.includes(siteData.addressLine))
  if (route === '/404') assert(html.includes('noindex,follow'))
  for (const match of html.matchAll(/(?:src|href)="(\/(?:assets|media)\/[^"?]+)"/g)) await access(resolve(dist, `.${match[1]}`))
}
const sitemap = await readFile(resolve(dist, 'sitemap.xml'), 'utf8')
assert.equal((sitemap.match(/<loc>/g) ?? []).length, publicRoutes.length)
assert(!sitemap.includes('/404'))
await access(resolve(dist, 'robots.txt'))
const icon = await sharp(resolve(dist, 'media/favicon-96.png')).metadata()
assert.equal(icon.width, 96)
assert.equal(icon.height, 96)
assert.equal(icon.hasAlpha, false, 'Opaque favicon preserves contrast on dark search results')
const ico = await readFile(resolve(dist, 'favicon.ico'))
assert.equal(ico.readUInt16LE(2), 1, 'Root favicon is an ICO')
assert.equal(ico.readUInt16LE(4), 4, 'Root favicon has four sizes')
console.log(`Build verified: ${publicRoutes.length + 1} distinct HTML files, canonical/styles, complete service content, local assets, sitemap and robots.`)
