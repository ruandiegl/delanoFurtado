import { useContext, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { Button } from '@/components/ui/button'
import { analyticsConfig } from '@/analytics/config'
import { ConsentContext, useConsent } from './context'

const Panel = styled.aside`
  position: fixed; z-index: 45; bottom: 24px; left: 24px; width: min(490px, calc(100% - 120px));
  max-height: calc(100dvh - 130px); overflow-y: auto; padding: 24px; border: 1px solid var(--border);
  background: var(--background); color: var(--foreground); border-radius: 12px; box-shadow: 0 8px 36px #20382f20;
  h2 { font-size: 20px; letter-spacing: -.03em; margin-bottom: 10px; }
  p { font-size: 13px; line-height: 1.7; color: var(--muted-foreground); }
  .choices { display: flex; gap: 12px; margin-top: 18px; }
  .choices button { flex: 1; min-height: 44px; white-space: normal; }
  details { font-size: 12px; margin-top: 14px; } summary { min-height: 44px; display: list-item; align-content: center; }
  .close-preferences { margin-top: 12px; min-height: 44px; }
  body:has(#nl-badge-frame) & { bottom: calc(144px + env(safe-area-inset-bottom)); max-height: calc(100dvh - 170px); }
  @media (max-width: 47.99rem) { left: 16px; right: 16px; bottom: calc(90px + env(safe-area-inset-bottom)); width: auto; padding: 20px; }
`
export function ConsentControls({ showInitial = analyticsConfig.streamConfigured }: { showInitial?: boolean }) {
  const consent = useConsent()
  const heading = useRef<HTMLHeadingElement>(null)
  useEffect(() => { if (consent.preferencesOpen) heading.current?.focus() }, [consent.preferencesOpen])
  if (!consent.ready || (!consent.preferencesOpen && !(showInitial && consent.analytics === 'unknown'))) return null
  return <Panel role="region" aria-labelledby="consent-heading" onKeyDown={event => { if (event.key === 'Escape' && consent.preferencesOpen) consent.closePreferences() }}>
    <h2 id="consent-heading" ref={heading} tabIndex={-1}>Preferências de privacidade</h2>
    <p>Você escolhe se permite o uso do Google Analytics para entender as visitas e os cliques nos canais de atendimento. Você pode navegar e entrar em contato sem aceitar.</p>
    <details><summary>Como a análise funciona</summary><p>Quando habilitada e autorizada, a análise registra páginas visitadas e a posição dos botões utilizados. Os eventos criados pelo site não incluem mensagens, telefone, e-mail ou detalhes do seu caso. A preferência fica salva por até 180 dias neste navegador e pode ser alterada pelo rodapé. O Google processa os dados de análise; os prazos da conta são administrados pelo escritório. Publicidade e remarketing não são habilitados por esta escolha.</p></details>
    <div className="choices"><Button variant="outline" onClick={() => consent.setAnalytics('denied')}>Recusar análise</Button><Button variant="outline" onClick={() => consent.setAnalytics('granted')}>Aceitar análise</Button></div>
    {consent.preferencesOpen && <Button className="close-preferences" variant="ghost" onClick={consent.closePreferences}>Fechar preferências</Button>}
  </Panel>
}
export function PrivacyPreferencesButton() {
  const consent = useContext(ConsentContext)
  return consent ? <button type="button" className="privacy-preferences" onClick={consent.openPreferences}>Preferências de privacidade</button> : null
}
