import { setRequestLocale } from "next-intl/server";
import { CheckoutPage } from "@/components/pages/checkout-page";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <CheckoutPage />;
}
