"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { forgotPasswordSchema, type ForgotPasswordForm } from "@/lib/validations/auth";
import { AuthLayout } from "@/components/layout/auth-layout";

export function ForgotPasswordPage() {
  const t = useTranslations("auth");
  const tc = useTranslations("common");
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordForm>({ resolver: zodResolver(forgotPasswordSchema) });

  const onSubmit = async () => {
    await new Promise((r) => setTimeout(r, 500));
    router.push("/otp?reset=1");
  };

  return (
    <AuthLayout title={t("forgotTitle")} subtitle={t("forgotSubtitle")}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="phone">{t("phone")}</Label>
          <div className="mt-1 flex">
            <span className="inline-flex items-center rounded-s-lg border border-e-0 border-input bg-muted px-3 text-sm text-muted-foreground">
              +966
            </span>
            <Input id="phone" className="rounded-s-none" {...register("phone")} />
          </div>
          {errors.phone && <p className="mt-1 text-sm text-destructive">{errors.phone.message}</p>}
        </div>
        <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
          {isSubmitting ? tc("loading") : t("sendCode")}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm">
        <Link href="/login" className="text-primary hover:underline">{tc("login")}</Link>
      </p>
    </AuthLayout>
  );
}
