# Arquitetura

## Estado deste desenho

Esta arquitetura está implementada no MVP WEB. `src/` contém a aplicação; `public/media/` contém derivados; `scripts/` prepara mídia e HTML; `dist/` é o artefato de produção. `docs/` e `agents/` preservam fontes e orientações.

## Estrutura implementada

```text
DelanoFurtado/
  docs/                         fontes, guidelines e originais de mídia
  agents/                       perfis de agentes por função
  public/media/                 derivados otimizados com URL estável
  scripts/                      prepare-assets, prerender e verify-build
  src/
    components/
      SiteLayout/               cabeçalho, menu, rodapé e atalho de contato
      ui/                       primitives shadcn/Base UI
      brand/                    composições visuais da marca Delano
    content/
      siteData.ts               identidade, contatos e abrangência
      services.ts               catálogo único de serviços
      homeContent.ts            organização e sínteses editoriais da Home
      seo.ts                    metadados por rota
    hooks/                      hooks reutilizados por consumidores reais
    lib/                        utilitários pequenos, incluindo cn quando usado
    motion/                     registro GSAP e motores com cleanup
    pages/
      Home/sections/            seções da landing page
      Location/                 página de localização
      Contact/                  canais e integração, quando existente
      NotFound/                 resposta visual para URL desconhecida
    routes/routes.tsx          mapa explícito de rotas
    styles/
      tokens.css                valores semânticos únicos do tema
      shadcn.css                Tailwind e mapeamento dos tokens para UI
      GlobalStyles.ts           regras globais mínimas de composição
    test/setup.ts              configuração compartilhada dos testes
    App.tsx                     composição de tema/layout e rotas
    main.tsx                    createRoot/hydrateRoot e BrowserRouter
    entry-server.tsx            StaticRouter e coleta de CSS somente no build
  index.html
  package.json
  package-lock.json
  components.json               configuração shadcn, quando inicializado
```

Criar somente os arquivos necessários ao incremento. Uma pasta prevista não é motivo para introduzir abstrações vazias.

## Fluxo principal

```text
fontes documentadas → conteúdo TypeScript tipado → página/seção → componente
index.html → main.tsx → BrowserRouter → App → SiteLayout → rota
tokens CSS → styled-components e primitives UI
refs locais → hook de movimento → motor GSAP → cleanup local
```

Os dados não devem depender de React. Componentes visuais recebem dados por props; eles não consultam o site antigo a cada visita.

## Contratos de conteúdo

- `siteData.ts`: único cadastro runtime de nome, OAB, CNPJ, contatos, redes e regiões. A procedência é o documento 02.
- `services.ts`: sete serviços com `id` estável, título, síntese, itens e `sourceSection`. Não há páginas individuais nem slugs redundantes no MVP.
- `homeContent.ts`: ordem das seções, sínteses e referências aos IDs de serviços. Evitar copiar contatos e catálogo para esse arquivo.
- `seo.ts`: título, descrição e caminho canônico por rota. O host de produção tem uma configuração única.
- Conteúdo novo pode ter estado editorial `confirmed`, `draft` ou `unavailable`; somente o conteúdo apto ao escopo publicado é renderizado. A origem e o critério estão em [Rotas e conteúdo](rotas-e-conteudo.md).

## Fronteiras

**SiteLayout:** comportamento compartilhado e navegação. Não recebe catálogo nem prosa da Home.

**ui:** código e comportamento dos primitives. **brand:** aparência e composição específica da marca; um `ContactCta` pode combinar um primitive de botão com ícone e informação do conteúdo.

**Página:** organiza seções. **Seção:** um bloco coerente com título, conteúdo e mídia. Extrair um componente genérico quando houver consumidores ou responsabilidade independente, não para cada `div`.

**motion:** recebe elementos e configuração; retorna descarte dos efeitos que criou. O motor não conhece regras de serviços ou dados pessoais.

**Integração de envio:** se criada, encapsula o contrato da rede fora dos componentes de apresentação. Chaves privadas ficam em um serviço servidor separado do bundle.

## Estado e falhas

Usar estado local para menu, accordion e eventual envio. Dados institucionais são estáticos; não precisam de cache remoto ou estado global.

Estados de envio só existem com integração real e distinguem edição, envio, sucesso e erro. Rotas desconhecidas exibem página própria; o servidor precisa de estratégia adicional se o status HTTP 404 for necessário. A ausência de conteúdo opcional não deve produzir espaços vazios ou promessas na UI.

## Evolução

CMS, API e novas páginas de serviços exigem decisão localizada em [Decisões](decisoes-e-pendencias.md). A pré-renderização já existe: build cliente → renderizador StaticRouter/ServerStyleSheet → HTML e metadados por rota → hidratação. `.prerender/` é intermediário e não deve ser publicado.
