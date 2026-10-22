import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, it } from 'vitest'
import { services } from '@/content/services'
import { ServiceCard } from './ServiceCard'

it('opens the complete real-estate service list without dropping long content', async () => {
  const user = userEvent.setup()
  const service = services[2]
  render(<ServiceCard service={service} />)
  const summary = screen.getByText('Ver atuações', { selector: 'summary' })
  expect(summary).toHaveAccessibleName(`Ver atuações — ${service.title}`)
  await user.click(summary)
  expect(summary.closest('details')).toHaveAttribute('open')
  for (const item of service.items) expect(screen.getByText(item)).toBeVisible()
})
