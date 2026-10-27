const sectionTargets = ['areas', 'sobre', 'atendimento', 'contato', 'main-content'] as const

export type SectionTarget = typeof sectionTargets[number]

export function resolveSectionTarget(value: unknown): SectionTarget | undefined {
  return sectionTargets.find(target => target === value)
}

export function readSectionNavigation(state: unknown): SectionTarget | undefined {
  if (typeof state !== 'object' || state === null || !('scrollTarget' in state)) return undefined
  return resolveSectionTarget(state.scrollTarget)
}
