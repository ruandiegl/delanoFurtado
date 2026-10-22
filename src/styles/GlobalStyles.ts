import { createGlobalStyle } from 'styled-components'

export const GlobalStyles = createGlobalStyle`
  *, *::before, *::after { box-sizing: border-box; }
  html { scroll-behavior: smooth; scroll-padding-top: 112px; }
  body { margin: 0; color: var(--foreground); background: var(--background); font-family: var(--brand-font); -webkit-font-smoothing: antialiased; }
  body { font-size: 16px; line-height: 1.65; }
  h1, h2, h3, p { margin: 0; }
  h1, h2, h3 { line-height: 1.2; text-wrap: balance; }
  @layer base { a { color: inherit; text-decoration: none; } }
  button, a, summary { -webkit-tap-highlight-color: transparent; }
  button, summary { cursor: pointer; }
  img { display: block; max-width: 100%; }
  :focus-visible { outline: 2px solid var(--ring); outline-offset: 5px; }
  :focus:not(:focus-visible) { outline: none; }
  ::selection { background: #d7e2d9; color: var(--primary); }
  .skip-link { position: fixed; top: 12px; left: 12px; z-index: 100; padding: 12px 20px; background: white; transform: translateY(-160%); border: 1px solid var(--primary); }
  .skip-link:focus { transform: none; }
  @media (prefers-reduced-motion: reduce) {
    html { scroll-behavior: auto; }
    *, *::before, *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; }
  }
`
