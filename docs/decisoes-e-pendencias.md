# Decisões e pendências

Registro atualizado: **22/10/2026**. D01–D11 estão aplicadas ao MVP. A implementação, seus checks e limitações estão em [mvp-001](evidencias/mvp-001.md).

## Decisões registradas

| ID | Decisão | Motivo e documento responsável |
| --- | --- | --- |
| D01 | Produto WEB institucional em pt-BR | Escopo dos pedidos e do site atual; [Visão geral](visao-geral.md) |
| D02 | React/TS/Vite/Router/styled como base | Continuidade técnica verificável com caldeiraria; [Stack](stack-e-decisoes-tecnicas.md) |
| D03 | shadcn/Base UI e Tailwind com fronteira explícita | Reaproveitar primitives sem dois temas concorrentes; [UI](shadcn-ui.md) |
| D04 | TypeScript estrito | Melhorar os contratos do novo projeto, sem atribuir essa configuração à referência; [Código](padroes-de-codigo.md) |
| D05 | Conteúdo centralizado e tipado | Uma origem para dados e sínteses; [Arquitetura](arquitetura.md) |
| D06 | Preservar as três URLs atuais | Continuidade de navegação e migração; [Rotas](rotas-e-conteudo.md) |
| D07 | Originais de mídia preservados, derivados próprios | Manter qualidade e rastreabilidade; [Design system](design-system.md) |
| D08 | Contato real por canais existentes como base | Evitar herdar uma simulação de envio; [Integrações](integracoes-e-formularios.md) |
| D09 | Movimento condicionado ao requisito e com cleanup | Referência visual estática não comprova animações; [GSAP](movimento-e-gsap.md) |
| D10 | HTML público por rota via pré-renderização de build | Tornar SEO e compartilhamento verificáveis na resposta direta; [SEO](seo-acessibilidade-performance.md) |
| D11 | Skills documentadas sem instalação implícita | Disponibilidade e invocação são fatos diferentes; [Skills](skills-e-fluxo-de-ia.md) |

## Decisões futuras delimitadas

| Item | Quem conduz | Momento e tratamento até lá |
| --- | --- | --- |
| Publicação do artefato local | Arquitetura + SEO + Release | HTML por rota e hidratação já implementados; validar regras do provedor na publicação |
| Migração do Router para linha corrigida | Arquitetura + Segurança | Antes de ampliar destinos dinâmicos/Data Mode; [análise atual](seguranca-e-privacidade.md) registra dois apontamentos moderados |
| Áreas adicionais divergentes entre páginas/SEO | Produto + conteúdo | Antes de criar afirmações novas; manter os sete blocos principais |
| Etapas próprias de atendimento e FAQ | Produto + conteúdo | Se esses blocos entrarem no escopo; omitir na publicação enquanto ausentes |
| Depoimentos, nota e quantidade de avaliações | Conteúdo/SEO | Se houver fonte acessível correspondente; usar apenas o convite existente até lá |
| Formulário com envio e destino | Integrações + Segurança | Se o envio for solicitado; canais oficiais continuam disponíveis |
| Prazo operacional de resposta e horários | Responsável pelo produto | Antes de prometer SLA/horário novo; não deduzir da coleta |
| Provedor, domínio e pipeline | DevOps/Release | Na preparação de publicação; não há configuração aplicada |
| Privacidade, terceiros e eventual analytics | Produto + Segurança | Antes de ativar nova coleta/incorporação; analytics não é requisito inicial |

Esses itens delimitam evoluções posteriores ao MVP local. Não preencher conteúdo ausente nem criar infraestrutura apenas para encerrar uma pendência que não pertence ao escopo.

## Decisões da execução

- Raiz preservada e sem Git/worktree, conforme AGENTS.md e plano. O histórico desta execução está no registro de evidências.
- npm 11 temporário contornou falha confirmada do npm 10, sem alterar ferramentas globais.
- Vite/Router/Vitest/Sharp receberam patches compatíveis. CLI shadcn foi removida após gerar os primitives.
- Manrope Latin local e bundle separado de GSAP reduzem recursos desnecessários.
- Pré-renderização usa StaticRouter/ServerStyleSheet; IDs do styled-components consistentes nos dois builds. Preview serve os documentos corretos por rota, 404 e redirects de aliases; produção precisa de regras equivalentes próprias.
- GSAP matchMedia mantém dispatcher compartilhado da biblioteca; mm.revert remove os contextos da instância. Não remover o dispatcher global para não afetar outras raízes.

## Como alterar uma decisão

Registrar data, requisito que mudou, opções relevantes, escolha e impacto. Atualizar o documento responsável, os consumidores e o aceite. Manter a auditoria e as transcrições como evidência histórica; não reescrevê-las para fazer a escolha nova parecer um fato antigo.
