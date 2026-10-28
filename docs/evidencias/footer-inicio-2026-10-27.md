# Rolagem de Início no rodapé — 27/10/2026

## Alteração

O link “Início” do rodapé passa de `Link` comum para `SectionLink section="main-content"`. O contrato tipado de `SectionLink` agora aceita esse destino já previsto no resolvedor de navegação. Reutiliza foco e rolagem nativa existentes, sem criar plugin, timer ou listener adicional.

## Verificação

- RED: os três casos novos falharam antes da mudança, pois o rodapé não solicitava a rolagem até `main-content`.
- GREEN: **18 testes em dois arquivos** aprovados (`route-effects.test.tsx` e `prerender.test.tsx`), incluindo retorno da Home e contato, cliques repetidos, URL limpa, foco e movimento reduzido. O cenário de movimento normal foi configurado explicitamente no mock para não depender do cenário anterior de movimento reduzido.
- `npm run lint` e `npm run build:ftp` aprovados; o último inclui a verificação dos quatro HTMLs, CSS/SEO, mídia e catálogo.
- Navegador desktop, 1280 × 720: rolagem no rodapé em `5208px`; após clicar em Início, amostra intermediária em `4169px` e término em `0px`. URL `/`, foco no h1 da Home.
- Navegador móvel, 390 × 844: partir do rodapé de `/contate-nos`, em `648px`; clicar em Início abriu `/`, com amostra intermediária de rolagem em `49px` e término em `0px`. Foco no h1, sem overflow horizontal ou erros no console. Override de viewport restaurado.
- Preferência de movimento reduzido coberta por teste; não foi alterada a preferência do sistema para a conferência visual.

Pacote atualizado: `release-ftp/20261027T192543077Z-55b68db7/site`, 33 arquivos e 2.695.297 bytes. Sem publicação remota.

## Extensão para a logo do cabeçalho

A pedido do usuário, a logo também passa a usar `SectionLink section="main-content"`, preservando o href `/`, a classe e o nome acessível. Os três casos novos falharam antes da alteração e passaram depois: clique pela Home e contato, repetição, foco, URL limpa e preferência de movimento reduzido. Resultado: **21 testes em dois arquivos**, lint e `build:ftp` aprovados.

No navegador desktop, clicar na logo partindo de `5208px` produziu uma amostra intermediária em `4114px` e terminou em `0px`, com foco no h1 e URL sem fragmento; sem erros no console. Novo pacote: `release-ftp/20261027T193136138Z-b3c6e65c/site`, 33 arquivos e 2.695.313 bytes. Sem publicação remota.

![Topo após clicar na logo](capturas/logo-inicio-topo-2026-10-27.png)

## Capturas após o retorno pelo rodapé

![Desktop após clicar em Início](capturas/footer-inicio-topo-2026-10-27.png)

![Celular após sair de contato pelo link Início](capturas/footer-inicio-mobile-2026-10-27.png)
