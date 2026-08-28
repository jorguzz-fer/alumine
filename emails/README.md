# E-mails Vet Pricing — plano de envio no Brevo

Base: **3.129 contatos** de clínicas veterinárias, já importada no Brevo.
Remetente: **doutorkleber.com.br** — domínio **frio** no Brevo (nunca disparou em massa
por lá), por isso o envio do e-mail 1 é **escalonado**.

Remetente sugerido: `Dr. Kleber Ferreira <kleber@doutorkleber.com.br>`
(use a caixa que existir; evite `noreply@`).

## Antes de qualquer envio (checklist técnico)

No Brevo: **Configurações → Remetentes, Domínios e IPs dedicados → Domínios →
Autenticar** `doutorkleber.com.br`. O Brevo mostra os registros exatos na tela —
copie de lá para o DNS do domínio (verifique onde o DNS do doutorkleber.com.br
está hospedado; não é a zona alumine.com.br do Cloudflare). Tipicamente:

- [ ] TXT de verificação (`brevo-code=...`)
- [ ] DKIM: TXT/CNAME em `mail._domainkey.doutorkleber.com.br`
- [ ] SPF: se o domínio já tem TXT `v=spf1 ...`, **adicionar** `include:spf.brevo.com`
      ao registro existente (nunca criar um segundo TXT spf)
- [ ] DMARC: se não existir, criar TXT em `_dmarc` com `v=DMARC1; p=none; rua=mailto:fer.jorge@gmail.com`
- [ ] Esperar o Brevo marcar o domínio como autenticado (verde)
- [ ] Enviar teste para um Gmail e um Outlook próprios; abrir "mostrar original"
      e conferir `SPF: PASS`, `DKIM: PASS`, `DMARC: PASS`
- [ ] Substituir nos 3 HTMLs o placeholder `[ENDEREÇO COMPLETO DA EMPRESA — obrigatório]`
- [ ] Conferir que `{{ unsubscribe }}` foi mantido (o Brevo exige)

## Fatiar a base em 4 lotes (para o escalonamento)

O Brevo não sorteia "N contatos" de uma lista, então fatie na importação:
exporte a lista para CSV, corte em 4 arquivos e importe como 4 listas:

| Lista | Tamanho |
|---|---|
| `VP-LOTE-1` | 300 |
| `VP-LOTE-2` | 500 |
| `VP-LOTE-3` | 800 |
| `VP-LOTE-4` | 1.529 |

## Calendário (aula: 14/09 às 20h)

| Data | Envio | Público |
|---|---|---|
| Seg 01/09 | *(setup)* autenticação do domínio + testes | — |
| Ter 02/09, 10h | **E-mail 1** (split payment) | VP-LOTE-1 (300) |
| Qua 03/09, 10h | E-mail 1 | VP-LOTE-2 (500) |
| Qui 04/09, 10h | E-mail 1 | VP-LOTE-3 (800) |
| Sex 05/09, 10h | E-mail 1 | VP-LOTE-4 (1.529) |
| ~~Seg 07/09~~ | *(feriado — não enviar)* | — |
| Ter 08/09, 10h | **E-mail 2** (programa + preço) | Lotes 1+2+3 (1.600) |
| Qua 09/09, 10h | E-mail 2 | Lote 4 (1.529) |
| Seg 14/09, 9h | **E-mail 3** (última chamada) | Base inteira **menos compradores** |

Excluir compradores: exportar do Asaas os pagantes, criar lista `VP-COMPRADORES`
no Brevo e usá-la como **lista de exclusão** nas campanhas dos e-mails 2 e 3.

## Regras de parada (olhar no dia seguinte a cada lote)

- **Hard bounce > 3%** em um lote → pausar o calendário e revisar a higienização
  antes do próximo lote.
- **Marcações de spam ≥ 0,1%** (relatório da campanha) → pausar e reavaliar
  copy/remetente.
- Aberturas do lote 1 abaixo de ~15% → não é motivo de parada, mas teste outro
  assunto no lote 2 (os assuntos alternativos estão abaixo).

## Arquivos e UTMs

| Arquivo | Assunto sugerido | utm_content |
|---|---|---|
| `email-1-split.html` | O imposto da sua clínica vai ser descontado na fonte | `email-1-split` |
| `email-2-aula.html` | Como vamos precificar a sua clínica para 2027 (aula ao vivo, 14/09) | `email-2-aula` |
| `email-3-ultima-chamada.html` | É hoje, às 20h: Vet Pricing ao vivo | `email-3-ultima-chamada` |

Assuntos alternativos (se as aberturas do lote 1 vierem fracas):
- E1: "Sua clínica vai receber menos por cada consulta a partir de 2027"
- E2: "O programa das 3 horas do Vet Pricing (e quanto custa)"
- E3: "Começa hoje às 20h — deixo a porta aberta até lá"

Todos os links apontam para `https://vet-pricing.alumine.com.br/` com
`utm_source=brevo&utm_medium=email&utm_campaign=vet-pricing-set26&utm_content=<acima>`.
O rastreamento de cliques do Brevo reescreve o link mas preserva as UTMs — os
cliques aparecem no pixel como tráfego `brevo/email`.

## Como colar no Brevo

Campanhas → Criar campanha → E-mail → editor **"Colar seu código"** (HTML) →
colar o arquivo inteiro. Preencher assunto e preheader (o preheader já está
embutido no HTML, mas o campo do Brevo tem prioridade — use o mesmo texto).
Agendar conforme o calendário acima.
