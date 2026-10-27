import { Link, type LinkProps } from 'react-router-dom'
import type { SectionTarget } from '@/routes/sectionNavigation'

type SectionLinkProps = Omit<LinkProps, 'to' | 'state'> & { section: Exclude<SectionTarget, 'main-content'> }

export function SectionLink({ section, ...props }: SectionLinkProps) {
  return <Link {...props} to="/" state={{ scrollTarget: section }} />
}
