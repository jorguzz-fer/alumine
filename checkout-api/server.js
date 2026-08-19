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
  // Valores do Vet Pricing por forma de pagamento (em reais).
  PRICE_PIX = "350",
  PRICE_CARD = "390",
  PRICE_BOLETO = "390",
  // Dias a partir de hoje para o vencimento da cobrança.
  DUE_DAYS = "2",
  // Descrição que aparece na cobrança.
  CHARGE_DESCRIPTION = "Vet Pricing — aula ao vivo (14/09, 20h)",
} = process.env;

// Interpreta o preço de forma robusta: aceita "350", "390,00", "R$ 390",
// valores com texto colado, etc. Na dúvida, cai no fallback informado.
function parsePrice(v, fallback) {
  const raw = String(v ?? "").replace(",", ".").replace(/[^\d.]/g, "");
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}
// Preço por método: PIX tem desconto; cartão/boleto no valor cheio.
const PRICES = {
  PIX: parsePrice(PRICE_PIX, 350),
  CREDIT_CARD: parsePrice(PRICE_CARD, 390),
  BOLETO: parsePrice(PRICE_BOLETO, 390),
};
const DUE_DAYS_NUMBER = Number(DUE_DAYS);

// Limpa lixo colado junto do valor da env (ex.: comentário "... (produção).").
// Uma URL/origem válida não tem espaços, então cortamos no primeiro espaço.
const clean = (v = "") => String(v).trim().split(/\s+/)[0];
const stripSlash = (v = "") => v.replace(/\/+$/, "");

const ASAAS_BASE = stripSlash(clean(ASAAS_BASE_URL));
const ALLOWED_ORIGINS = ALLOWED_ORIGIN.split(",").map((o) => stripSlash(clean(o))).filter(Boolean);

// Libera as origens da allowlist E qualquer subdomínio *.alumine.com.br, para
// o CORS não travar por causa de um valor de env levemente diferente.
function isAllowedOrigin(origin) {
  if (!origin) return true; // curl / health checks (sem header Origin)
  const o = stripSlash(origin.trim());
  if (ALLOWED_ORIGINS.includes(o)) return true;
  try {
    const host = new URL(o).hostname;
    if (host === "alumine.com.br" || host.endsWith(".alumine.com.br")) return true;
  } catch {}
  return false;
}

const app = express();
// CORS antes do parser. Nunca lançamos erro aqui (isso removeria os cabeçalhos
// de CORS e produziria um "CORS error" opaco no navegador).
app.use(
  cors({
    origin: (origin, cb) => cb(null, isAllowedOrigin(origin)),
    methods: ["POST", "GET", "OPTIONS"],
  })
);
app.use(express.json({ limit: "16kb" }));

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
  const res = await fetch(`${ASAAS_BASE}${path}`, {
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
  // keyLength/keyPrefixOk ajudam a diagnosticar sem expor a chave:
  //  - keyLength 0  => a chave não chegou ao processo (nome errado, sem redeploy,
  //                    ou o "$" inicial foi interpretado pelo Coolify).
  //  - keyPrefixOk false com keyLength>0 => a chave chegou truncada/alterada.
  const key = ASAAS_API_KEY || "";
  res.json({
    ok: true,
    configured: Boolean(key),
    keyLength: key.length,
    keyPrefixOk: key.startsWith("$aact_"),
    base: ASAAS_BASE,
    prices: PRICES,
  });
});

// ── Checkout ─────────────────────────────────────────────────────────
app.post("/checkout", async (req, res) => {
  const t0 = Date.now();
  console.log("[checkout] hit", { origin: req.headers.origin, billingType: req.body?.billingType });
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
    console.log("[checkout] customer", customer.status, customer.ok ? customer.data?.id : JSON.stringify(customer.data));
    if (!customer.ok) {
      const msg = customer.data?.errors?.[0]?.description || "Falha ao criar o cliente no Asaas.";
      return res.status(502).json({ error: msg, step: "customer", asaasStatus: customer.status });
    }

    // 2) Cria a cobrança (valor conforme a forma de pagamento)
    const value = PRICES[billingType] ?? PRICES.CREDIT_CARD;
    const payment = await asaas("/payments", {
      method: "POST",
      body: JSON.stringify({
        customer: customer.data.id,
        billingType,
        value,
        dueDate: dueDateISO(DUE_DAYS_NUMBER),
        description: CHARGE_DESCRIPTION,
        externalReference: "vet-pricing",
      }),
    });
    console.log("[checkout] payment", payment.status, payment.ok ? payment.data?.id : JSON.stringify(payment.data));
    if (!payment.ok) {
      const msg = payment.data?.errors?.[0]?.description || "Falha ao criar a cobrança no Asaas.";
      return res.status(502).json({ error: msg, step: "payment", asaasStatus: payment.status });
    }

    console.log("[checkout] ok", payment.data?.id, `${Date.now() - t0}ms`);
    // invoiceUrl = página de pagamento hospedada pelo Asaas (PIX/Cartão/Boleto).
    return res.json({
      invoiceUrl: payment.data.invoiceUrl,
      paymentId: payment.data.id,
      status: payment.data.status,
    });
  } catch (err) {
    console.error("[checkout] error:", err?.stack || err?.message || err);
    return res.status(500).json({ error: "Erro interno ao processar o checkout." });
  }
});

// Loga rejeições/erros não tratados para aparecerem no Log do Coolify.
process.on("unhandledRejection", (r) => console.error("[unhandledRejection]", r));
process.on("uncaughtException", (e) => console.error("[uncaughtException]", e?.stack || e));

app.listen(PORT, () => {
  console.log(`Vet Pricing checkout API on :${PORT} — Asaas base ${ASAAS_BASE}`);
});
