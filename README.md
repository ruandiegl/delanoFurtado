# Delano Furtado — site institucional

Projeto WEB para renovar o frontend de Delano Furtado, usando uma referência visual própria e preservando os conteúdos e materiais coletados do site atual.

**Estado em 22/10/2026:** MVP implementado e [publicado no Netlify](https://delano-furtado.netlify.app/), com três páginas, HTML por rota, imagens otimizadas, GSAP React e testes. Consulte as [evidências do release](docs/evidencias/release-003.md).

**Stack definida:** React 19, TypeScript 6, Vite 8, React Router 6 e styled-components 6, com shadcn/Base UI/Tailwind para primitives e GSAP conforme a necessidade. Consulte a documentação para versões de referência, limites e etapas futuras.

- [Documentação principal e guidelines](docs/README.md)
- [Agentes de IA por função](agents/README.md)
- [Plano detalhado do MVP](plans/plan-001-mvp-landing-page-delano-furtado.md)
- [Auditoria da stack de caldeiraria](docs/03-auditoria-referencia-caldeiraria.md)
- [Referência de frontend](docs/01-referencia-design-advocacia.md)
- [Conteúdo e imagens do Delano](docs/02-conteudo-site-delano-furtado.md)

## Rodar localmente

Node 22.15.0 (`.nvmrc`) e npm 11.21.1. Para instalar sem alterar o npm global:

```powershell
npm.cmd exec --yes --package=npm@11.21.1 -- npm ci
npm run dev
```

Abra o endereço Local mostrado no terminal. Rotas: `/`, `/localizacao`, `/contate-nos` e 404 para endereços desconhecidos.

## Validar e gerar o artefato

```powershell
npm run test:run
npm run lint
npm run build
npm run verify:build
npm run preview
```

`dist/` contém HTML, CSS, JavaScript, mídia, sitemap e robots. `.prerender/` é intermediário e não deve ser publicado. Não há API, envio de formulário ou `.env` obrigatório; os contatos abrem canais oficiais.

[Evidências do MVP](docs/evidencias/mvp-001.md) registra os checks e limites. [Desenvolvimento](docs/desenvolvimento.md) explica scripts e manutenção. Originais preservados em `docs/assets/delano-furtado/`; `npm run assets:prepare` confere hashes e recria derivados.

Remoto: [ruandiegl/delanoFurtado](https://github.com/ruandiegl/delanoFurtado), branch `main`. O `netlify.toml` define build, publicação de `dist/`, rotas e cache. Procedimento e rollback em [Deploy e operação](docs/deploy-e-operacao.md). A análise dos dois apontamentos moderados restantes de React Router está em [Segurança](docs/seguranca-e-privacidade.md).
