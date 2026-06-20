"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { otpSchema, type OtpForm } from "@/lib/validations/auth";
import { useAuthStore } from "@/stores/auth-store";
import { AuthLayout } from "@/components/layout/auth-layout";

export function OtpPage() {
  const t = useTranslations("auth");
  const tc = useTranslations("common");
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const [resendTimer, setResendTimer] = useState(60);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OtpForm>({ resolver: zodResolver(otpSchema) });

  const onSubmit = async () => {
    await new Promise((r) => setTimeout(r, 500));
    login({
      id: "1",
      name: "Ahmed Al-Rashid",
      email: "ahmed@example.com",
      phone: "+966 5XX XXX XXXX",
    });
    router.push("/");
  };

  return (
    <AuthLayout title={t("otpTitle")} subtitle={t("otpSubtitle")}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <Input
            placeholder="000000"
            maxLength={6}
            className="text-center text-2xl tracking-[0.5em]"
            {...register("otp")}
          />
          {errors.otp && <p className="mt-2 text-center text-sm text-destructive">{errors.otp.message}</p>}
        </div>
        <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
          {isSubmitting ? tc("loading") : t("verify")}
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          {resendTimer > 0 ? (
            t("resendIn", { seconds: resendTimer })
          ) : (
            <button
              type="button"
              className="text-primary hover:underline"
              onClick={() => setResendTimer(60)}
            >
              {t("resend")}
            </button>
          )}
        </p>
      </form>
    </AuthLayout>
  );
}
