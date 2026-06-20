import { setRequestLocale } from "next-intl/server";
import { SettingsPage } from "@/components/pages/settings-page";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <SettingsPage />;
}
