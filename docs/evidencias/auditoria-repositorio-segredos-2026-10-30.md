# Auditoria de arquivos e segredos no Git — 30/10/2026

## Objetivo e base

Conferir o conteúdo que está no repositório público e os candidatos ao próximo envio, retirar material privado e reforçar as exclusões, preservando alterações existentes e arquivos locais necessários.

- Perfil aplicado: [Security Engineer](../../agents/security-engineer.md), com as regras de [Segurança](../seguranca-e-privacidade.md) e [Git](../git-e-contribuicao.md).
- Repositório conferido pelo conector GitHub: [ruandiegl/delanoFurtado](https://github.com/ruandiegl/delanoFurtado), público; branch retornada na consulta: `main`.
- HEAD local e `main` remoto consultado: `083c79f68845cfdefad2fbcfd45d690e4d91e5e9`.
- 247 arquivos rastreados; 8 arquivos novos candidatos no início da auditoria. Nenhum arquivo estava preparado no índice para commit.
- Histórico disponível: 11 commits, incluindo a história alcançável pelas referências locais e remotas disponíveis nesta cópia.

## Verificações e resultado

| Verificação | Evidência |
| --- | --- |
| Nomes de ambientes, chaves, credenciais, sessões e configurações FTP | Nenhum `.env` ou arquivo privado dessas categorias identificado entre os rastreados/candidatos originais ou nomes adicionados no histórico consultado |
| Arquivos rastreados que já deveriam ser ignorados | `git ls-files -ci --exclude-standard`: vazio antes e depois da revisão |
| Busca complementar por padrões de credenciais | 188 arquivos de texto dos 255 candidatos originais; nenhum padrão de chave privada, token, senha atribuída, JWT ou URL com usuário/senha encontrado |
| Gitleaks no histórico | Versão 8.30.1, configuração padrão, 11 commits, cerca de 1,05 MB examinados, saída 0, nenhum achado |
| Gitleaks nos arquivos atuais | Cópia local dos 255 candidatos originais, incluindo não preparados e novos; cerca de 2,25 MB examinados, saída 0, nenhum achado |
| Gitleaks após os ajustes | 254 candidatos finais, com a nova evidência e sem as duas capturas privadas; cerca de 2,26 MB examinados, comentários de supressão desconsiderados, saída 0, nenhum achado |
| Regras de ignore reforçadas | 88 caminhos representativos conferidos por `git check-ignore --no-index --stdin -z`: 76 privados/gerados excluídos e 12 públicos permitidos |
| Capturas autenticadas do GA4 | Duas imagens antes não rastreadas movidas para `.private/evidencias/`; SHA-256 de cada arquivo conferido antes/depois, sem alteração de conteúdo |
| Documentação e diff | 67 links locais dos documentos envolvidos conferidos, nenhum quebrado; `git diff --check` sem erro de whitespace |

O [Gitleaks](https://github.com/gitleaks/gitleaks) foi obtido da release oficial, com SHA-256 do ZIP Windows x64 conferido no arquivo de checksums da mesma release: `d29144deff3a68aa93ced33dddf84b7fdc26070add4aa0f4513094c8332afc4e`. Executável e relatórios locais ficam em `.superpowers/repository-audit-20261030/`, já ignorado. Nenhum arquivo do projeto foi enviado a um serviço de análise; o conector foi usado para consultar os metadados do próprio repositório.

## Ajustes

1. Ampliado o `.gitignore` para ambientes locais, arquivos de autenticação, chaves/cofres, credenciais de FTP/provedores, sessões de navegador, exportações e backups.
2. Criada a convenção `.private/` para capturas de contas e outros materiais privados. A pasta fica fora do versionamento e dos diretórios públicos do site.
3. Preservadas localmente as duas capturas do GA4 que ainda não haviam sido versionadas. O [registro do recebimento](ga4-recebimento-2026-10-28.md) mantém o resumo de validação e informa a restrição dos originais.
4. Atualizadas as guidelines de Segurança e Git com os limites do ignore, a inspeção do índice e o procedimento para um eventual segredo confirmado.

Não houve necessidade de `git rm --cached`: nenhum arquivo já rastreado foi identificado para exclusão. O ignore não altera versões anteriores nem impede inclusão forçada. Os IDs públicos do GA4/Ads e a verificação HTML do Search Console foram mantidos; eles não permitem acesso às contas.

## Limites e entrega

Busca por padrões não comprova ausência absoluta de segredos. Não houve OCR de imagens, inspeção de cofres externos, acesso às contas Google/FTP, coleta de credenciais ou análise de clones/forks/caches externos ao repositório consultado. Capturas do frontend público e mídia institucional permanecem versionadas.

Não foram alterados código da aplicação, dependências, contas ou configuração de coleta. Não houve commit, push, publicação, reescrita de histórico ou revogação de credenciais. As alterações desta revisão ficam locais para o próximo envio. A auditoria é pontual; não foi instalado hook ou workflow automático de bloqueio.

Como as mudanças afetam exclusões e documentação, a validação pertinente é a varredura dos candidatos, os casos de ignore, integridade das imagens e links locais/diff. Não foi necessário gerar build FTP nem repetir a suíte da interface.
