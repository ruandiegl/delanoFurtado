# Pacote FTP com conteúdo atualizado — 27/10/2026

## Artefato

- Versão: `20261028T022139680Z-8704af0c` (identificador com data/hora UTC).
- Pasta para envio: `release-ftp/20261028T022139680Z-8704af0c/site`.
- Inventário: **35 arquivos, 2.729.786 bytes**. Tamanho e SHA-256 de todos os arquivos conferidos com `manifest.json`; nenhum arquivo ausente, extra ou divergente.
- Manifesto e instruções resumidas ficam fora de `site/` e devem permanecer locais.

## Conteúdo confirmado

- Descrição da Hero com linha em branco e CNPJ real `50.791.942/0001-03`. O HTML inicial não contém o placeholder `CNPJ: XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`.
- Nova biografia em quatro parágrafos, incluindo `Mackenzie/SP`, análise criteriosa, planejamento jurídico e comunicação clara. Conferida no HTML inicial do pacote.
- Botão flutuante verde WhatsApp e símbolos nos CTAs, preservando seta do cabeçalho/menu.
- GA4 `G-6Z7JD1757Y` com o modelo de consentimento existente, favicons DF, páginas pré-renderizadas e configuração Apache preservados.
- Nenhuma mudança no modelo de consentimento ou instalação de Ads nesta preparação.

## Validação executada

- `npm.cmd run lint`: aprovado.
- `npm.cmd run build:ftp`: aprovado, incluindo TypeScript, build client/server, pré-renderização e `verify:build`.
- `npm.cmd run test:run`: 90 de 93 testes passaram na primeira execução. Três falhas de ambiente: uma operação de junction com `EPERM` e duas conexões HTTP locais com `EACCES`.
- Nova execução de **todos os 14 testes dos dois arquivos afetados** (`scripts/package-ftp.test.mjs` e `scripts/verify-preview.test.mjs`) com o acesso necessário: **14 aprovados**. Assim, os 93 testes distintos da suíte foram verificados com sucesso ao final, sem alteração no código para contornar as restrições.
- `npm.cmd run verify:preview -- http://127.0.0.1:4174`: 11 documentos e 3 redirects canônicos aprovados; páginas públicas 200 e desconhecidas 404.
- Conteúdo e integridade conferidos diretamente no pacote. As [capturas da biografia](capturas/biografia-desktop-2026-10-27.png) registram a revisão visual anterior desta mesma biografia.

## Envio e limites

Enviar **o conteúdo** de `site/` para a raiz do domínio, incluindo `.htaccess`, `assets/.htaccess` e `favicon.ico`, conforme o [guia FileZilla](../publicacao-hostgator-filezilla.md). Fazer backup remoto, preservar `.well-known` e arquivos legados ainda necessários, enviar recursos/pastas antes dos HTMLs e `index.html` por último.

Nenhum upload foi realizado. A prévia Vite não executa Apache; conferir o domínio após o envio, bem como o recebimento no GA4. Manter a medição otimizada desativada. Conversões Google Ads permanecem pendentes da configuração própria.
