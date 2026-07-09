const SHIFTS = [
  {
    from: "Você deixa de pensar como proprietário de consultório.",
    to: "Passa a pensar como construtor de empresas.",
  },
  {
    from: "Suas decisões deixam de ser reativas.",
    to: "Passam a ser estratégicas.",
  },
  {
    from: "Sua clínica deixa de depender exclusivamente do seu esforço.",
    to: "Passa a operar com processos.",
  },
  {
    from: "Você deixa de crescer apenas aumentando consultas.",
    to: "Passa a crescer aumentando valor.",
  },
];

export function Virada() {
  return (
    <section className="virada section">
      <div className="container">
        <div className="head reveal">
          <h2 className="display">O que muda depois do Método MEDIC?</h2>
        </div>
        <div className="shifts">
          {SHIFTS.map((s) => (
            <div className="shift reveal" key={s.from}>
              <span className="shift__from">{s.from}</span>
              <span className="shift__arrow">→</span>
              <span className="shift__to">{s.to}</span>
            </div>
          ))}
        </div>
        <p className="virada__punch grad reveal">
          Faturamento não constrói patrimônio.
          <br />
          Empresas bem estruturadas, sim.
        </p>
      </div>
    </section>
  );
}
