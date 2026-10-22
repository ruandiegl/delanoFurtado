# Redesign da Hero com Retrato Recortado e Atmosfera Escura — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task, conforme o método de execução autorizado e as ferramentas disponíveis. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesenhar a seção Hero da página inicial (`/`) de Delano Furtado, substituindo o cartão claro com foto emoldurada por uma composição imersiva em fundo verde-floresta profundo, tipografia editorial bicolor (off-white e dourado), selo metálico em pílula, CTA de alto contraste e o retrato recortado (sem fundo) emergindo da base com iluminação de recorte e ambientação sutil de escritório jurídico ao fundo, inspirado na referência visual enviada pelo usuário.

**Architecture:** Evolução incremental sobre a arquitetura React 19 + TypeScript 6 + Vite 8 + styled-components 6 + shadcn/Base UI já em produção. O pipeline de mídia (`scripts/prepare-assets.mjs`) passa a processar o retrato recortado fornecido pelo usuário para gerar derivados `.webp` com canal alfa real (transparência externa por flood-fill, descontaminação de borda e corte da margem inferior vazia), mantendo intactos os 7 arquivos originais e seus hashes SHA-256 em `docs/assets/delano-furtado/manifesto.json`. `HeroSection.tsx` recebe tokens locais de superfície escura, camadas atmosféricas em CSS/mídia local e integração contínua com `Header.tsx` e `CredentialsSection.tsx`, preservando SSR (`entry-server.tsx`), hidratação e cleanup GSAP.

**Tech Stack:** React/DOM 19, TypeScript 6 estrito, Vite 8, React Router DOM 6, styled-components 6, shadcn/Base UI (`Button`), Tailwind 4, Lucide, Manrope Variable local, Sharp (pipeline de build de mídia), GSAP 3 + `@gsap/react` + ScrollTrigger, ESLint, Vitest/Testing Library/jsdom; npm.

**Spec:** [Índice e guidelines](../docs/README.md), [design system](../docs/design-system.md), [arquitetura](../docs/arquitetura.md), [padrões de código](../docs/padroes-de-codigo.md), [rotas e conteúdo](../docs/rotas-e-conteudo.md), [movimento e GSAP](../docs/movimento-e-gsap.md), [SEO, acessibilidade e performance](../docs/seo-acessibilidade-performance.md), [qualidade e validação](../docs/qualidade-e-validacao.md) e [plan-001](plan-001-mvp-landing-page-delano-furtado.md).

**Data:** 22/10/2026. **Estado:** Concluído localmente e verificado em 22/10/2026. **Tarefa preenchida:** implementar o redesign da Hero da Home utilizando a foto sem fundo do Dr. Delano Furtado (com refinamento de bordas anti-aliasing e descontaminação de luminância) e fundo fotográfico real de escritório sob o gradiente verde-floresta profundo.

## Global Constraints

- Produto WEB em português do Brasil; trabalhar nesta raiz e preservar `docs/`, `agents/`, `plans/` e os 7 originais verificados em `docs/assets/delano-furtado/manifesto.json`.
- **Integridade dos originais:** os 7 arquivos originais em `docs/assets/delano-furtado/` têm verificação estrita de SHA-256 no `scripts/prepare-assets.mjs`. O retrato recortado enviado pelo usuário deve ser salvo como um **novo** ativo fonte (`docs/assets/delano-furtado/retrato-delano-furtado-sem-fundo.jpg`) e seus derivados gerados em `public/media/delano-hero-*.webp`, mantendo `delano-480/800/1200.webp` intactos para a seção `Sobre` (`AboutSection.tsx`).
- **Conteúdo factual exclusivo do Delano:** a imagem de inspiração (*Coimbra Oliveira Advocacia*) serve **exclusivamente como referência estética e de composição visual**. Não importar nome, logo, textos sobre regularização de imóveis/usucapião ou promessas da referência. Manter os dados reais de `siteData.ts` e `homeContent.ts` (Advocacia e consultoria jurídica em Volta Redonda, OAB/RJ 235.314, atendimento presencial no RJ e online no Brasil).
- **Integridade do logo:** conforme [Design system](../docs/design-system.md), o logo preto/dourado (`logo-delano.png`) mantém sua integridade no `Header` claro sem recoloração artificial.
- **Acessibilidade e Visibilidade Inicial:** nenhum texto (`h1`), botão (CTA) ou imagem principal pode iniciar com `opacity: 0` ou `visibility: hidden` no HTML/CSS base. O contraste sobre a nova Hero escura deve cumprir WCAG 2.2 AA (≥ 4,5:1 em textos normais e ≥ 3:1 em textos grandes e indicadores de foco).
- **Compatibilidade com SSR/Prerender:** qualquer marcação interna ao `<h1>` deve manter compatibilidade com `scripts/verify-build.mjs`, `src/test/prerender.test.tsx` e `src/test/hydration.test.tsx`.

## Review Focus

1. **Extração de canal alfa sem afetar a camisa branca:** a foto sem fundo enviada (`media_1792693472677_0e2f754e.jpg`) é um arquivo JPEG (`686 × 1024`, 3 canais, sem canal alfa) com fundo branco (`#FFFFFF`). Um filtro ingênuo por cor branca tornaria a camisa branca e o reflexo do relógio transparentes; o processamento em `prepare-assets.mjs` **deve** usar *flood-fill* (componentes conectados a partir das bordas externas) combinado com suavização/descontaminação de borda (*defringing*) de 1–2 px.
2. **Alinhamento inferior do recorte e ausência de corte seco:** no arquivo enviado, a linha do braço/mesa termina em `y = 823` (há 200 px de faixa branca vazia abaixo do braço até `y = 1024`, e a manga direita à esquerda termina em `y = 758`). O derivado deve recortar a margem vazia inferior (`y > 823`) e a `HeroSection` deve aplicar um gradiente/vinheta inferior (`#071914`) sobre os últimos 15–18% do retrato para fundir braços e mesa suavemente na base da seção, como na referência.
3. **Contraste do botão CTA sobre fundo verde-escuro:** o botão `variant="brand"` atual usa `--primary` (`#20382F`), que desapareceria sobre o fundo escuro da nova Hero (`#071914`–`#0D261F`). É obrigatória uma variante de CTA luminosa de alto contraste para superfícies escuras, com anel de foco claro visível.
4. **Preservação do OAB/RJ 235.314 na primeira dobra:** na Hero atual, a OAB ficava no card flutuante branco (`.portrait-tag`) sobre a foto emoldurada. Ao remover a moldura e o card branco para adotar o estilo da inspiração, a identificação `OAB/RJ 235.314` deve permanecer visível na Hero (integrada ao selo/pílula dourada ou à barra de assinatura institucional da Hero).
5. **Paridade de pré-renderização e testes existentes:** `npm run test:run`, `npm run lint`, `npm run build` e `npm run verify:build` devem passar sem regressões nas 3 rotas públicas e no `404.html`.

---

## 1. Agentes selecionados e responsabilidades

A seleção abaixo segue [agents/README.md](../agents/README.md) e o fluxo por domínio em [docs/skills-e-fluxo-de-ia.md](../docs/skills-e-fluxo-de-ia.md):

| Agente | Papel nesta tarefa | Entrega principal no plano |
| --- | --- | --- |
| **[UX/UI Designer](../agents/ux-ui-designer.md)** *(Responsável principal)* | Direção visual, tradução da inspiração para a marca Delano, tokens da Hero escura, tipografia bicolor e responsividade | Especificação de camadas, cores, proporções desktop/mobile e estados interativos |
| **[Frontend Engineer](../agents/frontend-engineer.md)** | Pipeline Sharp de recorte transparente, refatoração de `HeroSection.tsx`, variante de `Button`/`ContactCta` e transição com `CredentialsSection` | Código React/TypeScript/styled-components tipado e derivados `.webp` em `public/media/` |
| **[Accessibility & Performance Engineer](../agents/accessibility-performance-engineer.md)** | Contraste WCAG 2.2 AA em superfície escura, foco visível, reserva de dimensão (`width`/`height`) para CLS zero e prioridade LCP | Validação de contraste (off-white, dourado e CTA), `fetchPriority="high"` e `sizes` corretos |
| **[Motion Engineer](../agents/motion-engineer.md)** | Ajuste da coreografia de entrada (`data-reveal="hero"`) para copy + retrato recortado em camadas | Animação sutil com `useGSAP`, respeito a `prefers-reduced-motion` e cleanup em `StrictMode` |
| **[SEO & Content Specialist](../agents/seo-content-specialist.md)** | Garantia de fidelidade factual ao documento 02, semântica do `<h1>` e integridade do HTML pré-renderizado | Preservação do `h1`, OAB e descrição na resposta estática de `/` |
| **[QA Engineer](../agents/qa-engineer.md)** + **[Code Reviewer](../agents/code-reviewer.md)** | Testes de contrato da nova Hero, verificação de build e inspeção multi-viewport (320 a 1440 px) | Suíte automatizada verde, revisão contra guidelines e registro em `docs/evidencias/` |
| **[Technical Writer](../agents/technical-writer.md)** | Atualização de `docs/design-system.md`, `plans/README.md`, `docs/README.md` e registro de evidência | Documentação sincronizada com o estado implementado |

---

## 2. Estado atual e análise técnica das 3 imagens fornecidas

### 2.1. Imagem 1 — Hero atual implementada (`src/pages/Home/sections/HeroSection.tsx`)
- **Arquivo de referência:** `media_1792693442819_20c0db9b.png` (`1024 × 466`, SHA-256 `9d3a8225...`).
- **Composição atual:** fundo claro (`linear-gradient(180deg, #fff 75%, var(--secondary) 75%)`), coluna esquerda com `SmallLabel` bordado, `h1` escuro, descrição cinza, `ContactCta` verde-escuro (`#20382F`) e linha de localização; coluna direita com foto original completa dentro de moldura em arco (`border-radius: 144px 12px 0 0`), contorno deslocado (`::before`) e cartão branco flutuante `.portrait-tag` (`DF` + `Delano Furtado` + `OAB/RJ: 235.314`).

### 2.2. Imagem 2 — Foto sem fundo enviada pelo usuário
- **Arquivo na sessão:** `C:/Users/Rv22/.gemini/antigravity/brain/03442d4e-f401-42ee-97b1-0aa57067ef6e/.user_uploaded/media_1792693472677_0e2f754e.jpg` (`75.611` bytes, SHA-256 `82d2feb83e6d2447add2d9412e977d24ca039bfd64528baf5ee88e2d48c75292`).
- **Diagnóstico técnico via `sharp`:**
  - Dimensões: `686 × 1024` px, formato `JPEG`, `3` canais RGB (`srgb`), **`hasAlpha: false`**.
  - O fundo ao redor do Dr. Delano já foi removido e preenchido com branco puro (`> 242` por canal, totalizando `493.664` pixels externos conectados às bordas).
  - *Bounding box* útil da silhueta: `minX = 0`, `maxX = 574` (`largura útil = 575 px`), `minY = 168`, `maxY = 823` (`altura útil = 656 px`).
  - Há apenas `246` pixels internos claros (`> 242`) pertencentes à camisa social branca e ao reflexo do relógio, totalmente isolados da borda externa pela silhueta do paletó e do rosto.
  - A faixa inferior de `y = 824` a `y = 1023` (`200 px`) está inteiramente vazia (branca), pois a linha do antebraço apoiado na mesa termina em `y = 823` (e a manga direita à esquerda termina em `y = 758`).

### 2.3. Imagem 3 — Inspiração visual (*Coimbra Oliveira Advocacia*)
- **Arquivo na sessão:** `media_1792693549300_3135cdd0.png` (`810 × 318`, SHA-256 `3e040d55...`).
- **Elementos-chave da composição que serão traduzidos para o Delano:**
  1. **Fundo escuro profundo com ambientação arquitetônica à direita:** verde-floresta meia-noite sólido/aveludado à esquerda (atrás do texto para leitura limpa) abrindo-se suavemente à direita para uma ambientação escura de escritório jurídico em luz baixa (estantes/persianas em chiaroscuro verde-petróleo), sem competir com o rosto do advogado.
  2. **Selo superior em pílula dourada (`Gold Pill Badge`):** pílula horizontal com cantos totalmente arredondados (`border-radius: 999px`), preenchimento em gradiente dourado/champagne (`#E5D1A1` → `#C6A868` → `#A38446`) e texto escuro em caixa alta com alto contraste.
  3. **Título principal (`h1`) com contraste bicolor (Off-White + Dourado):** primeiras linhas em branco quente (`#F7F6F2`) e trecho complementar em dourado editorial claro (`#D6B87C`), criando hierarquia imediata e sofisticação jurídica.
  4. **Parágrafo de apoio claro e enxuto:** texto em tom claro suave (`#C8D3CD`), confortável para leitura sobre fundo escuro.
  5. **Botão CTA de destaque luminoso com ícone de WhatsApp:** botão em verde-esmeralda vibrante/luminoso sobre o fundo verde-meia-noite, garantindo saliência visual imediata para a conversão.
  6. **Retrato recortado imponente à direita com fusão na base:** pessoa sem moldura geométrica, iluminada contra o ambiente escuro, com gradiente escuro inferior (vinheta na base) que funde os antebraços/mesa com o piso da seção.

---

## 3. Escopo do incremento

### Incluído
- Arquivamento rastreável da foto recortada em `docs/assets/delano-furtado/retrato-delano-furtado-sem-fundo.jpg` e geração automatizada de derivados `.webp` transparentes (`delano-hero-480.webp`, `delano-hero-686.webp`) em `scripts/prepare-assets.mjs`.
- Novos tokens CSS em `src/styles/tokens.css` para a superfície escura da Hero, gradiente dourado do selo, destaque tipográfico dourado e CTA luminoso.
- Redesign completo de `src/pages/Home/sections/HeroSection.tsx` seguindo a composição da inspiração com dados reais do Delano.
- Ajuste da transição entre `HeroSection.tsx` (escura) e `CredentialsSection.tsx` (faixa de formação acadêmica logo abaixo), mantendo o `Header.tsx` claro e íntegro com o logo original.
- Atualização dos testes e documentação (`docs/design-system.md`).

### Fora do escopo
- Alteração de textos jurídicos para imitar a área imobiliária exclusiva da imagem de inspiração (o escritório do Delano atua em 7 áreas e mantém sua proposta de valor real).
- Alteração da foto da seção `Sobre` (`AboutSection.tsx`), que continua usando o retrato ambientado original (`delano-480/800/1200.webp`).
- Mudança de rotas, páginas `/localizacao` e `/contate-nos`, ou adição de backend/formulários.

---

## 4. Direção visual e uso de UI/UX Pro Max & Frontend Design

### Consultas realizadas no catálogo local (`ui-ux-pro-max`)

```text
python C:/Users/Rv22/.agents/skills/ui-ux-pro-max/scripts/search.py "dark green luxury law hero cutout portrait" --design-system -p "Delano Furtado Hero" --variance 3 --motion 4 --density 2 -f markdown
python C:/Users/Rv22/.agents/skills/ui-ux-pro-max/scripts/search.py "dark mode contrast focus ring" --domain ux -n 2
python C:/Users/Rv22/.agents/skills/ui-ux-pro-max/scripts/search.py "hero entrance reveal" --domain gsap -n 2
```

**Diretrizes extraídas e adaptadas com a skill `frontend-design`:**
- **Contraste e legibilidade em superfície escura:** texto corrido nunca deve usar cinza médio apagado sobre verde-escuro; usar `#F7F6F2` (título claro, contraste > 14:1 sobre `#071914`), `#D8BD84` (destaque dourado do título, contraste ≈ 9,2:1 sobre `#071914`) e `#C9D4CE` (parágrafo de introdução, contraste ≈ 10,8:1 sobre `#071914`).
- **Indicador de foco em superfície escura:** `outline: 2px solid #D8BD84; outline-offset: 3px` para links e CTA dentro da Hero escura, cumprindo o critério de perímetro e contraste > 3:1 contra `#071914`.
- **Restrição estética (`frontend-design`):** concentrar o impacto dramático na atmosfera escura + retrato recortado + selo/título bicolor, removendo a moldura arqueada antiga e o cartão branco flutuante que competiam com o retrato.

### Especificação de tokens e camadas visuais da nova Hero

| Elemento | Especificação / Token | Papel visual |
| --- | --- | --- |
| `--hero-bg-deep` | `#071914` | Base escura principal (lado esquerdo e vinheta inferior) |
| `--hero-bg-ambient` | `#0F2921` | Tom esmeralda-escuro da zona direita atrás do retrato |
| `--hero-gold-light` | `#E3C992` | Ponto iluminado do selo em pílula e destaques |
| `--hero-gold-mid` | `#C6A767` | Tom médio dourado editorial |
| `--hero-gold-title` | `#D8BD84` | Cor do segundo trecho do `h1` (contraste ≥ 9:1 sobre `#071914`) |
| `--hero-text-primary` | `#F7F6F2` | Cor do primeiro trecho do `h1` e textos fortes |
| `--hero-text-muted` | `#C8D3CD` | Cor do parágrafo `.intro` e legendas secundárias |
| `--hero-cta-bg` | `linear-gradient(135deg, #1E824C 0%, #16653B 100%)` | Botão CTA WhatsApp destacado sobre o fundo escuro (com borda sutil `#34A86B55` e hover `#239457`) |
| Ambientação de fundo (direita) | Composição CSS em camadas sobre `textura-fundo-cinza` otimizada + linhas arquitetônicas sutis de luz/persiana e estante em SVG/gradiente sob `mix-blend-mode` controlado | Reproduz a profundidade de escritório clássico escuro da inspiração sem usar foto falsa de terceiros |
| Fusão inferior do retrato | `mask-image: linear-gradient(180deg, #000 74%, rgba(0,0,0,0.55) 89%, transparent 100%)` + `::after` de vinheta no palco | Elimina qualquer corte reto na altura dos braços/mesa (`y = 758..823`) |

### Estrutura de layout (Wireframe ASCII)

```text
Desktop (≥ 64rem):
+-----------------------------------------------------------------------------------+
| [Header Claro Sticky: Logo DF Original | Áreas  Sobre  Localização  Contato | CTA]|
+-----------------------------------------------------------------------------------+
|  FUNDO VERDE-FLORESTA PROFUNDO (#071914 -> #0F2921 + AMBIENTAÇÃO ESCRITÓRIO)      |
|                                                                                   |
|   ( DELANO FURTADO • ADVOCACIA E CONSULTORIA • OAB/RJ 235.314 )  [Pílula Dourada] |
|                                                                    ,---.          |
|   Advocacia e consultoria          [Off-white #F7F6F2]            ( o o )         |
|   jurídica em Volta Redonda        [Dourado #D8BD84]             /|  V  |\        |
|                                                                 / |     | \       |
|   Soluções jurídicas construídas com estratégia,               /  |     |  \      |
|   transparência e atenção às particularidades...               `--=======---'     |
|                                                               [Retrato Recortado  |
|   [ (W) Entre em contato via WhatsApp  (↗) ]                   emergindo da base  |
|                                                                com vinheta suave] |
|   (*) Presencial no RJ · Online em todo o Brasil                                  |
| - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - |
|   ATUAÇÃO TÉCNICA. ATENDIMENTO PRÓXIMO.                      CONHEÇA A ATUAÇÃO ↓  |
+-----------------------------------------------------------------------------------+
| [CredentialsSection: Card branco elevado sobre fundo #F0EFEB com as 3 formações]  |
+-----------------------------------------------------------------------------------+
```

No **Mobile (`< 48rem`)**:
- Coluna única: pílula dourada → `h1` bicolor → `.intro` → `ContactCta` largura confortável → legenda de abrangência → retrato recortado centralizado na base da Hero com vinheta inferior fundindo na barra `scroll-hint`.

---

## 5. Contratos compartilhados afetados

| Módulo / Arquivo | Contrato / Alteração planejada |
| --- | --- |
| `docs/assets/delano-furtado/retrato-delano-furtado-sem-fundo.jpg` | Cópia íntegra do arquivo enviado pelo usuário (`686 × 1024`, `75.611` bytes, SHA-256 `82d2feb83e6d2447add2d9412e977d24ca039bfd64528baf5ee88e2d48c75292`). Os 7 itens originais de `manifesto.json` permanecem inalterados. |
| `scripts/prepare-assets.mjs` | Mantém a verificação SHA-256 dos 7 originais; adiciona processamento de `retrato-delano-furtado-sem-fundo.jpg` extraindo máscara alfa por *flood-fill* a partir das bordas + *defringing* de 1–2 px + crop vertical (`top: 148, height: 676`, removendo a faixa branca inferior `y > 823`) e gerando `public/media/delano-hero-480.webp` e `public/media/delano-hero-686.webp`. |
| `src/content/media.ts` | Mantém `media.portrait` (usado em `AboutSection`) e adiciona `media.heroPortrait` (`src: '/media/delano-hero-686.webp'`, `srcSet: '/media/delano-hero-480.webp 480w, /media/delano-hero-686.webp 686w'`, `width: 686`, `height: 676`, `alt: 'Delano Santos Furtado, advogado'`). |
| `src/content/homeContent.ts` | Mantém `heroTitle: 'Advocacia e consultoria jurídica em Volta Redonda'` como string única para SEO/testes e adiciona `heroTitleParts: { lead: 'Advocacia e consultoria', accent: 'jurídica em Volta Redonda' }` e `heroBadge: 'Delano Furtado · Advocacia · OAB/RJ 235.314'`. |
| `src/components/ui/button.tsx` e `src/components/brand/ContactCta.tsx` | Adiciona suporte opcional à variante `hero` (ou prop `tone?: 'default' \| 'hero'`) em `ContactCta` para renderizar o botão com contraste elevado na superfície escura da Hero, mantendo o contrato de link do WhatsApp e o `cta-arrow`. |
| `src/pages/Home/sections/HeroSection.tsx` | Substitui o layout claro e a moldura arqueada pela composição escura inspirada na referência, usando `media.heroPortrait`, pílula dourada com OAB, `h1` bicolor acessível, ambientação arquitetônica no lado direito e vinheta inferior. |
| `scripts/verify-build.mjs` e `src/test/prerender.test.tsx` | Mantêm a verificação do `h1` da Home (`Advocacia e consultoria jurídica em Volta Redonda`), garantindo que o texto completo seja verificado mesmo com estilização bicolor. |

---

## 6. Pipeline de mídia: tratamento técnico da foto sem fundo

Para garantir qualidade profissional sem halo branco sobre o fundo verde-escuro (`#071914`):

1. **Flood-fill a partir das 4 bordas da imagem (`686 × 1024`):**
   - Sementes: todos os pixels das bordas (`x = 0`, `x = 685`, `y = 0`, `y = 1023`) com luminância alta (`R > 238 && G > 238 && B > 238`).
   - Expansão 8-conectada para todos os pixels adjacentes do fundo branco. Isso isola 100% do fundo externo (inclusive o vão entre o braço direito e o tronco) e preserva 100% da camisa branca interna e do mostrador do relógio.
2. **Suavização e descontaminação de borda (*Edge Feathering & Defringing*):**
   - Pixels de fronteira a 1–2 px do fundo externo que apresentem mistura com o branco do JPEG (`luminância > 200` na borda imediata) recebem alfa proporcional (`alpha = clamp((250 - lum) / 55, 0, 1)`) e descontaminação RGB (`C_clean = (C - (1 - alpha) * 255) / alpha`), eliminando o serrilhado ou contorno esbranquiçado ao redor do cabelo e dos ombros do terno.
3. **Enquadramento vertical exato (`crop`):**
   - Recorte vertical de `top = 148` até `y = 823` (`height = 676 px`, `width = 686 px`), removendo os `200 px` de espaço vazio abaixo dos antebraços para que a imagem se ancore perfeitamente em `bottom: 0` no palco da Hero.
4. **Exportação WebP RGBA otimizada:**
   - Geração de `public/media/delano-hero-686.webp` (`686 × 676`, `quality: 88`, `alphaQuality: 92`) e `public/media/delano-hero-480.webp` (`480 × 473`).

---

## 7. Mapa de animações GSAP e acessibilidade na Hero

| Elemento | Gatilho | Efeito GSAP (`siteMotion.ts`) | Duração / Ease | Salvaguarda de acessibilidade |
| --- | --- | --- | --- | --- |
| `.hero-copy` (`data-reveal="hero"`) | Montagem cliente | `y: 12 → 0` | `0.5s`, `power2.out` | `opacity` permanece `1`; `h1` e `ContactCta` imediatamente legíveis e clicáveis |
| `.portrait-stage` (`data-reveal="hero"`) | Montagem cliente | `y: 12 → 0` | `0.5s`, `power2.out` | Retrato com `fetchPriority="high"` visível desde o primeiro frame SSR |
| `prefers-reduced-motion: reduce` | Media query | Nenhum tween criado | Imediato | Estado final estático nativo sem movimentação |

---

## 8. Tarefas passo a passo

### Tarefa 1 — Preservação do ativo recortado e geração de derivados transparentes

**Responsável:** [Frontend Engineer](../agents/frontend-engineer.md) + [Accessibility & Performance Engineer](../agents/accessibility-performance-engineer.md). **Depende de:** leitura deste plano.

**Arquivos:** copiar imagem do usuário para `docs/assets/delano-furtado/retrato-delano-furtado-sem-fundo.jpg` e fundo fotográfico de escritório para `docs/assets/delano-furtado/fundo-escritorio-hero.jpg`; atualizar `scripts/prepare-assets.mjs`, `public/media/manifest.json` e `src/content/media.ts`.

- [x] Copiar `C:/Users/Rv22/.gemini/antigravity/brain/03442d4e-f401-42ee-97b1-0aa57067ef6e/.user_uploaded/media_1792693472677_0e2f754e.jpg` para `docs/assets/delano-furtado/retrato-delano-furtado-sem-fundo.jpg` e validar que seu hash SHA-256 é `82d2feb83e6d2447add2d9412e977d24ca039bfd64528baf5ee88e2d48c75292`.
- [x] Atualizar `scripts/prepare-assets.mjs` para verificar também o hash do novo arquivo recortado e do fundo de escritório (`fundo-escritorio-hero.jpg`, SHA-256 `9b787103b43602d45e6860d3bedd9b71e4e82d556ee54217eeb217472a8a8601`) e executar o algoritmo de *flood-fill* + suavização Gaussiana 2D + descontaminação de borda + crop vertical (`686 × 676`), gerando `public/media/delano-hero-480.webp`, `public/media/delano-hero-686.webp` e `public/media/hero-office-bg.webp`.
- [x] Executar `npm run assets:prepare` e verificar nos metadados gerados em `public/media/manifest.json` que `delano-hero-480.webp` e `delano-hero-686.webp` possuem canal alfa (`channels: 4` / `hasAlpha: true`) e que a camisa branca interna permanece opaca.
- [x] Exportar `heroPortrait` e `heroBackdrop` em `src/content/media.ts` mantendo `portrait` inalterado para `AboutSection.tsx`.

**Aceite:** `npm run assets:prepare` executa sem erros, preserva os 7 originais do `manifesto.json` e gera derivados `.webp` com transparência real limpa e sem a faixa vazia inferior.

### Tarefa 2 — Tokens de superfície escura, conteúdo da Hero e variante de CTA luminoso

**Responsável:** [UX/UI Designer](../agents/ux-ui-designer.md) + [Frontend Engineer](../agents/frontend-engineer.md) + [SEO & Content Specialist](../agents/seo-content-specialist.md). **Depende de:** 1.

**Arquivos:** atualizar `src/styles/tokens.css`, `src/content/homeContent.ts`, `src/components/ui/button.tsx` e `src/components/brand/ContactCta.tsx`.

- [x] Adicionar os tokens semânticos da Hero escura em `src/styles/tokens.css` (`--hero-bg-deep`, `--hero-bg-ambient`, `--hero-gold-light`, `--hero-gold-mid`, `--hero-gold-title`, `--hero-text-primary`, `--hero-text-muted`, `--hero-cta-bg`, `--hero-cta-hover`, `--hero-border`).
- [x] Atualizar `src/content/homeContent.ts` com `heroBadge` (`'Delano Furtado · Advocacia · OAB/RJ 235.314'`) e `heroTitleParts` (`{ lead: 'Advocacia e consultoria', accent: 'jurídica em Volta Redonda' }`), mantendo `heroTitle` intacto.
- [x] Adicionar a variante `hero` em `src/components/ui/button.tsx` (gradiente verde-esmeralda luminoso com borda sutil, foco dourado de alto contraste e círculo branco com ícone) e permitir sua seleção via prop `tone?: 'default' | 'hero'` em `src/components/brand/ContactCta.tsx` (com default `'default'` para não alterar Header, Serviços ou Contato).

**Aceite:** tokens centralizados em `tokens.css`, `ContactCta` com suporte a superfície escura e tipagem estrita aprovada em `npm run lint`.

### Tarefa 3 — Implementação da nova `HeroSection` e transição com `CredentialsSection`

**Responsável:** [UX/UI Designer](../agents/ux-ui-designer.md) + [Frontend Engineer](../agents/frontend-engineer.md) + [Motion Engineer](../agents/motion-engineer.md). **Depende de:** 1 e 2.

**Arquivos:** atualizar `src/pages/Home/sections/HeroSection.tsx`, `src/pages/Home/sections/CredentialsSection.tsx` e criar/atualizar testes de contrato em `src/test/prerender.test.tsx` e `scripts/verify-build.mjs` se aplicável.

- [x] Escrever/atualizar asserções em `src/test/prerender.test.tsx` garantindo que a renderização SSR de `/` inclui:
  - O texto completo do `h1` (`Advocacia e consultoria jurídica em Volta Redonda`);
  - A identificação `OAB/RJ 235.314` visível na Hero;
  - A imagem `delano-hero-686.webp` com `fetchpriority="high"`.
- [x] Refatorar `src/pages/Home/sections/HeroSection.tsx`:
  - Fundo escuro em múltiplas camadas (`--hero-bg-deep` à esquerda, fotografia realista de escritório jurídico clássico escuro à direita via `media.heroBackdrop` e gradiente `.hero-vignette`);
  - Selo em pílula metálica dourada (`hero-badge`) exibindo marca, atuação e OAB;
  - `h1` com contraste bicolor (`#F7F6F2` + `<span className="hero-title-accent">` em `#D8BD84`), mantendo o texto contínuo para leitores de tela e verificadores de build;
  - Parágrafo `.intro` em `--hero-text-muted`, `<ContactCta tone="hero" />` e `.hero-caption` com ícone `MapPin` em dourado;
  - Palco direito (`.portrait-stage`) sem moldura branca arqueada, renderizando `media.heroPortrait` ancorado na base com `mask-image` e vinheta inferior suave (`#071914`), fundindo os antebraços na base da Hero;
  - Barra `.scroll-hint` integrada na base escura da Hero com divisor sutil (`border-top: 1px solid var(--hero-border)`).
- [x] Ajustar `src/pages/Home/sections/CredentialsSection.tsx` para criar uma transição harmônica e elegante logo abaixo da Hero escura.
- [x] Verificar o comportamento responsivo em `< 64rem` (tablet) e `< 48rem` (mobile 320px–390px), garantindo que o retrato recortado fique centralizado na base da coluna sem corte abrupto e sem overflow horizontal.

**Aceite:** `HeroSection` fiel à inspiração enviada pelo usuário, usando foto recortada real do Delano, sem halo branco ou corte seco na base, e preservando 100% dos fatos do escritório.

### Tarefa 4 — Validação automatizada, inspeção multi-viewport e revisão independente

**Responsável:** [QA Engineer](../agents/qa-engineer.md) + [Accessibility & Performance Engineer](../agents/accessibility-performance-engineer.md) + [Code Reviewer](../agents/code-reviewer.md). **Depende de:** 3.

**Arquivos:** suíte `src/test/*.test.ts(x)` e scripts de verificação.

- [x] Executar `npm run test:run`, `npm run lint`, `npm run build` e `npm run verify:build`.
- [x] Inspecionar a composição renderizada:
  - Confirmar ausência de overflow horizontal (`scrollWidth <= clientWidth`);
  - Confirmar contraste do `h1` bicolor, pílula dourada, descrição e botão CTA sobre o fundo escuro;
  - Confirmar ausência de borda branca (*halo*) ou recortes irregulares ao redor do cabelo/terno/colarinho e fusão suave da linha do braço na base da Hero;
  - Validar anel de foco visível na superfície escura e suporte a `prefers-reduced-motion: reduce`.

**Aceite:** todos os testes automatizados, build SSR/prerender e inspeções visuais/acessibilidade aprovados sem regressões.

### Tarefa 5 — Atualização documental e registro de evidências

**Responsável:** [Technical Writer](../agents/technical-writer.md). **Depende de:** 4.

**Arquivos:** atualizar `docs/design-system.md`, `docs/README.md`, `plans/README.md` e estado deste `plan-002`.

- [x] Atualizar `docs/design-system.md` registrando os novos tokens da Hero escura e os derivados `delano-hero-*.webp` e `hero-office-bg.webp` em Mídia.
- [x] Atualizar `plans/README.md`, `docs/README.md` e o cabeçalho deste plano para refletir a conclusão.

**Aceite:** documentação e evidências sincronizadas com o código e links locais íntegros.

---

## 9. Dependências, checkpoints e retorno seguro

Ordem de execução: **1 → 2 → 3 → 4 → 5**.
- A Tarefa 1 (pipeline de imagem) deve ser concluída e inspecionada antes da Tarefa 3 para garantir que o arquivo `.webp` transparente não tenha halo branco nem margem vazia inferior.
- Como os 7 originais em `docs/assets/delano-furtado/` e os derivados `delano-480/800/1200.webp` são preservados intactos, o rollback para a Hero anterior em caso de necessidade resume-se a reverter `HeroSection.tsx` sem perda de nenhum asset.

---

## 10. Fontes de skills, documentos e perfis consultados

- **Skills consultadas nesta sessão:**
  - [UI/UX Pro Max](C:/Users/Rv22/.agents/skills/ui-ux-pro-max/SKILL.md) — consultas de design system, contraste em superfície escura e reveal de Hero registradas na seção 4.
  - [Frontend Design](C:/Users/Rv22/.agents/skills/frontend-design/SKILL.md) — diretrizes de hierarquia tipográfica, contenção estética e contraste intencional.
- **Guidelines do projeto (`docs/`):**
  - [docs/README.md](../docs/README.md), [docs/design-system.md](../docs/design-system.md), [docs/arquitetura.md](../docs/arquitetura.md), [docs/padroes-de-codigo.md](../docs/padroes-de-codigo.md), [docs/rotas-e-conteudo.md](../docs/rotas-e-conteudo.md), [docs/movimento-e-gsap.md](../docs/movimento-e-gsap.md), [docs/seo-acessibilidade-performance.md](../docs/seo-acessibilidade-performance.md), [docs/qualidade-e-validacao.md](../docs/qualidade-e-validacao.md), [docs/02-conteudo-site-delano-furtado.md](../docs/02-conteudo-site-delano-furtado.md).
- **Perfis de agentes (`agents/`):**
  - [UX/UI Designer](../agents/ux-ui-designer.md), [Frontend Engineer](../agents/frontend-engineer.md), [Accessibility & Performance Engineer](../agents/accessibility-performance-engineer.md), [Motion Engineer](../agents/motion-engineer.md), [SEO & Content Specialist](../agents/seo-content-specialist.md), [QA Engineer](../agents/qa-engineer.md), [Code Reviewer](../agents/code-reviewer.md), [Technical Writer](../agents/technical-writer.md).
