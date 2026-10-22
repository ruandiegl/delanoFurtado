# Stack e decisões técnicas

## Estado e proveniência

**Tipo: WEB.** O MVP está implementado a partir da [auditoria de caldeiraria](03-auditoria-referencia-caldeiraria.md). As versões efetivas estão em package.json/package-lock.json locais; a tabela abaixo preserva a origem histórica.

As versões da coluna de referência foram observadas no lockfile de caldeiraria em 22/10/2026. Elas não substituem o lockfile próprio já criado no Delano.

| Camada | Base definida para Delano | Versão resolvida na referência |
| --- | --- | --- |
| Interface | React e React DOM 19 | 19.2.6 |
| Linguagem | TypeScript 6 | 6.0.3 |
| Desenvolvimento/build | Vite 8 | 8.0.13 |
| Navegação | React Router DOM 6 | 6.30.3 |
| Composição visual | styled-components 6 | 6.4.1 |
| Primitives de UI | shadcn/ui com Base UI | CLI 4.21.0; Base UI 1.8.0 |
| Estilos de primitives | Tailwind 4 e plugin Vite | 4.3.3 |
| Ícones | Lucide React | 1.47.0 |
| Movimento, quando necessário | GSAP 3 e `@gsap/react` | 3.15.0 e 2.1.2 |
| Testes | Vitest, React Testing Library, jest-dom, user-event e jsdom | 5.0.1; 16.3.3; 7.0.1; 14.6.7; 29.1.1 |
| Análise estática | ESLint e typescript-eslint | ESLint 10.4.0 no lock de referência |
| Pacotes | npm e lockfile versionado | npm sem versão fixada no projeto atual |

## Por que manter essa base

O time já trabalha com componentes funcionais, conteúdo tipado separado da UI, rotas explícitas, estilos locais, primitives acessíveis e movimento com cleanup. Essa continuidade reduz mudanças de ferramenta entre os projetos.

O novo site não herda o catálogo industrial, cores laranja/azul, tipografia IBM Plex, cabeçalho liquid glass ou infraestrutura de caldeiraria. Cada um desses elementos pertence ao produto de origem.

## Fronteira entre os estilos

- styled-components: layouts de páginas, seções e composições específicas da marca.
- shadcn/Base UI: comportamento e estrutura de controles reutilizáveis, como botões, diálogos, navegação móvel e accordion quando necessários.
- Tailwind: implementação dos primitives e classes de layout desses componentes.
- Tokens CSS: valores semânticos únicos, compartilhados pelos dois sistemas.

A mesma responsabilidade visual não deve ser implementada em dois botões ou dois temas independentes. Consulte [shadcn/ui](shadcn-ui.md) e [Design system](design-system.md) para o contrato exato.

## Decisões adaptadas

- **TypeScript estrito:** requisito para o novo projeto; melhoria deliberada, pois a referência não declara `strict: true`.
- **React Compiler:** existe no projeto de origem, mas é opcional aqui. Só ativar com configuração e validação próprias; não é requisito para entregar a landing page.
- **GSAP:** disponível na stack planejada, usado apenas quando o comportamento justificar a dependência. Transições CSS simples continuam válidas.
- **Sem estado global inicial:** estado de menu, accordion e contato fica próximo de seus consumidores.
- **Sem backend inicial:** contato por canais oficiais; envio por servidor é evolução separada.
- **SEO:** a estrutura Vite é mantida, com decisão explícita sobre HTML indexável e metadados por rota antes da publicação; consulte [SEO](seo-acessibilidade-performance.md).

## Dependências não herdadas automaticamente

Axios, jsPDF e jwt-decode aparecem nos manifests de caldeiraria, mas não tiveram uso identificado em `src/` na auditoria. O Delano não possui requisito inicial para esses pacotes. Tampouco precisa de autenticação, ORM, banco, plataforma de pagamento ou biblioteca de estado global.

A inclusão de qualquer pacote deve registrar finalidade, alternativa já existente, impacto no bundle e verificação necessária. Consulte versões e scripts no manifest e lockfile locais.

## Runtime de referência

O pacote Vite auditado declara Node `^20.19.0 || >=22.12.0`. Para padronização do novo projeto, a linha de partida é **Node 22.x, a partir de 22.12**, sujeita aos engines do conjunto que for efetivamente instalado. Registrar a versão escolhida na configuração do projeto e no ambiente de build; não inferir o runtime a partir de `@types/node`.

## Conjunto instalado no MVP

Em 22/10/2026: Node 22.15.0; npm 11.21.1 temporário; React/DOM 19.2.6; TypeScript 6.0.3; Vite 8.3.5; Router DOM 6.30.6; styled-components 6.4.1; Base UI 1.8.0; Tailwind/plugin 4.3.3; GSAP 3.15.0 e @gsap/react 2.1.2; Vitest 5.0.5; Sharp 0.35.5; Manrope Variable 5.3.0.

Vite, Router, Vitest e Sharp receberam correções compatíveis após auditoria. A CLI shadcn foi usada para gerar Button/Sheet/Separator oficiais e removida das dependências permanentes; futuras gerações usam CLI temporária. Dois apontamentos moderados do Router 6 permanecem, analisados em [Segurança](seguranca-e-privacidade.md).

Sharp prepara mídia somente no desenvolvimento. Babel core, plugin Rolldown e babel-plugin-styled-components mantêm IDs estáveis no cliente/renderizador. O bundle de movimento é separado; uma única fonte Manrope Latin de 24,83 kB é carregada localmente. React Compiler, Axios, banco, login e envio não foram acrescentados.
