import { Routes, Route } from 'react-router-dom'
import { SiteLayout } from '@/components/SiteLayout'
import Home from '@/pages/Home'
import Location from '@/pages/Location'
import Contact from '@/pages/Contact'
import NotFound from '@/pages/NotFound'

export function AppRoutes() {
  return <SiteLayout><Routes><Route caseSensitive path="/" element={<Home />} /><Route caseSensitive path="/localizacao" element={<Location />} /><Route caseSensitive path="/contate-nos" element={<Contact />} /><Route path="*" element={<NotFound />} /></Routes></SiteLayout>
}
