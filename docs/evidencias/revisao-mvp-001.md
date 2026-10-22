# Revisão independente — MVP 001

Revisão somente leitura por um agente independente em 22/10/2026, contra o plano, fontes e guidelines. Sem Git, o escopo foi o conjunto atual de aplicação, configuração, scripts e documentação. Nenhum achado crítico ou menor foi relatado; três achados importantes/P2 foram reproduzidos no Chromium.

| Achado | Correção | Evidência |
| --- | --- | --- |
| Selecionar a mesma âncora novamente não rolava | RouteEffects reage à chave da navegação, além de pathname/hash | Teste falhou antes e passou depois; navegador: 825 → 2265 → 825 |
| Voltar perdia a posição de leitura | Posições por entrada, distinção POP/PUSH, captura síncrona na saída e restauração sem novo foco | Teste RED→GREEN, incluindo evento de scroll pendente; clique direto no header e Voltar: 2144 → 2144 |
| Maiúsculas divergiam entre Router, SEO e servidor | Routes sensíveis a maiúsculas, coerentes com o manifest | Teste RED→GREEN; `/LOCALIZACAO` devolve 404 com h1/title de não encontrado e noindex |

A inspeção própria encontrou ainda um erro no preview: o fallback SPA do Vite entregava Home em `/localizacao` e `/contate-nos`. O middleware agora serve o HTML exato das rotas e redireciona aliases index.html. O verificador HTTP foi observado falhando no servidor antigo e passando depois: sete documentos e três redirects. A hidratação passou nas três rotas; o console final não contém erros React/hidratação.

Não foi solicitada uma segunda revisão: as correções foram verificadas com testes de regressão, suíte completa e navegador. Resultado do gate final: **32 testes, lint limpo, build e verify:build aprovados**. Ver [mvp-001](mvp-001.md) e [navegação/console final](navegacao-e-console.json).

## Itens considerados e delimitados

| Item que o revisor delimitou | Decisão e custo |
| --- | --- |
| Publicação, DNS, HTTPS, headers e regras do provedor | Continuam fora do MVP local; exigem validação em tarefa de publicação |
| URLs desconhecidas com extensão | Preview foi ampliado para tratá-las como 404; provedor ainda precisa aplicar o contrato |
| Router 7 e dois avisos moderados | Manter a stack aprovada, sem destinos de usuário/Data Mode; migração/reavaliação necessária se o fluxo mudar |
| Dispatcher compartilhado GSAP | Manter o recurso da biblioteca e descartar contextos locais; não interferir em outras raízes |
| Backend, formulário, FAQ, depoimentos e novas áreas | Continuam excluídos; dependem de fonte ou requisito próprio |
| Capturas, logs e checkboxes pendentes durante a revisão | Foram concluídos depois das correções; não foram usados como prova antes de existir |
| Métricas de campo e certificação WCAG integral | Não inferir da amostra local; auditoria de dispositivo/produção permanece separada |

A pasta permanece sem Git e sem publicação. O registro cronológico em `.superpowers/sdd/plan-001-mvp-landing-page-delano-furtado/` foi preservado, pois não existe histórico Git que o substitua.
