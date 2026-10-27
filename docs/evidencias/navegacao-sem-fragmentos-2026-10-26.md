# Navegação entre seções sem fragmentos — 26/10/2026

## Pedido e resultado

O usuário confirmou que Áreas de atuação e Sobre devem continuar como blocos da Home, com a URL sem `#nome`. A mesma navegação foi aplicada ao link da Hero e ao contato do rodapé. Não foram criadas novas páginas nem alterados canonical, sitemap, conteúdo ou layout por esta tarefa.

`SectionLink` aponta para `/` e informa `scrollTarget` no estado do Router. `RouteEffects` aceita somente os destinos conhecidos, mantém a restauração por entrada do histórico e encaminha rolagem/foco ao bloco. O helper posiciona o foco antes de iniciar a rolagem suave, permitindo que a melhoria de movimento finalize a apresentação do título antes da rolagem. Preferência de movimento reduzido usa o comportamento imediato.

A inspeção real identificou refresh de ScrollTrigger imediatamente depois do pedido de rolagem ao remontar a Home. A navegação aguarda o layout em dois frames, e o refresh coordenado passou a usar `ScrollTrigger.refresh(true)`, que evita interromper uma rolagem em andamento. Consulta confirmada no Context7, conforme a [documentação oficial do modo seguro](https://gsap.com/docs/v3/Plugins/ScrollTrigger/refresh%28%29). A instrumentação temporária foi removida antes dos checks finais.

Links antigos com fragmentos são normalizados no cliente com substituição da entrada, preservando query e destino conhecido. O skip link mantém seu fallback nativo no HTML; durante uso com JavaScript, evita a navegação do fragmento e move foco/rolagem sem alterar o endereço.

## Arquivos do incremento

- `src/routes/sectionNavigation.ts`: destinos permitidos e leitura validada do estado.
- `src/components/brand/SectionLink.tsx`: link de seção com href estável entre HTML inicial e cliente.
- `src/lib/scrollToSection.ts`: rolagem e foco compartilhados.
- Header, MobileMenu, Footer, Hero e SiteLayout: consumidores da navegação.
- `RouteEffects.tsx`: normalização de fragmentos e integração com o histórico.
- `siteMotion.ts` e seu teste: refresh seguro depois das alterações de layout/mídia, preservando o descarte local.
- Testes de navegação, efeitos de rota e hidratação: contrato e regressões.
- `scripts/verify-preview.mjs`: normalização do texto do H1 antes da comparação. A Hero já possuía spans/comentários React que faziam esse verificador comparar marcação com texto; os checks de status, canonical, CSS e 404 foram mantidos.

Alterações anteriores em conteúdo UniFOA, planos e outras guidelines foram preservadas.

## Verificação executada

| Verificação | Resultado |
| --- | --- |
| Testes primeiro | Falhas observadas para os novos destinos e rolagem antes da implementação |
| `npm run test:run` final | **59 testes aprovados em 13 arquivos** |
| `npm run lint` final | Aprovado |
| `npm run build` | TypeScript, cliente, servidor e prerender aprovados |
| `npm run verify:build` | Quatro HTMLs distintos, canonical/CSS, conteúdo de serviços, assets, sitemap e robots aprovados |
| `npm run verify:preview -- http://127.0.0.1:4173` | **11 documentos e 3 redirecionamentos canônicos aprovados** |
| Hidratação | Rotas originais, aliases de caixa/`index.html` e URLs com query sem divergências |
| Histórico | Voltar/avançar e posição de leitura testados, inclusive após navegação a uma seção com URL limpa |
| Acessibilidade | Foco no título, skip link sem fragmento durante uso e movimento reduzido cobertos pelos testes |

## Navegador

Prévia local de produção em **1280 × 720**, no navegador integrado:

- Menu Áreas de atuação: URL `/`, foco no título da seção e bloco visível.
- Localização → Sobre: volta à Home com URL `/` e foco no título de Sobre.
- `/?utm_source=teste#areas`: URL normalizada para `/?utm_source=teste`, mantendo o destino.
- Posição final de Sobre conferida após a rolagem, considerando scroll padding e margem da seção.
- Nenhum erro retornado na consulta de logs da aba de teste.

Menu móvel foi coberto por teste de abertura, destinos e fechamento/foco; esta inspeção no navegador foi desktop. O servidor e a aba temporários foram utilizados somente para validação local. Não houve commit, push, deploy ou alteração de DNS nesta tarefa.

## Limites do endereço limpo

Copiar o link ou abri-lo em outra aba leva à Home, sem codificar uma seção no endereço. Sem JavaScript, o conteúdo completo permanece no HTML; os links antigos e o skip link conservam o comportamento nativo de fragmentos. A regra atual está em [Rotas e conteúdo](../rotas-e-conteudo.md).
