# Publicação na HostGator — conferência de 27/10/2026

O usuário informou que enviou os arquivos pelo FileZilla e que o site está no ar. Foi realizada uma conferência pública por HTTP, sem alterar servidor, DNS, contas Google ou campanhas. Release comparado: `20261027T193136138Z-b3c6e65c`.

## Resultado observado

- Os **31 arquivos públicos** do manifesto foram obtidos com status 200 e correspondem exatamente aos tamanhos e SHA-256 locais. Os dois `.htaccess` não são arquivos públicos e não foram baixados por HTTP.
- Home, localização e contato têm HTML inicial próprio, títulos, canonical e conteúdo da versão nova. Localização e contato atendem o documento com 200 **depois** do redirecionamento para a barra final.
- HTTPS e host com `www` recebem os acessos alternativos com 308; a query sintética `?gclid=teste&utm_source=teste` foi preservada. Os cinco aliases `.html`/`index.html` também preservaram essa query em seu primeiro redirecionamento.
- `robots.txt` permite rastreamento; o sitemap lista as três URLs canônicas. A meta pública Search Console foi preservada na Home. Acesso e estado da propriedade no painel não foram verificados.
- Três URLs desconhecidas e dois arquivos inexistentes em `assets/` e `media/` retornaram 404 com o HTML próprio e `noindex,follow`.
- Assets com hash têm MIME próprio e cache de um ano com `immutable`; HTML e mídia estável revalidam. Gzip observado em HTML/JS; headers `nosniff`, proteção de framing e referrer presentes.
- `/galeria` continua atendendo o site antigo com status 200 e contém `UA-199542592-1`. Isso não comprova que a tag encaminha dados a um GA4 ativo, nem que os recursos/interações dessa página antiga funcionam.
- A Home e as duas páginas novas não contêm IDs literais de GA4, Ads ou GTM. Os arquivos públicos correspondem ao pacote sem implementação dessas integrações.

## Pendência de URLs

`/localizacao` e `/contate-nos` retornam **301 para a respectiva URL com barra final**, que então entrega o HTML correto. Canonical, sitemap e links internos usam as URLs sem barra. O comportamento é compatível com a normalização de diretórios do Apache; a configuração efetiva da conta não foi inspecionada.

`npm run verify:preview -- https://www.delanofurtado.adv.br` **não passou**: aprovou a Home e parou em `/localizacao`, que retornou 301 em vez do 200 esperado. A conferência complementar registrou os demais casos individualmente; ela não transforma esse resultado em aprovação do contrato original. Os redirects Apache de aliases têm `Location` absoluto, enquanto o verificador atual exige o caminho relativo; avaliar a equivalência na futura correção do verificador sem relaxar os contratos de destino/status/query.

Após o usuário mostrar uma captura de `/contate-nos` sem barra, foi repetida a conferência HTTP: as duas URLs sem barra no host `www` continuam retornando 301 para a versão com barra, e as duas versões com barra retornam 200. O host sem `www` retorna 308 para `www`, preservando inicialmente o caminho sem barra. No frontend, os links do menu são `NavLink` do React Router para os caminhos sem barra: essa navegação pode alterar conteúdo/endereço sem requisitar o documento ao Apache. Portanto, o endereço sem barra visto ao navegar pelo menu é compatível com o redirecionamento observado no acesso direto ou ao recarregar. A captura não informa qual desses percursos foi usado.

Antes de encerrar o gate de publicação, alinhar os endereços preferidos e o comportamento do servidor e repetir a matriz HTTP. Nenhuma configuração foi modificada nesta auditoria.

## Próximas etapas

1. Corrigir e verificar a padronização das URLs no Apache; conferir navegação e canais em desktop/celular no domínio definitivo.
2. Com o responsável pelo tráfego, identificar o fluxo GA4 existente, eventuais tags/GTM e as ações de conversão reais. Implementar consentimento e eventos conforme os planos 003/005 após validar o gate. Não há novo ID fornecido nesta etapa.
3. Conferir Search Console, enviar/atualizar o sitemap e inspecionar as três páginas após o ajuste das URLs. Presença da meta não prova indexação.
4. Conferir URLs de anúncios/sitelinks e decidir o destino da galeria antiga antes de remover seus arquivos. O backup anterior e sua restauração ainda não foram demonstrados.

Evidência completa de respostas, redirects, headers e hashes: [producao-http-2026-10-27.json](producao-http-2026-10-27.json). Não foram realizados testes visuais/interações no navegador, medição de performance, diagnóstico de ingestão Google ou acesso a cPanel/FTP nesta conferência. Nenhuma campanha foi clicada; os identificadores usados nas queries são sintéticos.
