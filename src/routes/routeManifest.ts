export const publicRoutes = ['/', '/localizacao', '/contate-nos'] as const
export type PublicRoute = typeof publicRoutes[number]
export function resolvePublicRoute(pathname: string): PublicRoute | null {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname
  return publicRoutes.find((route) => route === path) ?? null
}
