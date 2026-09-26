# Na Avenida Beer — visita visual provisória

Página estática responsiva. A rolagem aproxima a fachada e revela um conceito fictício do interior. A vista interna permite olhar para os lados dentro de um ângulo limitado; **não é um panorama 360° nem representação do projeto arquitetônico definitivo**.

## Trocar os materiais

- `dist/assets/fachada.webp`: fachada noturna temporária. Mantenha o letreiro e a entrada na região próxima de 56% da largura; se a nova foto tiver outra posição, ajuste `transform-origin` da classe `.facade-image` em `dist/index.html`.
- `dist/assets/interior-conceito.webp`: cena interna conceitual de proporção 3:1. Substitua por imagem ampla do espaço final. A navegação é horizontal e limitada, sem costura de 360°.
- `dist/hero.jpg`: foto de cerveja na seção final.
- Para adicionar áudio autorizado, copie o arquivo para `dist/assets/` e preencha `data-src="assets/nome-do-arquivo.mp3"` no elemento `<audio id="ambient-audio">` de `dist/index.html`. O som só inicia após clique e o volume máximo é 20%; o botão de silenciar permanece visível.

`dist/` contém a versão publicada no Site. O repositório GitHub também recebe `index.html`, `experience.js` e `assets/` na raiz como espelho estático para leitura e edição.
