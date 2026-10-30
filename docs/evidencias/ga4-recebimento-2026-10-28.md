# Recebimento no GA4 — 28/10/2026

## Evidência fornecida pelo usuário

O usuário acessou a conta e enviou duas capturas da visão geral em tempo real da propriedade identificada na interface como `www.delanofurtado.adv.br`. O agente leu as capturas, sem acessar a conta ou alterar configurações.

| Indicador | Captura 2, com valores menores | Captura 1, com valores maiores |
| --- | --- | --- |
| Usuários ativos nos últimos 30 minutos | 3 | 4 |
| Usuários ativos nos últimos 5 minutos | 0 | 1 |
| `page_view` | 10 | 14 |
| `whatsapp_click` | 5 | 8 |
| `session_start` | 3 | 4 |

As tabelas de páginas mostram Home e Localização na captura 2; Home, Localização e Contato na captura 1. Os eventos recebidos são compatíveis com os eventos implementados no frontend.

As duas capturas originais foram preservadas localmente em `.private/evidencias/` na revisão de 30/10/2026. Não são distribuídas no repositório público: mostram a interface de uma conta autenticada e métricas internas. Este resumo registra somente o resultado necessário à validação, sem identificar visitantes.

## Conclusão e limites

O painel está recebendo visualizações e cliques de WhatsApp. A janela é móvel e há mais de um usuário; as diferenças de contagem não permitem atribuir todas as ações ao teste nem comprovar um evento por clique. Clique em WhatsApp representa intenção, sem comprovar mensagem enviada, atendimento ou contratação.

As capturas não exibem o ID do fluxo, o parâmetro `link_location` ou o transporte de cada ação. Permanecem pendentes a conferência controlada de duplicidade/parametrização, o bloqueio antes da aceitação e após recusa/revogação em produção, a atribuição e as conversões Google Ads. Não houve alteração de código, geração de pacote ou publicação nesta conferência.

O card de origem do primeiro usuário está sem dados. Isso, isoladamente, não comprova falha de coleta: a [documentação do relatório em tempo real](https://support.google.com/analytics/answer/9271392?hl=pt-BR) descreve limitações de processamento e atribuição. A qualidade da aquisição deve ser conferida em relatório próprio; esta evidência não a certifica.
