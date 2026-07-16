"use client";

import * as React from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { Eye, EyeOff, CheckCircle, ArrowLeft, ArrowRight } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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

  // Render Helpers
  const ArrowBackIcon = isRtl ? ArrowRight : ArrowLeft;

  return (
    <Dialog open={isAuthModalOpen} onOpenChange={(open) => !open && closeAuthModal()}>
      <DialogContent className="sm:max-w-[460px] p-6 rounded-3xl gap-0 overflow-hidden border border-border/40 shadow-2xl bg-card">
        {/* Header navigation (back button) */}
        {["forgot-password", "otp", "reset-password"].includes(authModalStep) && !resetSuccess && (
          <button
            onClick={handleBack}
            className="absolute start-6 top-6 flex h-8 w-8 items-center justify-center rounded-full bg-muted/60 hover:bg-muted text-muted-foreground transition-all cursor-pointer z-10"
          >
            <ArrowBackIcon className="h-4 w-4" />
          </button>
        )}

        <DialogHeader className="pb-4">
          <DialogTitle className="text-2xl font-bold text-foreground text-start">
            {authModalStep === "login" && t("loginTitle")}
            {authModalStep === "register" && t("registerTitle")}
            {authModalStep === "forgot-password" && t("forgotTitle")}
            {authModalStep === "otp" && t("otpTitle")}
            {authModalStep === "reset-password" && t("resetPasswordTitle")}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground text-start mt-1.5">
            {authModalStep === "login" && t("loginSubtitle")}
            {authModalStep === "register" && t("registerSubtitle")}
            {authModalStep === "forgot-password" && t("forgotSubtitle")}
            {authModalStep === "otp" && t("otpSubtitle")}
            {authModalStep === "reset-password" && t("resetPasswordSubtitle")}
          </DialogDescription>
        </DialogHeader>

        {/* STEP: LOGIN */}
        {authModalStep === "login" && (
          <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="login-phone" className="text-sm font-semibold">{t("phone")}</Label>
              <div className="flex rounded-xl overflow-hidden border border-input focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                <span className="inline-flex items-center gap-1.5 bg-muted/40 px-3.5 text-sm text-muted-foreground font-semibold border-e border-input">
                  <Image
                    src="/images/flag-sa.webp"
                    alt="SA Flag"
                    width={20}
                    height={14}
                    className="rounded-sm object-contain shrink-0"
                  />
                  <span>+966</span>
                </span>
                <div className="relative flex-1">
                  <Input
                    id="login-phone"
                    placeholder="5XX XXX XXX"
                    className="h-11 border-none focus-visible:ring-0 rounded-none bg-transparent"
                    {...loginForm.register("phone")}
                  />
                </div>
              </div>
              {loginForm.formState.errors.phone && (
                <p className="text-xs text-destructive font-medium mt-1">{loginForm.formState.errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="login-password" className="text-sm font-semibold">{t("password")}</Label>
                <button
                  type="button"
                  onClick={() => setAuthModalStep("forgot-password")}
                  className="text-xs font-semibold text-primary hover:text-primary/90 transition-colors cursor-pointer"
                >
                  {t("forgotPassword")}
                </button>
              </div>
              <div className="relative flex rounded-xl border border-input focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all bg-transparent">
                <Input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  className="h-11 border-none focus-visible:ring-0 rounded-xl pe-10 bg-transparent"
                  {...loginForm.register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {loginForm.formState.errors.password && (
                <p className="text-xs text-destructive font-medium mt-1">{loginForm.formState.errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-11 rounded-full bg-primary hover:bg-primary/95 text-white font-semibold transition-all mt-6 shadow-md shadow-primary/10"
              disabled={loginForm.formState.isSubmitting}
            >
              {loginForm.formState.isSubmitting ? tc("loading") : tc("login")}
            </Button>

            <p className="text-center text-sm text-muted-foreground mt-5">
              {t("noAccount")}{" "}
              <button
                type="button"
                onClick={() => setAuthModalStep("register")}
                className="font-bold text-primary hover:underline cursor-pointer"
              >
                {tc("register")}
              </button>
            </p>
          </form>
        )}

        {/* STEP: REGISTER */}
        {authModalStep === "register" && (
          <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="reg-name" className="text-sm font-semibold">{t("fullName")}</Label>
              <div className="relative">
                <Input
                  id="reg-name"
                  placeholder={t("fullName")}
                  className="h-11 rounded-xl"
                  {...registerForm.register("name")}
                />
              </div>
              {registerForm.formState.errors.name && (
                <p className="text-xs text-destructive font-medium mt-1">{registerForm.formState.errors.name.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="reg-phone" className="text-sm font-semibold">{t("phone")}</Label>
              <div className="flex rounded-xl overflow-hidden border border-input focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                <span className="inline-flex items-center gap-1.5 bg-muted/40 px-3.5 text-sm text-muted-foreground font-semibold border-e border-input">
                  <Image
                    src="/images/flag-sa.webp"
                    alt="SA Flag"
                    width={20}
                    height={14}
                    className="rounded-sm object-contain shrink-0"
                  />
                  <span>+966</span>
                </span>
                <div className="relative flex-1">
                  <Input
                    id="reg-phone"
                    placeholder="5XX XXX XXX"
                    className="h-11 border-none focus-visible:ring-0 rounded-none bg-transparent"
                    {...registerForm.register("phone")}
                  />
                </div>
              </div>
              {registerForm.formState.errors.phone && (
                <p className="text-xs text-destructive font-medium mt-1">{registerForm.formState.errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="reg-national" className="text-sm font-semibold">{t("nationalId")}</Label>
              <div className="relative">
                <Input
                  id="reg-national"
                  placeholder="1XXXXXXXXX / 2XXXXXXXXX"
                  className="h-11 rounded-xl"
                  {...registerForm.register("nationalId")}
                />
              </div>
              {registerForm.formState.errors.nationalId && (
                <p className="text-xs text-destructive font-medium mt-1">{registerForm.formState.errors.nationalId.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <Label htmlFor="reg-password" className="text-sm font-semibold">{t("password")}</Label>
                <div className="relative flex rounded-xl border border-input focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all bg-transparent">
                  <Input
                    id="reg-password"
                    type={showPassword ? "text" : "password"}
                    className="h-11 border-none focus-visible:ring-0 rounded-xl px-3 pe-9 bg-transparent text-sm"
                    {...registerForm.register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute end-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {registerForm.formState.errors.password && (
                  <p className="text-xs text-destructive font-medium mt-1">{registerForm.formState.errors.password.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="reg-confirm" className="text-sm font-semibold">{t("confirmPassword")}</Label>
                <div className="relative flex rounded-xl border border-input focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all bg-transparent">
                  <Input
                    id="reg-confirm"
                    type={showConfirmPassword ? "text" : "password"}
                    className="h-11 border-none focus-visible:ring-0 rounded-xl px-3 pe-9 bg-transparent text-sm"
                    {...registerForm.register("confirmPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute end-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground transition-colors cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {registerForm.formState.errors.confirmPassword && (
                  <p className="text-xs text-destructive font-medium mt-1">{registerForm.formState.errors.confirmPassword.message}</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-2.5 pt-1">
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
              className="w-full h-11 rounded-full bg-primary hover:bg-primary/95 text-white font-semibold transition-all mt-4 shadow-md shadow-primary/10"
              disabled={registerForm.formState.isSubmitting}
            >
              {registerForm.formState.isSubmitting ? tc("loading") : tc("register")}
            </Button>

            <p className="text-center text-sm text-muted-foreground mt-4">
              {t("hasAccount")}{" "}
              <button
                type="button"
                onClick={() => setAuthModalStep("login")}
                className="font-bold text-primary hover:underline cursor-pointer"
              >
                {tc("login")}
              </button>
            </p>
          </form>
        )}

        {/* STEP: FORGOT PASSWORD */}
        {authModalStep === "forgot-password" && (
          <form onSubmit={forgotForm.handleSubmit(onForgotSubmit)} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="forgot-phone" className="text-sm font-semibold">{t("phone")}</Label>
              <div className="flex rounded-xl overflow-hidden border border-input focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                <span className="inline-flex items-center gap-1.5 bg-muted/40 px-3.5 text-sm text-muted-foreground font-semibold border-e border-input">
                  <Image
                    src="/images/flag-sa.webp"
                    alt="SA Flag"
                    width={20}
                    height={14}
                    className="rounded-sm object-contain shrink-0"
                  />
                  <span>+966</span>
                </span>
                <div className="relative flex-1">
                  <Input
                    id="forgot-phone"
                    placeholder="5XX XXX XXX"
                    className="h-11 border-none focus-visible:ring-0 rounded-none bg-transparent"
                    {...forgotForm.register("phone")}
                  />
                </div>
              </div>
              {forgotForm.formState.errors.phone && (
                <p className="text-xs text-destructive font-medium mt-1">{forgotForm.formState.errors.phone.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-11 rounded-full bg-primary hover:bg-primary/95 text-white font-semibold transition-all mt-6 shadow-md shadow-primary/10"
              disabled={forgotForm.formState.isSubmitting}
            >
              {forgotForm.formState.isSubmitting ? tc("loading") : t("sendCode")}
            </Button>
          </form>
        )}

        {/* STEP: OTP VERIFICATION */}
        {authModalStep === "otp" && (
          <form onSubmit={otpForm.handleSubmit(onOtpSubmit)} className="space-y-6 pt-2">
            <div>
              <Label htmlFor="otp-code" className="sr-only">OTP Code</Label>
              <Input
                id="otp-code"
                placeholder="000000"
                maxLength={6}
                className="text-center text-3xl font-bold tracking-[0.4em] h-14 rounded-2xl border-2 border-input focus-visible:border-primary focus-visible:ring-primary/25 bg-muted/20"
                {...otpForm.register("otp")}
              />
              {otpForm.formState.errors.otp && (
                <p className="text-center text-xs text-destructive font-medium mt-2">{otpForm.formState.errors.otp.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-11 rounded-full bg-primary hover:bg-primary/95 text-white font-semibold transition-all shadow-md shadow-primary/10"
              disabled={otpForm.formState.isSubmitting}
            >
              {otpForm.formState.isSubmitting ? tc("loading") : t("verify")}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              {resendTimer > 0 ? (
                t("resendIn", { seconds: resendTimer })
              ) : (
                <button
                  type="button"
                  className="font-bold text-primary hover:underline cursor-pointer"
                  onClick={startTimer}
                >
                  {t("resend")}
                </button>
              )}
            </p>
          </form>
        )}

        {/* STEP: RESET PASSWORD */}
        {authModalStep === "reset-password" && (
          <>
            {resetSuccess ? (
              <div className="flex flex-col items-center justify-center py-8 space-y-4 animate-in fade-in zoom-in-95 duration-300">
                <CheckCircle className="h-16 w-16 text-green-500 stroke-[1.5]" />
                <h3 className="text-xl font-bold text-foreground text-center">{t("success")}</h3>
                <p className="text-sm text-muted-foreground text-center max-w-xs leading-relaxed">
                  {t("passwordResetSuccess")}
                </p>
              </div>
            ) : (
              <form onSubmit={resetForm.handleSubmit(onResetSubmit)} className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <Label htmlFor="reset-pass" className="text-sm font-semibold">{t("password")}</Label>
                  <div className="relative flex rounded-xl border border-input focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all bg-transparent">
                    <Input
                      id="reset-pass"
                      type={showPassword ? "text" : "password"}
                      className="h-11 border-none focus-visible:ring-0 rounded-xl pe-10 bg-transparent text-sm"
                      {...resetForm.register("password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground transition-colors cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {resetForm.formState.errors.password && (
                    <p className="text-xs text-destructive font-medium mt-1">{resetForm.formState.errors.password.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="reset-confirm" className="text-sm font-semibold">{t("confirmPassword")}</Label>
                  <div className="relative flex rounded-xl border border-input focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all bg-transparent">
                    <Input
                      id="reset-confirm"
                      type={showConfirmPassword ? "text" : "password"}
                      className="h-11 border-none focus-visible:ring-0 rounded-xl pe-10 bg-transparent text-sm"
                      {...resetForm.register("confirmPassword")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground transition-colors cursor-pointer"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {resetForm.formState.errors.confirmPassword && (
                    <p className="text-xs text-destructive font-medium mt-1">{resetForm.formState.errors.confirmPassword.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 rounded-full bg-primary hover:bg-primary/95 text-white font-semibold transition-all mt-6 shadow-md shadow-primary/10"
                  disabled={resetForm.formState.isSubmitting}
                >
                  {resetForm.formState.isSubmitting ? tc("loading") : t("confirm")}
                </Button>
              </form>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
