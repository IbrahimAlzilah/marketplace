"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginSchema, type LoginForm } from "@/lib/validations/auth";
import { useAuthStore } from "@/stores/auth-store";
import { AuthLayout } from "@/components/layout/auth-layout";

export function LoginPage() {
  const t = useTranslations("auth");
  const tc = useTranslations("common");
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginForm) => {
    await new Promise((r) => setTimeout(r, 500));
    login({
      id: "1",
      name: "Ahmed Al-Rashid",
      email: "ahmed@example.com",
      phone: `+966${data.phone}`,
    });
    router.push("/");
  };

  return (
    <AuthLayout title={t("loginTitle")} subtitle={t("loginSubtitle")}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="phone">{t("phone")}</Label>
          <div className="mt-1 flex">
            <span className="inline-flex items-center rounded-s-lg border border-e-0 border-input bg-muted px-3 text-sm text-muted-foreground">
              +966
            </span>
            <Input
              id="phone"
              placeholder="5XX XXX XXX"
              className="rounded-s-none"
              {...register("phone")}
            />
          </div>
          {errors.phone && <p className="mt-1 text-sm text-destructive">{errors.phone.message}</p>}
        </div>
        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="password">{t("password")}</Label>
            <Link href="/forgot-password" className="text-sm text-primary hover:underline">
              {t("forgotPassword")}
            </Link>
          </div>
          <Input id="password" type="password" className="mt-1" {...register("password")} />
          {errors.password && <p className="mt-1 text-sm text-destructive">{errors.password.message}</p>}
        </div>
        <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
          {isSubmitting ? tc("loading") : tc("login")}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        {t("noAccount")}{" "}
        <Link href="/register" className="font-medium text-primary hover:underline">
          {tc("register")}
        </Link>
      </p>
    </AuthLayout>
  );
}
