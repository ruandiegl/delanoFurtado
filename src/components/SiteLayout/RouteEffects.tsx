import { useEffect, useLayoutEffect, useRef } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'

export function RouteEffects() {
  const { pathname, hash, key } = useLocation()
  const navigationType = useNavigationType()
  const previousEntry = useRef(key)
  const activeEntry = useRef(key)
  const positions = useRef(new Map<string, { top: number; left: number }>())
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
    const positionMap = positions.current
    let frame = 0
    const changed = previousEntry.current !== key
    previousEntry.current = key
    activeEntry.current = key
    const saved = positionMap.get(key)
    if (changed && navigationType === 'POP' && saved) {
      window.scrollTo({ ...saved, behavior: 'instant' })
    } else if (hash) {
      frame = requestAnimationFrame(() => {
        document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
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
  }, [pathname, hash, key, navigationType])
  return null
}
