import styled from 'styled-components'
import { GraduationCap, Fingerprint, Scale } from 'lucide-react'
import { Container, Section, RoundIcon } from '@/styles/primitives'
import { SectionHeading } from '@/components/brand/SectionHeading'
import { homeContent } from '@/content/homeContent'
const Grid = styled.div`
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px;
  article { border-top: 1px solid var(--border); padding-top: 28px; }
  h3 { font-size: 19px; font-weight: 500; letter-spacing: -.035em; margin-block: 22px 14px; }
  p { color: var(--muted-foreground); font-size: 14px; line-height: 1.85; }
  @media (max-width: 47.99rem) { grid-template-columns: 1fr; gap: 28px; }
`
const icons = [GraduationCap, Fingerprint, Scale]
export function DifferentialsSection() {
  return <Section><Container><SectionHeading label="Compromisso em cada atendimento" title="Técnica, clareza e atenção ao seu caso" />
    <Grid>{homeContent.differentials.map((item, index) => { const Icon = icons[index]; return <article key={item.title} data-reveal="card"><RoundIcon aria-hidden="true"><Icon /></RoundIcon><h3>{item.title}</h3><p>{item.text}</p></article> })}</Grid>
  </Container></Section>
}
