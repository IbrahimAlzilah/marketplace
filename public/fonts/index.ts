import localFont from "next/font/local";

/**
 * CoHeadline Trial — Primary Latin font (sans-serif, display/heading quality)
 * Multiple weights loaded since these are non-variable .ttf files.
 * Variable: --font-co-headline
 */
export const coHeadline = localFont({
  src: [
    {
      path: "./CoHeadlineTrial-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "./CoHeadlineTrial-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./CoHeadlineTrial-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-co-headline",
  display: "swap",
  preload: true, // Primary body/UI font — preload for LCP
  fallback: [
    "ui-sans-serif",
    "system-ui",
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "sans-serif",
  ],
});

/**
 * ArbFonts Arabic Kufi — Arabic script font
 * Three weights for Arabic text rendering.
 * Variable: --font-arabic-kufi
 */
export const arabicKufi = localFont({
  src: [
    {
      path: "./ArbFontsArabicKufiRegular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./ArbFontsArabicKufiMedium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./ArbFontsArabicKufiBold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-arabic-kufi",
  display: "swap",
  preload: false, // Loaded on demand (Arabic locale pages)
  fallback: [
    "Noto Sans Arabic",
    "Arabic UI Text",
    "Tahoma",
    "sans-serif",
  ],
});
