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

Preparação local concluída. Registrar aqui o commit enviado, o projeto Netlify, a URL, o deploy e o resultado dos testes HTTP após a publicação efetiva. O domínio profissional e seus registros DNS não foram alterados.

Procedimento e restauração: [Deploy e operação](../deploy-e-operacao.md).
