export const media = {
  logo: { src: '/media/logo-delano.png', width: 1200, height: 400, alt: 'Delano Furtado — advocacia e consultoria' },
  portrait: {
    src: '/media/delano-800.webp',
    srcSet: '/media/delano-480.webp 480w, /media/delano-800.webp 800w, /media/delano-1200.webp 1200w',
    width: 800, height: 1201, alt: 'Delano Santos Furtado, advogado',
  },
  monogram: { src: '/media/monograma-df.png', width: 240, height: 240 },
  social: { src: '/media/social-delano.png', width: 1200, height: 630 },
  google: { src: '/media/google-maps.png', width: 96, height: 96 },
  justice: { src: '/media/justica.webp', width: 512, height: 342, alt: 'Escultura simbólica da Justiça' },
  source: 'docs/assets/delano-furtado/manifesto.json',
} as const
