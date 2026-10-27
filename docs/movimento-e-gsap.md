# Movimento e GSAP

## Objetivo e estado

O Behance inspecionado contém imagens estáticas; nenhuma animação foi confirmada ali. O usuário solicitou scroll GSAP para este MVP, agora implementado com GSAP 3.15.0, @gsap/react 2.1.2 e ScrollTrigger, preservando leitura e rolagem nativa.

## Escolha do recurso

Usar CSS para hover, foco e transições simples. Usar GSAP para sequências ou comportamento coordenado que justifique um motor. ScrollTrigger entra apenas quando o requisito depende da posição de rolagem. O percurso ilustrado de atendimento pode ser um SVG estático; seu desenho não implica animação.

Não herdar automaticamente o cabeçalho liquid glass, suas medidas ou animações industriais de caldeiraria.

## Organização prevista

| Local | Responsabilidade |
| --- | --- |
| `src/motion/gsap.ts` | Importação e registro único dos plugins efetivamente usados |
| `src/motion/siteMotion.ts` | Funções que recebem elementos e devolvem cleanup |
| Hook próximo do consumidor | Conectar refs, preferências e ciclo de vida React |
| Componente de seção/layout | Oferecer escopo e elementos; manter conteúdo funcional |

Usar `@gsap/react`/`useGSAP` com scope local. Uma função de descarte desfaz somente o que a instância criou; evitar matar triggers de outras seções ou rotas.

## Contrato de acessibilidade

- A informação já deve estar visível e compreensível sem animação.
- `prefers-reduced-motion` reduz ou remove deslocamentos, duração e efeitos de rolagem.
- Conteúdo e foco continuam acessíveis durante e depois da transição.
- Nenhum carrossel começa em autoplay por herança da referência.
- Transform e opacity são preferíveis quando atendem ao efeito; blur, filtros e leituras de layout por frame exigem medição.
- A rolagem permanece nativa, salvo requisito específico documentado.

## Ciclo de vida

Conferir `StrictMode`, mudança de rota, resize e desmontagem. Reconstruir apenas efeitos cujo escopo foi alterado. Usar refs/seletores restritos, sem buscas globais por classes de outras páginas. Não atualizar estado React a cada evento de scroll para um efeito que pode ser controlado fora da renderização.

## Skills

O catálogo de [Skills e fluxo de IA](skills-e-fluxo-de-ia.md) explica quando consultar `gsap-core`, `gsap-react`, `gsap-scrolltrigger`, `gsap-timeline` e as demais habilidades encontradas na referência. Elas não são consideradas instaladas localmente no Delano apenas por aparecerem neste documento.

## Aceite

Para cada efeito, registrar elemento, gatilho, duração, fallback e cleanup. Verificar mobile/desktop, movimento reduzido, troca de rota e ausência de efeitos duplicados. Testar o contrato de montagem/desmontagem quando houver lógica; uma animação visual exige também inspeção no navegador.

## Implementação do movimento no MVP

- src/motion/gsap.ts registra plugins uma única vez no cliente.
- usePageMotion utiliza useGSAP com scope no main, pathname como dependência e revertOnUpdate.
- matchMedia diferencia desktop e movimento reduzido; neste último nenhum tween/trigger é criado.
- siteMotion recebe apenas a raiz, usa transform e opacity mínima 0,65 somente em cabeçalhos não interativos; controles permanecem visíveis.
- Focusin termina o tween do bloco focado. Imagens, fontes e details solicitam refresh coordenado com `ScrollTrigger.refresh(true)`, para aguardar o momento seguro e não interromper a rolagem até uma seção. Listeners e frame são removidos/cancelados no descarte. A correção e sua verificação estão em [Navegação sem fragmentos](evidencias/navegacao-sem-fragmentos-2026-10-26.md).
- mm.revert elimina os contextos locais. GSAP mantém um dispatcher de media compartilhado, que não pertence à instância; não o remover globalmente.

Testes cobrem outra raiz intacta, teardown idempotente, foco, callback tardio, StrictMode, mudança de preferência e navegação repetida. O navegador conferiu o scroll real; os limites da ferramenta para emular preferência do sistema constam em [mvp-001](evidencias/mvp-001.md).

## Cascata nas áreas de atuação

`ServiceDisclosure` mantém `details`/`summary` nativos e conecta `useDisclosureMotion` por uma ref local. A melhoria também atende à assessoria mensal. Todos os textos continuam no HTML inicial e a abertura funciona sem JavaScript.

- **Gatilho:** ativação do resumo por clique ou teclado.
- **Painel:** altura animada em 0,42 s para abrir e 0,26 s para fechar, com `power2.inOut`. A altura é uma exceção intencional à preferência por transform, pois o conteúdo precisa deslocar o fluxo da página. A medição ocorre na interação, nunca a cada frame.
- **Itens:** entrada de 8 px e opacidade de 0,45 até 1, em 0,32 s. A cascata usa intervalo de 0,035 s, com atraso total limitado a 0,28 s para listas extensas.
- **Interrupções:** cliques sucessivos partem da altura atual; resize ou foco dentro do painel concluem o estado solicitado. Ao terminar, alturas e estilos temporários são removidos.
- **Acessibilidade:** movimento reduzido conserva a alternância nativa imediata. O foco permanece no controle; o painel só recebe `open=false` ao terminar o fechamento.
- **Ciclo de vida:** `useGSAP`, contexto local e `matchMedia` descartam timelines e listeners na desmontagem ou mudança da preferência. O evento `disclosure-settled` solicita o refresh coordenado de ScrollTrigger após a mudança de altura.

Evidências e cenários: [validação da cascata](evidencias/motion-areas-002.md).
