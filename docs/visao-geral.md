# Visão geral e escopo

## Resultado esperado

Criar um site institucional de advocacia para apresentar Delano Furtado, sua formação, áreas de atuação e canais de contato. A experiência deve facilitar a leitura e o contato em celular e desktop, mantendo os fatos e materiais extraídos do site atual.

O público informado na fonte é composto por pessoas físicas e jurídicas. O atendimento presencial abrange as cidades e regiões descritas no [documento de conteúdo](02-conteudo-site-delano-furtado.md); o atendimento online é apresentado para todo o Brasil. A menção ao exterior pertence especificamente ao bloco de Sucessões.

## O que existe

- Análise visual integral da referência do Behance, sem incorporar seu conteúdo profissional.
- Transcrição das três páginas do site atual: início, localização e contato.
- Sete arquivos visuais originais, com origem, dimensões e hash.
- Guidelines para a stack herdada de caldeiraria e perfis de agentes por função.

O MVP está implementado: Home, Localização, Contato, 404, conteúdo tipado, mídia otimizada, scroll GSAP, testes e HTML/CSS por rota. O build está em `dist/`; veja [as evidências](evidencias/mvp-001.md). Backend, Git, hospedagem e CI não foram configurados.

## Escopo inicial definido

- Site WEB responsivo em pt-BR.
- Home com apresentação, formação, serviços, perfil profissional, abrangência e contato.
- Preservação dos endereços `/localizacao` e `/contate-nos` do site atual.
- Uso do logo e do retrato reais do Delano.
- Canais oficiais de WhatsApp, telefone, e-mail e redes sociais.
- Estrutura preparada para SEO, teclado, movimento reduzido e otimização de imagens.
- Conteúdo centralizado e tipado, separado da composição React.

O formulário publicado no site atual é uma referência de conteúdo, não uma integração transferida. A primeira versão pode orientar o contato para canais existentes. Exibir um formulário de envio exige uma integração real conforme [Integrações](integracoes-e-formularios.md).

## Evoluções condicionais

FAQ, etapas de atendimento, avaliações individuais, novos serviços, blog, CMS, agendamento e formulário com envio só entram quando houver conteúdo ou requisito correspondente. O design de referência pode reservar espaço para esses elementos; a reserva não transforma dados ausentes em fatos.

Login, área do cliente, processos judiciais, pagamentos, aplicativo mobile, banco de dados e API própria não pertencem ao escopo inicial.

## Critérios do produto

- Identidade e dados do Delano reconhecíveis, sem informações do advogado da referência.
- Contatos corretos e acionáveis; nenhum sucesso de envio simulado.
- Texto legível e controles utilizáveis em telas pequenas e por teclado.
- URLs existentes preservadas ou migradas com redirecionamento deliberado.
- Componentes, fontes e imagens com custo compatível com um site institucional.
- Dados sem comprovação mantidos fora da publicação, com sua necessidade registrada.

O aceite técnico e as evidências de cada entrega estão em [Qualidade e validação](qualidade-e-validacao.md).
