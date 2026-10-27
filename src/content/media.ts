export const media = {
  logo: { src: '/media/logo-delano.png', width: 1200, height: 400, alt: 'Delano Furtado — advocacia e consultoria' },
  heroPortrait: {
    src: '/media/delano-hero-686.webp',
    srcSet: '/media/delano-hero-480.webp 480w, /media/delano-hero-686.webp 686w, /media/delano-hero-1024.webp 1024w',
    width: 686, height: 780, alt: 'Delano Santos Furtado, advogado',
  },
  heroBackdrop: {
    src: '/media/hero-office-bg.webp',
    width: 1440, height: 804, alt: '',
  },
  portrait: {
    src: '/media/delano-sobre-800.webp',
    srcSet: '/media/delano-sobre-480.webp 480w, /media/delano-sobre-800.webp 800w, /media/delano-sobre-1200.webp 1200w',
    width: 800, height: 1201, alt: 'Delano Santos Furtado, advogado',
  },
  monogram: { src: '/media/monograma-df.png', width: 240, height: 240 },
  social: { src: '/media/social-delano.png', width: 1200, height: 630 },
  google: { src: '/media/google-maps.png', width: 96, height: 96 },
  justice: { src: '/media/justica.webp', width: 512, height: 342, alt: 'Escultura simbólica da Justiça' },
  source: 'docs/assets/delano-furtado/manifesto.json',
} as const
