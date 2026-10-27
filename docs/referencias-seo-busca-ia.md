# Referências — SEO e descoberta em buscas com IA

Pesquisa documental em **23/10/2026**, conduzida sob o perfil [SEO & Content Specialist](../agents/seo-content-specialist.md). Fontes primárias consultadas na web; nenhuma configuração, política de rastreamento ou publicação foi alterada nesta pesquisa.

Este registro sustenta o planejamento. As regras do projeto continuam em [SEO, acessibilidade e performance](seo-acessibilidade-performance.md), [Rotas e conteúdo](rotas-e-conteudo.md) e [Deploy e operação](deploy-e-operacao.md); consultar esses documentos no contexto da implementação, sem transformar esta pesquisa em uma segunda guideline.

## Contexto verificado no projeto

- Existem três rotas públicas: `/`, `/localizacao` e `/contate-nos`, além do 404. Serviços são conteúdo da Home; não há páginas individuais de serviço, blog, API ou painel administrativo no escopo atual.
- [seo.ts](../src/content/seo.ts) já define `LegalService`, metadados por rota e origem canônica `https://www.delanofurtado.adv.br`. O [prerender](../scripts/prerender.mjs) gera sitemap com essas três rotas e `robots.txt` com `User-agent: *` e `Allow: /`.
- A hospedagem publicada é Netlify, mas a migração do domínio profissional ainda depende de etapa própria registrada em [Deploy](deploy-e-operacao.md). Esta leitura de arquivos não comprova rastreamento, indexação ou citações pelos serviços abaixo.

## Busca e treinamento têm controles diferentes

| Controle | Fato da documentação primária | Implicação para o planejamento |
| --- | --- | --- |
| `OAI-SearchBot` | Descobre conteúdo para resultados de busca do ChatGPT. Seu controle é independente de `GPTBot`. | Permitir descoberta para busca pode ser uma tarefa própria, sem autorizar treinamento. A OpenAI recomenda permitir o bot e não bloquear seus IPs publicados. [OpenAI Crawlers](https://developers.openai.com/api/docs/bots) |
| `GPTBot` | Rastreia conteúdo que pode ser usado para treinamento de modelos fundacionais da OpenAI. Bloqueá-lo indica que o conteúdo não deve ser usado para essa finalidade. | Registrar a decisão do proprietário sobre treinamento separadamente. Não inferir autorização de treinamento do objetivo de melhorar visibilidade. Não aplicar silenciosamente uma política nova. [OpenAI Crawlers](https://developers.openai.com/api/docs/bots) |
| `Googlebot` | Controla o rastreamento da Busca Google, incluindo seus recursos de IA. | Preservar acesso ao HTML e aos recursos públicos necessários. [Google Search Central](https://developers.google.com/search/docs/appearance/ai-features) |
| `Google-Extended` | Token de controle para uso em treinamento futuro de Gemini e grounding em Gemini Apps/Vertex AI. Não possui user agent HTTP próprio e não afeta inclusão nem ranking na Busca Google. | Tratar treinamento e grounding desses produtos como decisão do proprietário. Não apresentar sua liberação como requisito para AI Overviews ou AI Mode. [Google common crawlers](https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers#google-extended) |
| `PerplexityBot` | Destina-se a mostrar e vincular sites nos resultados da Perplexity; a documentação distingue essa finalidade de treinamento de modelos fundacionais. | Se descoberta nesse serviço fizer parte da política escolhida, verificar regras e bloqueios da hospedagem. O nome declarado pelo user agent sozinho não comprova a identidade de uma requisição; a documentação publica IPs. [Perplexity Crawlers](https://docs.perplexity.ai/docs/resources/perplexity-crawlers) |

Permissão de rastreamento é uma condição de acesso, sem promessa de inclusão, posição, tráfego ou citação. As políticas devem ser verificadas novamente antes da implementação, pois os fornecedores podem atualizá-las.

## Recursos de IA do Google

O Google declara que as práticas usuais de SEO continuam aplicáveis a AI Overviews e AI Mode. A página precisa estar indexada e elegível a um snippet; não há requisito técnico adicional, arquivo de texto para IA obrigatório ou schema especial. Conteúdo textual acessível, links internos e dados estruturados coerentes com a página fazem parte das práticas recomendadas. Cumprir essas condições não garante rastreamento, indexação ou exibição. [Google Search Central](https://developers.google.com/search/docs/appearance/ai-features)

**Aplicação proposta:** priorizar HTML inicial correto, identidade e contatos consistentes, canonical e sitemap coerentes com o domínio de produção. O acompanhamento de recursos de IA entra no tráfego geral do tipo Web no Search Console; não prometer um relatório separado de citações por IA com esses dados. [Google Search Central](https://developers.google.com/search/docs/appearance/ai-features)

## Papel limitado de `llms.txt`

O site da proposta descreve `llms.txt` como um resumo curado em Markdown, com contexto e links para auxiliar agentes a usar um site. A proposta v2 consultada distingue essa finalidade de `robots.txt` e sitemap; um arquivo não substitui os outros. [Proposta llms.txt](https://llmstxt.org/)

**Inferência para este projeto:** com três rotas e conteúdo já pré-renderizado, um `llms.txt` curto pode ser experimento de baixa prioridade. Se aprovado no plano, deve apenas sintetizar fatos publicados e apontar para URLs reais e canônicas; não criar serviços, regras de publicidade, páginas Markdown ou endpoints inexistentes para preencher o arquivo. Não há, nas fontes consultadas, garantia de ranking ou citação pela sua presença. A orientação do Google explicitamente dispensa arquivos especiais de IA para seus recursos de busca. [Google Search Central](https://developers.google.com/search/docs/appearance/ai-features)

## Dados estruturados adequados

`LegalService` representa negócios que prestam serviços, orientação e representação jurídicos e deriva de `LocalBusiness`. É compatível com o tipo já usado no projeto. [Schema.org LegalService](https://schema.org/LegalService)

`ProfessionalService` consta como tipo geral depreciado; o próprio vocabulário menciona `LegalService` como supertipo jurídico mais inclusivo. Não trocar a marcação existente por `ProfessionalService`. [Schema.org ProfessionalService](https://schema.org/ProfessionalService)

O Google orienta usar o subtipo mais específico de `LocalBusiness`, validar a marcação e conferir o HTML publicado. Dados estruturados devem corresponder ao conteúdo visível; marcação correta não garante resultado enriquecido. [LocalBusiness](https://developers.google.com/search/docs/appearance/structured-data/local-business), [políticas gerais](https://developers.google.com/search/docs/appearance/structured-data/sd-policies)

**Aplicação proposta:** revisar o `LegalService` existente contra as fontes editoriais. Omitir campos sem comprovação, como horário, preços ou novas qualificações. Não usar a presença de avaliações visíveis como justificativa automática para adicionar estrelas ao schema: as condições do recurso precisam ser avaliadas separadamente, inclusive a restrição a avaliações sobre o próprio negócio. [Google LocalBusiness](https://developers.google.com/search/docs/appearance/structured-data/local-business)

## Handoff para o planejamento

1. Separar correções de indexação e prévias sociais de medidas experimentais de descoberta por IA.
2. Resolver a origem efetiva de produção antes de alterar canonical, sitemap, JSON-LD, URLs sociais ou `llms.txt`.
3. Documentar opções de treinamento e grounding para decisão própria, sem tratá-las como dependência de SEO.
4. Validar o artefato e a resposta HTTP das três rotas reais; nenhuma regra de API/admin é necessária para estruturas ausentes.
5. Registrar o resultado técnico e suas limitações. A pesquisa não verificou Search Console, logs de bots, indexação externa ou citações reais.
