# Vet Pricing — contexto para continuar em outra sessão

Cole este arquivo inteiro como primeira mensagem da sessão nova.

---

## Quem sou eu e o que estamos fazendo

Fernando Jorge (fer.jorge@gmail.com). Fale comigo em **português do Brasil**.

Estamos lançando o **Vet Pricing**: aula ao vivo de 3h no Zoom, **14/09/2026 às 20h**,
sobre a nova tributação (split payment) e precificação para **clínicas veterinárias**.
Preços: **R$ 390** no cartão · **R$ 350** no PIX · 10x de R$ 45.
Autoridade: **Dr. Kleber Ferreira** — pesquisador na USP e proprietário de um dos maiores
laboratórios de diagnóstico veterinário do país, com o selo DNA USP de Inovação.

**A matemática que decide tudo:** R$ 50/dia de mídia até 14/09 ≈ R$ 900–926 no total.
**3 inscrições pagam a mídia inteira.** CPA teto = R$ 350 (acima disso, cada venda dá
prejuízo na mídia).

---

## Estado atual (28/08/2026)

### Campanha Meta — RODANDO

| Item | Valor |
|---|---|
| Conta de anúncios | `554955683460627` — "CA - Dr. Kleber Ferreira" |
| Business | `475650458464388` |
| Campanha | `120247482699950436` — `[VET-PRICING][CONVERSAO][SET26]` · CBO R$50/dia · `OUTCOME_SALES` |
| Conjunto | `120247482700590436` — `[VET-PRICING][INITIATE-CHECKOUT][LAL 1% CLINICAS][BR 25-65]` |
| Otimização | `OFFSITE_CONVERSIONS` / `INITIATED_CHECKOUT` |
| Público | Lookalike 1% (`120247507387420436`) como sugestão + Advantage+ com expansão liberada |
| Geo · Idade | BR (`location_types: ["recent"]`) · 25–65 |
| Encerramento | 14/09/2026 19h BRT |
| Pixel | `1401766885429741` — "Vet-pricing" |

**Anúncios (todos ativos):**
- `120247501599500436` — `[VP][01][SPLIT-MECANISMO]`
- `120247501602430436` — `[VP][02][A-CONTA]`
- `120247501603700436` — `[VP][03][MARGEM]`
- `120247501604830436` — `[VP][04][PRECO-NO-CHUTE]`
- `120247501606250436` — `[VP][05][AUTORIDADE]`

**Números até 28/08 de manhã** (acumulado, ainda com o checkout quebrado):
gasto R$ 76,39 · 1.880 impressões · 69 cliques no link · CTR 5,37% · CPM R$ 40,63 ·
59 visualizações de página · **6 checkouts** · custo por checkout R$ 12,73 · **0 vendas**.

O CBO concentrou **76% do gasto na peça 01**, que tem a **pior** CTR (4,60%). As peças
04 (8,53%) e 03 (7,41%) têm CTR muito melhor e quase não receberam verba. Ainda não mexi
— era dia 1 e a regra é não julgar criativo antes do 3º dia.

### Infraestrutura

| | |
|---|---|
| LP + checkout + painel | `https://vet-pricing.alumine.com.br` |
| API do checkout | `https://pay.alumine.com.br` — chamada pelo site via `/api/` (mesma origem) |
| Painel | `https://vet-pricing.alumine.com.br/painel` e artefato `https://claude.ai/code/artifact/90eb7edf-ddc9-4b04-b623-cd0035804a1c` |
| Repositório | `jorguzz-fer/alumine`, branch `claude/meta-ads-traffic-management-mxu6c0` |
| Hospedagem | Coolify (dois serviços: LP e checkout-api) |
| Pagamentos | Asaas |
| DNS/CDN | Cloudflare, zona `alumine.com.br`, plano gratuito |

### Rastreamento — validado de ponta a ponta em 28/08

Cadeia inteira provada com compra PIX real feita no celular em 5G:
checkout → `POST /payments` (200) → PIX pago → webhook do Asaas (200 `{"ok":true}`) →
CAPI → **Purchase no Gerenciador de Eventos da Meta, correspondência 8.0/10**.

Eventos ativos no pixel: `PageView`, `ViewContent`, `ClickCheckoutCTA`,
`InitiateCheckout`, `AddPaymentInfo`, `Purchase` (via CAPI), `CheckoutError` (novo).

---

## O que quebrou e como foi consertado (não repita a investigação)

Entre 27 e 28/08 tivemos **16 checkouts abertos e zero venda**. Eram **duas falhas
sobrepostas**, o que tornou o diagnóstico escorregadio:

1. **Telefone com `+55`.** O formulário aceitava `+55119899404044` (14 dígitos), o Asaas
   rejeitava com **400 opaco**. Aparecia nos "Logs de Requisições" do Asaas.
2. **`fetch` morrendo em rede móvel.** O comprador via só `Load failed` (mensagem do
   Safari para requisição que nem virou resposta HTTP). Intermitente.

**Consertos aplicados (todos já mergeados e no ar):**
- API servida no mesmo domínio via `location /api/` no nginx (PR #36)
- **HTTP/3 desligado no Cloudflare** (Velocidade → Otimização → Protocolo) — é a
  hipótese mais provável da falha intermitente: Safari adota QUIC e algumas operadoras
  móveis tratam mal UDP/443. Depois de desligar, o 5G passou.
- "Sempre usar HTTPS" ligado no Cloudflare
- Telefone normalizado no front **e** no servidor; retry automático (3 tentativas) em
  falha de rede; evento `CheckoutError` no pixel; mensagem em português no lugar do
  "Load failed" (PR #37)

**Hipóteses que testei e caíram** — não gaste tempo nelas: cadeia de certificado
incompleta; preflight CORS quebrado (o `OPTIONS` volta 204 com todos os cabeçalhos
corretos); container caído; regra de WAF do Cloudflare (não existe nenhuma).

---

## Armadilhas conhecidas do ambiente

**Coolify pula o build quando só o conteúdo muda.** O `Dockerfile.tributario` não muda,
então ele reaproveita a imagem antiga e a rota nova responde 200 servindo a landing —
falha silenciosa. **Sempre use "Force deploy" no serviço da LP.** Já aconteceu duas vezes.

**Variável de ambiente exige Redeploy, não Restart.** O Coolify injeta o ambiente na
*criação* do container. Salvar não basta; reiniciar não basta.

**`PRICE_PIX` é sensível a maiúsculas** e o `parsePrice` **nunca lança erro** — nome
errado ou valor inválido cai silenciosamente em R$ 350. Confira sempre em
`https://vet-pricing.alumine.com.br/api/health`, que mostra os preços em uso.

**O redeploy apaga o Runtime Log** (o container é recriado). Se precisar do log de um
evento, leia antes de deployar.

**A atribuição vive na memória do processo.** O mapa que liga pagamento a `fbp`/`fbc`/UTMs
zera a cada deploy. Comprador que gera a fatura antes de um deploy e paga depois vira
`Purchase` sem atribuição de anúncio. Evite deployar em horário de pico de tráfego pago.

**O fuso da conta de anúncios é `America/Noronha`** (UTC-2), 1h à frente de Brasília.
Venda às 23h30 daqui aparece no relatório como do dia seguinte.

**O conjunto não vai sair da fase de aprendizado** com R$50/dia e produto de R$350
(a Meta quer 50 conversões/semana). Oscilação não é sinal.

---

## Rotina agendada — PRECISA SER RECRIADA

Existe uma rotina diária que atualiza o painel às **8h de Brasília** (`0 11 * * *`):
`trig_01N1GYCFcQR3mnUW5w1oD7NY`.

**Ela está amarrada à sessão antiga** — vai continuar disparando lá, não na sessão nova.
E ela **falhou na primeira execução** porque as sessões disparadas por rotina criada via
ferramenta **não carregam conectores MCP** (sem Meta-ADS, sem dados).

Recomendação: **recriar pela interface de Routines da claude.ai** (Configurações →
Routines), onde os conectores ficam vinculados ao agendamento. Depois apague a antiga.

O que a rotina faz: puxa erros de entrega e métricas da campanha, preenche o painel,
republica o artefato, regenera `painel.html` no repositório, e **só me avisa se alguma
regra de decisão disparou** — senão atualiza em silêncio.

**As regras de decisão** (escritas antes dos dados, de propósito):
- Nada se decide antes de 3 dias de veiculação
- Mato uma peça quando gastou ~R$60 sem nenhum checkout **enquanto** outra já trouxe pelo menos um
- CTR boa + checkout perto de zero = o problema é a página, não o criativo
- CPA acima de R$ 350 = decisão consciente, nunca descuido

---

## O que está pendente

### 1. E-mail para 3.129 contatos (prioridade)

Base de clínicas veterinárias, higienizada, já importada no **Brevo** (assinado).
Nunca receberam e-mail da Alumine; receberam do Dr. Kleber por outro domínio.

**Falta decidir (perguntas em aberto):**
- Qual domínio remetente está configurado no Brevo?
- Esse domínio já disparou e-mail em massa antes, e há quanto tempo? (Domínio frio com
  3 mil envios de uma vez cai em spam — se for o caso, escalonar, ex. 500/dia.)

**Falta produzir:** sequência de 3 e-mails até 14/09, HTML pronto para colar no Brevo,
UTMs (`utm_source=brevo&utm_medium=email&...`), checklist de SPF/DKIM.

**Integração com o Brevo:** a chave já existe. Na sessão antiga o `api.brevo.com` estava
**bloqueado pela política de rede** e a variável `BREVO_API_KEY` não estava no ambiente.
Fernando alterou as configurações do ambiente — **teste primeiro**:

```bash
curl -sS --max-time 12 -o /dev/null -w '%{http_code}\n' https://api.brevo.com/v3/account
[ -n "$BREVO_API_KEY" ] && echo "chave presente (${#BREVO_API_KEY} chars)" || echo "sem chave"
```

Se der `200` e a chave aparecer, dá para usar a API REST do Brevo direto (não precisa de
MCP): criar campanha, subir template, agendar, ler resultado.
**Nunca peça nem aceite a chave colada no chat** — só variável de ambiente.

### 2. Outros itens

- Revisar se o CBO continua concentrando na peça 01 (pior CTR) — a partir do 3º dia, decidir
- Segmentação por interesse ainda não foi adicionada (deliberadamente)
- Público personalizado `Clinicas-VET-08-2026` (`120247501713450436`) correspondeu
  1.800–2.100 pessoas; o lookalike 1% derivado já está em uso

---

## Como eu gosto de trabalhar

- **Verifique com a operação que realmente falha.** Nesta investigação eu testei `GET /health`
  duas vezes e tratei como sinal sobre um `POST`. Não é. Custou rodadas.
- **Não afirme mais do que o dado sustenta.** Se são três amostras, diga que são três.
- **Prefira dado a teoria.** Quando existir um painel, um log ou um inspetor que responda
  a pergunta, vá nele antes de propor mais uma hipótese.
- **Diga o que não deu certo.** Errei quatro hipóteses seguidas neste bug e o valor esteve
  em admitir cada uma rápido, não em defendê-las.
- Repositório: desenvolva na branch `claude/meta-ads-traffic-management-mxu6c0`, commit e
  push, e abra PR. Este repositório **não tem CI**.

## Repositório que NÃO é meu escopo

`jorguzz-fer/Lapato-plataforma` apareceu nesta conversa (PR #58, campo Instituição no
login) mas **outra sessão cuida dele**. Não mexa.
