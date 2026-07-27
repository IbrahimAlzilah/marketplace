import { setRequestLocale } from "next-intl/server";
import { SearchPage } from "@/features/search/components/search-page";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <SearchPage />;
}
