import { setRequestLocale } from "next-intl/server";
import { ContactPage } from "@/features/support/components/contact-page";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ContactPage />;
}
