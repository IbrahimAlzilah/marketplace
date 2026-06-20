import { setRequestLocale } from "next-intl/server";
import { PharmacyDetailPage } from "@/components/pages/pharmacy-detail-page";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  return <PharmacyDetailPage slug={slug} />;
}
