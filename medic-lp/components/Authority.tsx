const ITEMS = [
  "DNA USP de Inovação",
  "Universidade de São Paulo",
  "Academia de Ciências Farmacêuticas do Brasil",
  "Sigma Xi",
  "Academia Europeia de Imunologia de Tumores",
];

export function Authority() {
  return (
    <section className="authority">
      <div className="container">
        <p className="authority__label reveal">
          Ciência reconhecida nacional e internacionalmente
        </p>
        <div className="authority__row reveal">
          {ITEMS.map((item, i) => (
            <span key={item} style={{ display: "contents" }}>
              <span className="authority__item">{item}</span>
              {i < ITEMS.length - 1 && <span className="authority__dot" />}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
