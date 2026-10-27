# Deploy e operação

## Estado e destino

O **Netlify é a hospedagem temporária de homologação**, conforme esclarecimento do responsável em **23/10/2026**. Em **27/10/2026**, confirmou substituir o site no mesmo domínio `https://www.delanofurtado.adv.br`, na **HostGator/cPanel pelo FileZilla**. O pacote local está preparado; a publicação definitiva ainda não ocorreu nesta execução. O código está em [ruandiegl/delanoFurtado](https://github.com/ruandiegl/delanoFurtado), com deploy automático de `main` no Netlify e configuração em `netlify.toml`. O artefato `dist/` contém três HTMLs públicos e 404. A URL temporária é [delano-furtado.netlify.app](https://delano-furtado.netlify.app/). Datas, versão e smoke tests históricos ficam nas [evidências do release](evidencias/release-003.md).

O domínio atual continua como origem canônica registrada. Publicar uma URL `netlify.app` não troca DNS nem substitui automaticamente o site existente no domínio profissional.

O destino deve suportar o build estático Vite e a estratégia de HTML por rota definida em [SEO](seo-acessibilidade-performance.md). API de envio, se houver, tem ambiente e segredos próprios.

## Ordem de lançamento e Analytics

1. Confirmar hospedagem definitiva e domínio canônico final.
2. Adaptar a configuração de publicação ao provedor escolhido, preservando HTML por rota, redirects, 404, headers e cache.
3. Publicar no domínio final com HTTPS e validar navegação, contatos, mídia e metadados.
4. Somente depois dessa validação, executar a implementação de consentimento, GA4 próprio e eventos dos botões, conforme o [Marco B do plan-003](../plans/plan-003-seo-previas-sociais-analytics-e-descoberta-ia.md#7-marco-b--consentimento-e-analytics-próprios).

Até a conclusão das três primeiras etapas, Analytics permanece sem implementação e desativado. O dicionário de eventos pode continuar documentado. O provedor e domínio foram confirmados; não houve mudança de DNS ou publicação definitiva. O usuário ainda vai solicitar acesso às contas Google antes da conferência de IDs/conversões.

## Requisitos do provedor

A [auditoria e sequência de migração estão no plan-005](../plans/plan-005-migracao-google-e-publicacao-ftp.md). `npm run build:ftp` gera e verifica o build estático, acrescenta as configurações Apache e preserva a meta Search Console na Home de um novo `release-ftp/<versão>/site`. Manifesto e instruções ficam fora da pasta publicável. A raiz remota precisa ser conferida no cPanel; as regras ainda precisam de teste HTTP na hospedagem. Seguir o [guia FileZilla](publicacao-hostgator-filezilla.md). O `.htaccess` e o `robots.txt` antigos não são copiados. A sequência de Analytics registrada acima continua vigente; a presença de uma tag UA no export não comprova ausência de GA4 conectado.

- Build no computador/CI com runtime Node registrado e instalação reproduzível por npm; hospedagem serve arquivos estáticos.
- Publicação de `dist/`, com HTTPS e domínio canônico.
- Entrega dos HTMLs pré-renderizados por rota, assets e URLs diretas.
- Controle de redirecionamentos, respostas desconhecidas, headers e cache.
- Separação de preview/produção e possibilidade de restaurar artefato anterior.

HostGator/cPanel foi confirmado pelo usuário. A configuração em `deploy/apache/` segue o suporte documentado pelo provedor a `.htaccess`/mod_rewrite; permissões e comportamento HTTP da conta ainda precisam ser conferidos. Não foi copiada a regra de caldeiraria ou a reescrita ampla do construtor antigo.

## Configuração da homologação no Netlify

Importar o repositório acima no painel, selecionar `main` e manter a raiz como diretório base. O `netlify.toml` define instalação com npm 11.21.1/Node 22.15.0, publicação de `dist/` e o comando que executa testes, lint, build e verificação do artefato. O provedor instala as dependências antes desse comando; o lockfile é versionado.

Os HTMLs de localização e contato são atendidos por regras explícitas. Aliases `index.html` recebem 308; arquivos reais têm prioridade sobre a regra final de 404. Pretty URLs fica desativado para preservar as URLs sem barra final usadas pelo projeto. O CDN normaliza a barra final ao avaliar as regras; não acrescentar redirects de barra que criem um loop.

Headers definem revalidação do conteúdo, cache imutável apenas para `/assets/` com nomes versionados, proteção contra framing, `nosniff` e política de referrer. Mídia de nome estável permanece com revalidação. Não há variáveis secretas obrigatórias, banco ou função de envio neste release.

O projeto público recebe o selo do Netlify no canto inferior. Quando esse iframe está presente, o botão flutuante de WhatsApp reserva espaço acima dele, preservando a área de clique e o safe area do dispositivo.

Referências: [configuração por arquivo](https://docs.netlify.com/build/configure-builds/file-based-configuration/), [regras de redirect e 404](https://docs.netlify.com/manage/routing/redirects/redirect-options/) e [prioridade dos arquivos estáticos](https://docs.netlify.com/manage/routing/redirects/rewrites-proxies/).

## Pipeline

```text
npm ci
npm run test:run
npm run lint
npm run build
npm run verify:build
```

O build gera HTML/CSS/metadados por rota. Usar Node 22.15.0/npm 11.21.1 conforme [Desenvolvimento](desenvolvimento.md). A execução remota precisa ter resultado registrado; configuração versionada não comprova deploy aprovado.

Antes de publicar, conferir o artefato com `npm run preview` e a configuração equivalente ao servidor de produção. O preview de desenvolvimento não prova comportamento de DNS, cache ou redirecionamento do provedor.

## Rotas e cache

Servir arquivos reais e HTMLs específicos antes de aplicar fallback. URLs antigas devem seguir o mapa de migração, e URLs desconhecidas devem ter resposta definida. Evitar reescrever tudo para a Home com status de sucesso.

Contrato do provedor: `/` → index.html; `/localizacao` → localizacao/index.html; `/contate-nos` → contate-nos/index.html; caminhos desconhecidos → 404.html com status 404. Servir mídia/assets existentes antes das regras. O middleware de preview serve os três HTMLs e 404 para desconhecidos, inclusive com extensão. Na publicação, verificou-se que o CDN do Netlify atende variações de caixa e aliases estáticos com o mesmo HTML. O manifest compartilhado resolve essas variações para a página canônica também no Router e no SEO, evitando divergência na hidratação. Os aliases `index.html` em minúsculas redirecionam com 308; variantes de caixa podem receber 200 do CDN e continuam renderizando a mesma página. O middleware local não substitui a validação HTTP no provedor.

Assets com nome versionado podem ter cache longo; HTML e arquivos de política exigem revalidação compatível com a frequência de atualização. Conferir também favicon, imagem social e fontes após a troca de release.

## Checklist de publicação

1. Identificar o artefato, versão e responsável pelo release.
2. Conferir os checks técnicos e as decisões editoriais que afetam a versão.
3. Abrir as três URLs diretamente e após refresh, com conteúdo e metadados corretos.
4. Verificar HTTPS, host canônico, redirecionamentos, 404, sitemap e robots.
5. Testar canais oficiais e eventual envio com configuração real autorizada.
6. Inspecionar mídia, console, teclado, mobile e preferência de movimento.
7. Conferir que preview e produção têm configurações distintas de indexação e integração.
8. Preservar um caminho de restauração antes da troca.

Aplicar a publicação e alterações de domínio apenas quando fizerem parte do pedido autorizado. Preparar artefato e evidências antes de qualquer etapa de aprovação exigida pelo ambiente.

## Operação e rollback

Registrar data, versão, rotas afetadas e resultado do smoke test. Em falha de release, restaurar o artefato/configuração anterior pelo provedor; evitar reescrever o histórico Git como mecanismo de rollback.

No Netlify, abrir **Deploys**, selecionar um deploy anterior aprovado e publicá-lo novamente. Para a correção persistir no próximo push, aplicar um commit de correção ou revert em `main` e conferir a nova publicação. No primeiro release não há uma versão Netlify anterior para restaurar; o domínio profissional permanece independente até uma migração de DNS autorizada.

Na manutenção, verificar dados de contato, links, dependências, expiração de serviços e métricas quando disponíveis. Monitoramento recorrente só deve ser configurado em uma solicitação que inclua essa rotina; nenhum monitor foi criado nesta documentação.
