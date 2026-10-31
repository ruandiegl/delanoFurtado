import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet, FieldTitle } from '@/components/ui/field'
import { Switch } from '@/components/ui/switch'
import { consentConfig } from './config'
import { useConsent } from './context'

function PreferencesForm() {
  const consent = useConsent()
  const [analytics, setAnalytics] = useState(consent.record?.preferences.analytics === 'granted')
  function chooseAll(allowed: boolean) {
    setAnalytics(allowed && consentConfig.capabilities.analytics)
    consent.setPreferences({ analytics: allowed && consentConfig.capabilities.analytics ? 'granted' : 'denied', advertising: 'denied' })
  }
  return <form className="flex flex-col gap-5" onSubmit={event => { event.preventDefault(); consent.setPreferences({ analytics: analytics ? 'granted' : 'denied', advertising: 'denied' }) }}>
    {consent.storageWarning && <p role="status">Sua escolha está aplicada nesta visita, mas o navegador não permitiu salvá-la. Para mantê-la nas próximas visitas, permita guardar preferências ou apague os dados deste site nas configurações do navegador.</p>}
    <FieldSet><FieldLegend className="sr-only">Categorias de armazenamento</FieldLegend><FieldGroup>
      <Field><FieldContent><FieldTitle>Necessários — sempre ativos</FieldTitle><FieldDescription>Guardamos a sua escolha neste navegador por até 180 dias. A preferência usa armazenamento local e permite respeitar sua decisão.</FieldDescription></FieldContent></Field>
      {consentConfig.capabilities.analytics && <Field orientation="horizontal"><FieldContent><FieldLabel htmlFor="cookie-analytics">Análise</FieldLabel><FieldDescription id="cookie-analytics-description">Google Analytics: páginas visitadas e posição dos canais de contato, sem mensagens ou detalhes do seu caso.</FieldDescription></FieldContent><Switch id="cookie-analytics" aria-describedby="cookie-analytics-description" checked={analytics} onCheckedChange={setAnalytics} /></Field>}
    </FieldGroup></FieldSet>
    <p className="text-muted-foreground">Você pode navegar e entrar em contato sem aceitar. Fechar esta janela descarta alterações não salvas.</p>
    <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Políticas de privacidade"><Link className="inline-flex min-h-11 items-center underline underline-offset-4" to="/politica-de-cookies" onClick={consent.closePreferences}>Política de Cookies</Link><Link className="inline-flex min-h-11 items-center underline underline-offset-4" to="/politica-de-privacidade" onClick={consent.closePreferences}>Privacidade</Link></nav>
    <div className="flex flex-col gap-2"><Button type="submit" variant="brand" size="cookie">Salvar preferências</Button><div className="grid grid-cols-2 gap-2"><Button type="button" variant="outline" size="cookie" onClick={() => chooseAll(false)}>Rejeitar todos</Button><Button type="button" variant="outline" size="cookie" onClick={() => chooseAll(true)}>Aceitar todos</Button></div></div>
  </form>
}
export function CookiePreferencesDialog() {
  const consent = useConsent()
  return <Dialog open={consent.preferencesOpen} onOpenChange={open => { if (!open) consent.closePreferences() }}><DialogContent finalFocus={() => consent.preferencesTrigger.current?.isConnected ? consent.preferencesTrigger.current : document.querySelector<HTMLElement>('[data-cookie-preferences]') ?? true}>
    <DialogHeader className="pr-10"><DialogTitle>Preferências de cookies</DialogTitle><DialogDescription>Escolha quais serviços opcionais podem funcionar neste navegador.</DialogDescription></DialogHeader><PreferencesForm />
  </DialogContent></Dialog>
}
