import { Link } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import styled from 'styled-components'
import { Button } from '@/components/ui/button'
import { consentConfig } from './config'
import { useConsent } from './context'

const Banner = styled.aside`
  position: fixed; z-index: 45; right: 20px; bottom: calc(90px + env(safe-area-inset-bottom));
  width: min(480px, calc(100% - 40px)); padding: 14px; border: 1px solid var(--cookie-border);
  border-radius: 14px; background: var(--cookie-surface); color: var(--cookie-text);
  box-shadow: 0 8px 30px #0002; max-height: calc(100dvh - 120px); overflow-y: auto; overscroll-behavior: contain;
  .cookie-copy { padding-right: 34px; color: var(--cookie-muted); font-size: 12.5px; line-height: 1.5; }
  .cookie-links { display: flex; flex-wrap: wrap; gap: 0 14px; margin-top: 4px; }
  .cookie-links a { text-decoration: underline; text-underline-offset: 3px; color: var(--cookie-text); }
  .cookie-actions { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin-top: 10px; }
  .cookie-close { position: absolute; top: 5px; right: 5px; border: 0; }
  a:focus-visible { outline: 2px solid var(--cookie-text); outline-offset: 4px; border-radius: 2px; }
  body:has(#nl-badge-frame) & { bottom: calc(144px + env(safe-area-inset-bottom)); max-height: calc(100dvh - 164px); }
  @media (max-width: 47.99rem) {
    right: 16px; width: min(480px, calc(100% - 32px));
    .cookie-actions { grid-template-columns: 1fr 1fr; }
    .cookie-settings { grid-column: 1 / -1; }
  }
`
export function CookieBanner({ onDismiss }: { onDismiss: () => void }) {
  const consent = useConsent()
  const banner = useRef<HTMLElement>(null)
  useEffect(() => {
    let frame = 0
    function revealFocus(event: FocusEvent) {
      const target = event.target
      if (!(target instanceof HTMLElement) || banner.current?.contains(target)) return
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const panel = banner.current
        if (!panel || document.activeElement !== target) return
        const control = target.getBoundingClientRect()
        const box = panel.getBoundingClientRect()
        if (control.width <= 0 || control.height <= 0 || control.left < box.left || control.right > box.right || control.top < box.top || control.bottom > box.bottom) return
        const above = document.elementFromPoint?.(control.left + control.width / 2, control.top + control.height / 2)
        // A modal above the banner is not obscured by it.
        if (above && panel.contains(above)) onDismiss()
      })
    }
    document.addEventListener('focusin', revealFocus)
    return () => { cancelAnimationFrame(frame); document.removeEventListener('focusin', revealFocus) }
  }, [onDismiss])
  return <Banner ref={banner} role="region" aria-label="Aviso de cookies">
    <div className="cookie-copy"><p>Usamos cookies opcionais para analisar visitas ao site. Você pode aceitar, rejeitar ou escolher suas preferências.</p><nav className="cookie-links" aria-label="Informações de privacidade"><Link to="/politica-de-cookies">Política de Cookies</Link><Link to="/politica-de-privacidade">Privacidade</Link></nav></div>
    <Button type="button" variant="cookieSettings" size="touch" className="cookie-close" aria-label="Fechar aviso de cookies" onClick={onDismiss}><X aria-hidden="true" /></Button>
    <div className="cookie-actions"><Button type="button" variant="cookieSettings" size="cookie" className="cookie-settings" onClick={consent.openPreferences}>Preferências</Button><Button type="button" variant="cookieAction" size="cookie" onClick={() => consent.setPreferences({ analytics: 'denied', advertising: 'denied' })}>Rejeitar todos</Button><Button type="button" variant="cookieAction" size="cookie" onClick={() => consent.setPreferences({ analytics: consentConfig.capabilities.analytics ? 'granted' : 'denied', advertising: 'denied' })}>Aceitar todos</Button></div>
  </Banner>
}
