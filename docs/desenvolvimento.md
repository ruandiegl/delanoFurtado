# Desenvolvimento local

O frontend está implementado na raiz DelanoFurtado. Preserve docs/, agents/, plans/ e os originais. Consulte [Stack](stack-e-decisoes-tecnicas.md) e [Arquitetura](arquitetura.md) antes de alterar dependências e fronteiras.

## Ambiente e instalação

- Node **22.15.0**, registrado em .nvmrc; engine >=22.12.0 <23.
- npm **11.21.1**, registrado em packageManager. O npm global 10.9.2 encontrado nesta máquina falhou na resolução de peers (edgesOut null); foi usado npm 11 temporário sem alterar a instalação global.
- Instalação própria com package-lock.json, sem copiar dependências de caldeiraria.
- Git inicializado e vinculado ao remoto do projeto; consultar [Git e contribuição](git-e-contribuicao.md).

```powershell
node --version
npm.cmd exec --yes --package=npm@11.21.1 -- npm ci
npm run dev
```

Com npm 11.21.1 já configurado, use npm ci diretamente. Uma mudança deliberada usa npm install, com revisão do manifest e lockfile. Não misturar gerenciadores.

## Scripts disponíveis

| Comando | Resultado |
| --- | --- |
| npm run dev | Vite de desenvolvimento em 127.0.0.1 |
| npm run assets:prepare | Confere hashes dos arquivos de mídia registrados e prepara os derivados otimizados |
| npm run assets:favicons | Gera somente os favicons DF, sem reprocessar retratos; confere o hash do monograma original |
| npm run test / npm run test:run | Vitest interativo / execução única |
| npm run lint | ESLint e regras de hooks |
| npm run build | Type-check, cliente, renderizador e HTML por rota |
| npm run build:ftp | Build e verificação, seguidos de pacote HostGator versionado em release-ftp/ |
| npm run build:client | Bundle cliente em dist/; sozinho não é o artefato final |
| npm run build:server | Renderizador intermediário em .prerender/ |
| npm run prerender | Injeta HTML, CSS coletado e SEO; exige os dois builds anteriores |
| npm run verify:build | Confere quatro HTMLs, conteúdo, canonical, CSS, assets e sitemap |
| npm run verify:preview | Confere respostas HTTP da prévia já iniciada (porta 4173 por padrão) |
| npm run preview | Serve o HTML correto por rota, 404 e redirects de aliases |

O terminal informa endereço e porta. No PowerShell, prefira npm.cmd ao passar argumentos: `npm.cmd run preview -- --port 4173`. O ambiente desta sessão exige permissão de rede inclusive para servir/acessar loopback.

## Contrato do build

TypeScript valida os tipos. Vite compila cliente e src/entry-server.tsx; scripts/prerender.mjs chama renderPage com StaticRouter e coleta styled-components via ServerStyleSheet. O plugin Babel mantém os IDs de estilo nos dois builds. O cliente usa hydrateRoot quando o root contém elementos e createRoot no desenvolvimento vazio.

Saídas: dist/index.html, dist/localizacao/index.html, dist/contate-nos/index.html, dist/404.html, sitemap.xml, robots.txt, assets/ e media/. O renderizador Node não roda em produção. Netlify publica dist/; para HostGator/FileZilla usar o conteúdo de `release-ftp/<versão>/site`, gerado por `build:ftp`, conforme o [guia](publicacao-hostgator-filezilla.md). `.prerender/` é intermediário e não é publicado.

## Configuração e rotina

Os contatos ficam em src/content/siteData.ts. Não há .env obrigatório. Variáveis VITE_ são públicas; segredos de um eventual envio pertencem ao servidor, conforme [Integrações](integracoes-e-formularios.md).

1. Ler o contexto e confirmar o estado dos arquivos.
2. Implementar incremento coerente, com testes de comportamento quando pertinentes.
3. Executar os checks afetados e inspecionar a UI quando alterar apresentação ou interação.
4. Atualizar a guideline responsável e registrar evidência.

A entrega está em [mvp-001](evidencias/mvp-001.md). A prévia não comprova configuração do provedor, DNS, cache ou métricas de campo.
