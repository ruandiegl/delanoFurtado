# GA4 e preferências de análise

Atualização: **28/10/2026**. Destino identificado na configuração pública da tag antiga: **`G-6Z7JD1757Y`**. [Evidência](evidencias/tag-google-conectada-2026-10-27.json).

## Estado real

Em **28/10/2026**, o usuário forneceu duas capturas da propriedade do site em tempo real, com recebimento de `page_view` e `whatsapp_click`. O recebimento desses eventos está observado no painel; instalação única, parâmetros, consentimento em produção e conversões Ads ainda exigem conferências próprias. [Capturas, contagens e limites](evidencias/ga4-recebimento-2026-10-28.md).

A integração cliente, consentimento, navegação e eventos dos botões foram implementados. **O pacote está habilitado para coletar somente no domínio canônico, após consentimento**, por `streamConfigured: true` em `src/analytics/config.ts`. Depois de informar inicialmente falta de acesso, o usuário confirmou que desativou a medição otimizada do fluxo. Não houve instalação de Ads/GTM, alteração da propriedade ou publicação por FTP pelo agente.

A configuração pública do fluxo consultada tinha detecção automática de histórico, cliques de saída, formulários e outros eventos ligada. O código manual exige essa opção desligada para evitar duplicação e captura automática de URLs. O usuário confirmou o ajuste; a leitura pública imediatamente posterior ainda mostrou opções globais de detecção na tag, cujo efeito no fluxo deve ser conferido no diagnóstico após publicação. A tag-base antiga não foi copiada para o HTML. O pacote já inclui a implementação preparada e preserva a verificação Search Console.

O aviso inicial de consentimento aparece na primeira visita sem preferência válida. O botão **Preferências de cookies**, no rodapé, já abre os controles. Aceitar ou recusar pode registrar a preferência, mas não contorna os bloqueios de ambiente/configuração.

## Publicar e confirmar o recebimento

1. Enviar o conteúdo do pacote FTP desta execução, incluindo assets, HTMLs e o `.htaccess`. O domínio final e a raiz do site continuam os mesmos.
2. Em sessão nova, visitar o domínio e conferir ausência de script Google antes de aceitar e após recusar. Após aceitar, conferir uma instalação, `page_view` e cliques em Tag Assistant/DebugView. Conferir revogação e sincronização em outra aba.
3. Na propriedade do Delano, confirmar o fluxo Web **`G-6Z7JD1757Y`** e a medição otimizada desativada, conforme informado pelo usuário. Conferir também a detecção automática nas configurações da tag e manter desativada a coleta de dados fornecidos pelo usuário; a integração mantém consentimentos publicitários negados.
4. O recebimento de visualizações e cliques foi observado nas capturas do usuário em 28/10/2026. Complementar com teste controlado em Tag Assistant/DebugView para confirmar uma instalação, um evento por ação e parâmetros corretos. As capturas agregadas não comprovam ausência de duplicação nem atribuição de campanhas.
5. O ID e `streamConfigured` ficam em `src/analytics/config.ts`. Para suspender a integração, mudar a flag para `false`, gerar e enviar novo pacote. Não editar bundles minificados no servidor.

## Eventos e dados

| Evento | Origem |
| --- | --- |
| `page_view` | Entrada após concessão e mudança entre páginas públicas; aliases, query/hash e rolagem de seção não criam outra página |
| `whatsapp_click` | Header/menu, Hero, Sobre, contato da Home, página de contato/localização e botão flutuante |
| `phone_click`, `email_click` | Canais de contato na Home e página de contato |
| `map_click` | Link de Google Maps em localização |
| `review_click` | Botão de avaliação Google |

Os parâmetros próprios são página canônica, título do cadastro SEO e `link_location` de enum fechado. A origem é fixa e autorizada; query, hash, referrer externo, href de WhatsApp, telefone, e-mail e texto de caso não entram nos eventos criados pelo site. Abertura de uma área jurídica não é medida individualmente. Não há `generate_lead`: clique é intenção, não atendimento confirmado.

`link_location` identifica `header`, `hero`, `about`, `contact_section`, `contact_page`, `location_page`, `floating` e `reviews`, conforme os links existentes. Dimensões personalizadas para consulta desses parâmetros no GA4 dependem da configuração da conta.

## Consentimento e bloqueios

- Estado desconhecido/rejeitado não carrega a tag. Não há preconnect/preload analítico antes de concessão.
- `streamConfigured`, ID válido e origem exata `https://www.delanofurtado.adv.br` são obrigatórios. Localhost e Netlify ficam sem coleta real.
- Preferência versionada em `delano:consent:v2`, sem identificador individual; validade de 180 dias. Esse prazo é uma decisão técnica de produto, não uma certificação jurídica. Se o armazenamento não estiver disponível, não inferir permissão em uma nova visita.
- Mudanças em outra aba, foco, visibilidade e expiração são conferidas. Aceitar não reproduz cliques anteriores.
- Revogar bloqueia imediatamente o transporte, limpa a fila/cookies GA acessíveis no domínio controlado e recarrega se o SDK foi iniciado. Requisições anteriores não podem ser desfeitas e cookies de terceiros inacessíveis não são apagados por esse código.
- `send_page_view: false` e page views manuais evitam a duplicação **quando a medição automática da conta também está desligada**. Google Signals, personalização publicitária e consentimentos Ads ficam desativados.
- SDK bloqueado ou indisponível não impede contato/navegação. Não há chave privada de API nem backend de medição.

## Limites e referências

A preferência e os cookies próprios de análise usam até 180 dias; a retenção dos dados no servidor Google precisa ser conferida pelo responsável no painel. Os controles explicam esta integração e não substituem a política completa do escritório, que exige revisão editorial própria.

Fontes consultadas diretamente e via Context7: [page views e histórico](https://developers.google.com/analytics/devguides/collection/ga4/views), [medição otimizada](https://support.google.com/analytics/answer/9216061?hl=pt-BR), [consentimento básico](https://developers.google.com/tag-platform/security/guides/consent?consentmode=basic), [DebugView](https://support.google.com/analytics/answer/7201382?hl=pt-BR).


## Interface e migração v2 — plan-006

Implementadas localmente em 30/10/2026 a faixa compacta, as três ações equivalentes e o diálogo com rascunho. Fechar, navegar e editar sem salvar não concedem nem renovam a autorização. O registro v2 inclui versão da finalidade e escolhas de análise/publicidade; v1 válido migra com as datas originais e publicidade negada. Só Análise está disponível. Ads, Google Signals, User-ID, personalização e remarketing continuam desativados.

A store aplica reduções sincronamente. Se uma negativa não puder ser gravada, tenta remover registros antigos e mantém a recusa em memória, sem reload automático que possa restaurar um aceite antigo. O diálogo informa quando a escolha não pôde ser salva. Uma nova visita não consegue recuperar uma decisão apenas em memória; quando todo armazenamento/remoção estiver bloqueado, o visitante precisa excluir os dados antigos pelo navegador.

Foram preservados ID, page views manuais e eventos. `ads_data_redaction: true` e `url_passthrough: false` reforçam a configuração sem ativar Ads. As páginas públicas de privacidade/cookies explicam o inventário; a galeria antiga não está sob este controle. [Execução, testes, pacote e limites](evidencias/cookies-006.md). Nova validação de rede/SDK real exige o envio do pacote ao domínio autorizado; localhost e Netlify continuam sem coleta real.
