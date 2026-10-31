// @vitest-environment node
import { afterEach, describe, expect, it } from 'vitest'
import { access, mkdir, mkdtemp, readFile, readdir, rm, symlink, writeFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { packageFtp } from './package-ftp.mjs'

const roots = []
const origin = 'https://www.delanofurtado.adv.br'
const verification = '<meta name="google-site-verification" content="public-test-verification">'

async function fixture() {
  const root = await mkdtemp(path.join(tmpdir(), 'delano-ftp-test-'))
  roots.push(root)
  const files = {
    'deploy/apache/.htaccess': 'Options -Indexes\nErrorDocument 404 /404.html\n',
    'deploy/apache/assets.htaccess': 'Header set Cache-Control "public, max-age=31536000, immutable"\n',
    'deploy/apache/search-console.html': verification,
    'dist/robots.txt': `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`,
    'dist/sitemap.xml': `<urlset>${['/', '/localizacao', '/contate-nos', '/politica-de-privacidade', '/politica-de-cookies'].map(route => `<url><loc>${origin}${route}</loc></url>`).join('')}</urlset>`,
    'dist/assets/index-AbCd1234.js': 'console.log("site")',
    'dist/media/photo.webp': 'fixture-image',
    'dist/favicon.ico': 'fixture-favicon',
  }
  for (const [file, route] of Object.entries({ 'index.html': '/', 'localizacao/index.html': '/localizacao', 'contate-nos/index.html': '/contate-nos', 'politica-de-privacidade/index.html': '/politica-de-privacidade', 'politica-de-cookies/index.html': '/politica-de-cookies', '404.html': '/404' })) {
    files[`dist/${file}`] = `<html><head><link rel="canonical" href="${origin}${route}"></head><body>${route}</body></html>`
  }
  for (const [file, content] of Object.entries(files)) {
    await mkdir(path.dirname(path.join(root, file)), { recursive: true })
    await writeFile(path.join(root, file), content)
  }
  return root
}

afterEach(async () => {
  for (const root of roots.splice(0)) {
    const resolved = path.resolve(root)
    if (path.dirname(resolved) !== path.resolve(tmpdir()) || !path.basename(resolved).startsWith('delano-ftp-test-')) throw new Error('Unexpected cleanup path')
    await rm(resolved, { recursive: true, force: true })
  }
})

describe('FTP package', () => {
  it('creates an upload folder with configs, verification and matching SHA-256 inventory, without changing dist', async () => {
    const root = await fixture()
    const before = await readFile(path.join(root, 'dist/index.html'), 'utf8')
    const result = await packageFtp({ root })
    const html = await readFile(path.join(result.siteDirectory, 'index.html'), 'utf8')
    expect(html.match(/google-site-verification/g)).toHaveLength(1)
    expect(html).toContain(verification)
    expect(await readFile(path.join(result.siteDirectory, '404.html'), 'utf8')).not.toContain('google-site-verification')
    expect(await readFile(path.join(root, 'dist/index.html'), 'utf8')).toBe(before)
    await access(path.join(result.siteDirectory, '.htaccess'))
    await access(path.join(result.siteDirectory, 'assets/.htaccess'))
    await access(path.join(result.siteDirectory, 'favicon.ico'))
    expect(await readdir(result.releaseDirectory)).toEqual(expect.arrayContaining(['site', 'manifest.json', 'LEIA-ME.md']))
    const manifest = JSON.parse(await readFile(path.join(result.releaseDirectory, 'manifest.json'), 'utf8'))
    expect(manifest.origin).toBe(origin)
    for (const file of manifest.files) {
      const data = await readFile(path.join(result.siteDirectory, file.path))
      expect(createHash('sha256').update(data).digest('hex')).toBe(file.sha256)
      expect(data.length).toBe(file.bytes)
    }
    expect(manifest.files.map(file => file.path)).not.toEqual(expect.arrayContaining(['manifest.json', 'LEIA-ME.md']))
  })

  it('requires a complete build before creating a release', async () => {
    const root = await fixture()
    await rm(path.join(root, 'dist/contate-nos/index.html'))
    await expect(packageFtp({ root })).rejects.toThrow(/contate-nos/)
    await expect(access(path.join(root, 'release-ftp'))).rejects.toThrow()
  })

  it('rejects unexpected files so source and credentials cannot enter the upload folder', async () => {
    const root = await fixture()
    await writeFile(path.join(root, 'dist/.env'), 'PRIVATE_VALUE=fixture')
    await expect(packageFtp({ root })).rejects.toThrow(/\.env/)
    await expect(access(path.join(root, 'release-ftp'))).rejects.toThrow()
  })

  it.each([
    ['index.html', '<html><head><link rel="canonical" href="https://preview.example/"></head></html>'],
    ['robots.txt', 'User-agent: *\nDisallow: /\n'],
    ['sitemap.xml', '<urlset><url><loc>http://old.example/</loc></url></urlset>'],
  ])('rejects a wrong production configuration in %s', async (file, content) => {
    const root = await fixture()
    await writeFile(path.join(root, 'dist', file), content)
    await expect(packageFtp({ root })).rejects.toThrow()
    await expect(access(path.join(root, 'release-ftp'))).rejects.toThrow()
  })

  it('creates a new release without copying stale files or deleting the previous one', async () => {
    const root = await fixture()
    const first = await packageFtp({ root })
    await writeFile(path.join(first.siteDirectory, 'stale.html'), 'old')
    const second = await packageFtp({ root })
    expect(second.siteDirectory).not.toBe(first.siteDirectory)
    await expect(access(path.join(second.siteDirectory, 'stale.html'))).rejects.toThrow()
    expect(await readFile(path.join(first.siteDirectory, 'stale.html'), 'utf8')).toBe('old')
  })

  it('refuses a release directory linked outside the project', async () => {
    const root = await fixture()
    const elsewhere = await fixture()
    await symlink(elsewhere, path.join(root, 'release-ftp'), process.platform === 'win32' ? 'junction' : 'dir')
    await expect(packageFtp({ root })).rejects.toThrow(/symbolic|link|junction/i)
    expect(await readdir(elsewhere)).toEqual(['deploy', 'dist'])
  })
})
