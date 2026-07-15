import localFont from "next/font/local";

export const coHeadline = localFont({
  src: [
    {
      path: "../../public/fonts/CoHeadlineTrial-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/CoHeadlineTrial-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/CoHeadlineTrial-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-co-headline",
  display: "swap",
  fallback: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
});

export const arabKufi = localFont({
  src: [
    {
      path: "../../public/fonts/ArbFontsArabicKufiRegular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/ArbFontsArabicKufiMedium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/ArbFontsArabicKufiBold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-arab-kufi",
  display: "swap",
  fallback: ["system-ui", "-apple-system", "sans-serif"],
});
