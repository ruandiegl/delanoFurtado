import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { getSeo, renderSeoHead } from '@/content/seo'
export function RouteSeo() {
  const { pathname } = useLocation()
  useEffect(() => {
    const seo = getSeo(pathname)
    // Trusted, locally authored metadata only; renderSeoHead escapes every value.
    document.head.querySelectorAll('[data-site-seo]').forEach(node => node.remove())
    const template = document.createElement('template')
    template.innerHTML = renderSeoHead(seo)
    document.head.append(template.content)
  }, [pathname])
  return null
}
