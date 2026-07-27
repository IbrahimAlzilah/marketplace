"use client";

import * as React from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Eye, EyeOff, CheckCircle } from "lucide-react";
import { DialogHeader, DialogTitle, DialogDescription } from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { resetPasswordSchema, type ResetPasswordForm as ResetPasswordFormValues } from "../schemas/auth-schema";
import { useAuthModalStore } from "../store/auth-modal-store";

export function ResetPasswordForm() {
  const t = useTranslations("auth");
  const tc = useTranslations("common");
  const { setAuthModalStep } = useAuthModalStore();

  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [resetSuccess, setResetSuccess] = React.useState(false);

  const resetForm = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onResetSubmit = async (_data: ResetPasswordFormValues) => {
    await new Promise((r) => setTimeout(r, 600));
    setResetSuccess(true);
    setTimeout(() => {
      setResetSuccess(false);
      setAuthModalStep("login");
    }, 3000);
  };

  return (
    <div className="relative z-10 mx-auto flex w-full max-w-sm flex-col items-stretch">
      {resetSuccess ? (
        <div className="flex flex-col items-center justify-center py-8 space-y-4 animate-in fade-in zoom-in-95 duration-300">
          <CheckCircle className="h-16 w-16 text-success stroke-[1.5]" />
          <h3 className="text-xl font-bold text-foreground text-center">{t("success")}</h3>
          <p className="text-sm text-muted-foreground text-center max-w-xs leading-relaxed">
            {t("passwordResetSuccess")}
          </p>
        </div>
      ) : (
        <>
          {/* 3D Reset Lock Illustration */}
          <div className="relative flex h-[120px] items-center justify-center mb-2 select-none">
            <Image
              src="/images/auth/reset-lock-3d.png"
              alt="Reset Password"
              fill
              draggable={false}
              className="object-contain"
            />
          </div>

          <DialogHeader className="pb-3 text-center">
            <DialogTitle className="text-2xl font-extrabold text-primary text-center">
              {t("resetPasswordTitle")}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground text-center">
              {t("resetPasswordSubtitle")}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={resetForm.handleSubmit(onResetSubmit)} className="space-y-4 pt-1">
            <div className="space-y-1.5">
              <Label htmlFor="reset-pass" className="text-xs font-semibold text-foreground/80">
                {t("password")} <span className="text-destructive">*</span>
              </Label>
              <div className="relative flex rounded-full border border-border bg-surface focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all h-11">
                <Input
                  id="reset-pass"
                  type={showPassword ? "text" : "password"}
                  className="h-full border-none focus-visible:ring-0 rounded-full px-4 pe-10 bg-transparent text-sm"
                  {...resetForm.register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground/70 hover:text-foreground transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                </button>
              </div>
              {resetForm.formState.errors.password && (
                <p className="text-xs text-destructive font-medium px-2">{resetForm.formState.errors.password.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="reset-confirm" className="text-xs font-semibold text-foreground/80">
                {t("confirmPassword")} <span className="text-destructive">*</span>
              </Label>
              <div className="relative flex rounded-full border border-border bg-surface focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all h-11">
                <Input
                  id="reset-confirm"
                  type={showConfirmPassword ? "text" : "password"}
                  className="h-full border-none focus-visible:ring-0 rounded-full px-4 pe-10 bg-transparent text-sm"
                  {...resetForm.register("confirmPassword")}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground/70 hover:text-foreground transition-colors cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                </button>
              </div>
              {resetForm.formState.errors.confirmPassword && (
                <p className="text-xs text-destructive font-medium px-2">{resetForm.formState.errors.confirmPassword.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-11 rounded-full bg-gradient-to-r from-primary to-primary/85 hover:from-primary/95 hover:to-primary/90 text-primary-foreground font-medium text-base transition-all mt-4 shadow-md shadow-primary/15"
              disabled={resetForm.formState.isSubmitting}
            >
              {resetForm.formState.isSubmitting ? tc("loading") : t("confirm")}
            </Button>
          </form>
        </>
      )}
    </div>
  );
}
