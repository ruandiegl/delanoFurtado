import styled from 'styled-components'

export const Container = styled.div`
  width: min(1200px, calc(100% - 48px)); margin-inline: auto;
  @media (max-width: 47.99rem) { width: calc(100% - 40px); }
`
export const Section = styled.section`
  padding-block: clamp(64px, 8vw, 112px); scroll-margin-top: 100px;
`
export const SmallLabel = styled.span`
  display: inline-flex; align-items: center; gap: 8px; padding: 7px 12px; border: 1px solid var(--border); border-radius: 5px;
  font-size: 10px; font-weight: 600; letter-spacing: .1em; line-height: 1.4; text-transform: uppercase;
`
export const RoundIcon = styled.span`
  display: inline-grid; place-items: center; width: 44px; height: 44px; flex-shrink: 0;
  color: var(--primary); border: 1px solid #c8d3c9; border-radius: 50%; background: #e8ede7;
  & svg { width: 20px; height: 20px; stroke-width: 1.4; }
`
export const BodyText = styled.p`
  font-size: 15px; line-height: 1.85; color: var(--muted-foreground);
`
