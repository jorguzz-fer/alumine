const ESTUDOU = [
  "Anatomia",
  "Fisiologia",
  "Farmacologia",
  "Diagnóstico",
  "Condutas terapêuticas",
];

const NINGUEM = [
  "Contratar pessoas",
  "Desenvolver líderes",
  "Controlar indicadores",
  "Construir margem",
  "Crescer sem perder qualidade",
  "Transformar conhecimento em patrimônio",
];

export function ErroNaoESeu() {
  return (
    <section className="section">
      <div className="container">
        <div className="head reveal">
          <h2 className="display">O erro não é seu.</h2>
          <p className="lead">
            Você foi treinado para tomar decisões clínicas — não para tomar
            decisões empresariais.
          </p>
        </div>
        <div className="cols">
          <div className="panel panel--ok reveal">
            <p className="panel__title">Você estudou durante anos:</p>
            <ul className="list">
              {ESTUDOU.map((i) => (
                <li key={i}>
                  <span className="ic ic--ok">✓</span> {i}
                </li>
              ))}
            </ul>
          </div>
          <div className="panel panel--no reveal">
            <p className="panel__title">Mas ninguém mostrou como:</p>
            <ul className="list">
              {NINGUEM.map((i) => (
                <li key={i}>
                  <span className="ic ic--no">→</span> {i}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="erro__foot reveal">
          Por isso tantos médicos extremamente competentes permanecem{" "}
          <strong>presos dentro da própria operação</strong>.
        </p>
      </div>
    </section>
  );
}
