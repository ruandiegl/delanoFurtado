import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { Container, SmallLabel } from '@/styles/primitives'
import { PageSection } from '@/styles/pageStyles'
import { siteData } from '@/content/siteData'
import type { PolicyContent } from '@/content/privacyContent'
import { PrivacyPreferencesButton } from '@/consent/ConsentControls'

const Article = styled.article`
  max-width: 760px;
  .policy-section { margin-block: 32px; }
  h2 { font-size: clamp(21px, 2.4vw, 27px); font-weight: 500; letter-spacing: -.035em; margin-bottom: 12px; }
  p { color: var(--muted-foreground); font-size: 15px; line-height: 1.85; margin-bottom: 16px; overflow-wrap: anywhere; }
  a, .privacy-preferences { text-decoration: underline; text-underline-offset: 4px; }
  .policy-links { display: flex; flex-wrap: wrap; gap: 16px 24px; margin-top: 24px; }
  .policy-links a, .privacy-preferences { display: inline-flex; align-items: center; min-height: 44px; }
  .privacy-preferences { background: none; color: inherit; border: 0; padding: 0; font: inherit; }
  address { font-style: normal; font-size: 15px; line-height: 1.85; overflow-wrap: anywhere; }
`
export function PolicyPage({ content }: { content: PolicyContent }) {
  return <PageSection><Container><Article><SmallLabel>Transparência</SmallLabel><h1 tabIndex={-1}>{content.title}</h1><p className="page-intro">{content.intro}</p><p>Atualizada em 30 de outubro de 2026.</p>
    {content.sections.map(section => <section className="policy-section" key={section.title}><h2>{section.title}</h2>{section.paragraphs.map(text => <p key={text}>{text}</p>)}</section>)}
    <section className="policy-section"><h2>Fale com o escritório</h2><address>{siteData.fullName}<br />{siteData.addressLine}<br />{siteData.cityLine}<br /><a href={`mailto:${siteData.email}`}>{siteData.email}</a><br /><a href={`tel:+${siteData.phoneInternational}`}>{siteData.phoneDisplay}</a></address></section>
    <nav className="policy-links" aria-label="Políticas e preferências"><Link to="/politica-de-privacidade">Política de Privacidade</Link><Link to="/politica-de-cookies">Política de Cookies</Link><PrivacyPreferencesButton /></nav>
  </Article></Container></PageSection>
}
