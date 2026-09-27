# Na Avenida Beer — visita visual provisória

Página estática responsiva. A rolagem percorre oito recortes originais, da rua à entrada e ao salão. Ao final, o arrasto ou as setas revêem as quatro vistas internas dentro de um ângulo limitado. **É uma sequência de fotografias ilustrativas, não um passeio 3D, panorama 360° ou representação do projeto arquitetônico definitivo.**

O banner de passeio mostra somente as fotografias, controles discretos de ícone e a barra de progresso. A navegação com texto fica na faixa preta acima da imagem. Os ícones e o estado da cena mantêm rótulos acessíveis para leitores de tela.

## Trocar os materiais

- `dist/assets/cena-01.png` a `dist/assets/cena-08.png`: os oito recortes originais, sem conversão. Troque cada arquivo mantendo o nome para substituir quadros depois. O ritmo está em `dist/experience.js`; as larguras máximas de exibição estão nos atributos `--display-w` em `dist/index.html`.
- Os quatro primeiros quadros têm aproximadamente 760 px de largura; os últimos variam de 295 a 460 px. A exibição preserva proporções e limita a ampliação principal a 2×, com fundo desfocado para ocupar o restante da tela. Em telas grandes e celulares verticais, a área nítida pode ficar menor.
- `dist/assets/fachada-final.png`, `dist/assets/entrada-final.png` e `dist/assets/interior-conceito.webp`: materiais anteriores preservados no repositório, atualmente fora do passeio.
- `dist/hero.jpg`: foto de cerveja na seção final.
- Para adicionar áudio autorizado, copie o arquivo para `dist/assets/` e preencha `data-src="assets/nome-do-arquivo.mp3"` no elemento `<audio id="ambient-audio">` de `dist/index.html`. O som só inicia após clique e o volume máximo é 20%; o botão de silenciar permanece visível.

`dist/` contém a versão publicada no Site. O repositório GitHub também recebe `index.html`, `experience.js` e `assets/` na raiz como espelho estático para leitura e edição.

O sentido original da rolagem foi preservado: o progresso continua seguindo o scroll normal da página, e recuar percorre os mesmos quadros na ordem inversa.
