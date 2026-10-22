import assert from 'node:assert/strict'
import { readFile, access } from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { publicRoutes, getSeo, services, siteData } from '../.prerender/entry-server.js'
const dist = fileURLToPath(new URL('../dist/', import.meta.url))
const headings = ['Advocacia e consultoria jurídica em Volta Redonda', 'Escritório em Volta Redonda', 'Vamos conversar sobre o seu caso?', 'Página não encontrada']
for (const [index, route] of [...publicRoutes, '/404'].entries()) {
  const path = route === '/' ? 'index.html' : route === '/404' ? '404.html' : `${route.slice(1)}/index.html`
  const html = await readFile(resolve(dist, path), 'utf8')
  assert(html.includes(headings[index]), `${route}: heading`)
  assert.equal((html.match(/rel="canonical"/g) ?? []).length, 1, `${route}: one canonical`)
  assert(html.includes(getSeo(route).canonical), `${route}: correct canonical`)
  assert(html.includes('data-styled'), `${route}: collected styles`)
  assert.equal((html.match(/<main/g) ?? []).length, 1)
  assert(!html.includes('<!--app-'), `${route}: no unresolved injection`)
  assert(!html.includes('aggregateRating'), 'No invented ratings')
  if (route === '/') for (const service of services) for (const item of service.items) assert(html.includes(item), `Missing service item: ${item}`)
  if (route === '/localizacao') assert(html.includes(siteData.addressLine))
  if (route === '/404') assert(html.includes('noindex,follow'))
  for (const match of html.matchAll(/(?:src|href)="(\/(?:assets|media)\/[^"?]+)"/g)) await access(resolve(dist, `.${match[1]}`))
}
const sitemap = await readFile(resolve(dist, 'sitemap.xml'), 'utf8')
assert.equal((sitemap.match(/<loc>/g) ?? []).length, 3)
assert(!sitemap.includes('/404'))
await access(resolve(dist, 'robots.txt'))
console.log('Build verified: 4 distinct HTML files, canonical/styles, complete service content, local assets, sitemap and robots.')
