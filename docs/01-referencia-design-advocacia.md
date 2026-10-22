# Especificação visual — referência de landing page de advocacia

Referência inspecionada: [projeto no Behance](https://www.behance.net/gallery/257377909/Pagina-de-Vendas-Advogado-Trabalhista-Ensaio-com-IA).

Objetivo: registrar o design do frontend para orientar outro site, com outro profissional, marca e conteúdo. Esta especificação descreve a aparência observada nas imagens, sem aproveitar os textos ou dados pessoais da referência.

**Precisão:** a composição desktop foi inspecionada visualmente do início ao fim. Cores em hexadecimal, fontes alternativas e medidas em pixels abaixo são aproximações ou sugestões de implementação. Não são valores extraídos do arquivo de design ou do código original. A página do Behance apresenta imagens do projeto; elas não confirmam interações nem comportamento responsivo.

## 1. Direção visual

Estética institucional contemporânea, clara e sóbria. O reconhecimento visual vem da combinação de verde floresta, branco, neutros quentes, retratos formais e um monograma usado como selo.

- Fundos claros ocupam quase toda a página. O verde escuro concentra os pontos de ação, ícones, títulos e fechamento.
- O layout tem bastante espaço vazio e colunas de leitura relativamente estreitas.
- A composição alterna blocos centralizados com seções de duas colunas.
- Os contornos são finos, as sombras discretas e os cantos pouco arredondados nos componentes menores.
- Seções maiores recebem cantos mais amplos e recortes em degrau ou curvas suaves no encontro entre blocos.
- O retrato do profissional é o principal elemento de identidade, repetido em diferentes recortes.
- A tipografia é sem serifa, inclusive nos títulos. O monograma tem desenho próprio.

## 2. Paleta aproximada

| Papel visual | Cor aproximada | Aplicação |
| --- | --- | --- |
| Verde principal | `#20382F` | Botões, área final, mapa, emblemas |
| Verde intermediário | `#426653` | Região iluminada dos degradês e detalhes |
| Verde de títulos | `#3B5549` | Títulos e textos de destaque |
| Branco | `#FFFFFF` | Fundo e superfícies dos cartões |
| Off-white quente | `#F0EFEB` | Áreas alternadas e faixas de apoio |
| Bege acinzentado | `#D7D4CB` | Caminho gráfico da seção de processo |
| Cinza de contorno | `#D5D6D1` | Bordas e divisórias |
| Cinza de texto | `#626962` | Parágrafos e informações secundárias |

Os botões têm um degradê horizontal discreto: extremidades escuras e centro mais claro. Os fundos também usam variações muito suaves entre branco, cinza e bege; a aparência geral é quase plana.

## 3. Tipografia e hierarquia

**Observado:** fonte sem serifa, de aparência geométrica, com formas arredondadas. Títulos em peso regular ou médio; subtítulos e títulos dos cartões mais fortes; parágrafos leves e compactos.

**Para implementar uma aproximação:** testar Manrope ou Montserrat e comparar a forma das letras com a referência. A família exata não foi identificada.

Escala inicial sugerida para um desktop amplo:

| Elemento | Faixa sugerida | Tratamento |
| --- | --- | --- |
| Título principal | 44–52 px | Peso 400–500; entrelinha 1,15–1,25 |
| Títulos de seção | 32–40 px | Peso 400–500; entrelinha 1,2–1,3 |
| Títulos de cartões | 18–22 px | Peso 600 |
| Texto corrido | 16–18 px | Peso 400; entrelinha 1,45–1,65 |
| Rótulos de seção | 11–13 px | Caixa alta; peso 500 |
| Texto de botão | 14–16 px | Peso 400–500 |

Padrão recorrente de abertura de seção: pequeno rótulo dentro de um retângulo com borda fina, título abaixo e uma linha horizontal delicada. Em algumas seções há uma linha curta de apoio entre o título e a divisória.

## 4. Grade, alinhamento e espaçamento

- Página longa, composta por faixas verticais.
- Blocos de fundo ocupam toda a largura do projeto; o conteúdo principal fica centralizado.
- Em várias seções, o conteúdo ocupa aproximadamente dois terços da largura da arte.
- A grade de serviços é ainda mais estreita e centralizada: duas colunas e duas linhas no desktop apresentado.
- O hero ocupa uma área visual mais aberta que a grade de serviços.
- Há intervalos grandes antes e depois dos títulos e grupos de componentes.
- Botões isolados costumam ficar centralizados entre seções.
- Linhas de texto são curtas; há poucas áreas de prosa larga.

Tradução inicial sugerida para CSS: container principal de 1120–1280 px em telas amplas; padding lateral mínimo de 24 px; seções com 80–120 px de respiro vertical; gaps de 16–24 px nos cartões e de 40–72 px nas composições de duas colunas. Esses valores precisam ser ajustados à largura real do novo site.

## 5. Estrutura visual, na ordem observada

### 5.1. Primeira dobra

- Não há uma barra de navegação convencional visível na arte da landing page. O menu do Behance pertence à plataforma de apresentação.
- Duas zonas: texto à esquerda e retrato dominante à direita.
- A coluna esquerda reúne um pequeno identificador institucional, título em várias linhas, divisória, descrição curta, botão principal e pequena linha de avaliação.
- A coluna direita combina retrato recortado com cenário de escritório ao fundo.
- Uma transição clara suaviza o encontro entre o fundo branco e a fotografia.
- O retrato se aproxima do limite inferior do bloco e cria continuidade com a faixa seguinte.
- Um selo circular com monograma aparece perto do retrato.
- A base da seção tem transições com curvas/recortes, evitando uma divisão horizontal inteiramente reta.

Para outro advogado, preservar a relação entre massa de texto, retrato e área vazia. O fundo fotográfico deve ser escolhido junto com o recorte da pessoa, para manter contraste e encaixe.

### 5.2. Faixa de credenciais

- Painel branco horizontal, centralizado, com borda cinza muito fina.
- Três grupos distribuídos lado a lado.
- Cada grupo combina um medalhão verde com ícone linear e uma descrição curta.
- A faixa fica na transição entre o hero e a próxima área de fundo quente.

### 5.3. Grade de serviços

- Fundo off-white quente.
- Cabeçalho centralizado com rótulo, título e divisória.
- Quatro cartões em grade 2 × 2.
- Cartões brancos ou quase brancos, altos, de borda fina e cantos discretos.
- Pequeno detalhe verde no topo, como uma aba arredondada parcialmente recortada.
- Ícone circular próximo ao topo esquerdo.
- Título, conteúdo e botão secundário alinhados à esquerda.
- Botões secundários claros, pequenos e retangulares; ficam próximos à base dos cartões.
- A composição mantém alturas uniformes, inclusive quando há menos conteúdo em um cartão.
- Um botão principal verde encerra o conjunto, centralizado.

### 5.4. Processo de atendimento

- Fundo branco e cabeçalho centralizado.
- O elemento principal é uma faixa larga bege acinzentada que faz um percurso sinuoso, com curvas em U.
- Sete etapas são distribuídas ao longo desse percurso.
- Cada etapa tem um disco claro com ícone verde, sombra suave e texto posicionado acima, abaixo ou ao lado.
- Pequenos sinais direcionais e segmentos em forma de seta ajudam a indicar o percurso.
- Selos de marca aparecem nas extremidades; um monograma grande, quase transparente, entra no fundo.
- Botão principal centralizado na parte inferior.

É o bloco mais específico e trabalhoso do frontend. Para reproduzir o aspecto, o caminho pode ser desenhado em SVG e os textos e ícones devem continuar como elementos próprios do layout.

### 5.5. Depoimentos

- Faixa larga em off-white, com cantos inferiores amplos.
- Coluna introdutória à esquerda e cartões de avaliação à direita.
- A introdução reúne rótulo, pequena indicação de avaliação, título, descrição e botão verde.
- Os cartões têm fundo branco, sombra leve, avatar, identificação curta e estrelas.
- O conjunto de cartões se prolonga além do recorte visível à direita, sugerindo uma área horizontal rolável. Uma interação de carrossel não pode ser confirmada pela imagem.
- Os amarelos das estrelas e pequenos elementos coloridos ficam restritos à linguagem visual das avaliações.

### 5.6. Apresentação do profissional

- Painel claro centralizado, com contorno fino e cantos discretos.
- Coluna de texto à esquerda; composição fotográfica à direita.
- As fotografias formam dois retângulos verticais: um retrato frontal mais largo, colorido, e uma imagem lateral mais estreita, em preto e branco.
- Há pouco espaço entre as fotos; elas funcionam como um díptico.
- Um selo circular ultrapassa o limite superior direito do painel.
- Uma pequena faixa verde com identificação social se sobrepõe à base das fotos.
- Um detalhe verde curto na borda esquerda conecta o bloco à linguagem dos cartões.

### 5.7. Cobertura geográfica

- Fundo claro com leve degradê.
- Uma palavra decorativa muito grande e muito clara aparece parcialmente atrás do bloco.
- Mapa à esquerda; título, parágrafos e botão à direita.
- O mapa tem preenchimento verde escuro e linhas internas discretas.
- Linhas curvas convergem para um ponto destacado, dando sensação de conexão.
- Uma pequena etiqueta clara sobreposta ao mapa sinaliza a localização principal.
- O contorno superior da seção tem uma mudança de nível com transição arredondada.

### 5.8. Diferenciais

- Cabeçalho centralizado.
- Foto vertical alta à esquerda e quatro cartões horizontais empilhados à direita.
- O retrato recebe escurecimento na parte inferior para comportar identificação em branco.
- Um selo circular se sobrepõe à lateral da foto.
- Cada cartão tem título, divisória fina, texto curto, ícone circular à direita e uma pequena aba verde na borda esquerda.
- Os cartões compartilham largura, alinhamento e aparência.
- Botão principal centralizado abaixo do conjunto.

### 5.9. Perguntas frequentes

- Cabeçalho centralizado com o mesmo padrão de rótulo e título.
- Coluna única, relativamente estreita.
- Seis caixas largas empilhadas, com bordas finas, fundo muito claro e pequenos cantos arredondados.
- Pergunta em peso forte, resposta mais leve e pequeno controle circular verde à direita.
- Na imagem, as respostas estão visíveis. O comportamento de abrir/fechar não foi demonstrado.
- Novo botão verde centralizado após a lista.

### 5.10. Contato e rodapé

- Grande área verde escura, com cantos superiores arredondados e recorte em degrau no topo.
- Pequenas etiquetas claras ficam junto ao recorte superior.
- Painel central de contato em branco/bege, com cantos arredondados.
- Conteúdo centralizado: rótulo, título, descrição curta, linha de canais com ícones, informação de atendimento e botão.
- Ícone do canal de contato aparece dentro de um círculo branco no botão.
- O painel recebe um monograma muito claro como marca-d'água.
- A parte inferior tem divisória sutil e uma linha compacta de créditos.

## 6. Componentes que formam o sistema visual

| Componente | Características a preservar |
| --- | --- |
| Botão principal | Retângulo verde em degradê, cantos discretos, texto claro e círculo branco com seta na direita |
| Botão secundário | Fundo cinza muito claro, borda sutil, texto escuro, escala menor |
| Rótulo de seção | Pequeno retângulo de borda fina, caixa alta, fundo claro |
| Medalhão de ícone | Disco verde, ícone de traço fino claro, anéis/contornos ao redor |
| Selo de marca | Monograma central e texto circular, usado sobre fotos e bordas |
| Cartão | Superfície clara, borda cinza de 1 px como ponto de partida, sombra mínima |
| Aba decorativa | Pequeno segmento verde saindo ou sendo recortado na borda do componente |
| Divisória | Linha fina, curta ou com extremidades muito suaves |
| Marca-d'água | Monograma ou palavra grande, com contraste muito baixo |
| Indicador entre blocos | Pequeno símbolo de rolagem ou seta, centralizado no espaço vazio |

Dimensões de partida sugeridas: botões principais com 56–64 px de altura; raio de 6–10 px nos componentes menores; raio de 24–40 px nos grandes painéis; ícones circulares com 40–56 px. As proporções visuais devem orientar o ajuste final.

## 7. Tratamento de imagem e marca

- Retratos com roupa formal, fundo controlado e luz que destaca o rosto.
- Mistura de imagem colorida neutra e retratos em preto e branco.
- Recortes verticais predominantes; o hero utiliza pessoa recortada sobre ambiente.
- Fotografias mantêm o rosto em posição consistente e evitam competir com títulos e botões.
- Monograma e selos aparecem em vários pontos para criar continuidade.
- A nova marca deve substituir integralmente o monograma, os selos, as fotos e as identificações da referência.

O projeto também inclui uma capa de portfólio, uma faixa com variações de retrato e um encerramento promocional dos designers. Esses materiais não fazem parte da estrutura da landing page.

## 8. Adaptação mobile proposta

Não há uma versão mobile apresentada no material inspecionado. As decisões abaixo são uma proposta para adaptar a linguagem visual:

- Hero em uma coluna: título e ação primeiro, retrato abaixo, mantendo a transição suave entre imagem e fundo.
- Credenciais empilhadas ou distribuídas em uma grade compacta.
- Serviços em uma coluna, sem impor alturas excessivas quando o conteúdo for curto.
- Processo convertido para uma linha do tempo vertical, com as mesmas sete etapas e os mesmos medalhões.
- Depoimentos em área horizontal com um cartão principal por vez, caso essa interação seja implementada.
- Seções de foto/texto e mapa/texto empilhadas.
- Diferenciais abaixo do retrato ou com retrato reduzido, conforme o espaço disponível.
- FAQ com texto e controle preservando distância lateral adequada.
- Canais do painel de contato em linhas separadas.
- Selos e marcas-d'água reduzidos e reposicionados para não encobrir conteúdo.

Ponto de partida sugerido: padding lateral de 20–24 px, títulos de 28–36 px e espaços verticais de 48–72 px. O teste visual deve definir os valores finais.

## 9. Limites da extração pelo link

**Confirmado visualmente:** sequência e composição das seções, grade desktop, linguagem dos componentes, tratamento de retratos, papel das cores, padrões de alinhamento e decoração.

**Estimado:** códigos de cor, família tipográfica, tamanhos em pixels, raios, intensidade de sombra e dimensões dos containers.

**Não demonstrado:** breakpoints, versão mobile original, estados de hover/foco, animações, funcionamento de carrossel e FAQ, destinos dos botões, código-fonte e arquivos de marca/fotografia separados.

O material é suficiente para orientar a criação de um frontend com linguagem visual semelhante, usando uma marca e informações novas. Uma reprodução com valores exatos exigiria acesso ao arquivo de design ou ao site implementado.
