import { useRef, type ReactNode } from 'react'
import styled from 'styled-components'
import { Plus } from 'lucide-react'
import { useDisclosureMotion } from '@/hooks/useDisclosureMotion'

const Content = styled.div`
  display: flow-root;
`
export function ServiceDisclosure({ label, accessibleLabel, children }: {
  label: string; accessibleLabel: string; children: ReactNode
}) {
  const scope = useRef<HTMLDetailsElement>(null)
  useDisclosureMotion(scope)
  return <details ref={scope}><summary aria-label={accessibleLabel}>{label}<Plus aria-hidden="true" /></summary>
    <Content className="disclosure-content">{children}</Content>
  </details>
}
