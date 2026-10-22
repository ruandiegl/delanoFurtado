import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu } from 'lucide-react'
import styled from 'styled-components'
import { Button } from '@/components/ui/button'
import { Sheet, SheetTrigger, SheetContent, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { ContactCta } from '@/components/brand/ContactCta'

const Nav = styled.nav`
  display: flex; flex-direction: column; gap: 8px; padding-block: 24px;
  a { padding-block: 13px; font-size: 19px; border-bottom: 1px solid var(--border); }
`
export function MobileMenu() {
  const [open, setOpen] = useState(false)
  return <Sheet open={open} onOpenChange={setOpen}>
    <SheetTrigger render={<Button size="touch" variant="ghost" aria-label="Abrir menu" />}><Menu data-icon="inline-start" /></SheetTrigger>
    <SheetContent className="overflow-y-auto p-7">
      <SheetTitle>Navegação</SheetTitle>
      <SheetDescription>Conheça a atuação e os canais de contato.</SheetDescription>
      <Nav aria-label="Menu principal">
        <Link to="/" onClick={() => setOpen(false)}>Início</Link>
        <Link to="/#areas" onClick={() => setOpen(false)}>Áreas de atuação</Link>
        <Link to="/#sobre" onClick={() => setOpen(false)}>Sobre</Link>
        <Link to="/localizacao" onClick={() => setOpen(false)}>Localização</Link>
        <Link to="/contate-nos" onClick={() => setOpen(false)}>Contate-nos</Link>
      </Nav>
      <ContactCta label="Fale comigo" />
    </SheetContent>
  </Sheet>
}
