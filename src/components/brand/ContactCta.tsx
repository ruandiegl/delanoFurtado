import { ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { siteData } from '@/content/siteData'
import { buildWhatsAppUrl } from '@/lib/contactLinks'

export function ContactCta({
  label = 'Entre em contato via WhatsApp',
  className,
  tone = 'default',
}: {
  label?: string
  className?: string
  tone?: 'default' | 'hero'
}) {
  return <Button variant={tone === 'hero' ? 'hero' : 'brand'} size="cta" nativeButton={false} role="link" className={className}
    render={<a href={buildWhatsAppUrl(siteData.phoneInternational, siteData.whatsappMessage)} target="_blank" rel="noopener noreferrer" />}>
    <span>{label}</span><span className="cta-arrow" aria-hidden="true"><ArrowUpRight data-icon="inline-end" /></span>
  </Button>
}
