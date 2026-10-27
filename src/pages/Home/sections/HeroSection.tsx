import styled from 'styled-components'
import { ArrowDown, MapPin } from 'lucide-react'
import { Container } from '@/styles/primitives'
import { media } from '@/content/media'
import { homeContent } from '@/content/homeContent'
import { ContactCta } from '@/components/brand/ContactCta'
import { SectionLink } from '@/components/brand/SectionLink'

const Hero = styled.section`
  position: relative;
  overflow: hidden;
  padding-top: 48px;
  color: var(--hero-text-primary);
  background:
    radial-gradient(ellipse 54% 68% at 74% 42%, #183d31 0%, #0c241c 52%, var(--hero-bg-deep) 100%);

  .hero-backdrop {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    overflow: hidden;
  }

  .office-scenery {
    position: absolute;
    inset: 0;
    opacity: .68;
  }

  @keyframes heroSceneEnter {
    from {
      opacity: 0;
      transform: scale(1.055);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  .office-scenery img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: right center;
    filter: saturate(.88) contrast(1.04);
    @media (prefers-reduced-motion: no-preference) {
      animation: heroSceneEnter 1.35s cubic-bezier(.22, 1, .36, 1) both;
    }
  }

  [data-reveal='hero'] {
    will-change: transform, opacity;
  }

  .hero-vignette {
    position: absolute;
    inset: 0;
    background:
      linear-gradient(90deg, var(--hero-bg-deep) 0%, #071914f5 36%, #092019c4 56%, #0c281f73 78%, #071914cc 100%),
      linear-gradient(180deg, #05130fa6 0%, #0a231b40 28%, #0a231b33 70%, var(--hero-bg-deep) 100%);
  }

  .hero-bottom-fade {
    position: absolute;
    inset: auto 0 0 0;
    height: 248px;
    pointer-events: none;
    z-index: 2;
    background: linear-gradient(
      180deg,
      #07191400 0%,
      #0719141f 22%,
      #0719145c 44%,
      #071914ad 66%,
      #071914eb 82%,
      var(--hero-bg-deep) 94%,
      var(--hero-bg-deep) 100%
    );
  }

  ${Container} {
    position: relative;
  }

  .hero-grid {
    display: grid;
    grid-template-columns: 0.96fr 1.04fr;
    gap: 28px;
    align-items: center;
  }

  .hero-copy {
    position: relative;
    z-index: 3;
    padding-block: 28px 68px;
  }

  .hero-badge {
    display: inline-flex;
    align-items: center;
    padding: 8px 18px;
    border-radius: 999px;
    border: 1px solid #f2dfb480;
    background: linear-gradient(90deg, #f1e0b8 0%, #d9bc80 50%, #b79352 100%);
    color: #0e221b;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: .12em;
    line-height: 1.35;
    text-transform: uppercase;
    box-shadow: 0 8px 24px #00000040, inset 0 1px 0 #ffffff99;
  }

  h1 {
    font-size: clamp(34px, 3.7vw, 52px);
    line-height: 1.13;
    letter-spacing: -.045em;
    font-weight: 500;
    margin-block: 24px 22px;
    max-width: 550px;
    color: var(--hero-text-primary);
  }

  h1:focus {
    outline: none;
  }

  .hero-title-accent {
    display: block;
    color: var(--hero-gold-title);
    background: linear-gradient(180deg, #edd7a7 0%, #cfa968 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .intro {
    font-size: 15px;
    line-height: 1.8;
    color: var(--hero-text-muted);
    max-width: 490px;
    margin-bottom: 30px;
  }

  .hero-caption {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 11px;
    margin-top: 18px;
    color: #b5c4bc;
  }

  .hero-caption svg {
    width: 14px;
    height: 14px;
    color: var(--hero-gold-title);
    flex-shrink: 0;
  }

  .portrait-stage {
    position: relative;
    z-index: 1;
    align-self: end;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    min-height: 580px;
    padding-top: 0;
  }

  .hero-photo {
    position: relative;
    z-index: 1;
    width: min(115%, 650px);
    max-width: none;
    height: auto;
    aspect-ratio: 686 / 780;
    object-fit: contain;
    object-position: bottom center;
    display: block;
  }

  .scroll-hint {
    position: relative;
    z-index: 3;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 10px;
    letter-spacing: .08em;
    text-transform: uppercase;
    padding-block: 22px;
    border-top: 1px solid var(--hero-border);
    color: #b4c3bb;
  }

  .scroll-hint a {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    min-height: 44px;
    color: var(--hero-text-primary);
    transition: color .2s;
  }

  .scroll-hint a:hover {
    color: var(--hero-gold-title);
  }

  .scroll-hint a:focus-visible {
    outline: 2px solid var(--hero-gold-title);
    outline-offset: 4px;
    border-radius: 4px;
  }

  .scroll-hint svg {
    width: 14px;
    height: 14px;
    color: var(--hero-gold-title);
  }

  @media (min-width: 90rem) {
    .hero-grid { gap: 40px; }
  }

  @media (max-width: 63.99rem) {
    .hero-grid { gap: 20px; }
    .hero-copy { padding-block: 16px 48px; }
    .portrait-stage { min-height: 480px; }
    .hero-photo { width: min(108%, 560px); }
    .hero-bottom-fade { height: 210px; }
  }

  @media (max-width: 47.99rem) {
    padding-top: 28px;
    .office-scenery {
      opacity: .52;
    }
    .office-scenery img {
      object-position: 78% center;
    }
    .hero-vignette {
      background:
        linear-gradient(180deg, #071914eb 0%, #071914cc 48%, #0a221b8c 76%, var(--hero-bg-deep) 100%);
    }
    .hero-bottom-fade {
      height: 168px;
    }
    .hero-grid {
      grid-template-columns: 1fr;
      gap: 20px;
    }
    .hero-copy {
      padding: 0;
    }
    .hero-badge {
      font-size: 9px;
      padding: 7px 14px;
      letter-spacing: .09em;
    }
    h1 {
      max-width: 520px;
      font-size: clamp(32px, 8.2vw, 46px);
      margin-block: 18px;
    }
    .intro {
      font-size: 14px;
      margin-bottom: 24px;
    }
    .portrait-stage {
      width: min(100%, 500px);
      min-height: 0;
      justify-self: center;
      padding-top: 4px;
    }
    .hero-photo {
      width: 100%;
    }
    .scroll-hint {
      font-size: 9px;
      padding-block: 14px;
      gap: 16px;
      flex-wrap: wrap;
    }
  }
`

export function HeroSection() {
  return (
    <Hero>
      <div className="hero-backdrop" aria-hidden="true">
        <div className="office-scenery">
          <img {...media.heroBackdrop} decoding="async" />
        </div>
        <div className="hero-vignette" />
      </div>
      <div className="hero-bottom-fade" aria-hidden="true" />
      <Container>
        <div className="hero-grid">
          <div className="hero-copy">
            <span className="hero-badge" data-reveal="hero">{homeContent.heroBadge}</span>
            <h1 tabIndex={-1} data-reveal="hero">
              {homeContent.heroTitleParts.lead}{' '}
              <span className="hero-title-accent">{homeContent.heroTitleParts.accent}</span>
            </h1>
            <p className="intro" data-reveal="hero">{homeContent.heroDescription}</p>
            <div data-reveal="hero">
              <ContactCta tone="hero" />
            </div>
            <p className="hero-caption" data-reveal="hero">
              <MapPin aria-hidden="true" />
              Presencial no RJ · Online em todo o Brasil
            </p>
          </div>
          <div className="portrait-stage" data-reveal="hero">
            <img
              {...media.heroPortrait}
              className="hero-photo"
              sizes="(max-width: 767px) 94vw, 650px"
              fetchPriority="high"
            />
          </div>
        </div>
        <div className="scroll-hint" data-reveal="hero">
          <span>Atuação técnica. Atendimento próximo.</span>
          <SectionLink section="areas">
            Conheça a atuação
            <ArrowDown aria-hidden="true" />
          </SectionLink>
        </div>
      </Container>
    </Hero>
  )
}
