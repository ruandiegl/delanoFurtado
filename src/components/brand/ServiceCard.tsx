import type { Service } from '@/content/services'
import styled from 'styled-components'
import { Users, ShieldCheck, House, FileText, Sprout, Scale } from 'lucide-react'
import { RoundIcon } from '@/styles/primitives'
import { ServiceDisclosure } from './ServiceDisclosure'
const icons = { familia: Users, consumidor: ShieldCheck, imobiliario: House, contratual: FileText, sucessoes: Sprout, civil: Scale, 'assessoria-mensal': FileText }
const Card = styled.article`
  position: relative; background: white; border: 1px solid var(--border); border-radius: 8px; padding: 32px;
  &::before { content: ''; position: absolute; top: -1px; left: 32px; width: 42px; height: 5px; background: var(--primary); border-radius: 0 0 4px 4px; }
  .card-top { display: flex; gap: 20px; align-items: flex-start; }
  h3 { font-size: 21px; font-weight: 500; letter-spacing: -.035em; padding-top: 7px; }
  p { color: var(--muted-foreground); font-size: 14px; line-height: 1.8; margin-top: 18px; max-width: 48ch; }
  details { border-top: 1px solid #e9eae5; margin-top: 24px; }
  summary { display: flex; align-items: center; justify-content: space-between; cursor: pointer; list-style: none; min-height: 52px; font-size: 12px; font-weight: 600; padding-block: 14px; }
  summary::-webkit-details-marker { display: none; } summary svg { width: 16px; height: 16px; transition: transform .2s; }
  details[open] summary svg { transform: rotate(45deg); }
  ul { display: grid; gap: 12px; padding: 4px 0 10px 16px; list-style: disc; font-size: 13px; line-height: 1.7; color: var(--muted-foreground); }
  li { padding-left: 3px; overflow-wrap: anywhere; }
  @media (max-width: 47.99rem) { padding: 26px 24px; .card-top { gap: 14px; } h3 { font-size: 19px; } }
`
export function ServiceCard({ service }: { service: Service }) {
  const Icon = icons[service.id]
  return <Card data-reveal="card"><div className="card-top"><RoundIcon aria-hidden="true"><Icon /></RoundIcon><h3>{service.title}</h3></div>
    <p>{service.summary}</p><ServiceDisclosure label="Ver atuações" accessibleLabel={`Ver atuações — ${service.title}`}><ul>{service.items.map(item => <li key={item}>{item}</li>)}</ul></ServiceDisclosure></Card>
}
