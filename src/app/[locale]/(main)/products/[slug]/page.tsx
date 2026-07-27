import { setRequestLocale } from "next-intl/server";
import { ProductDetailPage } from "@/features/products";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  return <ProductDetailPage slug={slug} />;
}
