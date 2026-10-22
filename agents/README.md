# Agentes de IA — Delano Furtado

Perfis especializados para o desenvolvimento do site WEB, baseados em [docs/README.md](../docs/README.md). São instruções reutilizáveis em Markdown: a presença destes arquivos não instala skills, registra agentes em uma plataforma ou inicia execuções.

## Escolha por tarefa

| Agente | Quando usar | Entrega principal |
| --- | --- | --- |
| [Product Manager](product-manager.md) | Escopo, prioridades, requisitos ou critérios de aceite precisam ser definidos | Incremento e aceite verificáveis |
| [UX/UI Designer](ux-ui-designer.md) | Layout, hierarquia, design system, fotografia ou responsividade | Especificação visual e estados de interação |
| [Software Architect](software-architect.md) | Decisão atravessa stack, rotas, conteúdo, estilos, integração ou estrutura | Limites, contratos e decisão técnica |
| [Frontend Engineer](frontend-engineer.md) | Implementar ou corrigir páginas, seções, componentes e navegação | Frontend tipado e validado |
| [Motion Engineer](motion-engineer.md) | Movimento coordenado, GSAP, ScrollTrigger ou regressão de animação | Efeito com fallback, scope e cleanup |
| [Backend & Integrations Engineer](backend-integrations-engineer.md) | O pedido envolve envio real, API, CMS ou serviço externo | Contrato e integração observável |
| [QA Engineer](qa-engineer.md) | Validar critérios, regressões, rotas, contatos ou estados | Evidências e defeitos reproduzíveis |
| [Accessibility & Performance Engineer](accessibility-performance-engineer.md) | Teclado, foco, leitura assistiva, imagens, carregamento ou movimento | Diagnóstico e correções mensuráveis |
| [SEO & Content Specialist](seo-content-specialist.md) | Conteúdo factual, metadados, URLs, HTML indexável ou migração | Conteúdo rastreável e SEO verificável |
| [Security Engineer](security-engineer.md) | Dados pessoais, segredos, terceiros, uploads ou integração servidor | Revisão do fluxo real de dados e controles |
| [DevOps & Release Engineer](devops-release-engineer.md) | Ambiente de build, CI, hospedagem, domínio, release ou rollback | Artefato e operação reproduzíveis |
| [Code Reviewer](code-reviewer.md) | Há mudança pronta para revisão independente | Achados acionáveis e lacunas de validação |
| [Technical Writer](technical-writer.md) | Decisões, setup, padrões, agentes ou operação precisam ser documentados | Documentação precisa e navegável |

## Contexto comum

O MVP está implementado em React/TypeScript/Vite/Router/styled, com shadcn/Base UI/Tailwind e GSAP React/ScrollTrigger. Existem scripts, testes e HTML por rota; veja [as evidências](../docs/evidencias/mvp-001.md). Git está vinculado ao remoto e o Netlify publica a branch `main` automaticamente; conferir o [estado do release](../docs/evidencias/release-003.md). Backend permanece fora do escopo. Confirmar sempre o estado real dos arquivos antes de agir.

A referência visual é o Behance; os fatos profissionais e imagens são do Delano. A auditoria de caldeiraria registra as práticas técnicas, não conteúdo a ser publicado neste site.

## Protocolo compartilhado

1. Ler o [índice de documentação](../docs/README.md), este índice e o perfil da função escolhida.
2. Confirmar demanda, raiz de trabalho, estado do código e arquivos já alterados.
3. Carregar as guidelines pertinentes ao domínio e as skills realmente disponíveis, conforme [Skills e fluxo de IA](../docs/skills-e-fluxo-de-ia.md).
4. Trabalhar no escopo autorizado, preservando fontes, conteúdo factual e alterações de outras pessoas.
5. Aplicar a [validação correspondente à mudança](../docs/qualidade-e-validacao.md); não executar ou declarar scripts inexistentes.
6. Atualizar o documento responsável quando uma decisão mudar e transferir o contexto necessário à próxima função.

As instruções do usuário e do ambiente prevalecem. Perfis não concedem autorização para ações externas, envio de mensagens, criação de chats, instalação ou publicação. Usar ferramentas e delegação somente conforme o escopo e as instruções disponíveis.

## Fluxo por domínio

Uma demanda ambígua começa em Produto. Uma mudança visual passa por UX/UI e Frontend; Arquitetura entra se houver uma fronteira nova. Movimento e Integrações participam somente quando esses requisitos existem. QA e especialistas validam o risco da mudança; Revisão confere o resultado. Release cuida de publicação autorizada. Documentação acompanha as decisões, sem esperar o fim para registrar mudanças estruturais.

Não é obrigatório acionar todos os perfis nem abrir uma conversa por papel. O agente em execução pode assumir a função pertinente, explicitando suas entregas.

## Formato comum de entrega

- **Resultado:** decisão, alteração ou achado ligado ao objetivo.
- **Arquivos e fontes:** o que foi consultado e modificado.
- **Evidências:** checks e inspeções realizados, com resultado.
- **Limites:** o que permanece ausente, condicionado ou não verificado.
- **Handoff:** próximo responsável e contexto concreto, quando houver outra etapa.

## Manutenção dos perfis

Cada perfil tem uma responsabilidade principal. Regras técnicas continuam em `docs/`; os perfis usam links em vez de duplicá-las. Um novo papel deve ganhar gatilho e entrega no índice. Esses arquivos são portáveis; caminhos locais da auditoria são evidências históricas, não pré-requisitos para executar os agentes em outra máquina.
