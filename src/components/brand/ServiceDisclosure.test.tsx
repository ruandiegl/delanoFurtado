import { StrictMode } from 'react'
import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeAll, expect, it, vi } from 'vitest'
import { gsap, registerClientMotion } from '@/motion/gsap'
import { services } from '@/content/services'
import { ServiceCard } from './ServiceCard'

beforeAll(registerClientMotion)
const originalMatchMedia = window.matchMedia
afterEach(() => { window.matchMedia = originalMatchMedia; vi.restoreAllMocks() })
function summary(title = services[2].title) { return screen.getByLabelText(`Ver atuações — ${title}`) }
function finish(details: Element) {
  const panel = details.querySelector('.disclosure-content')!
  act(() => { gsap.getTweensOf(panel).forEach(tween => tween.parent?.progress(1)) })
}
it('keeps the panel open during collapse and closes when motion finishes', async () => {
  const user = userEvent.setup()
  render(<ServiceCard service={services[2]} />)
  const control = summary()
  const details = control.closest('details')!
  await user.click(control)
  await user.click(control)
  expect(details).toHaveAttribute('open')
  finish(details)
  expect(details).not.toHaveAttribute('open')
  expect(control).toHaveFocus()
})
it('animates the opened list locally and clears motion after rapid reopening', async () => {
  const user = userEvent.setup()
  render(<><ServiceCard service={services[2]} /><ServiceCard service={services[0]} /></>)
  const control = summary()
  const details = control.closest('details')!
  await user.click(control)
  const items = Array.from(details.querySelectorAll('li'))
  expect(gsap.getTweensOf(items).length).toBeGreaterThan(0)
  const other = summary(services[0].title).closest('details')!
  expect(gsap.getTweensOf(Array.from(other.querySelectorAll('li')))).toHaveLength(0)
  await user.click(control)
  await user.click(control)
  finish(details)
  expect(details).toHaveAttribute('open')
  for (const item of items) { expect(item).toBeVisible(); expect(item.style.transform).toBe(''); expect(item.style.opacity).toBe('') }
  expect((details.querySelector('.disclosure-content') as HTMLElement).style.height).toBe('')
})
it('retains native immediate toggling when reduced motion is preferred', async () => {
  window.matchMedia = vi.fn(query => ({ matches: query.includes('prefers-reduced-motion'), media: query, onchange: null, addListener: vi.fn(), removeListener: vi.fn(), addEventListener: vi.fn(), removeEventListener: vi.fn(), dispatchEvent: vi.fn() }))
  const user = userEvent.setup()
  render(<ServiceCard service={services[2]} />)
  const control = summary()
  const details = control.closest('details')!
  await user.click(control)
  expect(details).toHaveAttribute('open')
  expect(gsap.getTweensOf(Array.from(details.querySelectorAll('li')))).toHaveLength(0)
  await user.click(control)
  expect(details).not.toHaveAttribute('open')
})
it('removes active disclosure animation on unmount under StrictMode', async () => {
  const user = userEvent.setup()
  const view = render(<StrictMode><ServiceCard service={services[2]} /></StrictMode>)
  await user.click(summary())
  const items = Array.from(summary().closest('details')!.querySelectorAll('li'))
  expect(gsap.getTweensOf(items).length).toBeGreaterThan(0)
  view.unmount()
  expect(gsap.getTweensOf(items)).toHaveLength(0)
})
it('settles a pending close when reduced motion changes and resumes native toggling', async () => {
  const listeners = new Set<() => void>()
  const reduced = { matches: false, media: '(prefers-reduced-motion: reduce)', onchange: null, addListener: (callback: () => void) => listeners.add(callback), removeListener: (callback: () => void) => listeners.delete(callback), addEventListener: vi.fn(), removeEventListener: vi.fn(), dispatchEvent: vi.fn() }
  window.matchMedia = vi.fn(() => reduced)
  const user = userEvent.setup()
  render(<ServiceCard service={services[2]} />)
  const control = summary()
  const details = control.closest('details')!
  await user.click(control)
  await user.click(control)
  expect(details).toHaveAttribute('open')
  await act(async () => { reduced.matches = true; listeners.forEach(callback => callback()); await new Promise(resolve => setTimeout(resolve, 10)) })
  expect(details).not.toHaveAttribute('open')
  expect(gsap.getTweensOf(Array.from(details.querySelectorAll('li')))).toHaveLength(0)
  await user.click(control)
  expect(details).toHaveAttribute('open')
  await user.click(control)
  expect(details).not.toHaveAttribute('open')
})
