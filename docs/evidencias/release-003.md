# Primeiro release no Netlify

Data: 22 de outubro de 2026. Escopo autorizado: enviar o projeto ao remoto informado e publicá-lo no Netlify.

## Preparação e validação local

- Remoto confirmado: `https://github.com/ruandiegl/delanoFurtado.git`, público, vazio antes do envio; branch `main`.
- Git inicializado na raiz existente, preservando código, documentação e mídia.
- `netlify.toml` preparado para Node 22.15.0/npm 11.21.1, publicação de `dist/`, HTML por rota, aliases, 404 e headers.
- TOML conferido com o parser `tomllib`: sintaxe válida, seis regras de rota e dois grupos de headers.
- **37 testes em 12 arquivos aprovados**; `npm run lint`, `npm run build` e `npm run verify:build` aprovados nesta preparação.
- O build verificou quatro HTMLs distintos, estilos, canonical por rota, catálogo completo, referências de mídia local, sitemap e robots.
- Inspeção dos arquivos a versionar: dependências, artefatos de build, caches, logs e `.env` ignorados; nenhum padrão de credencial encontrado na busca realizada.

## Envio e publicação

- Primeiro envio confirmado: [`31c019a`](https://github.com/ruandiegl/delanoFurtado/commit/31c019a64b7d8dc6893200d0d4032badaa7f256d), branch `main` com upstream `origin/main`.
- Projeto `delano-furtado`, equipe `unifoa` (`ruandiegl33`), importado do GitHub.
- Primeira publicação aprovada: [deploy 6ada4f1c1f2c9960c32fc851](https://app.netlify.com/projects/delano-furtado/deploys/6ada4f1c1f2c9960c32fc851), em 42 segundos. Netlify processou seis regras de redirect e dois grupos de headers sem erros.
- URL pública: **https://delano-furtado.netlify.app/**. Pushes em `main` acionam os checks e o deploy automático.
- O domínio profissional e seus registros DNS não foram alterados. Canonical e sitemap continuam apontando para `www.delanofurtado.adv.br` até a migração desse domínio; a URL Netlify permite conferir a nova versão.

## Compatibilidade observada no CDN

O primeiro smoke test HTTP detectou `/LOCALIZACAO` com status 200 e HTML da localização, enquanto o cliente esperava 404. Requisições adicionais confirmaram o mesmo comportamento em caixa mista e aliases `INDEX.HTML`. O conteúdo de rotas desconhecidas continuou em 404.

Foram reproduzidas **11 falhas** em testes de renderização, hidratação e preview antes da correção. O manifest passou a resolver somente os aliases das três páginas conhecidas para seus caminhos canônicos. Router e SEO utilizam essa mesma resolução, evitando trocar o HTML servido pelo CDN por uma tela de erro na hidratação. Nenhuma rota de serviço nova, backend ou função de borda foi acrescentada.

Após o ajuste: **46 testes aprovados em 12 arquivos**, além de lint, build e `verify:build`. A versão corrigida foi enviada em `f3d1ad0`; o smoke test público passou nos **onze documentos e três redirects**. Também foram conferidos quatro documentos, nove recursos referenciados, headers, cache, sitemap e robots; o bundle corrigido estava ativo. [Registro HTTP](netlify-http-003.json).

Na inspeção desktop, a plataforma adicionou um iframe de selo de 64 px no rodapé que sobrepunha parte do WhatsApp flutuante. O layout passou a reservar espaço acima desse iframe quando ele existe, sem alterar a posição local quando o selo está ausente. Conferir o espaçamento no navegador após a publicação desse ajuste.

O log do primeiro CI exibiu avisos de plugin GSAP em testes jsdom que montam o aplicativo sem passar pelo entry point; o build foi aprovado. A inspeção do console no navegador público é registrada separadamente, sem tratar esses avisos de teste como evidência de erro em produção.

Procedimento e restauração: [Deploy e operação](../deploy-e-operacao.md).
