import { setRequestLocale } from "next-intl/server";
import { WalletPage } from "@/features/profile/components/wallet-page";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <WalletPage />;
}
