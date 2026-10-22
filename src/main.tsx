import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { registerClientMotion } from './motion/gsap'
import './styles/shadcn.css'

registerClientMotion()
const root = document.getElementById('root')!
const app = <StrictMode><BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><App /></BrowserRouter></StrictMode>
if (root.children.length) hydrateRoot(root, app)
else createRoot(root).render(app)
