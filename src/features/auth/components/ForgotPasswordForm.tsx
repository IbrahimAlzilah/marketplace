"use client";

import * as React from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { DialogHeader, DialogTitle, DialogDescription } from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { forgotPasswordSchema, type ForgotPasswordForm as ForgotPasswordFormValues } from "../schemas/auth-schema";
import { useAuthModalStore } from "../store/auth-modal-store";

export function ForgotPasswordForm() {
  const t = useTranslations("auth");
  const tc = useTranslations("common");
  const { setAuthModalStep, setAuthModalPhone, setAuthModalResetMode } = useAuthModalStore();

  const forgotForm = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onForgotSubmit = async (data: ForgotPasswordFormValues) => {
    await new Promise((r) => setTimeout(r, 600));
    setAuthModalPhone(data.phone);
    setAuthModalResetMode(true);
    setAuthModalStep("otp");
  };

  return (
    <div className="relative z-10 mx-auto flex w-full max-w-sm flex-col items-stretch">
      {/* 3D Lock Illustration */}
      <div className="relative flex h-[120px] items-center justify-center mb-2 select-none">
        <Image
          src="/images/auth/lock-3d.png"
          alt="Forgot Password Lock"
          fill
          draggable={false}
          className="object-contain"
        />
      </div>

      <DialogHeader className="pb-4 text-center">
        <DialogTitle className="text-2xl font-extrabold text-primary text-center">
          {t("forgotTitle")}
        </DialogTitle>
        <DialogDescription className="text-sm text-muted-foreground text-center max-w-xs mx-auto">
          {t("forgotSubtitle")}
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={forgotForm.handleSubmit(onForgotSubmit)} className="space-y-4 pt-1">
        <div className="space-y-1.5">
          <Label htmlFor="forgot-phone" className="text-xs font-semibold text-foreground/80">
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
              id="forgot-phone"
              placeholder="5XX XXX XXX"
              className="h-full border-none focus-visible:ring-0 rounded-none bg-transparent text-sm px-3.5"
              {...forgotForm.register("phone")}
            />
          </div>
          {forgotForm.formState.errors.phone && (
            <p className="text-xs text-destructive font-medium px-2">{forgotForm.formState.errors.phone.message}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full h-11 rounded-full bg-gradient-to-r from-primary to-primary/85 hover:from-primary/95 hover:to-primary/90 text-primary-foreground font-medium text-base transition-all mt-4 shadow-md shadow-primary/15"
          disabled={forgotForm.formState.isSubmitting}
        >
          {forgotForm.formState.isSubmitting ? tc("loading") : t("sendCode")}
        </Button>

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => setAuthModalStep("login")}
            className="font-semibold text-secondary hover:underline text-sm cursor-pointer"
          >
            {t("backToLogin")}
          </button>
        </div>
      </form>
    </div>
  );
}
