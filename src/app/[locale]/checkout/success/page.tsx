import { setRequestLocale } from "next-intl/server";
import { CheckoutSuccessPage } from "@/features/checkout/components/checkout-success-page";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <CheckoutSuccessPage />;
}
