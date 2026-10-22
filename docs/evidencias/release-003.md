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

Na inspeção desktop, a plataforma adicionou um iframe de selo de 64 px no rodapé que sobrepunha parte do WhatsApp flutuante. O layout passou a reservar espaço acima desse iframe quando ele existe, sem alterar a posição local quando o selo está ausente. A versão publicada deixou **20 px de separação** entre o botão e o iframe, conferidos no navegador.

O log do primeiro CI exibiu avisos de plugin GSAP em testes jsdom que montam o aplicativo sem passar pelo entry point; o build foi aprovado. A inspeção do console no navegador público é registrada separadamente, sem tratar esses avisos de teste como evidência de erro em produção.

## Entrega verificada

- Código final do aplicativo: [`1be05ab`](https://github.com/ruandiegl/delanoFurtado/commit/1be05ab7b8d34af4b9916a7a30329f1ea82d45c2), publicado automaticamente no [deploy 6ada51a0bde976d8fbc2f0df](https://app.netlify.com/projects/delano-furtado/deploys/6ada51a0bde976d8fbc2f0df). O painel confirmou `Published` e publicação automática ativada para `main`.
- Repetição final de `verify:preview` no Netlify: onze documentos e três redirects aprovados. Respostas desconhecidas têm status HTTP 404 e `noindex,follow`.
- Repetição final de recursos/headers: quatro documentos e nove recursos aprovados; bundle `index-ZvM8cJSd.js` ativo, arquivos com conteúdo e cache esperado, sitemap e robots acessíveis. [Registro HTTP](netlify-http-003.json).
- Navegador em **1280 × 720**: Home, localização com caixa diferente, contato com alias `INDEX.HTML` e tela de não encontrado renderizaram corretamente. Sem overflow horizontal ou imagem quebrada observados. O Imobiliário abriu seus treze itens, terminou com opacidade 1 e removeu a altura temporária. [Registro do navegador](netlify-navegador-003.json).
- Os metadados continuam usando o domínio profissional como canonical. Nenhuma troca de domínio, DNS, plano pago ou integração de envio foi feita.

Limites da inspeção: o console da ferramenta registrou uma mensagem `MutationObserver.observe` sem URL/arquivo de origem. A fonte não pôde ser atribuída pela interface de logs disponível; as navegações e interações acima foram concluídas. O registro conserva a mensagem, sem declarar console livre de erros. A prévia HTTP local não foi validada nesta etapa porque as conexões a localhost foram bloqueadas pelo ambiente; os testes de build/hidratação e as verificações HTTP no provedor foram aprovados. A inspeção visual deste release foi desktop; a matriz responsiva anterior está nas evidências do MVP.

![Página inicial publicada, com WhatsApp acima do selo da hospedagem](capturas/netlify-home-publicada.jpg)

Procedimento e restauração: [Deploy e operação](../deploy-e-operacao.md).
