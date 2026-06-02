// app.jsx — GrowthMinds landing page
// Single React tree. Static JSX = direct-editable; React powers FAQ + tweaks.

const { useState, useEffect, useRef } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "ctaStyle": "benefit",
  "palette": "vet"
} /*EDITMODE-END*/;

const CTA_COPY = {
  direct: {
    primary: "Quero entrar em contato",
    micro: ["Reunião estratégica", "Sem compromisso", "Vagas limitadas por ciclo"]
  },
  benefit: {
    primary: "Quero estruturar minha clínica",
    micro: ["Diagnóstico inicial incluso", "Compromisso de entrega documentado"]
  }
};

const WHATSAPP = "https://wa.me/5511930001873?text=" + encodeURIComponent(
  "Olá! Tenho interesse na mentoria GrowthMinds. Gostaria de agendar a reunião estratégica."
);

// ─── icons ─────────────────────────────────────────────────────
const ArrowUR = ({ size = 14 }) =>
<svg width={size} height={size} viewBox="0 0 14 14" fill="none" className="arrow">
    <path d="M3 11L11 3M11 3H4.5M11 3V9.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>;

const CheckIcon = () =>
<svg viewBox="0 0 12 12" fill="none">
    <path d="M2.5 6L5 8.5L9.5 3.5" stroke="#1a0f08" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>;


// ─── shared CTA component ──────────────────────────────────────
function CtaButton({ ctaCopy, large = false, ghost = false, label }) {
  const text = label || ctaCopy.primary;
  return (
    <a
      href={WHATSAPP}
      target="_blank"
      rel="noopener noreferrer"
      className={`btn ${ghost ? "btn-ghost" : "btn-primary"} ${large ? "btn-large" : ""}`}>
      
      <span>{text}</span>
      <ArrowUR size={large ? 16 : 14} />
    </a>);

}
function CtaMicro({ ctaCopy }) {
  return (
    <div className="cta-micro">
      {ctaCopy.micro.map((m, i) =>
      <React.Fragment key={i}>
          {i > 0 && <span className="dot" />}
          <span>{m}</span>
        </React.Fragment>
      )}
    </div>);

}

// ─── NAV ───────────────────────────────────────────────────────
function Nav({ ctaCopy }) {
  return (
    <header className="nav">
      <div className="nav-inner">
        <div className="nav-brand">
          <img src="assets/alumine-logo.jpg" alt="Alumine" />
          <span className="nav-divider" />
          <span className="nav-program">Programa <b>GROWTHMINDS VET</b></span>
        </div>
        <nav className="nav-links">
          <a href="#diagnostico">Diagnóstico</a>
          <a href="#metodo">Método</a>
          <a href="#casos">Casos</a>
          <a href="#oferta">Mentoria</a>
          <a href="#faq">FAQ</a>
        </nav>
        <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="nav-cta">
          Solicitar reunião <ArrowUR size={12} />
        </a>
      </div>
    </header>);

}

// ─── HERO ──────────────────────────────────────────────────────
function Hero({ ctaCopy }) {
  return (
    <section className="hero" data-screen-label="01 Hero">
      <div className="hero-inner">
        <div className="hero-text">
          <div className="hero-eyebrow-row">
            <span className="eyebrow">Mentoria Estratégica · Setor Veterinário</span>
            <span className="hero-program-badge">GrowthMinds Private</span>
          </div>
          <h1>
            Você construiu uma clínica que <em>funciona.</em>
            <span className="accent-line">O problema é que ela só funciona quando você está presente.</span>
          </h1>
          <p className="hero-sub">O GrowthMinds Vet é uma mentoria de intervenção estratégica para donos de clínicas e hospitais veterinários que já faturam mas percebem que crescer está gerando mais pressão do que retorno.


          </p>
          <div className="cta-block">
            <CtaButton ctaCopy={ctaCopy} large />
            <CtaMicro ctaCopy={ctaCopy} />
          </div>
        </div>

        <div className="hero-portrait">
          <img src="assets/kleber.jpg" alt="Dr. Kleber Ferreira" />
          <div className="mentor-caption">
            <div>
              <div className="role">Mentor responsável</div>
              <div className="who">Dr. Kleber Ferreira</div>
            </div>
            <div className="meta">
              R$ 20M+/ano<br />em operações próprias
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="hero-stats">
          <div className="hero-stat">
            <div className="val"><span className="accent">R$ 20M</span><span style={{ color: "var(--ink-3)", fontSize: "0.5em" }}>+/ano</span></div>
            <div className="label">Operações geridas</div>
          </div>
          <div className="hero-stat">
            <div className="val"><span className="accent">+1.000</span></div>
            <div className="label">Clientes B2B ativos</div>
          </div>
          <div className="hero-stat">
            <div className="val">10<span className="accent">/ano</span></div>
            <div className="label">Mentorias personalizadas</div>
          </div>
          <div className="hero-stat">
            <div className="val"><span className="accent">5</span><span style={{ color: "var(--ink-3)", fontSize: "0.5em" }}> vagas</span></div>
            <div className="label">Ciclo atual</div>
          </div>
        </div>
      </div>
    </section>);

}

// ─── PROPOSTA (Bloco 3) ────────────────────────────────────────
function Proposta() {
  return (
    <section className="section proposta" data-screen-label="02 Proposta">
      <div className="container">
        <div className="proposta-grid">
          <div className="label-col">
            <span className="eyebrow">Diagnóstico inicial</span>
            <h2 className="h-display h-3" style={{ marginTop: 20 }}>
              O padrão silencioso de quem cresce sem estrutura.
            </h2>
          </div>
          <div>
            <p>
              Existe um padrão silencioso nas clínicas veterinárias que crescem.
              <span className="dim"> O faturamento sobe. A demanda aumenta. A equipe cresce.</span>
            </p>
            <p>
              E o dono trabalha mais do que nunca <span className="em">sem saber exatamente por quê o lucro não acompanha.</span>
            </p>
            <p>
              <span className="dim">Não é falta de esforço. Não é falta de competência técnica.</span><br />
              É ausência de estrutura estratégica aplicada ao negócio.
            </p>
            <p>
              O GrowthMinds foi construído para intervir diretamente nesse ponto.
              Não com teoria. Não com frameworks genéricos.
              <span className="em"> Com diagnóstico real, execução acompanhada e resultado mensurável.</span>
            </p>
          </div>
        </div>
      </div>
    </section>);

}

// ─── DOR (Bloco 5) ─────────────────────────────────────────────
const PAIN_ITEMS = [
{ num: "01", text: "Sua clínica fatura bem mas no final do mês, o caixa não reflete isso.", key: "o caixa não reflete isso" },
{ num: "02", text: "Você é o primeiro a chegar e o último a sair, mesmo tendo equipe formada.", key: "mesmo tendo equipe formada" },
{ num: "03", text: "As decisões importantes travam porque dependem de você em tudo.", key: "dependem de você em tudo" },
{ num: "04", text: "Você cresce, mas não sabe exatamente de onde vem a margem nem onde ela está sendo consumida.", key: "onde ela está sendo consumida" },
{ num: "05", text: "Seu marketing gera movimento, mas não consegue medir o retorno real.", key: "não consegue medir o retorno real" },
{ num: "06", text: "A equipe executa mas sem critério, sem indicadores, sem previsibilidade.", key: "sem critério, sem indicadores, sem previsibilidade" }];

function Pain() {
  return (
    <section className="section pain" id="diagnostico" data-screen-label="03 Diagnóstico">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Identificação</span>
          <h2 className="h-display h-2">
            Você reconhece <em className="italic-serif brand-grad">algum desses cenários?</em>
          </h2>
        </div>

        <div className="pain-list">
          {PAIN_ITEMS.map((p) => {
            const [before, ...rest] = p.text.split(p.key);
            const after = rest.join(p.key);
            return (
              <div key={p.num} className="pain-item">
                <span className="num">— {p.num}</span>
                <p>
                  {before}
                  <span className="key">{p.key}</span>
                  {after}
                </p>
              </div>);

          })}
        </div>

        <div className="pain-verdict">
          <span className="badge">Verdict</span>
          <p>
            Se você identificou mais de dois desses pontos, o problema <strong>não é operacional.<br />É estrutural.</strong>
          </p>
        </div>
      </div>
    </section>);

}

// ─── SOLUTION (Bloco 6) ────────────────────────────────────────
function Solution() {
  return (
    <section className="section solution" id="metodo" data-screen-label="04 Método">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">A intervenção</span>
          <h2 className="h-display h-2" style={{ maxWidth: "20ch" }}>
            O GrowthMinds Vet não <em className="italic-serif brand-grad">oferece um curso.</em>
          </h2>
        </div>

        <div className="solution-grid">
          <div className="copy">
            <p>
              Não entrega um método genérico para seguir sozinho.<br />
              O que fazemos é uma <strong>intervenção estratégica direta</strong> no seu negócio.
            </p>
            <p>
              Começamos com um diagnóstico 360° <em>financeiro, comercial, operacional e de liderança.</em>
              A partir daí, construímos um roadmap estratégico personalizado para a realidade da sua clínica.
            </p>
            <p>
              E acompanhamos a execução. Nosso mecanismo é simples e incomum: <strong>decisões tomadas com o
              mesmo rigor aplicado à ciência</strong> análise de contexto, avaliação de variáveis, execução
              controlada e correção de rota baseada em resultado real.
            </p>
            <p style={{ marginTop: 28 }}>
              <em>Não em achismo. Não em intuição.</em><br />
              <strong>Em método, dados e critério estratégico.</strong>
            </p>
          </div>

          <div className="method-card">
            <div className="ttl">Mecanismo · 4 fases</div>
            <ol className="method-steps">
              <li className="method-step">
                <span className="step-num">01</span>
                <div>
                  <div className="step-title">Diagnóstico 360°</div>
                  <div className="step-desc">Auditoria financeira, comercial, operacional e de liderança. Identificação dos gargalos reais  não dos sintomas.</div>
                </div>
              </li>
              <li className="method-step">
                <span className="step-num">02</span>
                <div>
                  <div className="step-title">Roadmap estratégico</div>
                  <div className="step-desc">Plano de intervenção construído sob medida para o estágio da clínica. KPIs, metas e cronograma documentados.</div>
                </div>
              </li>
              <li className="method-step">
                <span className="step-num">03</span>
                <div>
                  <div className="step-title">Execução acompanhada</div>
                  <div className="step-desc">Encontros estratégicos semanais. Decisões revisadas em tempo real. Apoio direto na implementação.</div>
                </div>
              </li>
              <li className="method-step">
                <span className="step-num">04</span>
                <div>
                  <div className="step-title">Correção de rota</div>
                  <div className="step-desc">Avaliação de resultado real, ajuste de variáveis, calibragem do plano com base em dados não em achismo.</div>
                </div>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </section>);

}

// ─── BENEFITS (Bloco 7) ────────────────────────────────────────
const BENEFITS = [
{ n: "01", t: "Você recupera margem.", d: "Identificamos onde o lucro está sendo consumido e corrigimos precificação, estrutura de custos e desalinhamentos financeiros invisíveis." },
{ n: "02", t: "Você para de apagar incêndios.", d: "Processos, papéis e rotinas de gestão são redesenhados para reduzir sua dependência operacional." },
{ n: "03", t: "Sua receita se torna previsível.", d: "Construímos funil comercial, indicadores e estrutura de aquisição de clientes que geram crescimento consistente não por sorte." },
{ n: "04", t: "Decisões mais rápidas e mais seguras.", d: "Passam a ser tomadas com critério estratégico, não sob pressão do momento." },
{ n: "05", t: "Equipe com mais autonomia.", d: "KPIs, playbooks e rotinas que funcionam mesmo quando você não está presente." },
{ n: "06", t: "Você transforma faturamento em caixa.", d: "Reorganizamos o ciclo financeiro para que crescer signifique, de fato, lucrar mais." }];


function Benefits() {
  return (
    <section className="section benefits" data-screen-label="05 Benefícios">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">O que muda na prática</span>
          <h2 className="h-display h-2" style={{ maxWidth: "22ch" }}>
            Você sai da posição de <em className="italic-serif brand-grad">operador</em><br />
            e assume a posição de <em className="italic-serif brand-grad">estrategista.</em>
          </h2>
          <p className="lead">O negócio começa a trabalhar por você não o contrário. Esses são os pontos de intervenção mensurados ao longo dos 6 meses de mentoria.


          </p>
        </div>

        <div className="benefits-list">
          {BENEFITS.map((b) =>
          <div key={b.n} className="benefit">
              <div className="benefit-hdr">
                <span className="benefit-num">{b.n}</span>
                <h3 className="benefit-title">{b.t}</h3>
              </div>
              <p className="benefit-desc">{b.d}</p>
            </div>
          )}
        </div>
      </div>
    </section>);

}

// ─── PROOF (Bloco 8) ───────────────────────────────────────────
function Proof() {
  return (
    <section className="section proof" id="casos" data-screen-label="06 Casos">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Histórico</span>
          <h2 className="h-display h-2" style={{ maxWidth: "20ch" }}>
            Critério construído com <em className="italic-serif brand-grad">resultado real.</em>
          </h2>
        </div>

        <div className="proof-numbers">
          <div className="proof-number">
            <div className="big"><span className="sym">R$</span> 20M<span className="sym">+</span></div>
            <div className="desc">por ano em operações próprias geridas pelo mentor</div>
          </div>
          <div className="proof-number">
            <div className="big"><span className="sym">+</span>1.000</div>
            <div className="desc">clientes B2B ativos na rede de operações</div>
          </div>
          <div className="proof-number">
            <div className="big">Brasil<span className="sym">.</span></div>
            <div className="desc">Liderança na estruturação do maior laboratório de apoio veterinário do país</div>
          </div>
          <div className="proof-number">
            <div className="big">Inovação<span className="sym"></span></div>
            <div className="desc">Histórico documentado com FAPESP, CNPq e SEBRAE</div>
          </div>
        </div>

        <div className="cases">
          {/* Case A */}
          <article className="case-card">
            <span className="case-tag">Case A · Decisão estratégica</span>
            <h3 className="case-headline">
              <strong>R$ 10 milhões</strong> preservados antes do erro acontecer.
            </h3>
            <div className="case-metric-row">
              <div className="case-metric">
                <div className="v">R$ 10M</div>
                <div className="l">Capital preservado</div>
              </div>
              <div className="case-metric">
                <div className="v">Pré-clínica</div>
                <div className="l">Fase de aborto</div>
              </div>
            </div>
            <div className="case-body">
              <p>
                Uma farmacêutica veterinária planejava executar o desenvolvimento completo de um novo produto estudos pré-clínicos, clínicos e registro regulatório com forte convicção técnica, mas 

                <strong>sem validação integrada de viabilidade econômica</strong>.
              </p>
              <p>
                O diagnóstico identificou: <strong>taxa de retorno inferior ao custo de capital</strong>,
                mercado endereçável superestimado e soluções substitutas já consolidadas.
                Decisão tomada: abortar antes das fases experimentais avançadas.
              </p>
            </div>
            <blockquote className="case-quote">O papel da gestão estratégica não é apenas viabilizar ideias é impedir erros caros.

            </blockquote>
          </article>

          {/* Case B */}
          <article className="case-card">
            <span className="case-tag">Case B · Reestruturação financeira</span>
            <h3 className="case-headline">
              <strong>80% da dívida</strong> reduzida em 6 meses.
            </h3>
            <div className="case-metric-row">
              <div className="case-metric">
                <div className="v">−80%</div>
                <div className="l">Endividamento</div>
              </div>
              <div className="case-metric">
                <div className="v">6 meses</div>
                <div className="l">Janela de execução</div>
              </div>
            </div>
            <div className="case-body">
              <p>
                Uma rede de clínicas veterinária iniciou a mentoria em colapso financeiro:
                <strong> R$ 600.000 em endividamento acumulado</strong>, faturamento sem geração de caixa
                e pressão constante de credores.
              </p>
              <p>
                Intervenções: engenharia de caixa, renegociação bancária, reestruturação fiscal,
                controle financeiro gerencial. Resultados: redução de 80% da dívida, aumento de
                margem operacional e fluxo de caixa previsível.
              </p>
            </div>
            <blockquote className="case-quote">O problema não era faturamento  era estrutura financeira.

            </blockquote>
          </article>

          {/* Case C — vet (featured) */}
          <article className="case-card featured">
            <span className="case-tag">Case C · Clínica veterinária</span>
            <h3 className="case-headline">
              <strong>+40% de faturamento</strong> com margem e previsibilidade.
            </h3>
            <div className="case-metric-row">
              <div className="case-metric">
                <div className="v">+40%</div>
                <div className="l">Faturamento</div>
              </div>
              <div className="case-metric">
                <div className="v">6 meses</div>
                <div className="l">Intervenção</div>
              </div>
            </div>
            <div className="case-body">
              <p>
                Uma clínica veterinária chegou na mentoria em um cenário comum em empresas da saúde:
                <strong> faturamento crescendo, mas operação perdendo eficiência, previsibilidade e margem.</strong>
                O gargalo real não era demanda — era estrutura de gestão.
              </p>
              <p>
                Atuamos em três frentes: <strong>reestruturação operacional</strong> (padronização de
                processos, indicadores, redução de desperdícios), <strong>gestão estratégica e
                financeira</strong> (análise de margem, controle financeiro, eficiência comercial) e
                <strong> posicionamento</strong> (percepção de valor, organização comercial).
              </p>
            </div>
            <blockquote className="case-quote">
              O resultado não foi apenas crescer. Foi crescer com mais organização, margem e capacidade de escala.
            </blockquote>
          </article>
        </div>
      </div>
    </section>);

}

// ─── OFFER (Bloco 9) ───────────────────────────────────────────
const OFFER_ITEMS = [
"Redução da dependência do proprietário",
"Previsibilidade de vendas",
"Estruturação da equipe administrativa e médica",
"Retenção de clientes e captação de novos",
"Redução de custos e otimização de gastos",
"Construção de indicadores para tomada de decisão",
"Revisão estratégica de precificação",
"Automações estratégicas",
"Aumento de margem de lucro",
"Suporte contínuo via grupo exclusivo",
"Crescimento estruturado",
"Compromisso de entrega documentado"];


function Offer({ ctaCopy }) {
  return (
    <section className="section offer" id="oferta" data-screen-label="07 Oferta">
      <div className="container">
        <div className="section-head" style={{ textAlign: "center", alignItems: "center" }}>
          <span className="eyebrow no-dash" style={{ alignSelf: "center" }}>A oferta</span>
          <h2 className="h-display h-2" style={{ textAlign: "center" }}>
            GrowthMinds <em className="italic-serif brand-grad">Vet Private.</em>
          </h2>
          <p className="lead" style={{ textAlign: "center", margin: "0 auto" }}>
            Mentoria individual. Acompanhamento executivo direto. Vagas limitadas por ciclo.
          </p>
        </div>

        <div className="offer-card">
          <div className="offer-head">
            <h3 className="offer-name">
              <span className="tier">Mentoria Individual · 6 meses</span>
              GrowthMinds Private
            </h3>
            <span className="offer-tag">Acompanhamento Executivo Direto</span>
          </div>

          <div className="offer-grid">
            {OFFER_ITEMS.map((item, i) =>
            <div key={i} className="offer-item">
                <span className="check"><CheckIcon /></span>
                <span className="name" style={{ color: "rgb(245, 241, 234)" }}>{item}</span>
                <span className="meta">Incluso</span>
              </div>
            )}
          </div>

          <div className="offer-pricing">
            <div>
              <div className="offer-price-label">Investimento</div>
              <div className="offer-price-value">
                <span className="from">a partir de</span>
                <span className="amount">10 x R$ 1.800</span>
              </div>
              <div className="offer-price-note">Parcelamento disponível · Condições apresentadas na reunião estratégica</div>
            </div>
            <div className="cta-block" style={{ alignItems: "flex-end" }}>
              <CtaButton ctaCopy={ctaCopy} large />
              <CtaMicro ctaCopy={ctaCopy} />
            </div>
          </div>

          <div className="offer-compare">
            <span className="ic">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 1.5L9.8 5.8L14.5 6.3L11 9.5L12 14L8 11.6L4 14L5 9.5L1.5 6.3L6.2 5.8L8 1.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
              </svg>
            </span>
            <p>
              Empresas nesse estágio normalmente resolvem isso contratando um gerente experiente <strong>custo recorrente acima de R$ 10.000/mês
              </strong>. O GrowthMinds estrutura essa mesma camada estratégica
              sem ampliar sua folha de pagamento.
            </p>
          </div>
        </div>
      </div>
    </section>);

}

// ─── OBJECTIONS (Bloco 10) ─────────────────────────────────────
const OBJECTIONS = [
{ tag: "Maturidade", q: "Minha clínica ainda não está pronta para isso.", a: "O problema raramente é o tamanho da clínica. O problema é continuar crescendo sem estrutura. Quanto mais você cresce sem intervenção, mais caro fica corrigir depois. O momento ideal para estruturar não é quando a crise chega é antes dela." },
{ tag: "Consultoria", q: "Já tentei consultorias antes e não funcionou.", a: "A diferença entre uma consultoria genérica e o GrowthMinds é a execução acompanhada. Não entregamos um documento e nos retiramos. Atuamos diretamente sobre os gargalos do negócio, ao lado do gestor, durante os 6 meses de mentoria." },
{ tag: "Tempo", q: "Não tenho tempo para participar de uma mentoria.", a: "Justamente por isso a mentoria existe. A ausência de tempo é sintoma direto de dependência operacional excessiva e esse é um dos primeiros gargalos que intervimos. Você não precisa de mais horas. Precisa que as horas que você já tem gerem mais resultado." },
{ tag: "Investimento", q: "O investimento é alto.", a: "O custo de manter uma operação desorganizada margens comprimidas, decisões erradas, crescimento sem previsibilidade tende a ser muito maior do que o investimento em estruturação estratégica. O Case B nesta página é um exemplo direto: o problema não era faturamento, era estrutura." },
{ tag: "Crescimento", q: "Minha clínica já está crescendo.", a: "Crescimento sem previsibilidade, margem controlada e gestão estruturada gera fragilidade operacional no médio prazo. Faturamento crescente com lucro estagnado é sinal de problema de estrutura, não de sucesso consolidado." }];


function Objections() {
  return (
    <section className="section objections" data-screen-label="08 Objeções">
      <div className="container narrow">
        <div className="section-head">
          <span className="eyebrow">Objeções comuns</span>
          <h2 className="h-display h-2" style={{ maxWidth: "20ch" }}>
            Vamos antecipar <em className="italic-serif brand-grad">o que você está pensando.</em>
          </h2>
        </div>

        <div className="obj-list">
          {OBJECTIONS.map((o, i) =>
          <div key={i} className="obj-item">
              <span className="obj-q">— {o.tag}</span>
              <div>
                <p className="obj-quote">{o.q}</p>
                <p className="obj-ans">{o.a}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>);

}

// ─── GUARANTEE (Bloco 11) ──────────────────────────────────────
function Guarantee() {
  // SVG circular text for the seal
  return (
    <section className="section guarantee" data-screen-label="09 Garantia">
      <div className="container">
        <div className="guarantee-card">
          <div className="seal">
            <div className="seal-ring"></div>
            <div className="seal-ring inner"></div>
            <div className="seal-rotating">
              <svg viewBox="0 0 400 400" style={{ color: "var(--copper)" }}>
                <defs>
                  <path id="circle-path" d="M 200, 200 m -170, 0 a 170,170 0 1,1 340,0 a 170,170 0 1,1 -340,0" />
                </defs>
                <text fill="currentColor" fontFamily="Geist Mono, monospace" fontSize="13" letterSpacing="6">
                  <textPath href="#circle-path">
                    COMPROMISSO GROWTHMINDS · ENTREGA DOCUMENTADA · RASTREÁVEL · ORIENTADA A RESULTADO ·&nbsp;
                  </textPath>
                </text>
              </svg>
            </div>
            <div className="seal-content">
              <div className="top">Compromisso · Privado</div>
              <div className="main">Entrega<br />documentada.</div>
              <div className="bot">Roadmap formalizado · KPIs auditáveis · Relatórios de acompanhamento</div>
            </div>
          </div>

          <div className="copy">
            <span className="eyebrow">Garantia</span>
            <h3 style={{ marginTop: 18 }}>O GrowthMinds não opera com promessas vagas.</h3>
            <p>
              Cada mentoria é conduzida com <strong>compromisso de entrega documentado</strong>:
              roadmap estratégico formalizado, KPIs definidos e auditáveis, relatórios de acompanhamento
              e entregas práticas a cada encontro.
            </p>
            <p>
              Você não está contratando uma consultoria que entrega um PDF e desaparece. Está contratando
              um <strong>processo de intervenção estratégica</strong> com critério, método e responsabilidade
              sobre a execução do diagnóstico ao encerramento da mentoria.
            </p>
          </div>
        </div>
      </div>
    </section>);

}

// ─── URGENCY (Bloco 12) ────────────────────────────────────────
function Urgency({ ctaCopy }) {
  // 10 slots/year — 5 already taken, 5 open
  const slots = Array.from({ length: 10 }, (_, i) => i < 5 ? "filled" : "available");
  return (
    <section className="section urgency" data-screen-label="10 Urgência">
      <div className="container">
        <div className="urgency-grid">
          <div>
            <span className="eyebrow">Vagas · Ciclo {new Date().getFullYear() + 1}</span>
            <h2 className="h-display h-2" style={{ marginTop: 20, marginBottom: 28, maxWidth: "18ch" }}>
              Por design, <em className="italic-serif brand-grad">a operação é restrita.</em>
            </h2>
            <p className="lead">
              O GrowthMinds Vet VPrivate opera com no máximo <strong style={{ color: "var(--ink-1)" }}>10 mentorados por ano</strong>.
              A mentoria individual exige acompanhamento executivo próximo e personalizado por isso o
              número de mentorados ativos simultâneos é intencionalmente restrito.
            </p>
            <p className="lead" style={{ marginTop: 18 }}>
              Quando as vagas do ciclo atual encerram, a próxima entrada depende de disponibilidade no
              ciclo seguinte. <span className="italic-serif" style={{ color: "var(--copper)" }}>Se você está avaliando, o momento de solicitar a reunião é agora.</span>
            </p>

            <div style={{ marginTop: 40 }}>
              <CtaButton ctaCopy={ctaCopy} large />
            </div>
          </div>

          <div className="vagas-tracker">
            <div className="row-top">
              <span className="lbl">Capacidade do ciclo</span>
              <span className="year">10 mentorados / ano</span>
            </div>
            <div className="vagas-dots">
              {slots.map((s, i) =>
              <div key={i} className={`vagas-dot ${s}`} title={s === "filled" ? `Vaga ${i + 1} — preenchida` : `Vaga ${i + 1} — disponível`} />
              )}
            </div>
            <div className="vagas-summary">
              <div className="vagas-stat taken">
                <div className="v">05</div>
                <div className="l">Vagas preenchidas</div>
              </div>
              <div className="vagas-stat open">
                <div className="v">05</div>
                <div className="l">Vagas disponíveis</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>);

}

// ─── FAQ (Bloco 13) ────────────────────────────────────────────
const FAQ_ITEMS = [
{ q: "Quanto tempo preciso dedicar por semana?", a: "Os encontros estratégicos são semanais, com duração definida conforme o estágio da mentoria. O que muda não é o tempo que você investe é a qualidade das decisões que esse tempo gera." },
{ q: "Serve para clínicas em fase inicial ou só para operações maiores?", a: "O perfil ideal são clínicas e hospitais que já faturam entre R$ 50 mil e R$ 1 milhão/mês, com equipe operacional formada. Se você está abaixo disso, possuímos outra solução." },
{ q: "Como funciona o acompanhamento durante os 6 meses?", a: "Encontros estratégicos semanais, suporte contínuo via grupo exclusivo no WhatsApp com acesso direto ao mentor e possibilidade de mentores externos conforme a necessidade do negócio." },
{ q: "A mentoria é focada em clínica ou também atende hospital e médicos volantes?", a: "Atendemos clínicas, hospitais 24h, centros cirúrgicos, clínicas de especialidade (oncologia, ortopedia, dermato, etc.) e operações multi-unidades. A estrutura estratégica se adapta ao modelo de operação o método é o mesmo, a aplicação é específica." },
{ q: "E se eu sou sócio de uma clínica, mas não sou o veterinário responsável técnico?", a: "Sem problema. A mentoria é direcionada a quem ocupa o papel de gestão da empresa sócio, CEO ou diretor administrativo. O conhecimento técnico veterinário não é pré-requisito; o que importa é responsabilidade sobre resultado, decisão e estratégia do negócio." },
{ q: "Vocês olham os números da minha clínica? Como funciona o sigilo?", a: "Sim. O diagnóstico exige acesso a DRE, fluxo de caixa, mix de procedimentos, ticket médio, custo por atendimento e estrutura de equipe. Todas as informações são tratadas sob acordo de confidencialidade (NDA) formalizado antes do início da mentoria." },
{ q: "Já tenho contador, gerente e marketing. A mentoria substitui essas funções?", a: "Não. A mentoria não substitui orquestra. O que falta na maioria das clínicas não é execução, é direção estratégica que integre essas áreas. Atuamos no nível acima: o que cada função precisa entregar para que o negócio gere margem, previsibilidade e escala." },
{ q: "Quanto tempo até eu ver resultado financeiro real?", a: "Primeiros ganhos de margem geralmente aparecem entre o 2º e o 3º mês vindos de correção de precificação, identificação de vazamentos e reorganização de custos. Resultados estruturais (previsibilidade comercial, autonomia da equipe, crescimento sustentado) consolidam entre o 4º e o 6º mês." },
{ q: "Existe garantia financeira?", a: "Não trabalhamos com garantia de devolução financeira. Trabalhamos com compromisso de entrega documentado roadmap, KPIs auditáveis e relatórios de acompanhamento. A responsabilidade sobre a execução é compartilhada: o método é nosso, a implementação é construída junto." },
{ q: "O mentor acompanha diretamente ou delega para uma equipe?", a: "O acompanhamento executivo é conduzido diretamente pelo Dr. Kleber Ferreira, com possibilidade de apoio de mentores externos em áreas específicas (jurídico, tributário, marketing, RH) conforme a demanda do negócio." },
{ q: "O que acontece quando os 6 meses encerram?", a: "Você sai com a operação estruturada, indicadores rodando, equipe alinhada e roadmap dos próximos 12 meses formalizado. Há possibilidade de renovação para um ciclo de manutenção estratégica, mas é opcional a mentoria foi desenhada para que você opere com autonomia ao final do ciclo." },
{ q: "Quais são as formas de pagamento?", a: "Parcelamento disponível em até 12x. Aceitamos cartão, boleto e PIX. Condições detalhadas são apresentadas na reunião estratégica de avaliação." },
{ q: "Como solicito minha vaga?", a: "Pelo botão de CTA acima ou abaixo. O primeiro passo é uma reunião estratégica para avaliação do fit entre o estágio da sua clínica e o formato mais adequado da mentoria. Sem compromisso." }];


function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section className="section faq" id="faq" data-screen-label="11 FAQ">
      <div className="container narrow">
        <div className="section-head">
          <span className="eyebrow">Perguntas frequentes</span>
          <h2 className="h-display h-2" style={{ maxWidth: "18ch" }}>
            Tudo que <em className="italic-serif brand-grad">você quer saber.</em>
          </h2>
        </div>

        <div className="faq-list">
          {FAQ_ITEMS.map((item, i) =>
          <div key={i} className={`faq-item ${open === i ? "open" : ""}`}>
              <button className="faq-q" onClick={() => setOpen(open === i ? -1 : i)}>
                <span>{item.q}</span>
                <span className="ic" aria-hidden="true" />
              </button>
              <div className="faq-a">
                <div className="faq-a-inner">{item.a}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>);

}

// ─── FINAL CTA (Bloco 14) ──────────────────────────────────────
function FinalCta({ ctaCopy }) {
  return (
    <section className="section final-cta" data-screen-label="12 CTA Final">
      <div className="container final-cta-inner">
        <span className="eyebrow no-dash" style={{ marginBottom: 24 }}>O próximo passo</span>
        <h2>
          Sua clínica chegou até aqui pelo seu <span className="accent">esforço.</span><br />
          O próximo estágio vai depender de mais <span className="accent">gestão e estrutura.</span>
        </h2>
        <p>Empresários que operam com método, indicadores e estratégia clara não trabalham mais trabalham com mais precisão. Se você quer que a sua clínica cresça com previsibilidade, margem controlada e menos dependência de você, o caminho começa com uma conversa.



        </p>
        <div className="ctas">
          <CtaButton ctaCopy={{ ...ctaCopy, primary: "Solicitar reunião estratégica" }} large />
          <CtaMicro ctaCopy={{ micro: ["Sem compromisso", "Vagas limitadas por ciclo", "Atendimento direto com o mentor"] }} />
        </div>
      </div>
    </section>);

}

// ─── PS (Bloco 15) ─────────────────────────────────────────────
function PS() {
  return (
    <section className="section ps" data-screen-label="13 PS">
      <div className="container narrow">
        <div className="ps-inner">
          <div className="ps-label">P.S.</div>
          <div className="ps-body">
            <p>O GrowthMinds Vet não é para quem quer motivação. É para quem quer intervir no negócio com critério e sair do outro lado com uma empresa mais previsível, mais lucrativa e menos dependente de você.



            </p>
            <p>
              Se chegou até aqui, você já sabe que o problema existe. A diferença entre quem resolve
              e quem adia está na decisão de agir agora.
            </p>
            <p>Vagas do ciclo atual são limitadas. Solicite sua reunião estratégica antes do encerramento.</p>
          </div>
        </div>
      </div>
    </section>);

}

// ─── FOOTER ────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <img src="assets/alumine-logo.jpg" alt="Alumine" />
          <span className="nav-divider" />
          <span className="nav-program">Programa <b>GrowthMinds</b></span>
        </div>
        <div className="footer-meta">
          <span>© Alumine · {new Date().getFullYear()}</span>
          <span>WhatsApp · (11) 93000-1873</span>
          <span>Mentoria Estratégica Privada</span>
        </div>
      </div>
    </footer>);

}

// ─── TWEAKS PANEL ──────────────────────────────────────────────
function GrowthTweaks({ t, setTweak }) {
  return (
    <TweaksPanel>
      <TweakSection label="Paleta" />
      <TweakRadio
        label="Direção visual"
        value={t.palette}
        options={[
        { value: "vet", label: "Verde Vet" },
        { value: "copper", label: "Cobre" }]
        }
        onChange={(v) => setTweak("palette", v)} />
      
      <div style={{
        fontSize: 11,
        color: "rgba(41,38,27,.55)",
        padding: "8px 10px",
        background: "rgba(0,0,0,.04)",
        borderRadius: 8,
        marginTop: 4,
        lineHeight: 1.5
      }}>
        <b>Verde Vet:</b> sage + forest, alusão clínica<br />
        <b>Cobre:</b> cobre + ameixa, boutique premium
      </div>

      <TweakSection label="CTA" />
      <TweakRadio
        label="Estilo do CTA"
        value={t.ctaStyle}
        options={[
        { value: "direct", label: "Ação direta" },
        { value: "benefit", label: "Benefício" }]
        }
        onChange={(v) => setTweak("ctaStyle", v)} />
      
      <div style={{
        fontSize: 11,
        color: "rgba(41,38,27,.55)",
        padding: "8px 10px",
        background: "rgba(0,0,0,.04)",
        borderRadius: 8,
        marginTop: 4,
        lineHeight: 1.5
      }}>
        <b>Ação direta:</b> "Quero entrar em contato"<br />
        <b>Benefício:</b> "Quero estruturar minha clínica"
      </div>
    </TweaksPanel>);

}

// ─── APP ROOT ──────────────────────────────────────────────────
function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const ctaCopy = CTA_COPY[t.ctaStyle] || CTA_COPY.benefit;

  useEffect(() => {
    document.body.classList.toggle("palette-vet", t.palette === "vet");
  }, [t.palette]);

  return (
    <>
      <Nav ctaCopy={ctaCopy} />
      <main>
        <Hero ctaCopy={ctaCopy} />
        <Proposta />
        <Pain />
        <Solution />
        <Benefits />
        <Proof />
        <Offer ctaCopy={ctaCopy} />
        <Objections />
        <Guarantee />
        <Urgency ctaCopy={ctaCopy} />
        <Faq />
        <FinalCta ctaCopy={ctaCopy} />
        <PS />
      </main>
      <Footer />
      <GrowthTweaks t={t} setTweak={setTweak} />
    </>);

}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);