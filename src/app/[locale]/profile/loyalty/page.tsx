import { setRequestLocale } from "next-intl/server";
import { LoyaltyPage } from "@/features/profile/components/loyalty-page";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <LoyaltyPage />;
}
