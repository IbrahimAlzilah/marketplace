import { setRequestLocale } from "next-intl/server";
import { CategoriesPage } from "@/features/categories/components/categories-page";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <CategoriesPage />;
}
