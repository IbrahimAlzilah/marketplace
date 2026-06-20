import { setRequestLocale } from "next-intl/server";
import { AddressesPage } from "@/components/pages/addresses-page";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <AddressesPage />;
}
