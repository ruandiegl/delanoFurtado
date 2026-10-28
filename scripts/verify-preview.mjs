import assert from 'node:assert/strict'
const origin = process.argv[2] ?? 'http://127.0.0.1:4173'
const cases = [
  ['/', 200, 'Advocacia e consultoria jurídica em Volta Redonda'],
  ['/localizacao', 200, 'Escritório em Volta Redonda'],
  ['/localizacao/', 200, 'Escritório em Volta Redonda'],
  ['/contate-nos', 200, 'Vamos conversar sobre o seu caso?'],
  ['/contate-nos/', 200, 'Vamos conversar sobre o seu caso?'],
  ['/LOCALIZACAO', 200, 'Escritório em Volta Redonda'],
  ['/LoCaLiZaCaO/', 200, 'Escritório em Volta Redonda'],
  ['/CONTATE-NOS', 200, 'Vamos conversar sobre o seu caso?'],
  ['/ROTA-INEXISTENTE', 404, 'Página não encontrada'],
  ['/pagina-inexistente', 404, 'Página não encontrada'],
  ['/pagina-inexistente.html', 404, 'Página não encontrada'],
]
for (const [path, status, heading] of cases) {
  const response = await fetch(`${origin}${path}`, { redirect: 'manual' })
  assert.equal(response.status, status, `${path}: status`)
  const html = await response.text()
  assert.match(html, /<h1[^>]*>/, `${path}: real HTML`)
  const mainHeading = html.match(/<h1[^>]*>(.*?)<\/h1>/s)?.[1]?.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
  assert.equal(mainHeading, heading, `${path}: initial heading before JavaScript`)
  assert.equal((html.match(/rel="canonical"/g) ?? []).length, 1)
  assert(html.includes('data-styled'), `${path}: collected CSS`)
  if (status === 404) assert(html.includes('noindex,follow'))
  console.log(`${status} ${path}: initial HTML/CSS/SEO correct`)
}
for (const [path, canonical] of [['/index.html', '/'], ['/localizacao/index.html', '/localizacao'], ['/contate-nos/index.html', '/contate-nos']]) {
  const response = await fetch(`${origin}${path}`, { redirect: 'manual' })
  assert.equal(response.status, 308)
  const location = response.headers.get('location')
  assert(location, `${path}: redirect destination`)
  assert.equal(new URL(location, origin).href, new URL(canonical, origin).href, `${path}: canonical redirect`)
}
console.log(`Documents verified: ${cases.length} document requests and 3 canonical redirects.`)
