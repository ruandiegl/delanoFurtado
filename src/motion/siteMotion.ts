import { gsap, ScrollTrigger } from './gsap'

export function createPageMotion(root: HTMLElement, { isDesktop }: { isDesktop: boolean }): () => void {
  let active = true
  let refreshFrame = 0
  const targets = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]'))
  const tweens = new Map<HTMLElement, gsap.core.Tween>()
  targets.forEach((target, index) => {
    const kind = target.dataset.reveal
    const hero = kind === 'hero'
    const y = kind === 'section' ? (isDesktop ? 16 : 8) : kind === 'contact' ? 10 : 12
    const tween = gsap.fromTo(target,
      { y, ...(kind === 'text' ? { opacity: .65 } : {}) },
      { y: 0, ...(kind === 'text' ? { opacity: 1 } : {}), duration: hero ? .5 : .4, ease: 'power2.out',
        delay: kind === 'card' ? (index % 3) * (isDesktop ? .05 : .03) : 0,
        ...(hero ? {} : { scrollTrigger: { trigger: target, start: kind === 'contact' ? 'top 90%' : 'top 88%', once: true } }),
      })
    tweens.set(target, tween)
  })
  const scheduleRefresh = () => {
    if (!active || refreshFrame) return
    refreshFrame = window.requestAnimationFrame(() => {
      refreshFrame = 0
      if (active) ScrollTrigger.refresh()
    })
  }
  // These callbacks update existing tweens only; they do not create GSAP resources.
  const onFocus = (event: FocusEvent) => {
    if (!(event.target instanceof Element)) return
    for (const [target, tween] of tweens) {
      if (target.contains(event.target)) { tween.progress(1); tween.scrollTrigger?.kill() }
    }
  }
  const images = Array.from(root.querySelectorAll('img'))
  images.forEach(image => image.addEventListener('load', scheduleRefresh))
  root.addEventListener('toggle', scheduleRefresh, true)
  root.addEventListener('disclosure-settled', scheduleRefresh)
  root.addEventListener('focusin', onFocus)
  void document.fonts?.ready.then(() => { if (active) scheduleRefresh() })
  scheduleRefresh()
  return () => {
    if (!active) return
    active = false
    if (refreshFrame) window.cancelAnimationFrame(refreshFrame)
    images.forEach(image => image.removeEventListener('load', scheduleRefresh))
    root.removeEventListener('toggle', scheduleRefresh, true)
    root.removeEventListener('disclosure-settled', scheduleRefresh)
    root.removeEventListener('focusin', onFocus)
    tweens.forEach(tween => { tween.scrollTrigger?.kill(); tween.revert() })
    tweens.clear()
  }
}
