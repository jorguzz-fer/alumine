import { Cta } from "./Cta";

const STEPS = [
  "Entender o estágio atual da sua operação",
  "Identificar seus desafios",
  "Mapear oportunidades de crescimento",
  "Verificar se o Método MEDIC faz sentido para o seu momento",
];

export function CtaFinal() {
  return (
    <section className="final section">
      <div className="container">
        <div className="reveal">
          <p className="eyebrow" style={{ textAlign: "center" }}>
            O próximo passo
          </p>
          <h2 className="display">
            Não é comprar uma mentoria.
            <br />
            <span className="grad">
              É entender qual é o próximo nível da sua empresa.
            </span>
          </h2>
          <p className="lead" style={{ margin: "24px auto 0" }}>
            Por isso, antes de qualquer ingresso no Método MEDIC, realizamos uma{" "}
            <strong>Reunião Estratégica</strong>. Essa conversa tem um único
            objetivo:
          </p>
        </div>
        <ul className="final__steps reveal">
          {STEPS.map((s) => (
            <li key={s}>
              <span className="ic" /> {s}
            </li>
          ))}
        </ul>
        <p className="final__scarcity reveal">
          <strong>Nem todos os médicos serão selecionados.</strong> Porque o nosso
          compromisso não é vender vagas — é trabalhar com profissionais
          comprometidos em construir empresas de saúde de alta performance.
        </p>
        <div className="reveal">
          <Cta label="Solicitar agora minha Reunião Estratégica" />
          <p className="fine">
            Ao confirmar, você será direcionado(a) ao WhatsApp para agendar sua
            Reunião Estratégica.
          </p>
        </div>
      </div>
    </section>
  );
}
