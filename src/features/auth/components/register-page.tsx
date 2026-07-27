"use client";

import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { registerSchema, type RegisterForm } from "@/lib/validations/auth";
import { AuthLayout } from "@/shared/components/layout/auth-layout";

export function RegisterPage() {
  const t = useTranslations("auth");
  const tc = useTranslations("common");
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { acceptTerms: false },
  });

  const acceptTerms = watch("acceptTerms");

  const onSubmit = async () => {
    await new Promise((r) => setTimeout(r, 500));
    router.push("/otp");
  };

  return (
    <AuthLayout title={t("registerTitle")} subtitle={t("registerSubtitle")}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="name">{t("fullName")}</Label>
          <Input id="name" className="mt-1" {...register("name")} />
          {errors.name && <p className="mt-1 text-sm text-destructive">{errors.name.message}</p>}
        </div>
        <div>
          <Label htmlFor="phone">{t("phone")}</Label>
          <div className="mt-1 flex">
            <span className="inline-flex items-center gap-1.5 rounded-s-lg border border-e-0 border-input bg-muted px-3 text-sm text-muted-foreground">
              <Image
                src="/images/flag-sa.webp"
                alt="SA Flag"
                width={20}
                height={14}
                className="rounded-sm object-contain shrink-0"
              />
              <span>+966</span>
            </span>
            <Input id="phone" className="rounded-s-none" {...register("phone")} />
          </div>
          {errors.phone && <p className="mt-1 text-sm text-destructive">{errors.phone.message}</p>}
        </div>
        <div>
          <Label htmlFor="nationalId">{t("nationalId")}</Label>
          <Input id="nationalId" className="mt-1" {...register("nationalId")} />
          {errors.nationalId && <p className="mt-1 text-sm text-destructive">{errors.nationalId.message}</p>}
        </div>
        <div>
          <Label htmlFor="password">{t("password")}</Label>
          <Input id="password" type="password" className="mt-1" {...register("password")} />
          {errors.password && <p className="mt-1 text-sm text-destructive">{errors.password.message}</p>}
        </div>
        <div>
          <Label htmlFor="confirmPassword">{t("confirmPassword")}</Label>
          <Input id="confirmPassword" type="password" className="mt-1" {...register("confirmPassword")} />
          {errors.confirmPassword && <p className="mt-1 text-sm text-destructive">{errors.confirmPassword.message}</p>}
        </div>
        <div className="flex items-start gap-2">
          <Checkbox
            id="terms"
            checked={acceptTerms}
            onCheckedChange={(c) => setValue("acceptTerms", !!c)}
          />
          <Label htmlFor="terms" className="text-sm leading-snug">
            {t("acceptTerms")}{" "}
            <Link href="/legal/terms" className="text-primary hover:underline">{t("terms")}</Link>
          </Label>
        </div>
        {errors.acceptTerms && <p className="text-sm text-destructive">{errors.acceptTerms.message}</p>}
        <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
          {isSubmitting ? tc("loading") : tc("register")}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        {t("hasAccount")}{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          {tc("login")}
        </Link>
      </p>
    </AuthLayout>
  );
}

