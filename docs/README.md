# Documentação do projeto — Delano Furtado

Atualização: **27 de outubro de 2026**. Este é o índice principal das guidelines, decisões e padrões do projeto.

## Identificação e estado

| Item | Definição |
| --- | --- |
| Produto | Site institucional e landing page de Delano Furtado |
| Tipo | **WEB**, responsivo, em português do Brasil |
| Stack definida para implementação | React 19, TypeScript 6, Vite 8, React Router 6 e styled-components 6 |
| UI e movimento | shadcn/ui com Base UI e Tailwind 4 para primitives; GSAP 3 e `@gsap/react` quando houver movimento necessário |
| Qualidade | ESLint, Vitest, Testing Library e jsdom |
| Gerenciador | npm 11.21.1, com `package-lock.json` próprio |
| Estado real desta pasta | MVP implementado, HTML por rota, scroll GSAP e testes; [evidências](evidencias/mvp-001.md) |
| Backend, banco e autenticação | Ausentes do MVP; nenhuma integração de envio configurada. Área administrativa e CMS planejados no [plan-004](../plans/plan-004-area-administrativa-gestao-conteudo-e-secoes.md), sem implementação iniciada |
| Publicação | [Netlify temporário para homologação](https://delano-furtado.netlify.app/), deploy automático de `main`; destino final confirmado: mesmo domínio na HostGator/cPanel via FileZilla. [Pacote local e guia FTP](publicacao-hostgator-filezilla.md) preparados, publicação pendente; [ordem de lançamento e GA4](deploy-e-operacao.md#ordem-de-lançamento-e-analytics) |

A stack foi definida a partir do código dos projetos de caldeiraria, conforme a [auditoria de referência](03-auditoria-referencia-caldeiraria.md). Uma decisão documentada não significa que a dependência esteja instalada neste projeto. Consulte [Stack e decisões técnicas](stack-e-decisoes-tecnicas.md) para as versões observadas e adaptações.

## Objetivo e fontes

O novo site combina **a linguagem de frontend da referência do Behance** com **os textos e materiais do Delano Furtado**. A referência não fornece dados profissionais, avaliações ou promessas para o novo site. Os padrões de engenharia vêm de caldeiraria; a identidade industrial não será transportada.

| Fonte | Uso |
| --- | --- |
| [01 — Referência de design](01-referencia-design-advocacia.md) | Composição, paleta aproximada, componentes, fotografias e ritmo das seções |
| [02 — Conteúdo do site atual](02-conteudo-site-delano-furtado.md) | Textos publicados, formação, serviços, contatos, links, metadados e inventário visual |
| [03 — Auditoria de caldeiraria](03-auditoria-referencia-caldeiraria.md) | Evidências da stack, configurações, skills e diferenças entre as duas cópias locais |
| [Imagens originais](assets/delano-furtado/) e [manifesto](assets/delano-furtado/manifesto.json) | Arquivos preservados, origem, dimensões e integridade |

## Índice de guidelines

| Documento | Quando consultar |
| --- | --- |
| [Visão geral e escopo](visao-geral.md) | Para entender o produto, o que existe e o que será desenvolvido |
| [Stack e decisões técnicas](stack-e-decisoes-tecnicas.md) | Para escolher dependências e distinguir herança, adaptação e recursos condicionais |
| [Desenvolvimento local](desenvolvimento.md) | Para instalar, executar, testar e gerar o frontend |
| [Arquitetura](arquitetura.md) | Para localizar responsabilidades, contratos e fluxo de dados planejados |
| [Padrões de código](padroes-de-codigo.md) | Antes de implementar componentes, estilos, dados ou comportamento |
| [Design system e mídia](design-system.md) | Antes de alterar identidade visual, layout, componentes ou imagens |
| [Rotas e conteúdo](rotas-e-conteudo.md) | Para manter URLs, seções, conteúdo factual e rastreabilidade editorial |
| [shadcn/ui](shadcn-ui.md) | Ao inicializar ou alterar primitives, tokens, aliases e preset Base UI |
| [Movimento e GSAP](movimento-e-gsap.md) | Ao acrescentar animações, ScrollTrigger ou transições |
| [Integrações e formulários](integracoes-e-formularios.md) | Para WhatsApp, contato, mapa e eventual envio por servidor |
| [Segurança e privacidade](seguranca-e-privacidade.md) | Para dados pessoais, segredos, terceiros e integrações |
| [SEO, acessibilidade e performance](seo-acessibilidade-performance.md) | Para indexação, navegação assistiva, carregamento e metadados |
| [Referências de SEO e busca por IA](referencias-seo-busca-ia.md) | Fontes primárias de crawlers, dados estruturados e limites de llms.txt consultadas para o plan-003 |
| [Referências de migração Google](referencias-migracao-google-analytics-ads.md) | Continuidade de GA4/Ads, tags UA conectadas, conversões e parâmetros de campanha; [auditoria da cópia antiga](evidencias/auditoria-site-antigo-2026-10-27.json) e [plan-005 de migração/FTP](../plans/plan-005-migracao-google-e-publicacao-ftp.md) |
| [Qualidade e validação](qualidade-e-validacao.md) | Para critérios de conclusão e evidências antes da entrega |
| [Skills e fluxo de IA](skills-e-fluxo-de-ia.md) | Para selecionar habilidades, agentes e o contexto de cada tarefa |
| [Git e contribuição](git-e-contribuicao.md) | Para branches, commits, revisões e manutenção conjunta de código/docs |
| [Deploy e operação](deploy-e-operacao.md) | Para build, hospedagem, URLs diretas, publicação e rollback |
| [Publicação HostGator/FileZilla](publicacao-hostgator-filezilla.md) | Gerar o pacote FTP, localizar a pasta do domínio, fazer backup, enviar e testar; [evidências locais](evidencias/ftp-hostgator-2026-10-27.md) |
| [Solução de problemas](solucao-de-problemas.md) | Para diagnosticar ambiente, rotas, estilos, animações e contato |
| [Decisões e pendências](decisoes-e-pendencias.md) | Para conhecer escolhas registradas e decisões futuras com seus impactos |
| [Roteiro de implementação](roteiro-de-implementacao.md) | Para consultar os marcos do MVP e sua evolução |
| [Evidências do MVP](evidencias/mvp-001.md) | Resultados dos checks, navegador, capturas e limitações |
| [Cascata nas áreas de atuação](evidencias/motion-areas-002.md) | Expansão suave dos serviços, interrupções e movimento reduzido |
| [Navegação sem fragmentos](evidencias/navegacao-sem-fragmentos-2026-10-26.md) | Links de seção com URL limpa, foco, histórico, compatibilidade e validação em 26/10/2026 |
| [Teste do retrato sem fundo](evidencias/retrato-sobre-sem-fundo-2026-10-27.md) | Recorte da foto fornecida, integração na seção Conheça o advogado, origem e reversão |
| [Publicação no Netlify](evidencias/release-003.md) | Remoto, validação e resultado real da publicação |
| [Planos detalhados](../plans/README.md) | MVP (plan-001), redesign da Hero (plan-002), [SEO/Analytics/IA (plan-003)](../plans/plan-003-seo-previas-sociais-analytics-e-descoberta-ia.md) e [área administrativa/CMS (plan-004)](../plans/plan-004-area-administrativa-gestao-conteudo-e-secoes.md), com tarefas, contratos e aceite |
| [Agentes de IA](../agents/README.md) | Para escolher a função de desenvolvimento adequada à tarefa |

## Por onde começar

1. Leia a visão geral e os documentos 01, 02 e 03.
2. Consulte a stack e a arquitetura antes da primeira implementação.
3. Para uma alteração, leia somente as guidelines do domínio afetado e escolha o agente correspondente.
4. Verifique os scripts atuais em `package.json` e siga o setup de desenvolvimento; as versões históricas de caldeiraria não substituem o lockfile local.
5. Registre evidências de validação e atualize os documentos cuja decisão mudou.

## Fonte de verdade

- **Dados públicos e mídia:** documento 02 e manifesto dos arquivos. Texto novo precisa distinguir informação confirmada de rascunho editorial.
- **Referência visual:** documento 01; os valores estimados não são medidas exatas do design original.
- **Decisões para o novo projeto:** guidelines desta pasta e registro de decisões.
- **Estado implementado, quando existir:** código, configurações, scripts e lockfile. Uma divergência com a decisão documentada deve ser explicitada e corrigida na mudança correspondente.

Cada regra tem um documento responsável. Os agentes apontam para essas regras, evitando manter cópias concorrentes. As instruções do usuário e do ambiente prevalecem sobre os roteiros locais.
