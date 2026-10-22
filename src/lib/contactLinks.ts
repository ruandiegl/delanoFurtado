function internationalNumber(phone: string): string {
  if (!/^[+\d\s()-]+$/.test(phone)) throw new Error('Número de telefone inválido')
  const digits = phone.replace(/\D/g, '')
  if (!/^[1-9]\d{9,14}$/.test(digits)) throw new Error('Número internacional inválido')
  return digits
}

export function buildWhatsAppUrl(phone: string, message: string): string {
  const url = new URL(`https://wa.me/${internationalNumber(phone)}`)
  url.searchParams.set('text', message)
  return url.toString()
}

export function buildPhoneHref(phone: string): string {
  return `tel:+${internationalNumber(phone)}`
}

export function buildMapsUrl(address: string): string {
  const url = new URL('https://www.google.com/maps/search/')
  url.searchParams.set('api', '1')
  url.searchParams.set('query', address)
  return url.toString()
}
