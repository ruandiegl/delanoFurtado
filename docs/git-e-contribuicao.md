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

## Revisão e autorização

Antes de integrar, verificar o diff, os checks de [Qualidade](qualidade-e-validacao.md) e a consistência com o escopo. Operações externas, publicação e alterações de acesso seguem a autorização concreta do usuário e as regras do ambiente; o papel do agente, por si só, não concede essa autorização.

Preservar alterações de outras pessoas. Evitar reset, limpeza destrutiva ou reescrita de histórico para resolver um problema que pode ser corrigido com uma mudança rastreável.

## Documentação

Cada decisão tem documento responsável. Ao mudar stack, estrutura, rota, integração ou qualidade, atualizar a guideline correspondente e o índice apenas se o mapa de leitura mudar. Corrigir links movidos e manter o registro histórico das fontes separado da regra atual.
