# Na Avenida Beer — passeio fotográfico

A rolagem percorre **10 fotografias novas em alta resolução**, da fachada noturna até a soleira da entrada, com o balcão à frente. Rolar para trás refaz a sequência na ordem inversa; depois da última cena a página continua normalmente. Não é vídeo ou passeio 3D: cada imagem é um quadro independente, com transição breve entre vizinhos. Não há giro lateral nesta sequência, pois o conjunto enviado termina olhando para a frente na entrada.

O banner não contém textos HTML sobre as fotografias. O cabeçalho conserva o visual preto/dourado, e os controles usam rótulos acessíveis. Se houver música autorizada futuramente, preencha `data-src` no elemento `<audio id="ambient-audio">` em `dist/index.html`. A reprodução exige clique; o volume segue o progresso até o máximo de 20%, e o botão de silenciar fica disponível.

## Imagens em uso

`dist/assets/nova-01.png` a `dist/assets/nova-10.png` são cópias **sem alteração** dos PNGs acrescentados pelo usuário ao GitHub, em ordem crescente do horário no nome original:

| Passeio | Original no GitHub |
| --- | --- |
| 01 | `Imagem do ChatGPT 27 de set. de 2026, 22_26_45.png` |
| 02 | `Imagem do ChatGPT 27 de set. de 2026, 22_26_56.png` |
| 03 | `Imagem do ChatGPT 27 de set. de 2026, 22_27_00.png` |
| 04 | `Imagem do ChatGPT 27 de set. de 2026, 22_27_08.png` |
| 05 | `Imagem do ChatGPT 27 de set. de 2026, 22_27_12.png` |
| 06 | `Imagem do ChatGPT 27 de set. de 2026, 22_27_19.png` |
| 07 | `Imagem do ChatGPT 27 de set. de 2026, 22_27_25.png` |
| 08 | `Imagem do ChatGPT 27 de set. de 2026, 22_27_30.png` |
| 09 | `Imagem do ChatGPT 27 de set. de 2026, 22_27_36.png` |
| 10 | `Imagem do ChatGPT 27 de set. de 2026, 22_27_43.png` |

Todos medem aproximadamente 1813–1815 × 867–868 px. Em telas verticais, `object-fit: cover` mantém a proporção e recorta as laterais, mantendo o foco na porta. Os arquivos anteriores `externa-*`, `cena-*`, `fachada-final.png`, `entrada-final.png` e o interior conceitual seguem guardados, mas não aparecem no banner. `dist/hero.jpg` continua na seção final, fora dele.

`dist/` é a fonte publicada em Sites. `index.html`, `experience.js` e `assets/` na raiz do GitHub espelham a versão estática.
