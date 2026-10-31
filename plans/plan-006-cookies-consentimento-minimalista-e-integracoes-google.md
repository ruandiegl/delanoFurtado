# Cookies e consentimento minimalista com integrações Google — Implementation Plan

> **For agentic workers:** implementar tarefa por tarefa com `superpowers:executing-plans`, conforme autorização de execução. Delegação depende das instruções aplicáveis; os perfis de `agents/` definem responsabilidades, não iniciam processos. Os checkboxes abaixo registram apenas o que foi efetivamente verificado; pendências externas permanecem abertas.

**Goal:** substituir o aviso atual por uma faixa discreta inspirada na referência do usuário, com preferências compreensíveis, políticas acessíveis e controle efetivo da análise e da eventual medição de anúncios.

**Architecture:** evoluir `src/consent/` e preservar a integração GA4 já validada, separando o banner compacto do diálogo de preferências. O armazenamento será versionado por finalidade; tags opcionais continuam bloqueadas antes de autorização. A integração Ads será habilitada somente após identificar a conversão existente, com um único proprietário do transporte Google e regras distintas para análise e publicidade.

**Tech Stack:** React 19, TypeScript 6, Vite 8, Router 6, styled-components 6, tokens CSS, shadcn/Base UI `base-nova`, Vitest/Testing Library/jsdom e ESLint. Usar as versões do lockfile, inclusive Base UI 1.8.0. Publicação estática na HostGator/cPanel por pacote FTP, sem backend novo, CMP externa ou instalação permanente de CLI.

**Spec:** pedido e imagem fornecidos em 28/10/2026; [referência preservada](../docs/assets/referencias/cookies-banner-minimalista-2026-10-28.png); especificação visual e funcional nas seções 3 e 4 deste plano; [documentação do projeto](../docs/README.md), [integração atual](../docs/analytics-e-consentimento.md), [política técnica](../docs/politica-de-rastreamento.md), [design](../docs/design-system.md), [segurança](../docs/seguranca-e-privacidade.md) e [qualidade](../docs/qualidade-e-validacao.md).

**Planejamento:** 28/10/2026. **Execução:** 30/10/2026. **Estado:** implementação local concluída, com publicação e rede real pendentes. **Baseline de execução:** `07e4884`, branch `codex/plan-006-cookies`, preservando alterações documentais existentes. Ads continua condicionado; a galeria legada fica fora da cobertura. [Evidências e pacote](../docs/evidencias/cookies-006.md).

## Global Constraints

- Preservar o conteúdo revisado, a Hero, a biografia, as fotos, a navegação, o favicon e os canais de contato existentes.
- Português do Brasil na interface. A referência fornece composição; textos, políticas e serviços anunciados precisam refletir este site.
- Permanecer com consentimento básico: nenhum script, cookie, preconnect ou envio opcional Google antes da autorização correspondente. Não trocar silenciosamente para coleta sem cookies ou modo avançado.
- Fechar, rolar, navegar ou continuar no site não significa consentir. Recusar deve ser tão acessível quanto aceitar.
- Manter `G-6Z7JD1757Y`, eventos manuais e medição otimizada desativada. Uma mudança nessa estratégia exige revisão própria para evitar contagens duplicadas.
- `AW-622649331` é conhecido, mas não identifica a ação de conversão. Não inventar rótulo, ativar Ads com configuração incompleta ou considerar entrega de anúncios prova de conversões.
- Publicidade personalizada, remarketing, Google Signals, User-ID e conversões otimizadas com dados pessoais permanecem desativados neste plano.
- Continuar omitindo mensagens, telefone, e-mail, tema jurídico, texto de links, query arbitrária, fragmentos e referrer externo dos eventos próprios.
- Produção exige origem exata `https://www.delanofurtado.adv.br`. Localhost e Netlify não coletam dados reais; testes usam transporte controlado.
- O estado de consentimento nunca bloqueia leitura, navegação ou contato. Nenhum botão de contato aguarda o Analytics responder.
- A execução não altera orçamento, lances, segmentação, identificação do anunciante, DNS ou credenciais. Operação das contas e publicação seguem seu escopo autorizado.
- Políticas serão textos factuais revisáveis, com contato real do escritório; não preencher prazos do Google ou obrigações jurídicas por suposição nem afirmar certificação de conformidade.

## Review Focus

| Condição que pode falhar | Contrato esperado | Tarefa responsável |
| --- | --- | --- |
| Fechar o banner, fechar preferências com mudanças não salvas ou apenas navegar | Nenhuma autorização implícita, escrita de aceite ou evento opcional | UI-01, GA-01 |
| Consentimento v1 válido, expirado, armazenamento bloqueado ou política ampliada | Migração sem estender prazo ou conceder publicidade; situações inválidas ficam sem coleta | CONSENT-01 |
| Revogação/expiração em outra aba enquanto a tag já executa | Bloqueio imediato, fila descartada, limpeza possível e reinicialização controlada | CONSENT-01, GA-01, ADS-01 |
| Apenas análise, apenas publicidade ou as duas categorias autorizadas | Somente destinos e finalidades permitidos; nenhuma segunda instalação da tag | GA-01, ADS-01 |
| Novas políticas ausentes no FTP ou galeria antiga fora da aplicação | Links reais, HTML por rota e cobertura do consentimento declarada sem esconder o legado | POLICY-01, VERIFY-01 |

## 1. Responsáveis e organização

| Função de `agents/` | Responsabilidade neste plano |
| --- | --- |
| [Software Architect](../agents/software-architect.md), responsável principal | Contratos de preferência, limites das integrações e migração incremental |
| [UX/UI Designer](../agents/ux-ui-designer.md) | Faixa minimalista, texto curto, estados e comportamento responsivo |
| [Frontend Engineer](../agents/frontend-engineer.md) | Banner, diálogo, políticas, Router e integração com a store |
| [Security Engineer](../agents/security-engineer.md) | Finalidades, cookies, bloqueios, revogação, payloads e fronteira com Ads |
| [QA Engineer](../agents/qa-engineer.md) | Matriz de escolhas, regressões, teclado, hidratação, rede e evidências |
| [DevOps & Release Engineer](../agents/devops-release-engineer.md) | HTML estático, Apache, pacote FTP e restauração |
| [SEO & Content Specialist](../agents/seo-content-specialist.md) | Metadados das políticas e preservação de URLs/indexação |

O mesmo executor pode assumir essas funções. Skills pertinentes: `superpowers:writing-plans`, `ui-ux-pro-max`, `shadcn` e, na implementação, verificação e testes de comportamento. Animação de entrada simples pode usar CSS; o GSAP existente não é obrigatório para o aviso.

## 2. Estado real e lacunas

| Item | Observação no baseline |
| --- | --- |
| Aviso atual | `ConsentControls.tsx`: painel claro, padding de 24px, título de 20px, explicação longa, detalhes e dois botões; ocupa mais espaço que a referência |
| Preferência | `storage.ts`: `delano:consent:v1`, somente análise, 180 dias, validação de datas e versão |
| Sincronização | Store com `storage`, foco, visibilidade, expiração, fallback de negativa e defesa contra armazenamento indisponível |
| Provider | `useSyncExternalStore`, estado inicial SSR estável e retorno de foco ao fechar preferências |
| GA4 | Inicialização após consentimento; `page_view` manual e eventos de contato; bloqueio por origem, prevenção de duplicação e revogação com reload |
| Recebimento real | Capturas de 28/10 mostram `page_view` e `whatsapp_click`; [evidência](../docs/evidencias/ga4-recebimento-2026-10-28.md). As capturas não comprovam toda a matriz de privacidade |
| Ads | ID conhecido, sem integração instalada; origem/evento/rótulo da conversão ainda não confirmados. Campanhas podem exibir anúncios independentemente desse banner |
| Políticas públicas | Não existem rotas completas de privacidade/cookies. O rodapé apenas reabre as preferências atuais |
| UI disponível | Button, Sheet e Separator. Dialog/Switch não estão gerados; o pacote Base UI já está instalado |
| Build | Três rotas públicas e um 404. Verificadores, empacotador e regras Apache contêm listas/contagens explícitas |
| Legado | `/galeria` e `/galeria.html` ainda servem página antiga; [auditoria pública](../docs/evidencias/indexacao-http-2026-10-28.json). A cópia histórica contém UA, mas a presença efetiva de rastreadores nessa página deve ser auditada no navegador |

A referência foi copiada sem edição a partir do anexo `codex-clipboard-b7ed0f41-23fe-46dd-b577-607122d20546.png`; SHA-256 `0d9f753955bbcab6d062402337ca71b7419ac1b7ea9e2e11faa2c3b46c462229`.

A busca inicial `cookie consent banner choices` na base local UI/UX não retornou correspondência. A consulta refinada `dialog keyboard focus` retornou foco visível e foco não encoberto, aplicáveis ao diálogo e à convivência com o WhatsApp. Não foi atribuída à base uma recomendação específica de cookies inexistente.

As ferramentas BrowserOS neo não estão conectadas nesta sessão. A pesquisa deste planejamento usou fontes oficiais e arquivos locais; não houve simulação de teste visual ou acesso às contas. Na execução, preferir BrowserOS neo quando conectado e registrar a ferramenta realmente disponível.

## 3. Especificação visual e experiência

### 3.1. Abordagens consideradas

| Abordagem | Consequência |
| --- | --- |
| Apenas reduzir o painel atual | Resolve parte do espaço, mas mantém explicação, preferências e decisões no mesmo bloco |
| **Faixa compacta com diálogo de preferências, proposta deste plano** | Mantém a aplicação e o consentimento existentes; oferece controle detalhado apenas quando solicitado |
| CMP externa | Acrescenta dependência, configuração e possivelmente serviço pago; reavaliar se surgir exigência específica de certificação, regiões ou fornecedores. Não é necessária para o escopo atual |

As dimensões e cores a seguir são propostas do executor a partir da imagem, não medições exatas nem decisões já aprovadas pelo usuário.

### 3.2. Faixa inicial

- Canto inferior esquerdo, fundo quase preto com subtom verde, borda discreta e raio aproximado de 14px. Sem backdrop, título grande, ilustração, acordeão ou lista de fornecedores no primeiro nível.
- Tokens propostos: `--cookie-surface: #101814`, `--cookie-text: #f5f7f4`, `--cookie-muted: #c8d1ca` e `--cookie-border: #ffffff24`. Confirmar contraste real na execução.
- Desktop a partir de 768px: largura máxima de 560px, margem de 20px, padding de 14–16px e texto de 13–14px com entrelinha 1,5. Altura natural, estimada em 120–170px; não truncar ou fixar altura.
- Texto inicial, quando só GA4 estiver ativo: **“Usamos cookies opcionais para analisar visitas ao site. Você pode aceitar, rejeitar ou escolher suas preferências.”** Em seguida, links para **Política de Cookies** e **Privacidade**.
- Se a medição Ads for efetivamente habilitada, alterar apenas o trecho de finalidade para **“analisar visitas ao site e medir nossos anúncios”**, com nova versão da política e nova escolha.
- Três ações, nessa ordem: **Preferências**, **Rejeitar todos**, **Aceitar todos**. Preferências pode ser contornado; aceitar e rejeitar terão o mesmo peso visual e dimensões comparáveis. Usar variantes próprias no Button, não sobrescritas isoladas de cor por `className`.
- Alvos de toque de pelo menos 44px, inclusive o X. O X é visualmente pequeno, com nome acessível **“Fechar aviso de cookies”**. Fechar apenas oculta o aviso nesta montagem, sem gravar aceite, rejeição ou autorizar tags. O rodapé mantém acesso às preferências; uma nova visita sem decisão reapresenta o aviso.
- Mobile abaixo de 768px: margens laterais de 16px, largura disponível e fundo acima do WhatsApp (`bottom` inicial de 90px + safe area). Preferências ocupa a primeira linha; rejeitar/aceitar dividem a linha seguinte. Permitir quebra de texto.
- Manter compensação para o badge de homologação do Netlify quando presente. Em paisagem e zoom, permitir rolagem interna se necessária; nunca ocultar totalmente o foco atrás do aviso ou do WhatsApp.
- A faixa é região não modal, com nome acessível; não rouba foco ao aparecer e não prende a navegação. Transição opcional de opacidade/transform de 120–180ms; respeitar movimento reduzido.

### 3.3. Diálogo de preferências

- Aberto apenas por **Preferências** ou pelo link **Preferências de cookies** do rodapé. Usar Dialog Base UI/shadcn, título **Preferências de cookies**, descrição acessível, Portal e foco geridos pelo primitive.
- Desktop: largura máxima próxima de 520px. Mobile: largura disponível, margem de 16px e conteúdo rolável; ações sempre alcançáveis.
- Mostrar **Necessários — sempre ativos**, explicando o armazenamento da escolha. Não inventar cookies essenciais: a preferência atual usa localStorage, e a política diferencia essas tecnologias.
- **Análise**: switch desligado por padrão; explica GA4, páginas e posição dos canais, sem mensagens ou detalhes do caso.
- **Medição de anúncios**: aparece somente se o serviço Ads tiver sido configurado e habilitado. Explica o uso para avaliar resultados dos anúncios, sem prometer remarketing ou publicidade personalizada.
- Switches com rótulo/descrição associados e operáveis por teclado. Agrupar os campos semanticamente com Field/Fieldset do ecossistema existente, sem tratar as categorias como botões decorativos.
- Alterações são rascunho até **Salvar preferências**. **Rejeitar todos** e **Aceitar todos** aplicam a escolha imediatamente e fecham. X/Escape/fechamento externo descartam o rascunho e preservam o registro anterior; fechar não equivale a salvar.
- Após salvar/fechar, devolver foco ao botão que abriu o diálogo. Evitar dois overlays de navegação/preferências abertos simultaneamente.
- “Todos” significa todas as categorias opcionais realmente habilitadas. Serviço inexistente não recebe consentimento implícito nem aparece como rastreador instalado.
- Não copiar o link “Termos de Serviço” da imagem sem um documento real e uma finalidade definida. Este plano cria políticas de privacidade e cookies, não um contrato novo de prestação de serviços.

## 4. Contratos de consentimento e dados

### 4.1. Registro v2 e migração

`src/consent/config.ts` será a fonte de finalidade, duração e categorias habilitadas. `src/analytics/config.ts` continua sendo a fonte do ID/origem GA4; evitar duplicá-los.

```ts
type ConsentPreferences = {
  analytics: 'granted' | 'denied'
  advertising: 'granted' | 'denied'
}
type ConsentRecord = {
  version: 2
  policyVersion: 'analytics-v1' | 'analytics-ads-v1'
  preferences: ConsentPreferences
  decidedAt: number
  expiresAt: number
}
type ConsentCapabilities = { analytics: boolean; advertising: boolean }
```

- Chave proposta: `delano:consent:v2`; duração permanece **180 dias**, com `expiresAt = decidedAt + CONSENT_LIFETIME`. Esse prazo é decisão do projeto e não um prazo legal universal.
- Estado desconhecido é ausência de registro válido. As permissões efetivas são negadas até uma escolha válida, sem persistir um aceite fictício.
- `createConsent(preferences, now, policyVersion): ConsentRecord` cria registros apenas de escolha explícita. `readConsent(storage, now, policyVersion): ConsentRecord | null` valida estrutura, categorias, versão, datas e finalidade.
- `migrateLegacyConsent(value: unknown, now: number, policyVersion): ConsentRecord | null` aceita v1 apenas para `analytics-v1`, preserva a escolha de análise, `decidedAt` e `expiresAt`, e define publicidade como negada. Não prolonga prazo por leitura ou migração.
- Ler v2 primeiro. Migrar v1 quando válido, gravar v2 e só então retirar a chave legada, se a escrita tiver sucesso. Não migrar consentimento expirado ou v1 para a política com Ads.
- Ativar uma finalidade de publicidade muda `policyVersion` para `analytics-ads-v1` e exige nova escolha. Registros incompatíveis não autorizam a finalidade nova.
- Manter snapshot SSR determinístico, validação de armazenamento gravável, sincronização entre abas e timers divididos no limite da plataforma. Expiração e remoção de registro também revogam permissões.
- Se localStorage falhar, respeitar a escolha atual em memória; um fallback temporário de negativa pode usar sessionStorage, com o mesmo registro validável e sem renovar sua validade. Nenhuma preferência antiga de aceite prevalece sobre uma negativa atual que não pôde ser persistida.
- Fechar preferências, abrir políticas ou navegar não renova `decidedAt` nem `expiresAt`. Não enviar a decisão, identificadores ou histórico de escolhas a um backend novo.

### 4.2. Relação com Consent Mode

| Escolha efetiva | `analytics_storage` | `ad_storage` | `ad_user_data` | `ad_personalization` |
| --- | --- | --- | --- | --- |
| Sem decisão / rejeitar todos | denied | denied | denied | denied |
| Só análise | granted | denied | denied | denied |
| Só medição Ads direta, configurada | denied | granted | granted | denied |
| Análise + Ads configurado | granted | granted | granted | denied |

Antes da primeira carga, todos os sinais começam negados. Categoria sem capacidade/configuração permanece negada mesmo se um registro inesperado disser o contrário. `ad_user_data` não habilita envio de telefone, e-mail ou conversões otimizadas: esses dados continuam fora do escopo e do código.

No cenário inicial, Ads está desabilitado; apenas as duas primeiras linhas são utilizáveis. Para importação de conversões GA4, a medição publicitária exige **análise e publicidade autorizadas**. Nesse modo, o switch de anúncios fica indisponível enquanto análise estiver desligada, com explicação; desligar análise no rascunho também desmarca anúncios, sem aplicar nada antes de salvar. Nunca ligar análise automaticamente para viabilizar Ads.

Modo básico exige controlar a execução dos serviços além de transmitir `denied`: simplesmente carregar a tag com esses sinais pode enviar pings sem cookies no modo avançado. O teste de rede precisa verificar o comportamento real.

### 4.3. Inventário a publicar nas políticas

| Tecnologia | Uso e divulgação |
| --- | --- |
| `delano:consent:v2` | localStorage próprio com a escolha e datas; 180 dias; não é cookie e não atribui ID único de audiência |
| Fallback de negativa em sessionStorage | Usado apenas quando necessário; limitado à sessão e ao prazo do registro; documentar a chave efetivamente adotada |
| `_ga` e `_ga_*` | Somente após análise; GA4 com prazo configurado de 180 dias, a verificar no navegador. Retenção na conta Google é configuração distinta |
| `_gcl_*` ou outros cookies de Ads | Não existem por esta implementação atual; inventariar nomes, domínios e duração efetiva antes de habilitar Ads. Não atribuir a eles automaticamente o prazo da preferência |
| Links WhatsApp, telefone, e-mail, redes e Maps | Destinos externos; não equivalem a incorporação ou execução de Pixel/SDK na página |

O inventário vem da aplicação e da rede/armazenamento reais. Não anunciar uso de Meta Pixel, Hotjar, Clarity, mapa incorporado ou cookies de autenticação sem evidência. Os controles próprios não apagam armazenamento inacessível de terceiros, cookies de outro caminho ou requisições já transmitidas.

## 5. Mapa de arquivos

| Arquivos | Mudança planejada |
| --- | --- |
| `src/consent/config.ts` (novo) | Finalidades, versão da política, capacidades e duração compartilhada |
| `src/consent/storage.ts`, `store.ts`, `context.ts`, `ConsentProvider.tsx` | Registro v2, migração, escolhas por categoria e revogação/sincronização |
| `src/consent/ConsentControls.tsx` | Coordenar faixa e diálogo; preservar o ponto de entrada do botão do rodapé |
| `src/consent/CookieBanner.tsx`, `CookiePreferencesDialog.tsx` (novos) | Apresentação compacta e edição de preferências em rascunho |
| `src/components/ui/button.tsx`, `dialog.tsx`, `switch.tsx`, `field.tsx` | Variantes da faixa e primitives necessários; gerar somente os ausentes, sem substituir Button/Sheet/Separator existentes |
| `src/content/privacyContent.ts` (novo) | Textos e inventário factuais das duas políticas, com data e fontes |
| `src/pages/Privacy/index.tsx`, `src/pages/Cookies/index.tsx` (novos) | Documentos públicos em `/politica-de-privacidade` e `/politica-de-cookies` |
| `src/components/SiteLayout/Footer.tsx`, `src/styles/tokens.css` | Acesso às políticas/preferências e tokens do banner |
| `src/analytics/client.ts`, `AnalyticsBridge.tsx`, `config.ts` | Adaptar consentimento sem perder os eventos atuais; manter IDs e bloqueios |
| `src/tracking/config.ts`, `googleRuntime.ts`, `GoogleTrackingBridge.tsx` (condicionais) | Um único transporte coordenado GA4/Ads, se a tarefa ADS-01 for liberada pelos dados reais |
| `src/App.tsx`, `src/routes/routeManifest.ts`, `routes.tsx`, `previewManifest.ts`, `src/content/seo.ts` | Composição e novas páginas/metadados; uma única ponte de rastreamento |
| `scripts/prerender.mjs`, `verify-build.mjs`, `verify-preview.mjs`, `package-ftp.mjs`, `deploy/apache/.htaccess` | Cobrir as novas rotas no HTML, sitemap, verificadores e FTP/Apache |
| `src/test/consent.test.tsx`, `analytics.test.ts`, `analytics-integration.test.tsx`, `prerender.test.tsx`, `hydration.test.tsx`, `preview-routing.test.ts`, `contact-routes.test.tsx` | Adaptar os contratos afetados e preservar regressões existentes |
| `src/test/cookie-preferences.test.tsx`, `privacy-routes.test.tsx` (novos); `google-tracking.test.ts` (condicional) | Matriz de escolhas, políticas e integrações por categoria |
| `scripts/package-ftp.test.mjs`, `verify-preview.test.mjs` | Fixtures completas das novas rotas e testes de redirecionamentos sem mascarar erros de rede |
| Guidelines responsáveis e `docs/evidencias/cookies-006.md` | Estado implementado, evidências, limites, configuração e release efetivamente gerado |

## 6. Tarefas de implementação

### CONSENT-01 — Modelo, finalidade e migração de escolhas (P0)

**Responsável:** Arquitetura + Segurança. **Consome:** contrato 4.1 e store atual. **Produz:** `ConsentPreferences`, `ConsentRecord`, leitores/migrador e contexto com `setPreferences(value: ConsentPreferences): void`; aliases de leitura de análise podem ser preservados para o bridge existente.

- [x] Criar testes para migração v1 concedida/negada com publicidade negada e preservação exata das duas datas; leitura v2 válida; JSON inválido, campos ausentes, datas futuras, expiração e finalidade divergente retornando `null`.
- [x] Executar `npm.cmd run test:run -- src/test/consent.test.tsx` e confirmar falhas nas expectativas novas antes de implementar o modelo.
- [x] Implementar `consent/config.ts` e os contratos de storage, mantendo a chave v1 somente como entrada de migração. Configuração inicial: finalidade `analytics-v1`, análise habilitada conforme GA4 atual, publicidade desabilitada.
- [x] Evoluir store/provider/context para escolhas por categoria. A redução de permissão deve bloquear o cliente sincronamente antes de renderizações/efeitos posteriores; preservar a defesa atual de negativa quando o armazenamento falha.
- [x] Cobrir negativa em outra aba, `localStorage.clear()`, expiração com página aberta, remount/StrictMode, falha de escrita e fallback de sessão expirado. Validar que abrir/fechar não estende o prazo.
- [x] Reexecutar o arquivo afetado até passar, com nenhuma autorização Ads derivada de v1 ou de uma categoria inativa.

**Aceite:** uma escolha antiga válida continua com a mesma duração; finalidade nova exige escolha nova; preferência inválida ou indisponível não libera tags.

### POLICY-01 — Políticas reais e novas rotas estáticas (P0)

**Responsável:** Conteúdo/SEO + Frontend + Release. **Consome:** inventário 4.3 e contatos de `siteData.ts`. **Produz:** cinco rotas públicas e seis HTMLs incluindo 404, antes de qualquer migração separada da galeria.

- [x] Adicionar testes que abram as duas rotas diretamente e verifiquem título próprio, canonical, texto factual, contato do escritório e ausência de trackers antes da escolha. O teste inicial deve falhar porque as rotas ainda são 404.
- [x] Criar `privacyContent.ts` sem dados inventados: responsável identificado, finalidade, dados tratados, Google como fornecedor, armazenamento local, escolhas/revogação, prazos conhecidos e canais para solicitações. O e-mail de contato não deve ser apresentado como encarregado formal sem confirmação.
- [x] Criar páginas de privacidade/cookies com Container e composição editorial da marca, acessíveis sem aceitar análise. Descrever WhatsApp/Maps como serviços externos e distinguir preferência local da retenção da propriedade Google.
- [x] Implementar `/politica-de-privacidade` e `/politica-de-cookies` no manifest, Router, SEO e preview. Manter as três páginas existentes e 404 real.
- [x] Atualizar o pré-renderizador e suas mensagens para usar o cadastro de rotas; atualizar títulos esperados, contagens e sitemap em `verify-build` e testes. Base desta etapa: cinco URLs públicas e seis documentos HTML.
- [x] Incluir os dois diretórios/HTMLs na allowlist e no mapa de validação do empacotador, nas fixtures e nas regras Apache, antes da regra de arquivos/diretórios reais. Tratar aliases de documento com o mesmo padrão permanente dos existentes, sem loops ou perda de query.
- [x] Atualizar `verify-preview` e fixtures HTTP para testar acesso direto, refresh, alias `index.html`, canonical e 404. Não afrouxar a allowlist do pacote para aceitar HTMLs arbitrários.
- [ ] Adicionar links reais às políticas no rodapé e na interface de consentimento. Revisar o texto factual com o responsável pelo escritório antes da publicação; não publicar campos em branco, links fictícios ou promessas jurídicas.

**Aceite:** as políticas funcionam por URL direta e constam do artefato FTP, sem exigir JavaScript ou consentimento para leitura.

### UI-01 — Faixa discreta e diálogo de preferências (P0)

**Responsável:** UX/UI + Frontend. **Consome:** modelo CONSENT-01, textos e rotas POLICY-01. **Produz:** `ConsentControls`, `CookieBanner`, `CookiePreferencesDialog` e reabertura pelo rodapé.

- [x] Adicionar testes de comportamento em `cookie-preferences.test.tsx`: rejeitar tudo; aceitar somente categorias disponíveis; fechar X mantendo estado desconhecido; editar e fechar sem salvar; salvar somente análise; reabrir mostrando a escolha vigente; foco retornando ao acionador.
- [x] Executar os testes e confirmar que os novos controles/contratos ainda falham. Não criar testes que apenas comparem valores CSS.
- [x] Consultar a skill `shadcn` e os componentes oficiais compatíveis com `base-nova`. Gerar apenas Dialog/Switch/Field ausentes usando o runner npm; validar contra os tipos de Base UI 1.8.0 sem atualizar dependências apenas porque a documentação pública mostra versão posterior.
- [x] Implementar os textos e o layout de 3.2, com tokens e variantes `cookieAction` para aceitar/rejeitar e `cookieSettings` para preferências. Não substituir o Button ou tema globais.
- [x] Implementar o diálogo de 3.3, com rascunho separado, título/descrição, switches rotulados, ações e fechamento sem gravação. O primitive deve cuidar de foco, Escape e semântica; não criar outro gerenciador manual de modal.
- [x] Manter `PrivacyPreferencesButton` como export utilizado pelo Footer, mudando o rótulo para **Preferências de cookies**. O botão fica disponível mesmo após recusar ou fechar a faixa.
- [x] Confirmar teclado, foco visível, leitura assistiva e que o aviso não bloqueia os canais de atendimento. Fechar o banner inicial não deve disparar persistência nem tag.
- [ ] Inspecionar 320px, 375px, 768px, desktop e paisagem curta; verificar zoom de 200%, quebras de linha e coexistência com WhatsApp/badge. Produzir capturas úteis das telas atingidas.

**Aceite:** primeiro nível compacto e sem ruído visual; informações completas estão acessíveis no segundo nível; três escolhas compreensíveis e nenhuma autorização por omissão.

### GA-01 — Preservar GA4 e validar o ciclo completo (P0)

**Responsável:** Integrações + Segurança + QA. **Consome:** registro v2, categorias habilitadas e cliente atual. **Produz:** a mesma medição GA4, sujeita ao consentimento efetivo da nova interface.

- [x] Adaptar testes de Analytics e integração para os botões novos, migração v1, fechamento sem escolha, rejeição, aceitação, mudança de rota e nova preferência. Confirmar que as expectativas novas falham antes de adaptar os consumidores.
- [x] Conectar o bridge ao estado efetivo de análise sem criar uma segunda instalação. Preservar `send_page_view: false`, Google Signals e personalização desligados, eventos fechados por tipo e `link_location`.
- [x] Garantir `page_view` único ao aceitar na página atual, nenhuma nova visualização ao apenas editar preferências com análise já autorizada e uma visualização para cada navegação real elegível; selecionar seção da Home não gera outra página.
- [x] Manter a negativa/revogação imediatas, flag `ga-disable-G-6Z7JD1757Y`, descarte da fila, remoção de recursos próprios, limpeza dos `_ga` acessíveis e reload quando necessário. Salvar a escolha antes do reload; não recarregar repetidamente quando o SDK nunca iniciou.
- [x] Validar em StrictMode um clique no SVG do CTA gerando um `whatsapp_click`, sem bloquear o link. Conferir rota válida → desconhecida sem atribuir evento à página anterior.
- [x] Verificar erro de rede/adblock, origem não autorizada e tag externa preexistente: contato e navegação continuam utilizáveis; não sobrescrever uma instalação desconhecida ou declarar medição bem-sucedida.
- [ ] Com SDK real em sessão de teste autorizada, conferir rede/cookies antes da escolha, após rejeitar, depois de aceitar e após revogar. Testes da fila e capturas do painel são evidências complementares, não substitutos dessa verificação.

**Aceite:** o redesenho não reduz o controle de privacidade nem duplica a medição já recebida pelo GA4. Até ADS-01, todos os sinais publicitários continuam negados.

### ADS-01 — Medição de anúncios por categoria (P1 condicionado)

**Responsável:** Integrações + Segurança + gestor de tráfego. **Depende de:** identificar a ação real na conta e reconciliar sua finalidade com as políticas. Esta tarefa não bloqueia a publicação do banner novo com apenas GA4.

#### Gate e escolha do caminho

- [ ] Registrar nome da ação existente, origem, objetivo medido, conta/propriedade, regra/evento e uso principal/secundário. Para Ads direto, obter o rótulo real de `AW-622649331/LABEL`; para GA4 importado, conferir propriedade, evento e vínculo. Não criar outra ação principal automaticamente.
- [ ] Escolher **um caminho por resultado**. Preservar importação GA4 existente se esse for o método confirmado; preservar o destino direto se a ação existente for de site. A existência de campanhas ou o logo aprovado não define esse método.
- [ ] Definir em `src/tracking/config.ts` um discriminante fechado `mode: 'disabled' | 'ga4-import' | 'ads-direct'`. Em modo direto, rótulo válido é obrigatório; em importação, o evento/ação confirmados são obrigatórios. Configuração incompleta permanece `disabled` e não expõe a categoria no diálogo.
- [ ] Inventariar cookies/retentores efetivos, configurações remotas/destinos conectados da tag e tráfego técnico antes de ativar a categoria. Atualizar políticas e mudar `policyVersion` para `analytics-ads-v1`; solicitar nova escolha.

#### Transporte, escolhas e eventos

- [ ] Criar testes em `google-tracking.test.ts` para a matriz 4.2, categoria inativa, modo inválido, ausência de rótulo, repetição em StrictMode e revogação parcial. Os cenários com Ads são inicialmente esperados como ausentes/falhos.
- [ ] Se houver transporte compartilhado, extrair sua propriedade para `googleRuntime.ts`. Interface mínima: `applyConsent(preferences: ConsentPreferences): void`, `page(pathname: string): void` e `track(event: ContactEvent, location: LinkLocation): void`. `getGoogleRuntime()` retorna o singleton; `createGoogleRuntime(config, reload?)` permite testes isolados. Nenhum desses métodos inicia serviço sem finalidade, origem e configuração válidas.
- [ ] Manter `getAnalyticsClient().track(...)` como fachada dos consumidores atuais e preservar o contrato de fábrica `createAnalyticsClient(config, reload?)` usado pelos testes. Sua fachada continua com `grant(pathname)`, `page(pathname)`, `track(event, location)` e `revoke()`: `grant` autoriza apenas análise, `revoke` nega as finalidades dessa instância, e os métodos delegam ao runtime proprietário. Fábricas de teste podem criar runtime isolado; o getter de produção usa o singleton.
- [ ] Substituir o bridge antigo por **um** `GoogleTrackingBridge` em `App.tsx`; nunca executar os dois nem manter dois loaders/dataLayers. No modo coordenado, a store usa `applyConsent` para reduções síncronas por categoria, preservando as demais permissões; o bridge sincroniza navegação de forma idempotente. Atualizar todos os testes afetados nessa mesma tarefa.
- [ ] Em `ads-direct`, escolher o ID do serviço permitido para a carga inicial. Quando apenas Ads estiver autorizado, manter GA4 desabilitado antes da carga, não configurá-lo e verificar ausência de coleta Analytics. Quando apenas análise estiver autorizada, não configurar nem disparar conversões Ads.
- [ ] Em `ga4-import`, exigir ambas as permissões para compartilhar com Ads. Conservar o evento analítico autorizado e os sinais publicitários negados quando a pessoa aceitar somente análise. Validar as configurações da conta e o comportamento efetivo; não afirmar que apenas o código controla todo o uso remoto.
- [ ] Em ambos os métodos, manter `ad_personalization: denied`, `allow_ad_personalization_signals: false`, sem dados pessoais e sem remarketing. “Aceitar todos” não habilita recursos fora dessas finalidades.
- [ ] Quando publicidade estiver negada, manter `ads_data_redaction: true` e URL passthrough desativado, além dos bloqueios de destino. Conferir rede e configurações remotas; esses parâmetros isolados não substituem a autorização nem o controle de carregamento.
- [ ] Para Ads direto, um clique elegível envia uma conversão ao par confirmado e somente após consentimento; o evento GA4 pode coexistir no seu destino, sem uma segunda importação Ads contando o mesmo resultado. Não converter cliques em agendamentos ou clientes confirmados.
- [ ] Revogação de qualquer categoria bloqueia novos eventos imediatamente e descarta a fila. Reinicializar com reload após persistência quando o SDK já estiver ativo; restaurar somente as categorias ainda autorizadas. Limpar apenas cookies próprios conhecidos/acessíveis, inclusive `_gcl_*` quando efetivamente usados, sem varrer cookies funcionais da hospedagem.

#### Atribuição e verificação externa

- [ ] Confrontar a sanitização atual com a atribuição pretendida: URLs canônicas e referrer vazio protegem os eventos, mas não comprovam continuidade da atribuição de campanhas. Não prometer atribuição apenas por liberar cookies.
- [ ] Definir/testar tratamento de `gclid`, `gbraid` e `wbraid` com o responsável pela finalidade. Preservar o endereço de chegada no servidor; não persistir, retransmitir ou reconstituir identificadores antes da autorização publicitária. Não adotar URL passthrough ou copiar a query inteira como atalho.
- [ ] Continuar excluindo valores livres de UTM, busca, tema jurídico, telefone, e-mail e mensagens dos eventos próprios. Se o gestor precisar de campanhas nomeadas, propor uma allowlist de valores públicos controlados e testes separados; chave permitida não torna seu valor automaticamente livre de dados pessoais.
- [ ] Conferir Consent Mode e destinos com Tag Assistant, evento no GA4 e diagnóstico da ação no Ads conforme o caminho escolhido. Um teste pelo link direto não comprova conversão atribuída a anúncio; a entrega da campanha continua sendo conferida por impressões/cliques na conta.

**Aceite:** categoria publicitária disponível apenas para integração realmente configurada, com finalidade explicada, escolha própria, uma instalação e uma conversão Ads por ação pretendida. Se faltar acesso, rótulo, origem ou validação de dados, registrar ADS-01 como pendente e manter o modo `disabled`.

### VERIFY-01 — Cobertura, regressões e publicação (P0)

**Responsável:** QA + Release, com revisão de Segurança. **Consome:** CONSENT-01, POLICY-01, UI-01 e GA-01; ADS-01 somente se seu gate for concluído.

- [ ] Auditar todas as rotas efetivamente servidas no domínio, incluindo `/galeria`, `/galeria.html` e aliases antigos. Identificar cookies/scripts opcionais fora da aplicação nova; a cópia histórica não comprova a rede atual. O banner React não controla automaticamente o runtime do construtor antigo.
- [ ] Se o legado ainda rastrear sem escolha, registrar e tratar essa fronteira antes de declarar cobertura de todo o site: remover/isolar o rastreador legado preservando o funcionamento ou migrar a página para o mesmo fluxo. Mudança estrutural da galeria deve ter tarefa própria ligada à [pendência de migração/indexação](../docs/atualizacao-indexacao-google.md), sem redirect genérico ou exclusão das páginas existentes. Enquanto essa parte não estiver verificada, a entrega deve delimitar cobertura às páginas da aplicação nova.
- [x] Executar `npm.cmd run test:run` e `npm.cmd run lint`. Em caso de `EPERM` para junction ou `EACCES` HTTP local nos testes de scripts, separar a restrição do ambiente de um defeito e repetir integralmente os arquivos afetados com o acesso permitido; não transformar erro de conexão em prova de redirect rejeitado.
- [x] Executar `npm.cmd run build:ftp`. Conferir páginas públicas, seis HTMLs esperados nesta etapa, sitemap, aliases, favicons, meta Search Console e inexistência de snippets antigos/segunda tag. Atualizar as contagens se uma migração adicional de rota for efetivamente incorporada.
- [ ] Abrir a prévia local e executar `npm.cmd run verify:preview -- http://127.0.0.1:4174` com a porta efetiva. Fazer revisão visual e de teclado nos tamanhos de UI-01, inclusive preferências abertas, recusa, retorno de foco e políticas sem consentimento.
- [x] Gerar evidência em `docs/evidencias/cookies-006.md`: comandos/resultados, cenários executados, capturas, cookies observados, rede por categoria, estado Ads, limites do legado e identificador real do release. Atualizar as guidelines responsáveis na mesma entrega.
- [x] Entregar a nova pasta `release-ftp/<versão>/site` e instruções de backup/envio. Não alterar releases antigos. No FTP, enviar recursos e diretórios antes dos HTMLs e `index.html` por último, incluindo os dois `.htaccess` e preservando arquivos do provedor.
- [ ] Após envio autorizado, conferir URLs diretas, novas políticas e regras Apache no domínio real; a prévia Vite não comprova `.htaccess`. Repetir a matriz de rede/consentimento em produção, sem confundir homologação bloqueada com falha de coleta.
- [x] Preparar restauração dos HTMLs/configuração anteriores e tratar sua compatibilidade com a preferência v2. Um rollback não pode reautorizar alguém que acabou de revogar; preservar uma negativa legada de compatibilidade, com a mesma validade, ou invalidar registros antigos antes da restauração. Não restaurar automaticamente um arquivo que ignora essa decisão.

**Aceite:** interface compacta e acessível, políticas publicadas, decisões efetivas e verificáveis, regressões aprovadas e pacote reproduzível. A liberação do banner com GA4 não equivale à conclusão de Ads, do legado ou da operação de contas.

## 7. Sequência e critérios de conclusão

1. CONSENT-01 fixa as regras de dados antes de redesenhar os controles.
2. POLICY-01 cria destinos reais e ajusta o pipeline de rotas/FTP.
3. UI-01 compõe a faixa e o diálogo sobre os contratos anteriores.
4. GA-01 garante continuidade e bloqueios da análise já existente.
5. ADS-01 só entra com dados reais da ação e finalidade conciliada; caso contrário, fica pendente sem categoria falsa na UI.
6. VERIFY-01 conclui testes, evidências, limites de cobertura e entrega do pacote; publicação é uma etapa operacional própria.

Critérios de aceite verificáveis:

- [x] A referência minimalista é reconhecível, sem título grande ou explicação longa no primeiro nível.
- [x] Preferências, rejeição e aceitação estão disponíveis no primeiro nível, com alvos de toque adequados.
- [x] Fechar/navegar não concede nem renova consentimento; salvar aplica somente o rascunho atual.
- [x] Categorias opcionais começam desligadas e serviços ausentes não são apresentados como instalados.
- [x] Preferências antigas migram sem publicidade implícita e sem estender sua validade.
- [x] Recusa, expiração, outra aba e revogação efetivamente bloqueiam a coleta correspondente.
- [x] O GA4 continua com o ID/eventos atuais, sem duplicação ou mensagens/dados de casos nos eventos próprios.
- [x] Links de políticas e reabertura funcionam em todas as páginas novas, por URL direta e após refresh.
- [x] Ads e galeria têm estado explicitamente registrado; nenhuma lacuna é ocultada por uma declaração de cobertura total.
- [x] Testes, build, prévia, inspeção visual e inventário do pacote têm evidências reais da execução.

Fora do escopo: mudar campanhas/lances/orçamento; instalar Meta Pixel; remarketing; gravação de sessão; perfis por demanda jurídica; backend de comprovação de consentimento; novo CMS; certificação jurídica; redesign completo da galeria. Nenhum desses itens será ativado como efeito colateral de “Aceitar todos”.

## 8. Fontes consultadas e manutenção

- [ANPD — Guia orientativo de cookies](https://www.gov.br/anpd/pt-br/centrais-de-conteudo/materiais-educativos-e-publicacoes/guia_orientativo_cookies_e_protecao_de_dados_pessoais): finalidades compreensíveis, rejeição acessível e escolha granular. A interface é decisão do projeto, com orientação pública como referência.
- [Google — Consent Mode básico e avançado](https://developers.google.com/tag-platform/security/concepts/consent-mode): a diferença entre bloquear tags e transmitir pings sem cookies fundamenta a preservação do modo básico.
- [Google — Implementar Consent Mode](https://developers.google.com/tag-platform/security/guides/consent) e [API gtag](https://developers.google.com/tag-platform/gtagjs/reference): sinais padrão antes da execução e atualização conforme a escolha.
- [Google — Privacidade e personalização](https://developers.google.com/tag-platform/security/guides/privacy): bloqueio da coleta e manutenção da publicidade personalizada desativada.
- [Google — Diagnóstico do consentimento](https://developers.google.com/tag-platform/security/guides/consent-debugging): inspeção do padrão e da atualização no Tag Assistant.
- [Google — Conversões a partir do GA4](https://support.google.com/analytics/answer/10632359?hl=pt-BR): vínculo e ação de conversão são etapas distintas do recebimento de um evento.
- [Base UI — Dialog](https://base-ui.com/react/components/dialog) e [Switch](https://base-ui.com/react/components/switch): comportamento de componentes acessíveis; validar compatibilidade com a versão instalada.
- [Estado e evidência GA4](../docs/analytics-e-consentimento.md), [dados já recebidos](../docs/evidencias/ga4-recebimento-2026-10-28.md) e [migração Google](../docs/referencias-migracao-google-analytics-ads.md): origem dos IDs e limites reais deste projeto.

Documentos a atualizar durante a execução: `docs/design-system.md`, `docs/analytics-e-consentimento.md`, `docs/politica-de-rastreamento.md`, `docs/seguranca-e-privacidade.md`, `docs/integracoes-e-formularios.md`, `docs/rotas-e-conteudo.md`, `docs/arquitetura.md`, `docs/qualidade-e-validacao.md` e `docs/publicacao-hostgator-filezilla.md`. Seus estados implementados continuam valendo até a implementação deste plano.

Autorrevisão do planejamento: requisitos visuais vinculados a UI-01; persistência e migração a CONSENT-01; documentos/artefato a POLICY-01; coleta existente a GA-01; ampliação de finalidade a ADS-01; cinco condições de Review Focus cobertas por testes/inspeções nas tarefas responsáveis. Execução registrada em 30/10/2026: checkboxes concluídos refletem testes/inspeções locais; itens de conta, publicação, SDK real, rede da galeria e zoom real de 200% permanecem pendentes conforme a evidência.


## 9. Resultado da execução — 30/10/2026

- Faixa escura compacta, ações equilibradas e diálogo com rascunho; os quatro primitives ausentes foram gerados em projeto temporário, preservando o botão existente e as dependências. A revisão automática rejeitou a tentativa inicial que poderia sobrescrevê-lo; a alternativa isolada foi conferida antes de executar.
- Preferência v2 e migração sem renovação de prazo. A revisão independente encontrou falha de revogação sob erro de armazenamento: reproduzida e corrigida com remoção de aceites antigos quando possível, negativa em memória e sem reload inseguro. A interface explica quando não pode salvar.
- Foco retorna ao acionador ou ao controle permanente quando o acionador desaparece. Se a faixa encobrir completamente um alvo de teclado, ela é dispensada sem consentimento; a inspeção mobile reproduziu esse caso antes da correção.
- Políticas e pacote estão preparados; revisar o conteúdo com o responsável antes do envio. Ads permanece indisponível por falta dos dados reais da ação. Nenhum orçamento, conta, DNS ou arquivo remoto foi alterado.
- BrowserOS neo sem ferramenta conectada; a inspeção usou IAB. A galeria pública ainda exibe tags UA/GA4 no DOM e não recebe este aviso. A ferramenta não expôs o transporte/cookies do SDK; isso e a validação após publicação ficam expressamente separados da entrega local.
- Testes, capturas, caminhos do pacote e limites completos em [cookies-006](../docs/evidencias/cookies-006.md). Sem commit ou push automático nesta execução.
