# Decisões e pendências

Registro atualizado: **27/10/2026**. D01–D11 estão aplicadas ao MVP; D14 registra a sequência de lançamento e D16 o destino final confirmado pelo responsável. A implementação, seus checks e limitações estão em [mvp-001](evidencias/mvp-001.md) e [pacote HostGator](evidencias/ftp-hostgator-2026-10-27.md).

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
| D12 | Netlify conectado à branch `main` para publicação temporária | Publicação solicitada em 22/10/2026; caráter temporário esclarecido em 23/10/2026; [Deploy](deploy-e-operacao.md) |
| D13 | Resolver aliases estáticos com o manifest compartilhado | O CDN atende variações de caixa e `index.html`; alinhar SSR/Router/SEO para preservar a hidratação; [Rotas](rotas-e-conteudo.md) |
| D14 | Implementar GA4 somente após hospedagem definitiva, domínio final e publicação validada | Definição do responsável em 23/10/2026; evitar medir homologação como lançamento; [ordem de lançamento](deploy-e-operacao.md#ordem-de-lançamento-e-analytics) e [plan-003](../plans/plan-003-seo-previas-sociais-analytics-e-descoberta-ia.md) |
| D15 | Planejar administração de conteúdo/mídia e reordenação dos blocos existentes, conservando o design | Escopo solicitado e esclarecido pelo usuário em 23/10/2026; [plan-004](../plans/plan-004-area-administrativa-gestao-conteudo-e-secoes.md). Não equivale à adoção de fornecedor ou implementação de CMS |
| D16 | Substituir o site no mesmo domínio `www.delanofurtado.adv.br`, HostGator/cPanel via FileZilla | Confirmado pelo usuário em 27/10/2026. Pacote local gerado; raiz remota, backup, publicação e validação HTTP pendentes; [guia](publicacao-hostgator-filezilla.md) |

## Decisões futuras delimitadas

| Item | Quem conduz | Momento e tratamento até lá |
| --- | --- | --- |
| Publicação no destino confirmado | SEO + Release | HostGator/cPanel e mesmo domínio confirmados; conferir raiz, backup e regras remotas antes de enviar o pacote local. Netlify continua à homologação |
| Migração do Router para linha corrigida | Arquitetura + Segurança | Antes de ampliar destinos dinâmicos/Data Mode; [análise atual](seguranca-e-privacidade.md) registra dois apontamentos moderados |
| Áreas adicionais divergentes entre páginas/SEO | Produto + conteúdo | Antes de criar afirmações novas; manter os sete blocos principais |
| Etapas próprias de atendimento e FAQ | Produto + conteúdo | Se esses blocos entrarem no escopo; omitir na publicação enquanto ausentes |
| Depoimentos, nota e quantidade de avaliações | Conteúdo/SEO | Se houver fonte acessível correspondente; usar apenas o convite existente até lá |
| Formulário com envio e destino | Integrações + Segurança | Se o envio for solicitado; canais oficiais continuam disponíveis |
| Prazo operacional de resposta e horários | Responsável pelo produto | Antes de prometer SLA/horário novo; não deduzir da coleta |
| Publicação na hospedagem definitiva | DevOps/Release | Adaptar regras ao provedor confirmado, planejar DNS/rollback e validar o domínio final antes de implementar GA4 |
| CMS e operação da área administrativa | Arquitetura + Integrações + Segurança + Release | Proposta Sanity no plan-004; confirmar plano/custos, titularidade, papéis e publicação durável antes de implementar integrações externas |
| Privacidade, terceiros e GA4 | Produto + Segurança | Implementação do consentimento e GA4 após publicação definitiva validada; até lá, manter somente o planejamento de eventos e coleta desativada |

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
