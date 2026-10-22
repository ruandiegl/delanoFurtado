# Padrões de código

## Linguagem e nomes

- TypeScript em `.ts` e `.tsx`, componentes funcionais React e módulos ES.
- Ativar `strict`, `noUnusedLocals`, `noUnusedParameters` e verificação de fallthrough na primeira configuração. Esses são requisitos novos; não inferir que já estejam habilitados aqui.
- Modelar dados externos como `unknown` e validar sua forma. Evitar `any` e assertions usadas apenas para silenciar um contrato incorreto.
- Componentes e diretórios de página em PascalCase; funções e variáveis em camelCase; hooks com prefixo `use`.
- Conteúdo da interface em pt-BR, com acentuação preservada. Identificadores de código em inglês, mantendo os nomes explícitos previstos na arquitetura.
- Props de estilo de styled-components usam prefixo `$`, para não vazar atributos decorativos para o HTML.

## Composição

Uma página compõe seções; uma seção apresenta um assunto; primitives concentram comportamento reutilizado. Extrair componentes quando houver repetição real, contrato próprio ou complexidade que prejudique a leitura.

Conteúdo institucional vem de `src/content/`, conforme [Arquitetura](arquitetura.md). Manter IDs e slugs estáveis e usar esses IDs como keys de listas. Textos de contato não devem reaparecer como literais em vários componentes.

## Imports e dependências

Agrupar imports externos, internos e estilos; usar `import type` para tipos. O alias `@/` deve ser configurado tanto no TypeScript quanto no Vite antes de ser usado.

A fonte das dependências instaladas é o manifest local. Preferir recursos da plataforma e pacotes já presentes. Uma inclusão precisa demonstrar o requisito atendido e seu custo, como definido na [stack](stack-e-decisoes-tecnicas.md).

React Router 6 fornece seus próprios tipos: não copiar o pacote `@types/react-router-dom` v5 da referência para resolver tipos da versão 6.

## Navegação e interação

- Rotas internas usam `Link`/`NavLink`; âncoras de seção usam destinos reais e IDs únicos.
- Destinos externos usam `<a>` com nome compreensível e `rel` apropriado quando abrirem nova aba.
- Ações locais usam `<button>`, com `type` explícito dentro de formulários.
- Navegação de teclado, foco e rótulos fazem parte do contrato do componente.
- Datas, valores e textos sensíveis ao contexto são dados explícitos; não produzir métricas comerciais aleatórias.

## Estado, efeitos e rede

Estado fica no componente ou no ancestral comum que o utiliza. Calcular valores derivados durante renderização quando possível; reservar efeitos para sincronização com recursos externos.

Listeners, timers, observers, requisições canceláveis e efeitos GSAP têm cleanup local. Conferir montagem/desmontagem e `StrictMode`. O estado de um formulário não deve avançar a sucesso sem confirmação do serviço.

## Estilos

Usar tokens semânticos de [Design system](design-system.md). Estilos de marca ficam em composições styled-components; primitives shadcn seguem sua própria guideline. Cores e tipografia de um primitive são alteradas via tokens/variants, preservando uma única implementação.

Regras globais ficam no ponto de entrada de estilos, não em cada página. Seletores devem respeitar a fronteira do componente. Breakpoints seguem os valores do design system; uma exceção precisa de motivo visual verificável.

## Erros e comentários

Erros de rede geram feedback útil e não expõem payloads, stack traces ou dados pessoais. Conteúdo opcional ausente é omitido de forma intencional. Parâmetros desconhecidos recebem o comportamento de rota documentado.

Comentários explicam restrições e decisões pouco óbvias. Regras compartilhadas permanecem em `docs/`; não manter cópias resumidas em cada componente.

## Conclusão

Alterações de código seguem [Qualidade e validação](qualidade-e-validacao.md). Se uma convenção mudar, atualizar seu documento responsável na mesma entrega.
