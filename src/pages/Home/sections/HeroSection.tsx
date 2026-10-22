import styled from 'styled-components'
import { ArrowDown, MapPin } from 'lucide-react'
import { Container, SmallLabel } from '@/styles/primitives'
import { media } from '@/content/media'
import { siteData } from '@/content/siteData'
import { homeContent } from '@/content/homeContent'
import { ContactCta } from '@/components/brand/ContactCta'
const Hero = styled.section`
  position: relative; padding-top: 56px; background: linear-gradient(180deg, #fff 75%, var(--secondary) 75%);
  .hero-grid { display: grid; grid-template-columns: 1.05fr 1fr; gap: 64px; align-items: center; }
  .hero-copy { padding-block: 14px 80px; }
  h1 { font-size: clamp(34px, 3.7vw, 52px); line-height: 1.15; letter-spacing: -.055em; font-weight: 450; margin-block: 24px; max-width: 560px; }
  .intro { font-size: 15px; line-height: 1.85; color: var(--muted-foreground); max-width: 490px; margin-bottom: 28px; }
  .hero-caption { display: flex; align-items: center; gap: 8px; font-size: 10px; margin-top: 19px; color: var(--muted-foreground); }
  .hero-caption svg { width: 13px; height: 13px; }
  .portrait-stage { position: relative; padding: 16px 0 0 20px; align-self: end; }
  .portrait-stage::before { content: ''; position: absolute; inset: 0 22px 0 0; border: 1px solid #c1c9bf; border-radius: 160px 16px 0 0; }
  .hero-photo { width: 100%; height: 590px; object-fit: cover; object-position: center 18%; position: relative; border-radius: 144px 12px 0 0; }
  .portrait-tag { position: absolute; left: -24px; bottom: 48px; background: white; border: 1px solid var(--border); border-radius: 8px; padding: 16px 22px; display: flex; align-items: center; gap: 14px; box-shadow: 0 8px 30px #14271b09; }
  .portrait-tag img { width: 48px; height: 48px; } .portrait-tag strong { display: block; font-size: 13px; font-weight: 600; } .portrait-tag span { font-size: 10px; color: var(--muted-foreground); }
  .scroll-hint { display: flex; justify-content: space-between; align-items: center; font-size: 10px; letter-spacing: .06em; text-transform: uppercase; padding-block: 28px; }
  .scroll-hint a { display: flex; align-items: center; gap: 12px; min-height: 44px; } .scroll-hint svg { width: 14px; height: 14px; }
  @media (min-width: 90rem) { .hero-grid { gap: 88px; } }
  @media (max-width: 63.99rem) { .hero-grid { gap: 36px; } .hero-photo { height: 540px; } .portrait-tag { left: -12px; bottom: 24px; padding: 12px; } }
  @media (max-width: 47.99rem) {
    padding-top: 36px; background: linear-gradient(180deg, #fff 88%, var(--secondary) 88%);
    .hero-grid { grid-template-columns: 1fr; gap: 36px; } .hero-copy { padding: 0; } h1 { max-width: 520px; font-size: clamp(34px, 8.4vw, 48px); }
    .intro { font-size: 14px; } .portrait-stage { width: min(100%, 440px); justify-self: center; padding-left: 14px; }
    .hero-photo { height: auto; aspect-ratio: 4 / 4.7; object-position: center 20%; border-radius: 110px 12px 0 0; }
    .portrait-stage::before { border-radius: 120px 16px 0 0; } .portrait-tag { left: 0; } .scroll-hint { font-size: 9px; padding-block: 16px; gap: 20px; }
  }
`
export function HeroSection() {
  return <Hero><Container><div className="hero-grid"><div className="hero-copy" data-reveal="hero"><SmallLabel>Delano Furtado · Advocacia</SmallLabel><h1 tabIndex={-1}>{homeContent.heroTitle}</h1>
    <p className="intro">{homeContent.heroDescription}</p><ContactCta /><p className="hero-caption"><MapPin aria-hidden="true" />Presencial no RJ · Online em todo o Brasil</p>
    </div><div className="portrait-stage" data-reveal="hero"><img {...media.portrait} className="hero-photo" sizes="(max-width: 767px) 100vw, 550px" fetchPriority="high" />
    <div className="portrait-tag"><img {...media.monogram} alt="" /><div><strong>{siteData.name}</strong><span>{siteData.oab}</span></div></div></div></div>
    <div className="scroll-hint"><span>Atuação técnica. Atendimento próximo.</span><a href="#areas">Conheça a atuação<ArrowDown aria-hidden="true" /></a></div></Container></Hero>
}
