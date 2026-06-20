import { setRequestLocale } from "next-intl/server";
import { ForgotPasswordPage } from "@/components/pages/forgot-password-page";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ForgotPasswordPage />;
}
