import { Container, SmallLabel } from '@/styles/primitives'
import { PageSection } from '@/styles/pageStyles'
import { siteData } from '@/content/siteData'
import { ContactCta } from '@/components/brand/ContactCta'
import { ContactChannels } from '@/components/brand/ContactChannels'
export default function Contact() {
  return <PageSection><Container><div className="page-grid"><div data-reveal="section"><SmallLabel>Contato</SmallLabel><h1 tabIndex={-1}>Vamos conversar sobre o seu caso?</h1><p className="page-intro">Apresente sua demanda para conhecer as possibilidades de atendimento. Escolha o canal mais confortável para você.</p><ContactCta label="Iniciar conversa no WhatsApp" /><p className="small-copy" style={{ marginTop: 24 }}>O botão abre uma conversa no WhatsApp. Você também pode entrar em contato por telefone ou e-mail.</p></div>
    <div className="info-panel" data-reveal="card"><h2>Canais de atendimento</h2><ContactChannels /><nav className="socials" aria-label="Redes sociais"><a href={siteData.instagramUrl} target="_blank" rel="noopener noreferrer">Instagram</a><a href={siteData.facebookUrl} target="_blank" rel="noopener noreferrer">Facebook</a></nav></div>
  </div></Container></PageSection>
}
