import localFont from "next/font/local";

// MADE Outer Sans — a mesma fonte display do design original (Alumine/GrowthMinds)
export const madeOuterSans = localFont({
  src: [
    {
      path: "../public/fonts/MADEOuterSans-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/MADEOuterSans-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-made",
  display: "swap",
});
