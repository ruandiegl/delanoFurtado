import styled from 'styled-components'
import { Container, Section, SmallLabel } from '@/styles/primitives'
import { media } from '@/content/media'
import { siteData } from '@/content/siteData'
import { ContactCta } from '@/components/brand/ContactCta'
import { Copy, TwoColumns } from '../homeStyles'
const Portrait = styled.div`
  position: relative;
  margin-left: 24px;

  .photo {
    display: block;
    width: 100%;
    height: auto;
    max-height: 650px;
    object-fit: cover;
    object-position: top;
    border-radius: 8px 100px 8px 8px;
  }

  .seal { position: absolute; left: -24px; bottom: 36px; width: 104px; height: 104px; display: grid; place-items: center; background: var(--secondary); border: 6px solid white; border-radius: 50%; }
  .seal img { width: 72px; height: 72px; }

  &::before {
    content: '';
    position: absolute;
    top: -16px;
    right: 20px;
    width: 50px;
    height: 5px;
    background: var(--primary);
    border-radius: 3px;
  }
`
export function AboutSection() {
  return <Section id="sobre"><Container><TwoColumns><Copy><div data-reveal="text"><SmallLabel>Conheça o advogado</SmallLabel><h2>Proximidade para entender.<br />Estratégia para atuar.</h2></div>
    {siteData.biography.map(paragraph => <p key={paragraph} data-reveal="section">{paragraph}</p>)}<div data-reveal="card"><ContactCta label="Converse sobre o seu caso" /></div>
    </Copy><Portrait data-reveal="section"><img {...media.portrait} className="photo" loading="lazy" sizes="(max-width: 767px) calc(100vw - 64px), (max-width: 1023px) 42vw, 540px" /><span className="seal"><img {...media.monogram} alt="" loading="lazy" /></span></Portrait>
  </TwoColumns></Container></Section>
}
