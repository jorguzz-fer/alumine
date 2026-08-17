// Vet Pricing — Checkout API (Asaas)
// Recebe os dados do checkout, cria/atualiza o cliente e gera a cobrança na API
// do Asaas, devolvendo a URL de pagamento (invoiceUrl) para o front redirecionar.
//
// A chave da API (ASAAS_API_KEY) NUNCA fica no front nem no repositório: é lida
// da variável de ambiente, configurada no Coolify.

import express from "express";
import cors from "cors";

const {
  ASAAS_API_KEY,
  // Sandbox:   https://sandbox.asaas.com/api/v3
  // Produção:  https://api.asaas.com/v3
  ASAAS_BASE_URL = "https://sandbox.asaas.com/api/v3",
  // Origem(s) do front autorizada(s) a chamar a API (separe por vírgula).
  ALLOWED_ORIGIN = "https://tributario.alumine.com.br",
  PORT = 3000,
  // Valor do Vet Pricing em reais.
  PRICE = "397",
  // Dias a partir de hoje para o vencimento da cobrança.
  DUE_DAYS = "2",
  // Descrição que aparece na cobrança.
  CHARGE_DESCRIPTION = "Vet Pricing — aula ao vivo (14/09, 20h)",
} = process.env;

const PRICE_NUMBER = Number(PRICE);
const DUE_DAYS_NUMBER = Number(DUE_DAYS);
const ALLOWED_ORIGINS = ALLOWED_ORIGIN.split(",").map((o) => o.trim()).filter(Boolean);

const app = express();
app.use(express.json({ limit: "16kb" }));
app.use(
  cors({
    origin(origin, cb) {
      // Permite ferramentas sem Origin (curl, health checks) e as origens da allowlist.
      if (!origin || ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
      return cb(new Error("Origem não autorizada"));
    },
    methods: ["POST", "GET", "OPTIONS"],
  })
);

// ── Helpers ──────────────────────────────────────────────────────────
const onlyDigits = (v = "") => String(v).replace(/\D/g, "");
const isEmail = (v = "") => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v).trim());

const VALID_BILLING = new Set(["PIX", "BOLETO", "CREDIT_CARD", "UNDEFINED"]);

function dueDateISO(daysFromNow) {
  const d = new Date();
  d.setDate(d.getDate() + (Number.isFinite(daysFromNow) ? daysFromNow : 2));
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
}

async function asaas(path, options = {}) {
  const res = await fetch(`${ASAAS_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      access_token: ASAAS_API_KEY,
      ...(options.headers || {}),
    },
  });
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { raw: text };
  }
  return { ok: res.ok, status: res.status, data };
}

// ── Health ───────────────────────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({ ok: true, configured: Boolean(ASAAS_API_KEY), base: ASAAS_BASE_URL });
});

// ── Checkout ─────────────────────────────────────────────────────────
app.post("/checkout", async (req, res) => {
  try {
    if (!ASAAS_API_KEY) {
      return res.status(500).json({ error: "Servidor sem ASAAS_API_KEY configurada." });
    }

    const name = String(req.body?.name || "").trim();
    const email = String(req.body?.email || "").trim();
    const cpfCnpj = onlyDigits(req.body?.cpfCnpj);
    const phone = onlyDigits(req.body?.phone);
    let billingType = String(req.body?.billingType || "UNDEFINED").toUpperCase();
    if (!VALID_BILLING.has(billingType)) billingType = "UNDEFINED";

    // Validação
    const errors = [];
    if (name.length < 3) errors.push("Informe o nome completo.");
    if (!isEmail(email)) errors.push("Informe um e-mail válido.");
    if (cpfCnpj.length !== 11 && cpfCnpj.length !== 14) errors.push("Informe um CPF ou CNPJ válido.");
    if (phone.length < 10) errors.push("Informe um WhatsApp válido com DDD.");
    if (errors.length) return res.status(400).json({ error: errors.join(" ") });

    // 1) Cria o cliente
    const customer = await asaas("/customers", {
      method: "POST",
      body: JSON.stringify({ name, email, mobilePhone: phone, cpfCnpj }),
    });
    if (!customer.ok) {
      const msg = customer.data?.errors?.[0]?.description || "Falha ao criar o cliente no Asaas.";
      return res.status(502).json({ error: msg });
    }

    // 2) Cria a cobrança
    const payment = await asaas("/payments", {
      method: "POST",
      body: JSON.stringify({
        customer: customer.data.id,
        billingType,
        value: PRICE_NUMBER,
        dueDate: dueDateISO(DUE_DAYS_NUMBER),
        description: CHARGE_DESCRIPTION,
        externalReference: "vet-pricing",
      }),
    });
    if (!payment.ok) {
      const msg = payment.data?.errors?.[0]?.description || "Falha ao criar a cobrança no Asaas.";
      return res.status(502).json({ error: msg });
    }

    // invoiceUrl = página de pagamento hospedada pelo Asaas (PIX/Cartão/Boleto).
    return res.json({
      invoiceUrl: payment.data.invoiceUrl,
      paymentId: payment.data.id,
      status: payment.data.status,
    });
  } catch (err) {
    console.error("checkout error:", err?.message || err);
    return res.status(500).json({ error: "Erro interno ao processar o checkout." });
  }
});

app.listen(PORT, () => {
  console.log(`Vet Pricing checkout API on :${PORT} — Asaas base ${ASAAS_BASE_URL}`);
});
