import { setRequestLocale } from "next-intl/server";
import { OtpPage } from "@/components/pages/otp-page";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <OtpPage />;
}
