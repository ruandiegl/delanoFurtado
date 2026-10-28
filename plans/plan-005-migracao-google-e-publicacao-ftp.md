# Migração das integrações Google e publicação por FTP — Implementation Plan

> **For agentic workers:** executar tarefa por tarefa com `superpowers:executing-plans`; delegação somente quando autorizada pelas instruções aplicáveis. Os checkboxes distinguem a auditoria concluída da implementação futura.

**Goal:** substituir o site antigo preservando os destinos de campanhas, a verificação de propriedade e a medição correta, com um artefato estático adequado à hospedagem acessada por FTP.

**Architecture:** manter o React/Vite e o HTML pré-renderizado por rota. O build ocorre no computador ou CI; a hospedagem recebe somente arquivos estáticos e sua configuração de servidor. Analytics e conversões serão implementados após o gate de hospedagem/domínio do plan-003, usando os destinos reais identificados nas contas.

**Tech Stack:** stack atual, Node 22.15.0 e npm conforme lockfile; sem backend ou runtime Node na hospedagem. HostGator/cPanel e FileZilla confirmados pelo usuário; configuração preparada para Apache/mod_rewrite conforme documentação do provedor. Versão/permissões e comportamento HTTP da conta ainda exigem conferência remota.

**Spec:** pedido de 27/10/2026 para analisar `Desktop/delanoAntigo`, reaproveitar integrações Google e considerar envio por FTP; [Deploy](../docs/deploy-e-operacao.md), [Segurança](../docs/seguranca-e-privacidade.md), [plan-003](plan-003-seo-previas-sociais-analytics-e-descoberta-ia.md), [auditoria local](../docs/evidencias/auditoria-site-antigo-2026-10-27.json) e [fontes Google](../docs/referencias-migracao-google-analytics-ads.md).

**Data:** 27/10/2026. **Estado:** auditoria e pacote local FTP implementados e verificados; usuário informou a publicação no domínio final. A [conferência HTTP](../docs/evidencias/publicacao-hostgator-2026-10-27.md) confirmou os 31 arquivos públicos do último pacote e identificou redirects de barra final em localização/contato que divergem do contrato. Validação completa da tarefa 4 e integrações Google permanecem pendentes. Usuário confirmou HostGator/cPanel e FileZilla e informou que ainda solicitará acesso às contas Google. Baseline: `51e7cf3`, com alterações textuais locais preservadas. [Evidência da preparação, decisões e limites](../docs/evidencias/ftp-hostgator-2026-10-27.md).

## Global Constraints

- Preservar o design, a foto original restaurada, os textos revisados, os sete serviços e as três rotas do MVP.
- Ler a cópia antiga como dados: não executar seus scripts nem transportar o runtime do construtor para a aplicação nova.
- Não instalar `UA-199542592-1` como solução de Analytics; primeiro identificar eventual GA4 conectado.
- Preservar contas/propriedades/ações de conversão pertinentes; falta de acesso não justifica recriá-las.
- Manter a decisão do responsável: GA4 e consentimento só serão implementados após hospedagem e domínio definitivos publicados e validados. Inventariar a medição e coordenar a troca com o gestor das campanhas antes desse lançamento.
- Não alterar campanhas, contas, DNS, servidor ou arquivos remotos nesta etapa. IDs públicos não concedem acesso administrativo; senhas e tokens privados não entram no repositório.
- Não presumir que o servidor interpreta `netlify.toml`, nem que `public_html` seja a raiz correta do domínio contratado.

## Review Focus

| Condição | Resultado e verificação responsável |
| --- | --- |
| UA encaminhando dados para GA4 por configuração remota | Inventário na conta identifica o destino antes de retirar a instalação antiga; tarefa 1 |
| `.htaccess` legado reescrevendo `/assets/arquivo.js` para HTML | Servidor atende arquivos reais e HTMLs corretos, com status/MIME próprios; tarefas 2 e 4 |
| Anúncio, sitelink ou acesso antigo a `/galeria` ou páginas `.html` | Destino inventariado e decisão explícita, sem redirect genérico para Home; tarefas 1 e 2 |
| Redirect HTTP/HTTPS/host retirando identificadores de campanha | Query sintética preservada no servidor; payload Google submetido a política separada de consentimento/sanitização; tarefas 2 e 5 |
| Substituição parcial misturando HTML e assets de versões diferentes | Promoção de release coerente, teste HTTP e restauração preparada; tarefas 3 e 4 |

## 1. Evidências já levantadas

- [x] Ler 13 arquivos na raiz da cópia antiga, incluindo arquivos ocultos, quatro HTMLs e quatro bundles JS; registrar tamanhos e SHA-256 na evidência JSON.
- [x] Identificar `UA-199542592-1` nos quatro HTMLs, com `gtag('config', ...)` e `googleAnalyticsKey` nos dados do construtor.
- [x] Não encontrar IDs literais `G-`, `AW-`, `GT-` ou `GTM-` nos arquivos analisados. Isso não comprova ausência de configurações remotas, tags conectadas ou medição na conta.
- [x] Em investigação posterior na configuração pública da tag UA, identificar o destino GA4 `G-6Z7JD1757Y`, referenciado como contêiner filho. [Evidência](../docs/evidencias/tag-google-conectada-2026-10-27.json). Nenhuma execução da tag ou coleta enviada; propriedade, ingestão e conversões ainda não foram verificadas na conta.
- [x] Registrar o ID Google Ads `AW-622649331`, fornecido em captura pelo usuário. Ação, origem e rótulo da conversão permanecem pendentes; o código Ads/Meta não foi instalado a partir dessa captura.
- [x] Identificar uma meta `google-site-verification` nos quatro HTMLs. Seu valor público está preservado na evidência; restaurá-lo no host correspondente depende da verificação da propriedade e do método usado.
- [x] Identificar o `robots.txt` local com `User-agent: *` e `Disallow: /`. Não copiar esse bloqueio para produção; a cópia não comprova o arquivo servido hoje nem bloqueio do AdsBot.
- [x] Identificar sitemap com `/`, `/galeria`, `/localizacao` e `/contate-nos`, em HTTP sem `www`.
- [x] Identificar `.htaccess` do construtor: HTTPS e reescrita para arquivos HTML planos, incluindo regra ampla para dois segmentos. O novo site usa `/assets/`, `/media/` e diretórios por página: o arquivo antigo não é compatível por simples cópia.
- [x] Executar `npm run build` e `npm run verify:build` com sucesso. Não houve alteração do frontend ou de suas tags por esta auditoria.

### O que significa reaproveitar

| Recurso | O que preservar ou localizar |
| --- | --- |
| Campanhas Google Ads | Conta, campanhas, anúncios, recursos/sitelinks, URLs finais, templates e sufixos; são configurações da conta, não arquivos transferidos por FTP |
| GA4 | Propriedade e fluxo corretos, ID e vínculos existentes; UA não substitui um ID moderno nem transfere histórico para GA4 |
| Conversões | Origem e ação real: evento GA4 importado ou Ads direto, ID/rótulo quando aplicável, gatilho e uso nas metas |
| Tag Manager | Contêiner e versão publicada, se existirem; o domínio `googletagmanager.com/gtag/js` encontrado sozinho não comprova GTM |
| Search Console | Propriedade e método de verificação; preservar a meta existente ou confirmar verificação DNS já válida, sem atribuir nova titularidade automaticamente |

## 2. Tarefa 1 — fechar o inventário de contas e destinos

**Responsáveis:** SEO & Content Specialist + responsável pelas campanhas. **Arquivo:** complementar esta evidência/plano com dados públicos confirmados; acessos privilegiados permanecem fora do Git.

- [x] Confirmar domínio e hospedagem: mesmo `https://www.delanofurtado.adv.br`, HostGator/cPanel via FileZilla; pacote para instalação na raiz do domínio.
- [ ] Conferir a raiz efetiva no cPanel, backup, diretivas particulares e permissões `.htaccess` na conta antes da publicação.
- [ ] Identificar a propriedade/fluxo GA4 e eventual conexão com a tag UA. Obter o ID do destino correto; criar propriedade apenas se realmente não existir uma apropriada e essa criação estiver autorizada.
- [ ] Na conta Ads, registrar ações de conversão, origem, evento/URL, ID/rótulo, contagem e metas primárias/secundárias. Registrar eventual contêiner GTM e seu escopo.
- [ ] Exportar a relação de URLs de anúncios e recursos. Comparar com as três rotas do novo site e com os aliases `.html` antigos.
- [ ] Conferir campanhas que usam `/galeria` e decidir sua substituição/aposentadoria. O pacote preserva provisoriamente o caminho apenas se o HTML antigo permanecer no servidor, sem inventar equivalência com a Home; manter seus bundles enquanto usados.
- [ ] Confirmar o método Search Console e o host/protocolo abrangidos; não remover a verificação ativa durante a troca.

**Produz:** domínio/servidor confirmados, lista de destinos e mapa de medição. **Aceite:** nenhuma campanha conhecida depende de uma URL sem tratamento definido; conta/fluxo de medição identificados sem inferir ausência pelo export.

## 3. Tarefa 2 — adaptar o artefato e o servidor ao FTP

**Responsável:** DevOps & Release Engineer, com Arquitetura/SEO. **Depende de:** domínio/provedor da tarefa 1, já confirmados. Inventário nas contas Google e conferência da raiz remota continuam necessários para o lançamento, sem bloquear a geração local do pacote.

**Arquivos implementados:** `deploy/apache/.htaccess`, `deploy/apache/assets.htaccess`, `deploy/apache/search-console.html`, `scripts/package-ftp.mjs`, `scripts/package-ftp.test.mjs`, `package.json` e `.gitignore`. Reaproveitar a configuração de origem do ENV-01 do plan-003 se houver troca futura de host/ambiente; não houve essa troca nesta execução.

**Interface implementada:** `npm run build:ftp` executa build, verificação e `packageFtp({ root })`; o comando usa a raiz do projeto e os testes usam fixtures temporárias. Recebe `dist/` recém-verificado e produz `release-ftp/<versão>/site`, com arquivos publicáveis e configuração específica. `manifest.json` e `LEIA-ME.md` ficam fora de `site/`. Versões anteriores não são apagadas. Não faz conexão FTP ou alteração remota.

- [x] Confirmar que o domínio final coincide com `publicOrigin`; manter canonical/OG/schema/sitemap/robots existentes. ENV-01 não foi implementado por esta confirmação de destino.
- [x] Preservar instalação na raiz e `base: '/'`. Subpasta exigirá tratar também Router e mídia e não é suportada por este pacote.
- [x] Preparar redirects externos de aliases usando a requisição original; arquivos reais e páginas têm regras próprias, sem copiar a reescrita do construtor.
- [x] Preparar mapeamentos `/localizacao` e `/contate-nos` aos HTMLs próprios antes da normalização de diretórios; inspeção independente sem defeitos importantes. Teste HTTP ainda pertence à tarefa 4.
- [x] Configurar documento de erro local com status 404 e listagem de diretórios desabilitada, sem fallback geral à Home.
- [x] Preparar redirects sem descarte de query; inspeção conforme a documentação Apache. Teste HTTP com `?gclid=teste&utm_source=teste` pendente na tarefa 4.
- [x] Definir revalidação para HTML/mídia estável e cache longo em `assets/.htaccess` para assets com hash.
- [x] Empacotar somente arquivos permitidos e configurações próprias, incluindo arquivos ocultos. Preservar a meta Search Console na Home de produção sem modificar `dist/`.
- [x] Oito testes de empacotamento aprovados: build incompleto, exclusões, configuração de produção inválida, inventário, preservação da origem/versões e recusa de junction externa.

**Aceite:** pacote estático reproduzível, sem depender de Node na hospedagem. Testes do servidor na tarefa 4 comprovam redirects, MIME e status; o preview Vite sozinho não comprova regras Apache.

## 4. Tarefa 3 — gerar e conferir o pacote de publicação

**Responsáveis:** Release + QA. **Depende de:** tarefa 2; pacote local gerado e conferido.

- [x] No ambiente existente com Node 22.15.0, executar testes (67 aprovados), lint e `build:ftp`. Instalação limpa por `npm ci` não foi repetida nesta execução; o lockfile não mudou.
- [x] Conferir pacote com `index.html`, HTMLs próprios, `404.html`, `assets/`, `media/`, robots, sitemap e configurações Apache; 33 arquivos publicáveis.
- [x] Confirmar meta Search Console uma vez na Home de produção, preservando o valor público da fonte antiga. Políticas adicionais por ambiente do plan-003 não foram implementadas neste empacotamento.
- [x] Registrar SHA-256, data e origem no manifesto do release; revisão independente conferiu os 33 hashes. Preservar os hashes do inventário antigo.

**Aceite:** enviar o **conteúdo** do pacote à raiz correta do domínio, sem criar uma pasta `/dist` adicional no site. A geração estática de Vite e a função de preview estão documentadas na [fonte oficial](https://vite.dev/guide/static-deploy.html).

## 5. Tarefa 4 — publicar com restauração e verificar HTTP

**Responsáveis:** Release + responsável pela hospedagem. **Depende de:** pacote aprovado e autorização para a publicação real.

- [ ] Fazer backup verificável dos arquivos/configuração remotos antes da troca. A cópia baixada ajuda, mas não comprova backup completo da conta, DNS ou serviços.
- [ ] Preservar `.well-known`, certificados e diretórios/configurações do provedor. Não apagar recursivamente a raiz para fazer a troca.
- [ ] Definir promoção de release suportada pela hospedagem; quando não houver troca atômica, preparar ordem/janela e arquivos de restauração para evitar HTML novo apontando a assets ausentes.
- [ ] Publicar somente na raiz confirmada, preferindo o transporte protegido oferecido pelo provedor. Não alterar DNS de e-mail por causa de uma troca de frontend.
- [ ] Verificar `/`, `/localizacao`, `/contate-nos`, aliases conhecidos, HTTP/HTTPS e host canônico, redirects com query, assets com MIME correto e URL desconhecida retornando 404. Testar também o destino definido para `/galeria`.
- [ ] Executar `npm run verify:preview -- https://DOMINIO_CONFIRMADO` com a origem real no lugar da indicação. Ajustar o verificador junto com o contrato caso o servidor confirmado tenha uma política de aliases diferente; não ocultar falhas para aprovar o release.
- [ ] Conferir diretamente sitemap, robots e Search Console, além de contatos, mídia e refresh das páginas. Status 200 sozinho não comprova indexação nem medição.
- [ ] Se houver falha, restaurar o release/configuração anterior; conservar ativos necessários ao retorno e registrar o resultado.

**Aceite:** três páginas corretas antes de JavaScript, destinos antigos tratados, canais funcionando e restauração conhecida. Só este gate libera a implementação de Analytics conforme a decisão já registrada.

## 6. Tarefa 5 — reinstalar a medição moderna correta

**Atualização em 27/10/2026:** [implementação GA4/consentimento e eventos preparada e validada localmente](../docs/evidencias/ga4-2026-10-27.md), com o destino existente `G-6Z7JD1757Y` e confirmação do usuário sobre medição otimizada. Novo pacote pronto; upload/ingestão e inventário das conversões Ads continuam pendentes. Não foi instalada uma tag UA nem criada propriedade Google pelo agente.

**Responsáveis:** Frontend + Segurança + QA + gestor das campanhas. **Depende de:** publicação definitiva validada e inventário da tarefa 1.

- [ ] Executar CONSENT-01/ANALYTICS-01 do plan-003 com o GA4 existente apropriado. Não copiar a tag UA, runtime do construtor ou inserir uma segunda instalação redundante.
- [ ] Escolher transporte único: Google tag direta ou GTM auditado. Reimplementar eventos e posições dos botões porque seletores/textos/gatilhos do site antigo podem mudar.
- [ ] Planejar Ads como ampliação explícita do plan-003: ele atualmente mantém publicidade negada, coleta desativada antes de consentimento e URLs sanitizadas sem queries. Antes de implementar Ads, definir estados/finalidades publicitárias e uma política permitida para identificadores de campanha; não enviar URLs arbitrárias, mensagens de WhatsApp ou dados de casos jurídicos.
- [ ] Preservar a ação de conversão correta, usando ID/rótulo quando for Ads direto, ou o evento/vínculo existente quando for GA4 importado. Evitar duas ações primárias medindo o mesmo resultado.
- [ ] Manter `whatsapp_click` como intenção de contato; não tratá-lo como agendamento concluído ou cliente contratado. Resultado confirmado exige fonte própria.
- [ ] Testar entrada, navegação SPA, voltar/avançar e clique único por posição, sem duplicar pageviews automáticos/manuais. Validar ausência de requisições antes do consentimento, revogação e falha de tag sem impedir atendimento.
- [ ] Conferir Tag Assistant, GA4 DebugView/Realtime e diagnóstico Ads com tráfego sintético autorizado; registrar evidências separadas de geração do build e ingestão real.

**Aceite:** GA4 e conversões confirmados nos destinos corretos, sem duplicação e com o fluxo de consentimento efetivamente testado. Não prometer atribuição perfeita ou ausência de impacto de performance apenas por reaproveitar IDs.

## Fontes e limites

- [Pesquisa Google específica](../docs/referencias-migracao-google-analytics-ads.md): tags conectadas, IDs, conversões, AdsBot, parâmetros e consentimento.
- [Search Console — verificação](https://support.google.com/webmasters/answer/9008080?hl=pt-BR): a verificação depende da continuidade de um método válido.
- [Vite — publicação estática](https://vite.dev/guide/static-deploy.html): build em `dist/`; `vite preview` é uma ferramenta de conferência local.
- [Apache — diretórios e barra final](https://httpd.apache.org/docs/2.4/mod/mod_dir.html) e [erros personalizados](https://httpd.apache.org/docs/2.4/custom-error.html): validar as regras no servidor que será usado.

Esta entrega leu a cópia local, consultou fontes oficiais e implementou o pacote estático FTP para o destino confirmado, com testes, lint, build e revisão independente. Não acessou painéis Google ou a hospedagem, não instalou Analytics/Ads e não publicou arquivos. Apache não está disponível localmente: as regras ainda exigem teste HTTP na conta HostGator. A ausência de IDs modernos no export não substitui o inventário nas contas. Consulte o [guia operacional](../docs/publicacao-hostgator-filezilla.md) e a [evidência da execução](../docs/evidencias/ftp-hostgator-2026-10-27.md).
