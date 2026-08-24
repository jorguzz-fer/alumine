// Vet Pricing — Checkout API (Asaas)
// Recebe os dados do checkout, cria/atualiza o cliente e gera a cobrança na API
// do Asaas, devolvendo a URL de pagamento (invoiceUrl) para o front redirecionar.
//
// A chave da API (ASAAS_API_KEY) NUNCA fica no front nem no repositório: é lida
// da variável de ambiente, configurada no Coolify.

import express from "express";
import cors from "cors";
import { timingSafeEqual } from "node:crypto";
import { sendEvent, buildUserData, attribCustomData, isConfigured as capiConfigured, configSummary as capiSummary } from "./meta-capi.js";

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
  CHARGE_DESCRIPTION = "Vet Pricing: aula ao vivo (14/09, 20h)",
  // Token do webhook do Asaas (Configurações > Integrações > Webhooks). O Asaas
  // manda esse valor no cabeçalho asaas-access-token; sem ele qualquer pessoa
  // poderia forjar um "pagamento confirmado" e sujar a otimização da campanha.
  ASAAS_WEBHOOK_TOKEN = "",
  // URL pública do checkout, usada como event_source_url quando o evento nasce
  // no servidor (webhook) e não temos a URL da página.
  PUBLIC_CHECKOUT_URL = "https://tributario.alumine.com.br/checkout.html",
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
// Atrás do proxy do Coolify: sem isso req.ip é o IP do proxy, e o IP é um dos
// sinais que a Meta usa para casar o evento server-side com o clique no anúncio.
app.set("trust proxy", true);
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

// ── Atribuição por cobrança ──────────────────────────────────────────
// O clique no anúncio (fbp/fbc/UTMs) só existe no navegador, e o Purchase só
// acontece depois, no webhook do Asaas. Guardamos o que veio do checkout até o
// pagamento ser confirmado. É memória do processo: um redeploy no meio do
// caminho perde o fbp/fbc, e nesse caso o Purchase ainda sai com e-mail, CPF e
// telefone (buscados no Asaas), que já casam bem na Meta.
const ATTRIB_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const attribByPayment = new Map();

function rememberAttrib(paymentId, data) {
  const now = Date.now();
  for (const [id, saved] of attribByPayment) {
    if (now - saved.ts > ATTRIB_TTL_MS) attribByPayment.delete(id);
  }
  attribByPayment.set(paymentId, { ...data, ts: now });
}

// Dados do navegador que o checkout mandou junto do pedido. Só campos conhecidos
// entram: o corpo da requisição é público e não vira custom_data às cegas.
const ATTRIB_FIELDS = [
  "fbp", "fbc", "event_source_url",
  "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "utm_id",
  "ad_id", "adset_id", "campaign_id",
];

function pickAttrib(raw) {
  const out = {};
  if (!raw || typeof raw !== "object") return out;
  for (const field of ATTRIB_FIELDS) {
    const value = raw[field];
    if (typeof value === "string" && value) out[field] = value.slice(0, 500);
  }
  return out;
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
    metaCapi: capiConfigured(),
    meta: capiSummary(),
    asaasWebhook: Boolean(ASAAS_WEBHOOK_TOKEN),
    webhookTokenLength: String(ASAAS_WEBHOOK_TOKEN).length,
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
    const attrib = pickAttrib(req.body?.attrib);
    const eventId = String(req.body?.eventId || "").slice(0, 100);

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

    // AddPaymentInfo: dados preenchidos e cobrança gerada. Mesmo event_id do
    // evento do navegador, então a Meta trata os dois como um evento só.
    const userData = buildUserData({
      email,
      phone,
      cpfCnpj,
      name,
      fbp: attrib.fbp,
      fbc: attrib.fbc,
      ip: req.ip,
      userAgent: req.get("user-agent"),
    });
    rememberAttrib(payment.data.id, { ...attrib, userData });
    // Sem await: o rastreamento não pode atrasar nem derrubar o checkout.
    sendEvent({
      eventName: "AddPaymentInfo",
      eventId,
      eventSourceUrl: attrib.event_source_url || PUBLIC_CHECKOUT_URL,
      userData,
      customData: attribCustomData(attrib, {
        currency: "BRL",
        value,
        content_name: "Vet Pricing",
        payment_method: billingType,
      }),
    }).catch((e) => console.error("[capi] AddPaymentInfo", e?.message || e));

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

// ── Webhook do Asaas ─────────────────────────────────────────────────
// Único lugar onde dá para saber que a venda aconteceu de verdade. Dispara o
// Purchase pela Conversions API: é o evento que a campanha usa para otimizar.
// Configure em Asaas > Integrações > Webhooks apontando para /asaas-webhook,
// com o mesmo token de ASAAS_WEBHOOK_TOKEN.
const PAID_EVENTS = new Set(["PAYMENT_CONFIRMED", "PAYMENT_RECEIVED"]);

function tokenMatches(received) {
  const a = Buffer.from(String(received || ""));
  const b = Buffer.from(String(ASAAS_WEBHOOK_TOKEN));
  return a.length === b.length && timingSafeEqual(a, b);
}

app.post("/asaas-webhook", async (req, res) => {
  if (!ASAAS_WEBHOOK_TOKEN) {
    console.error("[webhook] recusado: ASAAS_WEBHOOK_TOKEN não configurada.");
    return res.status(401).json({ error: "webhook sem token configurado" });
  }
  if (!tokenMatches(req.get("asaas-access-token"))) {
    console.error("[webhook] recusado: token inválido.");
    return res.status(401).json({ error: "token inválido" });
  }

  const event = String(req.body?.event || "");
  const payment = req.body?.payment || {};
  console.log("[webhook]", event, payment?.id, payment?.status);

  // Responde já: o Asaas reenvia o evento se demorarmos ou falharmos, e o
  // reenvio duplicado é inofensivo porque o event_id do Purchase é fixo.
  res.json({ ok: true });

  if (!PAID_EVENTS.has(event) || !payment?.id) return;

  try {
    const saved = attribByPayment.get(payment.id);
    let userData = saved?.userData;

    // Redeploy entre o checkout e a confirmação: remonta o casamento a partir
    // do cadastro do cliente no Asaas.
    if (!userData && payment.customer) {
      const customer = await asaas(`/customers/${payment.customer}`);
      if (customer.ok) {
        userData = buildUserData({
          email: customer.data?.email,
          phone: customer.data?.mobilePhone || customer.data?.phone,
          cpfCnpj: customer.data?.cpfCnpj,
          name: customer.data?.name,
        });
      } else {
        console.error("[webhook] cliente não encontrado", payment.customer, customer.status);
      }
    }

    await sendEvent({
      eventName: "Purchase",
      // Fixo por cobrança: PAYMENT_CONFIRMED e PAYMENT_RECEIVED chegam os dois
      // para o mesmo pagamento, e a Meta precisa contar uma venda só.
      eventId: `purchase-${payment.id}`,
      eventSourceUrl: saved?.event_source_url || PUBLIC_CHECKOUT_URL,
      userData: userData || {},
      customData: attribCustomData(saved || {}, {
        currency: "BRL",
        value: Number(payment.value) || PRICES[payment.billingType] || PRICES.CREDIT_CARD,
        content_name: "Vet Pricing",
        payment_method: payment.billingType || "",
        order_id: payment.id,
      }),
    });
    // Não apagamos a atribuição aqui: PAYMENT_CONFIRMED e PAYMENT_RECEIVED
    // chegam os dois, e o segundo evento também merece sair bem casado. O TTL
    // limpa o registro depois.
  } catch (err) {
    console.error("[webhook] erro ao enviar Purchase:", err?.stack || err?.message || err);
  }
});

// Loga rejeições/erros não tratados para aparecerem no Log do Coolify.
process.on("unhandledRejection", (r) => console.error("[unhandledRejection]", r));
process.on("uncaughtException", (e) => console.error("[uncaughtException]", e?.stack || e));

app.listen(PORT, () => {
  console.log(`Vet Pricing checkout API on :${PORT} — Asaas base ${ASAAS_BASE}`);
});
