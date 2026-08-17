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
```

## Endpoints

- `GET /health` — status do serviço (e se a chave está configurada).
- `POST /checkout` — cria a cobrança. Body JSON: `name`, `email`, `cpfCnpj`, `phone`, `billingType` (`UNDEFINED` | `PIX` | `CREDIT_CARD` | `BOLETO`).

## Deploy no Coolify

1. **New Resource → Application**, apontando para este repositório.
2. **Base Directory:** `checkout-api`  · **Build Pack:** Dockerfile.
3. **Port:** `3000`.
4. **Domain:** por exemplo `https://pay.alumine.com.br`.
5. **Environment Variables** (copie de `.env.example`):
   - `ASAAS_API_KEY` — sua chave do Asaas (**comece pela sandbox**).
   - `ASAAS_BASE_URL` — `https://sandbox.asaas.com/api/v3` (sandbox) ou `https://api.asaas.com/v3` (produção).
   - `ALLOWED_ORIGIN` — `https://tributario.alumine.com.br`.
   - `PRICE=397`, `DUE_DAYS=2` (opcionais).
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
