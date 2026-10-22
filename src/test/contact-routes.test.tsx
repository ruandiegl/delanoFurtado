import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { expect, it } from 'vitest'
import App from '@/App'
import { siteData } from '@/content/siteData'
import { buildMapsUrl, buildPhoneHref } from '@/lib/contactLinks'
it('offers real contact channels without simulated sending', () => {
  render(<MemoryRouter initialEntries={['/contate-nos']}><App /></MemoryRouter>)
  const main = within(screen.getByRole('main'))
  expect(main.getByRole('link', { name: siteData.email })).toHaveAttribute('href', `mailto:${siteData.email}`)
  expect(main.getByRole('link', { name: siteData.phoneDisplay })).toHaveAttribute('href', buildPhoneHref(siteData.phoneInternational))
  expect(main.getByRole('link', { name: 'Instagram' })).toHaveAttribute('href', siteData.instagramUrl)
  expect(screen.queryByRole('button', { name: 'Enviar mensagem' })).not.toBeInTheDocument()
  expect(screen.queryByText('Mensagem enviada!')).not.toBeInTheDocument()
})
it('shows the office address and an accurate external map link', () => {
  render(<MemoryRouter initialEntries={['/localizacao']}><App /></MemoryRouter>)
  const main = within(screen.getByRole('main'))
  expect(main.getByText(siteData.addressLine)).toBeVisible()
  expect(main.getByRole('link', { name: 'Abrir no Google Maps' })).toHaveAttribute('href', buildMapsUrl(siteData.fullAddress))
})
