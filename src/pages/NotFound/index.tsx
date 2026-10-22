import { Link } from 'react-router-dom'
import { Container, SmallLabel } from '@/styles/primitives'
import { PageSection } from '@/styles/pageStyles'
import { ContactCta } from '@/components/brand/ContactCta'
export default function NotFound() { return <PageSection><Container><SmallLabel>Erro 404</SmallLabel><h1 tabIndex={-1}>Página não encontrada</h1><p className="page-intro">O endereço que você acessou não está disponível. Volte ao início para conhecer a atuação ou entre em contato.</p><div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, alignItems: 'center' }}><Link className="return-link" to="/">Voltar ao início</Link><ContactCta label="Fale comigo" /></div></Container></PageSection> }
