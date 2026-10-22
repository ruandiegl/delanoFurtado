# Qualidade e validação

## Estado e regra de evidência

O projeto possui scripts e suíte próprios. A execução do MVP e seus limites estão em [mvp-001](evidencias/mvp-001.md). Não declarar checks aprovados apenas por estarem documentados ou por passarem em caldeiraria; validar a alteração real no Delano.

Além de test:run/lint/build/verify:build, `npm run verify:preview` confere o HTML inicial e status de onze URLs mais três redirects, incluindo variações de caixa nas páginas conhecidas. Usa uma prévia na porta 4173 por padrão e aceita outra origem como argumento, inclusive a URL pública do Netlify. Isso detecta fallback que só parece correto depois de o JavaScript substituir a página. Testes de hidratação defendem os aliases de documento atendidos diretamente pelo CDN.

## Matriz por mudança

| Mudança | Verificação necessária |
| --- | --- |
| Markdown e agentes | Links locais, índices, consistência entre estado real e planejado, fontes e ausência de placeholders indevidos |
| Texto/dados institucionais | Origem factual, campos tipados, destinos, acentuação e renderização afetada |
| Componente de comportamento | Teste do contrato visível ao usuário, lint, build e interação manual |
| Layout/estilo | Lint/build e inspeção visual nas larguras afetadas; testes adicionais só se houver comportamento |
| Rota ou SEO | Navegação interna, URL direta, refresh, HTML/metadados e fallback |
| Formulário real | Validação, sucesso real, erro, timeout, duplicidade e uso de destinatário de teste |
| Movimento | Cleanup, `StrictMode`, mudança de rota, movimento reduzido e inspeção de performance |
| Release | Checks de produção e smoke test de [Deploy](deploy-e-operacao.md) |

Não criar testes que apenas repitam CSS, comparem a implementação com ela mesma ou cubram cada troca de texto estático. O teste deve defender um contrato que possa falhar de forma relevante.

## Comandos após inicialização

```text
npm run test:run
npm run lint
npm run build
```

Executar a suíte pertinente e os checks exigidos pela mudança. Testes existentes precisam continuar passando; quando houver falha, separar causa nova de problema anterior com evidência. Não repetir toda a validação sem nova alteração, falha ou preocupação que justifique a repetição.

## Contratos que merecem testes

- Link de contato aponta para o número/destino oficial com codificação correta.
- Menu abre, fecha, responde a teclado e mantém foco.
- Conteúdo opcional indisponível não gera depoimento ou seção vazia.
- Rotas válidas renderizam conteúdo esperado e URLs desconhecidas seguem o contrato.
- Accordion, se houver conteúdo próprio, expõe estado e controle acessíveis.
- Motor de movimento descarta seus efeitos sem afetar outros consumidores.
- Integração distingue confirmação, erro e timeout; feedback não é antecipado.

Vitest/Testing Library/jsdom formam a base planejada. Testes E2E são condicionais ao fluxo e à necessidade; não há Playwright instalado ou pipeline E2E configurado por esta documentação.

## Inspeção de interface

Verificar desktop, tablet e mobile, inclusive conteúdo longo e telas estreitas. Abrir a URL diretamente, navegar entre páginas, testar voltar/avançar, teclado, foco, zoom e movimento reduzido. Conferir ausência de overflow horizontal, mídia quebrada, console com erro e botão flutuante cobrindo conteúdo.

Para alterações visuais, produzir capturas úteis ao revisor das rotas afetadas. Uma captura bonita do hero não substitui a revisão das demais seções.

## Conteúdo e release

Conferir o documento 02 contra os dados que irão ao ar. Preservar todos os serviços do escopo e omitir afirmações sem origem. Conteúdo e respostas de contato não podem herdar garantias de outro advogado ou de uma simulação de caldeiraria.

Os critérios de SEO/a11y/performance têm fonte única no [documento dedicado](seo-acessibilidade-performance.md). A publicação só pode afirmar cumprimento dos checks efetivamente executados e registrar limitações concretas.

## Formato de evidência

Registrar objetivo, arquivos/rotas afetados, comandos e resultado, interações conferidas, capturas quando aplicáveis e pendências materiais. Em trabalho exclusivamente documental, informar essa natureza; não iniciar o aplicativo de referência para simular uma validação do Delano.
