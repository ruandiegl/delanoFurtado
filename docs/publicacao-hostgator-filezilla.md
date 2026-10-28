# Publicação na HostGator pelo FileZilla

Destino confirmado pelo usuário em **27/10/2026**: substituir o site em `https://www.delanofurtado.adv.br`, na HostGator/cPanel, usando FileZilla. O pacote é estático: Node e npm são usados no computador/CI, sem processo Node na hospedagem. Nenhum arquivo remoto foi alterado nesta preparação.

## Gerar uma versão

Com o ambiente de [desenvolvimento](desenvolvimento.md) instalado, executar:

```text
npm run test:run
npm run lint
npm run build:ftp
```

O último comando gera o site, verifica o build e cria uma pasta nova em `release-ftp/<versão>/`. A saída informa `siteDirectory`, a pasta a usar no FileZilla. Cada geração preserva as versões anteriores e valida o domínio, sitemap, robots e arquivos permitidos. Não há conexão FTP automática.

```text
release-ftp/<versão>/
  site/                 conteúdo a enviar
    .htaccess
    favicon.ico
    index.html
    localizacao/index.html
    contate-nos/index.html
    404.html
    robots.txt
    sitemap.xml
    assets/             inclui .htaccess de cache dos arquivos com hash
    media/
  manifest.json         inventário SHA-256; guardar localmente
  LEIA-ME.md            orientação resumida; guardar localmente
```

Enviar **o conteúdo de `site/`**, incluindo os dois `.htaccess`. Não enviar a pasta `site`, `dist`, o repositório, `node_modules`, `.prerender`, docs, manifesto do release ou credenciais para a raiz pública. O `dist/` original não é modificado pelo empacotador; a meta pública de verificação Search Console é preservada na Home do pacote de produção.

Atualização de 27/10/2026: o pacote `20261027T234714203Z-6c91610f` inclui o ajuste de rodapé e `DirectorySlash Off` no `.htaccess`. A configuração evita que o Apache acrescente barra aos diretórios das duas páginas, com listagem desativada e HTMLs resolvidos por regras explícitas. URLs com barra continuam atendidas, sem redirect inverso. Esse ajuste exige envio do novo `.htaccess`, além dos HTMLs/assets; [checks locais e pendência de validação no servidor](evidencias/urls-footer-2026-10-27.md).

Atualização posterior: o pacote `20261028T005424408Z-6126b027` inclui [GA4/consentimento](analytics-e-consentimento.md) e os [favicons da marca](evidencias/favicon-marca-2026-10-27.md), totalizando 35 arquivos. Enviar também `favicon.ico` da raiz e os PNGs de `media/`; enviar apenas as imagens não atualiza a referência do head nos HTMLs. O prefixo de data do pacote usa UTC; esta alteração foi registrada em 27/10 no fuso do responsável.

Pacote mais recente: `20261028T010256584Z-82beb66a`, com os [botões de WhatsApp atualizados](evidencias/whatsapp-botoes-2026-10-27.md), GA4/consentimento e favicons. Conferência de integridade antes do envio: 35 arquivos e 2.729.512 bytes, todos correspondentes ao manifesto SHA-256. Envio à hospedagem ainda não executado pelo agente.

## Preparar a troca

1. No cPanel, conferir a **raiz do documento** do domínio. Para domínio principal costuma ser `public_html`; domínios adicionais podem usar outra pasta. No FileZilla, a conta FTP pode já abrir nessa raiz. [Orientação HostGator](https://suporte.hostgator.com.br/hc/pt-br/articles/30817062131091-Como-enviar-arquivos-para-a-hospedagem-com-o-FileZilla).
2. Baixar uma cópia de segurança completa dos arquivos remotos, inclusive ocultos, e guardar fora da pasta pública. Confirmar que os arquivos foram baixados antes de substituir qualquer item.
3. Preservar `.well-known`, arquivos de validação de certificado e configurações geridas pelo provedor. Não apagar a raiz da hospedagem ou diretórios de e-mail para publicar o frontend.
4. Conferir o `.htaccess` remoto. O novo arquivo substitui as regras `BUILDER-START/END` do construtor; não concatenar as reescritas antigas com as novas. Preservar separadamente os blocos necessários de PHP/AutoSSL/cPanel que eventualmente existam. O template do pacote não conhece configurações particulares da conta.
5. Combinar uma janela de troca com o responsável pelo tráfego. O frontend inclui GA4 `G-6Z7JD1757Y`, condicionado ao consentimento e domínio canônico; manter a medição otimizada desativada e conferir ingestão depois do envio. Ads/GTM não foram instalados; o ID Ads conhecido ainda precisa da configuração da conversão antes de considerar a migração de conversões concluída.
6. Conferir anúncios/sitelinks que usam `/galeria`. Há compatibilidade provisória **somente se `galeria.html` continuar no servidor**: manter também `galeria.3d7fa5f3.js` e os recursos necessários à página antiga enquanto ela for usada. O pacote não inclui essa página nem migra seu runtime, conteúdo ou Analytics. Sua substituição/aposentadoria exige decisão específica.

## Enviar os arquivos

Usar a conexão já configurada no FileZilla, com o transporte protegido oferecido pela hospedagem. As instruções de conexão estão na [HostGator](https://suporte.hostgator.com.br/hc/pt-br/articles/30814022785427-Como-configurar-o-FileZilla); não registrar senhas no projeto.

1. No lado local, abrir a pasta `siteDirectory` da versão escolhida; no remoto, abrir a raiz do domínio confirmada no cPanel.
2. Habilitar a visualização de arquivos ocultos quando necessário e confirmar os `.htaccess` na seleção.
3. Enviar primeiro `assets/`, `media/` e as pastas `localizacao/` e `contate-nos/`, preservando os arquivos antigos necessários à restauração.
4. Na janela combinada, enviar `404.html`, `favicon.ico`, `robots.txt`, `sitemap.xml`, o `.htaccess` revisado e, por último, `index.html`. Não deixar o HTML novo ativo enquanto seus assets ainda estão na fila. Transferências por FTP não promovem um release de maneira atômica; executar os passos finais em sequência e conferir falhas na fila.
5. Confirmar que todas as transferências terminaram e testar o domínio imediatamente. Não é necessário mudar DNS só por substituir arquivos na mesma hospedagem.

## Conferir após o envio

```text
npm run verify:preview -- https://www.delanofurtado.adv.br
```

O comando verifica os HTMLs iniciais de páginas/aliases, 404 e três redirects canônicos. Complementar no servidor real:

- Abrir Home, localização e contato diretamente, atualizar a página e navegar pelo menu.
- Conferir que `/localizacao.html` e `/contate-nos.html` redirecionam para suas URLs limpas; aliases com `/index.html` também não entram em loop.
- Testar HTTP e host sem `www`, preservando uma query sintética como `?gclid=teste&utm_source=teste` até a URL final. Não clicar em anúncio real para esse teste.
- Conferir JS/CSS/fontes com status 200 e MIME próprio; arquivo inexistente e rota desconhecida precisam retornar 404, sem fallback de sucesso para a Home.
- Validar cache longo somente em `/assets/` com hash; HTML e mídia com nome estável revalidam. Conferir compressão, console, imagens, botões e celular.
- Conferir `robots.txt`, `sitemap.xml` e a verificação Search Console. Meta presente não comprova acesso/estado do painel nem indexação.
- Se a galeria antiga ainda estiver em uso, testar `/galeria` e seus recursos. Sem o arquivo legado, a regra não cria uma galeria fictícia.

O ambiente local não tem Apache disponível: a inspeção da configuração e os testes do empacotador **não substituem** essa conferência HTTP na HostGator. A documentação do provedor confirma o uso de [mod_rewrite em `.htaccess`](https://suporte.hostgator.com.br/hc/pt-br/articles/30819431599891-Como-ativar-o-mod-rewrite-e-o-mod-speling); regras particulares/permissões da conta ainda precisam ser verificadas no destino.

## Restaurar em caso de falha

Restaurar o `.htaccess`, HTMLs e demais arquivos substituídos usando o backup remoto anterior; manter os bundles exigidos por essa versão. Não remover `.well-known` nem alterar o DNS de e-mail. Se houver erro 500 após trocar o `.htaccess`, restaurar a configuração anterior e consultar o log da hospedagem antes de ajustar diretivas.

Depois da publicação validada e com acesso às contas, executar a medição prevista no [plan-005](../plans/plan-005-migracao-google-e-publicacao-ftp.md) e no [Marco B do plan-003](../plans/plan-003-seo-previas-sociais-analytics-e-descoberta-ia.md#7-marco-b--consentimento-e-analytics-próprios). Campanhas e conversões permanecem pendentes de conferência até essa etapa.
