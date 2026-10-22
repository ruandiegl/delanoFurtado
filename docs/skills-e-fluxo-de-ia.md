# Skills e fluxo de IA

## Skill, agente e ferramenta

**Skill** é um procedimento especializado descrito em `SKILL.md`. **Agente** é um perfil de responsabilidade em [agents/](../agents/README.md). **Ferramenta** executa uma ação, como ler arquivo ou inspecionar navegador. Uma skill não é uma dependência npm e um arquivo de agente não inicia um processo por conta própria.

## O que foi identificado em caldeiraria

A [auditoria](03-auditoria-referencia-caldeiraria.md) verificou nove skills locais na raiz mais completa. O registro comprova disponibilidade, não o histórico de invocações de cada sessão.

| Skill | Origem na referência | Quando é pertinente ao Delano |
| --- | --- | --- |
| `frontend-design` | `anthropics/skills` | Direção visual e tradução da referência em frontend próprio |
| `gsap-core` | `greensock/gsap-skills` | Tweens, easing, stagger e propriedades GSAP |
| `gsap-react` | Mesma origem GSAP | Refs, `useGSAP`, scope e cleanup React |
| `gsap-scrolltrigger` | Mesma origem GSAP | Animação dependente de viewport/scroll |
| `gsap-timeline` | Mesma origem GSAP | Sequências com fases e posições relativas |
| `gsap-performance` | Mesma origem GSAP | Diagnóstico de jank e custo de animações |
| `gsap-utils` | Mesma origem GSAP | Helpers específicos do GSAP quando necessários |
| `gsap-plugins` | Mesma origem GSAP | Avaliar plugin adicional para um requisito concreto |
| `gsap-frameworks` | Mesma origem GSAP | Integrações além de React; normalmente dispensável neste escopo |

A skill `shadcn` foi encontrada como recurso do ambiente e é mencionada pela documentação da referência; ela não faz parte das nove entradas do lockfile local. Consultá-la para inicialização/configuração, pesquisa, composição e atualização de primitives.

## Disponibilidade neste projeto

Em **22 de outubro de 2026**, por solicitação do usuário, foram instaladas no escopo global do usuário (`~/.agents/skills`) a `frontend-design`, as oito skills oficiais GSAP do catálogo acima e a [`ui-ux-pro-max`](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill), para pesquisa de padrões de interface, acessibilidade e recomendações por stack. As fontes foram obtidas diretamente dos repositórios de origem; este projeto não contém cópias locais dessas skills.

O [registro da instalação global](skills-globais.lock.json) contém os commits de origem, destinos, hashes dos arquivos `SKILL.md` e evidências de validação. Os dez manifestos foram conferidos, e as buscas locais do UI UX Pro Max para movimento GSAP e React retornaram resultados. Os onze exemplos de execução dessa skill foram ajustados do caminho de plugin Claude para o caminho global real do Codex neste Windows; os scripts e dados foram preservados.

As novas skills ficam disponíveis na próxima interação. Verificar a lista da sessão e o arquivo `SKILL.md` antes de usar uma habilidade; se a descoberta automática não ocorrer, reiniciar o Codex. Os caminhos absolutos do registro são evidência desta máquina, não dependências permanentes para outros ambientes.

Se for necessária uma instalação, usar o instalador suportado e registrar origem, escopo local/global e lock correspondente. Não copiar cegamente pastas de habilidades ou declarar uma skill disponível só porque seu nome aparece no documento.

## Outras capacidades úteis do ambiente

### Skills selecionadas para o MVP em 22/10/2026

O [plan-001](../plans/plan-001-mvp-landing-page-delano-furtado.md) usa explicitamente **UI/UX Pro Max** para direção/qualidade do frontend e **gsap-react** para integração de scroll com React. As duas skills foram disponibilizadas pelo usuário e seus arquivos foram lidos no ambiente. O catálogo local UI/UX foi consultado para design system, cleanup React e scroll reveal; as recomendações foram adaptadas à referência do Behance, sem substituir sua paleta por um template genérico.

`gsap-scrolltrigger` e `gsap-core` complementaram a execução. O frontend usa as dependências GSAP; as skills continuam globais e não foram copiadas para o projeto.

A execução autorizada foi sequencial com executing-plans, testes de comportamento antes das respectivas implementações e revisão independente final. UI/UX Pro Max orientou a composição; gsap-react orientou scope/cleanup. shadcn gerou os três primitives; Sites foi usado somente como orientação de preview local. Nenhuma publicação foi realizada. Evidências e desvios constam em [mvp-001](evidencias/mvp-001.md).

Consultar as habilidades realmente disponíveis para pesquisa de fontes, escrita para agentes, planejamento, diagnóstico, testes, revisão e verificação. No ambiente usado nesta documentação existem habilidades como `research`, `writing-for-agents`, `diagnosing-bugs`, `code-review` e a família `superpowers`; elas não são garantidas em qualquer instalação futura.

Uma tarefa de imagem pode usar `imagegen` se realmente precisar gerar/editar uma imagem; o retrato e a marca originais já estão disponíveis, portanto geração não é requisito. Skills de Sites, documentos ou vídeo só entram se o pedido envolver seus respectivos entregáveis; a mera presença no catálogo não muda a stack WEB definida.

## Fluxo de uma tarefa

1. Ler [docs/README](README.md), confirmar o estado dos arquivos e escolher o [agente](../agents/README.md).
2. Carregar a guideline correspondente à mudança; não carregar todo o catálogo por hábito.
3. Consultar skills aplicáveis e seguir suas instruções dentro da autorização do usuário e do ambiente.
4. Produzir um incremento com saída e critério de conclusão claros.
5. Executar a [validação pertinente](qualidade-e-validacao.md), revisar o resultado e manter as decisões documentadas.

Delegação e execução paralela dependem de ferramentas disponíveis, instruções do ambiente e escopo autorizado. Escolher um perfil em Markdown não autoriza criar chats, enviar mensagens, publicar ou executar ações externas.

## Transferência entre funções

O handoff informa objetivo, fatos e fontes, decisões, arquivos afetados, critério de aceite, evidências já obtidas e dúvida concreta restante. O próximo agente lê os arquivos atuais; não trata um resumo antigo como prova do estado do código.

## Manutenção

Alterar a stack atualiza seu documento técnico; alterar gatilhos de skills atualiza este catálogo; alterar papéis atualiza o índice de agentes. Preferir ponteiros para a regra responsável em vez de duplicar a mesma lista em vários perfis.
