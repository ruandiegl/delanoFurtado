import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { ArrowUpRight } from 'lucide-react'
import { Container } from '@/styles/primitives'
import { siteData } from '@/content/siteData'
import { FacebookIcon, InstagramIcon } from '@/components/brand/SocialIcons'
import { SectionLink } from '@/components/brand/SectionLink'
import { PrivacyPreferencesButton } from '@/consent/ConsentControls'

const Wrap = styled.footer`
  background: var(--primary); color: #e5ebe4; padding-block: 36px 26px;
  .footer-top { display: flex; justify-content: space-between; gap: 24px; padding-bottom: 28px; }
  .footer-name { font-size: 19px; font-weight: 500; letter-spacing: -.04em; }
  .footer-qualification { font-size: 10px; letter-spacing: .12em; color: #c4cec4; margin-top: 6px; text-transform: uppercase; }
  nav { display: flex; align-items: center; flex-wrap: wrap; gap: 22px; font-size: 12px; }
  .footer-bottom { border-top: 1px solid #ffffff25; padding-top: 22px; font-size: 10px; color: #c4cec4; display: flex; justify-content: space-between; gap: 20px; flex-wrap: wrap; }
  .social-link { display: inline-grid; place-items: center; width: 44px; height: 44px; border: 1px solid #ffffff30; border-radius: 50%; transition: border-color .2s, background-color .2s, color .2s; }
  .social-link:hover { border-color: #ffffff75; background: #ffffff14; color: #fff; }
  .social-link svg { width: 17px; height: 17px; }
  .privacy-preferences { background: none; border: 0; color: inherit; font: inherit; text-decoration: underline; min-height: 44px; padding-block: 10px; }
  svg { width: 15px; height: 15px; }
  @media (max-width: 47.99rem) { .footer-top { flex-direction: column; } nav { gap: 16px; } }
`
export function Footer() {
  return <Wrap><Container>
    <div className="footer-top"><div><div className="footer-name">Delano Furtado</div><p className="footer-qualification">Advocacia e consultoria jurídica</p></div>
      <nav aria-label="Navegação do rodapé"><SectionLink section="main-content">Início</SectionLink><Link to="/localizacao">Localização</Link><Link to="/contate-nos">Contato</Link>
        <a className="social-link" href={siteData.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram de Delano Furtado"><InstagramIcon aria-hidden="true" /></a>
        <a className="social-link" href={siteData.facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Facebook de Delano Furtado"><FacebookIcon aria-hidden="true" /></a>
      </nav>
    </div>
    <div className="footer-bottom"><span>© 2026 Delano Furtado. Todos os direitos reservados.</span><span>{siteData.oab} · CNPJ {siteData.cnpj}</span><SectionLink section="contato">Entre em contato <ArrowUpRight style={{ display: 'inline', marginLeft: 3 }} /></SectionLink><PrivacyPreferencesButton /></div>
  </Container></Wrap>
}
