# Botões de WhatsApp — 27/10/2026

## Pedido e implementação

- O botão flutuante usa fundo `#25D366`, símbolo branco e hover `#1EBE5D`, definidos nos tokens de cor.
- `ContactCta` reutiliza `WhatsAppIcon` nos CTAs diretos de WhatsApp. A exceção usa `location="header"`: “Fale comigo” conserva a seta no cabeçalho e no menu mobile.
- Textos, destinos, eventos de analytics, fundos dos demais CTAs e links internos foram preservados.
- Alterações em `src/components/brand/ContactCta.tsx`, `src/components/SiteLayout/index.tsx`, `src/styles/tokens.css` e na guideline de [design](../design-system.md).

## Validação executada

- `npm.cmd run lint`: aprovado.
- `npm.cmd run test:run -- src/test/analytics-integration.test.tsx src/test/contact-routes.test.tsx src/test/prerender.test.tsx`: **12 testes em 3 arquivos aprovados**, incluindo clique no SVG do CTA com evento único de WhatsApp.
- `npm.cmd run build:ftp`: aprovado; TypeScript, build client/server, pré-renderização e verificação dos quatro HTMLs.
- Prévia local em `http://127.0.0.1:4174/`: Home desktop e mobile 375×812, menu mobile aberto, `/contate-nos` e `/localizacao` conferidos. CTAs com símbolo de WhatsApp; seta preservada nos dois menus. Fundo computado do flutuante `rgb(37, 211, 102)`, área de 54×54 px e nenhuma rolagem horizontal nas telas inspecionadas. Nenhum erro de console na sessão de inspeção.
- Capturas: [desktop](capturas/whatsapp-desktop-2026-10-27.png) e [mobile](capturas/whatsapp-mobile-2026-10-27.png).

## Pacote para envio

`release-ftp/20261028T010256584Z-82beb66a/site`: **35 arquivos, 2.729.512 bytes**. O nome da pasta usa UTC. Enviar o conteúdo desta pasta conforme o [guia FTP](../publicacao-hostgator-filezilla.md), incluindo `.htaccess`, com `index.html` por último.

Este registro comprova a alteração e a validação locais. O envio à hospedagem não foi realizado nesta tarefa.
