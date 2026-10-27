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
for (const asset of [...manifest.assets, ...(manifest.provided_assets ?? []), ...(manifest.edited_assets ?? [])]) {
  const hash = createHash('sha256').update(await readFile(path.join(originals, asset.file))).digest('hex')
  if (hash !== asset.sha256) throw new Error(`Arquivo de mídia alterado: ${asset.file}`)
}
const input = (name) => path.join(originals, name)

const extraAssets = [
  { file: 'retrato-delano-furtado-sem-fundo.jpg', sha256: '82d2feb83e6d2447add2d9412e977d24ca039bfd64528baf5ee88e2d48c75292' },
  { file: 'fundo-escritorio-hero.jpg', sha256: '9b787103b43602d45e6860d3bedd9b71e4e82d556ee54217eeb217472a8a8601' },
]
for (const item of extraAssets) {
  const hash = createHash('sha256').update(await readFile(input(item.file))).digest('hex')
  if (hash !== item.sha256) throw new Error(`Ativo adicional alterado: ${item.file}`)
}

function blurFloat2D(src, width, height, sigma) {
  const radius = Math.ceil(sigma * 2.6)
  const kernel = new Float32Array(radius * 2 + 1)
  let sum = 0
  for (let k = -radius; k <= radius; k++) {
    const w = Math.exp(-(k * k) / (2 * sigma * sigma))
    kernel[k + radius] = w
    sum += w
  }
  for (let k = 0; k < kernel.length; k++) kernel[k] /= sum

  const tmp = new Float32Array(width * height)
  const dst = new Float32Array(width * height)
  for (let y = 0; y < height; y++) {
    const row = y * width
    for (let x = 0; x < width; x++) {
      let acc = 0
      for (let k = -radius; k <= radius; k++) {
        const nx = Math.min(width - 1, Math.max(0, x + k))
        acc += src[row + nx] * kernel[k + radius]
      }
      tmp[row + x] = acc
    }
  }
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let acc = 0
      for (let k = -radius; k <= radius; k++) {
        const ny = Math.min(height - 1, Math.max(0, y + k))
        acc += tmp[ny * width + x] * kernel[k + radius]
      }
      dst[y * width + x] = acc
    }
  }
  return dst
}

async function buildHeroCutoutRgba(cutoutPath, studioOriginalPath) {
  const cw = 686
  const ch = 1024
  const cut = await sharp(cutoutPath).raw().toBuffer()
  const orig1x = await sharp(studioOriginalPath)
    .rotate()
    .resize(687, 1030, { fit: 'fill' })
    .extract({ left: 0, top: 3, width: cw, height: ch })
    .raw()
    .toBuffer()

  const w2 = cw * 2
  const h2 = ch * 2
  const orig2xSharp = await sharp(studioOriginalPath)
    .rotate()
    .resize(687 * 2, 1030 * 2, { fit: 'fill', kernel: 'lanczos3' })
    .extract({ left: 0, top: 6, width: w2, height: h2 })
    .sharpen({ sigma: 0.85, m1: 0.6, m2: 1.4 })
    .raw()
    .toBuffer()

  // 1. Continuous sub-pixel alpha recovery by inverting C = alpha * O + (1 - alpha) * 255
  const rawAlpha1x = new Float32Array(cw * ch)
  const hardBg = new Uint8Array(cw * ch)
  for (let y = 0; y < ch; y++) {
    for (let x = 0; x < cw; x++) {
      const idx = y * cw + x
      const i = idx * 3
      const cr = cut[i], cg = cut[i + 1], cb = cut[i + 2]
      const or = orig1x[i], og = orig1x[i + 1], ob = orig1x[i + 2]
      const cLum = cr * 0.299 + cg * 0.587 + cb * 0.114
      const oLum = or * 0.299 + og * 0.587 + ob * 0.114

      const inShirtZone =
        ((y >= 412 && y <= 455 && x >= 248 && x <= 368) ||
          (y > 455 && y <= 785 && x >= 210 && x <= 368)) &&
        oLum > 170

      if (!inShirtZone && cr >= 242 && cg >= 242 && cb >= 242 && (cLum - oLum > 18 || y < 165 || y > 824 || x < 5 || x > 578)) {
        rawAlpha1x[idx] = 0
        hardBg[idx] = 1
        continue
      }
      const diff = Math.max(0, cLum - oLum - 3)
      const denom = Math.max(20, 255 - oLum)
      let a = 1 - (diff / denom)
      if (inShirtZone) a = 1
      a = Math.max(0, Math.min(1, (a - 0.14) / 0.80))
      rawAlpha1x[idx] = a
      if (a === 0 && !inShirtZone) hardBg[idx] = 1
    }
  }

  // 2. Flood-fill exterior background + arm-torso triangle
  const extBg = new Uint8Array(cw * ch)
  const q = new Int32Array(cw * ch)
  let head = 0
  let tail = 0
  const push = (idx) => {
    if (!extBg[idx] && hardBg[idx]) {
      extBg[idx] = 1
      q[tail++] = idx
    }
  }
  for (let x = 0; x < cw; x++) {
    push(x)
    push((ch - 1) * cw + x)
  }
  for (let y = 0; y < ch; y++) {
    push(y * cw)
    push(y * cw + (cw - 1))
  }
  for (let y = 625; y <= 665; y++) {
    for (let x = 125; x <= 140; x++) push(y * cw + x)
  }
  while (head < tail) {
    const cur = q[head++]
    const cx = cur % cw
    const cy = (cur - cx) / cw
    for (let dy = -1; dy <= 1; dy++) {
      const ny = cy + dy
      if (ny < 0 || ny >= ch) continue
      for (let dx = -1; dx <= 1; dx++) {
        const nx = cx + dx
        if (nx >= 0 && nx < cw) push(ny * cw + nx)
      }
    }
  }

  const distBg = new Int16Array(cw * ch).fill(999)
  head = 0
  tail = 0
  for (let i = 0; i < cw * ch; i++) {
    if (extBg[i]) {
      distBg[i] = 0
      q[tail++] = i
    }
  }
  while (head < tail) {
    const cur = q[head++]
    const d = distBg[cur]
    if (d >= 14) continue
    const cx = cur % cw
    const cy = (cur - cx) / cw
    for (let dy = -1; dy <= 1; dy++) {
      const ny = cy + dy
      if (ny < 0 || ny >= ch) continue
      for (let dx = -1; dx <= 1; dx++) {
        const nx = cx + dx
        if (nx < 0 || nx >= cw) continue
        const ni = ny * cw + nx
        if (distBg[ni] > d + 1) {
          distBg[ni] = d + 1
          q[tail++] = ni
        }
      }
    }
  }

  const alpha1x = new Float32Array(cw * ch)
  for (let y = 0; y < ch; y++) {
    const maxFeatherDist = y < 230 ? 9 : 5
    for (let x = 0; x < cw; x++) {
      const i = y * cw + x
      let a = rawAlpha1x[i]
      if (extBg[i]) {
        a = 0
      } else if (distBg[i] > maxFeatherDist) {
        a = 1
      } else {
        if (y < 245 && distBg[i] <= 11) {
          const or = orig1x[i * 3], og = orig1x[i * 3 + 1], ob = orig1x[i * 3 + 2]
          const oLum = or * 0.299 + og * 0.587 + ob * 0.114
          const chroma = or - ob
          if (chroma < 18 && oLum > 78) {
            const wallFade = Math.max(0, Math.min(1, (118 - oLum) / (118 - 78)))
            a *= wallFade * wallFade
          }
        } else if (distBg[i] >= 3 && a > 0.45) {
          a = Math.max(a, 0.96)
        }
      }
      alpha1x[i] = a
    }
  }

  // 3. Sub-pixel 2x contour anti-aliasing without wide halo
  const alpha1xPreSmooth = blurFloat2D(alpha1x, cw, ch, 0.85)
  for (let y = 0; y < ch; y++) {
    const maxD = y < 245 ? 9 : 4
    for (let x = 0; x < cw; x++) {
      const i = y * cw + x
      if (distBg[i] > maxD) alpha1xPreSmooth[i] = 1
    }
  }

  const alpha2xBase = new Float32Array(w2 * h2)
  const distBg2x = new Float32Array(w2 * h2)
  for (let y = 0; y < h2; y++) {
    const fy = Math.max(0, Math.min(ch - 1.001, (y - 0.5) * 0.5))
    const y0 = Math.floor(fy)
    const y1 = Math.min(ch - 1, y0 + 1)
    const wy = fy - y0
    for (let x = 0; x < w2; x++) {
      const fx = Math.max(0, Math.min(cw - 1.001, (x - 0.5) * 0.5))
      const x0 = Math.floor(fx)
      const x1 = Math.min(cw - 1, x0 + 1)
      const wx = fx - x0
      const i00 = y0 * cw + x0, i10 = y0 * cw + x1, i01 = y1 * cw + x0, i11 = y1 * cw + x1
      alpha2xBase[y * w2 + x] =
        (alpha1xPreSmooth[i00] * (1 - wx) + alpha1xPreSmooth[i10] * wx) * (1 - wy) +
        (alpha1xPreSmooth[i01] * (1 - wx) + alpha1xPreSmooth[i11] * wx) * wy
      distBg2x[y * w2 + x] =
        (distBg[i00] * (1 - wx) + distBg[i10] * wx) * (1 - wy) +
        (distBg[i01] * (1 - wx) + distBg[i11] * wx) * wy
    }
  }

  const alpha2xFine = blurFloat2D(alpha2xBase, w2, h2, 1.5)
  const alpha2xSmooth = blurFloat2D(alpha2xBase, w2, h2, 2.2)

  const cropTop2 = 160 * 2
  const cropW2 = 584 * 2
  const cropH2 = 664 * 2
  const alphaFinal = new Float32Array(cropW2 * cropH2)
  for (let y = 0; y < cropH2; y++) {
    const sy = y + cropTop2
    const y1x = sy * 0.5
    const bodyWeight = Math.max(0, Math.min(1, (y1x - 262) / (290 - 262)))
    for (let x = 0; x < cropW2; x++) {
      const idx2 = sy * w2 + x
      const mFine = alpha2xFine[idx2]
      const mSmooth = alpha2xSmooth[idx2]
      const m = mFine * (1 - bodyWeight) + mSmooth * bodyWeight
      const low = 0.38 + 0.06 * bodyWeight
      const high = 0.86
      let t = Math.max(0, Math.min(1, (m - low) / (high - low)))
      t = t * t * (3 - 2 * t)

      const dBg = distBg2x[idx2]
      if (y1x < 265 && dBg <= 10 && t > 0) {
        const srcIdx = idx2 * 3
        const r = orig2xSharp[srcIdx], g = orig2xSharp[srcIdx + 1], b = orig2xSharp[srcIdx + 2]
        const warmChromaWeight = Math.max(0, Math.min(1, ((r - b) - 14) / 10))
        const lum = r * 0.299 + g * 0.587 + b * 0.114
        const strandAlpha = Math.max(0, Math.min(1, (125 - lum) / (125 - 68)))
        const edgeZone = (1 - warmChromaWeight) * Math.max(0, Math.min(1, (10 - dBg) / 4.5))
        t *= (1 - edgeZone) + edgeZone * strandAlpha
      }

      // Smooth alpha-only feather on the abrupt bottom-left sleeve cut and bottom arm edge
      const x1x = x * 0.5
      const leftSleeveWeight = Math.max(0, Math.min(1, (114 - x1x) / 22))
      const leftSleeveSmooth = leftSleeveWeight * leftSleeveWeight * (3 - 2 * leftSleeveWeight)
      const fadeStart = 776 - leftSleeveSmooth * 58 // 718 on left sleeve, 776 on hand/right arm
      const fadeEnd = 820 - leftSleeveSmooth * 46   // 774 on left sleeve, 820 on hand/right arm
      if (y1x > fadeStart) {
        const bFade = Math.max(0, Math.min(1, (fadeEnd - y1x) / (fadeEnd - fadeStart)))
        t *= bFade * bFade * (3 - 2 * bFade)
      }

      alphaFinal[y * cropW2 + x] = t
    }
  }

  // 4. Natural 2x RGB from high-resolution original (zero artificial contrast or darkening)
  const rgb2 = new Float32Array(cropW2 * cropH2 * 3)
  for (let y = 0; y < cropH2; y++) {
    const sy = y + cropTop2
    for (let x = 0; x < cropW2; x++) {
      const srcIdx = (sy * w2 + x) * 3
      const dstIdx = (y * cropW2 + x) * 3
      rgb2[dstIdx] = orig2xSharp[srcIdx]
      rgb2[dstIdx + 1] = orig2xSharp[srcIdx + 1]
      rgb2[dstIdx + 2] = orig2xSharp[srcIdx + 2]
    }
  }

  // 5. Sub-pixel edge decontamination (6 passes, only on the 1-2px anti-aliased edge)
  const seed = new Uint8Array(cropW2 * cropH2)
  for (let y = 0; y < cropH2; y++) {
    const sy = y + cropTop2
    for (let x = 0; x < cropW2; x++) {
      const idx = y * cropW2 + x
      const idx2 = sy * w2 + x
      const a = alphaFinal[idx]
      const d = distBg2x[idx2]
      if (a >= 0.92 && d >= 2.0) {
        seed[idx] = 1
      }
    }
  }

  for (let iter = 0; iter < 6; iter++) {
    const nextSeed = new Uint8Array(seed)
    for (let y = 1; y < cropH2 - 1; y++) {
      for (let x = 1; x < cropW2 - 1; x++) {
        const idx = y * cropW2 + x
        if (seed[idx] || alphaFinal[idx] <= 0.001) continue
        let sumR = 0, sumG = 0, sumB = 0, count = 0
        const nbs = [idx - 1, idx + 1, idx - cropW2, idx + cropW2, idx - cropW2 - 1, idx - cropW2 + 1, idx + cropW2 - 1, idx + cropW2 + 1]
        for (let k = 0; k < 8; k++) {
          const ni = nbs[k]
          if (seed[ni]) {
            sumR += rgb2[ni * 3]
            sumG += rgb2[ni * 3 + 1]
            sumB += rgb2[ni * 3 + 2]
            count++
          }
        }
        if (count > 0) {
          const refR = sumR / count, refG = sumG / count, refB = sumB / count
          const refLum = refR * 0.299 + refG * 0.587 + refB * 0.114
          const curLum = rgb2[idx * 3] * 0.299 + rgb2[idx * 3 + 1] * 0.587 + rgb2[idx * 3 + 2] * 0.114
          if (curLum > refLum) {
            rgb2[idx * 3] = refR
            rgb2[idx * 3 + 1] = refG
            rgb2[idx * 3 + 2] = refB
          }
          nextSeed[idx] = 1
        }
      }
    }
    seed.set(nextSeed)
  }

  const rgba = Buffer.alloc(cropW2 * cropH2 * 4)
  for (let y = 0; y < cropH2; y++) {
    for (let x = 0; x < cropW2; x++) {
      const idx = y * cropW2 + x
      const a = alphaFinal[idx]
      const dst = idx * 4
      if (a <= 0.01) {
        rgba[dst] = 0
        rgba[dst + 1] = 0
        rgba[dst + 2] = 0
        rgba[dst + 3] = 0
        continue
      }
      const r = rgb2[idx * 3]
      const g = rgb2[idx * 3 + 1]
      const b = rgb2[idx * 3 + 2]

      rgba[dst] = Math.round(Math.max(0, Math.min(255, r)))
      rgba[dst + 1] = Math.round(Math.max(0, Math.min(255, g)))
      rgba[dst + 2] = Math.round(Math.max(0, Math.min(255, b)))
      rgba[dst + 3] = Math.round(a * 255)
    }
  }
  return { rgba, width: cropW2, height: cropH2 }
}

const cutout = await buildHeroCutoutRgba(
  input('retrato-delano-furtado-sem-fundo.jpg'),
  input('retrato-delano-furtado-original.jpg'),
)
for (const width of [480, 686, 1024]) {
  const { data: resized, info: rInfo } = await sharp(cutout.rgba, {
    raw: { width: cutout.width, height: cutout.height, channels: 4 },
  })
    .resize({ width, kernel: 'lanczos3' })
    .raw()
    .toBuffer({ resolveWithObject: true })

  for (let i = 0; i < resized.length; i += 4) {
    if (resized[i + 3] < 4) {
      resized[i] = 0
      resized[i + 1] = 0
      resized[i + 2] = 0
      resized[i + 3] = 0
    }
  }

  await sharp(resized, { raw: { width: rInfo.width, height: rInfo.height, channels: 4 } })
    .webp({ quality: 94, alphaQuality: 100, smartSubsample: true })
    .toFile(path.join(output, `delano-hero-${width}.webp`))
}

await sharp(input('fundo-escritorio-hero.jpg'))
  .resize({ width: 1440 })
  .webp({ quality: 84 })
  .toFile(path.join(output, 'hero-office-bg.webp'))

for (const width of [480, 800, 1200]) {
  await sharp(input('retrato-delano-furtado-original.jpg')).rotate().resize({ width }).webp({ quality: 84 }).toFile(path.join(output, `delano-${width}.webp`))
  await sharp(input('retrato-delano-furtado-sobre-2026-10-27.jpg')).rotate().resize({ width }).webp({ quality: 84 }).toFile(path.join(output, `delano-sobre-${width}.webp`))
}
for (const width of [480, 800, 1023]) {
  await sharp(input('retrato-delano-furtado-sobre-sem-fundo-v1.png'))
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 90, alphaQuality: 100, smartSubsample: true })
    .toFile(path.join(output, `delano-sobre-recorte-${width}.webp`))
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
for (const filename of ['delano-hero-480.webp','delano-hero-686.webp','delano-hero-1024.webp','hero-office-bg.webp','delano-480.webp','delano-800.webp','delano-1200.webp','delano-sobre-480.webp','delano-sobre-800.webp','delano-sobre-1200.webp','delano-sobre-recorte-480.webp','delano-sobre-recorte-800.webp','delano-sobre-recorte-1023.webp','logo-delano.png','monograma-df.png','social-delano.png','google-maps.png','justica.webp']) {
  const data = await readFile(path.join(output, filename))
  const image = await sharp(data).metadata()
  metadata.push({ file: filename, width: image.width, height: image.height, bytes: data.length })
}
await writeFile(path.join(output, 'manifest.json'), `${JSON.stringify(metadata, null, 2)}\n`)
console.log(`Prepared ${metadata.length + 2} optimized media files; ${manifest.assets.length} collected originals + ${manifest.provided_assets?.length ?? 0} provided originals + ${manifest.edited_assets?.length ?? 0} edited assets + ${extraAssets.length} hero assets verified.`)
