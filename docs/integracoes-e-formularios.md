# Integrações e formulários

## Estado atual

Nenhuma integração foi implementada no novo frontend. Os links oficiais foram extraídos do site atual; o envio do formulário antigo não foi testado. A configuração daquele serviço não é transferida para este projeto por copiar seu HTML.

## Canais de contato

Os valores e destinos completos estão no [documento 02](02-conteudo-site-delano-furtado.md). Na implementação, centralizá-los em `siteData.ts`:

- WhatsApp: usar um dos destinos oficiais já encontrados, com preferência por número internacional e mensagem geral codificada corretamente.
- Telefone: gerar URI `tel:` a partir do contato confirmado.
- E-mail: usar `mailto:` para abrir o cliente de e-mail, deixando claro que isso não confirma o envio.
- Facebook e Instagram: perfis oficiais da fonte, sem substituir por páginas genéricas.
- Google: o destino coletado solicita avaliação; não equivale a um feed público de depoimentos.

O clique em um canal externo não deve produzir mensagem de sucesso de atendimento ou entrega. A mensagem inicial do WhatsApp não deve conter fatos de um caso preenchidos automaticamente.

## Mapa

O endereço e o iframe encontrados estão na transcrição. A implementação pode usar link de mapa ou incorporação, conforme a escolha de privacidade e performance. O carregamento de um iframe deve ter título, espaço reservado e alternativa por link. Não deduzir coordenadas ou fotografias do escritório a partir da imagem temática de Justiça.

## Primeira versão sem serviço de envio

Exibir os canais reais e orientar o contato. Se um formulário for mostrado apenas para demonstrar o layout, identificá-lo como demonstração e não anunciar envio. Para a versão pública inicial, preferir uma ação utilizável a um formulário cenográfico.

## Contrato de um eventual formulário real

Preservar como referência os campos publicados: Nome, Sobrenome, Seu e-mail, Assunto do e-mail e Sua mensagem. A decisão de reduzir campos é uma alteração de produto; solicitar apenas os dados necessários à finalidade do contato. Usar `type=email` no novo controle, em vez de reproduzir o tipo genérico encontrado na fonte.

Estados observáveis:

| Estado | Comportamento |
| --- | --- |
| Edição | Campos editáveis; erro associado ao respectivo controle |
| Enviando | Indicação de progresso e prevenção de envio duplicado |
| Aceito pelo serviço | Confirmação compatível com a resposta real; distinguir recebimento pelo serviço de entrega final |
| Erro/timeout | Mensagem útil, dados preservados para correção e canal alternativo |

Validar no cliente para orientar o usuário e no servidor para proteger o processamento. Definir limites de tamanho, timeout, tratamento de duplicidade, destino e controle de abuso. Não registrar o corpo da mensagem em analytics ou logs de frontend.

## Fronteira técnica

O navegador chama um endpoint de envio; o endpoint valida e encaminha para o provedor escolhido. Credenciais ficam no ambiente servidor. Para um formulário público sem autenticação, definir limites por origem/volume e estratégia de abuso adequada; CORS sozinho não é proteção contra spam.

Se o servidor usar sessão/cookies, avaliar proteção contra requisições forjadas no contrato. Não criar login ou banco apenas para enviar um contato.

Não há endpoint, provedor, segredo ou variável privada definidos nesta etapa. Antes de implementar, registrar: responsável, destino, campos, resposta, falhas, retenção, provedor e configuração. A seleção deve considerar o requisito real, não uma dependência presente em outro projeto.

## Conteúdo do retorno

A fonte antiga contém um texto de confirmação que menciona resposta em até 24 horas. Essa frase é um dado coletado, não um SLA comprovado do novo serviço. Publicar um prazo somente quando ele corresponder à operação definida.

O consentimento antigo está em inglês. Se houver tratamento adicional, a redação e a finalidade do novo controle devem ser próprias e compreensíveis em pt-BR; não tratar o texto herdado como validação jurídica da nova operação.

## Verificação

Testar destinos sem disparar mensagens reais desnecessárias. Para integração, usar ambiente e destinatário de teste autorizados, cobrindo validação, sucesso, erro, timeout e repetição. Em publicação, conferir endpoint e configuração sem expor os segredos na evidência.
