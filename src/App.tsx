import { GlobalStyles } from '@/styles/GlobalStyles'
import { AppRoutes } from '@/routes/routes'
import { ConsentProvider } from '@/consent/ConsentProvider'
import { ConsentControls } from '@/consent/ConsentControls'
import { AnalyticsBridge } from '@/analytics/AnalyticsBridge'

export default function App() { return <ConsentProvider><GlobalStyles /><AnalyticsBridge /><AppRoutes /><ConsentControls /></ConsentProvider> }
