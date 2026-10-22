# Roteiro de implementação

O MVP dos marcos 1–5 foi implementado conforme [plan-001](../plans/plan-001-mvp-landing-page-delano-furtado.md); os checks e limites estão em [mvp-001](evidencias/mvp-001.md). O marco 6, publicação, continua pendente e depende de tarefa própria.

## 1. Fundar a aplicação na raiz existente

**Responsáveis:** Arquitetura e Frontend.

Configurar a stack, lockfile, TypeScript estrito, scripts, teste mínimo de um contrato real, aliases e estilos compartilhados. Preservar documentação e originais. Evitar outra pasta aninhada de aplicação.

**Concluído quando:** scripts locais existem, ambiente é reproduzível e os checks pertinentes passam no Delano.

## 2. Estruturar dados, rotas e identidade

**Responsáveis:** Conteúdo/SEO, UX/UI e Frontend.

Transformar fatos do documento 02 em dados tipados; definir sínteses; criar as três rotas, layout e componentes de marca; usar derivados das imagens preservadas.

**Concluído quando:** contatos e catálogo têm origem única, URLs diretas funcionam e os dados visíveis correspondem à fonte, sem fatos do advogado de referência.

## 3. Compor a landing page e as páginas de apoio

**Responsáveis:** UX/UI e Frontend, com QA.

Implementar o ritmo e os componentes do design usando o conteúdo disponível. Ajustar a grade para os sete blocos; omitir avaliações/etapas/FAQ sem conteúdo próprio; aplicar estados interativos acessíveis.

**Concluído quando:** todas as seções do escopo são legíveis em mobile/desktop, teclado funciona e a inspeção visual foi registrada.

## 4. Acrescentar movimento e integrações necessários

**Responsáveis:** Motion, Frontend, Integrações e Segurança, apenas quando o requisito envolver suas áreas.

Aplicar movimento com fallback/cleanup. Se houver envio solicitado, implementar endpoint e feedback real. Canais oficiais permanecem utilizáveis independentemente dessas evoluções.

**Concluído quando:** cada efeito tem fallback e descarte, e cada integração tem comportamento de erro/sucesso verificável. A ausência de requisito dispensa o respectivo recurso.

## 5. Fechar qualidade e preparar produção

**Responsáveis:** QA, Acessibilidade/Performance, SEO e Revisor.

Validar conteúdo, comportamento, build, HTML por rota, metadados e mídia otimizada. Revisar o resultado frente aos documentos responsáveis, e não apenas ao hero.

**Concluído quando:** evidências e limitações materiais estão registradas; os critérios aplicáveis de qualidade foram atendidos.

## 6. Publicar quando autorizado

**Responsáveis:** DevOps/Release e responsável pelo projeto.

Configurar provedor, domínio, cache, redirecionamentos e rollback. Publicar o artefato revisado conforme o pedido e a autorização disponíveis.

**Concluído quando:** smoke test de produção foi registrado, canais funcionam, as URLs têm resposta correta e existe caminho de restauração.

## Sequenciamento

Escolher os [agentes](../agents/README.md) pelo domínio, sem transformar este roteiro em obrigação de acionar todos. A definição de cada agente descreve entradas, saídas e critério de conclusão. Mudanças de requisito retornam à guideline afetada antes de alterar o restante por suposição.
