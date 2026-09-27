# Na Avenida Beer — visita visual provisória

Página estática responsiva. A apresentação principal usa os 30 recortes externos fornecidos, da fachada até o salão, seguidos por quatro vistas internas. A versão alternativa com as duas fotos maiores de 1672 × 941 px pode ser vista em `?modo=hd`. O arrasto ou as setas revêem as quatro vistas internas dentro de um ângulo limitado. **É uma simulação com fotografias ilustrativas, não um passeio 3D, vídeo contínuo, panorama 360° ou representação do projeto arquitetônico definitivo.**

O banner mostra somente as fotografias, controles discretos de ícone e barra de progresso. A navegação com texto fica na faixa preta acima da imagem. Os controles e a cena têm rótulos para leitores de tela. O sentido original da rolagem foi preservado, e recuar reverte o percurso; após o banner a página rola normalmente.

## Materiais e substituição

- `dist/assets/fachada-final.png` e `dist/assets/entrada-final.png`: fotos grandes do percurso alternativo `?modo=hd`. O movimento é uma aproximação simulada; há diferença de perspectiva entre as duas.
- `dist/assets/externa-01.png` a `dist/assets/externa-30.png`: 30 recortes originais intactos, na ordem da grade, cada um com 272 × 130 px. Esta é a sequência padrão do Site. A sequência pré-decodifica imagens, renderiza por `requestAnimationFrame` e usa fusão breve entre quadros vizinhos. Arquivos individuais maiores poderão substituí-los mantendo os nomes.
- `dist/assets/cena-05.png` a `dist/assets/cena-08.png`: quatro vistas internas, usadas nas duas versões. Os recortes antigos 01–04 estão guardados no repositório, mas fora do passeio. O enquadramento preserva proporções, com limite de 2× nas imagens internas e fundo desfocado. A junção do quadro externo 30 com a vista interna 05 tem diferença de perspectiva.
- `dist/assets/interior-conceito.webp`: material anterior preservado, fora do passeio.
- `dist/hero.jpg`: foto de cerveja na seção final.
- Para adicionar áudio autorizado, copie o arquivo para `dist/assets/` e preencha `data-src="assets/nome-do-arquivo.mp3"` no elemento `<audio id="ambient-audio">` de `dist/index.html`. O som só inicia após clique e o volume máximo é 20%; o botão de silenciar permanece visível.

`dist/` contém a versão publicada no Site. O repositório GitHub também recebe `index.html`, `experience.js` e `assets/` na raiz como espelho estático. O ritmo e a escolha da versão estão em `dist/experience.js`.
