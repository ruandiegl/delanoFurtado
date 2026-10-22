import type { RefObject } from 'react'
import { gsap, useGSAP } from '@/motion/gsap'
import { createPageMotion } from '@/motion/siteMotion'
export function usePageMotion(scope: RefObject<HTMLElement | null>, routeKey: string): void {
  useGSAP(() => {
    if (!scope.current) return
    const root = scope.current
    const mm = gsap.matchMedia()
    mm.add({ isDesktop: '(min-width: 64rem)', reduced: '(prefers-reduced-motion: reduce)', all: 'all' }, context => {
      if (context.conditions?.reduced) return
      return createPageMotion(root, { isDesktop: Boolean(context.conditions?.isDesktop) })
    })
    return () => mm.revert()
  }, { scope, dependencies: [routeKey], revertOnUpdate: true })
}
