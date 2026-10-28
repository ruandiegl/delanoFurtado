# Referências — migração de Analytics e Google Ads

Pesquisa em **27/10/2026**, com documentação oficial do Google. Escopo: substituir o frontend do mesmo negócio, preservando as contas e a medição que existirem. Nenhuma tag, conta ou campanha foi alterada por esta pesquisa.

## O que a cópia antiga demonstra

A busca local em `C:/Users/Rv22/Desktop/delanoAntigo` encontrou `UA-199542592-1` em `index.html`, `localizacao.html`, `contate-nos.html` e `galeria.html`. Não encontrou IDs com os prefixos `G-`, `AW-`, `GT-` ou `GTM-` nos arquivos pesquisados. É uma observação sobre a cópia baixada, não uma auditoria dos painéis ou dos scripts remotos executados no navegador.

**Não concluir que não existe GA4 ou que a medição atual está parada.** O Universal Analytics padrão encerrou novos dados em 2023 e o desligamento geral ocorreu em 2024. Entretanto, o Google documenta que configurações antigas de *connected site tags* podem continuar encaminhando dados de uma tag UA a uma propriedade GA4 existente, com as configurações preservadas em 2024. Primeiro identificar o destino nas contas; depois instalar diretamente a tag moderna correspondente. Não reinstalar o UA como solução definitiva. [Encerramento do UA e tags conectadas](https://support.google.com/analytics/answer/11583528?hl=en).

Dados históricos do UA não são importáveis no GA4. Reaproveitar o site antigo ou seu ID não restaura esse histórico; eventuais exportações anteriores são um acervo separado. [Perguntas sobre a migração](https://support.google.com/analytics/answer/14196937?hl=en).

### Destino encontrado na configuração pública — 27/10/2026

Após o usuário esclarecer que a instalação antiga funcionava, foi lido como texto o JavaScript público servido para `UA-199542592-1`. Sua configuração contém um contêiner filho com ID **`G-6Z7JD1757Y`**; a solicitação direta da tag desse ID também retornou 200. [URLs, trechos de referência e hashes consultados](evidencias/tag-google-conectada-2026-10-27.json).

Isso identifica um destino GA4 associado à tag antiga e explica como a instalação com prefixo UA pode manter um caminho de envio ao GA4. A troca de frontend não impede reaproveitar esse destino. O ID não havia aparecido no export local porque está na configuração remota carregada pela tag. A leitura não executou o JavaScript nem enviou eventos; propriedade/fluxo na conta, recebimento real, consentimento e ações Ads ainda precisam ser conferidos. A ausência de IDs Ads nos dois scripts consultados não exclui importação de eventos GA4 ou outra configuração na conta. Nenhuma tag foi instalada no novo site por esta investigação.

## Identificadores que precisam ser conferidos

**ID Ads informado pelo usuário:** `AW-622649331`, visto na captura de “Detalhes da tag” e “Destinos” enviada em 27/10/2026 (`codex-clipboard-0f1b2b64-dfa7-44cc-8fc6-839812c3c4b2.png`). A tela identifica Google Ads. O usuário chamou o material de “metra ads”; não foi fornecido um identificador de Pixel da Meta. A captura não mostra ação/rótulo de conversão nem comprova se WhatsApp é medido diretamente pelo Ads ou importado do GA4. Registrar o ID não instala a tag: consentimentos publicitários e o código atual continuam sem alteração.

| Identificador | Significado | Aplicação na migração |
| --- | --- | --- |
| `UA-…` | Identificador legado de Universal Analytics | Evidência histórica; investigar eventual GA4 conectado |
| `G-…` | ID de medição/destino de um fluxo web GA4; também pode identificar a Google tag | Obter no fluxo existente e reutilizar se for o destino correto |
| `GT-…` | Identificador unificado da Google tag | Conferir os destinos associados na conta |
| `AW-…` | Identificador Google Ads, também utilizável como Google tag | Conferir a conta/destino e sua configuração |
| `AW-…/LABEL` | Destino e rótulo de uma ação de conversão Ads no snippet de evento | Preservar o par correspondente à ação real |
| `GTM-…` | Contêiner do Google Tag Manager | Reutilizar somente após examinar tags, gatilhos e versão publicada |

Uma mesma Google tag pode ter mais de um ID; esses prefixos não significam campanhas diferentes. O rótulo de conversão não pode ser inventado a partir do ID da conta. [IDs da Google tag](https://developers.google.com/tag-platform/gtagjs/configure), [ID de medição GA4](https://support.google.com/analytics/answer/12270356?hl=en), [conversões Ads e seus rótulos](https://support.google.com/google-ads/answer/7548399?hl=en-GB), [contêineres](https://support.google.com/tagmanager/answer/17070049?hl=en).

Se já houver propriedade e fluxo GA4 corretos, a troca do frontend não exige criar outra propriedade. Essa é a recomendação de continuidade para este projeto, derivada da possibilidade de instalar o mesmo ID no site e editar nome/URL do fluxo existente. Acessos às contas precisam ser verificados; IDs no HTML não concedem acesso administrativo. [Instalação e ID correto](https://support.google.com/analytics/answer/9311124?hl=en), [editar fluxo](https://support.google.com/analytics/answer/9304776?hl=en).

## Campanhas, destinos e conversões

Campanhas e seus ajustes permanecem no Google Ads; o FTP transporta os arquivos do site. Cada anúncio tem uma URL final e pode ter modelo de acompanhamento e sufixo próprios. Ao manter os endereços funcionando, não é necessário recriar campanhas por causa da troca de frontend. Inventariar anúncios e recursos que apontem a páginas removidas, inclusive `/galeria`, antes de substituir o site. Mudança de domínio exige revisar as URLs e a correspondência entre domínio de destino e de exibição. [URL final e rastreamento](https://support.google.com/google-ads/answer/6080568?hl=en), [página de destino](https://support.google.com/google-ads/answer/14086?hl=en).

Na conta, identificar cada ação: nome, origem, evento/URL, ID e rótulo quando houver, contagem, valor e uso nas metas. Reinstalar a medição da ação existente quando ela ainda representar o mesmo resultado. Regras por seletor/texto de botão ou página antiga podem precisar ser adaptadas. Instalar somente a tag-base não comprova que os cliques ou conversões foram migrados. [Verificação de tags e rótulos](https://support.google.com/google-ads/answer/9148089?hl=en).

Escolher um fluxo de conversão por resultado: Google Ads direto ou evento GA4 compartilhado/importado, conforme o que já existir. Se ambos forem mantidos para comparação, revisar metas e ações primárias/secundárias para não otimizar o mesmo resultado duas vezes. Ações secundárias normalmente não entram nos lances; a exceção documentada são metas personalizadas que as incluam. [Conversões a partir do GA4](https://support.google.com/google-ads/answer/2375435?hl=en), [ações primárias e secundárias](https://support.google.com/google-ads/answer/11461796?hl=en).

Um clique em WhatsApp pode ser medido como conversão de clique, mas comprova apenas intenção de contato. Não equivale a mensagem enviada, agendamento confirmado ou cliente contratado. Esses resultados exigem outra evidência/integração. [Conversões por clique](https://support.google.com/google-ads/answer/6331304?hl=en), [página de confirmação após resultado efetivo](https://support.google.com/google-ads/answer/61132?hl=en).

## React, parâmetros e consentimento

O novo site usa navegação React. Escolher uma única estratégia para `page_view`: automática por histórico ou manual. Se a estratégia for manual, desativar tanto a visualização do `config` quanto a medição aprimorada por mudanças de histórico; só `send_page_view: false` não desativa esta última. Testar entrada direta, navegação e voltar/avançar no DebugView. [SPAs](https://developers.google.com/analytics/devguides/collection/ga4/single-page-applications), [controle de pageviews](https://developers.google.com/analytics/devguides/collection/ga4/views).

Preservar parâmetros de campanha nas URLs de entrada e nos redirecionamentos: `gclid`, e, quando presentes, `gbraid`, `wbraid` e UTMs. A documentação alerta que retirar identificadores em redirects pode romper a associação entre clique e conversão. Testar com valores sintéticos e sem clicar nos anúncios reais. [Redirects e GCLID](https://support.google.com/google-ads/answer/15629968?hl=en), [auto-tagging](https://support.google.com/google-ads/answer/3095550?hl=en), [diagnóstico de atribuição e parâmetros braid](https://support.google.com/google-ads/answer/14452452?hl=en-GB).

**Compatibilidade pendente com o plan-003:** sua proposta remove queries dos payloads e deixa Ads desativado. Preservar a query no servidor não autoriza enviá-la inteira ao Google. Antes de implementar Ads, definir uma política explícita para os identificadores permitidos, UTMs, tratamento de consentimento e URLs sanitizadas; bloquear parâmetros arbitrários e dados de casos, telefone/e-mail e mensagens. Não anunciar atribuição de campanhas garantida sob o desenho anterior sem testar esse contrato.

Consent Mode básico bloqueia as tags até a escolha autorizadora; o modo avançado pode enviar medições sem cookies mesmo com estados negados. Portanto, adicionar somente `denied` não cumpre uma política de zero requisições antes da autorização. Manter a decisão do projeto e avaliar separadamente análise, armazenamento publicitário, dados para publicidade e personalização; este documento não certifica conformidade jurídica. [Modos básico e avançado](https://developers.google.com/tag-platform/security/concepts/consent-mode), [integração](https://developers.google.com/tag-platform/security/guides/consent).

## Acessos e validação antes da troca

1. Identificar a propriedade/fluxo GA4, eventuais destinos conectados à tag antiga, conta Ads e contêiner GTM, caso existam.
2. Inventariar URLs finais, modelos, sufixos e ações de conversão usadas nas campanhas.
3. Confirmar vínculo GA4–Ads; criá-lo somente se necessário e autorizado. O Google exige papel administrativo/editor no Analytics e administrativo no Ads para criar o vínculo. [Vínculos e permissões](https://support.google.com/analytics/answer/9379420?hl=en).
4. Definir consentimento e estratégia de eventos; preparar o build sem ativar coleta nos previews.
5. No destino final, conferir consentimento, Tag Assistant, DebugView/Realtime, cliques únicos e diagnóstico das conversões, sem mensagens ou leads reais de teste desnecessários.
6. Registrar a troca de versão e conservar o artefato anterior para recuperação; não recriar propriedades/campanhas para contornar falta de acesso.

O `robots.txt` da cópia antiga possui bloqueio global. Isso merece investigação para busca orgânica, mas **não prova bloqueio do AdsBot**: o Google documenta que `AdsBot-Google` e sua variante móvel ignoram o grupo global `User-agent: *`. Confirmar o arquivo realmente servido e as regras específicas; não copiar o arquivo antigo para a produção nova. [Rastreadores especiais do Google](https://developers.google.com/crawling/docs/crawlers-fetchers/google-special-case-crawlers).

## Limites desta entrega

Pesquisa e leitura local. Sem login em Google Ads/Analytics/GTM, sem comprovação de configuração ativa ou histórico, sem alteração de tags, consentimento, domínio, DNS ou FTP. O procedimento de build/servidor pertence ao diagnóstico de publicação do projeto.
