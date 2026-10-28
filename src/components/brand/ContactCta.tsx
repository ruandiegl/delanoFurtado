import { ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { WhatsAppIcon } from '@/components/brand/SocialIcons'
import { siteData } from '@/content/siteData'
import { buildWhatsAppUrl } from '@/lib/contactLinks'
import { getAnalyticsClient } from '@/analytics/client'
import type { LinkLocation } from '@/analytics/config'

export function ContactCta({
  label = 'Agendar atendimento',
  className,
  tone = 'default',
  location,
}: {
  label?: string
  className?: string
  tone?: 'default' | 'hero'
  location?: LinkLocation
}) {
  return <Button variant={tone === 'hero' ? 'hero' : 'brand'} size="cta" nativeButton={false} role="link" className={className}
    render={<a href={buildWhatsAppUrl(siteData.phoneInternational, siteData.whatsappMessage)} target="_blank" rel="noopener noreferrer" onClick={() => { if (location) getAnalyticsClient().track('whatsapp_click', location) }} />}>
    <span>{label}</span><span className="cta-arrow" aria-hidden="true">{location === 'header' ? <ArrowUpRight data-icon="inline-end" /> : <WhatsAppIcon data-icon="inline-end" />}</span>
  </Button>
}
