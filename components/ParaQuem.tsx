const ITEMS = [
  "Médicos que desejam construir empresas",
  "Proprietários de clínicas",
  "Sócios de operações de saúde",
  "Médicos que querem crescer sem perder qualidade",
  "Profissionais que desejam transformar conhecimento em patrimônio",
];

export function ParaQuem() {
  return (
    <section className="section">
      <div className="container">
        <div className="head reveal">
          <h2 className="display">Para quem é este programa?</h2>
        </div>
        <ul className="whom">
          {ITEMS.map((i) => (
            <li className="reveal" key={i}>
              <span className="ic">✔</span> {i}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
