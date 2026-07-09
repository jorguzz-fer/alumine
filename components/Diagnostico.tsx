export function Diagnostico() {
  return (
    <section className="diag section">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/imgs/diagnostico.webp" alt="" aria-hidden className="diag__bg" />
      <div className="container">
        <div className="diag__stack reveal">
          <h2 className="display">Se você é médico…</h2>
          <p>Provavelmente já percebeu que existe algo estranho no mercado.</p>
          <p className="punch">
            Há profissionais excelentes tecnicamente que vivem sobrecarregados.
          </p>
          <p>
            Consultórios cheios. Agenda lotada. Mas pouca previsibilidade. Pouca
            liberdade. Pouco crescimento.
          </p>
          <p>
            Enquanto isso, outros médicos conseguem construir clínicas que crescem{" "}
            <strong>mesmo quando eles não estão atendendo</strong>.
          </p>
          <p>
            A diferença raramente está na competência clínica. Está na capacidade
            de construir uma empresa.
          </p>
          <p>
            E essa habilidade praticamente nunca é ensinada na graduação,
            residência ou especialização.
          </p>
        </div>
      </div>
    </section>
  );
}
