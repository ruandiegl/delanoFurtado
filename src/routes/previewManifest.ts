import { publicRoutes, resolvePublicRoute } from './routeManifest.ts'
export type PreviewPage = { file: string; status: number } | { redirect: string; status: number }
export function resolvePreviewPage(pathname: string): PreviewPage | null {
  if (/^\/(assets|media)\//.test(pathname) || ['/robots.txt', '/sitemap.xml'].includes(pathname)) return null
  const alias = publicRoutes.find(route => pathname === (route === '/' ? '/index.html' : `${route}/index.html`))
  if (alias) return { redirect: alias, status: 308 }
  const route = resolvePublicRoute(pathname)
  if (route) return { file: route === '/' ? 'index.html' : `${route.slice(1)}/index.html`, status: 200 }
  return { file: '404.html', status: 404 }
}
