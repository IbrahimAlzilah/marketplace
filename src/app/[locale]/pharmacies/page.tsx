import { setRequestLocale } from "next-intl/server";
import { PharmaciesPage } from "@/components/pages/pharmacies-page";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <PharmaciesPage />;
}
