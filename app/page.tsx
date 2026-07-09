import { Nav } from "@/components/Nav";
import { ScrollFx } from "@/components/ScrollFx";
import { Hero } from "@/components/Hero";
import { Authority } from "@/components/Authority";
import { Diagnostico } from "@/components/Diagnostico";
import { ErroNaoESeu } from "@/components/ErroNaoESeu";
import { Origem } from "@/components/Origem";
import { Mentor } from "@/components/Mentor";
import { Reconhecimento } from "@/components/Reconhecimento";
import { Metodo } from "@/components/Metodo";
import { Virada } from "@/components/Virada";
import { ParaQuem } from "@/components/ParaQuem";
import { CtaFinal } from "@/components/CtaFinal";
import { Footer } from "@/components/Footer";

export default function Page() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Authority />
        <Diagnostico />
        <ErroNaoESeu />
        <Origem />
        <Mentor />
        <Reconhecimento />
        <Metodo />
        <Virada />
        <ParaQuem />
        <CtaFinal />
      </main>
      <Footer />
      <ScrollFx />
    </>
  );
}
