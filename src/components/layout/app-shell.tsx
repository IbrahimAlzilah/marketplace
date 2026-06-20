"use client";

import { usePathname } from "@/i18n/navigation";
import { SiteHeader, MobileBottomNav } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

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
    </>
  );
}
