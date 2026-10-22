# Cascata nas áreas de atuação

Data: 22 de outubro de 2026. Solicitação: suavizar a abertura das áreas de atuação com entrada dos itens em cascata.

## Implementação

- `src/components/brand/ServiceDisclosure.tsx`: disclosure compartilhado pelos cards e pela assessoria mensal, preservando o HTML nativo.
- `src/hooks/useDisclosureMotion.ts`: expansão, fechamento, cascata local, interrupção e fallback de movimento reduzido.
- `src/motion/siteMotion.ts`: refresh coordenado após a expansão ou o fechamento.
- `src/components/brand/ServiceCard.tsx` e `src/pages/Home/sections/ServicesSection.tsx`: integração sem alterar o conteúdo das áreas.

O contrato de duração, acessibilidade e descarte está em [Movimento e GSAP](../movimento-e-gsap.md#cascata-nas-áreas-de-atuação).

## Validação automatizada

Os novos testes falharam contra a alternância original: três falhas e um caso aprovado, demonstrando ausência da animação e fechamento imediato. Após a implementação, a suíte completa passou: **37 testes em 12 arquivos**.

`ServiceDisclosure.test.tsx` executa GSAP real e cobre fechamento ao concluir a animação, foco preservado, escopo por card, reabertura rápida, remoção de estilos, preferência por movimento reduzido, mudança dessa preferência durante o fechamento e desmontagem em StrictMode.

Também aprovados: `npm run lint`, `npm run build` e `npm run verify:build`. O build conserva a geração de HTML por rota.

## Validação no navegador

Preview de produção em localhost, viewport observado de **320 × 844**:

- Abertura e fechamento pelo teclado; o painel permaneceu aberto durante a retração e fechou ao concluir.
- Direito Imobiliário expandiu até a altura natural de 555,69 px, com altura inline removida e todos os itens visíveis ao final.
- Quatro amostras consecutivas durante a abertura registraram alturas de 2, 12, 41 e 91 px. A opacidade do primeiro item evoluiu de 0,45 para 0,82 enquanto a do último ainda era 0,45, confirmando a cascata. [Amostras](areas-cascata-frames.json).
- Assessoria mensal também animou a expansão e o parágrafo, concluindo com opacidade 1 e altura inline removida.
- Sem overflow horizontal observado. Nenhum aviso ou erro de console atribuído ao bundle desta alteração.

O fallback de movimento reduzido foi validado pelos testes automatizados; a preferência do sistema não foi emulada neste navegador. A inspeção visual desta alteração foi feita no viewport mobile acima.

![Área de Direito Imobiliário expandida](capturas/areas-cascata-mobile.jpg)
