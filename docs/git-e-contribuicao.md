# Git e contribuição

## Estado atual

Git inicializado nesta raiz em 22/10/2026, na branch `main`, com `origin` apontando para [ruandiegl/delanoFurtado](https://github.com/ruandiegl/delanoFurtado). O remoto foi conferido vazio antes do primeiro envio. O estado de publicação e suas evidências ficam em [Deploy e operação](deploy-e-operacao.md).

Conferir `git status` e `git remote -v` antes de contribuir. Os links absolutos da auditoria apontam para fontes locais de caldeiraria; eles são evidência histórica, não diretórios que devem ser copiados para o repositório novo.

## Unidade de mudança

Uma mudança deve ter objetivo e critério de aceite claros. Conteúdo, estilo ou comportamento podem ficar juntos quando forem necessários ao mesmo resultado; uma refatoração sem relação deve ter seu próprio escopo.

Quando houver fluxo com revisão, usar uma branch por mudança, com prefixos descritivos como `feat/`, `fix/`, `docs/` ou `codex/`, conforme o fluxo do repositório configurado. Confirmar branch base e estado de trabalho antes de alterar histórico.

## Commits e PRs

Commits pequenos e coesos podem usar `feat:`, `fix:`, `docs:`, `refactor:` e `test:`. Explicar intenção, sem afirmar checks não executados.

Uma PR deve informar problema/resultante, rotas ou dados afetados, validação e limitações materiais. Mudança visual inclui capturas comparáveis. Documentos e agentes afetados devem acompanhar a decisão implementada.

Usar o template do repositório quando existir. O texto de uma PR não precisa repetir o histórico da conversa ou alternativas abandonadas.

## Arquivos versionados

- Código, configurações, testes, docs e perfis de agentes.
- `package.json` e lockfile quando a aplicação for inicializada.
- Imagens originais preservadas e derivados intencionais, com rastreabilidade.
- Exemplos de configuração sem segredos, quando necessários.

Dependências instaladas, `dist/`, `.prerender/`, caches, logs, segredos e o vínculo pessoal `.netlify/` ficam fora do versionamento pelo `.gitignore` existente.

## Conferência de segredos

Antes de preparar um envio, conferir os arquivos rastreados e os novos candidatos; o `.gitignore` só exclui arquivos ainda não rastreados. Estes comandos mostram caminhos e estatísticas, sem despejar possíveis credenciais no terminal:

```text
git status --short --untracked-files=all
git ls-files -ci --exclude-standard
git diff --cached --stat
git diff --check
```

`git ls-files -ci --exclude-standard` deve retornar vazio. Se houver arquivo privado já rastreado, remover apenas esse caminho com `git rm --cached -- <caminho>` preserva a cópia local; revisar a exclusão antes de commit/push. Isso não apaga versões anteriores do histórico. Não executar `git rm -r --cached .` nem force push como limpeza genérica.

Para procurar segredos no histórico, usar o [Gitleaks oficial](https://github.com/gitleaks/gitleaks), com versão e checksum conferidos. A ferramenta foi executada localmente na auditoria; não é dependência npm nem um bloqueio automático instalado neste projeto:

```text
gitleaks git . --log-opts="--all --full-history" --redact=100 --no-banner
gitleaks git . --staged --redact=100 --no-banner
```

A segunda chamada examina o conteúdo preparado para commit. Alterações não preparadas e arquivos novos também precisam de varredura local, sem incluir dependências ou builds; a auditoria usou uma cópia dos candidatos retornados por Git. Não publicar relatórios brutos ou fornecer credenciais a validadores externos. A redação reduz a exposição dos valores no resultado, mas caminhos e metadados ainda podem ser privados.

Um segredo confirmado exige revogação/rotação no provedor e avaliação dos commits afetados. Reescrita de histórico e limpeza de cópias remotas são operações separadas, com coordenação explícita. Uma verificação sem achados não garante ausência de qualquer segredo. Ver [Segurança](seguranca-e-privacidade.md#repositório-e-evidências-privadas) e [evidência da auditoria](evidencias/auditoria-repositorio-segredos-2026-10-30.md).

## Revisão e autorização

Antes de integrar, verificar o diff, os checks de [Qualidade](qualidade-e-validacao.md) e a consistência com o escopo. Operações externas, publicação e alterações de acesso seguem a autorização concreta do usuário e as regras do ambiente; o papel do agente, por si só, não concede essa autorização.

Preservar alterações de outras pessoas. Evitar reset, limpeza destrutiva ou reescrita de histórico para resolver um problema que pode ser corrigido com uma mudança rastreável.

## Documentação

Cada decisão tem documento responsável. Ao mudar stack, estrutura, rota, integração ou qualidade, atualizar a guideline correspondente e o índice apenas se o mapa de leitura mudar. Corrigir links movidos e manter o registro histórico das fontes separado da regra atual.
