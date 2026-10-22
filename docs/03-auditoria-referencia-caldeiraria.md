# Auditoria técnica — projetos de caldeiraria

Levantamento realizado em **22 de outubro de 2026**, por leitura dos arquivos locais. O objetivo é identificar a stack, as skills e as convenções já utilizadas pelo usuário e oferecer uma base verificável para a documentação do Delano Furtado.

Não foram instaladas dependências, executados builds/testes ou alterados arquivos dos projetos de referência. Nenhum segredo ou arquivo de credenciais foi necessário à coleta. Versões indicadas como resolvidas foram lidas dos lockfiles; não são uma recomendação de atualização nem uma afirmação de que sejam as versões mais recentes disponíveis.

## 1. Duas cópias encontradas

| Diretório | Estado observado | Papel nesta auditoria |
| --- | --- | --- |
| `C:/Users/Rv22/Desktop/calderaria/` | Projeto completo com `src`, `public`, `package.json`, lockfile, `docs`, `agents`, configuração Shadcn, movimento e testes | Referência principal, mais completa |
| `C:/Users/Rv22/Desktop/calderaria/Caldeiraria/` | Outra cópia com código, dependências e `.git` próprios; possui a stack básica, mas não as adições de UI, movimento e testes da raiz | Referência comparativa; não foi mesclada nem editada |

O [README da documentação principal](C:/Users/Rv22/Desktop/calderaria/docs/README.md) define como raiz canônica o diretório que contém esse documento, `package.json` e `.git`. O projeto salvo no aplicativo aponta para a pasta aninhada, mas os arquivos mais completos estão na pasta externa. A existência de duas cópias explica diferenças de stack; não se deve escolher a pasta apenas pelo nome ou pelo vínculo salvo no aplicativo.

Fontes: [package.json principal](C:/Users/Rv22/Desktop/calderaria/package.json), [package.json aninhado](C:/Users/Rv22/Desktop/calderaria/Caldeiraria/package.json) e inspeção das duas árvores locais.

## 2. Tipo e arquitetura efetivamente encontrados

**Tipo:** WEB — site institucional com frontend React e roteamento de SPA. O build é estático; Vite é a ferramenta de desenvolvimento/build, não uma API própria da aplicação.

O fluxo observado é `index.html → main.tsx → BrowserRouter → App → GlobalStyles + AppRoutes → SiteLayout → página`. O layout compartilhado mantém navegação e moldura comuns. As páginas recebem conteúdo de módulos TypeScript centralizados. Não foi encontrado backend próprio, banco de dados ou camada de autenticação em `src`.

Fontes: [main.tsx](C:/Users/Rv22/Desktop/calderaria/src/main.tsx), [App.tsx](C:/Users/Rv22/Desktop/calderaria/src/App.tsx), [rotas](C:/Users/Rv22/Desktop/calderaria/src/routes/routes.tsx) e [arquitetura documentada](C:/Users/Rv22/Desktop/calderaria/docs/arquitetura.md).

## 3. Tecnologias e versões

Versões abaixo resolvidas no [package-lock.json principal](C:/Users/Rv22/Desktop/calderaria/package-lock.json), confrontadas com [package.json](C:/Users/Rv22/Desktop/calderaria/package.json) e os arquivos citados na coluna de uso.

| Tecnologia | Versão resolvida na referência principal | Evidência de uso/configuração |
| --- | --- | --- |
| React / React DOM | 19.2.6 / 19.2.6 | Importados em `src/main.tsx`; componentes funcionais em `src` |
| TypeScript | 6.0.3 | Código `.ts`/`.tsx`; build com `tsc -b` e `tsconfig*.json` |
| Vite | 8.0.13 | Scripts dev/build/preview e `vite.config.ts` |
| React Router DOM | 6.30.3 | `BrowserRouter`, `Routes`, `Route`, `Navigate`, navegação por `Link`/`NavLink` |
| styled-components | 6.4.1 | Estilos globais, layout, páginas e composições de marca |
| Tailwind CSS / plugin Vite | 4.3.3 / 4.3.3 | Plugin em `vite.config.ts`; import em `src/styles/shadcn.css` |
| Shadcn CLI | 4.21.0 | Dependência de desenvolvimento; `components.json` e primitives em `components/ui` |
| Base UI React | 1.8.0 | `Button` e `Separator` importam `@base-ui/react` |
| Lucide React | 1.47.0 | Ícones importados na seção de soluções |
| class-variance-authority | 0.7.1 | Variantes do botão Shadcn |
| cn | 0.4.0 | Combinação de classes dos componentes UI e export em `src/lib/utils.ts` |
| GSAP | 3.15.0 | Registro central, ScrollTrigger, revelações, carrossel e contadores |
| @gsap/react | 2.1.2 | `useGSAP` com refs e cleanup |
| Vitest | 5.0.1 | Scripts de testes, configuração e arquivos de teste |
| Testing Library React | 16.3.3 | Testes de componentes e cleanup em `src/test/setup.ts` |
| jest-dom / user-event | 7.0.1 / 14.6.7 | Bibliotecas declaradas e resolvidas para testes de interface |
| jsdom | 29.1.1 | Ambiente configurado no Vitest |
| ESLint | 10.4.0 | Flat config, regras JS/TS e plugins React Hooks/Refresh |
| @vitejs/plugin-react | 6.0.2 | Plugin de React no Vite |
| React Compiler Babel plugin | 1.0.0 | Preset `reactCompilerPreset()` conectado por `@rolldown/plugin-babel` |

Fontes de implementação: [vite.config.ts](C:/Users/Rv22/Desktop/calderaria/vite.config.ts), [components.json](C:/Users/Rv22/Desktop/calderaria/components.json), [CSS Shadcn](C:/Users/Rv22/Desktop/calderaria/src/styles/shadcn.css), [Button](C:/Users/Rv22/Desktop/calderaria/src/components/ui/button.tsx), [registro GSAP](C:/Users/Rv22/Desktop/calderaria/src/motion/gsap.ts), [configuração ESLint](C:/Users/Rv22/Desktop/calderaria/eslint.config.js) e [setup dos testes](C:/Users/Rv22/Desktop/calderaria/src/test/setup.ts).

### Fontes tipográficas da referência

O CSS importa `@fontsource-variable/ibm-plex-sans` e `@fontsource/ibm-plex-sans-condensed`; a família de corpo é IBM Plex Sans Variable e os títulos editoriais usam IBM Plex Sans Condensed. Isso é uma escolha visual do projeto industrial, não uma obrigação tipográfica para a advocacia. Fonte: [CSS Shadcn](C:/Users/Rv22/Desktop/calderaria/src/styles/shadcn.css).

### Pacotes declarados sem uso localizado em `src`

`axios` 1.16.1, `jspdf` 4.2.1 e `jwt-decode` 4.0.0 estão declarados e resolvidos nas duas cópias, mas a busca textual nos respectivos diretórios `src` não encontrou referências a esses nomes. A presença desses pacotes não comprova API, autenticação ou geração de PDF implementadas. Eles não precisam ser copiados para um frontend de advocacia sem requisito correspondente.

Fontes: os dois `package.json`, os dois lockfiles e busca por `axios|jspdf|jwt-decode` nas duas árvores `src`.

## 4. Ambiente e comandos existentes

O pacote Vite instalado declara o requisito Node **`^20.19.0 || >=22.12.0`**. A documentação da referência recomenda Node 22.12 ou superior. Não foi encontrado um campo `engines` no `package.json` principal que fixe por si só a versão do projeto; o requisito acima pertence ao Vite inspecionado.

Fontes: [package.json do Vite instalado](C:/Users/Rv22/Desktop/calderaria/node_modules/vite/package.json) e [desenvolvimento local](C:/Users/Rv22/Desktop/calderaria/docs/desenvolvimento.md).

| Script principal | Implementação |
| --- | --- |
| `npm run dev` | `vite --host 0.0.0.0` |
| `npm run build` | `tsc -b && vite build` |
| `npm run lint` | `eslint .` |
| `npm run test` | `vitest` |
| `npm run test:run` | `vitest run` |
| `npm run preview` | `vite preview` |

A cópia aninhada possui apenas dev/build/lint/preview. A raiz principal contém **20 arquivos** com sufixo `.test.ts` ou `.test.tsx`; a cópia aninhada não contém arquivos com esses sufixos no `src` inspecionado. Esta coleta não executou a suíte e não declara que os testes passam.

Fonte dos scripts: [package.json principal](C:/Users/Rv22/Desktop/calderaria/package.json) e [package.json aninhado](C:/Users/Rv22/Desktop/calderaria/Caldeiraria/package.json). Fonte da contagem: enumeração local de arquivos nas duas árvores `src`.

## 5. Convenções observadas

| Área | Padrão encontrado | Fonte local |
| --- | --- | --- |
| Organização | `components`, `pages`, `content`, `routes`, `styles`, `motion`, `test` | `src/` e `docs/arquitetura.md` |
| Layout | `SiteLayout` compartilhado; páginas compostas por seções | `src/components/SiteLayout`, `src/pages/Home/sections` |
| Conteúdo | Dados tipados separados da renderização; conteúdo integral e sínteses editoriais em módulos distintos | `src/content/institutionalContent.ts`, `homeContent.ts`, `companyContent.ts`, `siteData.ts` |
| Alias | `@` aponta para `src` tanto no Vite quanto no TypeScript | `vite.config.ts`, `tsconfig.app.json` |
| React | Componentes funcionais, hooks locais, `StrictMode` | `src/main.tsx` e componentes |
| Estilos | Props transitórias com `$` no styled-components | `src/pages/siteStyles.ts`, `docs/padroes-de-codigo.md` |
| UI | Primitives em `components/ui`; composições da identidade em `components/brand` | `components.json`, `src/components` |
| Testes | Vitest + jsdom, cleanup após cada teste e mocks de APIs do navegador | `vite.config.ts`, `src/test/setup.ts` |
| Qualidade | Scripts de teste/lint/build e validação manual por rota, mobile, teclado e movimento reduzido | `docs/qualidade-e-validacao.md` |
| Documentação | Documentos temáticos com índice por tarefa | `docs/README.md` |
| Agentes | Papéis de produto, UX, arquitetura, frontend, integrações, QA, acessibilidade/performance, segurança, release, revisão e documentação | `agents/README.md` |

O [tsconfig.app.json](C:/Users/Rv22/Desktop/calderaria/tsconfig.app.json) ativa verificações como `noUnusedLocals`, `noUnusedParameters` e `noFallthroughCasesInSwitch`, mas **não declara `strict: true`**. TypeScript estrito pode ser escolhido para o Delano como melhoria; não deve ser apresentado como configuração herdada já existente.

## 6. Estratégia de UI e movimento

O Shadcn está configurado com **`base-nova`**, `rsc: false`, TSX, Base UI, paleta base neutral, variáveis CSS e Lucide. `Button` e `Separator` existem como código local. O styled-components continua sendo amplamente usado nas páginas; a documentação descreve uma adoção incremental do Tailwind/Shadcn, não uma migração concluída.

Fontes: [components.json](C:/Users/Rv22/Desktop/calderaria/components.json), [documento Shadcn](C:/Users/Rv22/Desktop/calderaria/docs/shadcn-ui.md), [Button](C:/Users/Rv22/Desktop/calderaria/src/components/ui/button.tsx), [Separator](C:/Users/Rv22/Desktop/calderaria/src/components/ui/separator.tsx) e [estilos globais](C:/Users/Rv22/Desktop/calderaria/src/styles/GlobalStyles.ts).

O movimento tem registro central em `src/motion/gsap.ts`, motor separado do React em `siteMotion.ts`, conexão por hook em `SiteLayout/useSiteMotion.ts` e cleanup local. A referência usa ScrollTrigger para estados do cabeçalho e revelações e usa GSAP no carrossel e em contadores. Há tratamento de `prefers-reduced-motion` no CSS e nos hooks. Esses padrões de ciclo de vida são reaproveitáveis; o cabeçalho liquid glass industrial, suas cores e seus limiares não precisam ser copiados para o Delano.

Fontes: [movimento documentado](C:/Users/Rv22/Desktop/calderaria/docs/movimento-e-gsap.md), [motor](C:/Users/Rv22/Desktop/calderaria/src/motion/siteMotion.ts), [hook](C:/Users/Rv22/Desktop/calderaria/src/components/SiteLayout/useSiteMotion.ts), [carrossel](C:/Users/Rv22/Desktop/calderaria/src/pages/Company/HistoryCarousel.tsx) e [contadores](C:/Users/Rv22/Desktop/calderaria/src/pages/Home/sections/StructureSection.tsx).

## 7. Skills identificadas

O [skills-lock.json principal](C:/Users/Rv22/Desktop/calderaria/skills-lock.json) registra as nove skills abaixo; os respectivos arquivos `SKILL.md` existem em `.agents/skills/` na raiz principal.

| Skill | Origem registrada | Finalidade documentada |
| --- | --- | --- |
| `frontend-design` | `anthropics/skills` | Direção visual, composição, tipografia e identidade de interfaces |
| `gsap-core` | `greensock/gsap-skills` | Tweens, propriedades, easing, stagger e `matchMedia` |
| `gsap-react` | `greensock/gsap-skills` | Hooks, refs, escopo e cleanup em React |
| `gsap-scrolltrigger` | `greensock/gsap-skills` | Gatilhos de viewport, batch, refresh e ciclo de vida |
| `gsap-timeline` | `greensock/gsap-skills` | Sequências, labels e posições relativas |
| `gsap-performance` | `greensock/gsap-skills` | Jank, propriedades animadas, triggers e `will-change` |
| `gsap-utils` | `greensock/gsap-skills` | Helpers oficiais de seleção e mapeamento |
| `gsap-plugins` | `greensock/gsap-skills` | Avaliação e uso de plugins adicionais |
| `gsap-frameworks` | `greensock/gsap-skills` | Integração de GSAP com outros frameworks |

A cópia aninhada registra e contém somente `frontend-design`, conforme seu [skills-lock.json](C:/Users/Rv22/Desktop/calderaria/Caldeiraria/skills-lock.json).

A skill `shadcn` é mencionada pela documentação como instalada no ambiente global do Codex, e não no lockfile local das nove skills. Esse é um nível de disponibilidade distinto das skills versionadas no projeto. Fonte: [docs/shadcn-ui.md](C:/Users/Rv22/Desktop/calderaria/docs/shadcn-ui.md).

**Limite da evidência:** arquivos locais e lockfiles comprovam disponibilidade/registro. A documentação comprova quando o projeto orienta consultá-los. O código comprova uso das bibliotecas GSAP e Shadcn/Base UI. Nada disso, isoladamente, prova quais skills foram de fato invocadas em cada sessão de IA; esta auditoria não afirma esse histórico.

## 8. Integrações e operação

- O formulário em `src/pages/Contact/index.tsx` usa `preventDefault`, muda estado local para sucesso e limpa os campos. Não há request nesse fluxo; o sucesso é simulado e não comprova envio de mensagem. Fonte: [Contact](C:/Users/Rv22/Desktop/calderaria/src/pages/Contact/index.tsx).
- O layout lê URLs públicas opcionais em `VITE_WHATSAPP_URL`, `VITE_INSTAGRAM_URL` e `VITE_LINKEDIN_URL`; os controles dependem dessas configurações. Isso não é um segredo de backend. Fonte: [SiteLayout](C:/Users/Rv22/Desktop/calderaria/src/components/SiteLayout/index.tsx).
- `public/.htaccess` contém fallback de URLs da SPA para `index.html` em Apache. Isso é uma configuração concreta; não confirma um provedor de hospedagem contratado ou uma publicação feita. Fonte: [.htaccess](C:/Users/Rv22/Desktop/calderaria/public/.htaccess).
- Não foram encontrados arquivos de pipeline CI/CD ou de provedores como Railway, Vercel ou Netlify na árvore de referência inspecionada. A própria documentação diz que o provedor/pipeline não está configurado. Fonte: [deploy e operação](C:/Users/Rv22/Desktop/calderaria/docs/deploy-e-operacao.md) e inventário de arquivos.

## 9. Divergências e cuidados na reutilização

1. **Raiz versus cópia aninhada:** o projeto salvo no aplicativo e a raiz canônica documentada não apontam para a mesma pasta. O Delano deve ter uma raiz única.
2. **Resumo de stack incompleto:** o README principal lista a base React/TS/Vite/Router/styled, mas omite as adições verificadas no package/config: UI, Tailwind, movimento e testes. Usar package/config/source como prova de implementação.
3. **Comandos e testes diferentes:** os comandos de teste só existem na raiz principal. Não declarar que funcionam numa pasta que não contém esses scripts.
4. **TS estrito:** não é configuração existente; registrá-lo como decisão própria caso adotado no Delano.
5. **Variáveis públicas:** a seção de ambiente em `docs/desenvolvimento.md` informa que não há variáveis obrigatórias documentadas; o código atual já usa três variáveis opcionais de URLs sociais. As duas afirmações precisam ser lidas com essa distinção.
6. **Links sociais:** `docs/qualidade-e-validacao.md` mantém uma observação antiga sobre links genéricos, mas o layout atual controla a exibição pelas URLs opcionais. A verificação do código é necessária antes de copiar a limitação.
7. **Formulário:** a simulação local não deve virar um padrão de produção. No Delano, feedback de envio exige resposta real de uma integração, se ela for implementada.
8. **Identidade e conteúdo:** cores industriais, fontes IBM Plex, certificações, números de área, clientes, imagens e rotas da Vulcano pertencem ao outro projeto. O Delano tem fontes de design e conteúdo próprias já documentadas.

## 10. Base sugerida para o Delano

As decisões normativas do Delano devem ser registradas nos documentos próprios; esta seção oferece apenas a tradução das evidências para o escopo atual:

- **Reaproveitar a base técnica:** React, TypeScript, Vite, npm/lockfile, React Router para navegação prevista e styled-components conforme o padrão já utilizado.
- **UI:** manter Shadcn/Base UI e Tailwind como ferramentas de primitives, com tokens e limites claros entre essas primitives e o estilo das seções. O Delano não possui legado a migrar; justificar a convivência das camadas, em vez de copiar a razão histórica da Vulcano.
- **Movimento:** GSAP com `@gsap/react` somente para os movimentos definidos no design, com escopo, cleanup e movimento reduzido. A imagem estática do Behance não comprova uma animação específica.
- **Qualidade:** Vitest, Testing Library, jsdom e ESLint como base planejada; comandos só passam a ser executáveis após criar os respectivos arquivos e dependências.
- **Conteúdo:** módulos tipados como fonte operacional e rastreabilidade para os textos e arquivos originais reunidos em `docs`; sem criar serviços, avaliações ou qualificações a partir da referência visual.
- **Dependências condicionais:** React Compiler, Axios, autenticação, banco de dados, PDF, CRM e backend só entram quando um requisito demonstrar a necessidade. A presença na referência não os torna requisitos do novo site.
- **Skills:** documentar os gatilhos úteis de design, Shadcn e GSAP; distinguir disponibilidade no ambiente de instalação local. Esta auditoria não instalou nem copiou skills para o Delano.

O Delano estava em fase documental no início desta auditoria: possuir uma stack definida na documentação não significa ter `package.json`, `src`, testes, Git ou hospedagem já implementados. Os próximos documentos devem preservar essa diferença para evitar instruções de ambiente que aparentem funcionar antes da implementação.
