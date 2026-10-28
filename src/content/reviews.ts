export interface GoogleReviewItem {
  id: string
  author: string
  initials: string
  roleOrBadge: string
  rating: 5
  text: string
}

export const googleReviewsMeta = {
  ratingDisplay: '5,0',
  sourceLabel: 'Avaliações reais no Google Maps',
  mapsPlaceUrl:
    'https://www.google.com/maps/place//@-22.518601,-44.1046602,17z/data=!3m1!4b1!4m3!3m2!1s0x9e99fc2d9fe615:0x119797af8c4f7077!12e1',
} as const

export const googleReviews: readonly GoogleReviewItem[] = [
  {
    id: 'marcelo-barros',
    author: 'Marcelo Barros',
    initials: 'MB',
    roleOrBadge: 'Avaliação no Google',
    rating: 5,
    text: 'Excelente profissional! Muito atencioso, didático e extremamente competente. Explicou todo o processo de forma clara e objetiva, esclarecendo todas as minhas dúvidas com muita paciência. Atendimento de altíssima qualidade. Recomendo com total confiança!',
  },
  {
    id: 'jessica-lopes',
    author: 'Jéssica Lopes',
    initials: 'JL',
    roleOrBadge: 'Avaliação no Google',
    rating: 5,
    text: 'Na condição de advogada, recorri aos serviços do Dr. Delano para uma demanda em área jurídica não abrangida pelo meu escritório. Fui muito bem atendida, e os serviços foram prestados com excelência técnica, agilidade e competência. Recomendo sua atuação profissional.',
  },
  {
    id: 'higor-siqueira',
    author: 'Higor Siqueira',
    initials: 'HS',
    roleOrBadge: 'Avaliação no Google',
    rating: 5,
    text: 'Excelente profissional! Muito prestativo me atendendo no final de semana e no atendimento presencial tirando minhas dúvidas de forma clara e positiva.',
  },
  {
    id: 'rodrigo-fernandes-ribeiro',
    author: 'Rodrigo Fernandes Ribeiro',
    initials: 'RF',
    roleOrBadge: 'Avaliação no Google',
    rating: 5,
    text: 'Excelente atendimento, rápido, me atendeu no mesmo momento que enviei minha dúvida e seguimos juntos na resolução dos problemas que tínhamos.',
  },
  {
    id: 'esley-silva',
    author: 'Esley Silva',
    initials: 'ES',
    roleOrBadge: 'Avaliação no Google',
    rating: 5,
    text: 'Excelente atendimento, valor justo e dedicação total pela causa para o melhor resultado para o cliente.',
  },
  {
    id: 'vanessa-pontes',
    author: 'Vanessa Pontes',
    initials: 'VP',
    roleOrBadge: 'Avaliação no Google',
    rating: 5,
    text: 'Excelente atendimento, muito esclarecedor e competente.',
  },
  {
    id: 'joyce-labio-de-mattos',
    author: 'Joyce Labio de Mattos',
    initials: 'JM',
    roleOrBadge: 'Avaliação no Google',
    rating: 5,
    text: 'Realizei uma consulta com Dr. Delano Furtado e fui bem atendida nas minhas dúvidas.',
  },
] as const

export function wrapCarouselOffset(offset: number, singleSetWidth: number): number {
  if (singleSetWidth <= 0) return offset
  const rel = (((-offset - singleSetWidth) % singleSetWidth) + singleSetWidth) % singleSetWidth
  return -singleSetWidth - rel
}
