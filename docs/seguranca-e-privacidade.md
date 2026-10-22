# Segurança e privacidade

## Escopo

Esta guideline define cuidados de engenharia para um site institucional. O projeto inicial não tem login, pagamento, banco nem formulário servidor. Recursos novos podem alterar esse contexto e devem atualizar este documento.

## Configuração e segredos

- Dados públicos de contato ficam no conteúdo tipado.
- Valores `VITE_*` são parte do frontend público; não recebem credenciais privadas.
- Chaves de envio e tokens de provedores pertencem ao ambiente servidor quando houver integração.
- Exemplos de ambiente descrevem nomes e finalidade sem valores reais.
- Logs, capturas e documentação não devem expor credenciais.

Revisar o diff e os artefatos antes de versionar. Se um segredo for exposto, interromper seu uso, revogar/rotacionar e seguir o procedimento do provedor; apagar uma linha do código não invalida uma chave vazada.

## Conteúdo e dependências

Renderizar texto com o escaping padrão do React. Conteúdo HTML vindo de CMS ou terceiros exige validação e sanitização apropriadas antes de sua adoção; a transcrição em Markdown não precisa virar HTML arbitrário em runtime.

Verificar protocolos e destinos ao construir links dinâmicos. Bibliotecas novas exigem finalidade, origem e lockfile. Recursos externos devem ter origem conhecida; não inserir scripts de chat, mapas ou analytics como efeito colateral de uma mudança visual.

## Mensagens e dados pessoais

Mensagens de contato podem descrever situações privadas. Manter coleta mínima e explicar finalidade e destino no contexto da interface. Evitar anexos e identificadores sensíveis no primeiro contato, salvo requisito próprio que inclua o tratamento desses materiais.

O cliente deve validar formato; o servidor decide o que aceita. Não persistir rascunhos ou mensagens em localStorage, analytics ou console sem um motivo e tratamento definidos. A política de retenção e o responsável pelo atendimento precisam ser definidos antes de criar armazenamento.

Requisitos jurídicos de privacidade e publicidade profissional devem ser confirmados pelo responsável com fontes atuais quando forem tratados; esta documentação técnica não certifica conformidade legal.

## Terceiros

WhatsApp, redes e mapa abrem serviços externos. Uma incorporação tem consequências diferentes de um simples link: ela pode carregar recursos do terceiro antes de um clique. Registrar essa escolha em [Integrações](integracoes-e-formularios.md).

Analytics não é requisito inicial. Caso seja acrescentado, definir finalidade, eventos, dados coletados e tratamento de preferências antes de habilitá-lo. Conteúdo da mensagem, e-mail, telefone e descrição do caso não devem compor eventos de navegação.

## Hospedagem

Usar HTTPS e configuração compatível com os recursos efetivos. Política de conteúdo, proteção contra framing, referrer e demais headers devem ser definidos e testados na plataforma escolhida. Evitar copiar uma política que bloqueie fontes/imagens/estilos necessários ou liberar todas as origens para corrigir um erro isolado.

Links de produção e acesso a DNS/hospedagem ficam fora do bundle. Registrar o procedimento de release em [Deploy](deploy-e-operacao.md).

## Sinais para revisão especializada

Acionar o agente de segurança ao acrescentar envio por servidor, armazenamento, cookies de sessão, analytics, uploads, autenticação, scripts de terceiros ou segredos. O resultado deve apontar o fluxo real de dados, os controles necessários e a evidência verificada, sem um checklist genérico desconectado da mudança.

## Auditoria de dependências do MVP — 22/10/2026

Após atualizar correções compatíveis e remover a CLI shadcn das dependências permanentes, npm audit reportou **2 moderadas**, ambas no conjunto React Router; nenhuma alta ou crítica. O lockfile efetivo usa Router DOM 6.30.6, conforme a stack aprovada.

- [GHSA-wrjc-x8rr-h8h6](https://github.com/advisories/GHSA-wrjc-x8rr-h8h6): redirecionamento externo exige caminho fornecido por atacante em mecanismos de navegação. Neste MVP todos os destinos Link são constantes locais; dados de URL/usuário não alimentam to/useNavigate.
- [GHSA-337j-9hxr-rhxg](https://github.com/advisories/GHSA-337j-9hxr-rhxg): o aviso exclui Declarative Mode, usado aqui. Não há data router, hidratação de erros serializados ou deserializeErrors no fluxo da aplicação.

A ausência dos caminhos descritos é uma análise do código atual, não a alegação de pacote corrigido ou auditoria zerada. A correção publicada exige migração para Router 7.18+; reavaliar antes de introduzir destinos dinâmicos, Data/Framework Mode ou SSR por requisição. Não suprimir advisories no lockfile nem aplicar audit fix --force sem revisar a migração.
