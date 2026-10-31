import { StrictMode } from 'react'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Link, MemoryRouter, Route, Routes } from 'react-router-dom'
import { expect, it, vi } from 'vitest'
import { ConsentProvider } from '@/consent/ConsentProvider'
import { ConsentControls, PrivacyPreferencesButton } from '@/consent/ConsentControls'
import { AnalyticsBridge } from '@/analytics/AnalyticsBridge'
import { ContactCta } from '@/components/brand/ContactCta'
import { CONSENT_KEY, createConsent } from '@/consent/storage'

vi.mock('@/analytics/config', async importOriginal => {
  const actual = await importOriginal<typeof import('@/analytics/config')>()
  return { ...actual, analyticsConfig: { ...actual.analyticsConfig, productionOrigin: window.location.origin, streamConfigured: true } }
})

it('restores a saved grant in StrictMode, sends one view per page and one contact event for an icon click', async () => {
  localStorage.setItem(CONSENT_KEY, JSON.stringify(createConsent({ analytics: 'granted', advertising: 'denied' }, Date.now())))
  try {
    render(<StrictMode><MemoryRouter initialEntries={['/?email=private#unknown']} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><ConsentProvider><AnalyticsBridge /><nav aria-label="Navegação"><Link to="/contate-nos">Contato</Link></nav><Routes><Route path="/" element={<ContactCta location="hero" />} /><Route path="/contate-nos" element={<h1>Contato</h1>} /></Routes><PrivacyPreferencesButton /><ConsentControls /></ConsentProvider></MemoryRouter></StrictMode>)
    const commands = () => Array.from(window.dataLayer ?? [], item => Array.from(item as ArrayLike<unknown>))
    await waitFor(() => expect(commands().filter(item => item[1] === 'page_view')).toHaveLength(1))
    expect(document.querySelectorAll('[data-delano-analytics]')).toHaveLength(1)
    const cta = screen.getByRole('link', { name: 'Agendar atendimento' })
    const event = new MouseEvent('click', { bubbles: true, cancelable: true })
    cta.querySelector('svg')!.dispatchEvent(event)
    expect(event.defaultPrevented).toBe(false)
    expect(commands().filter(item => item[1] === 'whatsapp_click')).toEqual([['event', 'whatsapp_click', expect.objectContaining({ link_location: 'hero', page_path: '/' })]])
    await userEvent.click(within(screen.getByRole('navigation', { name: 'Navegação' })).getByRole('link', { name: 'Contato' }))
    await waitFor(() => expect(commands().filter(item => item[1] === 'page_view')).toHaveLength(2))
    expect(JSON.stringify(commands())).not.toContain('private')
    expect(JSON.stringify(commands())).not.toContain('?email')
    fireEvent.click(screen.getByRole('button', { name: 'Preferências de cookies' }))
    expect(screen.getByRole('dialog', { name: 'Preferências de cookies' })).toBeInTheDocument()
  } finally { localStorage.clear(); document.querySelector('[data-delano-analytics]')?.remove(); delete window.gtag; delete window.dataLayer }
})
