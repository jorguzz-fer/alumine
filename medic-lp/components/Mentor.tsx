export function Mentor() {
  return (
    <section className="mentor section">
      <div className="container split">
        <div className="split__copy reveal">
          <p className="eyebrow">Quem desenvolveu o Método MEDIC?</p>
          <h2 className="display">Dr. Kleber Ferreira</h2>
          <p>
            Minha trajetória sempre transitou entre dois universos que raramente
            caminham juntos.
          </p>
          <p>
            <strong>De um lado, a ciência.</strong> Pesquisador na Universidade de
            São Paulo, formação internacional e participação em algumas das mais
            respeitadas academias científicas do mundo.
          </p>
          <p>
            <strong>Do outro, a construção de empresas.</strong> Empresas da área
            da saúde desenvolvidas com foco em inovação, gestão, crescimento
            sustentável e geração de valor.
          </p>
          <p>
            Essa combinação resultou em negócios reconhecidos pelo{" "}
            <strong>selo DNA USP de Inovação</strong>, concedido às empresas
            originadas do ecossistema de inovação da Universidade de São Paulo.
          </p>
          <p>
            Ao longo da minha carreira, percebi um padrão. Médicos acumulavam
            conhecimento clínico extraordinário — mas quase nunca recebiam
            formação para construir empresas extraordinárias. Foi para resolver
            esse problema que desenvolvi o Método MEDIC.
          </p>
        </div>
        <div className="split__media mentor__media reveal">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/imgs/mentor.webp" alt="Dr. Kleber Ferreira" />
        </div>
      </div>
    </section>
  );
}
