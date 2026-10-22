import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { ArrowUpRight, Star } from 'lucide-react'
import { Container, SmallLabel } from '@/styles/primitives'
import { siteData } from '@/content/siteData'
import { media } from '@/content/media'
import { googleReviews, googleReviewsMeta, wrapCarouselOffset } from '@/content/reviews'

const Wrap = styled.section`
  padding-block: 24px 96px;
  overflow: hidden;

  .reviews-header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 32px;
    margin-bottom: 40px;
    flex-wrap: wrap;
  }

  .header-copy h2 {
    font-size: clamp(28px, 3vw, 38px);
    font-weight: 450;
    line-height: 1.18;
    letter-spacing: -.04em;
    margin-top: 14px;
  }

  .google-summary {
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 14px 22px;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 12px;
    flex-wrap: wrap;
  }

  .google-brand {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .google-brand img {
    width: 34px;
    height: 34px;
    object-fit: contain;
    flex-shrink: 0;
  }

  .rating-line {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 15px;
    font-weight: 600;
    color: var(--foreground);
  }

  .stars {
    display: inline-flex;
    align-items: center;
    gap: 2px;
    color: #d49b27;
  }

  .stars svg {
    width: 14px;
    height: 14px;
    fill: currentColor;
  }

  .rating-sub {
    display: block;
    font-size: 12px;
    color: var(--muted-foreground);
    margin-top: 2px;
  }

  .review-cta {
    font-size: 12px;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    min-height: 44px;
    padding-inline: 14px;
    border-radius: 8px;
    border: 1px solid var(--border);
    background: var(--background);
    color: var(--foreground);
    transition: border-color .2s, background-color .2s;
  }

  .review-cta:hover {
    background: var(--secondary);
    border-color: var(--primary);
  }

  .review-cta svg {
    width: 15px;
    height: 15px;
  }

  .carousel-viewport {
    position: relative;
    max-width: 1440px;
    margin-inline: auto;
    overflow: hidden;
    padding-block: 8px;
    cursor: grab;
    user-select: none;
    -webkit-user-select: none;
    touch-action: pan-y;
    mask-image: linear-gradient(
      90deg,
      transparent 0%,
      #00000038 5%,
      #000 14%,
      #000 86%,
      #00000038 95%,
      transparent 100%
    );
    -webkit-mask-image: linear-gradient(
      90deg,
      transparent 0%,
      #00000038 5%,
      #000 14%,
      #000 86%,
      #00000038 95%,
      transparent 100%
    );
  }

  .carousel-viewport[data-dragging='true'] {
    cursor: grabbing;
  }

  .carousel-track {
    display: flex;
    width: max-content;
    will-change: transform;
    transform: translate3d(0, 0, 0);
  }

  .review-set {
    display: flex;
    gap: 24px;
    padding-right: 24px;
    flex-shrink: 0;
  }

  .review-card {
    width: clamp(300px, 32vw, 390px);
    min-height: 236px;
    padding: 28px;
    border-radius: 16px;
    background: var(--card);
    border: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 20px;
    flex-shrink: 0;
    box-shadow: 0 10px 28px -18px #17261f24;
    transition: border-color .2s;
  }

  .review-card:hover {
    border-color: #20382f45;
  }

  .card-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .card-time {
    font-size: 11px;
    color: var(--muted-foreground);
  }

  .card-quote {
    font-size: 14px;
    line-height: 1.75;
    color: var(--foreground);
    margin: 0;
  }

  .card-author {
    display: flex;
    align-items: center;
    gap: 12px;
    padding-top: 14px;
    border-top: 1px solid var(--border);
  }

  .author-avatar {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    background: var(--primary);
    color: var(--primary-foreground);
    font-size: 12px;
    font-weight: 600;
    letter-spacing: .04em;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .author-name {
    display: block;
    font-size: 14px;
    font-weight: 600;
    color: var(--foreground);
  }

  .author-badge {
    display: block;
    font-size: 11px;
    color: var(--muted-foreground);
  }

  @media (max-width: 47.99rem) {
    padding-bottom: 64px;

    .reviews-header {
      margin-bottom: 28px;
      gap: 20px;
    }

    .google-summary {
      width: 100%;
      justify-content: space-between;
    }

    .carousel-viewport {
      mask-image: linear-gradient(
        90deg,
        transparent 0%,
        #000 10%,
        #000 90%,
        transparent 100%
      );
      -webkit-mask-image: linear-gradient(
        90deg,
        transparent 0%,
        #000 10%,
        #000 90%,
        transparent 100%
      );
    }

    .review-card {
      width: min(84vw, 330px);
      padding: 22px;
      min-height: 220px;
    }
  }
`

const BASE_SPEED_PX_PER_SEC = -46
const FRICTION_PER_SEC = 2.8

export function GoogleReviewSection() {
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const firstSetRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const stateRef = useRef({
    offset: 0,
    setWidth: 0,
    initialized: false,
    dragging: false,
    pointerId: -1,
    lastX: 0,
    lastMoveTime: 0,
    dragVelocity: 0,
    extraVelocity: 0,
    reducedMotion: false,
  })

  useEffect(() => {
    const track = trackRef.current
    const firstSet = firstSetRef.current
    const viewport = viewportRef.current
    if (!track || !firstSet || !viewport) return

    const st = stateRef.current
    const mediaQuery =
      typeof window.matchMedia === 'function'
        ? window.matchMedia('(prefers-reduced-motion: reduce)')
        : null
    st.reducedMotion = Boolean(mediaQuery?.matches)

    const measure = () => {
      const rectW = firstSet.getBoundingClientRect().width || firstSet.offsetWidth || 0
      if (rectW > 0) {
        st.setWidth = rectW
        if (!st.initialized) {
          st.offset = -rectW
          st.initialized = true
        } else {
          st.offset = wrapCarouselOffset(st.offset, rectW)
        }
        track.style.transform = `translate3d(${st.offset}px, 0, 0)`
      }
    }

    measure()
    const resizeObserver =
      typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null
    resizeObserver?.observe(firstSet)

    const onMotionChange = (event: MediaQueryListEvent) => {
      st.reducedMotion = event.matches
    }
    mediaQuery?.addEventListener?.('change', onMotionChange)

    let rafId = 0
    let prevTime = performance.now()

    const tick = (now: number) => {
      const dt = Math.min(0.064, Math.max(0.001, (now - prevTime) / 1000))
      prevTime = now

      if (!st.dragging && st.setWidth > 0) {
        const targetSpeed = st.reducedMotion ? 0 : BASE_SPEED_PX_PER_SEC
        // Smooth exponential braking/acceleration back to continuous right-to-left speed
        st.extraVelocity *= Math.exp(-FRICTION_PER_SEC * dt)
        if (Math.abs(st.extraVelocity) < 0.15) st.extraVelocity = 0

        const currentSpeed = targetSpeed + st.extraVelocity
        if (currentSpeed !== 0) {
          st.offset = wrapCarouselOffset(st.offset + currentSpeed * dt, st.setWidth)
          track.style.transform = `translate3d(${st.offset}px, 0, 0)`
        }
      }

      rafId = window.requestAnimationFrame(tick)
    }

    rafId = window.requestAnimationFrame(tick)

    return () => {
      window.cancelAnimationFrame(rafId)
      resizeObserver?.disconnect()
      mediaQuery?.removeEventListener?.('change', onMotionChange)
    }
  }, [])

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 && event.pointerType === 'mouse') return
    const target = event.target as HTMLElement | null
    if (target?.closest('a, button')) return

    const st = stateRef.current
    const firstSet = firstSetRef.current
    if (firstSet && st.setWidth <= 0) {
      const w = firstSet.getBoundingClientRect().width || firstSet.offsetWidth || 2400
      st.setWidth = w
      if (!st.initialized) {
        st.offset = -w
        st.initialized = true
      }
    }

    st.dragging = true
    st.pointerId = event.pointerId
    st.lastX = event.clientX
    st.lastMoveTime = performance.now()
    st.dragVelocity = 0
    st.extraVelocity = 0
    setIsDragging(true)

    try {
      event.currentTarget.setPointerCapture(event.pointerId)
    } catch {
      // Ignore in synthetic test environments without pointer capture implementation
    }
  }

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const st = stateRef.current
    if (!st.dragging || event.pointerId !== st.pointerId) return
    const track = trackRef.current
    if (!track) return

    const now = performance.now()
    const dx = event.clientX - st.lastX
    const dt = Math.max(0.004, (now - st.lastMoveTime) / 1000)

    const w = st.setWidth || 2400
    st.offset = wrapCarouselOffset(st.offset + dx, w)
    track.style.transform = `translate3d(${st.offset}px, 0, 0)`

    const instVelocity = dx / dt
    st.dragVelocity = st.dragVelocity * 0.35 + instVelocity * 0.65
    st.lastX = event.clientX
    st.lastMoveTime = now
  }

  const finishDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const st = stateRef.current
    if (!st.dragging || event.pointerId !== st.pointerId) return

    const idleMs = performance.now() - st.lastMoveTime
    // If user held still before releasing, decay release velocity smoothly toward 0
    const releaseDecay = idleMs > 60 ? Math.exp(-(idleMs - 60) / 80) : 1
    const releaseVelocity = Math.max(-1800, Math.min(1800, st.dragVelocity * releaseDecay))
    const targetSpeed = st.reducedMotion ? 0 : BASE_SPEED_PX_PER_SEC

    // C1-continuous handoff: v(0) = targetSpeed + extraVelocity = releaseVelocity
    st.extraVelocity = releaseVelocity - targetSpeed
    st.dragging = false
    st.pointerId = -1
    setIsDragging(false)

    try {
      if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId)
      }
    } catch {
      // Ignore in synthetic test environments
    }
  }

  return (
    <Wrap aria-label="Avaliações no Google">
      <Container>
        <div className="reviews-header" data-reveal="section">
          <div className="header-copy">
            <SmallLabel>Experiência dos clientes</SmallLabel>
            <h2>Avaliações reais no Google</h2>
          </div>
          <div className="google-summary">
            <div className="google-brand">
              <img {...media.google} alt="" loading="lazy" />
              <div>
                <div className="rating-line">
                  <span>{googleReviewsMeta.ratingDisplay}</span>
                  <span className="stars" aria-label="5 de 5 estrelas">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} aria-hidden="true" />
                    ))}
                  </span>
                </div>
                <span className="rating-sub">{googleReviewsMeta.sourceLabel}</span>
              </div>
            </div>
            <a
              className="review-cta"
              href={siteData.googleReviewUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Avaliar no Google
              <ArrowUpRight aria-hidden="true" />
            </a>
          </div>
        </div>
      </Container>

      <div
        ref={viewportRef}
        className="carousel-viewport"
        data-reveal="card"
        data-dragging={isDragging ? 'true' : 'false'}
        aria-label="Carrossel de avaliações de clientes no Google"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishDrag}
        onPointerCancel={finishDrag}
      >
        <div ref={trackRef} className="carousel-track" data-testid="reviews-track">
          {[0, 1, 2].map((setIndex) => (
            <div
              key={setIndex}
              ref={setIndex === 0 ? firstSetRef : undefined}
              className="review-set"
              aria-hidden={setIndex > 0 ? 'true' : undefined}
            >
              {googleReviews.map((review) => (
                <article key={`${setIndex}-${review.id}`} className="review-card">
                  <div>
                    <div className="card-top">
                      <span className="stars" aria-label="5 estrelas">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star key={i} aria-hidden="true" />
                        ))}
                      </span>
                      <span className="card-time">{review.relativeTime}</span>
                    </div>
                    <blockquote className="card-quote" style={{ marginTop: 14 }}>
                      “{review.text}”
                    </blockquote>
                  </div>
                  <footer className="card-author">
                    <span className="author-avatar" aria-hidden="true">
                      {review.initials}
                    </span>
                    <div>
                      <span className="author-name">{review.author}</span>
                      <span className="author-badge">{review.roleOrBadge}</span>
                    </div>
                  </footer>
                </article>
              ))}
            </div>
          ))}
        </div>
      </div>
    </Wrap>
  )
}
