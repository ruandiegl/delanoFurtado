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

  const orig2xSmooth = await sharp(orig2xSharp, { raw: { width: w2, height: h2, channels: 3 } })
    .blur(2.6)
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
        if (y < 235 && distBg[i] <= 9) {
          const or = orig1x[i * 3], og = orig1x[i * 3 + 1], ob = orig1x[i * 3 + 2]
          const oLum = or * 0.299 + og * 0.587 + ob * 0.114
          const chroma = or - ob
          if (chroma < 16 && oLum > 85) {
            const wallFade = Math.max(0, Math.min(1, (152 - oLum) / (152 - 85)))
            a *= wallFade
          }
        } else if (distBg[i] >= 4 && a > 0.45) {
          a = Math.max(a, 0.95)
        }
      }
      alpha1x[i] = a
    }
  }

  // 3. Multi-scale 2x contour smoothing & anti-aliasing
  const alpha1xPreSmooth = blurFloat2D(alpha1x, cw, ch, 1.15)
  for (let y = 0; y < ch; y++) {
    const maxD = y < 230 ? 9 : 6
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

  const alpha2xFine = blurFloat2D(alpha2xBase, w2, h2, 2.0)
  const alpha2xSmooth = blurFloat2D(alpha2xBase, w2, h2, 4.5)

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
      const low = 0.30 + 0.05 * bodyWeight
      const high = 0.88
      let t = Math.max(0, Math.min(1, (m - low) / (high - low)))
      t = t * t * (3 - 2 * t)

      const dBg = distBg2x[idx2]
      if (y1x < 265 && dBg <= 9 && t > 0) {
        const srcIdx = idx2 * 3
        const r = orig2xSharp[srcIdx], g = orig2xSharp[srcIdx + 1], b = orig2xSharp[srcIdx + 2]
        const warmChromaWeight = Math.max(0, Math.min(1, ((r - b) - 13) / 10))
        const lum = r * 0.299 + g * 0.587 + b * 0.114
        const strandAlpha = Math.max(0, Math.min(1, (158 - lum) / (158 - 75)))
        const edgeZone = (1 - warmChromaWeight) * Math.max(0, Math.min(1, (9 - dBg) / 4.5))
        t *= (1 - edgeZone) + edgeZone * strandAlpha
      }

      const x1x = x * 0.5
      const sleeveMask = Math.max(0, Math.min(1, (95 - x1x) / 10))
      if (sleeveMask > 0 && y1x > 705) {
        const sFade = Math.max(0, Math.min(1, (755 - y1x) / (755 - 705)))
        const sSmooth = sFade * sFade * (3 - 2 * sFade)
        t *= (1 - sleeveMask) + sleeveMask * sSmooth
      }
      if (y1x > 790) {
        const botFade = Math.max(0, Math.min(1, (822 - y1x) / (822 - 790)))
        t *= botFade * botFade * (3 - 2 * botFade)
      }
      alphaFinal[y * cropW2 + x] = t
    }
  }

  // 4. Studio retouching on 2x RGB (bilateral skin refinement, soft highlight roll-off, eye clarity, suit depth)
  const rgb2 = new Float32Array(cropW2 * cropH2 * 3)
  for (let y = 0; y < cropH2; y++) {
    const sy = y + cropTop2
    const y1x = sy * 0.5
    for (let x = 0; x < cropW2; x++) {
      const x1x = x * 0.5
      const srcIdx = (sy * w2 + x) * 3
      const dstIdx = (y * cropW2 + x) * 3
      let r = orig2xSharp[srcIdx]
      let g = orig2xSharp[srcIdx + 1]
      let b = orig2xSharp[srcIdx + 2]

      const fdx = (x1x - 306) / 82
      const fdy = (y1x - 298) / 105
      const faceDist2 = fdx * fdx + fdy * fdy
      const faceWeight = Math.max(0, Math.min(1, 1 - faceDist2))

      const e1 = Math.pow((x1x - 278) / 24, 2) + Math.pow((y1x - 280) / 13, 2)
      const e2 = Math.pow((x1x - 334) / 24, 2) + Math.pow((y1x - 282) / 13, 2)
      const eyeWeight = Math.max(
        Math.max(0, Math.min(1, 1 - e1)),
        Math.max(0, Math.min(1, 1 - e2))
      )

      const lipDist2 = Math.pow((x1x - 305) / 32, 2) + Math.pow((y1x - 346) / 14, 2)
      const lipWeight = Math.max(0, Math.min(1, 1 - lipDist2))

      const skinMask = faceWeight * (1 - eyeWeight) * (1 - lipWeight)
      if (skinMask > 0.01 && r > g && g > b && (r - b) > 16) {
        const sr = orig2xSmooth[srcIdx]
        const sg = orig2xSmooth[srcIdx + 1]
        const sb = orig2xSmooth[srcIdx + 2]
        const diff = Math.abs(r - sr) + Math.abs(g - sg) + Math.abs(b - sb)
        const wSmooth = skinMask * Math.max(0, Math.min(0.38, (1 - diff / 44) * 0.38))
        r = r * (1 - wSmooth) + sr * wSmooth
        g = g * (1 - wSmooth) + sg * wSmooth
        b = b * (1 - wSmooth) + sb * wSmooth
      }

      if (faceWeight > 0.01 && r > 206) {
        const excess = (r - 206) * faceWeight
        r -= excess * 0.30
        g = Math.min(g, r * 0.87 + 12)
        b = Math.min(b, r * 0.77 + 14)
      }

      if (eyeWeight > 0.01) {
        const lum = r * 0.299 + g * 0.587 + b * 0.114
        const delta = (lum - 95) * 0.08 * eyeWeight
        r = Math.max(0, Math.min(255, r + delta))
        g = Math.max(0, Math.min(255, g + delta))
        b = Math.max(0, Math.min(255, b + delta))
      }

      const suitRamp = Math.max(0, Math.min(1, (y1x - 370) / 40))
      const lum = r * 0.299 + g * 0.587 + b * 0.114
      if (suitRamp > 0 && lum < 145) {
        const t = lum / 145
        const factor = 1 - suitRamp * (1 - (0.88 + 0.12 * (t * t)))
        r *= factor
        g *= factor * 0.99
        b *= factor * 0.98
      }

      rgb2[dstIdx] = r
      rgb2[dstIdx + 1] = g
      rgb2[dstIdx + 2] = b
    }
  }

  // 5. Iterative inward-to-outward color propagation (24 passes) for zero edge halo
  const seed = new Uint8Array(cropW2 * cropH2)
  for (let y = 0; y < cropH2; y++) {
    const sy = y + cropTop2
    const y1x = sy * 0.5
    for (let x = 0; x < cropW2; x++) {
      const idx = y * cropW2 + x
      const idx2 = sy * w2 + x
      const a = alphaFinal[idx]
      const d = distBg2x[idx2]
      if (a >= 0.96 && d >= 4.2) {
        const r = rgb2[idx * 3], g = rgb2[idx * 3 + 1], b = rgb2[idx * 3 + 2]
        const lum = r * 0.299 + g * 0.587 + b * 0.114
        const isWarmSkin = r > 170 && (r - b) > 30
        if (y1x < 290 && d < 11 && !isWarmSkin && lum > 62) continue
        seed[idx] = 1
      }
    }
  }

  for (let iter = 0; iter < 24; iter++) {
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
    const sy = y + cropTop2
    const y1x = sy * 0.5
    for (let x = 0; x < cropW2; x++) {
      const idx = y * cropW2 + x
      const a = alphaFinal[idx]
      const dst = idx * 4
      if (a <= 0.002) {
        rgba[dst] = 0
        rgba[dst + 1] = 0
        rgba[dst + 2] = 0
        rgba[dst + 3] = 0
        continue
      }
      let r = rgb2[idx * 3]
      let g = rgb2[idx * 3 + 1]
      let b = rgb2[idx * 3 + 2]

      if (a < 0.96) {
        const edgeShade = 0.50 + 0.50 * Math.pow(a, 0.50)
        r *= edgeShade
        g *= edgeShade
        b *= edgeShade
      }

      const x1x = x * 0.5
      const sleeveMask = Math.max(0, Math.min(1, (95 - x1x) / 12))
      if (sleeveMask > 0 && y1x > 690) {
        const sDark = Math.max(0, Math.min(1, (y1x - 690) / (755 - 690)))
        const shade = 1 - sleeveMask * sDark * 0.65
        r *= shade
        g *= shade
        b *= shade
      }
      if (y1x > 740) {
        const darkT = Math.max(0, Math.min(1, (y1x - 740) / (822 - 740)))
        const shade = 1 - darkT * 0.50
        r *= shade
        g *= shade
        b *= shade
      }

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
  await sharp(cutout.rgba, { raw: { width: cutout.width, height: cutout.height, channels: 4 } })
    .resize({ width, kernel: 'lanczos3' })
    .webp({ quality: 92, alphaQuality: 98, smartSubsample: true })
    .toFile(path.join(output, `delano-hero-${width}.webp`))
}

await sharp(input('fundo-escritorio-hero.jpg'))
  .resize({ width: 1440 })
  .webp({ quality: 84 })
  .toFile(path.join(output, 'hero-office-bg.webp'))

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
for (const filename of ['delano-hero-480.webp','delano-hero-686.webp','delano-hero-1024.webp','hero-office-bg.webp','delano-480.webp','delano-800.webp','delano-1200.webp','logo-delano.png','monograma-df.png','social-delano.png','google-maps.png','justica.webp']) {
  const data = await readFile(path.join(output, filename))
  const image = await sharp(data).metadata()
  metadata.push({ file: filename, width: image.width, height: image.height, bytes: data.length })
}
await writeFile(path.join(output, 'manifest.json'), `${JSON.stringify(metadata, null, 2)}\n`)
console.log(`Prepared ${metadata.length + 2} optimized media files; ${manifest.assets.length} originals + ${extraAssets.length} hero assets verified.`)
