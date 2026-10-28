import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { fileURLToPath, pathToFileURL } from 'node:url'
import path from 'node:path'
import sharp from 'sharp'

const root = fileURLToPath(new URL('../', import.meta.url))

export async function prepareFavicons() {
  const original = await readFile(path.join(root, 'docs/assets/delano-furtado/favicon-monograma-df.png'))
  const expected = 'd3b2ac038576df79f6cb8b6fb94dd4c0e1c11cf147c249e4792b7c5e778f9cf8'
  if (createHash('sha256').update(original).digest('hex') !== expected) throw new Error('Monograma original alterado')
  const media = path.join(root, 'public/media')
  await mkdir(media, { recursive: true })
  const images = new Map()
  for (const size of [16, 32, 48, 96, 180, 256]) {
    // Preserve the supplied mark; an opaque white canvas keeps the black D
    // visible in both light and dark browser/search interfaces.
    images.set(size, await sharp(original).resize(size, size).flatten({ background: '#ffffff' }).removeAlpha().png({ compressionLevel: 9 }).toBuffer())
  }
  for (const size of [32, 96, 180]) await writeFile(path.join(media, `favicon-${size}.png`), images.get(size))
  const inventoryPath = path.join(media, 'manifest.json')
  try {
    const inventory = JSON.parse(await readFile(inventoryPath, 'utf8'))
    const filenames = new Set([32, 96, 180].map(size => `favicon-${size}.png`))
    const updated = inventory.filter(item => !filenames.has(item.file))
    for (const size of [32, 96, 180]) updated.push({ file: `favicon-${size}.png`, width: size, height: size, bytes: images.get(size).length })
    await writeFile(inventoryPath, `${JSON.stringify(updated, null, 2)}\n`)
  } catch (error) { if (error.code !== 'ENOENT') throw error }

  // Standard ICO container with PNG-compressed entries (16/32/48/256 px).
  const sizes = [16, 32, 48, 256]
  const header = Buffer.alloc(6 + sizes.length * 16)
  header.writeUInt16LE(1, 2)
  header.writeUInt16LE(sizes.length, 4)
  let offset = header.length
  for (const [index, size] of sizes.entries()) {
    const entry = 6 + index * 16
    header[entry] = size === 256 ? 0 : size
    header[entry + 1] = size === 256 ? 0 : size
    header.writeUInt16LE(1, entry + 4)
    header.writeUInt16LE(32, entry + 6)
    header.writeUInt32LE(images.get(size).length, entry + 8)
    header.writeUInt32LE(offset, entry + 12)
    offset += images.get(size).length
  }
  await writeFile(path.join(root, 'public/favicon.ico'), Buffer.concat([header, ...sizes.map(size => images.get(size))]))
}

if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) {
  await prepareFavicons()
  console.log('Favicons DF preparados: PNG 32/96/180 e ICO 16/32/48/256, com fundo branco.')
}
