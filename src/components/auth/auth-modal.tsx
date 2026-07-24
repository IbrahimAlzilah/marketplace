"use client";

import * as React from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations, useLocale } from "next-intl";
import { Eye, EyeOff, CheckCircle, ArrowLeft, ArrowRight, X, XIcon } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  otpSchema,
  resetPasswordSchema,
  type LoginForm,
  type RegisterForm,
  type ForgotPasswordForm,
  type OtpForm,
  type ResetPasswordForm,
} from "@/lib/validations/auth";
import { useAuthStore } from "@/stores/auth-store";
import { cn } from "@/lib/utils";

export function AuthModal() {
  const t = useTranslations("auth");
  const tc = useTranslations("common");
  const locale = useLocale();
  const isRtl = locale === "ar";

  const {
    isAuthModalOpen,
    authModalStep,
    authModalResetMode,
    authModalPhone,
    closeAuthModal,
    setAuthModalStep,
    setAuthModalPhone,
    setAuthModalResetMode,
    login,
  } = useAuthStore();

  // Password visibility states
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  // OTP resend timer state
  const [resendTimer, setResendTimer] = React.useState(60);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  // Success screen flag
  const [resetSuccess, setResetSuccess] = React.useState(false);

  // Forms Hook Setup
  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const registerForm = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { acceptTerms: false },
  });

  const forgotForm = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const otpForm = useForm<OtpForm>({
    resolver: zodResolver(otpSchema),
  });

  const resetForm = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
  });

  // Start OTP resend timer
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

  // Sync OTP timer when step shifts to OTP
  React.useEffect(() => {
    if (authModalStep === "otp") {
      startTimer();
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [authModalStep, startTimer]);

  // Reset forms on modal open/close
  React.useEffect(() => {
    if (!isAuthModalOpen) {
      loginForm.reset();
      registerForm.reset();
      forgotForm.reset();
      otpForm.reset();
      resetForm.reset();
      setResetSuccess(false);
    }
  }, [isAuthModalOpen, loginForm, registerForm, forgotForm, otpForm, resetForm]);

  // Submit Handlers
  const onLoginSubmit = async (data: LoginForm) => {
    await new Promise((r) => setTimeout(r, 600));
    login({
      id: "1",
      name: "Ahmed Al-Rashid",
      email: "ahmed@example.com",
      phone: `+966${data.phone}`,
    });
    closeAuthModal();
  };

  const onRegisterSubmit = async (data: RegisterForm) => {
    await new Promise((r) => setTimeout(r, 600));
    setAuthModalPhone(data.phone);
    setAuthModalResetMode(false);
    setAuthModalStep("otp");
  };

  const onForgotSubmit = async (data: ForgotPasswordForm) => {
    await new Promise((r) => setTimeout(r, 600));
    setAuthModalPhone(data.phone);
    setAuthModalResetMode(true);
    setAuthModalStep("otp");
  };

  const onOtpSubmit = async (data: OtpForm) => {
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

  const onResetSubmit = async (data: ResetPasswordForm) => {
    await new Promise((r) => setTimeout(r, 600));
    setResetSuccess(true);
    setTimeout(() => {
      setResetSuccess(false);
      setAuthModalStep("login");
    }, 3000);
  };

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
          {/* Circular close button matching image */}
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
          {["forgot-password", "otp", "reset-password"].includes(authModalStep) && !resetSuccess && (
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
        <div className="relative z-10 flex-1 min-h-0  scrollbar-hide overflow-y-auto px-6 pb-6 pt-2 sm:px-8 sm:pb-8">

          {/* STEP: LOGIN */}
          {authModalStep === "login" && (
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
          )}

          {/* STEP: REGISTER */}
          {authModalStep === "register" && (
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
          )}

          {/* STEP: FORGOT PASSWORD */}
          {authModalStep === "forgot-password" && (
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
          )}

          {/* STEP: OTP VERIFICATION */}
          {authModalStep === "otp" && (
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
          )}

          {/* STEP: RESET PASSWORD */}
          {authModalStep === "reset-password" && (
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
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
