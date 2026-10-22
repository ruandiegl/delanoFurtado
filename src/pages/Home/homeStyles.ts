import styled from 'styled-components'
export const TwoColumns = styled.div`
  display: grid; grid-template-columns: 1fr 1fr; gap: clamp(40px, 6vw, 88px); align-items: center;
  > * { min-width: 0; }
  @media (max-width: 47.99rem) { grid-template-columns: 1fr; gap: 40px; }
`
export const Copy = styled.div`
  h2 { font-size: clamp(30px, 3.3vw, 40px); font-weight: 450; letter-spacing: -.045em; line-height: 1.25; margin-block: 20px 24px; }
  p { font-size: 15px; line-height: 1.85; color: var(--muted-foreground); margin-bottom: 16px; }
`
