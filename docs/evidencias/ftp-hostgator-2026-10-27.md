# Pacote HostGator/FTP — 27/10/2026

## Escopo e decisões de execução

O usuário confirmou a substituição no mesmo domínio `https://www.delanofurtado.adv.br`, HostGator/cPanel e FileZilla. Informou que ainda vai solicitar o acesso às contas Google. Preparação local do pacote; nenhuma publicação ou mudança de DNS/contas.

- **Ruling:** trabalhar na raiz existente, preservando as alterações textuais locais — preferência explícita em AGENTS.md; sem branch/worktree ou commit criado por esta execução.
- **Ruling:** executar as partes de empacotamento do plan-005 com domínio/provedor confirmados; manter inventário Ads/GA4 e publicação como etapas pendentes — o usuário ainda não tem os acessos e a decisão de Analytics posterior à publicação continua vigente.
- **Ruling:** criar `release-ftp/<versão>/site` em cada geração, com inventário fora da pasta publicável — evita apagar arquivos ou carregar resíduos de uma versão anterior. Custo: versões locais ocupam espaço até serem arquivadas pelo responsável.
- **Ruling:** preservar `/galeria` somente quando o HTML legado já existir no servidor — mantém uma possível URL de campanha sem inventar equivalência com a Home. A continuidade também depende dos bundles antigos e requer teste remoto.
- **Ruling:** aplicar a meta pública Search Console apenas ao pacote de produção — mantém o build comum/Netlify independente; não equivale à confirmação do estado da propriedade no painel.

## Implementação

- `scripts/package-ftp.mjs`: allowlist do build, validação de canonical/robots/sitemap, recusa de links simbólicos, preservação do `dist`, release versionado e inventário SHA-256.
- `deploy/apache/.htaccess`: HTTPS/host canônicos, aliases, HTML por rota, 404, preservação das queries, validações de certificado, headers e compressão opcionais conforme módulos.
- `deploy/apache/assets.htaccess`: cache imutável para arquivos com hash; mídia estável e HTML mantêm revalidação.
- `deploy/apache/search-console.html`: valor público obtido da cópia antiga, aplicado uma vez na Home do pacote.
- `npm run build:ftp`: build + verificação + empacotamento. `release-ftp/` fora do Git. [Guia de envio/restauração](../publicacao-hostgator-filezilla.md).

## Evidências

- RED observado: teste novo falhou por ausência de `package-ftp.mjs` antes da implementação.
- Primeira execução após implementação: sete testes aprovados; o oitavo foi impedido pelo ambiente restrito ao tentar criar uma junction temporária no Windows (`EPERM`). Não houve teste ignorado ou simulação desse resultado.
- Execução autorizada no ambiente do host: `npm run test:run` aprovado, **67 testes em 14 arquivos**, incluindo os oito testes de empacotamento e o caso de junction. As pastas temporárias são verificadas antes da limpeza.
- `npm run lint`: aprovado.
- `npm run build:ftp`: aprovado; inclui `npm run verify:build`, com quatro documentos HTML distintos, mídia, SEO, catálogo, sitemap e robots conferidos.
- Pacote gerado: `release-ftp/20261027T184538086Z-dea44f2e/site`, **33 arquivos, 2.696.489 bytes**. `manifest.json` e `LEIA-ME.md` ficam na pasta da versão, fora de `site/`.
- Revisão independente final: nenhum defeito importante identificado. Inventário dos 33 arquivos conferido contra SHA-256; meta Search Console uma vez na Home, ausente nos demais HTMLs; sem inclusão de `galeria.html`. Não houve diferença inesperada frente ao `dist`.
- Conferência adicional do responsável pela implementação: 33 hashes e tamanhos correspondem ao manifesto; valor Search Console coincide com a cópia antiga, uma única vez na Home; `dist/index.html` permanece sem a injeção exclusiva do pacote. Links locais da documentação conferidos e `git diff --check` sem erros.

## Limites

Avaliações em 27/10/2026: removidos o campo `relativeTime`, sua exibição e os estilos do tempo relativo; sete textos, autores e estrelas preservados. Os 12 testes existentes de carrossel/prerender, lint e `build:ftp` passaram. O HTML inicial foi conferido sem “meses atrás”/“semanas atrás” ou `card-time`. Novo pacote: `release-ftp/20261027T191948134Z-1ed358c8/site`, 33 arquivos e 2.695.281 bytes.

Refinamento visual em 27/10/2026: o ícone passou a ter **preenchimento vermelho**, com círculo interno na cor do fundo. Lint e `build:ftp` aprovados; CSS do HTML de produção conferido. Pacote correspondente: `release-ftp/20261027T191405363Z-3c1f075e/site`, 33 arquivos e 2.696.683 bytes.

Atualização em 27/10/2026: ícone do bloco “Volta Redonda” alterado para vermelho `#DC2626`, conferido no CSS do HTML de produção. Novo pacote: `release-ftp/20261027T191115670Z-0adf5e76/site`, 33 arquivos e 2.696.515 bytes, com as alterações textuais locais existentes incluídas. Foi corrigido o escopo do ESLint: `release-ftp/` também é saída gerada e precisa ser ignorada, como `dist/`; a primeira análise após a geração dos pacotes havia incluído os bundles minificados. Build FTP e verificação do artefato aprovados.

Sem Apache/Docker/PHP disponíveis localmente e sem publicação nesta execução. Redirects, 404, MIME, cache, compressão, permissões `.htaccess`, galeria e preservação de parâmetros ainda precisam de validação HTTP na HostGator. A existência da meta Search Console não comprova verificação ativa. GA4, Google Ads, conversões, consentimento e ingestão real continuam pendentes de acesso e do gate de publicação definitiva.

Fontes de servidor: [Apache — flags de rewrite](https://httpd.apache.org/docs/2.4/rewrite/flags.html), [compressão](https://httpd.apache.org/docs/2.4/mod/mod_deflate.html), [HostGator — mod_rewrite](https://suporte.hostgator.com.br/hc/pt-br/articles/30819431599891-Como-ativar-o-mod-rewrite-e-o-mod-speling) e [envio FileZilla](https://suporte.hostgator.com.br/hc/pt-br/articles/30817062131091-Como-enviar-arquivos-para-a-hospedagem-com-o-FileZilla).
