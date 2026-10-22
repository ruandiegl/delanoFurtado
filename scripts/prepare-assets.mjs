import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import sharp from 'sharp'

const root = fileURLToPath(new URL('../', import.meta.url))
const originals = path.join(root, 'docs/assets/delano-furtado')
const output = path.join(root, 'public/media')
await mkdir(output, { recursive: true })
const manifest = JSON.parse(await readFile(path.join(originals, 'manifesto.json'), 'utf8'))
for (const asset of manifest.assets) {
  const hash = createHash('sha256').update(await readFile(path.join(originals, asset.file))).digest('hex')
  if (hash !== asset.sha256) throw new Error(`Original alterado: ${asset.file}`)
}
const input = (name) => path.join(originals, name)
for (const width of [480, 800, 1200]) {
  await sharp(input('retrato-delano-furtado-original.jpg')).rotate().resize({ width }).webp({ quality: 84 }).toFile(path.join(output, `delano-${width}.webp`))
}
await sharp(input('logo-delano-furtado-original.png')).resize({ width: 1200 }).png().toFile(path.join(output, 'logo-delano.png'))
for (const size of [32, 180]) {
  await sharp(input('favicon-monograma-df.png')).resize(size, size).png().toFile(path.join(output, `favicon-${size}.png`))
}
await sharp(input('favicon-monograma-df.png')).resize(240, 240).png().toFile(path.join(output, 'monograma-df.png'))
await sharp(input('imagem-compartilhamento-delano-furtado.png')).resize(1200, 630, { fit: 'contain', background: '#ffffff' }).png().toFile(path.join(output, 'social-delano.png'))
await sharp(input('icone-google-maps.png')).resize(96, 96).png().toFile(path.join(output, 'google-maps.png'))
await sharp(input('estatua-justica-localizacao.jpg')).resize({ width: 512 }).webp({ quality: 84 }).toFile(path.join(output, 'justica.webp'))
const metadata = []
for (const filename of ['delano-480.webp','delano-800.webp','delano-1200.webp','logo-delano.png','monograma-df.png','social-delano.png','google-maps.png','justica.webp']) {
  const data = await readFile(path.join(output, filename))
  const image = await sharp(data).metadata()
  metadata.push({ file: filename, width: image.width, height: image.height, bytes: data.length })
}
await writeFile(path.join(output, 'manifest.json'), `${JSON.stringify(metadata, null, 2)}\n`)
console.log(`Prepared ${metadata.length + 2} optimized media files; ${manifest.assets.length} originals verified.`)
