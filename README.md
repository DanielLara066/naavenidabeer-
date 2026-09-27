# Na Avenida Beer — visita visual provisória

Página estática responsiva. A rolagem aproxima a fachada e revela um conceito fictício do interior. A vista interna permite olhar para os lados dentro de um ângulo limitado; **não é um panorama 360° nem representação do projeto arquitetônico definitivo**.

O banner de passeio mostra somente as fotografias, controles discretos de ícone e a barra de progresso. A navegação com texto fica na faixa preta acima da imagem. Os ícones e o estado da cena mantêm rótulos acessíveis para leitores de tela.

## Trocar os materiais

- `dist/assets/fachada-final.png`: fachada completa enviada para esta sequência, preservada em PNG sem conversão. A entrada está próxima de 60% da largura; se trocar a foto, ajuste `transform-origin` da classe `.facade-image` em `dist/index.html`.
- `dist/assets/entrada-final.png`: aproximação da porta enviada para a sequência, preservada em PNG sem conversão. As duas imagens têm perspectivas e larguras de porta diferentes; a interpolação por escala e sobreposição é uma simulação visual, não um percurso 3D geometricamente contínuo.
- `dist/assets/interior-conceito.webp`: cena interna conceitual de proporção 3:1. Substitua por imagem ampla do espaço final. A navegação é horizontal e limitada, sem costura de 360°.
- `dist/hero.jpg`: foto de cerveja na seção final.
- Para adicionar áudio autorizado, copie o arquivo para `dist/assets/` e preencha `data-src="assets/nome-do-arquivo.mp3"` no elemento `<audio id="ambient-audio">` de `dist/index.html`. O som só inicia após clique e o volume máximo é 20%; o botão de silenciar permanece visível.

`dist/` contém a versão publicada no Site. O repositório GitHub também recebe `index.html`, `experience.js` e `assets/` na raiz como espelho estático para leitura e edição.

O sentido original da rolagem foi preservado: o progresso continua seguindo o scroll normal da página, e recuar percorre os mesmos quadros na ordem inversa.
