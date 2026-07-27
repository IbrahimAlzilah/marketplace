import { setRequestLocale } from "next-intl/server";
import { LegalPage } from "@/features/support";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <LegalPage type="terms" />;
}
