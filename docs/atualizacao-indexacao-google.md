# Atualizar a apresentação dos resultados no Google

Conferência em **28/10/2026**. Objetivo do responsável: manter os resultados existentes, com a identidade, os textos e as páginas do site novo. Esta etapa preserva os endereços úteis e solicita novo rastreamento; não promete manutenção de posições ou reprodução exata de títulos, descrições e links adicionais.

## Estado público observado

[Auditoria HTTP de páginas, aliases, robots e sitemap](evidencias/indexacao-http-2026-10-28.json).

| Endereço | Resposta e conteúdo |
| --- | --- |
| `/` | 200, HTML novo, título `Delano Furtado \| Advogado em Volta Redonda`, descrição atual, canonical próprio e `index,follow` |
| `/localizacao` | 200, HTML novo, título e descrição próprios, canonical próprio e `index,follow` |
| `/contate-nos` | 200, HTML novo, título e descrição próprios, canonical próprio e `index,follow` |
| `/localizacao.html` e `/contate-nos.html` | 308 para as páginas atuais correspondentes, que retornam 200 |
| `/galeria` e `/galeria.html` | 200 com título e descrição antigos; sem canonical ou referência de favicon identificados pelo extrator. Esta é uma página legada preservada para compatibilidade, conforme o guia FTP |
| `/robots.txt` | 200, permite rastreamento e aponta para o sitemap |
| `/sitemap.xml` | 200, lista Home, localização e contato canônicos |

As três páginas novas referenciam `/media/favicon-96.png` e o ícone Apple de 180px. A conferência pública de favicons feita nesta sessão confirmou PNG 96 e ICO acessíveis, com MIME correto e hashes iguais aos arquivos atuais da marca.

O comando `npm.cmd run verify:preview -- https://www.delanofurtado.adv.br` também passou: **11 documentos e três redirects**, incluindo as páginas canônicas sem barra, aliases, HTML inicial e 404 reais.

Esses testes HTTP comprovam o conteúdo entregue agora pelo servidor. O estado armazenado no índice, a data do último rastreamento e a seleção de canonical pelo Google dependem da inspeção no Search Console. O agente não acessou essa conta nesta conferência.

## Procedimento no Search Console

1. Abrir o [Google Search Console](https://search.google.com/search-console/) com uma conta autorizada para a propriedade do domínio ou do prefixo `https://www.delanofurtado.adv.br/`. Acesso ao Analytics/Ads, sozinho, não comprova permissão no Search Console. Para solicitar indexação, é necessário ser proprietário ou usuário com acesso total.
2. Usar **Inspeção de URL**, na barra superior, para a Home. Conferir a data do último rastreamento, a permissão de indexação e o canonical selecionado pelo Google na versão indexada.
3. Escolher **Testar URL publicada**. Quando disponível, abrir **Ver a página testada → HTML** e confirmar título, descrição, conteúdo novo e referência `/media/favicon-96.png`. Esse teste mostra a versão atual, não prova atualização do índice.
4. Com a página disponível para o Google e sem impedimento técnico, clicar em **Solicitar indexação**. A solicitação não remove o resultado existente nem garante inclusão, posição ou prazo.
5. Repetir para [Localização](https://www.delanofurtado.adv.br/localizacao) e [Contato](https://www.delanofurtado.adv.br/contate-nos). Priorizar as URLs canônicas; os aliases antigos já encaminham para elas.
6. Em **Sitemaps**, conferir o endereço [sitemap.xml](https://www.delanofurtado.adv.br/sitemap.xml) e seu processamento. Se ainda não estiver cadastrado, enviá-lo com as permissões necessárias. Não é necessário enviar repetidamente o mesmo sitemap inalterado; a localização também já consta no robots.
7. No relatório de desempenho por páginas e na indexação, levantar as URLs antigas que ainda recebem impressões/cliques. A pesquisa pública `site:` não fornece um inventário completo do índice.
8. Acompanhar a data de rastreamento e a apresentação nas semanas seguintes. Repetir a solicitação várias vezes para a mesma URL não acelera o processo.

## Galeria: pendência concreta de migração

A galeria antiga ainda é entregue pelo servidor. Solicitar novo rastreamento dela agora continua expondo seus textos e sua implementação antigos. Para que esse resultado também receba a identidade nova, migrar seu conteúdo útil para uma página equivalente no frontend atual, mantendo `/galeria` e tratando `/galeria.html` com redirect permanente correspondente. Preservar os arquivos legados necessários até que a substituição esteja preparada, validada e publicada; os anúncios podem usar esse destino.

A auditoria não incluiu a implementação dessa página nem alterou seu destino. Sua migração exige inventário do conteúdo, referências de campanhas, implementação e validação próprios. Um redirecionamento genérico para a Home não substitui uma galeria equivalente e não deve ser usado apenas para ocultar o legado.

## Expectativa sobre favicon e textos

- O favicon orgânico depende de novo rastreamento da Home e do arquivo. O Google informa dias a semanas, sem garantir exibição. Manter o endereço do ícone estável e acessível.
- O título pode ser gerado a partir de `<title>`, títulos visíveis e outros sinais. A descrição pode usar a meta description ou trechos da própria página, conforme a busca. Um trecho diferente da descrição cadastrada, por si só, não prova conteúdo antigo.
- Nome e logo em anúncio patrocinado são recursos separados do Google Ads. Este procedimento trata da busca orgânica.
- Manter as URLs e informações úteis favorece a continuidade; os resultados e as posições são decididos pelos sistemas do Google.

## Fontes primárias

- [Solicitar novo rastreamento](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl?hl=pt-br).
- [Inspeção de URL](https://support.google.com/webmasters/answer/9012289?hl=pt-BR).
- [Gerenciar sitemaps](https://support.google.com/webmasters/answer/7451001?hl=pt-BR).
- [Favicon orgânico](https://developers.google.com/search/docs/appearance/favicon-in-search?hl=pt-br).
- [Títulos nos resultados](https://developers.google.com/search/docs/appearance/title-link?hl=pt-br).
- [Descrições e snippets](https://developers.google.com/search/docs/appearance/snippet?hl=pt-br).

Trabalho realizado: auditoria pública e documentação. Nenhum código do site, arquivo remoto, configuração de conta, solicitação de indexação ou pacote FTP foi alterado nesta etapa.
