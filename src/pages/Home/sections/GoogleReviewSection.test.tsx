import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { googleReviews, wrapCarouselOffset } from '@/content/reviews'
import { GoogleReviewSection } from './GoogleReviewSection'

describe('GoogleReviewSection infinite carousel', () => {
  it('wraps offsets seamlessly into [-2 * w, -w) in both drag directions', () => {
    const w = 2400

    // Base middle copy starts at -2400
    expect(wrapCarouselOffset(-2400, w)).toBe(-2400)
    expect(wrapCarouselOffset(-3000, w)).toBe(-3000)

    // Crossing left boundary (-4800 -> wraps back to -2400 seamlessly)
    expect(wrapCarouselOffset(-4800, w)).toBe(-2400)
    expect(wrapCarouselOffset(-4950, w)).toBe(-2550)

    // Dragging right past -2400 towards 0 or positive wraps back into [-4800, -2400)
    expect(wrapCarouselOffset(-2300, w)).toBe(-4700)
    expect(wrapCarouselOffset(-100, w)).toBe(-2500)
    expect(wrapCarouselOffset(200, w)).toBe(-4600)
  })

  it('renders verified Google Maps reviews and three loop sets for seamless wrap', () => {
    const { container } = render(<GoogleReviewSection />)

    expect(
      screen.getByRole('heading', { name: /Avaliações reais no Google/i }),
    ).toBeInTheDocument()

    const sets = container.querySelectorAll('.review-set')
    expect(sets).toHaveLength(3)
    expect(sets[0]).not.toHaveAttribute('aria-hidden')
    expect(sets[1]).toHaveAttribute('aria-hidden', 'true')
    expect(sets[2]).toHaveAttribute('aria-hidden', 'true')

    for (const review of googleReviews) {
      expect(screen.getAllByText(review.author).length).toBeGreaterThanOrEqual(1)
    }
  })

  it('supports holding, dragging to both sides, and releasing with inertia', () => {
    const { container } = render(<GoogleReviewSection />)
    const viewport = container.querySelector('.carousel-viewport') as HTMLElement
    const track = container.querySelector('.carousel-track') as HTMLElement

    expect(viewport).toBeTruthy()
    expect(track).toBeTruthy()
    expect(viewport).toHaveAttribute('data-dragging', 'false')

    // Press and hold
    fireEvent.pointerDown(viewport, { button: 0, pointerId: 1, clientX: 500 })
    expect(viewport).toHaveAttribute('data-dragging', 'true')

    // Drag left
    fireEvent.pointerMove(viewport, { pointerId: 1, clientX: 380 })
    const transformAfterLeft = track.style.transform
    expect(transformAfterLeft).toContain('translate3d(')

    // Drag right
    fireEvent.pointerMove(viewport, { pointerId: 1, clientX: 640 })
    const transformAfterRight = track.style.transform
    expect(transformAfterRight).not.toBe(transformAfterLeft)

    // Release pointer -> smooth inertia braking resumes continuous motion
    fireEvent.pointerUp(viewport, { pointerId: 1, clientX: 640 })
    expect(viewport).toHaveAttribute('data-dragging', 'false')
  })
})
