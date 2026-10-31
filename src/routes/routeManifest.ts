export const publicRoutes = ['/', '/localizacao', '/contate-nos', '/politica-de-privacidade', '/politica-de-cookies'] as const
export type PublicRoute = typeof publicRoutes[number]
export function resolvePublicRoute(pathname: string): PublicRoute | null {
  // Netlify also serves static HTML for letter-case and index.html aliases.
  const normalized = pathname.toLowerCase().replace(/\/index\.html$/, '/')
  const path = normalized.length > 1 ? normalized.replace(/\/+$/, '') : normalized
  return publicRoutes.find((route) => route === path) ?? null
}
