import { setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import { ProductsPage } from "@/components/pages/products-page";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <Suspense>
      <ProductsPage />
    </Suspense>
  );
}
