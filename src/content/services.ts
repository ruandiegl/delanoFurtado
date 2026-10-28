export type ServiceId = 'familia' | 'consumidor' | 'imobiliario' | 'contratual' | 'sucessoes' | 'civil' | 'assessoria-mensal'
export type Service = {
  id: ServiceId
  title: string
  summary: string
  items: readonly string[]
  sourceSection: string
}

export const services: readonly Service[] = [
  {
    id: 'familia', title: 'Direito de Família',
    summary: 'Orientação jurídica para as decisões que envolvem a família, suas relações e seu patrimônio.',
    sourceSection: '4.4 — Direito de Família',
    items: [
      'Fixação, Revisão e Exoneração de Pensão Alimentícia', 'Divórcio (Litigioso ou Consensual)',
      'Partilha de Bens', 'Guarda, Fixação de Residência e Regulamentação de Visitas dos Filhos',
      'Tutela e Curatela', 'Reconhecimento e Dissolução de União Estável',
      'Reconhecimento de Paternidade (Biológica ou Sócioafetiva)', 'Ação Negatória de Paternidade',
      'Medidas Protetivas com Base na Lei Maria da Penha',
    ],
  },
  {
    id: 'consumidor', title: 'Direito do Consumidor',
    summary: 'Atuação em conflitos de consumo, cobranças indevidas e falhas na prestação de serviços.',
    sourceSection: '4.4 — Direito do Consumidor; docs/rotas-e-conteudo.md (atualização editorial de 27/10/2026)',
    items: [
      'Cobranças indevidas e negativação indevida no SPC/Serasa e Registrato',
      'Atrasos ou falhas na entrega de produtos e serviços', 'Cláusulas abusivas em contratos de adesão',
      'Cancelamentos não realizados e estornos negados',
      'Problemas com bancos, operadoras de telefonia, planos de saúde e concessionárias de água e energia elétrica',
      'Negativas indevidas de cobertura e de pagamento de indenizações por seguradoras, incluindo seguros de veículos, imóveis, vida, saúde e outras modalidades',
      'Problemas com companhias aéreas e agências de turismo, incluindo cancelamentos e atrasos de voos, extravio de bagagens, negativa de reembolso, descumprimento de pacotes turísticos e falhas na prestação de serviços',
    ],
  },
  {
    id: 'imobiliario', title: 'Direito Imobiliário',
    summary: 'Assessoria para questões de propriedade, posse, locação e regularização de imóveis.',
    sourceSection: '4.4 — Direito Imobiliário',
    items: [
      'Usucapião', 'Adjudicação Compulsória', 'Ação de Despejo', 'Manutenção e Reintegração de Posse',
      'Revisão e Arbitramento de Aluguel', 'Ação Renovatória de Contrato de Locação',
      'Divisão e Demarcação de Terras Particulares', 'Retificação de Área', 'Embargos de Terceiro',
      'Extinção de Condomínio', 'Retificação de Registros e Averbações', 'Interdito Proibitório',
      'Nunciação de Obra Nova',
    ],
  },
  {
    id: 'contratual', title: 'Direito Contratual',
    summary: 'Elaboração, revisão e gestão de contratos, com foco em segurança jurídica e prevenção de litígios.',
    sourceSection: '4.4 — Direito Contratual',
    items: [
      'Contratos personalizados e adequados à legislação', 'Revisão de cláusulas e redução de riscos',
      'Suporte em negociações e acordos comerciais', 'Consultoria em contratos imobiliários e de prestação de serviços',
      'Monitoramento de prazos e obrigações contratuais', 'Atuação em conflitos e descumprimentos contratuais',
      'Atendimento a diversos setores, como saúde, tecnologia, construção e varejo',
    ],
  },
  {
    id: 'sucessoes', title: 'Direito das Sucessões',
    summary: 'Assessoria em inventários e planejamento sucessório, com atenção ao patrimônio e às relações familiares.',
    sourceSection: '4.4 — Direito das Sucessões',
    items: [
      'Inventário judicial e extrajudicial com assessoria completa', 'Planejamento sucessório e elaboração de testamentos',
      'Avaliação de bens e sobrepartilha patrimonial', 'Mediação entre herdeiros e acordos familiares',
      'Solicitação de alvarás e liberação de valores', 'Conversão de inventário judicial em extrajudicial',
    ],
  },
  {
    id: 'civil', title: 'Direito Civil',
    summary: 'Atuação em responsabilidade civil, indenizações, obrigações e conflitos entre particulares.',
    sourceSection: '4.4 — Direito Civil',
    items: [
      'Indenizações por Danos Materiais e Morais', 'Responsabilidade Civil Contratual e Extracontratual',
      'Direito das Obrigações', 'Direito de Vizinhança', 'Litígios sobre Propriedades',
    ],
  },
  {
    id: 'assessoria-mensal', title: 'Assessoria jurídica mensal',
    summary: 'Suporte contínuo e personalizado para empresas e pessoas físicas, com consultoria, contratos e acompanhamento de demandas.',
    sourceSection: '4.4 — Serviço Jurídico Mensal para Empresas e Pessoas Físicas',
    items: [
      'Nosso serviço jurídico mensal oferece suporte completo e personalizado para empresas e pessoas físicas. Com ele, você garante assessoria jurídica contínua para enfrentar questões legais do dia a dia, prevenindo litígios e agilizando processos. O serviço inclui consultoria, elaboração de contratos, análise de riscos, acompanhamento de demandas judiciais e extrajudiciais, além de orientações estratégicas para a proteção de seus direitos.',
      'Ideal para quem busca segurança jurídica e tranquilidade em suas decisões.',
    ],
  },
]
