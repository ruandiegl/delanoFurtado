# SEO, Prévias Sociais, Analytics e Descoberta por IA — Implementation Plan

> **For agentic workers:** usar `superpowers:executing-plans` para executar tarefa por tarefa, ou `superpowers:subagent-driven-development` quando esse método estiver autorizado. Os checkboxes registram implementação verificada, não a elaboração deste documento.

**Goal:** corrigir as lacunas de compartilhamento e indexação do Delano Furtado, preservar sua presença local e planejar medição de navegação e intenção de contato com consentimento. A implementação do GA4 ocorrerá somente após publicação validada na hospedagem e no domínio definitivos.

**Architecture:** evolução do HTML estático gerado por React/StaticRouter/ServerStyleSheet no Vite. Uma configuração pública de build alimentará cliente, renderizador, SEO e políticas do artefato; GA4 será uma integração cliente separada, bloqueada até consentimento e configuração válidos. Netlify é a homologação temporária; a hospedagem definitiva ainda será escolhida, com regras e verificações HTTP adaptadas ao provedor confirmado.

**Tech Stack:** React 19, TypeScript 6 estrito, Vite 8, React Router DOM 6, styled-components 6, shadcn/Base UI/Tailwind 4, GSAP existente, Sharp para mídia, Vitest/Testing Library/jsdom e ESLint. Node 22.15.0/npm 11.21.1 conforme configuração atual. GA4 via Google tag, sem SDK React adicional obrigatório.

**Spec:** plano da Bravite fornecido pelo usuário nesta conversa, adaptado neste documento; [docs](../docs/README.md), [SEO](../docs/seo-acessibilidade-performance.md), [rotas](../docs/rotas-e-conteudo.md), [arquitetura](../docs/arquitetura.md), [integrações](../docs/integracoes-e-formularios.md), [segurança](../docs/seguranca-e-privacidade.md), [deploy](../docs/deploy-e-operacao.md) e [pesquisa sobre busca por IA](../docs/referencias-seo-busca-ia.md).

**Data:** 23/10/2026. **Estado:** planejado; implementação não iniciada. **Baseline inspecionado:** `c6c8566`, branch `main`, sem alterações locais antes desta documentação. **Tarefa:** adaptar o planejamento de SEO da Bravite à landing institucional de Delano Furtado e produzir um roteiro executável.

**Revisão do responsável — 23/10/2026:** Netlify não será a hospedagem final e a URL atual não é o domínio de lançamento. Confirmar hospedagem e domínio, publicar e validar o site definitivo; só então implementar consentimento, GA4 e eventos dos botões. Até lá, manter o dicionário de eventos como documentação e nenhuma coleta analítica ativa. A escolha do provedor e a migração ainda estão pendentes; esta revisão não as executa.

## Global Constraints

**Adendo de auditoria — 27/10/2026:** a cópia antiga disponibilizada pelo usuário contém `UA-199542592-1`, meta de verificação Search Console e regras próprias do construtor. Antes de escolher/criar GA4 ou instalar conversões, identificar nas contas se a tag UA já encaminha dados a uma propriedade GA4 conectada. O [plan-005](plan-005-migracao-google-e-publicacao-ftp.md) complementa este plano com inventário de campanhas/destinos e publicação por FTP. Ads direto/importação de conversões exige reconciliar as regras de consentimento e a sanitização de queries deste plano; não está implementado nem é liberado por copiar IDs. O gate de publicação definitiva antes do Marco B permanece vigente.

- Preservar React/Vite/Router, a Hero escura do [plan-002](plan-002-redesign-hero-recorte-fundo-escuro.md), os sete serviços, mídia original e interações GSAP. Preservar a homologação no Netlify enquanto a hospedagem final não for confirmada; adaptar a publicação ao destino escolhido sem presumir Next.js/Vercel.
- Fontes factuais: [transcrição](../docs/02-conteudo-site-delano-furtado.md), `src/content/siteData.ts`, `services.ts`, `homeContent.ts` e a procedência das avaliações registrada em [Rotas](../docs/rotas-e-conteudo.md). Não ampliar qualificações, regiões, serviços ou promessas por motivos de SEO.
- O site tem três rotas públicas, sem API, painel, login, blog, cases ou formulário de envio. Serviços e biografia são seções da Home.
- `docs/`, `plans/` e `agents/` são versionados em repositório público. Não são um cofre nem documentação privada, ao contrário da referência Bravite.
- Identificadores, domínios, eventos de formulário e credenciais da Bravite não serão reutilizados. `VITE_*` é público no bundle.
- Nenhum script ou envio analítico antes de consentimento; cliques em WhatsApp, telefone e e-mail são intenção de contato, sem comprovar atendimento, envio ou contratação.
- Autorização desta entrega: pesquisa e planejamento. Alterar DNS, contratar serviços, configurar propriedades externas, publicar código ou mudar política de treinamento são etapas futuras, com dependências explícitas.

## Review Focus

| Condição crítica | Comportamento esperado e teste responsável |
| --- | --- |
| Build Vite em modo production, mas contexto Netlify de preview/branch | Não indexar nem medir tráfego de homologação; teste de configuração em ENV-01 e resposta HTTP em VERIFY-01 |
| Imagem absoluta apontando para outro host ou alias atendido com 200 | Imagem acessível e mesma página antes/depois da hidratação; LINK-01/SEO-01 |
| URL/referrer com nome, e-mail, telefone ou descrição de caso | Nenhum valor arbitrário enviado; sanitização em ANALYTICS-01 |
| Consentimento revogado enquanto a tag carrega; StrictMode e múltiplas abas | Nenhuma inicialização tardia, listener duplicado ou envio futuro pela aplicação; CONSENT-01/ANALYTICS-01 |
| H1 com spans, carrossel com clones e eventual inclusão de políticas | Extrair texto sem depender da marcação da Hero; não duplicar schema nem contar rotas por posição; VERIFY-01 |

## 1. Responsáveis por função

Os perfis abaixo são responsabilidades de trabalho; sua indicação não inicia processos nem concede permissões externas.

| Perfil | Responsabilidade neste plano |
| --- | --- |
| **[SEO & Content Specialist](../agents/seo-content-specialist.md)** — principal | Metadados, conteúdo local, canonical, previews, schema, rastreamento e critérios de indexação |
| [Software Architect](../agents/software-architect.md) | Configuração compartilhada, fronteiras SSR/cliente e contratos entre SEO, consentimento e analytics |
| [Frontend Engineer](../agents/frontend-engineer.md) | Metadados, links instrumentados, preferências e políticas no frontend existente |
| [Security Engineer](../agents/security-engineer.md) | Fluxo de dados, bloqueio pré-consentimento, revogação e payloads sem dados pessoais |
| [DevOps & Release Engineer](../agents/devops-release-engineer.md) | Homologação Netlify, seleção e configuração do destino final, domínio, headers, publicação e rollback |
| [QA Engineer](../agents/qa-engineer.md) + [Accessibility & Performance Engineer](../agents/accessibility-performance-engineer.md) | Contratos, inspeção de rede, teclado, HTML direto, hidratação, mídia e desempenho |
| [Code Reviewer](../agents/code-reviewer.md) + [Technical Writer](../agents/technical-writer.md) | Revisão final e documentação coerente com a implementação efetiva |

Para os novos controles de preferências, consultar `ui-ux-pro-max`, `frontend-design` e `shadcn` na execução. Movimento só muda se necessário para acessibilidade; este planejamento não cria nova animação.

## 2. Estado encontrado e diagnóstico

### 2.1. Arquivos e recursos existentes

| Recurso | Estado verificado |
| --- | --- |
| Rotas | `/`, `/localizacao`, `/contate-nos`; 404; aliases de caixa, barra e `index.html` reconhecidos pelo manifest |
| HTML inicial | `src/entry-server.tsx` e `scripts/prerender.mjs` geram HTML/CSS por rota e hidratam no cliente |
| SEO | `src/content/seo.ts` já fornece title/description/canonical/OG/Twitter por página e `LegalService` factual; `RouteSeo.tsx` atualiza o head na navegação |
| Imagem social | `/media/social-delano.png`, PNG **1200 × 630**, 423.339 bytes; uma imagem compartilhada entre as três páginas; faltam campos próprios de alt/dimensões no head |
| Origem | `publicOrigin` fixo em `https://www.delanofurtado.adv.br`; imagens sociais, JSON-LD, sitemap e robots dependem dele |
| Hospedagem | Netlify temporário em `https://delano-furtado.netlify.app`, deploy de `main`; `netlify.toml` já contém rotas, 404, headers e cache. Hospedagem e domínio definitivos pendentes |
| Analytics/consentimento | Nenhum GA4, Vercel Analytics, CMP, preferência de cookies ou identificador GA4 declarado no código/pacotes |
| Canais | WhatsApp, `tel:`, `mailto:`, Google Maps, redes e link de avaliação; sem formulário/API que confirme um lead |
| Avaliações | `src/content/reviews.ts` e carrossel em `GoogleReviewSection.tsx`; a documentação registra coleta da ficha Google em 22/10/2026. Há textos e datas relativas estáticas; preservar procedência e revisar atualização |
| Verificadores | `verify-build.mjs` verifica HTML e catálogo, mas conta três URLs e depende de ordem; `verify-preview.mjs` lê o H1 sem remover spans, incompatível com a marcação atual da Hero |

Não interpretar as evidências antigas do MVP como ausência atual de avaliações ou Hero clara. Também não tratar a nota exibida no carrossel como justificativa automática para estrelas em dados estruturados.

### 2.2. Consulta HTTP pública em 23/10/2026

Requisições de leitura, sem login ou alteração de infraestrutura:

| URL/recurso | Resultado observado |
| --- | --- |
| Home e localização no Netlify | HTTP 200; `index,follow`; canonical no domínio profissional; sem `X-Robots-Tag` na resposta consultada |
| `www.delanofurtado.adv.br/` | HTTP 200, ainda com imagem social do construtor anterior |
| `www.delanofurtado.adv.br/media/social-delano.png` | **HTTP 404**, `text/html`, na requisição HEAD |
| `delano-furtado.netlify.app/media/social-delano.png` | HTTP 200, `image/png`, na requisição HEAD |
| Robots do Netlify | `User-agent: *`, `Allow: /`, sitemap apontando para o domínio profissional |
| Sitemap do Netlify | Três URLs do domínio profissional |

**Prioridade P0:** a imagem anunciada pelo novo HTML não existe no host anunciado. A origem canônica e a origem dos arquivos precisam ser tratadas conscientemente durante a homologação. A URL principal `netlify.app` é produção para o provedor, mas ainda é homologação da migração de domínio para o produto; o bloqueio automático de Deploy Preview não cobre esse caso.

Esta auditoria não confirma configuração DNS administrativa, propriedade Search Console, GA4, tráfego, indexação nem aparência final no WhatsApp.

## 3. Adaptação da referência Bravite

| Bloco original | Decisão para Delano |
| --- | --- |
| LINK-01 | Evoluir OG/Twitter existentes para as três páginas e corrigir acesso às imagens; sem artigos/cases inexistentes |
| SEO-01 | Preservar prerender do Vite; parametrizar origem, indexabilidade e sitemap por ambiente |
| GEO-01 | HTML público, `LegalService`, crawlers de busca e `llms.txt` opcional; sem criar API, blog ou schema fictício |
| ANALYTICS-01 | GA4 próprio do Delano, CMP nova e eventos de intenção de contato; sem `generate_lead` no MVP atual |
| ANALYTICS-02 | Remover `@vercel/analytics` do escopo. Avaliar métricas do provedor definitivo somente após sua escolha; Netlify Observability/Web Analytics são referências da hospedagem temporária |
| ACCESS-01 | Não existe painel administrativo do site. Documentar somente procedimento de acesso aos serviços externos, sem segredos |
| VERIFY-01 | Vitest/ESLint/build Vite, HTML inicial e testes HTTP na homologação e no provedor definitivo; sem comandos Next.js/monorepo/Vercel |

**Sequência definida pelo responsável:** preparar SEO/prévias/ambientes, confirmar hospedagem e domínio finais, adaptar a publicação e validar o site definitivo. Depois dessa validação, executar consentimento e medição quando as demais dependências da seção 10 estiverem disponíveis. O Marco B não começa durante a homologação no Netlify.

A alternativa de apenas SEO e Search Console reduz coleta e manutenção, mas não mede cliques de contato. Não há necessidade de migrar o framework para reproduzir a Bravite. A troca de hospedagem foi definida pelo responsável; o provedor final ainda depende de confirmação.

## 4. Configuração e contratos propostos

### 4.1. Ambientes

| Ambiente | Canonical | Origem de mídia | Indexação | GA4 |
| --- | --- | --- | --- | --- |
| Homologação atual no Netlify | Domínio profissional planejado, sem afirmar migração concluída | URL HTTPS do deploy efetivamente acessível | `noindex,follow` + header; sem anunciar sitemap no robots | Desativado |
| Deploy Preview / branch | Mesmo destino canônico planejado | URL do próprio deploy, quando disponível | Sempre noindex, ainda que alguém configure o flag de indexação | Desativado |
| Produção na hospedagem e domínio finais validados | Host profissional confirmado | Host canônico por padrão | Páginas públicas indexáveis; 404 sempre noindex | Desativado no lançamento inicial; implementação posterior no Marco B, com consentimento, ID próprio e habilitação explícita |
| Local | Origem profissional como fixture de SEO; mídia local servida normalmente | Origem HTTPS definida para o artefato de teste | Desativada por padrão | Desativado; testes usam transporte simulado |

Configuração pública: `VITE_SITE_ORIGIN`, `VITE_ASSET_ORIGIN`, `VITE_ALLOW_INDEXING`, `VITE_ANALYTICS_ENABLED`, `VITE_GA4_ID`. Os dois flags começam em `false`; o ID fica vazio até ser fornecido para Delano. Os flags são propostas deste plano e ainda não existem no projeto.

`vite.config.ts` deve ler uma allowlist de variáveis públicas e o contexto/URL do provedor. Na homologação Netlify, considerar `DEPLOY_PRIME_URL` e contexto; no destino definitivo, mapear as entradas equivalentes documentadas pelo provedor escolhido. Resolver os valores uma vez por configuração e injetar os mesmos valores nos builds cliente e servidor. Entradas do provedor são configuração de build, não dados a copiar indiscriminadamente para o navegador. `import.meta.env.PROD` isoladamente não distingue Preview de produção: ambos executam build de produção.

```ts
type SiteEnvironmentInput = {
  siteOrigin?: string; assetOrigin?: string; allowIndexing?: string;
  analyticsEnabled?: string; ga4Id?: string;
  deployContext?: string; deployUrl?: string;
}
type SiteEnvironment = Readonly<{
  siteOrigin: string; assetOrigin: string; indexable: boolean;
  analyticsEnabled: boolean; ga4Id: string | null;
}>
resolveSiteEnvironment(input: SiteEnvironmentInput): SiteEnvironment
```

Validar origens HTTPS sem credenciais, query, hash ou caminho; normalizar somente a barra final. Configuração inválida para um build indexável deve falhar, em vez de publicar canonical errado. Configuração analítica ausente/inválida desativa medição sem quebrar contato/navegação. Nenhuma senha ou chave de API em `VITE_*`.

### 4.2. Escopo das prévias por página

| Rota | Título proposto, preservando a intenção atual | Imagem proposta |
| --- | --- | --- |
| `/` | Delano Furtado \| Advogado em Volta Redonda | `/media/social-delano.png` |
| `/localizacao` | Localização \| Delano Furtado — Volta Redonda | `/media/social-localizacao.png` |
| `/contate-nos` | Contato \| Delano Furtado — Advocacia | `/media/social-contato.png` |

Manter as descrições factuais existentes como ponto de partida. Cards em PNG 1200 × 630, com identidade atual, logo preservado, texto legível e mídia real do acervo; não criar outro retrato do advogado nem apresentar uma foto temática como endereço real. A imagem da Home continua sendo fallback quando faltar card específico. Os nomes de arquivo propostos só passam a ser anunciados após os arquivos existirem.

### 4.3. Dicionário de eventos

| Evento | Gatilho único | Parâmetros próprios permitidos |
| --- | --- | --- |
| `page_view` | Página pública atual após concessão e cada mudança real de página | `page_path`, `page_location`, `page_title`, `page_referrer` sanitizados |
| `whatsapp_click` | Link de WhatsApp ativado | `page_path`, `link_location` |
| `phone_click` | Link `tel:` ativado | `page_path`, `link_location` |
| `email_click` | Link `mailto:` ativado | `page_path`, `link_location` |
| `map_click` | Abertura do Google Maps | `page_path`, `link_location` |
| `review_click` | Link de consulta/avaliação Google ativado | `page_path`, `link_location` |

`link_location` é enum fechado: `header`, `hero`, `about`, `coverage`, `contact_section`, `contact_page`, `location_page`, `floating`, `footer`, `reviews`. Instrumentar apenas combinações que realmente existam no DOM.

Não enviar href completo, telefone, e-mail, mensagem codificada do WhatsApp, texto de DOM, autor de avaliação, query/hash, identificador de usuário ou descrição de caso. Não medir abertura de áreas jurídicas como categoria individual nesta etapa. `cta_click` genérico não duplica `whatsapp_click`; `generate_lead` fica reservado para eventual confirmação real de serviço futuro.

## 5. Mapa de arquivos

Todos os itens desta tabela são trabalho futuro, salvo os documentos desta entrega.

| Caminho | Responsabilidade / ação |
| --- | --- |
| `src/config/siteEnvironment.ts` — criar | Resolver e validar configuração pública, como função pura |
| `src/config/siteConfig.ts` — criar | Exportar `siteEnvironment` resolvido a partir dos valores públicos do build |
| `vite.config.ts`, `.env.example`, `netlify.toml` e configuração do provedor definitivo a definir | Propagar a mesma configuração para cliente/SSR e separar contextos; adaptar regras ao destino confirmado |
| `src/content/seo.ts`, `src/entry-server.tsx`, `RouteSeo.tsx` | Consumir configuração, metadados completos e grafo JSON-LD consistente |
| `scripts/prerender.mjs`, `scripts/verify-build.mjs`, `scripts/verify-preview.mjs` | Gerar e verificar políticas por ambiente, HTML e mídia absoluta |
| `scripts/prepare-assets.mjs`, `src/content/media.ts`, `public/media/social-*.png` | Cards sociais e inventário, preservando originais |
| `src/content/crawlerPolicy.ts` — criar | Política explícita de busca e decisão separada de treinamento |
| `src/consent/storage.ts`, `ConsentProvider.tsx`, `ConsentControls.tsx` — criar | Preferência versionada, contexto React e interface acessível |
| `src/content/privacyContent.ts`, `src/pages/Privacy/index.tsx`, `src/pages/Cookies/index.tsx` — condicionais | Textos aprovados e políticas reais antes de ativar GA4 |
| `src/analytics/contracts.ts`, `ga4.ts`, `AnalyticsBridge.tsx` — criar | Allowlist, sanitização, ciclo de vida da tag e navegação |
| `src/App.tsx`, `src/components/SiteLayout/index.tsx`, `Footer.tsx` | Montar preferências/medição e oferecer acesso permanente às preferências |
| `ContactCta.tsx`, `ContactChannels.tsx`, seções e páginas com links | Parâmetros explícitos de posição e um handler por interação |
| `src/routes/routeManifest.ts`, `routes.tsx` | Adicionar políticas somente quando conteúdo aprovado estiver implementado |
| `src/test/seo-environment.test.ts`, `seo-metadata.test.tsx`, `consent.test.tsx`, `analytics.test.tsx` — criar | Contratos novos; manter testes existentes de prerender/hidratação/rotas |
| `docs/analytics-e-consentimento.md`, `docs/politica-de-rastreamento.md` — criar na execução | Operação, eventos, configuração e decisões sem segredos |
| `docs/evidencias/seo-003.md` — criar na execução | Resultados efetivos; não confundir com o release histórico `release-003.md` |

## 6. Marco A — SEO, compartilhamento e descoberta

### ENV-01 — Origem e indexabilidade por ambiente (P0)

**Responsáveis:** Arquitetura + Release. **Depende de:** diagnóstico acima; confirmar hospedagem e domínio finais antes de adaptar a produção e liberar indexação.

**Interfaces:** produz `resolveSiteEnvironment` e `siteEnvironment` da seção 4.1, consumidos por SEO, prerender e analytics.

- [ ] Criar `seo-environment.test.ts` com casos: homologação sem flags; `deploy-preview`/`branch-deploy` com flag indevidamente true; origem com credenciais/query; produção com origem HTTPS válida; ID GA4 ausente. Esperar noindex/analytics desligado nos primeiros ambientes, rejeição da origem inválida e origem normalizada no caso válido.
- [ ] Executar `npm run test:run -- src/test/seo-environment.test.ts`; observar a falha antes de implementar.
- [ ] Implementar os dois módulos de configuração e conectar `vite.config.ts` aos mesmos valores nos builds cliente/SSR; criar `.env.example` sem ID real ou segredos. Não substituir amplamente `process.env` no bundle.
- [ ] Acrescentar defaults de homologação e overrides de contextos no `netlify.toml`; só habilitar produção indexável após o gate de domínio em VERIFY-01.
- [ ] Após a escolha da hospedagem definitiva, consultar sua documentação e adaptar build, variáveis, HTML por rota, redirects, 404, headers e cache. Não presumir que o novo provedor interpreta `netlify.toml` ou `_headers`; manter GA4 desligado nessa publicação inicial.
- [ ] Reexecutar teste e build, comprovando que os valores de SEO no HTML inicial coincidem com os usados pelo cliente. Registrar o diff de configuração; commit sugerido `feat: configura origens e indexacao por ambiente`.

**Aceite:** ambiente temporário não fica indexável por acidente; configuração é única e reproduzível, sem usar a origem do navegador como correção tardia do canonical.

### LINK-01 — Prévias sociais e imagens acessíveis (P0)

**Responsável:** SEO + Frontend; mídia com UX/UI. **Depende de:** ENV-01.

**Interfaces:** preservar `getSeo(pathname)` e `renderSeoHead(seo)`; permitir ambiente explícito em testes com `getSeo(pathname: string, environment: SiteEnvironment = siteEnvironment): SeoMetadata`. Ampliar `SeoMetadata` com alt, largura, altura, tipo da imagem e `jsonLd: Record<string, unknown> | null`; `renderSeoHead` recebe o grafo já resolvido em vez de buscar um host global diferente. Usar `siteOrigin` para canonical/`og:url` e `assetOrigin` para imagens durante a homologação.

- [ ] Criar `seo-metadata.test.tsx`: três páginas com title/description próprios; canonical em `siteOrigin`; imagem absoluta em `assetOrigin`; `og:site_name`, `og:locale=pt_BR`, `og:type=website`, alt/dimensões e `twitter:card=summary_large_image` presentes uma única vez.
- [ ] Executar o teste contra o código atual; confirmar falhas de campos/origem em vez de teste que só procura qualquer tag.
- [ ] Completar `seo.ts` e o head de prerender/navegação, incluindo `og:image:alt`, `og:image:width=1200`, `og:image:height=630`, `og:image:type=image/png` e `twitter:image:alt`. Não trocar metadados somente depois do JavaScript.
- [ ] Produzir os cards aprovados pelo pipeline de mídia, atualizar `media.ts` e conferir integridade dos originais. Verificar GET anônimo de cada imagem: HTTP 200, MIME de imagem, bytes e dimensões corretos; HTTP 200 com HTML de fallback é falha.
- [ ] Testar fallback de card indisponível no cadastro, alias de caixa/`index.html` e navegação repetida sem duplicar tags. Rodar testes, `build` e `verify:build`; commit sugerido `feat: completa previas sociais do Delano`.

**Aceite:** as três URLs compartilham a informação da própria página e todas as imagens anunciadas são buscáveis no host correto, inclusive antes da migração DNS. Inspeção de cache social fica em VERIFY-01; não prometer aparência idêntica entre plataformas.

### SEO-01 — Canonical, sitemap, robots e schema (P0)

**Responsáveis:** SEO + Arquitetura + Release. **Depende de:** ENV-01/LINK-01.

**Interfaces:** o renderizador deve exportar a configuração efetiva para `prerender.mjs`. O gerador usa `publicRoutes` como inventário; helpers de SEO aceitam a mesma configuração. Dados estruturados precisam carregar URLs e imagens desse ambiente, sem manter um objeto global com host antigo.

- [ ] Cobrir em testes o mesmo caminho em produção e homologação: noindex correto, um canonical, schema coerente com conteúdo visível e 404 sem schema de negócio. Cobrir URL conhecida com query/hash/caixa sem criar uma nova URL no sitemap.
- [ ] Evoluir o `LegalService` existente e, quando úteis, nós `WebSite`/`WebPage` com `@id` estável e referências entre si. Não duplicar o negócio com uma segunda `Organization` desconectada. Preservar nome, OAB no conteúdo, endereço, telefone, regiões e redes confirmadas.
- [ ] Manter fora do schema horários/preços/coordenadas não confirmados, `FAQPage`/`Article` sem conteúdo próprio e estrelas `Review`/`AggregateRating` do próprio escritório. Avaliações visíveis continuam separadas desse recurso de busca; manter a asserção atual que impede `aggregateRating`.
- [ ] Gerar, em produção indexável, sitemap somente com URLs canônicas realmente publicadas; não incluir âncoras, aliases, 404, datas fabricadas nem sete páginas de serviços inexistentes.
- [ ] Em builds não indexáveis, gerar meta e `dist/_headers` com `X-Robots-Tag: noindex, follow`, sitemap vazio válido e robots sem linha `Sitemap`. Manter rastreamento permitido para que o robô veja o noindex. Em produção indexável, gerar robots com sitemap correto e retirar o header temporário do artefato limpo.
- [ ] Validar duas saídas consecutivas, primeiro homologação e depois produção: nenhuma política noindex deve sobreviver por arquivo residual. No Netlify, não tentar definir `[[headers]]` dentro de um contexto: headers declarados no TOML são globais. Gerar o `_headers` apropriado no build, mantendo os headers de segurança/cache existentes.
- [ ] Rodar testes, build/verificadores e validação JSON-LD. Commit sugerido `feat: alinha sitemap robots e schema aos ambientes`.

**Aceite:** o HTML direto, a navegação React, imagens, sitemap e JSON-LD concordam; o ambiente temporário fica noindex sem depender de robots para esconder URLs. Validade do schema não é garantia de rich result.

### LOCAL-01 — Conteúdo e presença local (P1, sem expansão de páginas)

**Responsável:** SEO & Content. **Depende de:** SEO-01 para aferir HTML final.

- [ ] Conferir NAP — nome, endereço e telefone — nas três páginas, schema e fontes. Preservar foco em Volta Redonda e atendimento presencial no RJ/online no Brasil, sem repetir listas de cidades artificialmente nos títulos.
- [ ] Mapear a Home para atuação jurídica geral e os sete serviços; localização para endereço/acesso; contato para canais. Não criar páginas por cidade/serviço apenas para multiplicar palavras-chave.
- [ ] Revisar `reviews.ts`: fonte e data de coleta, textos preservados, datas relativas que envelhecem e clones do carrossel. Propor apresentação temporal vinculada à coleta ou remoção da data relativa; não inventar datas exatas ou consultar ficha por scraping recorrente.
- [ ] Conferir ficha Google do escritório quando houver acesso do responsável: nome/endereço/telefone, URL do site e links existentes. Preparar correções concretas para revisão; alteração externa da ficha não é automática neste plano.
- [ ] Verificar sem JavaScript que serviços, apresentação profissional e contatos constam no HTML, mesmo com animações/desdobramentos desativados. Registrar itens editoriais efetivamente alterados, sem criar testes que apenas comparem uma troca de texto consigo mesma.

**Aceite:** conteúdo e entidade local coerentes, sem alegações ou páginas novas para preencher o modelo da Bravite.

### GEO-01 — Busca por IA e política de rastreamento (P1)

**Responsável:** SEO + Release. **Depende de:** SEO-01; política de treinamento depende do proprietário.

- [ ] Criar `crawlerPolicy.ts` com política declarativa e gerar robots a partir dela. A proposta para busca permite Googlebot, OAI-SearchBot e PerplexityBot no conteúdo público. Se forem criados grupos específicos, repetir neles as restrições necessárias: um grupo específico não herda automaticamente o grupo `*`.
- [ ] Registrar separadamente em `docs/politica-de-rastreamento.md` a escolha sobre GPTBot e Google-Extended. Até essa escolha, preservar o comportamento anterior desses tokens, explicitando que `Allow: /` atual já permite acesso a crawlers conformes; não chamar ausência de regra de bloqueio de treinamento nem de aprovação expressa do proprietário.
- [ ] Diferenciar Googlebot/recursos de IA da Busca de Google-Extended, que rege outros usos de treinamento/grounding. Não anunciar Google-Extended como requisito de Google Search. Ver [pesquisa primária](../docs/referencias-seo-busca-ia.md).
- [ ] Testar a saída dos grupos do robots, incluindo a política escolhida para treinamento e ausência de rotas `/api`/admin fictícias. Não usar robots como autenticação ou local para guardar caminhos secretos.
- [ ] Conferir acesso ao HTML/recursos e, quando disponíveis, logs/Observability de crawlers legítimos. Um user agent simulado testa resposta, não prova identidade ou visita real; usar informações oficiais ao revisar bloqueios, sem desabilitar proteções globalmente.
- [ ] Tratar `llms.txt` como experimento opcional: se escolhido, gerar somente em produção indexável, com nome do escritório, resumo factual e links das três rotas existentes. Sem depoimentos copiados, dados de casos, novas páginas `.md` ou promessas de citação. Acrescentar verificação de links e atualização conjunta ao sitemap.
- [ ] Registrar resultado e commit sugerido `feat: documenta e aplica politica de busca publica`, sem afirmar inclusão nos resultados de IA.

**Aceite:** acesso técnico e conteúdo compreensível, políticas de busca/treinamento separadas e nenhum mecanismo experimental apresentado como requisito ou garantia de ranking.

## 7. Marco B — Consentimento e Analytics próprios

Este marco não bloqueia a entrega do Marco A. Por definição do responsável, sua implementação começa somente após a hospedagem definitiva e o domínio final estarem publicados e validados no gate de VERIFY-01. Propriedade GA4 do Delano, textos aprovados e demais decisões da seção 10 continuam necessários. Durante a homologação, manter somente o planejamento dos eventos; não instalar tag, ativar coleta ou implementar este marco antecipadamente. Não colocar um ID fictício para satisfazer testes ou transportar o da Bravite.

### CONSENT-01 — Preferências e informações de privacidade (P1 condicionado)

**Responsáveis:** Frontend + Segurança + UX/UI. **Depende de:** decisões da seção 10, ENV-01 e publicação validada na hospedagem/domínio definitivos em VERIFY-01 (Marco A).

**Contrato proposto:** `AnalyticsConsent = 'unknown' | 'denied' | 'granted'`; `useConsent()` expõe `analytics: AnalyticsConsent`, `setAnalytics(value: 'granted' | 'denied'): void` e `openPreferences(): void`. `readConsent(storage: Pick<Storage, 'getItem'> | null, now: number): ConsentRecord | null` só aceita registro íntegro na versão vigente; ausência/invalidez vira `unknown`. `ConsentRecord` contém `version: 1`, `analytics: 'granted' | 'denied'`, `decidedAt` e `expiresAt` como timestamps numéricos. Chave local `delano:consent:v1`, sem identificador individual. Validade proposta de 180 dias é decisão de produto revisável, não prazo legal certificado.

- [ ] Criar `consent.test.tsx` cobrindo primeira visita, registro rejeitado/vencido/corrompido, versão incompatível, storage indisponível, mudança em outra aba e SSR sem `window`. Executar e observar RED antes da implementação.
- [ ] Implementar armazenamento e provider com estado inicial determinístico para hidratação; nenhuma tag carregada na leitura inicial. Storage indisponível mantém o site utilizável e não autoriza análise por inferência.
- [ ] Implementar controles em pt-BR com aceitar/recusar análise em condições equivalentes e preferências reabríveis pelo rodapé. Permitir leitura/navegação sem aceitar. Testar teclado, foco, nomes acessíveis e 320–1440 px, sem sobrepor WhatsApp ou selo Netlify.
- [ ] Produzir textos próprios com finalidade, fornecedor, dados efetivamente medidos, escolha/revogação e retenção configurada. Revisar com o responsável antes de publicar; o plano não certifica conformidade jurídica.
- [ ] Após aprovação dos textos, implementar `/politica-de-privacidade` e `/politica-de-cookies` usando os layouts atuais. Atualizar manifest, rotas, metadados, sitemap e verificadores juntos. Até existirem, não criar links quebrados nem anunciar cinco rotas implementadas. Não indexar rascunhos.
- [ ] Cobrir expiração e troca de versão durante uso da página, não somente no próximo carregamento. Executar testes/SSR/hidratação e registrar commit sugerido `feat: adiciona preferencias de analise e politicas`.

**Aceite:** ausência/rejeição/vencimento não permite coleta; preferência pode ser alterada e as informações publicadas descrevem a integração real.

### ANALYTICS-01 — GA4, navegação e intenção de contato (P1 condicionado)

**Responsáveis:** Frontend + Segurança + QA. **Depende de:** CONSENT-01, ID próprio e publicação validada na hospedagem/domínio definitivos em VERIFY-01 (Marco A).

**Interfaces:** `trackContact(event: ContactEvent, location: LinkLocation, pathname: string): void`; `ContactEvent`/`LinkLocation` seguem a tabela 4.3. `AnalyticsBridge` fica dentro do Router/ConsentProvider e observa a rota canônica. O transporte tem guard de ambiente/consentimento e uma inicialização idempotente por documento.

- [ ] Criar testes com transporte simulado e carregamento assíncrono controlado: zero chamadas/script nos estados não autorizados, ID ausente ou preview; uma tag sob StrictMode; callback tardio inerte após revogação; navegação preservada quando a tag falha.
- [ ] Implementar Google tag em modelo básico de consentimento: não fazer nem preconnect, preload, download ou ping para Google antes de concessão. `ad_storage`, `ad_user_data` e `ad_personalization` permanecem negados; definir `allow_google_signals: false` e `allow_ad_personalization_signals: false`. Sem Ads, User-ID, remarketing ou medição aprimorada de dados fornecidos pelo usuário.
- [ ] Configurar `send_page_view: false` em cada inicialização e desativar na propriedade GA4 a medição automática de mudanças do histórico. Desativar também coleta automática de cliques externos/formulários/pesquisa e outras medições não planejadas que possam capturar hrefs/textos. Não duplicar instalação por GTM, snippet do painel Netlify ou componente separado.
- [ ] Construir `page_location` a partir de origem aprovada + rota canônica; `page_title` vem do cadastro de SEO. Não ler título arbitrário ou `location.href` bruto. Omitir referrer inicial externo e usar somente rota interna anterior sanitizada quando necessário; atualizar o contexto sanitizado antes de config/eventos automáticos da tag.
- [ ] Testar a sequência: concessão em `/localizacao` envia um page view dessa página, sem reproduzir visitas anteriores; ir a contato e voltar à localização envia duas novas visualizações. Âncoras/query/aliases da mesma página não geram views; caminhos desconhecidos não enviam o texto da URL. Não deduplicar globalmente uma rota para sempre.
- [ ] Instrumentar `ContactCta`, canais e links concretos com enum de posição, incluindo Hero, header, flutuante e páginas. Testar clique em ícone aninhado sem emissão dupla e abertura normal do destino, sem `preventDefault`, espera de rede ou envio de mensagem real. Não inferir evento a partir de varredura global de hrefs.
- [ ] Conferir payloads com uma URL de teste contendo query/hash sintéticos: nenhum nome, telefone, e-mail ou texto de caso pode sair em page view, referrer, clique, parâmetros automáticos ou dimensões. Não gerar um `generate_lead` para comprovar medição.
- [ ] Implementar revogação com guard síncrono, invalidação da geração do loader, limpeza de filas/listeners e `ga-disable-<ID>`. Remover script isoladamente não descarrega o SDK já executado: para o contrato de bloqueio estrito, persistir a negativa e recarregar o documento após revogar. Limpar cookies próprios de GA acessíveis no domínio/caminho controlados. Não prometer desfazer requisições já enviadas ou apagar cookies de terceiros inacessíveis.
- [ ] Testar rejeição/revogação em outra aba e concessão seguida de revogação antes do `onload`. Depois do reload, nenhum envio novo; não reenfileirar cliques ocorridos sem consentimento. A indisponibilidade de storage não pode impedir a revogação efetiva.
- [ ] Validar em Tag Assistant/DebugView/Realtime com tráfego autorizado. Registrar dimensões `link_location`/`page_path` se necessárias. Marcar `whatsapp_click` como evento principal somente se o responsável escolher esse indicador de intenção, identificando que não mede contato confirmado. Commit sugerido `feat: integra GA4 com consentimento e eventos de contato`.

**Aceite:** um único fluxo de page views e cliques autorizados, sem dados pessoais ou URLs arbitrárias; revogação efetiva no documento subsequente e sem falsa confirmação de lead. O navegador pode bloquear analytics; isso não bloqueia o atendimento.

### ANALYTICS-02 — Medição do provedor (P2, opcional)

**Responsável:** Release + Segurança. **Depende de:** escolha da hospedagem definitiva, necessidade operacional e avaliação do plano contratado.

- [ ] Não instalar `@vercel/analytics`: o aplicativo não está na Vercel e esse item não é necessário ao GA4.
- [ ] Conferir recursos disponíveis no provedor definitivo para requests, erros e crawlers. As referências de Netlify Observability/Web Analytics descrevem a hospedagem temporária; não contratar métricas nessa plataforma como solução definitiva. Consultar a documentação do destino confirmado antes de propor contratação.
- [ ] Registrar a diferença entre requests HTTP do CDN, navegação SPA, visitantes estimados e cliques GA4. Não esperar números iguais entre ferramentas nem usar logs como conversões de contato.
- [ ] Se houver opção de habilitar medição adicional do provedor, apresentar custo/retenção/fluxo de dados para decisão do responsável e atualizar a informação de privacidade. Consentimento do navegador não suspende logs/coleta do servidor; não alegar que o toggle local controla essa ferramenta.

**Aceite:** escolha documentada, sem pacote redundante nem assinatura ou coleta adicional ativada por esta elaboração de plano.

### ACCESS-01 — Acesso operacional sem segredos (P1 documental)

**Responsáveis:** Release + Technical Writer.

- [ ] Documentar em `docs/analytics-e-consentimento.md` como localizar a hospedagem definitiva, a homologação Netlify, propriedade GA4 e propriedade Search Console quando existirem, com papéis de acesso necessários. IDs públicos de medição não são senhas; valores privilegiados ficam no gerenciador de credenciais autorizado.
- [ ] Não criar painel/login/rota opaca para reproduzir a Bravite. Não transportar `ADMIN_PANEL_PATH`, hash de senha, Neon ou bootstrap inexistentes.
- [ ] Revisar docs, exemplos, prints e logs: nenhum token, cookie autenticado, senha, endereço de cofre sensível ou dado de consulta jurídica. Evidência de GA4 deve usar tráfego sintético e sem dados de visitantes reais.

**Aceite:** procedimento reproduzível de acesso aos serviços efetivos, sem documentação privada presumida dentro do Git público.

## 8. VERIFY-01 — Verificação, domínio e publicação

**Responsáveis:** QA + SEO + Release. **Depende de:** tarefas do marco que será publicado; dependências de Analytics só afetam o Marco B.

### Verificação local e do artefato

- [ ] Corrigir primeiro a extração de H1 em `verify-preview.mjs`: interpretar o texto do H1, removendo elementos internos/normalizando espaços, sem aceitar qualquer texto fora dele como título. Criar regressão com os spans reais da Hero.
- [ ] Tornar a matriz de títulos/rotas explícita por pathname, em vez de arrays dependentes de ordem. Atualizar a expectativa do sitemap conforme `publicRoutes` e indexabilidade; políticas só aumentam a quantidade quando publicadas.
- [ ] Acrescentar ao verificador GET de imagens absolutas, MIME e resposta HTTP; testar com um endpoint que devolve 200/HTML para garantir que o fallback não seja aceito como imagem.
- [ ] Verificar produção e homologação em builds distintos: meta, headers gerados, sitemap, robots, eventual llms e ausência de tag GA4 no HTML inicial. O smoke test deve receber o perfil esperado, sem exigir `index,follow` de um preview.
- [ ] Rodar os scripts existentes: `npm run test:run`, `npm run lint`, `npm run build`, `npm run verify:build`. Rodar testes focados de configuração/SEO/consentimento/analytics e manter prerender, hidratação e aliases sem regressões.
- [ ] Com preview ativo: `npm.cmd run preview -- --port 4173` e `npm run verify:preview -- http://127.0.0.1:4173`. Se localhost for bloqueado pelo ambiente, registrar o limite e validar o mesmo artefato em deploy temporário, sem declarar o teste local aprovado.
- [ ] Inspecionar desktop/mobile, teclado e movimento reduzido; políticas/preferências não cobrem conteúdo ou WhatsApp. Comparar carregamento da Hero atual, espaço reservado e custo dos scripts; metas de campo continuam LCP ≤ 2,5 s, INP ≤ 200 ms e CLS ≤ 0,1, sem usar uma nota de laboratório como certificação.

### Gate de domínio e indexação

- [ ] Confirmar a hospedagem definitiva e se o destino canônico será `www.delanofurtado.adv.br` ou outro domínio confirmado pelo responsável; até isso, manter a proposta de homologação noindex e a origem de mídia acessível. Não promover o host temporário a canonical silenciosamente.
- [ ] Preparar backup dos registros e hospedagem atuais, vínculo de domínio no provedor definitivo e procedimento de restauração. Migração DNS é ação separada: preservar MX/TXT/SPF/DKIM/DMARC e não trocar nameservers por conveniência.
- [ ] Quando a migração estiver autorizada, conferir propriedade de domínio, HTTPS e entrega das três páginas/arquivos no host final antes de liberar indexação. Atualizar `assetOrigin` para o host final; testar novamente a URL social que hoje retorna 404.
- [ ] Ativar indexação somente no artefato do domínio confirmado e conferir remoção de meta/header noindex temporários. Após o domínio final funcionar, configurar redirect do host Netlify principal e dos aliases profissionais para a origem canônica, preservando path/query; posicionar as regras de host antes das regras de caminho/404. Não aplicar isso às URLs de Deploy Preview nem criar redirect que impeça a validação antes do cutover.
- [ ] Validar HTTP 200 das páginas/recursos, 404 real, aliases e redirects de host. Conferir origem única em canonical, sitemap, OG e JSON-LD no HTML inicial e após navegação.
- [ ] Registrar hospedagem final, domínio, versão publicada e evidências de HTTPS, páginas, contatos e mídia aprovados. Somente esse registro libera o início de CONSENT-01/ANALYTICS-01; no lançamento inicial, GA4 permanece desativado.

### Ferramentas externas e encerramento

- [ ] Validar JSON-LD no Schema Markup Validator e, para recursos suportados, no Rich Results Test. Distinguir ausência de elegibilidade a estrelas de erro sintático.
- [ ] Testar Home/localização/contato em Meta Sharing Debugger e LinkedIn Post Inspector quando houver acesso; realizar compartilhamento de teste autorizado no WhatsApp. Recaptura/cache de cada aplicativo é externa ao build. Nenhuma mensagem será enviada a terceiros só para fabricar evidência.
- [ ] Verificar propriedade Search Console no domínio correto e enviar somente o sitemap indexável. Usar URL Inspection e relatório de indexação; uma resposta 200 ou sitemap acessível não comprova indexação.
- [ ] Para Marco B, concluir a matriz de rede sem consentimento, com consentimento, após revogação, em outras abas e com falha de tag. Confirmar ingestão no GA4; se faltar acesso ao painel, registrar integração local validada e ingestão pendente.
- [ ] Atualizar as guidelines responsáveis, `plans/README.md` e `docs/evidencias/seo-003.md` com comandos, status reais, commit/deploy, URLs, prints sem dados pessoais, decisões de bots e pendências. Não reescrever as evidências históricas do MVP/release.
- [ ] Preparar commit do marco, enviar/publicar quando a execução estiver autorizada, aguardar deploy aprovado e repetir os checks HTTP. Rollback usa deploy anterior aprovado + correção/revert rastreável; se GA4 apresentar problema, desativar flag e redeploy sem retirar os canais de contato.

**Aceite do Marco A:** origem e imagens acessíveis, homologação protegida de indexação, HTML/SEO/schema/robots/sitemap coerentes e evidência dos validadores efetivamente usados. A publicação definitiva só fica concluída quando o gate acima for executado no provedor e domínio finais. O GA4 continua desativado nesse lançamento; esse aceite libera a etapa posterior do Marco B.

**Aceite do Marco B:** políticas e consentimento publicados, GA4 próprio validado, page views/eventos únicos e sanitizados, revogação conferida e nenhuma funcionalidade de atendimento dependente da tag. Web Analytics e llms.txt continuam opcionais.

## 9. Sequência e critérios de pausa

```text
ENV-01 → LINK-01 + SEO-01 → LOCAL-01 + GEO-01 → VERIFY-01 (Marco A)
Confirmar hospedagem/domínio → adaptar publicação → publicar e validar destino final (gate de VERIFY-01 / Marco A)
Gate final aprovado + decisões externas → CONSENT-01 → ANALYTICS-01 → VERIFY-01 (Marco B)
ACCESS-01 acompanha ambos; ANALYTICS-02 é uma escolha operacional independente.
```

Dependência ausente deve parar somente a etapa afetada: sem hospedagem/domínio definitivos publicados e validados, não iniciar o Marco B; sem GA4, terminar SEO; sem autorização DNS, manter homologação correta; sem escolha sobre treinamento, registrar a política herdada sem inventar aprovação; sem acesso a Search Console, entregar testes técnicos e marcar a confirmação externa pendente. Nenhum checkbox representa implementação concluída nesta entrega documental.

## 10. Dependências e decisões do responsável

| Item ainda necessário | Consequência / tratamento até existir |
| --- | --- |
| Hospedagem definitiva confirmada e regras adaptadas | Bloqueia publicação definitiva e implementação do Marco B; Netlify permanece temporário |
| Destino canônico final e autorização de migração | Bloqueia cutover/indexação do novo domínio e implementação do Marco B; não bloqueia corrigir imagens e homologação |
| Publicação definitiva validada em VERIFY-01 (Marco A) | Pré-requisito explícito para iniciar consentimento, GA4 e eventos dos botões; manter coleta desativada até a etapa posterior |
| Propriedade e stream GA4 próprios, ID e acesso de edição | Bloqueia ativação/DebugView; nenhum ID da Bravite como fallback |
| Conteúdo e operação das políticas de privacidade/cookies | Bloqueia ativação de medição; não publicar texto jurídico fictício |
| Retenção GA4, indicadores principais e validade das preferências | Configurar valores reais e publicá-los nas informações ao visitante antes da ativação |
| Política GPTBot/Google-Extended | Escolha separada de busca; registrar a regra herdada e a decisão futura |
| Acesso Search Console/ficha Google quando aplicável | Confirmação de indexação e alterações externas ficam pendentes |
| Interesse e condições de métricas do provedor definitivo | Avaliar após a escolha da hospedagem; sem contratação no Netlify como solução final nem alegação de ativação por inferência |
| Interesse no experimento llms.txt | Omitir o arquivo até uma escolha explícita na execução |

## 11. Documentação consultada

### Context7 — consultas realizadas em 23/10/2026

Foram resolvidos os identificadores abaixo e consultada a documentação de cada um. As respostas foram usadas como base técnica; não são prova de execução do plano.

| Biblioteca / ID retornado | Achado aplicado | Fonte primária retornada |
| --- | --- | --- |
| Vite — `/vitejs/vite` | `VITE_*` exposto no bundle, substituído no build; mesma configuração pública nos dois builds; nenhum segredo | [Env and Mode](https://github.com/vitejs/vite/blob/main/docs/guide/env-and-mode.md), [envPrefix](https://github.com/vitejs/vite/blob/main/docs/config/shared-options.md#envprefix) |
| Netlify — `/websites/netlify` | Deploy Preview tem noindex automático, mas branch recente/principal pode indexar; contextos não tornam headers TOML locais ao contexto | [Deploy overview](https://docs.netlify.com/deploy/deploy-overview/#search-engine-indexing), [Custom headers](https://docs.netlify.com/manage/routing/headers/) |
| Google Analytics — `/websites/developers_google_analytics_devguides` | `send_page_view: false` não desliga por si só os page views de histórico de Enhanced Measurement | [Measure pageviews](https://developers.google.com/analytics/devguides/collection/ga4/views) |

A consulta GA4 retornou detalhes de page views, sem cobrir suficientemente o bloqueio pré-consentimento. Esse ponto foi complementado diretamente na documentação Google; não atribuir ao Context7 uma resposta que ele não forneceu.

### Complementos primários

- [Consent Mode — básico e avançado](https://developers.google.com/tag-platform/security/concepts/consent-mode): o modelo básico pode bloquear a tag; o avançado transmite sinais mesmo com armazenamento negado. A proposta deste plano usa bloqueio estrito.
- [Controles de privacidade da Google tag](https://developers.google.com/tag-platform/security/guides/privacy): desativação de Signals/personalização e flag `ga-disable-<ID>`, complementados pelo guard da aplicação e reload na revogação estrita.
- [PII no Analytics](https://support.google.com/analytics/answer/6366371): URLs, títulos e parâmetros precisam de tratamento, não somente campos de formulário.
- [noindex](https://developers.google.com/search/docs/crawling-indexing/block-indexing) e [robots](https://developers.google.com/search/docs/crawling-indexing/robots/intro): restringir rastreamento não substitui impedir indexação; o robô precisa ler o noindex.
- [Netlify Web Analytics](https://docs.netlify.com/manage/monitoring/web-analytics/overview/) e [Observability](https://docs.netlify.com/manage/monitoring/observability/overview/): medição do servidor e requests diferem de navegação SPA/eventos no cliente; verificar disponibilidade antes de habilitar.
- [Review snippets](https://developers.google.com/search/docs/appearance/structured-data/review-snippet) e [LocalBusiness](https://developers.google.com/search/docs/appearance/structured-data/local-business): avaliações do próprio negócio não tornam o site elegível automaticamente a estrelas.
- [Pesquisa primária sobre busca por IA](../docs/referencias-seo-busca-ia.md): Google AI features, crawlers OpenAI/Perplexity, LegalService e limites de llms.txt, com fontes e implicações registradas.

## 12. Fora do escopo e revisão do plano

Ficam fora desta execução planejada: garantia de ranking/citação, campanhas/Ads/pixels, remarketing, CRM, chatbot, formulário/backend, área administrativa, páginas artificiais de cidades, artigos/cases inexistentes, estrelas fabricadas, migração para Vercel/Next e exposição de credenciais. Uma futura coleta de formulário precisará de plano próprio antes de usar `generate_lead`.

Revisão documental realizada: todos os blocos da referência Bravite foram mapeados; caminhos existentes confrontados com o baseline; tarefas novas têm dependências e aceite; fontes Context7/primárias identificadas; trabalho implementado separado de decisões propostas. Testes e deploy descritos acima são passos futuros, não resultados desta entrega.
