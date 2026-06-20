import { setRequestLocale } from "next-intl/server";
import { OrdersPage } from "@/components/pages/orders-page";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <OrdersPage />;
}
