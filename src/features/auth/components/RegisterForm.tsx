"use client";

import * as React from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Eye, EyeOff } from "lucide-react";
import { DialogHeader, DialogTitle, DialogDescription } from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { registerSchema, type RegisterForm as RegisterFormValues } from "@/lib/validations/auth";
import { useAuthModalStore } from "@/stores/auth-modal-store";

export function RegisterForm() {
  const t = useTranslations("auth");
  const tc = useTranslations("common");
  const { setAuthModalStep, setAuthModalPhone, setAuthModalResetMode } = useAuthModalStore();

  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { acceptTerms: false },
  });

  const onRegisterSubmit = async (data: RegisterFormValues) => {
    await new Promise((r) => setTimeout(r, 600));
    setAuthModalPhone(data.phone);
    setAuthModalResetMode(false);
    setAuthModalStep("otp");
  };

  return (
    <div className="relative z-10 mx-auto flex w-full max-w-sm flex-col items-stretch">
      <DialogHeader className="pb-3 text-center">
        <DialogTitle className="text-2xl font-extrabold text-primary text-center">
          {t("registerTitle")}
        </DialogTitle>
        <DialogDescription className="text-sm text-muted-foreground text-center">
          {t("registerSubtitle")}
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-3.5 pt-1">
        <div className="space-y-1">
          <Label htmlFor="reg-name" className="text-xs font-semibold text-foreground/80">
            {t("fullName")} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="reg-name"
            placeholder={t("fullName")}
            className="h-11 rounded-full bg-surface border border-border px-4 text-sm"
            {...registerForm.register("name")}
          />
          {registerForm.formState.errors.name && (
            <p className="text-xs text-destructive font-medium px-2">{registerForm.formState.errors.name.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="reg-phone" className="text-xs font-semibold text-foreground/80">
            {t("phone")} <span className="text-destructive">*</span>
          </Label>
          <div className="flex rounded-full border border-border bg-surface focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all overflow-hidden h-11">
            <span className="inline-flex items-center gap-1.5 bg-surface-muted px-3.5 text-xs text-muted-foreground font-semibold border-e border-border shrink-0">
              <Image
                src="/images/flag-sa.webp"
                alt="SA Flag"
                width={18}
                height={12}
                draggable={false}
                className="rounded-2xs object-contain shrink-0"
              />
              <span>+966</span>
            </span>
            <Input
              id="reg-phone"
              placeholder="5XX XXX XXX"
              className="h-full border-none focus-visible:ring-0 rounded-none bg-transparent text-sm px-3.5"
              {...registerForm.register("phone")}
            />
          </div>
          {registerForm.formState.errors.phone && (
            <p className="text-xs text-destructive font-medium px-2">{registerForm.formState.errors.phone.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="reg-national" className="text-xs font-semibold text-foreground/80">
            {t("nationalId")}
          </Label>
          <Input
            id="reg-national"
            placeholder="1XXXXXXXXX / 2XXXXXXXXX"
            className="h-11 rounded-full bg-surface border border-border px-4 text-sm"
            {...registerForm.register("nationalId")}
          />
          {registerForm.formState.errors.nationalId && (
            <p className="text-xs text-destructive font-medium px-2">{registerForm.formState.errors.nationalId.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="reg-password" className="text-xs font-semibold text-foreground/80">
            {t("password")} <span className="text-destructive">*</span>
          </Label>
          <div className="relative flex rounded-full border border-border bg-surface focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all h-11">
            <Input
              id="reg-password"
              type={showPassword ? "text" : "password"}
              className="h-full border-none focus-visible:ring-0 rounded-full px-3.5 pe-9 bg-transparent text-xs sm:text-sm"
              {...registerForm.register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground/70 hover:text-foreground transition-colors cursor-pointer"
            >
              {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
            </button>
          </div>
          {registerForm.formState.errors.password && (
            <p className="text-xs text-destructive font-medium px-1">{registerForm.formState.errors.password.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="reg-confirm" className="text-xs font-semibold text-foreground/80">
            {t("confirmPassword")} <span className="text-destructive">*</span>
          </Label>
          <div className="relative flex rounded-full border border-border bg-surface focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all h-11">
            <Input
              id="reg-confirm"
              type={showConfirmPassword ? "text" : "password"}
              className="h-full border-none focus-visible:ring-0 rounded-full px-3.5 pe-9 bg-transparent text-xs sm:text-sm"
              {...registerForm.register("confirmPassword")}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground/70 hover:text-foreground transition-colors cursor-pointer"
            >
              {showConfirmPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
            </button>
          </div>
          {registerForm.formState.errors.confirmPassword && (
            <p className="text-xs text-destructive font-medium px-1">{registerForm.formState.errors.confirmPassword.message}</p>
          )}
        </div>

        <div className="flex items-center gap-2 pt-1">
          <Checkbox
            id="reg-terms"
            checked={registerForm.watch("acceptTerms")}
            onCheckedChange={(c) => registerForm.setValue("acceptTerms", !!c)}
            className="mt-0.5"
          />
          <Label htmlFor="reg-terms" className="text-xs font-medium leading-normal text-muted-foreground">
            {t("acceptTerms")}{" "}
            <a href="/legal/terms" target="_blank" className="text-primary hover:underline font-bold">
              {t("terms")}
            </a>
          </Label>
        </div>
        {registerForm.formState.errors.acceptTerms && (
          <p className="text-xs text-destructive font-medium">{registerForm.formState.errors.acceptTerms.message}</p>
        )}

        <Button
          type="submit"
          className="w-full h-11 rounded-full bg-gradient-to-r from-primary to-primary/85 hover:from-primary/95 hover:to-primary/90 text-primary-foreground font-medium text-base transition-all mt-3 shadow-md shadow-primary/15"
          disabled={registerForm.formState.isSubmitting}
        >
          {registerForm.formState.isSubmitting ? tc("loading") : tc("register")}
        </Button>

        <p className="text-center text-sm text-primary mt-3">
          {t("hasAccount")}{" "}
          <button
            type="button"
            onClick={() => setAuthModalStep("login")}
            className="font-bold text-secondary hover:underline cursor-pointer"
          >
            {tc("login")}
          </button>
        </p>
      </form>
    </div>
  );
}

