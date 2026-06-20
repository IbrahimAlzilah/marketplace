import { setRequestLocale } from "next-intl/server";
import { SearchPage } from "@/components/pages/search-page";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <SearchPage />;
}
