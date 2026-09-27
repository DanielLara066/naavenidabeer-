# Na Avenida Beer — visita visual provisória

Página estática responsiva. A rolagem percorre 30 recortes externos da rua até o salão e depois quatro vistas internas já existentes. Ao final, o arrasto ou as setas revêem as quatro vistas internas dentro de um ângulo limitado. **É uma sequência de fotografias ilustrativas, não um passeio 3D, panorama 360° ou representação do projeto arquitetônico definitivo.**

O banner de passeio mostra somente as fotografias, controles discretos de ícone e a barra de progresso. A navegação com texto fica na faixa preta acima da imagem. Os ícones e o estado da cena mantêm rótulos acessíveis para leitores de tela.

## Trocar os materiais

- `dist/assets/externa-01.png` a `dist/assets/externa-30.png`: os 30 recortes fornecidos, intactos e na ordem da grade. Cada um mede 272 × 130 px. A sequência usa pré-decodificação, atualização com `requestAnimationFrame` e fusão breve entre vizinhos. Substitua pelo mesmo nome quando houver imagens de maior resolução.
- `dist/assets/cena-05.png` a `dist/assets/cena-08.png`: quatro vistas internas anteriores, após o quadro externo 30. Os oito recortes antigos continuam guardados; 01–04 saíram apenas da sequência ativa. O enquadramento respeita as proporções, com limite de ampliação principal de 4× nos recortes externos e 2× nos internos, mais fundo desfocado. O material pode aparecer pequeno ou pixelado em telas grandes e celulares verticais. O quadro externo 30 já entra no salão; a junção com a vista interna 05 tem diferença de perspectiva. Não há interpolação geométrica entre fotos. O ritmo está em `dist/experience.js`; as larguras máximas nos atributos `--display-w` em `dist/index.html`.
- `dist/assets/fachada-final.png`, `dist/assets/entrada-final.png` e `dist/assets/interior-conceito.webp`: materiais anteriores preservados no repositório, atualmente fora do passeio.
- `dist/hero.jpg`: foto de cerveja na seção final.
- Para adicionar áudio autorizado, copie o arquivo para `dist/assets/` e preencha `data-src="assets/nome-do-arquivo.mp3"` no elemento `<audio id="ambient-audio">` de `dist/index.html`. O som só inicia após clique e o volume máximo é 20%; o botão de silenciar permanece visível.

`dist/` contém a versão publicada no Site. O repositório GitHub também recebe `index.html`, `experience.js` e `assets/` na raiz como espelho estático para leitura e edição.

O sentido original da rolagem foi preservado: o progresso continua seguindo o scroll normal da página, e recuar percorre os mesmos quadros na ordem inversa.
