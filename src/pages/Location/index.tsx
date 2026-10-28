import { ArrowUpRight, MapPin } from 'lucide-react'
import { Container, SmallLabel } from '@/styles/primitives'
import { PageSection } from '@/styles/pageStyles'
import { siteData } from '@/content/siteData'
import { buildMapsUrl } from '@/lib/contactLinks'
import { getAnalyticsClient } from '@/analytics/client'
import { ContactCta } from '@/components/brand/ContactCta'
export default function Location() {
  return <PageSection><Container><div className="page-grid"><div data-reveal="section"><SmallLabel>Localização</SmallLabel><h1 tabIndex={-1}>Escritório em Volta Redonda</h1><p className="page-intro">Atendimento jurídico presencial em Volta Redonda e região, com a proximidade que o seu caso merece.</p><ContactCta location="location_page" label="Converse sobre o atendimento" /></div>
    <div className="info-panel" data-reveal="card"><MapPin size={28} strokeWidth={1.3} aria-hidden="true" /><h2 style={{ marginTop: 24 }}>Onde encontrar o escritório</h2><address className="address"><span>{siteData.addressLine}</span><br />{siteData.cityLine}</address><a className="map-link" onClick={() => getAnalyticsClient().track('map_click', 'location_page')} href={buildMapsUrl(siteData.fullAddress)} target="_blank" rel="noopener noreferrer">Abrir no Google Maps<ArrowUpRight aria-hidden="true" /></a>
      <p className="small-copy" style={{ marginTop: 32 }}>Atuação presencial em {siteData.regions.join(', ')} e atendimento online para clientes de todo o Brasil.</p></div>
  </div></Container></PageSection>
}
