import { useEffect, useLayoutEffect, useRef } from 'react'
import { useLocation, useNavigate, useNavigationType } from 'react-router-dom'
import { resolvePublicRoute } from '@/routes/routeManifest'
import { readSectionNavigation, resolveSectionTarget } from '@/routes/sectionNavigation'
import { scrollToSection } from '@/lib/scrollToSection'

export function RouteEffects() {
  const { pathname, search, hash, key, state } = useLocation()
  const navigate = useNavigate()
  const section = readSectionNavigation(state)
  const navigationType = useNavigationType()
  const previousEntry = useRef(key)
  const activeEntry = useRef(key)
  const positions = useRef(new Map<string, { top: number; left: number }>())
  useEffect(() => {
    if (!hash) return
    const scrollTarget = resolveSectionTarget(hash.slice(1))
    navigate({ pathname, search }, { replace: true, state: scrollTarget ? { scrollTarget } : state })
  }, [pathname, search, hash, state, navigate])
  useEffect(() => {
    const originalRestoration = window.history.scrollRestoration
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual'
    const save = () => positions.current.set(activeEntry.current, { top: window.scrollY, left: window.scrollX })
    save()
    window.addEventListener('scroll', save, { passive: true })
    return () => {
      window.removeEventListener('scroll', save)
      if ('scrollRestoration' in window.history) window.history.scrollRestoration = originalRestoration
    }
  }, [])
  useLayoutEffect(() => {
    if (hash) return
    const positionMap = positions.current
    let frame = 0
    const changed = previousEntry.current !== key
    previousEntry.current = key
    activeEntry.current = key
    const saved = positionMap.get(key)
    if (changed && navigationType === 'POP' && saved) {
      window.scrollTo({ ...saved, behavior: 'instant' })
    } else if (section) {
      frame = requestAnimationFrame(() => {
        // Let the new page finish its layout/ScrollTrigger refresh before scrolling.
        frame = requestAnimationFrame(() => {
          if (section !== 'main-content' && resolvePublicRoute(pathname) !== '/') return
          scrollToSection(section)
        })
      })
    } else if (changed && navigationType !== 'POP') {
      window.scrollTo({ top: 0, behavior: 'instant' })
      frame = requestAnimationFrame(() => document.querySelector<HTMLElement>('main h1')?.focus({ preventScroll: true }))
    }
    return () => {
      // Capture synchronously before the next route's shorter DOM can clamp scroll.
      positionMap.set(key, { top: window.scrollY, left: window.scrollX })
      cancelAnimationFrame(frame)
    }
  }, [pathname, hash, key, section, navigationType])
  return null
}
