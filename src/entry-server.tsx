import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import { ServerStyleSheet } from 'styled-components'
import { getSeo, type SeoMetadata } from './content/seo'
import App from './App'
export function renderPage(pathname: string): { html: string; styleTags: string; seo: SeoMetadata } {
  const sheet = new ServerStyleSheet()
  try {
    const html = renderToString(sheet.collectStyles(<StaticRouter location={pathname}><App /></StaticRouter>))
    return { html, styleTags: sheet.getStyleTags(), seo: getSeo(pathname) }
  } finally { sheet.seal() }
}
export { getSeo, renderSeoHead, publicOrigin } from './content/seo'
export { publicRoutes } from './routes/routeManifest'
export { services } from './content/services'
export { siteData } from './content/siteData'
