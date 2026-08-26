# Criativos da campanha Vet Pricing

Cinco peças 1080 × 1350 (4:5) para a campanha de Meta Ads, na paleta e
tipografia da landing page.

| Arquivo | Ângulo | Fundo |
| --- | --- | --- |
| `01-split-payment.jpg` | O imposto sai antes do dinheiro entrar | preto |
| `02-a-conta.jpg` | A linha do imposto que ninguém preencheu | verde-preto |
| `03-margem.jpg` | Aumentou o preço e continua sem sobrar | claro |
| `04-preco-no-chute.jpg` | O erro que a clínica comete todo dia | verde profundo |
| `05-autoridade.jpg` | Dr. Kleber Ferreira | preto com foto |

## Por que ficam no repositório

O `Dockerfile.tributario` copia a raiz inteira para o nginx, então estas
imagens são servidas em `https://vet-pricing.alumine.com.br/criativos/`.
A API de anúncios da Meta só ingere imagem por URL pública: a conta não tem
upload local liberado, e nenhum link autenticado serve.

São artes de anúncio, que vão rodar em feed aberto de qualquer forma. Nada
aqui é material privado.
