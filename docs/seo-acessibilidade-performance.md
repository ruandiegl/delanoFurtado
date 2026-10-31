# SEO, acessibilidade e performance

## SEO e migração

O domínio publicado e os dados da marca estão no [documento 02](02-conteudo-site-delano-furtado.md). Preservar `/`, `/localizacao` e `/contate-nos`; alterações de URL exigem mapa de redirecionamentos na hospedagem.

Cada página deve ter título e descrição próprios, canonical consistente, idioma pt-BR e conteúdo principal sem duplicações artificiais de cidades ou serviços. Identificação profissional, endereço e contatos precisam concordar entre UI, metadados e dados estruturados.

O MVP gera HTML/CSS por rota no build, com title, description, canonical, Open Graph, Twitter e LegalService JSON-LD factual. O [plan-001](../plans/plan-001-mvp-landing-page-delano-furtado.md) registra o contrato; [mvp-001](evidencias/mvp-001.md) registra testes Node/hidratação/browser. RouteSeo atualiza o head ao navegar e mantém um canonical; o HTML de acesso direto já traz o conteúdo. O 404 usa noindex e não entra no sitemap.

O aceite verifica a resposta HTML das três URLs, títulos, canonical, resumo e conteúdo principal. Se houver troca por SSR ou outra estratégia, registrar a decisão e a equivalência de resultado antes de publicar. Sitemap inclui somente URLs canônicas existentes; robots de produção e de preview devem ter finalidades distintas.

Uma tela React de não encontrado não prova status HTTP 404. O provedor precisa servir corretamente URLs desconhecidas e evitar uma experiência em que qualquer caminho pareça uma página válida.

Dados estruturados descrevem somente fatos confirmados. Não preencher `aggregateRating`, depoimentos, horário, geolocalização ou títulos profissionais a partir de suposição. A imagem social tem derivado próprio e dimensões reais, sem repetir a inconsistência coletada no site antigo.

### Favicon nos resultados da busca

O head inicial compartilhado aponta para `/media/favicon-96.png`, quadrado e com o monograma DF da marca atual. Há ícone Apple de 180px e `/favicon.ico` com múltiplas dimensões. O build confere os PNGs e o ICO, e o pacote FTP inclui o arquivo da raiz. Manter as URLs estáveis e rastreáveis, sem bloqueio no robots. A troca no Google depende do novo rastreamento da Home/ícone; solicitar inspeção/indexação da Home no Search Console após publicar pode ajudar a descoberta, sem garantir exibição ou prazo. O Google informa que o processamento pode levar dias a semanas. [Documentação oficial](https://developers.google.com/search/docs/appearance/favicon-in-search?hl=pt-br).

Em 28/10/2026, a auditoria pública confirmou os metadados novos nas três páginas atuais e os redirects dos aliases `.html`. A galeria legada continua retornando HTML antigo. O [procedimento de atualização dos resultados](atualizacao-indexacao-google.md) registra evidências, inspeção/indexação no Search Console e a migração ainda necessária da galeria para atender ao pedido de preservar resultados com a identidade nova. A conferência HTTP não comprova o estado do índice do Google.

## Acessibilidade

Meta de projeto: **WCAG 2.2 nível AA**, a ser avaliada por critérios pertinentes, testes automáticos e inspeção manual. Esta é uma meta de engenharia, não uma certificação. A referência normativa é a [visão geral WCAG do W3C](https://www.w3.org/WAI/standards-guidelines/wcag/).

Manter um título principal por página, landmarks, ordem de cabeçalhos e link para o conteúdo. Interações usam elementos semânticos, nomes acessíveis e foco visível. Menu e overlay preservam a navegação por teclado e restauram o foco ao fechar. Labels e mensagens de erro ficam associados aos controles.

Medir contraste em todos os estados; não comunicar estado apenas por cor. Retratos e logos têm alt contextual e decoração tem alt vazio. Conferir zoom, reflow, telas estreitas e movimento reduzido. Como padrão de conforto do projeto, buscar áreas de toque de 44 px, avaliando exceções de layout. Uma animação desativada mantém informação e acesso completos.

## Performance

Metas de campo, no percentil 75 e separadas por mobile/desktop: **LCP ≤ 2,5 s; INP ≤ 200 ms; CLS ≤ 0,1**. São os limiares indicados em [Web Vitals, web.dev](https://web.dev/articles/vitals). Um relatório Lighthouse de laboratório não substitui dados reais de INP ou de uso.

Práticas do projeto:

- Derivados responsivos das imagens originais e dimensões reservadas.
- Hero priorizado; lazy loading para mídia abaixo da dobra.
- Fontes com pesos necessários e estratégia de fallback que preserve legibilidade.
- Carregamento de mapa e recursos de terceiros proporcional à necessidade.
- Código de movimento e páginas com separação de chunks quando a medição justificar.
- Ausência de tarefas longas recorrentes geradas por scroll, filtros ou renderizações.

Antes da publicação, registrar medições no build de produção, rota, viewport, condições de teste e ferramenta. As medições locais do MVP constam nas [evidências](evidencias/mvp-001.md). Depois da publicação, usar dados de campo quando disponíveis; os registros locais não substituem essas métricas.
