# Deploy e operação

## Estado e destino

O destino escolhido é **Netlify**, com código em [ruandiegl/delanoFurtado](https://github.com/ruandiegl/delanoFurtado), branch de produção `main` e configuração em `netlify.toml`. O artefato `dist/` contém três HTMLs públicos e 404. O projeto foi publicado em [delano-furtado.netlify.app](https://delano-furtado.netlify.app/), conectado ao GitHub para publicação automática após os checks. Datas, versão e smoke tests ficam nas [evidências do release](evidencias/release-003.md).

O domínio atual continua como origem canônica registrada. Publicar uma URL `netlify.app` não troca DNS nem substitui automaticamente o site existente no domínio profissional.

O destino deve suportar o build estático Vite e a estratégia de HTML por rota definida em [SEO](seo-acessibilidade-performance.md). API de envio, se houver, tem ambiente e segredos próprios.

## Requisitos do provedor

- Build com runtime Node registrado e instalação reproduzível por npm.
- Publicação de `dist/`, com HTTPS e domínio canônico.
- Entrega dos HTMLs pré-renderizados por rota, assets e URLs diretas.
- Controle de redirecionamentos, respostas desconhecidas, headers e cache.
- Separação de preview/produção e possibilidade de restaurar artefato anterior.

Apache é uma opção possível, não uma contratação confirmada. A regra `.htaccess` encontrada em caldeiraria não foi copiada: o fallback precisa considerar os HTMLs e as rotas reais do Delano.

## Configuração do Netlify

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
