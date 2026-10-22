import { StrictMode, useRef } from 'react'
import { act, render } from '@testing-library/react'
import { expect, it, vi } from 'vitest'
import { usePageMotion } from './usePageMotion'
import { registerClientMotion } from '@/motion/gsap'
import { createPageMotion } from '@/motion/siteMotion'
vi.mock('@/motion/siteMotion', () => ({ createPageMotion: vi.fn() }))
function Fixture({ route = '/' }: { route?: string }) { const scope = useRef<HTMLDivElement>(null); usePageMotion(scope, route); return <div ref={scope} /> }
it('responds to reduced-motion changes and cleans up in StrictMode', async () => {
  const queries = new Map<string, { matches: boolean; media: string; listeners: Set<() => void>; addListener: (cb: () => void) => void; removeListener: (cb: () => void) => void }>()
  const original = window.matchMedia
  window.matchMedia = vi.fn(query => {
    if (!queries.has(query)) { const listeners = new Set<() => void>(); queries.set(query, { media: query, matches: query === 'all', listeners, addListener: cb => listeners.add(cb), removeListener: cb => listeners.delete(cb) }) }
    return queries.get(query)! as unknown as MediaQueryList
  })
  const cleanup = vi.fn()
  vi.mocked(createPageMotion).mockReturnValue(cleanup)
  registerClientMotion()
  const view = render(<StrictMode><Fixture /></StrictMode>)
  expect(createPageMotion).toHaveBeenCalled()
  const calls = vi.mocked(createPageMotion).mock.calls.length
  const reduced = queries.get('(prefers-reduced-motion: reduce)')!
  await act(async () => { reduced.matches = true; reduced.listeners.forEach(cb => cb()); await new Promise(resolve => setTimeout(resolve, 10)) })
  expect(cleanup).toHaveBeenCalled()
  expect(createPageMotion).toHaveBeenCalledTimes(calls)
  view.unmount()
  // GSAP owns a shared media dispatcher; the removed instance must never react again.
  const afterUnmount = vi.mocked(createPageMotion).mock.calls.length
  await act(async () => { reduced.matches = false; reduced.listeners.forEach(cb => cb()); await new Promise(resolve => setTimeout(resolve, 10)) })
  expect(createPageMotion).toHaveBeenCalledTimes(afterUnmount)
  window.matchMedia = original
})
