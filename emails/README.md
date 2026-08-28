# E-mails Vet Pricing · Brevo

Sequência de 3 e-mails para a base de **3.129 clínicas veterinárias** já importada no
Brevo, levando ao evento de **14/09/2026, 20h**. O remetente narrativo é o
**Dr. Kleber Ferreira** — a base conhece ele (recebia e-mails dele por outro domínio),
mas nunca recebeu nada da Alumine.

## Arquivos

| Arquivo | Papel | Assunto sugerido (A / B) |
|---|---|---|
| `email-01-anuncio.html` | Anúncio + mecanismo (split payment) | "O imposto da sua clínica vai ser descontado na fonte" / "Uma mudança que o setor veterinário ainda não percebeu" |
| `email-02-a-conta.html` | A conta / preço no chute (ângulo das peças 03 e 04, as de melhor CTR nos anúncios) | "3 perguntas que o seu preço precisa responder" / "Seu preço cobre o imposto novo? Faça a conta" |
| `email-03-e-hoje.html` | Última chamada, dia do evento | "É hoje, às 20h — Vet Pricing ao vivo" / "Última chamada: split payment e precificação, hoje 20h" |

Preheaders já estão embutidos no HTML (primeiro `div` oculto de cada arquivo).

## Calendário de disparo

**Cenário A — domínio já aquecido** (já disparou volume parecido nos últimos meses):

| Data | Envio |
|---|---|
| ter **02/09**, ~10h | E-mail 01 para a base inteira |
| ter **09/09**, ~10h | E-mail 02 para a base inteira (ou só para quem não clicou no 01, se quiser preservar reputação) |
| dom **14/09**, ~9h | E-mail 03 para a base inteira |

**Cenário B — domínio frio** (nunca disparou em massa, ou está parado há meses):
3 mil de uma vez cai em spam. Escalonar o e-mail 01 em lotes diários — o Brevo permite
dividir a lista em segmentos e agendar um por dia:

| Data | Envio |
|---|---|
| seg 01/09 a sáb 06/09 | E-mail 01 em lotes de ~500/dia (6 lotes) — acompanhar bounce e spam a cada lote; se bounce > 5% ou marcações de spam subirem, pausar e reavaliar |
| ter–qua 09–10/09 | E-mail 02, em 2 lotes de ~1.500 (o domínio já terá histórico) |
| dom 14/09, ~9h | E-mail 03 para a base inteira (dia do evento não dá para escalonar) |

**Perguntas que decidem entre A e B** (em aberto — responder antes do 1º disparo):
1. Qual domínio remetente está configurado no Brevo?
2. Esse domínio já disparou e-mail em massa? Há quanto tempo e em que volume?

## Checklist antes do primeiro disparo

**Autenticação do domínio (Brevo → Senders, Domains & Dedicated IPs):**
- [ ] Domínio remetente adicionado e **verificado** no Brevo
- [ ] **DKIM**: os 2 registros CNAME/TXT que o Brevo fornece criados no DNS (Cloudflare, zona `alumine.com.br` se o remetente for deste domínio) — status "verified" no painel do Brevo
- [ ] **SPF**: TXT do domínio inclui o include do Brevo (`include:spf.brevo.com` no registro `v=spf1 ... ~all`; um único registro SPF por domínio)
- [ ] **DMARC**: TXT `_dmarc` existe (mínimo `v=DMARC1; p=none; rua=mailto:...`) — Gmail/Yahoo exigem para remetentes em massa
- [ ] No Cloudflare, os registros de e-mail ficam **DNS only** (nuvem cinza) — CNAME de DKIM com proxy ligado não valida
- [ ] Teste com mail-tester.com (enviar um teste do Brevo para o endereço gerado): nota ≥ 9

**Conteúdo (por campanha no Brevo):**
- [ ] Remetente: nome "Dr. Kleber Ferreira | Alumine" + e-mail do domínio verificado
- [ ] Reply-to monitorado (respostas de interessados valem venda)
- [ ] Atributo de personalização: o HTML usa `{{ contact.NOME | default : "" }}` — **ajustar `NOME` para o nome real do atributo da lista importada** (ver em Contacts → Settings → Contact Attributes). Se não houver nome na base, remover o placeholder (vira só "Olá,")
- [ ] `{{ mirror }}` e `{{ unsubscribe }}` são tags nativas do Brevo — não substituir por links
- [ ] Adicionar o **endereço físico** da Alumine no rodapé (exigência de bulk senders; hoje só tem o WhatsApp)
- [ ] Enviar teste para Gmail + Outlook + celular antes de agendar
- [ ] Clicar em todos os links do teste e conferir se a LP abre com os UTMs

**Rastreamento:**
- Todos os links carregam `utm_source=brevo&utm_medium=email&utm_campaign=vet-pricing-set26&utm_content=email-0X-...`
- O `tracking.js` da LP já captura UTMs e repassa ao pixel/CAPI — venda vinda de e-mail aparece com essa origem
- E-mails 01 e 02 apontam para a **LP**; o 03 aponta direto para o **checkout** (público já aquecido no dia do evento), com link secundário para a LP

## Cores e estilo

HTML de e-mail (tabelas, CSS inline, largura 600px) — testado para colar direto no
editor de HTML do Brevo ("Code your own"). Paleta alinhada à LP: cabeçalho verde-escuro
`#0d2318`, botão `#1e7a4f`, fundo `#f4f2ee`. Fontes de sistema (Arial) por
compatibilidade de cliente de e-mail.
