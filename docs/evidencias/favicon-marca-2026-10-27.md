# Favicon da marca atual — 27/10/2026

## Pedido e diagnóstico

O usuário mostrou um resultado orgânico do Google com um ícone antigo em tom turquesa e pediu usar a logo atual. A imagem ao lado do nome do site nesse resultado é um favicon; o nome e a prévia textual não foram alterados por esta tarefa.

A conferência HTTP do domínio encontrou a referência antiga de 32px no head e PNGs DF de 32/180px com status 200. `/favicon.ico` retornava 404. O resultado da busca mostrou uma imagem distinta, compatível com uma versão anterior ainda processada pelo Google; a captura não comprova a causa ou o estado do índice no Search Console.

## Implementação

- Reutilizado o monograma original `docs/assets/delano-furtado/favicon-monograma-df.png`, SHA-256 `d3b2ac038576df79f6cb8b6fb94dd4c0e1c11cf147c249e4792b7c5e778f9cf8`, que corresponde ao DF preto/dourado da logo horizontal. Original, logo do cabeçalho, retratos e selo permanecem preservados.
- Derivados com fundo branco opaco para manter contraste do D preto em resultados escuros: PNG 32, **96** e 180px; ICO com 16/32/48/256px. São exportações determinísticas da marca, sem geração ou redesenho.
- `scripts/prepare-favicons.mjs` e `npm run assets:favicons` conferem o original, geram os arquivos e atualizam suas entradas no manifesto derivado. O fluxo completo `assets:prepare` chama o mesmo gerador.
- O head estático compartilhado dos quatro HTMLs declara PNG 96px e Apple 180px. `/favicon.ico` fica disponível como compatibilidade; a prévia permite servir esse arquivo real.
- O pacote FTP exige/inclui o ICO da raiz; a verificação de build confere referência, dimensões, opacidade e cabeçalho do ICO.

## Validação

- RED observado no teste de empacotamento: a allowlist anterior recusava `favicon.ico`. RED separado na prévia: o caminho era tratado como página 404. Ambos passaram após as correções.
- **15 testes em dois arquivos**, todos aprovados, cobrindo empacotamento e roteamento da prévia. Lint e `build:ftp` aprovados; não foi repetida a suíte inteira de Analytics, cuja implementação não mudou nesta tarefa.
- Inspeção visual do PNG 96px: monograma DF atual em preto/dourado sobre branco. Pillow abriu o ICO e decodificou as quatro dimensões; cantos brancos confirmados em todas.
- Pacote: **`release-ftp/20261028T005424408Z-6126b027/site`**, **35 arquivos, 2.726.835 bytes**. Mantém as alterações anteriores, inclusive GA4 condicionado a origem/consentimento e frase atualizada da Hero. O identificador usa UTC; a data local do registro é 27/10.
- HTTP local: Home, localização, contato, PNG 96/180 e ICO responderam 200 com MIME próprio; as três páginas declaram o favicon de 96px. Os 35 hashes/tamanhos do pacote e os links locais da documentação foram conferidos. [Respostas registradas](favicon-http-local-2026-10-27.json).

## Publicação e resultado no Google

Enviar o conteúdo desse pacote, incluindo `favicon.ico`, PNGs e os HTMLs, conforme o [guia FTP](../publicacao-hostgator-filezilla.md). Depois conferir a Home, `/media/favicon-96.png` e `/favicon.ico` no domínio. No Search Console, inspecionar a Home e solicitar indexação, quando necessário, para sinalizar a atualização.

O Google precisa rastrear a Home e o favicon novamente. Sua documentação recomenda tamanho superior a 48px, quadrado, URLs estáveis e acesso pelos crawlers; a atualização pode levar dias a semanas e a exibição não é garantida. O agente não alterou arquivos remotos, painéis ou resultados da busca nesta tarefa. [Fonte oficial](https://developers.google.com/search/docs/appearance/favicon-in-search?hl=pt-br).
