import { fileURLToPath, URL } from 'node:url'
import { readFile } from 'node:fs/promises'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import babel from '@rolldown/plugin-babel'
import { resolvePreviewPage } from './src/routes/previewManifest.ts'

export default defineConfig({
  plugins: [
    react(), tailwindcss(),
    babel({ plugins: [['babel-plugin-styled-components', { ssr: true, displayName: true, pure: true }]] }),
    {
      name: 'local-preview-documents',
      configurePreviewServer(server) {
        server.middlewares.use((request, response, next) => {
          if (request.method !== 'GET' && request.method !== 'HEAD') return next()
          const page = resolvePreviewPage(new URL(request.url ?? '/', 'http://localhost').pathname)
          if (!page) return next()
          if ('redirect' in page) {
            response.statusCode = page.status
            response.setHeader('Location', page.redirect)
            response.end()
            return
          }
          void readFile(fileURLToPath(new URL(`./dist/${page.file}`, import.meta.url))).then(html => {
            response.statusCode = page.status
            response.setHeader('Content-Type', 'text/html; charset=utf-8')
            response.end(request.method === 'HEAD' ? '' : html)
          }).catch(next)
        })
      },
    },
  ],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  ssr: { noExternal: ['styled-components', 'gsap', '@gsap/react'] },
  build: { rolldownOptions: { output: { codeSplitting: { groups: [{ name: 'motion', test: /node_modules[\\/]gsap[\\/]/ }] } } } },
  test: {
    environment: 'jsdom', setupFiles: ['./src/test/setup.ts'], css: true,
    exclude: ['node_modules/**', 'dist/**', '.prerender/**'],
  },
})
