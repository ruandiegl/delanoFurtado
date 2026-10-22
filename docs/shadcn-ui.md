# shadcn/ui

## Estado e escolha

O Delano possui components.json com **Base UI/base-nova** e Button, Sheet e Separator gerados pela CLI oficial. Variantes brand/cta/touch usam os tokens da marca; Sheet tem fechamento em português. A CLI não é dependência permanente. A configuração não usa Radix nem um segundo tema.

shadcn mantém componentes como código-fonte do próprio projeto. A skill `shadcn` está disponível no ambiente observado e deve ser consultada ao inicializar, pesquisar, compor ou atualizar esses componentes.

## Fronteiras

- `src/components/ui/`: primitives e suas variantes.
- `src/components/brand/`: composições com a identidade do Delano.
- `src/styles/tokens.css`: valores semânticos únicos.
- `src/styles/shadcn.css`: Tailwind 4 e mapeamento desses tokens para o tema.
- `src/lib/utils.ts`: utilitário de classes quando necessário.

styled-components continua responsável pelas composições de página, como descrito em [Stack](stack-e-decisoes-tecnicas.md). Não manter dois temas ou dois componentes concorrentes para a mesma finalidade.

## Fluxo na implementação

1. Confirmar a raiz e a existência da configuração local.
2. Consultar a skill e o contexto da CLI com `npx shadcn@latest info --json` quando o frontend estiver preparado.
3. Conferir os arquivos já instalados antes de adicionar outro componente.
4. Consultar a documentação do componente e da base efetiva, sem presumir API Radix em Base UI.
5. Adicionar apenas o necessário e revisar fontes geradas, imports e aliases.
6. Em atualização, examinar `--dry-run` e `--diff` antes de sobrescrever alterações locais.

Esses comandos podem consultar a rede ou executar a CLI. Não foram executados na etapa documental. O uso de `@latest` para consulta da CLI não significa atualizar automaticamente dependências do aplicativo.

## Regras de composição

- Usar tokens semânticos e variants para cores, tipografia e estados; classes de composição cuidam principalmente do layout.
- Usar `cn()` para classes condicionais e `gap` para espaçamento.
- Em Base UI, conferir a API `render` para composição de triggers; não copiar `asChild` sem verificar a biblioteca.
- `Dialog`/`Sheet`/`Drawer` recebem título acessível e gestão de foco.
- Formulários com primitives seguem a composição `FieldGroup`/`Field`, labels explícitos e erros associados ao controle.
- Ícones em botões usam o contrato do primitive, incluindo `data-icon` quando aplicável.
- Preservar estrutura de grupos, títulos, fallback de avatar e estados disabled conforme a documentação do componente.

## Componentes por necessidade

Button e Separator resolvem ações e divisórias. Sheet só se o menu móvel precisar de painel. Accordion só quando houver conteúdo próprio, como FAQ. Input/Textarea/Field só se houver formulário real. Um desenho de seção editorial não exige um Card genérico.

## Validação

Após configurar Tailwind, conferir o reset global, fontes, botões e estilos de marca em todas as rotas. Após alterar primitives, verificar teclado, foco, rotulagem e estados além de lint/testes/build pertinentes.

Uma configuração declarada neste documento passa a ser implementada somente quando os arquivos e os checks correspondentes existirem.
