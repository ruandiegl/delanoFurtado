import styled from 'styled-components'
import { BriefcaseBusiness } from 'lucide-react'
import { Section, Container } from '@/styles/primitives'
import { SectionHeading } from '@/components/brand/SectionHeading'
import { ServiceCard } from '@/components/brand/ServiceCard'
import { ServiceDisclosure } from '@/components/brand/ServiceDisclosure'
import { services } from '@/content/services'
const Wrap = styled(Section)`
  background: var(--secondary); padding-top: 32px; border-radius: 0 0 32px 32px;
  .service-grid { display: grid; grid-template-columns: 1fr 1fr; align-items: start; gap: 24px; }
  .monthly { margin-top: 24px; border-radius: 8px; background: var(--primary); color: white; padding: 36px; }
  .monthly-top { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: center; }
  .monthly h3 { font-size: 26px; font-weight: 450; letter-spacing: -.04em; margin-top: 18px; }
  .monthly p { font-size: 14px; line-height: 1.8; color: #d7e0d6; }
  .monthly details { border-top: 1px solid #ffffff30; margin-top: 24px; }
  .monthly summary { list-style: none; display: flex; justify-content: space-between; align-items: center; min-height: 52px; cursor: pointer; font-size: 12px; }
  .monthly summary::-webkit-details-marker { display: none; } .monthly summary svg { width: 16px; height: 16px; } .monthly details[open] summary svg { transform: rotate(45deg); }
  .monthly details p { margin-top: 14px; max-width: 85ch; }
  @media (max-width: 47.99rem) { .service-grid, .monthly-top { grid-template-columns: 1fr; } .monthly { padding: 28px 24px; } .monthly-top { gap: 18px; } }
`
export function ServicesSection() {
  const monthly = services[6]
  return <Wrap id="areas"><Container><SectionHeading label="Áreas de atuação" title="Orientação jurídica para cada momento" description="Conheça as áreas em que posso auxiliar você, sua família e sua empresa." />
    <div className="service-grid">{services.slice(0, 6).map(service => <ServiceCard key={service.id} service={service} />)}</div>
    <article className="monthly" data-reveal="card"><div className="monthly-top"><div><BriefcaseBusiness aria-hidden="true" size={27} strokeWidth={1.3} /><h3>{monthly.title}</h3></div><p>{monthly.summary}</p></div>
      <ServiceDisclosure label="Conheça a assessoria mensal" accessibleLabel={`Ver detalhes — ${monthly.title}`}>{monthly.items.map(item => <p key={item}>{item}</p>)}</ServiceDisclosure>
    </article></Container></Wrap>
}
