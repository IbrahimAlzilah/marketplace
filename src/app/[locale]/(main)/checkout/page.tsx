import { setRequestLocale } from "next-intl/server";
import { CheckoutPage } from "@/features/checkout";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <CheckoutPage />;
}
