// Conversions API da Meta — eventos server-side do funil Vet Pricing.
//
// Por que existe: o Pixel do navegador perde eventos (bloqueador, ITP do
// Safari, aba fechada) e, principalmente, não sabe quando o pagamento foi
// confirmado — quem sabe disso é o Asaas, que fala com este servidor. Sem o
// Purchase server-side a campanha otimiza no escuro.
//
// Os eventos saem com o mesmo event_id do evento do navegador, então a Meta
// deduplica e não conta a conversão duas vezes.
//
// Configuração (variáveis de ambiente, nunca no repositório):
//   META_PIXEL_ID       id do pixel (o mesmo de tracking.js)
//   META_CAPI_TOKEN     token de acesso da Conversions API
//   META_TEST_EVENT_CODE  opcional, só enquanto valida em "Testar eventos"
//   META_API_VERSION    opcional, default v23.0

import { createHash } from "node:crypto";

const {
  META_PIXEL_ID = "",
  META_CAPI_TOKEN = "",
  META_TEST_EVENT_CODE = "",
  META_API_VERSION = "v23.0",
} = process.env;

const clean = (v = "") => String(v).trim().split(/\s+/)[0];

const PIXEL_ID = clean(META_PIXEL_ID);
const CAPI_TOKEN = String(META_CAPI_TOKEN || "").trim();
const TEST_EVENT_CODE = clean(META_TEST_EVENT_CODE);
const API_VERSION = clean(META_API_VERSION) || "v23.0";

export const isConfigured = () => Boolean(PIXEL_ID && CAPI_TOKEN);

// A Meta exige os dados pessoais em SHA-256 do valor normalizado.
const sha256 = (value) => createHash("sha256").update(String(value)).digest("hex");
const hashText = (value) => {
  const normalized = String(value || "").trim().toLowerCase();
  return normalized ? sha256(normalized) : null;
};
const onlyDigits = (v = "") => String(v).replace(/\D/g, "");

// Telefone no formato internacional, sem "+" e sem separadores. Os formulários
// recebem só DDD + número, então assumimos Brasil quando falta o país.
function hashPhone(phone) {
  let digits = onlyDigits(phone);
  if (!digits) return null;
  if (digits.length <= 11) digits = `55${digits}`;
  return sha256(digits);
}

function hashName(fullName) {
  const parts = String(fullName || "").trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return {};
  const first = parts.shift();
  const last = parts.length ? parts.join(" ") : "";
  const out = { fn: [hashText(first)] };
  if (last) out.ln = [hashText(last)];
  return out;
}

// Quanto mais campos casáveis, melhor a atribuição. Campos vazios são
// omitidos: a Meta rejeita hash de string vazia.
export function buildUserData({ email, phone, cpfCnpj, name, fbp, fbc, ip, userAgent } = {}) {
  const userData = {};

  const em = hashText(email);
  if (em) userData.em = [em];

  const ph = hashPhone(phone);
  if (ph) userData.ph = [ph];

  const cpf = onlyDigits(cpfCnpj);
  if (cpf) userData.external_id = [sha256(cpf)];

  Object.assign(userData, hashName(name));

  // fbp/fbc e IP/user agent vão em claro: identificam o clique, não a pessoa.
  if (fbp) userData.fbp = fbp;
  if (fbc) userData.fbc = fbc;
  if (ip) userData.client_ip_address = ip;
  if (userAgent) userData.client_user_agent = userAgent;

  return userData;
}

// Envia um evento. Nunca lança: rastreamento não pode derrubar o checkout.
export async function sendEvent({
  eventName,
  eventId,
  eventTime,
  eventSourceUrl,
  userData,
  customData,
  actionSource = "website",
}) {
  if (!isConfigured()) {
    console.log("[capi] ignorado (META_PIXEL_ID/META_CAPI_TOKEN ausentes):", eventName);
    return { ok: false, skipped: true };
  }

  const event = {
    event_name: eventName,
    event_time: Math.floor((eventTime || Date.now()) / 1000),
    action_source: actionSource,
    user_data: userData || {},
  };
  if (eventId) event.event_id = eventId;
  if (eventSourceUrl) event.event_source_url = eventSourceUrl;
  if (customData) event.custom_data = customData;

  const body = { data: [event] };
  if (TEST_EVENT_CODE) body.test_event_code = TEST_EVENT_CODE;

  try {
    const res = await fetch(
      `https://graph.facebook.com/${API_VERSION}/${PIXEL_ID}/events?access_token=${encodeURIComponent(CAPI_TOKEN)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.error("[capi] falha", eventName, res.status, JSON.stringify(data));
      return { ok: false, status: res.status, data };
    }
    console.log("[capi] ok", eventName, eventId || "", `events_received=${data?.events_received ?? "?"}`);
    return { ok: true, data };
  } catch (err) {
    console.error("[capi] erro de rede", eventName, err?.message || err);
    return { ok: false, error: String(err?.message || err) };
  }
}

// custom_data com os UTMs do clique. Deixa o relatório da Meta cruzável com o
// que a LP registrou, mesmo quando a atribuição automática não resolve.
export function attribCustomData(attrib = {}, extra = {}) {
  const custom = { ...extra };
  ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "utm_id",
   "ad_id", "adset_id", "campaign_id"].forEach((field) => {
    if (attrib?.[field]) custom[field] = attrib[field];
  });
  return custom;
}
