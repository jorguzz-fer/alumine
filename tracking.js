/* Vet Pricing — rastreamento do funil (Meta Pixel + atribuição)
 *
 * Carregado por reforma-tributaria.html (LP) e por checkout.html.
 * Faz três coisas:
 *
 *   1. sobe o Pixel da Meta e dispara o PageView;
 *   2. guarda UTMs, fbclid e os ids de campanha da visita, para sobreviverem
 *      ao pulo LP -> checkout -> página de pagamento do Asaas;
 *   3. expõe Track.track(), que dispara o evento no navegador e devolve o
 *      event_id — o mesmo id vai para o servidor, que reenvia o evento pela
 *      Conversions API. Com o id igual, a Meta deduplica e não conta duas vezes.
 *
 * Sem PIXEL_ID configurado nada quebra: a atribuição continua sendo guardada
 * e os eventos viram no-op.
 */
(function (window, document) {
  "use strict";

  // ⚠️ CONFIGURE: ID do Pixel da Meta.
  // Gerenciador de Eventos > Fontes de dados > seu pixel > o número no topo.
  var PIXEL_ID = "1479104856076831";

  var ATTRIB_KEY = "vp_attrib";
  var ATTRIB_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 dias
  // Campos de origem que guardamos. Os *_id vêm dos macros de URL do anúncio
  // ({{campaign.id}} etc.), configurados no campo "Parâmetros de URL".
  var ATTRIB_FIELDS = [
    "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "utm_id",
    "fbclid", "ad_id", "adset_id", "campaign_id",
  ];

  // ── Pixel ──────────────────────────────────────────────────────────
  /* eslint-disable */
  !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
  n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
  (window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
  /* eslint-enable */

  // ── Atribuição ─────────────────────────────────────────────────────
  function readCookie(name) {
    var m = document.cookie.match("(^|; )" + name + "=([^;]*)");
    return m ? decodeURIComponent(m[2]) : "";
  }

  function readStore() {
    try {
      var raw = window.localStorage.getItem(ATTRIB_KEY);
      if (!raw) return null;
      var saved = JSON.parse(raw);
      if (!saved || !saved.ts || Date.now() - saved.ts > ATTRIB_TTL_MS) return null;
      return saved;
    } catch (e) {
      return null;
    }
  }

  function writeStore(data) {
    try {
      window.localStorage.setItem(ATTRIB_KEY, JSON.stringify(data));
    } catch (e) {
      /* modo privado / storage cheio: seguimos só com o que está na URL */
    }
  }

  // Grava a origem da visita. Um clique novo de anúncio (URL com utm_* ou
  // fbclid) sobrescreve o que estava guardado; navegação orgânica preserva a
  // origem paga anterior, senão o último clique interno apagaria a campanha.
  function captureAttribution() {
    var params = new URLSearchParams(window.location.search);
    var fromUrl = {};
    var hasNewTouch = false;

    ATTRIB_FIELDS.forEach(function (field) {
      var value = params.get(field);
      if (value) {
        fromUrl[field] = value;
        hasNewTouch = true;
      }
    });

    var saved = readStore();
    if (!hasNewTouch && saved) return saved;

    fromUrl.ts = Date.now();
    fromUrl.landing_page = window.location.href.split("#")[0];
    writeStore(fromUrl);
    return fromUrl;
  }

  var attribution = captureAttribution();

  // _fbp e _fbc são os cookies que a Meta usa para casar o evento do servidor
  // com o clique. Quando o fbclid chegou pela URL mas o cookie ainda não foi
  // escrito, montamos o _fbc no formato que a Conversions API espera.
  function clickId() {
    var cookie = readCookie("_fbc");
    if (cookie) return cookie;
    if (!attribution.fbclid) return "";
    return "fb.1." + (attribution.ts || Date.now()) + "." + attribution.fbclid;
  }

  // Pacote enviado ao checkout-api junto do pedido, para o evento server-side
  // sair com a mesma identificação do evento do navegador.
  function attributionPayload() {
    var payload = { fbp: readCookie("_fbp"), fbc: clickId() };
    ATTRIB_FIELDS.forEach(function (field) {
      if (attribution[field]) payload[field] = attribution[field];
    });
    payload.event_source_url = window.location.href.split("#")[0];
    return payload;
  }

  // ── Eventos ────────────────────────────────────────────────────────
  function newEventId() {
    if (window.crypto && window.crypto.randomUUID) return window.crypto.randomUUID();
    return "e-" + Date.now() + "-" + Math.random().toString(16).slice(2, 10);
  }

  // Dispara o evento e devolve o event_id usado, para quem chamou repassar ao
  // servidor. Os utm_* vão como custom_data: é o que permite abrir o relatório
  // por campanha mesmo quando a Meta não resolve a atribuição sozinha.
  function fire(standard, eventName, params) {
    var eventId = newEventId();
    if (!PIXEL_ID) return eventId;

    var custom = {};
    ATTRIB_FIELDS.forEach(function (field) {
      if (attribution[field]) custom[field] = attribution[field];
    });
    Object.keys(params || {}).forEach(function (key) {
      custom[key] = params[key];
    });

    window.fbq(standard ? "track" : "trackCustom", eventName, custom, { eventID: eventId });
    return eventId;
  }

  if (PIXEL_ID) {
    window.fbq("init", PIXEL_ID);
    window.fbq("track", "PageView");
  } else if (window.console && console.warn) {
    console.warn("[tracking] PIXEL_ID vazio em tracking.js: nenhum evento será enviado à Meta.");
  }

  window.Track = {
    pixelId: PIXEL_ID,
    // Eventos padrão da Meta (PageView, ViewContent, InitiateCheckout, ...):
    // são os que alimentam a otimização das campanhas.
    track: function (eventName, params) { return fire(true, eventName, params); },
    // Eventos próprios, só para leitura no relatório. A Meta não otimiza por
    // eles sem uma conversão personalizada configurada no Gerenciador.
    custom: function (eventName, params) { return fire(false, eventName, params); },
    attribution: attributionPayload,
  };
})(window, document);
