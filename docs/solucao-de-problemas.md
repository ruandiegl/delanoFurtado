# Solução de problemas

O frontend está implementado. Este guia reúne os diagnósticos de manutenção; os resultados e decisões da primeira execução estão em [mvp-001](evidencias/mvp-001.md).

| Sintoma | Verificar primeiro | Evidência para concluir |
| --- | --- | --- |
| npm informa ausência de package.json/script | Raiz correta e estágio da implementação | Manifest local e script efetivamente presentes |
| Instalação incompatível | Runtime, engines e lockfile; não copiar node_modules | Instalação limpa compatível com o conjunto registrado |
| Página funciona pelo menu, mas falha ao recarregar | HTML por rota, regras do provedor e fallback | URL direta e refresh nas três rotas de produção |
| URL inválida parece a Home | Catch-all do cliente e resposta do servidor | Tela e status HTTP condizentes com a estratégia |
| Alias @/ não resolve | Configuração conjunta do Vite e TypeScript | Import resolvido no editor e no build |
| Erro de tipos do Router | Versões de Router e pacotes @types herdados | Tipos compatíveis sem contornar com any |
| Botões/fontes mudam após Tailwind | Ordem dos imports, reset e token duplicado | Primitives e estilos de marca coerentes em todas as rotas |
| Trigger shadcn tem API incompatível | Base UI versus Radix e documentação do componente | Base e composição confirmadas no components.json |
| Efeito executa duas vezes ou persiste ao navegar | StrictMode, scope, cleanup e dependências | Montagem/desmontagem e navegação sem efeitos órfãos |
| Conteúdo some com movimento reduzido | Estado visual inicial e fallback do efeito | Informação visível e controles acessíveis sem animação |
| Contato diz sucesso, mas mensagem não chega | Request real, resposta do endpoint e significado do retorno | Evidência de teste no serviço, sem antecipar entrega final |
| Logo aparece com fundo ou qualidade ruim | Original transparente versus arte social/derivado | Arquivo correto e escala adequada |
| SEO/social mostra título genérico | HTML servido diretamente e cache externo | Metadados específicos no HTML da URL |
| LCP/CLS ruim | Imagem principal, dimensões reservadas e fontes | Medição comparável após ajuste, no build de produção |

## Ciclo de diagnóstico

1. Registrar o comportamento esperado, o observado e como reproduzir.
2. Inspecionar o ponto onde o contrato falha, usando arquivos atuais e uma evidência concreta.
3. Formular uma hipótese e realizar a menor verificação capaz de distingui-la.
4. Corrigir a causa e validar o comportamento afetado.
5. Registrar a evidência e atualizar a guideline quando houver uma decisão nova.

Para falhas difíceis, usar a habilidade de diagnóstico disponível na sessão e o agente correspondente. Não alterar várias camadas ao mesmo tempo para mascarar uma causa ainda desconhecida.

## Dados para um handoff

Informar rota, viewport, navegador, sequência, mensagens relevantes, arquivos e checks já executados. Capturas e logs precisam omitir dados privados de contato ou credenciais.

Consultar [Qualidade](qualidade-e-validacao.md) para a validação da correção e [Deploy](deploy-e-operacao.md) para problemas exclusivos de produção.
