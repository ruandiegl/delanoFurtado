# Cookies minimalistas — execução do plan-006

Data: **30/10/2026**, fuso America/Sao_Paulo. Implementação local na branch `codex/plan-006-cookies`, a partir de `07e4884`. Alterações documentais anteriores foram preservadas. [Plano e checkboxes](../../plans/plan-006-cookies-consentimento-minimalista-e-integracoes-google.md).

## Resultado

- Faixa escura compacta, três ações, X sem decisão e acesso permanente pelo rodapé.
- Dialog Base UI/shadcn com título/descrição, campos rotulados, rascunho até salvar e retorno de foco. Aceitar e rejeitar têm peso equivalente. Os componentes ausentes foram gerados em projeto temporário; o botão existente ganhou apenas variantes próprias para cookies. Nenhuma dependência foi atualizada.
- Consentimento v2 por finalidade, validade de 180 dias e migração v1 com as datas originais e publicidade negada. SSR estável, expiração, negativa temporária, sincronização e bloqueio síncrono foram preservados.
- GA4 mantém `G-6Z7JD1757Y`, visualizações manuais e eventos fechados de contato. Continua bloqueado antes da escolha e fora da origem canônica. Todos os sinais publicitários permanecem negados; Ads não foi instalado.
- Duas políticas em HTML próprio: `/politica-de-privacidade` e `/politica-de-cookies`, com contatos existentes, inventário conhecido e limites explícitos.
- Cinco rotas públicas e seis documentos HTML, com Router, SEO, prerender, sitemap, preview, pacote FTP, Apache e Netlify coordenados.

## Validação executada

| Check | Resultado |
| --- | --- |
| Baseline limpo | 18 arquivos, 93 testes aprovados |
| Testes de armazenamento novos | RED: 5 falhas por ausência do modelo/migração; GREEN após implementação |
| Políticas por URL/HTML | RED: 3 falhas por 404; GREEN após registrar páginas, conteúdo e SEO |
| Interface nova | RED: 4 falhas por ausência dos controles; GREEN após implementação |
| Privacidade do transporte | RED da configuração de redação/passthrough; GREEN com parâmetros explícitos |
| Revisão independente | Uma falha importante de revogação sob erro de escrita identificada e reproduzida; corrigida e coberta por testes |
| Regressões de foco | RED → GREEN para retorno após remoção do banner, rascunho após recusa sem gravação e foco encoberto |
| `npm.cmd run test:run` | **22 arquivos, 121 testes aprovados** |
| `npm.cmd run lint` | Aprovado |
| `npm.cmd run build:ftp` | Typecheck, build cliente/servidor, seis HTMLs, verify:build e empacotamento aprovados |
| `npm.cmd run verify:preview -- http://127.0.0.1:4174` | **17 documentos e 5 redirects aprovados**, com 404 real e HTML/metadados antes do JavaScript |
| Inventário do pacote | 37 arquivos, tamanho e SHA-256 de todos conferidos; nenhum arquivo extra ou privado |
| Documentação | 146 links locais conferidos, nenhum quebrado; `git diff --check` sem erro |
| Segredos | Gitleaks local nos 206 arquivos de texto candidatos, com redação total e sem supressões por comentário: nenhum achado |

A primeira tentativa de baseline incluiu cópias dos testes deixadas nos snapshots ignorados da auditoria de segredos, além das restrições de conexões locais/junction do ambiente. Somente os diretórios temporários `working-snapshot` e `final-snapshot` daquela auditoria foram removidos; a suíte original foi repetida com acesso local permitido e passou. Durante a validação final, o typecheck identificou a opção `exact` não suportada por uma consulta Testing Library; a opção redundante foi retirada e o build completo foi repetido com sucesso.

## Revisão e correções

A revisão independente encontrou o cenário: autorização antiga salva, falha de escrita da nova recusa e falha do fallback. O reload da revogação poderia restaurar o aceite antigo. Agora a store tenta remover registros antigos, mantém a negativa em memória e chama a revogação sem reload quando a nova escolha não pôde ser persistida. O cliente bloqueia novos eventos, invalida fila/tag e limpa os `_ga` acessíveis. O diálogo informa que a escolha vale nesta visita e orienta a exclusão de dados antigos quando o navegador impedir toda gravação/remoção. Não se promete persistência impossível em ambiente completamente bloqueado.

O retorno de foco usa o `finalFocus` do primitive: acionador original quando conectado, controle permanente quando a faixa desaparece. A inspeção real no celular reproduziu “Entre em contato” do rodapé totalmente encoberto pela faixa; agora a faixa se dispensa se encobrir por completo um alvo de teclado, sem gravar consentimento. A hit-test evita dispensá-la por um controle do modal acima dela. Também foi ampliado o espaço inferior do rodapé em telas menores para o WhatsApp não impedir clique nas preferências.

## Navegador e capturas

BrowserOS neo não tinha ferramenta conectada. A inspeção usou o IAB, com origem local bloqueada para coleta real. Foram conferidos banner e diálogo, switches, Escape sem salvar, retorno de foco, aceitar/rejeitar e reabertura com a escolha salva. A política foi aberta a partir do diálogo e recarregada por URL direta; título e H1 próprios presentes, sem erros de console. Nenhum contato ou mensagem real foi enviado.

| Tela | Resultado observado |
| --- | --- |
| 1440×900 | Faixa de 560×154px, três ações em linha, sem overflow |
| 375×812 | Faixa de aproximadamente 328×227px; preferências acima de aceitar/rejeitar; WhatsApp separado |
| 320×568 | Faixa de aproximadamente 273×247px, sem overflow horizontal |
| 768×1024 | Layout desktop da faixa, sem overflow |
| 812×375 | Faixa acessível em paisagem; conteúdo do diálogo rolável |

Contraste calculado dos tokens: texto secundário da faixa **11,55:1**, ações **16,76:1**, switch desligado sobre branco **6,03:1**. Isso não constitui uma auditoria completa de acessibilidade. Zoom real de 200%, badge do Netlify e simulação de movimento reduzido no navegador não foram executados nesta rodada; o layout permite reflow/rolagem e o modal utiliza variante de movimento reduzido.

- [Desktop](capturas/cookies-006-desktop.png)
- [Mobile](capturas/cookies-006-mobile.png)
- [Preferências desktop](capturas/cookies-006-preferencias-desktop.png)
- [Preferências mobile](capturas/cookies-006-preferencias-mobile.png)
- [Paisagem](capturas/cookies-006-paisagem.png)
- [Foco liberado no rodapé](capturas/cookies-006-foco-rodape.png)
- [Política por URL direta](capturas/cookies-006-politica-mobile.png)

Na origem local, a ausência de tag Google foi observada antes/depois das escolhas, como esperado pelo bloqueio de origem. Os testes de integração usam o cliente real com transporte controlado para exercitar coleta autorizada, uma instalação, um evento por ação, navegação, erro, revogação e limpeza de cookies. **Isso não substitui uma inspeção da rede/cookies do SDK real no domínio após publicação.**

## Ads e galeria legada

**ADS-01 permanece condicionado.** Conhecer `AW-622649331` não identifica origem, evento, rótulo ou ação principal. Não foi criado runtime compartilhado ou categoria publicitária fictícia; `capabilities.advertising` permanece `false`. Campanhas e contas não foram modificadas.

A [inspeção DOM da galeria](cookies-006-legado.json) em 30/10 encontrou tags `UA-199542592-1` e `G-6Z7JD1757Y`, além de nenhum controle da aplicação nova. A superfície do navegador não disponibilizou o transporte e os cookies para essa inspeção; não se afirma aqui quais eventos chegaram ao Google. `/galeria` e `/galeria.html` continuam fora do controle React. Tratar essa aplicação separadamente antes de declarar cobertura de todo o domínio, preservando suas URLs e conteúdo.

## Pacote pronto para revisão e FTP

**Pasta a enviar:** `release-ftp/20261030T184845712Z-08a8f716/site`.

**Inventário:** 37 arquivos, **2.820.115 bytes**, seis HTMLs; manifesto SHA-256 fora da pasta de upload. Contém as duas políticas, sitemap atualizado, favicons, verificação pública Search Console e os dois `.htaccess`.

Revisar o conteúdo das políticas com o responsável pelo escritório. Fazer backup remoto e enviar **o conteúdo da pasta `site`**: recursos/diretórios primeiro, HTMLs depois, `index.html` por último. Preservar `.well-known`, configurações do provedor e os arquivos legados. [Guia e restauração](../publicacao-hostgator-filezilla.md#publicação-do-plan-006).

Não houve commit, push, envio FTP, alteração de contas ou publicação nesta execução. Após o envio, conferir Apache/aliases no domínio e repetir a matriz de rede com SDK real. A prévia Vite não executa `.htaccess`; o pacote local não comprova configuração do servidor remoto. Os releases anteriores foram preservados.


## Ajuste visual solicitado após a execução

Em 30/10/2026, o usuário solicitou reduzir um pouco a faixa e movê-la para o lado direito. A largura máxima passou de 560 para 480px, o padding de 16 para 14px e o texto para 12,5px. A faixa está alinhada à direita, a 90px da base (mais safe area), preservando separação do WhatsApp e alvos de toque de 44px. O diálogo e a lógica de consentimento foram preservados.

Lint, build FTP e os sete testes de preferências passaram. Inspeção IAB: desktop 1440×900 com faixa 480×144px e distância vertical de 14px para o WhatsApp; mobile 375×812 com faixa 328×215px, sem overflow ou sobreposição. As medidas da seção anterior registram a primeira execução; estas as substituem para a faixa atual.

- [Faixa menor à direita — desktop](capturas/cookies-006-direita-desktop.png)
- [Faixa menor — mobile](capturas/cookies-006-direita-mobile.png)

Novo pacote: `release-ftp/20261030T184845712Z-08a8f716/site`, 37 arquivos e 2.820.115 bytes, com tamanho/SHA-256 de todos conferidos. Nenhum upload ou commit nesta alteração.
