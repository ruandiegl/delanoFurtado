import styled from 'styled-components'
import { Container, Section, SmallLabel } from '@/styles/primitives'
import { ContactCta } from '@/components/brand/ContactCta'
import { ContactChannels } from '@/components/brand/ContactChannels'
const Wrap = styled(Section)`
  background: var(--primary); color: white; border-radius: 32px 32px 0 0; padding-bottom: 56px;
  .contact-panel { background: var(--secondary); color: var(--foreground); border-radius: 16px; padding: 56px; display: grid; grid-template-columns: 1fr 1fr; gap: 88px; align-items: center; }
  h2 { font-size: clamp(32px, 3.2vw, 42px); font-weight: 450; line-height: 1.2; letter-spacing: -.045em; margin-block: 24px; }
  .contact-intro { font-size: 14px; line-height: 1.85; color: var(--muted-foreground); margin-bottom: 26px; }
  @media (max-width: 63.99rem) { .contact-panel { gap: 40px; padding: 40px; } }
  @media (max-width: 47.99rem) { .contact-panel { grid-template-columns: 1fr; gap: 24px; padding: 32px 24px; } }
`
export function ContactSection() {
  return <Wrap id="contato"><Container><div className="contact-panel" data-reveal="contact"><div><SmallLabel>Vamos conversar</SmallLabel><h2>O primeiro passo é entender a sua demanda.</h2><p className="contact-intro">Entre em contato para apresentar seu caso e conhecer as possibilidades de atendimento.</p><ContactCta location="contact_section" label="Fale comigo pelo WhatsApp" /></div><ContactChannels location="contact_section" /></div></Container></Wrap>
}
