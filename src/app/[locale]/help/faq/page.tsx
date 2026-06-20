import { setRequestLocale } from "next-intl/server";
import { FaqPage } from "@/components/pages/faq-page";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <FaqPage />;
}
