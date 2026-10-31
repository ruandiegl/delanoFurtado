import { siteData } from './siteData'
import { resolvePublicRoute } from '@/routes/routeManifest'
export type SeoMetadata = { title: string; description: string; canonical: string; image: string; noindex: boolean }
export const publicOrigin = 'https://www.delanofurtado.adv.br'
export function getSeo(pathname: string): SeoMetadata {
  const route = resolvePublicRoute(pathname)
  const content = route === '/' ? {
    title: 'Delano Furtado | Advogado em Volta Redonda',
    description: 'Advocacia e consultoria jurídica com Delano Furtado. Atendimento presencial em Volta Redonda e região e online em todo o Brasil. Conheça as áreas de atuação.',
  } : route === '/localizacao' ? {
    title: 'Localização | Delano Furtado — Volta Redonda',
    description: 'Encontre o escritório de Delano Furtado na Vila Santa Cecília, em Volta Redonda, RJ. Consulte o endereço e abra a localização no Google Maps.',
  } : route === '/contate-nos' ? {
    title: 'Contato | Delano Furtado — Advocacia',
    description: 'Entre em contato com Delano Furtado pelo WhatsApp, telefone ou e-mail. Atendimento jurídico presencial em Volta Redonda e região e online em todo o Brasil.',
  } : route === '/politica-de-privacidade' ? {
    title: 'Política de Privacidade | Delano Furtado', description: 'Saiba como o site Delano Furtado utiliza dados de navegação, análise opcional e canais de contato, e como gerenciar suas preferências.',
  } : route === '/politica-de-cookies' ? {
    title: 'Política de Cookies | Delano Furtado', description: 'Entenda os cookies de análise e o armazenamento das preferências do site Delano Furtado. Saiba como aceitar, recusar ou retirar sua autorização.',
  } : { title: 'Página não encontrada | Delano Furtado', description: 'O endereço solicitado não está disponível. Conheça a atuação de Delano Furtado ou entre em contato.' }
  return { ...content, canonical: `${publicOrigin}${route === '/' ? '/' : route ?? '/404'}`, image: `${publicOrigin}/media/social-delano.png`, noindex: !route }
}
export const structuredData = {
  '@context': 'https://schema.org', '@type': 'LegalService', '@id': `${publicOrigin}/#escritorio`,
  name: siteData.name, url: publicOrigin, image: `${publicOrigin}/media/delano-800.webp`,
  telephone: `+${siteData.phoneInternational}`, email: siteData.email,
  address: { '@type': 'PostalAddress', streetAddress: siteData.addressLine, addressLocality: 'Volta Redonda', addressRegion: 'RJ', postalCode: '27260-100', addressCountry: 'BR' },
  areaServed: ['Rio de Janeiro', 'Brasil'], sameAs: [siteData.instagramUrl, siteData.facebookUrl],
}
export function renderSeoHead(seo: SeoMetadata): string {
  const escape = (value: string) => value.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]!)
  const meta = (name: string, value: string, property = false) => `<meta data-site-seo ${property ? 'property' : 'name'}="${name}" content="${escape(value)}">`
  return `<title data-site-seo>${escape(seo.title)}</title>\n` +
    meta('description', seo.description) + meta('robots', seo.noindex ? 'noindex,follow' : 'index,follow') +
    `<link data-site-seo rel="canonical" href="${escape(seo.canonical)}">` +
    meta('og:type', 'website', true) + meta('og:locale', 'pt_BR', true) + meta('og:title', seo.title, true) +
    meta('og:description', seo.description, true) + meta('og:url', seo.canonical, true) + meta('og:image', seo.image, true) +
    meta('twitter:card', 'summary_large_image') + meta('twitter:title', seo.title) + meta('twitter:description', seo.description) + meta('twitter:image', seo.image) +
    (seo.noindex ? '' : `<script data-site-seo type="application/ld+json">${JSON.stringify(structuredData).replace(/</g, '\\u003c')}</script>`)
}
