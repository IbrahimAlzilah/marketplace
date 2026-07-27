import { setRequestLocale } from "next-intl/server";
import { NotificationsPage } from "@/features/notifications";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <NotificationsPage />;
}
