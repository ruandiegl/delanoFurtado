import { gsap, ScrollTrigger, registerClientMotion } from './gsap'

export function createPageMotion(root: HTMLElement, { isDesktop }: { isDesktop: boolean }): () => void {
  registerClientMotion()
  let active = true
  let refreshFrame = 0
  const targets = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]'))
  const tweens = new Map<HTMLElement, gsap.core.Tween>()
  let heroOrder = 0
  let cardOrder = 0

  targets.forEach(target => {
    const kind = target.dataset.reveal
    const hero = kind === 'hero'
    const isPortrait = target.classList.contains('portrait-stage')
    const isCard = kind === 'card'
    const isText = kind === 'text'
    const isContact = kind === 'contact'

    const y = hero
      ? isPortrait
        ? isDesktop ? 32 : 22
        : isDesktop ? 26 : 18
      : isText
        ? isDesktop ? 18 : 12
        : isCard
          ? isDesktop ? 22 : 14
          : isContact
            ? isDesktop ? 20 : 12
            : isDesktop ? 24 : 16

    const fromVars: gsap.TweenVars = {
      y,
      opacity: 0.001,
      ...(isPortrait ? { scale: 0.968 } : isCard ? { scale: 0.985 } : {}),
    }

    const delay = hero
      ? isPortrait
        ? 0.06
        : heroOrder++ * (isDesktop ? 0.085 : 0.06)
      : isCard
        ? (cardOrder++ % 3) * (isDesktop ? 0.04 : 0.025)
        : 0

    const duration = hero
      ? isPortrait
        ? 1.2
        : 1.05
      : isText
        ? 0.34
        : isCard
          ? 0.36
          : 0.4

    const tween = gsap.fromTo(
      target,
      fromVars,
      {
        y: 0,
        opacity: 1,
        ...(isPortrait || isCard ? { scale: 1 } : {}),
        duration,
        ease: hero ? 'power2.out' : 'power3.out',
        delay,
        overwrite: 'auto',
        ...(hero
          ? {}
          : {
              scrollTrigger: {
                trigger: target,
                start: isContact ? 'top 92%' : 'top 90%',
                once: true,
              },
            }),
      },
    )
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
