import styled from 'styled-components'
import { Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { siteData } from '@/content/siteData'
import { buildPhoneHref } from '@/lib/contactLinks'
const Channels = styled.div`
  display: grid; gap: 0; min-width: 0;
  .channel { display: flex; align-items: flex-start; gap: 18px; padding-block: 22px; border-bottom: 1px solid var(--border); min-width: 0; }
  .channel > svg { width: 19px; height: 19px; stroke-width: 1.4; margin-top: 3px; flex-shrink: 0; }
  .channel > div { min-width: 0; }
  .channel small { display: block; color: var(--muted-foreground); font-size: 10px; letter-spacing: .08em; text-transform: uppercase; margin-bottom: 7px; }
  a { font-size: 14px; font-weight: 500; overflow-wrap: anywhere; min-height: 24px; display: inline-block; padding-block: 2px; }
  .channel p { font-size: 12px; line-height: 1.8; margin-top: 4px; color: var(--muted-foreground); }
  .channel a svg { display: inline; width: 13px; height: 13px; margin-left: 8px; }
`
export function ContactChannels({ includeAddress = true }: { includeAddress?: boolean }) {
  return <Channels><div className="channel"><Phone aria-hidden="true" /><div><small>Telefone</small><a href={buildPhoneHref(siteData.phoneInternational)}>{siteData.phoneDisplay}</a></div></div>
    <div className="channel"><Mail aria-hidden="true" /><div><small>E-mail</small><a href={`mailto:${siteData.email}`}>{siteData.email}</a></div></div>
    {includeAddress && <div className="channel"><MapPin aria-hidden="true" /><div><small>Escritório</small><Link to="/localizacao">{siteData.addressLine}<ArrowUpRight aria-hidden="true" /></Link><p>{siteData.cityLine}</p></div></div>}
  </Channels>
}
