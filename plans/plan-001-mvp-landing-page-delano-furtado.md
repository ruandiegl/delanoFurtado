# MVP da landing page Delano Furtado — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task, conforme o método de execução autorizado e as ferramentas disponíveis. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir o MVP WEB responsivo de Delano Furtado com a composição visual do Behance, o conteúdo e os materiais reais já coletados, canais oficiais utilizáveis e animações de scroll acessíveis com GSAP React.

**Architecture:** React/TypeScript em Vite, conteúdo tipado separado das páginas, layout compartilhado e três rotas públicas preservadas. styled-components compõe a marca e shadcn/Base UI fornece os primitives necessários, compartilhando tokens CSS. GSAP atua somente no cliente; HTML público é pré-renderizado no build e hidratado no navegador, sem backend de aplicação no MVP.

**Tech Stack:** React/DOM 19, TypeScript 6 estrito, Vite 8, React Router DOM 6, styled-components 6, shadcn/Base UI, Tailwind 4, Lucide, Manrope local, GSAP 3 + `@gsap/react` + ScrollTrigger, ESLint, Vitest/Testing Library/jsdom; npm. Ferramentas de desenvolvimento adicionais delimitadas na seção 6.

**Spec:** [Índice e guidelines](../docs/README.md), [design Behance](../docs/01-referencia-design-advocacia.md), [conteúdo Delano](../docs/02-conteudo-site-delano-furtado.md), [design system](../docs/design-system.md), [arquitetura](../docs/arquitetura.md), [rotas](../docs/rotas-e-conteudo.md), [movimento](../docs/movimento-e-gsap.md) e as decisões detalhadas deste plano. Ler as fontes junto do plano.

**Data:** 22/10/2026. **Estado:** MVP local concluído e verificado; revisão independente e correções encerradas em 22/10/2026. Evidências em [mvp-001](../docs/evidencias/mvp-001.md). **Tarefa preenchida:** estruturar o MVP da landing page de advocacia com design Behance, conteúdo Delano, frontend orientado por UI/UX Pro Max e scroll com GSAP React.

## Global Constraints

- Produto WEB em português do Brasil; trabalhar nesta raiz e preservar `docs/`, `agents/`, `plans/` e os originais.
- Base técnica conforme a stack documentada; Node 22.x a partir de 22.12, sujeito aos engines efetivamente resolvidos.
- Usar npm e `package-lock.json`; versões da auditoria são referência, não dependências já instaladas aqui.
- “O logo preto/dourado deve manter sua integridade.”
- “Não reduzir ou substituir esses originais para otimizar o frontend.” Criar derivados separados.
- “Preservar `/`, `/localizacao` e `/contate-nos`.”
- “TypeScript em `.ts` e `.tsx`, componentes funcionais React e módulos ES.”
- “A informação já deve estar visível e compreensível sem animação.”
- “A rolagem permanece nativa, salvo requisito específico documentado.” Neste MVP, permanece nativa.
- Dados profissionais vêm do documento 02. Manter sete blocos de serviços; não inventar avaliações, nota, casos, horários, títulos ou etapas de atendimento.
- GSAP é requisito explícito deste MVP: `useGSAP`, refs/scope, cleanup local, ScrollTrigger e `prefers-reduced-motion`.
- Backend, formulário com envio, login, banco, CMS, analytics e publicação não entram neste plano.

## Review Focus

1. **Preferência de movimento muda ou um controle recebe foco durante reveal:** conteúdo e controle ficam visíveis; cobrir na tarefa 8 e na inspeção da tarefa 10.
2. **StrictMode, troca de rota e remontagem repetida:** triggers/listeners não se duplicam nem afetam outra raiz; cobrir nas tarefas 8 e 10.
3. **URL direta, JavaScript desabilitado e hidratação:** HTML, estilos e conteúdo da rota continuam corretos, sem erro de classe/markup; cobrir na tarefa 9.
4. **Listas longas, nomes de serviços e largura de 320 px:** informações completas permanecem acessíveis, sem overflow; cobrir nas tarefas 5 e 10.
5. **Destinos de contato e endereço com acentos:** codificação correta, número oficial e ausência de confirmação fictícia de envio; cobrir nas tarefas 2, 7 e 10.

## 1. Agente responsável e forma de trabalho

**Responsável principal: [Software Architect](../agents/software-architect.md).** O MVP começa sem aplicação e envolve estrutura, fontes de conteúdo, rotas, integração de estilos, movimento e geração de HTML; por isso a coordenação técnica é mais adequada que delegar o plano inteiro somente ao Frontend.

| Função de apoio | Responsabilidade neste plano |
| --- | --- |
| [UX/UI Designer](../agents/ux-ui-designer.md) | Fidelidade à composição, tokens, hierarquia e responsividade, usando UI/UX Pro Max |
| [Frontend Engineer](../agents/frontend-engineer.md) | Aplicação, dados, primitives, seções e páginas |
| [Motion Engineer](../agents/motion-engineer.md) | useGSAP/ScrollTrigger, escopo, acessibilidade e cleanup |
| [SEO & Content](../agents/seo-content-specialist.md) | Sínteses com fonte, rotas e HTML/metadados por página |
| [QA](../agents/qa-engineer.md) e [Acessibilidade/Performance](../agents/accessibility-performance-engineer.md) | Contratos, uso real, teclado, scroll e medições |
| [Code Reviewer](../agents/code-reviewer.md) | Conferência final contra o pedido e as guidelines |

Os perfis orientam funções; não representam subagentes já executados. Recomendação para a implementação: execução sequencial por um implementador, com revisão final independente quando autorizada e disponível. As tarefas compartilham conteúdo, tokens e contratos; paralelismo de edição sem esses contratos prontos aumenta conflito. O usuário autorizou a execução deste plano em 22/10/2026.

## 2. Estado encontrado

- Raiz contém documentação, perfis de agentes e sete imagens originais. Não existem `package.json`, `src/`, aplicação instalada ou `.git`.
- Não havia pasta de planos numerados; por isso o identificador é **plan-001**.
- Runtime disponível na inspeção: Node **22.15.0**, npm **10.9.2**, Python **3.13**. Esses comandos apenas identificaram ferramentas.
- GSAP React e UI/UX Pro Max foram lidas nos caminhos disponibilizados pelo usuário; nenhuma skill foi copiada ou instalada no repositório.
- A referência do Behance está documentada como imagens desktop. O comportamento responsivo e as animações serão decisões deste MVP.

## 3. Escopo do produto

### Incluído

Home com hero, faixa de formação, serviços, perfil profissional, abrangência, diferenciais factuais, convite ao Google e contato/rodapé. Menu responsivo, CTA de WhatsApp, telefone, e-mail, Instagram e Facebook oficiais. Páginas `/localizacao` e `/contate-nos`, além de não encontrado. Conteúdo completo dos serviços acessível por disclosure. Scroll reveal sutil, SEO no HTML, mídia otimizada e verificação de teclado/mobile.

### Tratamento do que não tem conteúdo

O percurso de sete etapas e o FAQ do Behance ficam fora da primeira versão porque não existem textos próprios confirmados. Depoimentos e estrelas são substituídos pelo convite e link de avaliação já publicados, sem nota ou avaliadores fictícios. O retrato é o Delano real; não gerar outra pessoa nem prometer um novo ensaio. Em contato, oferecer canais reais em vez de reproduzir um formulário sem serviço de envio.

### Critério de MVP pronto

O build local apresenta as três rotas, o conteúdo factual do escopo, os sete serviços e os canais corretos; conserva a linguagem visual da referência; funciona em celular e teclado; possui scroll GSAP com fallback/cleanup; entrega HTML e estilos por rota; e tem evidências dos checks pertinentes. Deploy não é condição de conclusão deste plano.

## 4. Direção visual e uso da UI/UX Pro Max

### Consultas realizadas no catálogo local

```text
python C:/Users/Rv22/.agents/skills/ui-ux-pro-max/scripts/search.py "legal services elegant green" --design-system -p "Delano Furtado" --variance 3 --motion 5 --density 2 -f markdown
python C:/Users/Rv22/.agents/skills/ui-ux-pro-max/scripts/search.py "scroll animation cleanup" --stack react
python C:/Users/Rv22/.agents/skills/ui-ux-pro-max/scripts/search.py "scroll reveal stagger" --domain gsap -n 2
```

Na reprodução em outra máquina, localizar a skill no ambiente e usar o caminho absoluto de seu próprio script. Esses caminhos são registro da consulta, não dependência do frontend.

**Resultados verificados:** padrão `Trust & Authority + Conversion`, espaço amplo e hierarquia clara; resultado React `Clean up effects`; resultado de movimento `Scroll Reveal`, intensidade `Subtle`. A busca de movimento também retornou SplitText complexo, que não será usado.

**Adotado:** leitura fácil, credenciais factuais visíveis, CTA reconhecível, espaçamento amplo, SVGs consistentes, cleanup, foco, contraste e movimento reduzido.

**Adaptado à referência:** o catálogo sugeriu azul, EB Garamond/Lato e elementos genéricos de prova. Aqui prevalecem o verde do Behance e Manrope sem serifa; ficam fora preços, cases, estatísticas, badges de certificação ou formulários não sustentados pelo conteúdo. Não persistir o resultado genérico como um segundo MASTER concorrente com `docs/design-system.md`.

### Decisões visuais para implementação

| Elemento | Decisão |
| --- | --- |
| Paleta | `#20382F` primário, `#FFFFFF` fundo, `#F0EFEB` alternado, `#263A31` texto, `#5C655F` secundário, `#D5D6D1` borda; dourado `#AD955F` apenas decorativo |
| Fonte | Manrope local, pesos 400/500/600/700; manter o logo como imagem |
| Títulos | h1 fluido de 32 a 52 px; h2 de 28 a 40 px; pesos moderados e quebras naturais |
| Texto | Base 16–18 px, entrelinha 1,6; largura de leitura até aproximadamente 65 caracteres |
| Container | Máximo 1200 px; padding 20 px no mobile e 24 px em telas amplas |
| Breakpoints | Base de uma coluna; 48rem expande menu/colunas; 64rem amplia composição |
| Ritmo | Escala de 4 px; gaps 16/24/32/48 px; seções 64–112 px |
| Controles | Área interativa de partida 44 × 44 CSS px; CTA principal com altura mínima 56 px |
| Superfícies | Borda fina, sombra mínima, raio 8 px em controles e 24–32 px em painéis |
| Grafismos | Abas verdes, curvas discretas entre faixas, medalhões e monograma DF com contraste baixo |
| Movimento | Revelações de pequenos deslocamentos, sem bounce, pin, parallax, scrub ou rolagem customizada |

Conferir contraste no resultado real; dourado não é cor de corpo. UI/UX Pro Max orienta qualidade, sem trocar o design pedido por um template de catálogo.

### Sequência de composição

| Ordem/bloco | Desktop | Mobile | Conteúdo/origem |
| --- | --- | --- | --- |
| Header | Logo, links principais e CTA discreto; sem glass industrial | Menu em Sheet acessível | Nome e contatos do documento 02 |
| Hero | Texto à esquerda; retrato em painel à direita com transição clara em CSS | Texto/CTA antes da foto | Apresentação e atuação; título editorial proposto: “Advocacia e consultoria jurídica em Volta Redonda” |
| Formação | Painel horizontal com três grupos de ícones | Grupos empilhados | Graduação no Centro Universitário de Volta Redonda, pós em Processo Civil PUC/RS e Civil Mackenzie; usar nomes da fonte, sem inventar titulação |
| Serviços `#areas` | Seis cards em duas colunas + assessoria mensal em faixa larga | Uma coluna | Sete blocos; resumo visível e detalhes completos expansíveis |
| Sobre `#sobre` | Texto e retrato vertical com monograma sobreposto | Texto seguido da foto | Biografia; um único retrato real, sem simular outro ensaio |
| Abrangência `#atendimento` | Faixa off-white; composição geográfica tipográfica à esquerda, texto à direita | Empilhado | Cidades do RJ e online no Brasil; sem ponto em Campinas nem coordenadas inventadas |
| Diferenciais | Foto ou monograma junto a três blocos discretos | Blocos empilhados | Formação publicada, estratégia personalizada, atuação judicial/extrajudicial |
| Google | Faixa de convite com ícone disponível e link oficial | Compacta | Convite existente, sem carrossel de reviews ou cinco estrelas |
| Contato `#contato` e footer | Fundo verde com painel claro e canais | Canais em linhas separadas | Endereço, telefone, e-mail, redes, OAB e CNPJ |

A composição geográfica do MVP usa palavras/localização e ícone de mapa; um mapa vetorial do Brasil seria um recurso novo que precisaria de origem própria. Isso preserva o ritmo do bloco do Behance sem copiar uma imagem que não pertence ao Delano.

## 5. Contratos compartilhados

Os nomes abaixo são os contratos a manter entre tarefas. Os arquivos citados são futuros até sua etapa de criação.

| Módulo | Contrato |
| --- | --- |
| `content/siteData.ts` | `siteData`: nome, nome completo, OAB, CNPJ, telefone de exibição, telefone internacional `5524999225628`, e-mail, endereço, regiões, formação e URLs oficiais |
| `content/services.ts` | `ServiceId = 'familia' \| 'consumidor' \| 'imobiliario' \| 'contratual' \| 'sucessoes' \| 'civil' \| 'assessoria-mensal'`; `Service` com `id`, `title`, `summary`, `items: readonly string[]`, `sourceSection`; export `services: readonly Service[]` |
| `content/homeContent.ts` | `homeContent`: sínteses e ordem das seções com referências aos IDs; não duplicar cadastro de contatos |
| `content/media.ts` | `media`: URLs locais, largura/altura, alt e origem dos derivados |
| `lib/contactLinks.ts` | `buildWhatsAppUrl(phone: string, message: string): string`, `buildPhoneHref(phone: string): string`, `buildMapsUrl(address: string): string` |
| `components/brand/ContactCta.tsx` | `ContactCta({ label?, className? })`, sempre baseado em `siteData`; navegação por âncora real |
| `components/brand/ServiceCard.tsx` | `ServiceCard({ service: Service })`, com título, síntese e disclosure acessível contendo todos os itens |
| `routes/routeManifest.ts` | `publicRoutes = ['/', '/localizacao', '/contate-nos'] as const`; exportar `PublicRoute` e resolução de rota pública/não encontrada |
| `content/seo.ts` | `getSeo(pathname: string): SeoMetadata`; `SeoMetadata` com `title`, `description`, `canonical`, `image`, `noindex` |
| `motion/siteMotion.ts` | `createPageMotion(root: HTMLElement, options: { isDesktop: boolean }): () => void`; targets restritos à raiz, descarte idempotente |
| `hooks/usePageMotion.ts` | `usePageMotion(scope: RefObject<HTMLElement \| null>, routeKey: string): void`; setup em `useGSAP`, media queries e teardown |
| `entry-server.tsx` | `renderPage(pathname: string): { html: string; styleTags: string; seo: SeoMetadata }` |
| `scripts/prerender.mjs` | Gerar HTML das três rotas e `404.html` a partir do bundle de renderização, sem servidor em produção |

Normalizar apenas o telefone fornecido e validar o formato internacional antes de gerar href; preservar a mensagem geral já coletada no WhatsApp. Títulos/sínteses novos são redação editorial apoiada na fonte, não novas alegações.

## 6. Estrutura e dependências planejadas

```text
public/media/                    derivados das imagens e favicons
src/content/                     siteData, services, homeContent, media e seo
src/components/SiteLayout/       header, menu, footer e navegação de rota
src/components/ui/               Button, Separator e Sheet gerados/revisados
src/components/brand/            ContactCta, SectionHeading e ServiceCard
src/pages/Home/sections/         hero, formação, serviços, sobre, cobertura,
                                diferenciais, Google e contato
src/pages/Location/              endereço e acesso ao mapa
src/pages/Contact/               canais reais, sem formulário simulado
src/pages/NotFound/              URL não encontrada
src/motion/                      registro e motor de movimento
src/hooks/                       usePageMotion
src/routes/                      manifest e mapa React Router
src/styles/                      tokens.css, shadcn.css, GlobalStyles.ts
src/test/                        setup e contratos de navegação/hidratação
src/main.tsx                     BrowserRouter e createRoot/hydrateRoot
src/entry-server.tsx             StaticRouter e renderização de build
scripts/                         prepare-assets, prerender e verify-build
```

Usar as versões compatíveis da base documentada e registrar o conjunto resolvido no lockfile local. Não copiar lock/node_modules de outro projeto. Além da base:

- `@fontsource-variable/manrope`: fonte local; registrar a versão e carregar apenas o necessário.
- `sharp` como ferramenta de desenvolvimento para derivados, sem edição criativa do retrato e sem alterar originais.
- `@babel/core`, `@rolldown/plugin-babel` e `babel-plugin-styled-components` como tooling: IDs consistentes entre os builds cliente e renderização. Não ativar React Compiler neste MVP.

**Pré-renderização escolhida:** build cliente Vite + build `--ssr` de `entry-server.tsx` + geração estática Node. `ServerStyleSheet` coleta o CSS de styled-components; o compiler plugin usa `ssr: true` e a mesma configuração nos dois builds. A hospedagem recebe apenas `dist/`; `.prerender/` é intermediário. A documentação oficial alerta que Vite 8/plugin-react 6 não embute Babel, portanto não usar configuração antiga de `react({ babel: ... })` sem a integração separada. Referências: [Vite SSR](https://vite.dev/guide/ssr.html), [styled-components tooling](https://styled-components.com/docs/tooling#vite) e [coleta de estilos](https://styled-components.com/docs/advanced#server-side-rendering).

A solução é limitada às três páginas estáticas, sem Express, API ou SSR por request. IDs estáveis e hidratação são requisitos verificáveis da tarefa 9; não corrigir warnings com supressão de hidratação.

## 7. Mapa de animações GSAP

| Região | Gatilho | Movimento de partida | Duração/ease | Comportamento |
| --- | --- | --- | --- | --- |
| Hero | Após montagem cliente | `y: 12 → 0`, sem esconder h1 ou CTA | 0,5 s, `power2.out` | Uma vez por montagem; foto já visível |
| Cabeçalhos de seção | `top 88%` | `y: 12 → 0`, opacity 0,65 → 1 apenas em conteúdo não interativo | 0,4 s, `power2.out` | Entrada uma vez por instância |
| Formação/serviços | Grupo entra em viewport | `y: 12 → 0`, stagger 0,05 s desktop/0,03 s mobile | 0,4 s | Elementos interativos mantêm opacity 1 e visibilidade |
| Sobre/abrangência | `top 85%` | `y: 16 → 0` desktop; 8 px mobile | 0,45 s | Sem pin, scrub ou parallax |
| Painel de contato | `top 90%` | `y: 10 → 0` | 0,4 s | Links ativos durante todo o efeito |

Registro único cliente de `useGSAP` e ScrollTrigger antes da montagem. Não executar setup de GSAP ou acesso a `window` durante renderização Node. O hook usa `scope`, `dependencies: [routeKey]` e `revertOnUpdate: true`; `gsap.matchMedia` diferencia desktop/mobile e `prefers-reduced-motion`, com `mm.revert()` no descarte.

`createPageMotion` é executado dentro do contexto ativo do hook/media query, recebe elementos locais e devolve descarte dos recursos que criou. Não criar outro `gsap.context` dentro de `matchMedia`; não usar `ScrollTrigger.getAll().forEach(kill)` como cleanup global. Callbacks tardios que criem animações usam `contextSafe`; listeners nativos e continuations assíncronas precisam também de remoção/guarda explícita.

Conteúdo base do HTML/CSS nunca começa com `opacity: 0` ou `visibility: hidden`. No modo reduzido, pular tweens/triggers e manter o estado final. Em `focusin` sobre um bloco animado, finalizar somente seu tween antes de manter o controle em foco. Atualizações de layout por imagem, fonte ou disclosure pedem refresh coordenado, sem recálculo por frame; cancelar callbacks se a rota desmontar. `once: true`, sem markers em produção. Fonte de integração: [GSAP React](https://gsap.com/resources/React/).

## 8. Tarefas passo a passo

Tarefas 1–10 executadas e verificadas. As limitações de emulação do navegador e as verificações equivalentes por teste/HTML sem módulo estão documentadas em mvp-001; não se declara validação de produção ou de campo. Caminhos entre backticks abaixo designam arquivos a criar/modificar durante a execução. A rotina de commit só entra se o Git estiver configurado e fizer parte do fluxo autorizado; um checkpoint não pressupõe commit, remoto ou publicação.

### Tarefa 1 — Fundação executável da aplicação

**Responsável:** Software Architect + Frontend. **Depende de:** leitura deste plano e dos documentos-base.

**Arquivos:** criar `package.json`, `package-lock.json`, `.gitignore`, configuração de runtime, `index.html`, `vite.config.ts`, `tsconfig*.json`, `eslint.config.js`, `src/main.tsx`, `src/App.tsx`, `src/test/setup.ts`; preservar todas as pastas existentes.

**Consome:** stack e árvore atual. **Produz:** aplicação React em TypeScript estrito e scripts `dev`, `lint`, `build`, `test`, `test:run`, `preview`, inicialmente com build cliente.

- [x] Confirmar a ausência de aplicação e revalidar os engines com Node disponível; parar somente se houver incompatibilidade real.
- [x] Inicializar os arquivos na raiz, sem scaffolder que sobrescreva docs ou gere outro `DelanoFurtado/` aninhado; resolver dependências compatíveis e criar lockfile próprio.
- [x] Configurar alias `@/` nos dois compiladores, Vitest/jsdom e cleanup de Testing Library. Não herdar `@types/react-router-dom` v5.
- [x] Criar a entrada mínima e uma página identificada como base de desenvolvimento; manter dependência de GSAP sem setup de efeito até a tarefa 8.
- [x] Executar `npm run lint` e `npm run build`; conferir que `dist/` foi produzido. A suíte ainda não terá testes até a tarefa 2, portanto não declarar teste aprovado usando `--passWithNoTests`.

**Aceite:** raiz correta, scripts existentes, type-check e build válidos; nenhum original/documento substituído. Checkpoint: fundação reproduzível.

### Tarefa 2 — Conteúdo rastreável e contatos corretos

**Responsável:** Frontend + SEO/Content. **Depende de:** 1.

**Arquivos:** criar `src/content/siteData.ts`, `services.ts`, `homeContent.ts`, `src/lib/contactLinks.ts` e `src/lib/contactLinks.test.ts`.

**Consome:** documento 02 e contratos da seção 5. **Produz:** dados tipados, sete serviços e helpers de links.

- [x] Escrever primeiro os testes de contrato de `contactLinks`, com as asserções mínimas abaixo.

```ts
const message = 'Olá, Dr. Delano. Vim pelo site e gostaria de uma orientação.'
const address = 'Rua 18 - B, 45 - Vila Santa Cecília, Volta Redonda-RJ, 27260-100, BR'
expect(new URL(buildWhatsAppUrl('5524999225628', message)).pathname)
  .toBe('/5524999225628')
expect(new URL(buildWhatsAppUrl('+55 (24) 99922-5628', message))
  .searchParams.get('text')).toBe(message)
expect(buildPhoneHref('5524999225628')).toBe('tel:+5524999225628')
expect(new URL(buildMapsUrl(address)).searchParams.get('query')).toBe(address)
expect(() => buildWhatsAppUrl('', message)).toThrow()
```

`message` é a mensagem geral publicada na fonte; `address` é o endereço completo publicado, com acentos. O teste deve usar esses valores reais, sem acionar serviços externos.

- [x] Executar `npm run test:run -- src/lib/contactLinks.test.ts`; observar falha pelo contrato ausente antes de implementar.
- [x] Implementar normalização/validação do telefone e codificação via APIs URL; copiar fatos do documento 02 para o cadastro único.
- [x] Modelar exatamente os sete blocos e todos os itens coletados; escrever sínteses visuais apoiadas na fonte, registrando `sourceSection`.
- [x] Executar o teste até PASS e revisar os dados contra a transcrição. Confirmar que Trabalhista/Previdenciário/Bancário não viraram novos cards por causa apenas do SEO antigo.

**Aceite:** links oficiais codificados, erro para telefone vazio, catálogo completo e fonte identificada. Checkpoint: conteúdo independente da UI.

### Tarefa 3 — Mídia otimizada, tokens e primitives

**Responsável:** UX/UI + Frontend. **Depende de:** 1 e 2.

**Arquivos:** criar `scripts/prepare-assets.mjs`, `public/media/`, `src/content/media.ts`, `src/styles/tokens.css`, `shadcn.css`, `GlobalStyles.ts`, `components.json`, `src/lib/utils.ts`, primitives `src/components/ui/{button,separator,sheet}.tsx` e `src/components/brand/SectionHeading.tsx`.

**Consome:** decisões visuais, fonte Manrope e manifesto original. **Produz:** tema único, mídia local dimensionada e primitives necessários.

- [x] Conferir hashes do manifesto antes do processamento e manter o arquivo original sem alteração.
- [x] Adicionar `assets:prepare = node scripts/prepare-assets.mjs` e executar `npm run assets:prepare`: retrato WebP em larguras 480/800/1200, logo PNG transparente de até 1200 px, favicons 32/180 e imagem social 1200 × 630 com `contain` sobre fundo claro. Derivados preservam proporção, sem recortar rosto ou cortar o logo. Registrar dimensões e origem em `media.ts`.
- [x] Implementar tokens da seção 4 e carregar Manrope local com fallback; reservar altura/largura das imagens e priorizar somente a imagem do hero.
- [x] Consultar a skill `shadcn` e documentação da base efetiva; inicializar Base UI `base-nova`, revisar aliases e adicionar apenas Button, Separator e Sheet. Adequar variants/tokens em vez de sobrescrever cor/tipografia via classes pontuais.
- [x] Conferir reset Tailwind versus GlobalStyles, contraste/foco e visual dos primitives em uma composição de desenvolvimento; remover a composição temporária ao integrar a Home.
- [x] Executar `npm run lint` e `npm run build`; verificar arquivos e dimensões dos derivados e repetir hashes dos originais. Não criar unit tests que espelhem valores de CSS.

**Aceite:** tema único, assets locais válidos, logo íntegro, primitives navegáveis e originais preservados. Checkpoint: base visual pronta.

### Tarefa 4 — Rotas, layout e menu acessível

**Responsável:** Frontend. **Depende de:** 2 e 3.

**Arquivos:** criar `src/routes/routeManifest.ts`, `routes.tsx`, `src/components/SiteLayout/{index,Header,MobileMenu,Footer,RouteEffects}.tsx`, `src/components/brand/ContactCta.tsx`, shells das quatro páginas e `src/test/navigation.test.tsx`.

**Consome:** `siteData`, `ContactCta`, primitives e URLs. **Produz:** layout compartilhado, três rotas, tela 404 e âncoras previsíveis.

- [x] Escrever teste com MemoryRouter que abre o menu, encontra seus destinos e fecha com Escape, devolvendo foco ao trigger; cobrir mudança de rota e a existência de um único `main`.

```tsx
const user = userEvent.setup()
render(<MemoryRouter initialEntries={['/']}><App /></MemoryRouter>)
const trigger = screen.getByRole('button', { name: 'Abrir menu' })
await user.click(trigger)
expect(screen.getByRole('dialog', { name: 'Navegação' })).toBeVisible()
expect(screen.getAllByRole('main')).toHaveLength(1)
await user.keyboard('{Escape}')
await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
expect(trigger).toHaveFocus()
```

Configurar `matchMedia` de teste em largura mobile; o teste é de navegação/foco, não de breakpoint em pixels no jsdom. `Abrir menu` e `Navegação` tornam-se os nomes acessíveis do contrato.

- [x] Rodar `npm run test:run -- src/test/navigation.test.tsx` e confirmar o estado RED antes da implementação correspondente.
- [x] Implementar o menu com Sheet, título acessível, foco controlado pela primitive e CTA real. Header leve, sem efeito de blur industrial; reservar espaço quando sticky.
- [x] Implementar `RouteEffects` para topo em mudança de pathname e âncora real em hash, respeitando movimento reduzido. Não roubar foco ao carregar diretamente a página; deslocar foco de navegação de forma deliberada e documentada.
- [x] Registrar rotas exatas, fallback e anchors da Home; CTA flutuante com safe area e posição que não cubra controles.
- [x] Executar teste até PASS, conferir teclado e acesso direto em desenvolvimento. Verificar que abrir um menu não muda a geometria do conteúdo por trás inesperadamente.

**Aceite:** navegação utilizável por teclado/mobile e destinos oficiais, com shells de rota prontos para receber as seções. Checkpoint: moldura funcional.

### Tarefa 5 — Hero, formação e catálogo de serviços

**Responsável:** UX/UI + Frontend. **Depende de:** 2–4.

**Arquivos:** criar `src/pages/Home/sections/{HeroSection,CredentialsSection,ServicesSection}.tsx`, `src/components/brand/ServiceCard.tsx`, `src/pages/Home/homeStyles.ts`, atualizar `Home/index.tsx`; teste `ServiceCard.test.tsx` junto do componente.

**Consome:** contratos de conteúdo/mídia. **Produz:** abertura fiel à referência e sete blocos de serviço acessíveis.

- [x] Escrever `ServiceCard.test.tsx` com um serviço longo: abrir o disclosure por interação e consultar todos os itens, sem depender de classes de estilo. A ativação nativa por teclado é conferida no navegador, pois o jsdom não representa integralmente esses defaults.

```tsx
const user = userEvent.setup()
const service = services[2] // Contrato de ordem: Direito Imobiliário.
render(<ServiceCard service={service} />)
const summary = screen.getByText('Ver atuações', { selector: 'summary' })
await user.click(summary)
expect(summary.closest('details')).toHaveAttribute('open')
for (const item of service.items) expect(screen.getByText(item)).toBeVisible()
```

O texto visível do summary é `Ver atuações`; seu nome acessível inclui o título do serviço. Um teste não deve ser forçado a passar simulando manualmente o toggle que deveria ser realizado pela interação testada.

- [x] Rodar `npm run test:run -- src/components/brand/ServiceCard.test.tsx` e confirmar falha de comportamento antes da implementação.
- [x] Compor hero com título proposto da seção 4, síntese da apresentação, foto real e CTA “Entre em contato via WhatsApp”. OAB não substitui nem invade a faixa de formação.
- [x] Criar os três itens de formação com texto exato das instituições da fonte e ícones discretos.
- [x] Implementar cards 2 × 3 e faixa final de assessoria mensal; usar disclosure nativo `details/summary` para conservar listas no HTML e simplificar comportamento sem JavaScript. Não criar FAQ por causa desse controle. Os resumos não apagam os itens integrais.
- [x] Executar teste até PASS e conferir a composição com os textos reais em 320, 390, 768 e 1440 px; impedir largura mínima indevida em títulos/listas. Registrar captura antes de aplicar scroll motion.

**Aceite:** abertura e serviços reconhecíveis como adaptação da referência, listas completas e sem cortes. Checkpoint: primeira metade da landing pronta.

### Tarefa 6 — Perfil, abrangência e fechamento da Home

**Responsável:** UX/UI + Frontend + Content. **Depende de:** 5.

**Arquivos:** criar `src/pages/Home/sections/{AboutSection,CoverageSection,DifferentialsSection,GoogleReviewSection,ContactSection}.tsx`, atualizar `Home/index.tsx` e estilos; reutilizar Footer/ContactCta.

**Consome:** biografia, regiões, formação e canais. **Produz:** Home completa com âncoras `areas`, `sobre`, `atendimento`, `contato`.

- [x] Compor Sobre com biografia, um retrato vertical real e monograma DF; remover a suposição de dois ensaios fotográficos diferentes.
- [x] Criar faixa de abrangência com regiões da fonte, online no Brasil e ponto de referência textual Volta Redonda. Usar grafismo tipográfico, sem criar mapa com fronteiras/coordenadas inventadas.
- [x] Organizar três diferenciais ligados aos fatos já publicados; usar uma afirmação por bloco e evitar duplicar toda a biografia.
- [x] Criar o convite Google com o destino de avaliação existente e sem estrelas, notas, número de clientes ou fotos fictícias.
- [x] Fechar com painel claro sobre verde e contatos/OAB/CNPJ no rodapé; manter o botão flutuante fora das áreas de foco/ação.
- [x] Conferir os blocos e as fontes no navegador, validar anchors e ausência de blocos vazios. Comparar alternância de fundos, raios, abas e espaçamentos com o documento 01; executar lint/build porque a UI foi alterada.

**Aceite:** narrativa completa, fatos do Delano e composição própria coerente com o Behance. Checkpoint: Home estática integral, antes das animações.

### Tarefa 7 — Localização e contato sem simulação

**Responsável:** Frontend + QA. **Depende de:** 4 e 6.

**Arquivos:** implementar `src/pages/Location/index.tsx`, `Contact/index.tsx`, `NotFound/index.tsx`; adicionar `src/test/contact-routes.test.tsx`.

**Consome:** cadastro único e helpers de contato. **Produz:** páginas de apoio reais e preservação das URLs.

- [x] Escrever testes que identificam endereço/contatos nas respectivas rotas, conferem href do telefone/e-mail/Google Maps e comprovam ausência de botão de envio ou confirmação fictícia.

```tsx
// Caso /contate-nos, usando a função de render com MemoryRouter.
expect(within(screen.getByRole('main')).getByRole('link', {
  name: 'contato@delanofurtado.adv.br',
})).toHaveAttribute('href', 'mailto:contato@delanofurtado.adv.br')
expect(screen.queryByRole('button', { name: 'Enviar mensagem' })).not.toBeInTheDocument()
expect(screen.queryByText('Mensagem enviada!')).not.toBeInTheDocument()
// Caso /localizacao.
expect(screen.getByRole('link', { name: 'Abrir no Google Maps' }))
  .toHaveAttribute('href', buildMapsUrl(address))
```

`address` usa o valor da tarefa 2; os dois casos têm renderizações separadas. A ação de mapa adota o nome acessível `Abrir no Google Maps`.

- [x] Executar `npm run test:run -- src/test/contact-routes.test.tsx` em RED antes de implementar o contrato faltante.
- [x] Criar Localização com endereço legível, abrangência e link de mapa gerado por endereço; sem iframe no MVP. A foto temática de Justiça, se usada, recebe alt que não a apresenta como o prédio do escritório.
- [x] Criar Contato com WhatsApp, telefone, e-mail e redes oficiais. Reutilizar a linguagem visual e manter a expectativa correta de abrir um canal externo.
- [x] Implementar página não encontrada com retorno à Home e contato; não redirecionar silenciosamente qualquer URL para `/`.
- [x] Executar testes até PASS e conferir clique/navegação sem submeter mensagens externas.

**Aceite:** as três rotas cumprem sua finalidade, contatos são consistentes e o frontend não promete um envio que não existe. Checkpoint: todas as páginas funcionais.

### Tarefa 8 — Scroll GSAP React com fallback e cleanup

**Responsável:** Motion + Frontend. **Depende de:** 6 e 7.

**Arquivos:** criar `src/motion/gsap.ts`, `siteMotion.ts`, `src/hooks/usePageMotion.ts`, `siteMotion.test.ts`, `src/hooks/usePageMotion.test.tsx`; integrar refs/`data-reveal` nas páginas e registro cliente em `main.tsx`.

**Consome:** mapa de animações e elementos reais. **Produz:** movimento por rota sem dependência da animação para leitura.

- [x] Escrever testes para root A/root B: setup A não toca B; teardown é idempotente; após desmontagem não permanecem listeners/refreshes da instância. No hook, cobrir StrictMode e alternância de `prefers-reduced-motion` sem setup de tween no modo reduzido.

```ts
// Fixtures: rootA, rootB e targetB, filho data-reveal dentro de rootB.
const baseline = ScrollTrigger.getAll().length
const styleBeforeB = targetB.getAttribute('style')
const dispose = createPageMotion(rootA, { isDesktop: false })
expect(targetB.getAttribute('style')).toBe(styleBeforeB)
dispose()
dispose()
expect(ScrollTrigger.getAll()).toHaveLength(baseline)
```

No teste do hook, observar `createPageMotion`: ao emitir a media query de movimento reduzido, ele não pode ser chamado para criar novas animações; o cleanup anterior precisa ocorrer. Usar nomes de teste explícitos: `isolates targets by root`, `disposes twice safely`, `responds to reduced-motion changes`, `does not refresh after unmount`. Consultar a lista global em uma asserção é diferente de destruí-la no cleanup de produção.

- [x] Adicionar teste de `focusin` que finaliza apenas o tween do bloco focado e preserva o foco; nenhum controle recebe opacity 0/visibility hidden. Testar a mudança de preferência durante a montagem, não apenas o valor inicial.
- [x] Rodar `npm run test:run -- src/motion/siteMotion.test.ts src/hooks/usePageMotion.test.tsx` em RED. Mocks devem representar eventos/ciclo de vida; a inspeção de scroll real permanece obrigatória.
- [x] Implementar registro único cliente, `useGSAP` com scope/dependências e media queries. Aplicar os valores da seção 7; engine sem seleção global e sem contexts aninhados dentro de matchMedia.
- [x] Implementar descarte de listeners/promises/refresh agendado e callbacks tardios com guarda e `contextSafe` quando criarem GSAP. Usar refresh após mudanças reais de layout e nunca medir por frame.
- [x] Executar testes até PASS; testar scroll, resize, preferência reduzida e navegação repetida no navegador. Registrar vídeo curto ou capturas dos estados de entrada/final quando a ferramenta disponível permitir; não criar uma produção de vídeo como subprojeto.

**Aceite:** scroll solicitado presente, escopo e cleanup comprovados, toda informação/ação disponível sem movimento. Checkpoint: Home e páginas de apoio com motion progressivo.

### Tarefa 9 — HTML por rota, metadados e hidratação estável

**Responsável:** Arquitetura + Frontend + SEO. **Depende de:** 7 e 8.

**Arquivos:** criar `src/content/seo.ts`, `src/components/SiteLayout/RouteSeo.tsx`, `src/entry-server.tsx`, `scripts/prerender.mjs`, `scripts/verify-build.mjs`, `src/test/prerender.test.tsx`, `src/test/hydration.test.tsx`; atualizar `main.tsx`, `index.html`, `vite.config.ts`, `package.json`, `.gitignore` e documentação de build.

**Consome:** manifest de rotas, conteúdo/UI completos e metadados. **Produz:** `dist/index.html`, `dist/localizacao/index.html`, `dist/contate-nos/index.html`, `dist/404.html`, sitemap e robots da versão pública.

- [x] Escrever teste de `renderPage` para as três rotas e uma desconhecida: HTML contém o h1 e dados da rota, styleTags não vazias, canonical único e noindex no 404; renderização Node não acessa APIs de navegador.

```ts
const page = renderPage('/localizacao')
expect(page.html).toContain('Rua 18 - B, 45 - Vila Santa Cecília')
expect(page.styleTags).toContain('data-styled')
expect(page.seo.canonical).toBe('https://www.delanofurtado.adv.br/localizacao')
expect(renderPage('/rota-inexistente').seo.noindex).toBe(true)
```

- [x] Escrever teste de hidratação que usa markup pré-renderizado com a mesma rota no cliente e falha em `onRecoverableError`; conferir uma interação real após hidratar. O teste de produção deve ser complementado pela checagem dos dois bundles no navegador.

```tsx
const recoverableError = vi.fn()
root.innerHTML = renderPage('/').html
await act(async () => {
  hydrated = hydrateRoot(root, (
    <MemoryRouter initialEntries={['/']}><App /></MemoryRouter>
  ), { onRecoverableError: recoverableError })
})
expect(recoverableError).not.toHaveBeenCalled()
expect(within(root).getByRole('heading', { level: 1 })).toHaveTextContent(
  'Advocacia e consultoria jurídica em Volta Redonda',
)
```

`root` é um container real do jsdom e `hydrated` recebe o retorno para unmount no cleanup do teste. Os registros de erro de console relevantes também falham o teste; a inspeção no build usa o BrowserRouter real.

- [x] Rodar `npm run test:run -- src/test/prerender.test.tsx src/test/hydration.test.tsx` e observar RED antes de implementar o contrato.
- [x] Implementar `StaticRouter` na entrada de build e `ServerStyleSheet` com `seal` em finally. Configurar o mesmo plugin de IDs estáveis nos dois builds. No cliente, `hydrateRoot` quando houver HTML; `createRoot` no desenvolvimento com root vazio; montar BrowserRouter uma única vez.
- [x] Implementar o gerador estático com operações confinadas a `dist/`/`.prerender/`, sem alterar fontes ou apagar caminhos externos. Injetar markup, estilos e SEO com escape correto. HTML deve incluir os itens dos disclosures, não somente resumos.
- [x] Ampliar os scripts: `build:client = vite build`; `build:server = vite build --ssr src/entry-server.tsx --outDir .prerender`; `prerender = node scripts/prerender.mjs`; `build = tsc -b && npm run build:client && npm run build:server && npm run prerender`; `verify:build = node scripts/verify-build.mjs`. Atualizar `docs/desenvolvimento.md` e `docs/deploy-e-operacao.md` junto do contrato.
- [x] Gerar title/description/canonical/OG por rota e JSON-LD factual, sem aggregateRating ou horários ausentes. O cliente atualiza o head ao navegar sem manter entradas duplicadas. Usar `https://www.delanofurtado.adv.br` como origem pública registrada.
- [x] Executar testes, build e `npm run verify:build`: três HTMLs distintos, CSS/JS/assets existentes, canonical correto, dados e serviços preservados, sitemap apenas com as três rotas. Validar URL direta e JavaScript desabilitado no preview; conferir erro de hidratação no build real.

**Aceite:** HTML inicial de cada URL contém seu conteúdo, há CSS consistente antes do JavaScript e hidratação utilizável sem warning. O status HTTP do 404 e regras do provedor ficam como contrato de hospedagem documentado, sem alegar deploy efetuado. Checkpoint: artefato público estático preparado.

### Tarefa 10 — Revisão integrada e entrega do MVP local

**Responsável:** QA + Acessibilidade/Performance + Revisor. **Depende de:** 1–9.

**Arquivos:** registrar evidências em `docs/evidencias/mvp-001.md`; atualizar `README.md`, `docs/README.md`, `docs/visao-geral.md`, `docs/decisoes-e-pendencias.md`, `docs/skills-e-fluxo-de-ia.md`, `agents/README.md` e estado deste plano conforme o resultado real.

**Consome:** aplicação/build e critérios do plano. **Produz:** MVP local verificável, documentação atualizada e handoff para eventual publicação.

- [x] Rodar `npm run test:run`, `npm run lint`, `npm run build` e `npm run verify:build`; registrar resultado real e tratar falhas antes da conclusão.
- [x] Conferir `/`, `/localizacao`, `/contate-nos` e URL inválida por navegação, acesso direto, refresh e voltar/avançar. Conferir HTML sem JavaScript, head por rota e console no build.
- [x] Inspecionar 320, 390, 768, 1024 e 1440 px; fotografias, listas longas, disclosures abertos, zoom, foco, menu e WhatsApp flutuante. Conferir `scrollWidth <= clientWidth` em cada viewport, sem corrigir o problema apenas com corte global de overflow.
- [x] Repetir navegação/scroll/resize e alternar movimento reduzido durante a página; comparar recursos ativos antes/depois de desmontar sem interferência de outra raiz.
- [x] Medir o build com ferramenta disponível e condições registradas; avaliar hero, fontes, layout shift e custo de scroll. Meta documentada: LCP ≤ 2,5 s, INP ≤ 200 ms e CLS ≤ 0,1; laboratório não comprova INP de campo. Não instalar monitor ou analytics para preencher a evidência.
- [x] Comparar visualmente com os traços da referência: composição, verde/off-white, tipos, espaçamento, retrato, bordas/abas/selos e painel final. Conferir dados contra documento 02 e hashes dos sete originais.
- [x] Registrar screenshots pertinentes e achados; corrigir os materiais e rerodar apenas os checks afetados. Revisão independente conforme método autorizado, sem presumir execução de todos os perfis.
- [x] Atualizar estado documental de “somente documentação” para o que foi efetivamente implementado, incluindo limitações de infraestrutura. Entregar endereço local/preview, passos de uso, evidências e o artefato; publicação continua em tarefa própria.

**Aceite:** critérios rastreados e resultado confirmado, sem placeholders, alegações copiadas, contato falso ou efeito órfão. Checkpoint: MVP local concluído e preparado para revisão/publicação posterior.

## 9. Dependências, checkpoints e retorno seguro

Ordem principal: **1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 → 10**. A revisão de conteúdo e a análise visual podem ocorrer por função, mas não escrever simultaneamente contratos compartilhados sem coordenação.

Após cada tarefa, revisar diff, registrar o resultado de seu aceite e preservar o incremento anterior funcional. Se existir Git no momento da execução e seu uso estiver autorizado, commits pequenos podem registrar checkpoints; não inicializar remoto nem fazer push por inferência deste documento.

Em falha, corrigir a tarefa atual antes de avançar. Uma falha em motion deve permitir desabilitar o efeito mantendo conteúdo/contato; falha de pré-renderização impede declarar o build de produção pronto, mas não exige trocar framework ou criar backend sem nova decisão.

## 10. Fora do plano e evolução

- Formulário com envio e provedor: plano próprio quando houver requisito.
- Conteúdo próprio de FAQ/etapas e depoimentos: incremento editorial, com fontes.
- Mapa vetorial/novas fotos: material próprio com origem definida.
- Blog, páginas de serviço, CMS, login e pagamentos: sem antecipar infraestrutura no MVP.
- Hospedagem, DNS, CI de provedor e publicação: preparação operacional posterior ao artefato revisado.

## 11. Handoff de execução

Execução solicitada em 22/10/2026 e concluída localmente; revisão independente encontrou três P2, corrigidos com regressões e navegador. Publicação segue em tarefa própria. Recomenda-se execução sequencial pelo agente principal usando `superpowers:executing-plans`, com revisão final independente quando permitida; alternativamente, execução orientada por subagentes se o usuário escolher esse método e as instruções do ambiente autorizarem.

Em manutenção, reler este arquivo, as evidências e o estado atual; criar outro plano numerado para um escopo novo. Não presumir que arquivos listados no plano já foram criados ou que os testes descritos foram executados.

## 12. Fontes de skills e decisões verificadas

- [GSAP React — skill solicitada](C:/Users/Rv22/.agents/skills/gsap-react/SKILL.md).
- [UI/UX Pro Max — skill solicitada](C:/Users/Rv22/.agents/skills/ui-ux-pro-max/SKILL.md), consultas locais registradas na seção 4.
- [ScrollTrigger — skill complementar](C:/Users/Rv22/.agents/skills/gsap-scrolltrigger/SKILL.md).
- [GSAP core — skill complementar](C:/Users/Rv22/.agents/skills/gsap-core/SKILL.md).
- [Writing plans — procedimento de planejamento](C:/Users/Rv22/.codex/plugins/cache/openai-curated-remote/superpowers/6.4.2/skills/writing-plans/SKILL.md).
- Documentos e perfis locais vinculados nas seções 1 e Spec; fontes oficiais de renderização vinculadas na seção 6.

Os caminhos absolutos são evidência desta sessão. Em outra instalação, descobrir os equivalentes disponíveis em vez de assumir que o perfil ou a skill esteja registrado automaticamente.
