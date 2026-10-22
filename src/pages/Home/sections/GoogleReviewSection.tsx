import styled from 'styled-components'
import { ArrowUpRight } from 'lucide-react'
import { Container } from '@/styles/primitives'
import { siteData } from '@/content/siteData'
import { media } from '@/content/media'
const Wrap = styled.section`
  padding-bottom: 96px;
  .review-band { display: flex; align-items: center; justify-content: space-between; gap: 32px; padding: 32px 40px; border: 1px solid var(--border); border-radius: 8px; }
  .review-copy { display: flex; align-items: center; gap: 24px; } img { width: 38px; height: 38px; object-fit: contain; }
  h2 { font-size: 20px; font-weight: 500; letter-spacing: -.035em; } p { font-size: 13px; color: var(--muted-foreground); margin-top: 7px; }
  a { font-size: 12px; font-weight: 600; display: inline-flex; align-items: center; gap: 24px; min-height: 44px; flex-shrink: 0; border-bottom: 1px solid var(--border); } svg { width: 16px; height: 16px; }
  @media (max-width: 47.99rem) { padding-bottom: 64px; .review-band { align-items: flex-start; flex-direction: column; padding: 28px; gap: 18px; } .review-copy { align-items: flex-start; gap: 18px; } }
`
export function GoogleReviewSection() {
  return <Wrap aria-label="Avaliação no Google"><Container><div className="review-band" data-reveal="card"><div className="review-copy"><img {...media.google} alt="" loading="lazy" /><div><h2>Já foi atendido por mim?</h2><p>Compartilhe sua experiência e deixe sua avaliação no Google.</p></div></div><a href={siteData.googleReviewUrl} target="_blank" rel="noopener noreferrer">Avaliar no Google<ArrowUpRight aria-hidden="true" /></a></div></Container></Wrap>
}
