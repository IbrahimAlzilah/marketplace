import { setRequestLocale } from "next-intl/server";
import { HelpPage } from "@/features/support/components/help-page";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <HelpPage />;
}
