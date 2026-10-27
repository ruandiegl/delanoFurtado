import { afterEach, beforeAll, expect, it, vi } from 'vitest'
import { createPageMotion } from './siteMotion'
import { gsap, ScrollTrigger, registerClientMotion } from './gsap'
let dispose: (() => void) | undefined
beforeAll(registerClientMotion)
afterEach(() => { dispose?.(); dispose = undefined; document.body.innerHTML = ''; vi.restoreAllMocks() })
function fixture() {
  document.body.innerHTML = '<div id="a"><div data-reveal="card"><button>A</button></div><div data-reveal="card"><button>A2</button></div></div><div id="b"><div data-reveal="card"><button>B</button></div></div>'
  return { a: document.querySelector<HTMLElement>('#a')!, b: document.querySelector<HTMLElement>('#b [data-reveal]')! }
}
it('isolates targets by root', () => {
  const { a, b } = fixture()
  const before = b.getAttribute('style')
  dispose = createPageMotion(a, { isDesktop: false })
  expect(b.getAttribute('style')).toBe(before)
  expect(gsap.getTweensOf(b)).toHaveLength(0)
  expect(gsap.getTweensOf(a.firstElementChild)).not.toHaveLength(0)
})
it('disposes twice safely', () => {
  const { a } = fixture()
  const baseline = ScrollTrigger.getAll().length
  dispose = createPageMotion(a, { isDesktop: true })
  dispose(); dispose()
  expect(ScrollTrigger.getAll()).toHaveLength(baseline)
  expect(a.querySelector<HTMLElement>('[data-reveal]')!.style.cssText).toBe('')
})
it('finishes only the focused block and preserves focus', () => {
  const { a } = fixture()
  dispose = createPageMotion(a, { isDesktop: true })
  const blocks = a.querySelectorAll<HTMLElement>('[data-reveal]')
  const [first] = gsap.getTweensOf(blocks[0])
  const [second] = gsap.getTweensOf(blocks[1])
  first.progress(.2).pause(); second.progress(.2).pause()
  const secondProgress = second.progress()
  const button = blocks[0].querySelector('button')!
  button.focus()
  expect(first.progress()).toBe(1)
  expect(second.progress()).toBe(secondProgress)
  expect(button).toHaveFocus()
  expect(blocks[0].style.opacity).not.toBe('0')
})
it('does not refresh after unmount', async () => {
  const { a } = fixture()
  let queued: FrameRequestCallback | undefined
  vi.spyOn(window, 'requestAnimationFrame').mockImplementation(callback => { queued = callback; return 55 })
  const cancel = vi.spyOn(window, 'cancelAnimationFrame')
  dispose = createPageMotion(a, { isDesktop: false })
  dispose()
  const refresh = vi.spyOn(ScrollTrigger, 'refresh')
  queued?.(0)
  await Promise.resolve()
  expect(refresh).not.toHaveBeenCalled()
  expect(cancel).toHaveBeenCalledWith(55)
})
it('requests a safe refresh so layout updates do not interrupt scrolling', () => {
  const { a } = fixture()
  let queued: FrameRequestCallback | undefined
  vi.spyOn(window, 'requestAnimationFrame').mockImplementation(callback => { queued = callback; return 55 })
  dispose = createPageMotion(a, { isDesktop: false })
  const refresh = vi.spyOn(ScrollTrigger, 'refresh').mockImplementation(() => {})
  queued?.(0)
  expect(refresh).toHaveBeenCalledWith(true)
})
it('staggers hero entrance without ScrollTrigger and animates scroll blocks with fast smooth opacity reveal', () => {
  document.body.innerHTML = '<div id="root"><span data-reveal="hero">Badge</span><h1 data-reveal="hero">Title</h1><div class="portrait-stage" data-reveal="hero"></div><section data-reveal="section">Content</section></div>'
  const root = document.querySelector<HTMLElement>('#root')!
  const section = root.querySelector<HTMLElement>('[data-reveal="section"]')!
  vi.spyOn(section, 'getBoundingClientRect').mockReturnValue(DOMRect.fromRect({ x: 0, y: 2000, width: 300, height: 100 }))
  const baseline = ScrollTrigger.getAll().length
  dispose = createPageMotion(root, { isDesktop: true })
  const heroes = root.querySelectorAll<HTMLElement>('[data-reveal="hero"]')
  const [badgeTween] = gsap.getTweensOf(heroes[0])
  const [titleTween] = gsap.getTweensOf(heroes[1])
  const [portraitTween] = gsap.getTweensOf(heroes[2])
  expect(badgeTween.scrollTrigger).toBeUndefined()
  expect(titleTween.delay()).toBeGreaterThan(badgeTween.delay())
  expect(badgeTween.duration()).toBeCloseTo(1.05, 2)
  expect(portraitTween.duration()).toBeCloseTo(1.2, 2)
  const [sectionTween] = gsap.getTweensOf(section)
  expect(ScrollTrigger.getAll()).toHaveLength(baseline + 1)
  expect(sectionTween.duration()).toBeLessThanOrEqual(0.42)
  sectionTween.progress(1)
  expect(section.style.opacity).toBe('1')
})

