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
import { loginSchema, type LoginForm as LoginFormValues } from "@/lib/validations/auth";
import { useAuthStore } from "@/stores/auth-store";
import { useAuthModalStore } from "@/stores/auth-modal-store";

export function LoginForm() {
  const t = useTranslations("auth");
  const tc = useTranslations("common");
  const { login } = useAuthStore();
  const { closeAuthModal, setAuthModalStep } = useAuthModalStore();
  const [showPassword, setShowPassword] = React.useState(false);

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onLoginSubmit = async (data: LoginFormValues) => {
    await new Promise((r) => setTimeout(r, 600));
    login({
      id: "1",
      name: "Ahmed Al-Rashid",
      email: "ahmed@example.com",
      phone: `+966${data.phone}`,
    });
    closeAuthModal();
  };

  return (
    <div className="relative z-10 mx-auto flex w-full max-w-sm flex-col items-stretch">
      <DialogHeader className="pb-4 text-center">
        <DialogTitle className="text-2xl font-extrabold text-primary text-center">
          {t("loginTitle")}
        </DialogTitle>
        <DialogDescription className="text-sm text-muted-foreground text-center">
          {t("loginSubtitle")}
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4 pt-1">
        <div className="space-y-1.5">
          <Label htmlFor="login-phone" className="text-xs font-semibold text-foreground/80 flex items-center gap-1">
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
              id="login-phone"
              placeholder="5XX XXX XXX"
              className="h-full border-none focus-visible:ring-0 rounded-none bg-transparent text-sm px-3.5"
              {...loginForm.register("phone")}
            />
          </div>
          {loginForm.formState.errors.phone && (
            <p className="text-xs text-destructive font-medium px-2">{loginForm.formState.errors.phone.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="login-password" className="text-xs font-semibold text-foreground/80">
              {t("password")} <span className="text-destructive">*</span>
            </Label>
          </div>
          <div className="relative flex rounded-full border border-border bg-surface focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all h-11">
            <Input
              id="login-password"
              type={showPassword ? "text" : "password"}
              className="h-full border-none focus-visible:ring-0 rounded-full px-4 pe-10 bg-transparent text-sm"
              {...loginForm.register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground/70 hover:text-foreground transition-colors cursor-pointer"
            >
              {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
            </button>
          </div>
          {loginForm.formState.errors.password && (
            <p className="text-xs text-destructive font-medium px-2">{loginForm.formState.errors.password.message}</p>
          )}
        </div>

        <div className="text-start">
          <button
            type="button"
            onClick={() => setAuthModalStep("forgot-password")}
            className="text-xs font-semibold text-primary hover:underline transition-colors cursor-pointer"
          >
            {t("forgotPassword")}
          </button>
        </div>

        <Button
          type="submit"
          className="w-full h-11 rounded-full bg-gradient-to-r from-primary to-primary/85 hover:from-primary/95 hover:to-primary/90 text-primary-foreground font-medium text-base transition-all shadow-md shadow-primary/15"
          disabled={loginForm.formState.isSubmitting}
        >
          {loginForm.formState.isSubmitting ? tc("loading") : tc("login")}
        </Button>

        <div className="relative flex items-center justify-center mb-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <span className="relative px-3 text-sm text-primary font-medium">
            {tc("or")}
          </span>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full h-11 rounded-full border border-border bg-surface/70 hover:bg-surface text-foreground font-semibold text-sm transition-all shadow-xs"
        >
          {t("yesserPlatform")}
        </Button>

        <p className="text-center text-sm text-primary mt-2">
          {t("noAccount")}{" "}
          <button
            type="button"
            onClick={() => setAuthModalStep("register")}
            className="font-bold text-secondary hover:underline cursor-pointer"
          >
            {tc("register")}
          </button>
        </p>
      </form>
    </div>
  );
}

