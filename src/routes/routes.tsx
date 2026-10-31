import { Routes, Route, useLocation } from 'react-router-dom'
import { resolvePublicRoute } from './routeManifest'
import { SiteLayout } from '@/components/SiteLayout'
import Home from '@/pages/Home'
import Location from '@/pages/Location'
import Contact from '@/pages/Contact'
import NotFound from '@/pages/NotFound'
import Privacy from '@/pages/Privacy'
import Cookies from '@/pages/Cookies'

export function AppRoutes() {
  const location = useLocation()
  const pathname = resolvePublicRoute(location.pathname) ?? location.pathname
  return <SiteLayout><Routes location={{ ...location, pathname }}><Route caseSensitive path="/" element={<Home />} /><Route caseSensitive path="/localizacao" element={<Location />} /><Route caseSensitive path="/contate-nos" element={<Contact />} /><Route caseSensitive path="/politica-de-privacidade" element={<Privacy />} /><Route caseSensitive path="/politica-de-cookies" element={<Cookies />} /><Route path="*" element={<NotFound />} /></Routes></SiteLayout>
}
