import { describe, expect, it } from 'vitest'
import { buildMapsUrl, buildPhoneHref, buildWhatsAppUrl } from './contactLinks'

const message = 'Olá, Dr. Delano. Vim pelo site e gostaria de uma orientação.'
const address = 'Rua 18 - B, 45 - Vila Santa Cecília, Volta Redonda-RJ, 27260-100, BR'

describe('official contact destinations', () => {
  it('preserves the official number and the complete accented message', () => {
    const url = new URL(buildWhatsAppUrl('5524999225628', message))
    expect(url.origin).toBe('https://wa.me')
    expect(url.pathname).toBe('/5524999225628')
    expect(url.searchParams.get('text')).toBe(message)
  })
  it('normalizes a formatted international number', () => {
    expect(new URL(buildWhatsAppUrl('+55 (24) 99922-5628', message)).pathname).toBe('/5524999225628')
    expect(buildPhoneHref('5524999225628')).toBe('tel:+5524999225628')
  })
  it('rejects absent or invalid numbers rather than creating a broken contact', () => {
    expect(() => buildWhatsAppUrl('', message)).toThrow()
    expect(() => buildPhoneHref('abc')).toThrow()
  })
  it('encodes the full map address without inventing coordinates', () => {
    const url = new URL(buildMapsUrl(address))
    expect(url.origin).toBe('https://www.google.com')
    expect(url.searchParams.get('query')).toBe(address)
    expect(url.searchParams.get('api')).toBe('1')
  })
})
