import { setRequestLocale } from "next-intl/server";
import { WishlistPage } from "@/components/pages/wishlist-page";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <WishlistPage />;
}
