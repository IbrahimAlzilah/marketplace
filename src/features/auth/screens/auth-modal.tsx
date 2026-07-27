"use client";

import Image from "next/image";
import { useLocale } from "next-intl";
import { ArrowLeft, ArrowRight, XIcon } from "lucide-react";
import { Dialog, DialogClose, DialogContent } from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { useAuthModalStore } from "@/stores/auth-modal-store";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { RegisterForm } from "@/features/auth/components/RegisterForm";
import { ForgotPasswordForm } from "@/features/auth/components/ForgotPasswordForm";
import { OtpForm } from "@/features/auth/components/OtpForm";
import { ResetPasswordForm } from "@/features/auth/components/ResetPasswordForm";

export function AuthModal() {
  const locale = useLocale();
  const isRtl = locale === "ar";

  const {
    isAuthModalOpen,
    authModalStep,
    authModalResetMode,
    closeAuthModal,
    setAuthModalStep,
  } = useAuthModalStore();

  // Back button handler
  const handleBack = () => {
    if (authModalStep === "forgot-password") {
      setAuthModalStep("login");
    } else if (authModalStep === "otp") {
      setAuthModalStep(authModalResetMode ? "forgot-password" : "register");
    } else if (authModalStep === "reset-password") {
      setAuthModalStep("forgot-password");
    }
  };

  const ArrowBackIcon = isRtl ? ArrowRight : ArrowLeft;

  return (
    <Dialog open={isAuthModalOpen} onOpenChange={(open) => !open && closeAuthModal()}>
      <DialogContent className="flex max-h-[90vh] sm:max-h-[85vh] w-full max-w-lg sm:max-w-2xl flex-col p-0 gap-0 overflow-hidden rounded-3xl border-border/40 shadow-modal bg-[linear-gradient(207.31deg,rgb(238,231,250)_3.83%,rgb(245,245,245)_56.46%,rgb(252,218,202)_112.15%)] dark:bg-[linear-gradient(207.31deg,var(--surface)_3.83%,var(--surface-muted)_56.46%,var(--surface-elevated)_112.15%)]">
        {/* Background Hex Pattern Watermark */}
        <div className="absolute -start-22 top-20 w-full h-full opacity-50 dark:opacity-10 pointer-events-none z-0 mask-[url('/images/auth/hex-bg.svg')] mask-no-repeat mask-center mask-contain">
          <Image
            src="/images/auth/hex-pattern.svg"
            alt=""
            fill
            draggable={false}
            className="object-contain"
          />
        </div>

        {/* Fixed Header Section (Close Button + Back Button + Brand Logo) */}
        <div className="relative shrink-0 pt-6 px-6 pb-2 z-20 flex flex-col items-center justify-center">
          {/* Circular close button */}
          <DialogClose asChild>
            <Button
              variant="ghost"
              className="absolute end-4 top-4 z-50 flex size-9 cursor-pointer items-center justify-center rounded-full border border-border bg-surface text-muted-foreground shadow-xs transition-all duration-200 hover:bg-accent hover:text-accent-foreground focus:outline-none active:scale-95 p-2!"
              aria-label="Close"
            >
              <XIcon className="size-4" />
            </Button>
          </DialogClose>

          {/* Top Header Navigation (Back Button) */}
          {["forgot-password", "otp", "reset-password"].includes(authModalStep) && (
            <button
              type="button"
              onClick={handleBack}
              className="absolute start-6 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-surface-muted hover:bg-accent text-foreground transition-all cursor-pointer z-20 shadow-xs"
            >
              <ArrowBackIcon className="size-5" />
            </button>
          )}

          {/* Yusur Brand Header Logo */}
          <div className="flex items-center gap-2 pt-1 pb-1">
            <Image
              src="/images/logo.png"
              alt="Yusur Logo"
              width={104}
              height={30}
              draggable={false}
              className="object-contain dark:brightness-0 dark:invert"
            />
          </div>
        </div>

        {/* Scrollable Content Body Container */}
        <div className="relative z-10 flex-1 min-h-0 scrollbar-hide overflow-y-auto px-6 pb-6 pt-2 sm:px-8 sm:pb-8">
          {authModalStep === "login" && <LoginForm />}
          {authModalStep === "register" && <RegisterForm />}
          {authModalStep === "forgot-password" && <ForgotPasswordForm />}
          {authModalStep === "otp" && <OtpForm />}
          {authModalStep === "reset-password" && <ResetPasswordForm />}
        </div>
      </DialogContent>
    </Dialog>
  );
}

