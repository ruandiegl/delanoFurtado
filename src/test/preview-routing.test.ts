// @vitest-environment node
import { expect, it } from 'vitest'
import { resolvePreviewPage } from '@/routes/previewManifest'
it.each([
  ['/', 'index.html'], ['/localizacao', 'localizacao/index.html'], ['/localizacao/', 'localizacao/index.html'], ['/contate-nos', 'contate-nos/index.html'],
  ['/LOCALIZACAO', 'localizacao/index.html'], ['/CoNtAtE-NoS/', 'contate-nos/index.html'],
])('serves the actual prerendered document for %s', (path, file) => {
  expect(resolvePreviewPage(path)).toEqual({ file, status: 200 })
})
it('uses 404 for unknown paths and explicit redirects for document aliases', () => {
  expect(resolvePreviewPage('/ROTA-INEXISTENTE')).toEqual({ file: '404.html', status: 404 })
  expect(resolvePreviewPage('/inexistente.html')).toEqual({ file: '404.html', status: 404 })
  expect(resolvePreviewPage('/contate-nos/index.html')).toEqual({ redirect: '/contate-nos', status: 308 })
  expect(resolvePreviewPage('/index.html')).toEqual({ redirect: '/', status: 308 })
  expect(resolvePreviewPage('/CONTATE-NOS/INDEX.HTML')).toEqual({ redirect: '/contate-nos', status: 308 })
  expect(resolvePreviewPage('/assets/index.js')).toBeNull()
})
