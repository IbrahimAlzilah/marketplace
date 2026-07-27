import { setRequestLocale } from "next-intl/server";
import { PharmaciesPage } from "@/features/pharmacies/components/pharmacies-page";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <PharmaciesPage />;
}
