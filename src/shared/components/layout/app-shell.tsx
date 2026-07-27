"use client";

import { usePathname } from "@/i18n/navigation";
import { SiteHeader } from "@/shared/components/layout/site-header";
import { MobileBottomNav } from "@/shared/components/layout/mobile-bottom-nav";
import { SiteFooter } from "@/shared/components/layout/site-footer";
import dynamic from "next/dynamic";

const AuthModal = dynamic(
  () => import("@/features/auth").then((m) => m.AuthModal),
  { ssr: false }
);

// Dev-only: import ScenarioSelector only in non-production builds
const ScenarioSelector =
  process.env.NODE_ENV !== "production"
    ? require("@/shared/components/marketplace/scenario-selector").ScenarioSelector
    : () => null;

const AUTH_ROUTES = ["/login", "/register", "/otp", "/forgot-password", "/reset-password"];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuth = AUTH_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));

  if (isAuth) {
    return <>{children}</>;
  }

  return (
    <>
      <SiteHeader />
      <main className="flex-1 pb-20 md:pb-0">{children}</main>
      <SiteFooter />
      <MobileBottomNav />
      {process.env.NODE_ENV !== "production" && <ScenarioSelector />}
      <AuthModal />
    </>
  );
}

