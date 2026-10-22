import styled from 'styled-components'
import { Section } from './primitives'
export const PageSection = styled(Section)`
  min-height: 68vh;
  h1 { font-size: clamp(36px, 4.2vw, 56px); letter-spacing: -.05em; font-weight: 450; max-width: 700px; margin-block: 24px; }
  .page-intro { font-size: 16px; line-height: 1.8; color: var(--muted-foreground); max-width: 580px; margin-bottom: 32px; }
  .page-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: start; }
  .info-panel { background: var(--secondary); border: 1px solid var(--border); border-radius: 12px; padding: 36px; }
  .info-panel h2 { font-size: 23px; font-weight: 500; letter-spacing: -.035em; margin-bottom: 20px; }
  .address { font-style: normal; font-size: 16px; line-height: 1.9; margin-block: 24px; }
  .map-link, .return-link { display: inline-flex; align-items: center; gap: 24px; min-height: 48px; font-size: 13px; font-weight: 600; border-bottom: 1px solid var(--primary); }
  .map-link svg { width: 17px; height: 17px; }
  .socials { display: flex; flex-wrap: wrap; gap: 24px; margin-top: 24px; } .socials a { min-height: 44px; display: inline-flex; align-items: center; font-size: 13px; text-decoration: underline; text-underline-offset: 4px; }
  .small-copy { font-size: 14px; line-height: 1.9; color: var(--muted-foreground); margin-bottom: 24px; }
  @media (max-width: 63.99rem) { .page-grid { gap: 40px; } }
  @media (max-width: 47.99rem) { .page-grid { grid-template-columns: 1fr; } .info-panel { padding: 28px 24px; } }
`
