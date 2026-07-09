import { Cta } from "./Cta";

export function Hero() {
  return (
    <section className="hero section" id="top">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/imgs/hero.webp" alt="Dr. Kleber Ferreira" className="hero__img" />
      <div className="container">
        <div className="hero__inner reveal">
          <h1 className="display">
            A faculdade ensinou você
            <br />
            a exercer a Medicina.
            <br />
            <span className="grad">
              Mas ninguém ensinou você a construir uma empresa.
            </span>
          </h1>
          <p className="lead">
            Existe uma diferença enorme entre ser um excelente médico e construir
            uma clínica altamente lucrativa, organizada e preparada para crescer.
          </p>
          <p className="lead">
            Foi para preencher essa lacuna que nasceu o{" "}
            <strong>Método MEDIC</strong>: uma metodologia criada para desenvolver
            a competência empresarial que a universidade nunca ensinou.
          </p>
          <div className="hero__cta">
            <Cta />
            <a href="#metodo" className="btn btn--ghost btn--lg">
              Conhecer o método
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
