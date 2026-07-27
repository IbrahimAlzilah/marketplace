import { setRequestLocale } from "next-intl/server";
import { CartPage } from "@/features/cart";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <CartPage />;
}
