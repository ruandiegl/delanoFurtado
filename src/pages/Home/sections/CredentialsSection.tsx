import styled from 'styled-components'
import { GraduationCap, BookOpen, Award } from 'lucide-react'
import { Container, RoundIcon } from '@/styles/primitives'
import { siteData } from '@/content/siteData'
const Wrap = styled.section`
  background: var(--secondary); padding-block: 36px 64px;
  .credentials { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 32px; padding: 30px 36px; border: 1px solid var(--border); border-radius: 8px; background: white; box-shadow: 0 12px 34px #0c221b0d; }
  .credential { display: flex; align-items: center; gap: 16px; }
  h2 { font-size: 12px; font-weight: 600; line-height: 1.6; } p { font-size: 11px; color: var(--muted-foreground); margin-top: 4px; line-height: 1.7; }
  @media (max-width: 63.99rem) { .credentials { gap: 20px; padding: 24px; } .credential { flex-direction: column; align-items: flex-start; } }
  @media (max-width: 47.99rem) { padding-block: 24px 40px; .credentials { grid-template-columns: 1fr; } .credential { flex-direction: row; align-items: center; } }
`
const icons = [GraduationCap, BookOpen, Award]
export function CredentialsSection() {
  return <Wrap aria-label="Formação acadêmica"><Container><div className="credentials">{siteData.education.map((education, i) => {
    const Icon = icons[i]
    return <div className="credential" key={education.title} data-reveal="card"><RoundIcon aria-hidden="true"><Icon /></RoundIcon><div><h2>{education.title}</h2><p>{education.institution}</p></div></div>
  })}</div></Container></Wrap>
}
