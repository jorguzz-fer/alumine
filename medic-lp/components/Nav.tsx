import { Cta } from "./Cta";

export function Nav() {
  return (
    <header className="nav" id="nav">
      <a href="#top" aria-label="Dr. Kleber Ferreira — Método MEDIC">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/imgs/logo.svg" alt="Método MEDIC" className="nav__logo" />
      </a>
      <Cta size="md" className="btn--nav" />
    </header>
  );
}
