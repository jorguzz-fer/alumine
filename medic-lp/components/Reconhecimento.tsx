const SEALS = [
  { img: "/imgs/selo-acfb.webp", name: "Academia de Ciências Farmacêuticas do Brasil (ACFB)" },
  { img: "/imgs/selo-eati.webp", name: "Academia Europeia de Imunologia de Tumores (EATI)" },
  { img: "/imgs/selo-sigmaxi.webp", name: "Sigma Xi — The Scientific Research Honor Society" },
];

export function Reconhecimento() {
  return (
    <section className="recon section">
      <div className="container">
        <div className="split">
          <div className="split__copy reveal">
            <p className="eyebrow">Reconhecimento internacional</p>
            <h2 className="display">Ciência e negócios no mesmo lugar</h2>
            <p>
              Uma trajetória que uniu o mundo acadêmico e o empresarial —
              transformando ciência e inovação em empresas de impacto real na área
              da saúde.
            </p>
          </div>
          <div className="split__media reveal">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/imgs/recon.webp" alt="Dr. Kleber Ferreira" />
          </div>
        </div>
        <div className="seals">
          {SEALS.map((s) => (
            <div className="seal reveal" key={s.name}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.img} alt={s.name} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
