import { useRef, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { usePageMotion } from '@/hooks/usePageMotion'
import { MessageCircle } from 'lucide-react'
import styled from 'styled-components'
import { Header } from './Header'
import { Footer } from './Footer'
import { RouteEffects } from './RouteEffects'
import { RouteSeo } from './RouteSeo'
import { siteData } from '@/content/siteData'
import { buildWhatsAppUrl } from '@/lib/contactLinks'

const FloatingContact = styled.a`
  position: fixed; z-index: 30; right: max(22px, env(safe-area-inset-right)); bottom: max(22px, env(safe-area-inset-bottom));
  display: grid; place-items: center; width: 54px; height: 54px; background: var(--primary); color: white;
  border: 1px solid #ffffff50; border-radius: 50%; box-shadow: 0 5px 24px #20382f25; transition: background .2s;
  &:hover { background: #426653; } svg { width: 23px; height: 23px; }
  body:has(#nl-badge-frame) & { bottom: calc(84px + env(safe-area-inset-bottom)); }
`
export function SiteLayout({ children }: { children: ReactNode }) {
  const scope = useRef<HTMLElement>(null)
  const { pathname } = useLocation()
  usePageMotion(scope, pathname)
  return <><RouteSeo /><a href="#main-content" className="skip-link">Pular para o conteúdo</a><Header /><RouteEffects />
    <main id="main-content" ref={scope}>{children}</main><Footer />
    <FloatingContact href={buildWhatsAppUrl(siteData.phoneInternational, siteData.whatsappMessage)} target="_blank" rel="noopener noreferrer" aria-label="Conversar pelo WhatsApp"><MessageCircle aria-hidden="true" /></FloatingContact>
  </>
}
