# Vet Pricing · Checkout API (Asaas)

Backend mínimo que cria a cobrança do **Vet Pricing (R$ 397)** na API do Asaas e
devolve a URL de pagamento (`invoiceUrl`) para o front (`/checkout.html`) redirecionar.
PIX, Cartão e Boleto são processados na página segura do Asaas — **nenhum dado de
cartão passa pelo nosso servidor**.

## Como funciona

```
checkout.html (front, estático)
   └─ POST {API_BASE}/checkout  { name, email, cpfCnpj, phone, billingType }
        └─ checkout-api (este serviço)
             ├─ POST /customers  (cria o cliente no Asaas)
             └─ POST /payments   (cria a cobrança)
        ← { invoiceUrl }         (redireciona o cliente para o pagamento)

Asaas (pagamento confirmado)
   └─ POST {API_BASE}/asaas-webhook
        └─ Purchase pela Conversions API da Meta
```

## Rastreamento (Meta)

O front carrega `tracking.js` (raiz do repo), que sobe o Pixel e guarda a origem
do clique (UTMs, `fbclid`, `_fbp`/`_fbc`). O funil fica assim:

| Momento | Evento | De onde sai |
| --- | --- | --- |
| Visita a LP | `PageView`, `ViewContent` | navegador |
| Clique num CTA | `ClickCheckoutCTA` (custom) | navegador |
| Abre o checkout | `InitiateCheckout` | navegador |
| Gera a cobrança | `AddPaymentInfo` | navegador **e** servidor (mesmo `event_id`) |
| Pagamento confirmado | `Purchase` | só servidor, via webhook do Asaas |

O `event_id` é gerado no navegador e enviado junto do pedido, então a Meta
deduplica o evento que chega pelos dois caminhos e conta uma conversão só. O
`Purchase` usa `purchase-{paymentId}`, porque o Asaas dispara
`PAYMENT_CONFIRMED` e `PAYMENT_RECEIVED` para a mesma cobrança.

A atribuição do clique fica em memória do processo entre o checkout e a
confirmação do pagamento. Um redeploy nesse intervalo perde `_fbp`/`_fbc`; o
`Purchase` ainda sai com e-mail, telefone, CPF e nome (buscados no Asaas), que
já casam bem na Meta.

### Configurar o webhook no Asaas

Configurações > Integrações > Webhooks > Adicionar:

- **URL:** `https://pay.alumine.com.br/asaas-webhook`
- **Token de autenticação:** o mesmo valor de `ASAAS_WEBHOOK_TOKEN`
- **Eventos:** `PAYMENT_CONFIRMED` e `PAYMENT_RECEIVED`

## Endpoints

- `GET /health` — status do serviço (chave do Asaas, Conversions API e webhook).
- `POST /checkout` — cria a cobrança. Body JSON: `name`, `email`, `cpfCnpj`, `phone`, `billingType` (`UNDEFINED` | `PIX` | `CREDIT_CARD` | `BOLETO`), mais `eventId` e `attrib` (rastreamento, opcionais).
- `POST /asaas-webhook` — recebe a confirmação de pagamento do Asaas e dispara o `Purchase`. Exige o cabeçalho `asaas-access-token` igual a `ASAAS_WEBHOOK_TOKEN`.

## Deploy no Coolify

1. **New Resource → Application**, apontando para este repositório.
2. **Base Directory:** `checkout-api`  · **Build Pack:** Dockerfile.
3. **Port:** `3000`.
4. **Domain:** por exemplo `https://pay.alumine.com.br`.
5. **Environment Variables** (copie de `.env.example`):
   - `ASAAS_API_KEY` — sua chave do Asaas (**comece pela sandbox**).
   - `ASAAS_BASE_URL` — `https://sandbox.asaas.com/api/v3` (sandbox) ou `https://api.asaas.com/v3` (produção).
   - `ALLOWED_ORIGIN` — `https://tributario.alumine.com.br`.
   - `PRICE_PIX=350`, `PRICE_CARD=390`, `PRICE_BOLETO=390`, `DUE_DAYS=2` (opcionais).
   - `META_PIXEL_ID`, `META_CAPI_TOKEN` — rastreamento server-side.
   - `ASAAS_WEBHOOK_TOKEN` — token do webhook de pagamento confirmado.
6. **Deploy.**

## Conectar o front

No arquivo `checkout.html` (raiz do repo), ajuste a constante para o domínio da API:

```js
const API_BASE = "https://pay.alumine.com.br"; // sem barra no final
```

## Segurança

- A `ASAAS_API_KEY` fica **apenas** nas variáveis de ambiente do serviço — nunca no
  front, nunca no repositório.
- O CORS libera só a origem em `ALLOWED_ORIGIN`.
- Teste tudo na **sandbox** do Asaas antes de trocar para produção.

## Rodando localmente

```bash
cd checkout-api
npm install
ASAAS_API_KEY=sua_chave_sandbox ASAAS_BASE_URL=https://sandbox.asaas.com/api/v3 \
ALLOWED_ORIGIN=http://localhost:8099 npm start
```
