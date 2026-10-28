import { NavLink } from 'react-router-dom'
import styled from 'styled-components'
import { Container } from '@/styles/primitives'
import { media } from '@/content/media'
import { ContactCta } from '@/components/brand/ContactCta'
import { SectionLink } from '@/components/brand/SectionLink'
import { MobileMenu } from './MobileMenu'

const Bar = styled.header`
  position: sticky; top: 0; z-index: 20; background: #fffffff5; border-bottom: 1px solid #eceee9;
  ${Container} { display: flex; align-items: center; justify-content: space-between; gap: 28px; min-height: 96px; }
  .brand { flex-shrink: 0; width: 208px; }
  .desktop-nav { display: none; align-items: center; gap: 30px; font-size: 12px; font-weight: 500; }
  .desktop-nav a { padding: 10px 0; transition: color .2s; }
  .desktop-nav a:hover { color: #6d825f; }
  .header-cta { display: none; min-height: 46px; padding-inline: 17px; font-size: 11px; }
  .header-cta .cta-arrow { width: 26px; height: 26px; }
  .mobile-nav { display: block; }
  @media (min-width: 64rem) { .desktop-nav { display: flex; } .header-cta { display: inline-flex; } .mobile-nav { display: none; } }
  @media (max-width: 47.99rem) { ${Container} { min-height: 80px; } .brand { width: 176px; } }
`
export function Header() {
  return <Bar><Container>
    <SectionLink section="main-content" className="brand" aria-label="Delano Furtado — início"><img {...media.logo} /></SectionLink>
    <nav className="desktop-nav" aria-label="Navegação principal">
      <SectionLink section="areas">Áreas de atuação</SectionLink><SectionLink section="sobre">Sobre</SectionLink>
      <NavLink to="/localizacao">Localização</NavLink><NavLink to="/contate-nos">Contato</NavLink>
    </nav>
    <ContactCta location="header" label="Fale comigo" className="header-cta" />
    <div className="mobile-nav"><MobileMenu /></div>
  </Container></Bar>
}
