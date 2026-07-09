import type { Metadata } from "next";
import { madeOuterSans } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Método MEDIC — Dr. Kleber Ferreira",
  description:
    "A faculdade ensinou você a exercer a Medicina. Mas ninguém ensinou você a construir uma empresa. O Método MEDIC desenvolve a competência empresarial que a universidade nunca ensinou.",
  icons: { icon: "/imgs/favicon.webp" },
  openGraph: {
    title: "Método MEDIC — Dr. Kleber Ferreira",
    description:
      "A metodologia que desenvolve a competência empresarial que a universidade nunca ensinou aos médicos.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={madeOuterSans.variable}>
      <body>{children}</body>
    </html>
  );
}
