import styled from 'styled-components'
import { SmallLabel } from '@/styles/primitives'

const Wrap = styled.div<{ $align: 'center' | 'left' }>`
  text-align: ${({ $align }) => $align}; margin-bottom: 42px;
  h2 { font-size: clamp(28px, 3vw, 38px); font-weight: 450; letter-spacing: -.04em; margin-top: 20px; }
  p { font-size: 14px; color: var(--muted-foreground); max-width: 540px; margin: 16px ${({ $align }) => $align === 'center' ? 'auto' : '0'} 0; }
`
export function SectionHeading({ label, title, description, align = 'center' }: {
  label: string; title: string; description?: string; align?: 'center' | 'left'
}) {
  return <Wrap $align={align} data-reveal="text"><SmallLabel>{label}</SmallLabel><h2>{title}</h2>{description && <p>{description}</p>}</Wrap>
}
