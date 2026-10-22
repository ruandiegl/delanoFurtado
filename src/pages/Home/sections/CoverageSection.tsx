import styled from 'styled-components'
import { MapPin, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Container, Section, SmallLabel } from '@/styles/primitives'
import { siteData } from '@/content/siteData'
import { Copy, TwoColumns } from '../homeStyles'
const Wrap = styled(Section)`
  background: var(--secondary); border-radius: 32px;
  .geography { padding: 42px; border: 1px solid #cbd0c7; border-radius: 8px; position: relative; }
  .geography > svg { color: #657a61; width: 36px; height: 36px; stroke-width: 1; margin-bottom: 32px; }
  .geography .place { font-size: clamp(44px, 5vw, 70px); line-height: 1.05; letter-spacing: -.06em; font-weight: 400; }
  .geography .state { font-size: 10px; letter-spacing: .16em; text-transform: uppercase; color: var(--muted-foreground); margin-top: 20px; }
  .regions { display: flex; flex-wrap: wrap; gap: 8px; margin-block: 24px; list-style: none; }
  .regions li { border: 1px solid #c8cec3; border-radius: 4px; padding: 7px 10px; font-size: 11px; }
  .location-link { display: inline-flex; gap: 20px; align-items: center; min-height: 44px; border-bottom: 1px solid var(--primary); font-size: 12px; font-weight: 600; }
  .location-link svg { width: 16px; height: 16px; }
  @media (max-width: 47.99rem) { border-radius: 24px; .geography { padding: 32px; } }
`
export function CoverageSection() {
  return <Wrap id="atendimento"><Container><TwoColumns><div className="geography" data-reveal="section"><MapPin aria-hidden="true" /><div className="place">Volta<br />Redonda.</div><p className="state">Rio de Janeiro · Brasil</p></div>
    <Copy><div data-reveal="text"><SmallLabel>Onde posso atender você</SmallLabel><h2>Presença no Rio.<br />Conexão com todo o Brasil.</h2></div><p data-reveal="section">Atendimento presencial no estado do Rio de Janeiro e online para clientes de todo o Brasil, com proximidade e atenção em cada etapa da sua demanda.</p>
      <ul className="regions" aria-label="Regiões de atendimento presencial" data-reveal="card">{siteData.regions.map(region => <li key={region}>{region}</li>)}</ul><div data-reveal="section"><Link className="location-link" to="/localizacao">Conheça a localização do escritório<ArrowUpRight aria-hidden="true" /></Link></div>
    </Copy></TwoColumns></Container></Wrap>
}
