// @vitest-environment node
import { createServer } from 'node:http'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { fileURLToPath } from 'node:url'
import { afterEach, expect, it } from 'vitest'

const execute = promisify(execFile)
const script = fileURLToPath(new URL('./verify-preview.mjs', import.meta.url))
const servers = []

afterEach(async () => {
  await Promise.all(servers.splice(0).map(server => new Promise((resolve, reject) => {
    server.close(error => error ? reject(error) : resolve())
    server.closeAllConnections()
  })))
})

async function serve({ absolute = false, destination, pageRedirect = false } = {}) {
  const server = createServer((request, response) => {
    const url = new URL(request.url, origin)
    const aliases = { '/index.html': '/', '/localizacao/index.html': '/localizacao', '/contate-nos/index.html': '/contate-nos' }
    if (aliases[url.pathname]) {
      response.writeHead(308, { Location: destination ?? (absolute ? new URL(aliases[url.pathname], origin).href : aliases[url.pathname]) })
      response.end()
      return
    }
    if (pageRedirect && url.pathname === '/localizacao') {
      response.writeHead(301, { Location: '/localizacao/' })
      response.end()
      return
    }
    const path = url.pathname.toLowerCase().replace(/\/$/, '')
    const heading = path === '' ? 'Advocacia e consultoria jurídica em Volta Redonda'
      : path === '/localizacao' ? 'Escritório em Volta Redonda'
        : path === '/contate-nos' ? 'Vamos conversar sobre o seu caso?' : 'Página não encontrada'
    const notFound = heading === 'Página não encontrada'
    response.writeHead(notFound ? 404 : 200, { 'Content-Type': 'text/html' })
    response.end(`<html><head><link rel="canonical" href="${origin}${path}"><style data-styled></style>${notFound ? '<meta name="robots" content="noindex,follow">' : ''}</head><body><h1>${heading}</h1></body></html>`)
  })
  let origin
  await new Promise((resolve, reject) => {
    server.once('error', reject)
    server.listen(0, '127.0.0.1', resolve)
  })
  servers.push(server)
  origin = `http://127.0.0.1:${server.address().port}`
  return origin
}

it.each([false, true])('accepts the exact canonical destination with absolute Location = %s', async absolute => {
  const origin = await serve({ absolute })
  const result = await execute(process.execPath, [script, origin])
  expect(result.stdout).toContain('Documents verified: 11 document requests and 3 canonical redirects.')
})

it.each(['https://outside.example/', '/wrong-page', '/?unexpected=value'])('rejects an incorrect redirect destination: %s', async destination => {
  const origin = await serve({ destination })
  await expect(execute(process.execPath, [script, origin])).rejects.toThrow()
})

it('keeps rejecting an unwanted redirect on a canonical page', async () => {
  const origin = await serve({ pageRedirect: true })
  await expect(execute(process.execPath, [script, origin])).rejects.toThrow()
})
