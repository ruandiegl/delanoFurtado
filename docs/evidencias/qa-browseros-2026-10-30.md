# QA do site publicado — 30/10/2026

## Resultado

Auditoria executada em **https://www.delanofurtado.adv.br**, pelo **BrowserOS neo conectado via MCP**, assumindo o perfil [QA Engineer](../../agents/qa-engineer.md). Foram confirmadas três pendências: uma de consentimento na aplicação legada, uma de acessibilidade no carrossel e uma diferença entre a versão publicada e o último ajuste local.

Não houve alteração no código da aplicação, commit, envio por FTP ou publicação. Os arquivos existentes e as abas do usuário foram preservados. O diagnóstico trata a produção observada; a implementação local pendente não foi considerada automaticamente publicada.

## Achados por prioridade

| ID | Prioridade | Achado | Impacto |
| --- | --- | --- | --- |
| QA-01 | P1 — alta | A galeria legada carrega Analytics mesmo com a preferência rejeitada | A escolha feita nas páginas novas não vale em todo o domínio |
| QA-02 | P2 — média | O carrossel não oferece pausa ou navegação por controles de teclado | Dificulta a leitura e o acesso visual a todas as avaliações, especialmente com movimento reduzido |
| QA-03 | P3 — baixa | O último ajuste de tamanho/posição do aviso de cookies ainda não está publicado | A apresentação ao vivo difere do ajuste solicitado e do pacote mais recente |

### QA-01 — Analytics na galeria após rejeição

**Rotas:** `/galeria` e `/galeria.html` ainda respondem com a aplicação antiga. A reprodução de execução foi feita em `/galeria`.

**Como reproduzir:**

1. Abrir a Home nova e escolher **Rejeitar todos**.
2. Recarregar e confirmar a preferência `analytics: denied` e `advertising: denied` em `delano:consent:v2`.
3. Abrir `/galeria` no mesmo navegador.
4. Inspecionar scripts, nomes de cookies e requisições da página.

**Esperado:** manter a decisão de rejeição, sem iniciar análise opcional nem criar seus cookies.

**Observado:**

- A preferência continuou rejeitada.
- A página antiga carregou os scripts de `UA-199542592-1` e `G-6Z7JD1757Y`.
- Surgiram `_ga` e `_ga_6Z7JD1757Y`; ambos estavam ausentes antes da visita à galeria.
- Foi observada uma entrada de requisição para `stats.g.doubleclick.net/g/collect`, com `tid=G-6Z7JD1757Y`. O status exposto pelo Resource Timing foi `0`; isso comprova a atividade observada no navegador, sem afirmar recebimento ou processamento pelo servidor Google.
- Também surgiram `app_key` e `app_ses_key`, sem classificação de finalidade nesta auditoria.

**Causa identificada:** a galeria executa outra aplicação, com configuração Google própria. O controlador de consentimento React não governa esse documento. O HTML da galeria também conserva título antigo, não apresenta `h1` e mantém o layout anterior. Trata-se de uma pendência legada já documentada, agora confirmada com execução e cookies.

**Encaminhamento:** migrar a galeria preservando sua URL e conteúdo pertinente, aplicando o mesmo controle de consentimento às suas integrações. Incluir `/galeria.html` na estratégia específica de compatibilidade. Não usar um redirecionamento genérico de todas as páginas para a Home.

**Revalidação necessária:** navegador sem cookies de análise → rejeitar → visitar ambas as URLs → nenhum script, cookie ou pedido de Analytics; aceitar e revogar também devem funcionar ao transitar entre as páginas.

Evidências: [galeria publicada](capturas/qa-browseros-galeria-legada-2026-10-30.png), observações `qa_gallery` e `qa_gallery_network` no [registro do navegador](qa-browseros-observacoes-2026-10-30.json).

### QA-02 — Carrossel sem pausa e navegação alternativa

**Rota:** `/`, seção de avaliações.

**Como reproduzir:**

1. Abrir a seção com movimento normal.
2. Procurar um controle para pausar ou avançar/voltar entre as avaliações usando teclado.
3. Ativar a preferência de movimento reduzido e tentar acessar visualmente os sete depoimentos sem arrastar.

**Esperado:** leitura controlável e uma forma de acessar os demais cartões por controles operáveis pelo teclado e por clique simples.

**Observado:**

- O deslocamento continuou durante a amostra de 5,5 segundos: aproximadamente 253 px.
- Não há botões de pausa, anterior ou próximo. O único link da seção é **Avaliar no Google**.
- O contêiner não é focável e não oferece navegação de cartões por teclado; a interação implementada é por arraste de ponteiro.
- Movimento reduzido interrompeu corretamente o deslocamento na amostra de 30 quadros. Entretanto, em 375 px, ficaram visíveis somente partes de dois cartões entre os sete cadastrados, sem controles para trazer os demais à tela.

**Causa identificada:** o [componente de avaliações](../../src/pages/Home/sections/GoogleReviewSection.tsx) mantém o ciclo de movimento e os eventos de ponteiro, sem controles equivalentes de pausa ou mudança de cartão.

**Encaminhamento:** acrescentar pausa/retomada e anterior/próximo com nomes acessíveis e foco visível. Garantir acesso aos sete depoimentos com movimento reduzido; preservar o arraste como interação adicional.

**Revalidação necessária:** teclado, clique, toque e movimento reduzido; todos os sete cartões alcançáveis; pausa permanece ativa até a escolha de retomar.

Evidências: [carrossel mobile com movimento reduzido](capturas/qa-browseros-carrossel-mobile-2026-10-30.png) e observação `qa_carousel` no [registro do navegador](qa-browseros-observacoes-2026-10-30.json). A avaliação usou a orientação de foco/interação da skill ui-ux-pro-max, sem declarar certificação de acessibilidade.

### QA-03 — Ajuste visual de cookies pendente de publicação

**Como reproduzir:** abrir o site em um navegador sem decisão válida, em 1440×900.

**Esperado:** aviso menor à direita, acima do WhatsApp, com largura máxima de 480 px, conforme o pedido mais recente e o [design system](../design-system.md).

**Observado:** aviso à esquerda, em `x=20`, com 560 px de largura e aproximadamente 154 px de altura. O comportamento de consentimento é da implementação nova, mas a apresentação é anterior ao último ajuste.

**Confirmação de versão:** a produção carregou `index-BnjnBzn8.js`; o pacote local mais recente, `release-ftp/20261030T184845712Z-08a8f716/site`, referencia `index-meCSV9g9.js`. O servidor público se identificou como Apache, sem o cabeçalho de identificação Netlify consultado.

**Encaminhamento:** na próxima publicação autorizada, usar o pacote mais recente completo, conforme o [guia FTP](../publicacao-hostgator-filezilla.md), e conferir a Home sem cache. Não foi realizado upload nesta auditoria.

Evidência: [Home desktop publicada](capturas/qa-browseros-home-desktop-2026-10-30.png). Esta é uma diferença de entrega visual, sem falha funcional de aceitar/rejeitar identificada nas páginas novas.

## Verificações sem falha reproduzida no recorte testado

| Critério | Evidência e resultado |
| --- | --- |
| Páginas canônicas | Home, Localização, Contato e ambas as políticas retornaram HTTP 200, com título, `h1` e canonical próprios |
| HTML inicial | Home já entrega título principal, biografia com UniFOA e sete `details` no HTML retornado pelo servidor; nenhum placeholder de CNPJ encontrado |
| Compatibilidade de URL | Aliases `.html` e `index.html` testados chegaram aos destinos canônicos; barra final e variação de caixa de Localização mantiveram conteúdo/canonical corretos |
| Página desconhecida | `/qa-rota-inexistente-20261030` retornou HTTP 404 real, tela correspondente e `noindex,follow` |
| Robots e sitemap | HTTP 200; robots permite rastreamento e aponta para o sitemap com as cinco páginas canônicas |
| Favicon e imagem social | ICO, PNG de 96 px e imagem social retornaram 200; SHA-256 idênticos aos arquivos atuais em `public/`. Isso não comprova atualização do cache ou do índice do Google |
| Imagens e recursos | Na conferência final da Home: nenhuma imagem quebrada, pendente ou sem atributo `alt`; nenhum recurso com status de erro exposto no Resource Timing |
| Menu mobile | Abertura, Escape, liberação de scroll e retorno do foco ao botão **Abrir menu** confirmados |
| Seções, logo e Início | URL limpa, foco no destino e retorno ao topo confirmados. Foi aguardada a conclusão dos quadros de atualização antes de avaliar a rolagem |
| Histórico | Voltar de Localização restaurou a posição capturada antes da navegação: `scrollY=5892` |
| Áreas de atuação | Os sete blocos abriram com Enter; o primeiro fechou novamente com Enter, com estado nativo coerente |
| Rodapé | Em Localização 1440×1200, base do rodapé e do documento em `y=1200`. No mobile, preferências ficaram clicáveis e acima do WhatsApp depois da decisão de cookies |
| Preferências | Navegação por Tab ficou no diálogo; Escape descartou o rascunho. Em 667×375, diálogo ficou entre `y=16` e `y=359`, com rolagem interna para o conteúdo |
| Antes da autorização | Na sessão inicialmente sem decisão, nenhum script Google ou cookie de análise observado nas páginas novas |
| Rejeição e persistência | Rejeitar, recarregar e sincronizar entre as abas novas manteve análise bloqueada |
| Autorização | Uma instalação da tag `G-6Z7JD1757Y` no documento testado; `send_page_view:false`; consentimentos de publicidade negados |
| Navegação com GA4 | Fila de eventos da aba testada mostrou um `page_view` por visita Home → Localização → voltar à Home; houve requisição de `page_view` observada para o GA4 |
| Revogação | Nas páginas novas, revogar removeu `_ga`/`_ga_…`, retirou a tag e deixou os documentos recarregados sem novas requisições de análise observadas |
| Contato | Destinos de WhatsApp, telefone, e-mail, redes e endereço conferidos. Não foram enviados contatos ou mensagens reais |
| Console | Nenhum erro ou aviso retornado pela leitura de console nas cinco páginas novas inspecionadas |

Os dados HTTP completos estão na [matriz de 25 URLs](qa-browseros-http-2026-10-30.json). Ela contém o **status final** das respostas; não determina se cada redirecionamento intermediário foi 301, 302 ou 308.

## Cobertura visual e limites

- **375×812:** cinco páginas novas e rodapé; sem overflow horizontal observado.
- **320×568:** Home; sem overflow horizontal observado.
- **667×375:** preferências em paisagem, com conteúdo rolável.
- **768×1024:** Home e leitura das políticas; sem overflow horizontal observado.
- **1440×900:** Home e apresentação do aviso.
- **1440×1200:** Localização e base do rodapé.
- **Movimento reduzido:** preferência emulada no BrowserOS; carrossel estável na amostra, com o acesso visual limitado descrito em QA-02.
- A medição simples de contraste de texto sobre fundos sólidos não apontou pares reprovados; imagens, gradientes, transparências e todos os estados não foram abrangidos. Não equivale a auditoria completa de contraste.
- **Zoom real de 200% não validado:** o atalho enviado não mudou as métricas observadas. As larguras emuladas não foram apresentadas como prova desse teste.
- **Navegação com JavaScript desativado não validada:** o método de emulação retornou `target_scope_unsupported`. A inspeção do HTML inicial foi feita separadamente.
- Sem testes em Safari/Firefox, aparelho físico, leitor de tela, armazenamento bloqueado, expiração real de 180 dias ou conexão interrompida. Sem Lighthouse, INP de campo ou garantia de desempenho em outras redes.
- Sem acesso a relatórios internos de GA4/Ads/Search Console nesta tarefa. Requisição observada não comprova atribuição, conversão ou processamento em uma conta.
- Os testes de autorização geraram visitas de QA na propriedade real. Não foram acionados eventos de lead por clique em WhatsApp, telefone ou e-mail.

## Estado ao encerrar

As emulações de viewport e movimento foram removidas. As abas originais do usuário permaneceram intactas; Home e Contato da auditoria ficaram disponíveis no grupo `codex/qa-landing-page`. As abas exploratórias duplicadas e a galeria foram fechadas. A preferência foi deixada **rejeitada**, sem tag Google ou cookies visíveis na conferência final; os cookies criados pela visita de teste à aplicação legada foram removidos do navegador de QA.

As capturas PNG foram verificadas por leitura e integridade do arquivo. Nenhum valor de cookie, identificador individual de audiência ou credencial foi salvo no relatório/JSON. O fluxo reutilizável foi salvo no BrowserOS como `/neo-qa-landing-publicada`.

## Próximo trabalho

Priorizar QA-01, implementar os controles de QA-02 e incluir o ajuste já pronto de QA-03 na próxima publicação autorizada. Repetir a reprodução de cada achado no domínio após a entrega. Esta auditoria registra os defeitos; não os marca como corrigidos.
