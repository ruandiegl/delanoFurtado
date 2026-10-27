# Design system e mídia

## Origem e alcance

A [referência visual](01-referencia-design-advocacia.md) orienta composição, ritmo, cartões, retratos, selos e áreas claras. A [marca real](02-conteudo-site-delano-furtado.md) fornece logo, monograma e foto do Delano. Os valores abaixo estão implementados no MVP; são decisões de adaptação, não medidas extraídas do CSS do Behance. Veja [as capturas](evidencias/mvp-001.md).

O logo preto/dourado deve manter sua integridade. Não substituir as letras por texto digitado, recolorir o arquivo ou transformar o retrato de outra pessoa em foto do Delano.

## Tokens iniciais

Valores vivem uma única vez em `src/styles/tokens.css`. styled-components usa essas variáveis; `shadcn.css` mapeia os mesmos valores para os tokens de UI.

| Token semântico | Valor de partida | Uso |
| --- | --- | --- |
| `--background` | `#FFFFFF` | Fundo principal |
| `--foreground` | `#263A31` | Texto principal |
| `--primary` | `#20382F` | CTA e superfícies escuras |
| `--primary-foreground` | `#FFFFFF` | Conteúdo sobre o verde |
| `--secondary` | `#F0EFEB` | Seções alternadas |
| `--muted-foreground` | `#5C655F` | Texto secundário sujeito a teste de contraste |
| `--border` | `#D5D6D1` | Contornos suaves |
| `--brand-gold` | `#AD955F` | Aproximação decorativa do dourado; não substitui as cores do arquivo |
| `--hero-bg-deep` | `#071914` | Fundo verde-floresta profundo da Hero |
| `--hero-bg-ambient` | `#0F2921` | Camada esmeralda de ambientação na Hero |
| `--hero-gold-title` | `#D8BD84` | Destaque dourado no título principal sobre fundo escuro |
| `--hero-text-primary` | `#F7F6F2` | Texto principal claro na superfície escura da Hero |
| `--hero-text-muted` | `#C9D4CE` | Texto secundário claro na superfície escura da Hero |
| `--hero-cta-bg` | `#1E824C` | Base luminosa do botão CTA na Hero escura |

Conferir contraste na combinação real e nos estados de foco, hover e disabled. Dourado e cinza claro não devem ser o único sinal de ação ou estado. O preset de caldeiraria não transporta suas cores para este tema.

## Tipografia e medidas

Partida proposta: Manrope para títulos e corpo, com fallback sans-serif. A fonte não foi identificada com certeza no Behance; a escolha deverá ser testada com os textos reais. Manter o logo como imagem, sem tentar reconstruir sua tipografia.

- Corpo: 16–18 px, entrelinha próxima de 1,6.
- Título principal: escala fluida entre aproximadamente 32 e 52 px.
- Títulos de seção: aproximadamente 28–40 px.
- Rótulos: 11–13 px, caixa alta com uso moderado.
- Container: largura máxima inicial de 1200 px, padding lateral de 20–24 px.
- Ritmo: base de 4 px; gaps recorrentes de 16, 24, 32 e 48 px.
- Espaço vertical: seções entre 64 e 112 px, ajustadas ao conteúdo.
- Raios: 8 px em controles/cartões e 24–32 px em grandes painéis.

Breakpoints de referência: 48rem para expansão da navegação/colunas e 64rem para composições amplas. O conteúdo decide se uma transição precisa ocorrer antes. Conferir também telas de 320–390 px, tablet e desktop; não usar só modelos fixos de aparelho.

## Componentes de marca

- CTA principal: verde, texto claro e ícone/seta em círculo; hover e foco visíveis, com área de toque confortável.
- Rótulo de seção: contorno fino, escala pequena e espaçamento consistente do título.
- Serviço: título, descrição, ícone coerente e destino existente. A fonte tem sete blocos; não forçar apenas quatro para imitar o desenho.
- Card: borda sutil e sombra mínima; aplicar quando o agrupamento justificar.
- Selo: usar o monograma DF disponível, evitando o monograma do advogado de referência e textos circulares com alegações não publicadas.
- Painel de contato: fundo claro sobre área escura, canais reais e CTA único reconhecível.
- Percurso de atendimento: SVG decorativo acompanhado de uma lista semântica, somente quando houver etapas definidas.

Primitives interativos vêm de [shadcn/ui](shadcn-ui.md) quando adequados. Elementos editoriais não precisam virar controles ou cartões genéricos.

## Composição e responsividade

Alternar seções centralizadas e de duas colunas, conservando espaço vazio e linhas curtas. Hero usa o retrato real; o recorte não pode encobrir título, CTA ou rosto. Foto e texto passam para uma coluna no mobile. Grades de serviços reduzem para uma coluna quando a leitura exigir.

O caminho sinuoso do processo vira uma lista vertical no mobile. Selos e marcas-d'água ficam atrás do conteúdo e deixam de aparecer quando prejudicarem a leitura. WhatsApp flutuante deve respeitar safe areas e não cobrir rodapé, foco ou ações.

## Mídia

Os originais ficam preservados em `docs/assets/delano-furtado/`, conforme [manifesto](assets/delano-furtado/manifesto.json). Não reduzir ou substituir esses originais para otimizar o frontend. O recorte fornecido para a Hero (`retrato-delano-furtado-sem-fundo.jpg`) é mantido como ativo adicional verificado por hash na mesma pasta.

Em **27/10/2026**, o usuário forneceu o retrato `retrato-delano-furtado-sobre-2026-10-27.jpg` para a seção **Conheça o advogado**. O original está preservado integralmente e registrado em `provided_assets` no manifesto, separado da coleta histórica. A seção usa `delano-sobre-480/800/1200.webp`, preparados a partir desse arquivo; o recorte da Hero continua independente.

Criar derivados em `src/assets/` ou `public/`, registrar origem, dimensão e uso (`delano-hero-480.webp`, `delano-hero-686.webp` e `delano-hero-1024.webp` com transparência e super-resolução para a Hero; `hero-office-bg.webp` para o cenário de fundo da Hero; `delano-sobre-480/800/1200.webp` para a seção Sobre). Os derivados anteriores `delano-480/800/1200.webp` permanecem preservados para as referências existentes, inclusive dados estruturados. Usar `srcset`/`sizes` quando necessário, dimensões explícitas e recorte apropriado por viewport. A imagem principal deve carregar cedo; mídia abaixo da dobra pode usar lazy loading.

Corrigir os textos alternativos incorretos encontrados no site antigo. Imagem decorativa usa alt vazio; retrato e logo recebem descrição adequada ao contexto. Uma imagem temática de Justiça não representa uma fotografia do escritório.

## Conferência

Comparar hierarquia, proporções, espaçamento e consistência com a referência, usando os textos reais. Os critérios de acessibilidade e performance estão no [documento dedicado](seo-acessibilidade-performance.md); os registros visuais ficam na evidência da entrega.
