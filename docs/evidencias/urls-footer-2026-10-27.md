# URLs sem barra automática e rodapé — 27/10/2026

## Pedido e diagnóstico

O usuário solicitou corrigir a inclusão de barra final pelo servidor em localização/contato e a faixa branca abaixo do rodapé de localização. Alterações anteriores, conteúdo e mídia foram preservados.

- HTTP público já havia demonstrado 301 das duas URLs sem barra para suas pastas com barra. O frontend usa links sem barra e não faz requisição de documento ao navegar pelo menu.
- No navegador, a página publicada de localização em **1280 × 1080** deixou **64,97 px** abaixo do rodapé. O conteúdo tinha altura mínima de `68vh`, mas a composição externa não completava a altura da tela.
- O verificador HTTP também rejeitava `Location` absoluto do Apache mesmo quando apontava para a URL canônica correta.

## Correções preparadas

- `deploy/apache/.htaccess`: acrescentado `DirectorySlash Off`, preservando `Options -Indexes -MultiViews`, as reescritas explícitas para os HTMLs, HTTPS/host, queries e compatibilidade condicional da galeria. As versões com barra continuam atendidas com 200 e canonical sem barra; não foi criado um redirect inverso que pudesse entrar em ciclo com um 301 antigo guardado no navegador.
- `src/styles/GlobalStyles.ts`: raiz em coluna flexível, altura mínima `100dvh` com fallback `100vh`, e conteúdo principal ocupando o espaço livre. O rodapé continua no fluxo normal; não cobre conteúdo em páginas longas.
- `scripts/verify-preview.mjs`: resolução de `Location` contra a origem antes da comparação exata. Status incorreto, destino externo, caminho incorreto ou query inesperada continuam sendo recusados.
- `scripts/verify-preview.test.mjs`: servidor HTTP temporário e seis casos que cobrem as formas de redirecionamento e as recusas acima.

## Validação

- RED: o teste com `Location` absoluto falhou no verificador anterior; os cinco outros casos passaram.
- GREEN: suíte completa com **79 testes em 15 arquivos**, aprovada.
- `npm run lint`: aprovado.
- `npm run build:ftp`: aprovado, incluindo TypeScript, build, pré-renderização e `verify:build`.
- `npm run verify:preview -- http://127.0.0.1:4174`: **11 documentos e 3 redirects** aprovados na prévia Vite. Isso não executa as regras Apache.
- Navegador local, localização em 1280 × 1080: fundo do rodapé em **1080 px**, faixa restante **0 px**. Contato também terminou em 1080 px.
- Localização em 375 × 812 e em 812 × 375: rodapé coincide com o fim do documento dentro do arredondamento subpixel, sem rolagem horizontal. Home preservou cabeçalho sticky e rodapé ao fim do conteúdo, sem overflow horizontal. Nenhum erro de console observado.

## Artefato e envio

Novo pacote: `release-ftp/20261027T234714203Z-6c91610f/site`, **33 arquivos, 2.696.049 bytes**. O manifesto contém SHA-256/tamanho de cada arquivo; documentos e bundle cliente incluem o layout corrigido e o `.htaccess` inclui a configuração de diretórios.

Enviar seu **conteúdo** pelo FileZilla, incluindo o `.htaccess` da raiz. Enviar assets e pastas antes do `index.html`, conforme o [guia](../publicacao-hostgator-filezilla.md), mantendo backup da configuração anterior e recursos legados necessários. Nenhum arquivo remoto foi alterado pelo agente nesta tarefa.

Depois do envio, repetir o verificador no domínio final e testar acesso direto/refresh de localização e contato, preferencialmente também em sessão nova para evitar um 301 antigo em cache. Conferir queries sintéticas de campanha e demais aliases. O CLI Docker existe no computador, mas o engine não estava disponível; não houve execução local de Apache. A configuração preparada segue a [documentação oficial de DirectorySlash](https://httpd.apache.org/docs/2.4/mod/mod_dir.html#directoryslash); a validação do comportamento efetivo na HostGator fica pendente do envio.

## Capturas

- [Antes: faixa branca na publicação](capturas/localizacao-footer-antes-2026-10-27.png).
- [Depois: rodapé no fim da tela alta](capturas/localizacao-footer-corrigido-2026-10-27.png).
- [Depois: celular](capturas/localizacao-footer-mobile-corrigido-2026-10-27.png).
