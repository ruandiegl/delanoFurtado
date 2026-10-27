import type { SectionTarget } from '@/routes/sectionNavigation'

export function scrollToSection(section: SectionTarget): void {
  const target = document.getElementById(section)
  if (!target) return
  const heading = target.querySelector<HTMLElement>('h1, h2') ?? target
  heading.tabIndex = -1
  heading.focus({ preventScroll: true })
  target.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
}
