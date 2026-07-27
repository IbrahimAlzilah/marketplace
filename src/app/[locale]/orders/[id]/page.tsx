import { setRequestLocale } from "next-intl/server";
import { OrderDetailPage } from "@/features/orders/components/order-detail-page";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  return <OrderDetailPage id={id} />;
}
