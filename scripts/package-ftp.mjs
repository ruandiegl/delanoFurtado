import { access, lstat, mkdir, readFile, readdir, realpath, writeFile } from 'node:fs/promises'
import { createHash, randomUUID } from 'node:crypto'
import { fileURLToPath, pathToFileURL } from 'node:url'
import path from 'node:path'

const projectRoot = fileURLToPath(new URL('../', import.meta.url))
const origin = 'https://www.delanofurtado.adv.br'
const pages = new Map([
  ['index.html', '/'], ['localizacao/index.html', '/localizacao'],
  ['contate-nos/index.html', '/contate-nos'], ['404.html', '/404'],
])
const rootFiles = new Set([...pages.keys(), 'robots.txt', 'sitemap.xml'])
const digest = data => createHash('sha256').update(data).digest('hex')

async function rejectLink(file) {
  try {
    if ((await lstat(file)).isSymbolicLink()) throw new Error(`Symbolic link/junction not allowed: ${file}`)
  } catch (error) {
    if (error.code !== 'ENOENT') throw error
  }
}

async function collectBuild(directory, prefix = '') {
  const files = []
  await rejectLink(directory)
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const relative = path.posix.join(prefix, entry.name)
    const file = path.join(directory, entry.name)
    if (entry.isSymbolicLink()) throw new Error(`Symbolic link/junction not allowed: ${relative}`)
    if (entry.isDirectory()) {
      if (!/^(assets|media)(\/[^.][^/]*)?$/.test(relative) && !['localizacao', 'contate-nos'].includes(relative)) throw new Error(`Unexpected build directory: ${relative}`)
      files.push(...await collectBuild(file, relative))
    } else if (entry.isFile()) {
      const asset = /^assets\/[^/]+-[A-Za-z0-9_-]{8,}\.(js|css|woff2)$/.test(relative)
      const media = /^media\/(?!\.)(?:[^/]+\/)*[^/]+\.(webp|png|jpe?g|svg|avif|ico|json)$/.test(relative)
      if (!rootFiles.has(relative) && !asset && !media) throw new Error(`Unexpected build file: ${relative}`)
      files.push({ path: relative, data: await readFile(file) })
    } else throw new Error(`Unsupported build entry: ${relative}`)
  }
  return files
}

function validateProduction(files) {
  const byPath = new Map(files.map(file => [file.path, file.data.toString('utf8')]))
  for (const file of rootFiles) if (!byPath.has(file)) throw new Error(`Build missing required file: ${file}`)
  for (const [file, route] of pages) {
    const html = byPath.get(file)
    const canonicals = [...html.matchAll(/<link\b[^>]*rel="canonical"[^>]*href="([^"]+)"[^>]*>/g)]
    if (canonicals.length !== 1 || canonicals[0][1] !== `${origin}${route}`) throw new Error(`Wrong production canonical: ${file}`)
    if (!html.includes('</head>') || /UA-\d+-\d+/.test(html)) throw new Error(`Invalid or legacy HTML: ${file}`)
  }
  const robots = byPath.get('robots.txt')
  if (/^\s*Disallow:\s*\/\s*$/im.test(robots) || !robots.includes(`Sitemap: ${origin}/sitemap.xml`)) throw new Error('Invalid production robots.txt')
  const locations = [...byPath.get('sitemap.xml').matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]).sort()
  const expected = ['/', '/localizacao', '/contate-nos'].map(route => `${origin}${route}`).sort()
  if (JSON.stringify(locations) !== JSON.stringify(expected)) throw new Error('Invalid production sitemap.xml')
}

export async function packageFtp({ root = projectRoot } = {}) {
  const resolvedRoot = await realpath(root)
  const build = path.join(resolvedRoot, 'dist')
  const releases = path.join(resolvedRoot, 'release-ftp')
  await rejectLink(releases)
  const files = await collectBuild(build)
  validateProduction(files)
  const configuration = path.join(resolvedRoot, 'deploy/apache')
  const verification = (await readFile(path.join(configuration, 'search-console.html'), 'utf8')).trim()
  if (!/^<meta name="google-site-verification" content="[A-Za-z0-9_-]+">$/.test(verification)) throw new Error('Invalid Search Console verification snippet')
  const home = files.find(file => file.path === 'index.html')
  const homeHtml = home.data.toString('utf8')
  if (!homeHtml.includes(verification)) home.data = Buffer.from(homeHtml.replace('</head>', `${verification}\n</head>`))
  files.push(
    { path: '.htaccess', data: await readFile(path.join(configuration, '.htaccess')) },
    { path: 'assets/.htaccess', data: await readFile(path.join(configuration, 'assets.htaccess')) },
  )

  // Each run creates a separate release: no deletion, stale-file reuse or overwrite.
  await mkdir(releases, { recursive: true })
  const releaseId = `${new Date().toISOString().replace(/[-:.]/g, '')}-${randomUUID().slice(0, 8)}`
  const releaseDirectory = path.join(releases, releaseId)
  const siteDirectory = path.join(releaseDirectory, 'site')
  await mkdir(releaseDirectory)
  const inventory = []
  for (const file of files.sort((a, b) => a.path.localeCompare(b.path))) {
    const target = path.resolve(siteDirectory, file.path)
    if (!target.startsWith(`${siteDirectory}${path.sep}`)) throw new Error(`Output escaped site directory: ${file.path}`)
    await mkdir(path.dirname(target), { recursive: true })
    await writeFile(target, file.data, { flag: 'wx' })
    inventory.push({ path: file.path, bytes: file.data.length, sha256: digest(file.data) })
  }
  const manifest = { version: 1, releaseId, createdAt: new Date().toISOString(), origin, searchConsolePreserved: true, analyticsInstalledByPackager: false, files: inventory }
  await writeFile(path.join(releaseDirectory, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`, { flag: 'wx' })
  await writeFile(path.join(releaseDirectory, 'LEIA-ME.md'), `# Publicação HostGator\n\nEnvie somente o CONTEÚDO da pasta site para a raiz do domínio ${origin}, incluindo .htaccess e assets/.htaccess. Não envie a pasta site, este arquivo ou manifest.json.\n\nAntes: consulte docs/publicacao-hostgator-filezilla.md no projeto, confirme a raiz no cPanel e faça backup dos arquivos e configurações remotos. Preserve .well-known, configurações do provedor e arquivos da galeria antiga enquanto usados nas campanhas. Faça a conferência e a troca em uma janela combinada com o responsável pelo tráfego.\n\nEste pacote preserva a verificação HTML existente do Search Console. Não instala Analytics ou Google Ads. As contas, destinos e conversões ainda precisam ser conferidos. O Apache da hospedagem não foi testado por este empacotamento local.\n`, { flag: 'wx' })
  return { releaseDirectory, siteDirectory, files: inventory.length, bytes: inventory.reduce((sum, file) => sum + file.bytes, 0) }
}

if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) {
  const result = await packageFtp()
  await access(path.join(result.releaseDirectory, 'manifest.json'))
  console.log(JSON.stringify(result, null, 2))
}
