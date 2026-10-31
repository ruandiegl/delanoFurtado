# Política técnica de rastreamento

Esta é a regra de engenharia da integração GA4, não uma política jurídica publicada. [Estado, controles, eventos e ativação](analytics-e-consentimento.md).

1. O destino identificado é `G-6Z7JD1757Y`; o usuário confirmou desativação da medição otimizada, e o pacote habilita o loader somente no domínio canônico após consentimento. O recebimento foi observado em 28/10; o diagnóstico controlado da conta e da nova versão continua distinto dessa evidência.
2. A coleta exige permissão expressa do visitante e domínio canônico. Homologação e desenvolvimento não enviam eventos reais.
3. A integração mede navegação geral e posição de canais de contato. Não mede o tema jurídico pesquisado/expandido, conteúdo de mensagens, dados de formulário, identificadores pessoais ou resultado do atendimento.
4. URLs dos eventos são construídas a partir do cadastro público; queries, fragments e referrers externos são omitidos. Não inserir dados de casos nos nomes/valores de eventos.
5. Ads, remarketing, Google Signals, User-ID e medição aprimorada de dados fornecidos pelo usuário não fazem parte desta instalação. Uma ampliação exige decisão e revisão do fluxo de dados.
6. A negativa e a revogação devem manter o site utilizável. Preferências podem ser reabertas no rodapé; expiração/armazenamento inválido não autorizam coleta.
7. Contas, retenção no Google, dimensões e uso dos eventos como metas precisam ser conferidos pelo proprietário/gestor. Não declarar ingestão, atribuição ou conversão real apenas por o build passar.


## Evolução do plan-006

O registro ativo é `delano:consent:v2`, finalidade `analytics-v1`, com 180 dias e publicidade indisponível. A versão antiga migra sem renovar datas ou conceder Ads. Dispensa da faixa não é uma decisão; mudanças no diálogo exigem salvar. Reduções são síncronas; falha ao gravar recusa mantém o bloqueio em memória e evita reload para registro antigo. A interface explica a falha de persistência.

As políticas estão em `/politica-de-privacidade` e `/politica-de-cookies`. A regra se aplica às páginas da aplicação React; tags observadas na galeria legada impedem afirmar cobertura de todo o domínio. [Evidências e pendências](evidencias/cookies-006.md).
