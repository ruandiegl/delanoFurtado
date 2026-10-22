import type { RefObject } from 'react'
import { gsap, useGSAP } from '@/motion/gsap'

export function useDisclosureMotion(scope: RefObject<HTMLDetailsElement | null>) {
  useGSAP(() => {
    const details = scope.current
    const summary = details?.querySelector('summary')
    const panel = details?.querySelector<HTMLElement>('.disclosure-content')
    if (!details || !summary || !panel) return
    const items = Array.from(panel.querySelectorAll<HTMLElement>('li, p'))
    const mm = gsap.matchMedia()
    let desiredOpen = details.open
    const clearStyles = () => {
      panel.style.removeProperty('height')
      panel.style.removeProperty('overflow')
      items.forEach(item => { item.style.removeProperty('transform'); item.style.removeProperty('opacity') })
    }
    const notifyLayout = () => details.dispatchEvent(new Event('disclosure-settled', { bubbles: true }))

    mm.add({ reduced: '(prefers-reduced-motion: reduce)', all: 'all' }, context => {
      desiredOpen = details.open
      if (context.conditions?.reduced) return
      let active = true
      let animation: gsap.core.Timeline | undefined
      const settle = () => {
        animation?.kill()
        animation = undefined
        details.open = desiredOpen
        clearStyles()
        if (active) notifyLayout()
      }
      const animate = context.add('animateDisclosure', (open: boolean) => {
        const currentHeight = details.open ? panel.getBoundingClientRect().height : 0
        animation?.kill()
        desiredOpen = open
        details.open = true
        clearStyles()
        // One natural-height measurement per interaction; no layout reads per frame.
        const expandedHeight = panel.getBoundingClientRect().height
        panel.style.overflow = 'hidden'
        animation = gsap.timeline({ onComplete: settle })
          .fromTo(panel, { height: currentHeight }, { height: open ? expandedHeight : 0, duration: open ? .42 : .26, ease: 'power2.inOut' }, 0)
        if (open) animation.fromTo(items, { y: 8, opacity: .45 }, {
          y: 0, opacity: 1, duration: .32, ease: 'power2.out',
          stagger: { amount: Math.min(.28, Math.max(0, items.length - 1) * .035) },
        }, .045)
      })
      const onClick = (event: MouseEvent) => {
        if (event.defaultPrevented || event.button !== 0) return
        event.preventDefault()
        animate(!desiredOpen)
      }
      const onResize = () => { if (animation) settle() }
      const onFocus = () => { if (animation) settle() }
      summary.addEventListener('click', onClick)
      panel.addEventListener('focusin', onFocus)
      window.addEventListener('resize', onResize)
      return () => {
        active = false
        summary.removeEventListener('click', onClick)
        panel.removeEventListener('focusin', onFocus)
        window.removeEventListener('resize', onResize)
        settle()
      }
    })
    return () => mm.revert()
  }, { scope })
}
