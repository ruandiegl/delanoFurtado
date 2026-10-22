import styled from 'styled-components'
import { Container, Section, SmallLabel } from '@/styles/primitives'
import { media } from '@/content/media'
import { siteData } from '@/content/siteData'
import { ContactCta } from '@/components/brand/ContactCta'
import { Copy, TwoColumns } from '../homeStyles'
const Portrait = styled.div`
  position: relative; margin-left: 24px;
  .photo { width: 100%; max-height: 650px; object-fit: cover; object-position: top; border-radius: 8px 100px 8px 8px; }
  .seal { position: absolute; left: -24px; bottom: 36px; width: 104px; height: 104px; display: grid; place-items: center; background: var(--secondary); border: 6px solid white; border-radius: 50%; }
  .seal img { width: 72px; height: 72px; }
  &::before { content: ''; position: absolute; top: -16px; right: 20px; width: 50px; height: 5px; background: var(--primary); border-radius: 3px; }
`
export function AboutSection() {
  return <Section id="sobre"><Container><TwoColumns><Copy data-reveal="section"><SmallLabel>Conheça o advogado</SmallLabel><h2>Proximidade para entender.<br />Estratégia para atuar.</h2>
    {siteData.biography.map(paragraph => <p key={paragraph}>{paragraph}</p>)}<ContactCta label="Converse sobre o seu caso" />
    </Copy><Portrait data-reveal="section"><img {...media.portrait} className="photo" loading="lazy" sizes="(max-width: 767px) 100vw, 530px" /><span className="seal"><img {...media.monogram} alt="" loading="lazy" /></span></Portrait>
  </TwoColumns></Container></Section>
}
