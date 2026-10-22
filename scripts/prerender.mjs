import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { renderPage, renderSeoHead, publicRoutes, publicOrigin } from '../.prerender/entry-server.js'
const project = fileURLToPath(new URL('../', import.meta.url))
const dist = resolve(project, 'dist')
const template = await readFile(resolve(dist, 'index.html'), 'utf8')
if (!template.includes('<!--app-head-->') || !template.includes('<!--app-html-->')) throw new Error('Missing HTML injection markers')
for (const pathname of [...publicRoutes, '/404']) {
  const page = renderPage(pathname)
  const file = resolve(dist, pathname === '/' ? 'index.html' : pathname === '/404' ? '404.html' : `${pathname.slice(1)}/index.html`)
  if (!file.startsWith(`${dist}\\`) && !file.startsWith(`${dist}/`)) throw new Error('Output escaped dist')
  await mkdir(dirname(file), { recursive: true })
  await writeFile(file, template.replace('<!--app-head-->', renderSeoHead(page.seo) + page.styleTags).replace('<!--app-html-->', page.html))
}
await writeFile(resolve(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${publicRoutes.map(route => `<url><loc>${publicOrigin}${route === '/' ? '/' : route}</loc></url>`).join('')}</urlset>`)
await writeFile(resolve(dist, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${publicOrigin}/sitemap.xml\n`)
console.log('Prerendered 3 public routes and 404, with collected styles, sitemap and robots.')
