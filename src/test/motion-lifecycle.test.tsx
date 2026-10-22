import { StrictMode, useRef } from 'react'
import { render } from '@testing-library/react'
import { beforeAll, expect, it, vi } from 'vitest'
import { registerClientMotion, ScrollTrigger } from '@/motion/gsap'
import { usePageMotion } from '@/hooks/usePageMotion'
beforeAll(registerClientMotion)
function Fixture({ route }: { route: string }) {
  const scope = useRef<HTMLDivElement>(null)
  usePageMotion(scope, route)
  return <div ref={scope}><article data-reveal="card"><a href="#detail">{route}</a></article></div>
}
it('replaces route motion under StrictMode without accumulating triggers', () => {
  const baseline = ScrollTrigger.getAll().length
  const originalBounds = HTMLElement.prototype.getBoundingClientRect
  const bounds = vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
    return this.hasAttribute('data-reveal') ? DOMRect.fromRect({ x: 0, y: 2000, width: 300, height: 100 }) : originalBounds.call(this)
  })
  const view = render(<StrictMode><Fixture route="/" /></StrictMode>)
  expect(ScrollTrigger.getAll()).toHaveLength(baseline + 1)
  for (const route of ['/localizacao', '/contate-nos', '/', '/localizacao', '/']) {
    view.rerender(<StrictMode><Fixture route={route} /></StrictMode>)
    expect(ScrollTrigger.getAll()).toHaveLength(baseline + 1)
  }
  view.unmount()
  expect(ScrollTrigger.getAll()).toHaveLength(baseline)
  bounds.mockRestore()
})
