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
import { otpSchema, type OtpForm as OtpFormValues } from "@/lib/validations/auth";
import { useAuthStore } from "@/stores/auth-store";
import { useAuthModalStore } from "@/stores/auth-modal-store";

export function OtpForm() {
  const t = useTranslations("auth");
  const tc = useTranslations("common");
  const { login } = useAuthStore();
  const { authModalPhone, authModalResetMode, closeAuthModal, setAuthModalStep } = useAuthModalStore();

  const [resendTimer, setResendTimer] = React.useState(60);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  const otpForm = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
  });

  const startTimer = React.useCallback(() => {
    setResendTimer(60);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  React.useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTimer]);

  const onOtpSubmit = async (_data: OtpFormValues) => {
    await new Promise((r) => setTimeout(r, 600));
    if (authModalResetMode) {
      setAuthModalStep("reset-password");
    } else {
      login({
        id: "1",
        name: "Ahmed Al-Rashid",
        email: "ahmed@example.com",
        phone: `+966${authModalPhone}`,
      });
      closeAuthModal();
    }
  };

  return (
    <div className="relative z-10 mx-auto flex w-full max-w-sm flex-col items-stretch">
      {/* 3D Phone Illustration */}
      <div className="relative flex h-[120px] items-center justify-center mb-2 select-none">
        <Image
          src="/images/auth/phone-3d.png"
          alt="OTP Verification"
          fill
          draggable={false}
          className="object-contain"
        />
      </div>

      <DialogHeader className="pb-3 text-center">
        <DialogTitle className="text-2xl font-extrabold text-primary text-center">
          {t("otpTitle")}
        </DialogTitle>
        <DialogDescription className="text-sm text-muted-foreground text-center">
          {t("otpSubtitle")} <span className="font-semibold text-foreground dir-ltr inline-block">+966 {authModalPhone || "5XX XXX XXX"}</span>
        </DialogDescription>
        <div className="pt-1">
          <button
            type="button"
            onClick={() => setAuthModalStep(authModalResetMode ? "forgot-password" : "register")}
            className="text-xs font-semibold text-secondary hover:underline cursor-pointer"
          >
            {t("changeMobileNumber")}
          </button>
        </div>
      </DialogHeader>

      <form onSubmit={otpForm.handleSubmit(onOtpSubmit)} className="space-y-5 pt-2">
        <div>
          <Label htmlFor="otp-code" className="sr-only">OTP Code</Label>
          <Input
            id="otp-code"
            placeholder="000000"
            maxLength={6}
            className="text-center text-3xl font-extrabold tracking-[0.5em] h-14 rounded-full border-2 border-border focus-visible:border-primary focus-visible:ring-primary/20 bg-surface shadow-xs"
            {...otpForm.register("otp")}
          />
          {otpForm.formState.errors.otp && (
            <p className="text-center text-xs text-destructive font-medium mt-2">{otpForm.formState.errors.otp.message}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full h-11 rounded-full bg-gradient-to-r from-primary to-primary/85 hover:from-primary/95 hover:to-primary/90 text-primary-foreground font-medium text-base transition-all shadow-md shadow-primary/15"
          disabled={otpForm.formState.isSubmitting}
        >
          {otpForm.formState.isSubmitting ? tc("loading") : t("verify")}
        </Button>

        <div className="text-center text-sm text-primary">
          {resendTimer > 0 ? (
            <span className="font-medium">{t("resendIn", { seconds: resendTimer })}</span>
          ) : (
            <button
              type="button"
              className="font-bold text-primary hover:underline cursor-pointer"
              onClick={startTimer}
            >
              {t("resend")}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

