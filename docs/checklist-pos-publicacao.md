# Checklist após a publicação — Delano Furtado

Roteiro preparado em **27/10/2026**, com base na [conferência pública](evidencias/publicacao-hostgator-2026-10-27.md). O usuário realizou o envio por FTP; este roteiro não altera a hospedagem nem as contas Google. Itens sem marca continuam pendentes de execução/comprovação.

## 1. Backup e URLs — desenvolvimento e responsável pela hospedagem

1. No cPanel, consultar Domínios e localizar a raiz do documento de `delanofurtado.adv.br`. A raiz `/` vista pela conta FTP pode corresponder a essa pasta; o nome exibido no FTP não basta para identificar o caminho físico.
2. Confirmar uma cópia do site anterior e do `.htaccess` que estava ativo antes da troca, guardada no computador. Baixar também o `.htaccess` atual antes de qualquer próximo ajuste, com nome e data distintos. Um backup feito agora protege a versão atual, sem reconstruir automaticamente a anterior.
3. Preservar `.well-known`, arquivos do provedor e recursos da galeria antiga. A limpeza depende do inventário de campanhas da etapa 4.
4. Abrir diretamente `/localizacao` e `/contate-nos` no domínio final. Na auditoria, cada uma recebeu 301 para a URL com barra final, que então respondeu 200.
5. Desenvolvimento preparou a correção no pacote `20261027T234714203Z-6c91610f`, com `DirectorySlash Off`, preservando listagem desativada e regras explícitas. O contrato prefere URLs sem barra; a [validação na conta continua pendente do envio](evidencias/urls-footer-2026-10-27.md).
6. Após o ajuste revisado, publicar o arquivo de configuração necessário com possibilidade de restauração. Repetir o teste HTTP, inclusive aliases `.html`, index, HTTPS/host e queries. O verificador também precisa aceitar `Location` absoluto quando equivalente ao destino esperado, mantendo status/destino/query sob verificação.

**Resultado esperado:** páginas corretas, URLs coerentes e ausência de loops. A falha registrada no verificador só fica resolvida depois de nova execução aprovada; não considerar a navegação visual suficiente.

## 2. Navegação e contatos — responsável pelo site e QA

1. Abrir uma janela privativa no computador e o navegador do celular. Acessar a Home, localização e contato digitando os endereços; atualizar cada página.
2. Abrir/fechar o menu, navegar entre as três páginas e usar voltar/avançar.
3. Conferir os links Áreas de atuação e Sobre: rolagem para os blocos da Home sem `#`. Logo e Início do rodapé devem levar ao topo suavemente, respeitando a preferência de movimento reduzido.
4. Expandir e recolher as áreas de atuação. Conferir legibilidade, animação e ausência de conteúdo cortado ou rolagem lateral no celular.
5. Conferir foto original na seção Conheça o advogado, logo, dados profissionais, endereço, UniFOA e textos aprovados pelo cliente. As avaliações são sete registros estáticos e não devem apresentar tempos relativos.
6. Abrir os botões de WhatsApp do hero, da seção sobre, do contato e o flutuante. Conferir o destino **+55 (24) 99922-5628** e a mensagem prevista. Abrir o destino basta para esse teste; o roteiro não exige enviar uma mensagem real.
7. Conferir telefone, e-mail `contato@delanofurtado.adv.br`, mapa, Instagram, Facebook e link de avaliação do Google. Telefone/e-mail dependem de aplicativo compatível no dispositivo; a abertura não comprova ligação ou entrega de mensagem.
8. Digitar uma URL inexistente e conferir a página de erro. Desenvolvimento verifica também o status HTTP 404.

**Resultado esperado:** conteúdo e destinos corretos nos dois dispositivos. A versão nova oferece canais de contato; não possui formulário com envio por servidor.

## 3. Localizar o GA4 existente — cliente ou gestor de tráfego

1. Abrir [Google Analytics](https://analytics.google.com/) e selecionar a conta/propriedade do Delano.
2. Em Administrador, localizar Fluxos de dados na área de coleta/modificação; abrir o fluxo Web do domínio profissional.
3. Registrar nome da propriedade, endereço do fluxo e ID de métricas **`G-…`**. Conferir se o fluxo correto já existe antes de propor uma nova propriedade.
4. Pedir ao gestor que confira os vínculos com Ads e eventuais tags conectadas da instalação anterior. O único ID encontrado no export antigo, `UA-199542592-1`, não substitui o ID GA4.
5. Informar o ID público à equipe de desenvolvimento ou conceder acesso adequado por convite, se necessário. A identificação do fluxo pode ser feita pelo cliente/gestor; não é necessário compartilhar senha.

**Atualização de 27/10/2026:** a configuração pública da tag UA antiga referencia **`G-6Z7JD1757Y`** como destino GA4. Portanto, o ID associado à instalação anterior já foi localizado sem acesso à conta. [Evidência e limites](referencias-migracao-google-analytics-ads.md#destino-encontrado-na-configuração-pública--27102026). Conferir esse destino no painel e validar ingestão/conversões continua necessário; a integração no código novo ainda não foi implementada.

**Resultado esperado:** destino GA4 existente identificado. Ver dados nesta etapa não comprova que o site novo os envia; outras origens, como a galeria antiga, podem produzir atividade.

Fonte: [Google — localizar o ID de métricas](https://support.google.com/analytics/answer/12270356?hl=pt-BR).

## 4. Inventariar Ads, GTM e destinos — gestor de tráfego

1. Abrir [Google Ads](https://ads.google.com/) e selecionar a conta que administra as campanhas do Delano.
2. Abrir a área Metas, Conversões e seu resumo; entrar nas ações já utilizadas. Registrar nome, origem, regra/gatilho, status, contagem, uso nas campanhas e se é principal ou secundária.
3. Para ação de site medida diretamente pelo Ads: abrir sua configuração de tag e a opção de uso do Google Tag Manager, quando disponível. Copiar ID/rótulo ou fornecer o snippet de evento existente para revisão. O número da conta Ads, sozinho, não identifica a ação.
4. Para ação importada do GA4: registrar propriedade de origem e nome exato do evento. Não inventar um rótulo de Ads para essa importação nem criar automaticamente uma segunda ação primária para o mesmo clique.
5. Se houver [Tag Manager](https://tagmanager.google.com/), registrar contêiner `GTM-…`, versão publicada, tags e acionadores. Escolher uma instalação coordenada para evitar duplicação entre código e contêiner. A existência de um script `gtag/js` não prova que há um contêiner GTM.
6. Conferir URLs finais dos anúncios, recursos/sitelinks e modelos/sufixos de acompanhamento. Abrir os endereços diretamente, sem clicar no anúncio para testar. Registrar URLs que dependem de `/galeria`, `.html` ou de outros destinos antigos.
7. Validar região e objetivo com a campanha real. A segmentação geográfica é configurada no Ads; o código do site não aplica a separação de regiões discutida para os dois domínios.
8. Definir com o cliente o futuro da galeria. Ela ainda serve o site antigo. Enquanto houver uso, conservar HTML, bundle e recursos necessários; uma substituição requer página equivalente ou decisão específica de aposentadoria.

**Resultado esperado:** mapa de conversões e destinos reais. O inventário é uma conferência; mudanças de metas, lances, orçamento ou segmentação continuam com o gestor.

Fontes: [Google — conversões e ID/rótulo](https://support.google.com/tagmanager/answer/6105160?hl=pt-BR), [resumo e metas](https://support.google.com/google-ads/answer/10993988?hl=pt-BR).

## 5. Implementar e validar a medição — desenvolvimento, QA e gestor

**Código preparado em 27/10/2026:** GA4 existente, consentimento e eventos estão no [novo pacote](evidencias/ga4-2026-10-27.md). O usuário confirmou a medição otimizada desativada. Os próximos passos são enviar o pacote e confirmar ingestão/diagnóstico; não é necessário reimplementar os módulos descritos abaixo.

Esta etapa depende da validação técnica da publicação e dos dados das etapas 3/4. Seguir os planos [003](../plans/plan-003-seo-previas-sociais-analytics-e-descoberta-ia.md) e [005](../plans/plan-005-migracao-google-e-publicacao-ftp.md).

1. Definir com o responsável as finalidades de Analytics/Ads e a política de consentimento/privacidade. O plano de GA4 básico mantém publicidade negada; Ads exige reconciliar essa regra antes de ativar coleta publicitária.
2. Implementar uma instalação do transporte escolhido, com consentimento, eventos por posição do botão e navegação das três páginas. Gerar e validar um novo pacote FTP e publicar esse pacote antes de esperar dados no painel.
3. Usar uma sessão nova de teste: conferir recusa, aceitação e revogação. Pelo bloqueio estrito previsto no projeto, a tag e o envio analítico permanecem bloqueados até a autorização correspondente. Conferir no painel Rede do navegador e manter os canais utilizáveis em todos os estados.
4. Após consentimento, abrir [Tag Assistant](https://tagassistant.google.com/), conectar o domínio e habilitar depuração apenas no dispositivo de teste. Conferir os destinos configurados.
5. No GA4, abrir DebugView pela área Administrador/Exibição de dados. Visitar Home, localização e contato e conferir `page_view` único por navegação real. Voltar/avançar também precisa funcionar; rolar para uma seção da mesma página não é uma nova página.
6. Clicar uma vez em cada posição de WhatsApp; conferir um `whatsapp_click` correspondente e seu `link_location`. Conferir os eventos planejados `phone_click`, `email_click` e `map_click` e seus caminhos de página.
7. Conferir os payloads: não enviar telefone, e-mail, mensagem de WhatsApp, descrição de caso, texto integral do link ou outros dados pessoais. Clique representa intenção de contato, não agendamento confirmado.
8. Conferir também os relatórios em tempo real. DebugView exige modo de depuração; bloqueio de consentimento, extensões e rede podem impedir a visualização e precisam ser considerados no teste.
9. No Ads/Tag Assistant, conferir o disparo da ação correta; no painel, acompanhar seu diagnóstico. Em importação GA4, conferir evento e vínculo em vez de exigir uma tag de evento Ads direta. O diagnóstico pode demorar a atualizar; um clique de teste sem interação com anúncio não garante conversão atribuída no relatório de campanhas.

**Resultado esperado:** consentimento efetivo, dados chegando aos destinos corretos, eventos sem duplicação e canais independentes da tag.

Fontes: [DebugView](https://support.google.com/analytics/answer/7201382?hl=pt-BR), [verificação da tag](https://developers.google.com/tag-platform/gtagjs), [conversões Web](https://support.google.com/google-ads/answer/16560108?hl=pt-BR), [modos de consentimento](https://developers.google.com/tag-platform/security/concepts/consent-mode).

## 6. Search Console — cliente ou responsável pelo SEO

Pode ser conferido em paralelo ao inventário Google, depois de resolver o padrão de URLs; não depende da instalação de GA4.

1. Abrir [Search Console](https://search.google.com/search-console/) e selecionar a propriedade do domínio ou o prefixo que abranja `https://www.delanofurtado.adv.br/`.
2. Conferir o acesso e a verificação da propriedade. A meta antiga está na Home publicada; isso não permite confirmar o estado do painel sem entrar na conta.
3. Abrir o [sitemap publicado](https://www.delanofurtado.adv.br/sitemap.xml). Conferir as três páginas; na área Sitemaps do painel, enviar/atualizar esse endereço e conferir o processamento. Preservar a propriedade existente em vez de recriá-la por causa da troca de layout.
4. Inspecionar Home, localização e contato na barra superior, uma por vez. Usar o teste em tempo real para conferir a versão ativa, o HTML e recursos carregados.
5. Conferir o resultado de indexação existente e o canonical escolhido pelo Google, quando disponível. Esse dado vem da versão indexada e não é previsto pelo teste em tempo real.
6. Solicitar indexação das URLs corrigidas/atualizadas quando necessário e acompanhar o relatório de páginas depois. Uma solicitação não garante prazo nem inclusão no índice; aparecer uma versão antiga no relatório pode refletir o último rastreamento.

**Resultado esperado:** propriedade preservada, sitemap processado e páginas acessíveis ao Google. Não há mudança de endereço de domínio para solicitar nesta publicação.

Fontes: [Sitemaps](https://support.google.com/webmasters/answer/7451001?hl=pt-BR), [inspeção de URLs](https://support.google.com/webmasters/answer/9012289?hl=pt-BR).

## Registro de conclusão

Guardar data, responsável, endereço/ação testada e resultado; anexar evidência pública ou recortada sem dados privados. Marcar cada etapa somente após conferir:

- [ ] Backup/restauração e padrão de URLs conferidos.
- [ ] Navegação e contatos no computador/celular conferidos.
- [ ] GA4 e fluxo corretos identificados.
- [ ] Ads/GTM, conversões e destinos de campanha inventariados.
- [ ] Consentimento e medição implementados, publicados e validados.
- [ ] Search Console e sitemap conferidos.

Somente os IDs e as configurações públicas necessárias precisam ser enviados à equipe; senhas, códigos de autenticação e tokens privados permanecem fora da documentação.
