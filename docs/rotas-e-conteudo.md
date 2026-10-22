# Rotas e conteúdo

## Fonte editorial

O [documento 02](02-conteudo-site-delano-furtado.md) preserva os textos publicados em 22/10/2026. Ele é a origem dos fatos profissionais. O Behance oferece somente referência de frontend; não fornece dados, formação ou avaliações para o Delano.

Ao transformar a transcrição em conteúdo runtime, manter uma única definição para cada dado em `src/content/`, conforme [Arquitetura](arquitetura.md). Sínteses podem apontar para a origem em vez de copiar grandes blocos para várias páginas.

## Rotas iniciais

| URL | Responsabilidade | Estado |
| --- | --- | --- |
| `/` | Landing page institucional e canais oficiais | Implementada e pré-renderizada |
| `/localizacao` | Endereço, abrangência e acesso ao mapa | Implementada e pré-renderizada |
| `/contate-nos` | WhatsApp, telefone, e-mail e redes | Implementada e pré-renderizada; sem formulário |
| Outras URLs | Tela de não encontrado e retorno | 404.html gerado; status em produção depende do provedor |

Âncoras implementadas na Home: `#areas`, `#sobre`, `#atendimento` e `#contato`. Correspondem às seções renderizadas e não substituem as rotas existentes. Os sete serviços preservam seus itens completos no HTML, com details/summary nativo; isso não é um FAQ.

Política de URL: os caminhos canônicos usam minúsculas. O manifest também reconhece variações de caixa, barra final e `index.html` das três páginas existentes, acompanhando a entrega de arquivos estáticos do Netlify. Router, HTML e SEO usam a mesma resolução; caminhos realmente desconhecidos continuam em 404. O preview redireciona aliases de documento para os caminhos canônicos; no Netlify, aliases com caixa diferente podem ser atendidos como 200, preservando o conteúdo e o canonical corretos. Navegação nova vai ao topo/foca o h1; histórico restaura a posição por entrada; selecionar a mesma âncora novamente repete a rolagem. Consulte o contrato em [Deploy](deploy-e-operacao.md).

Páginas individuais de serviços, blog, política de privacidade ou agendamento são evoluções. Uma rota nova só entra na navegação e no sitemap quando existir. Se uma URL antiga mudar, registrar redirecionamento 301 específico na hospedagem, sem transformar todas as URLs em redirecionamentos para a Home.

## Adaptação das seções da referência

| Bloco visual | Conteúdo disponível do Delano | Regra |
| --- | --- | --- |
| Hero | Nome, atuação, regiões e canais oficiais | Síntese sem promessas novas |
| Credenciais | Graduação e duas pós-graduações publicadas | Não converter em mestrado, docência ou títulos de outra pessoa |
| Serviços | Sete blocos publicados | Preservar todos; organizar sínteses e leitura detalhada |
| Processo | Sem sete etapas confirmadas | Omitir na versão publicada até existir conteúdo próprio |
| Avaliações | Avaliações reais coletadas da ficha oficial do Google Maps (`0x9e99fc2d9fe615:0x119797af8c4f7077`) em 22/10/2026 e links de avaliação/consulta | Exibir apenas depoimentos reais coletados da fonte oficial, sem inventar avaliações |
| Perfil | Texto Sobre e um retrato original | Reusar recortes da mesma foto quando adequado, sem fingir novos retratos |
| Abrangência | Cidades do RJ e atendimento online nacional | Ponto de referência do Delano, não Campinas |
| Diferenciais | Formação e atributos já descritos no site | Descrições vinculadas à fonte |
| FAQ | Sem perguntas e respostas próprias coletadas | Rascunhos editoriais separados da publicação |
| Contato | Telefone, e-mail, endereço, redes e WhatsApp | Destinos centralizados e verificados |

## Catálogo e slugs

Os IDs de partida para os sete blocos são `familia`, `consumidor`, `imobiliario`, `contratual`, `sucessoes`, `civil` e `assessoria-mensal`. São identificadores internos propostos, não páginas de serviço já existentes.

Registrar título, síntese e lista de itens com tipagem explícita. Preservar os serviços detalhados da transcrição; a Home pode usar sínteses com acesso ao restante do conteúdo, em vez de eliminar informações silenciosamente.

## Estados editoriais

- `confirmed`: dado encontrado na fonte identificada ou informado diretamente pelo responsável do projeto.
- `draft`: redação ou proposta de organização ainda em edição; não apresentar como fato novo.
- `unavailable`: material ou comprovação ausente; omitir o bloco ou oferecer um canal real que independa dessa informação.

Esses estados organizam o trabalho; não substituem a autorização já dada para usar o conteúdo extraído. Alterações em número, formação, serviço ou alegação precisam de uma fonte correspondente.

## Divergências preservadas

Localização e SEO mencionam Trabalhista/Previdenciário; os blocos principais não os detalham. O SEO de contato menciona Bancário. Usar os sete blocos da página principal como catálogo inicial e manter essas áreas adicionais fora de novas afirmações até que seu escopo seja esclarecido. Não apagar essa divergência da transcrição histórica.

O texto de Sucessões menciona exterior; o texto geral menciona Brasil. A extensão internacional fica restrita ao contexto informado.

## Datas e manutenção

Se uma nova coleta alterar dados, registrar data, página e mudança. O documento 02 continua sendo o registro da coleta indicada no seu cabeçalho. Horário de funcionamento, número de casos, anos de experiência, taxas e estatísticas não foram coletados e não devem ser preenchidos por dedução.
