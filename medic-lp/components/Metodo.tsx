import { Cta } from "./Cta";

const PILLARS = [
  {
    letter: "M",
    title: "Modelagem Estratégica",
    desc: "Transforme consultório e clínica em um negócio preparado para crescer.",
  },
  {
    letter: "E",
    title: "Engenharia Financeira",
    desc: "Aprenda a construir lucro, margem, previsibilidade financeira e patrimônio.",
  },
  {
    letter: "D",
    title: "Desenvolvimento Comercial",
    desc: "Crescimento estruturado sem depender apenas de indicações ou modismos do marketing.",
  },
  {
    letter: "I",
    title: "Inteligência Científica",
    desc: "Ciência, inovação e decisão baseada em evidências como diferenciais competitivos.",
  },
  {
    letter: "C",
    title: "Capital Humano",
    desc: "Construa equipes de alta performance, desenvolva líderes e implemente cultura organizacional.",
  },
];

export function Metodo() {
  return (
    <section className="metodo section" id="metodo">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/imgs/metodo-bg.webp" alt="" aria-hidden className="metodo__bg" />
      <div className="container">
        <div className="head reveal">
          <p className="eyebrow">A metodologia</p>
          <h2 className="display">
            O Método <span className="grad">MEDIC</span>
          </h2>
          <p className="lead">
            Cinco pilares que transformam conhecimento clínico em uma empresa de
            saúde de alta performance.
          </p>
        </div>
        <div className="pillars">
          {PILLARS.map((p) => (
            <div className="pillar reveal" key={p.letter}>
              <div className="pillar__letter">{p.letter}</div>
              <h3 className="pillar__title">{p.title}</h3>
              <p className="pillar__desc">{p.desc}</p>
            </div>
          ))}
        </div>
        <div className="section-cta reveal">
          <Cta />
        </div>
      </div>
    </section>
  );
}
