"use client";

import { Home, MapPin, Package, ShoppingCart, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Badge } from "@/shared/components/ui/badge";
import { useCartStore } from "@/features/cart";
import { useAuthStore } from "@/features/auth";
import { cn } from "@/lib/utils";

export function MobileBottomNav() {
  const t = useTranslations("common");
  const pathname = usePathname();
  const itemCount = useCartStore((s) => s.getItemCount());
  const { isAuthenticated, openAuthModal } = useAuthStore();

  const links = [
    { href: "/", icon: Home, label: t("home"), match: (p: string) => p === "/" },
    { href: "/pharmacies", icon: MapPin, label: t("pharmacies"), match: (p: string) => p.startsWith("/pharmacies") },
    { href: "/cart", icon: ShoppingCart, label: t("cart"), match: (p: string) => p.startsWith("/cart"), badge: itemCount },
    { href: "/orders", icon: Package, label: t("orders"), match: (p: string) => p.startsWith("/orders") },
    { href: "/profile", icon: User, label: t("profile"), match: (p: string) => p.startsWith("/profile") },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t bg-card/95 backdrop-blur md:hidden">
      <div className="flex h-16 items-center justify-around">
        {links.map((link) => {
          const Icon = link.icon;
          const active = link.match(pathname);
          const isProfileLink = link.href === "/profile";

          if (isProfileLink && !isAuthenticated) {
            return (
              <button
                key={link.href}
                onClick={() => openAuthModal("login")}
                className={cn(
                  "relative flex flex-col items-center gap-0.5 px-3 py-1 text-[10px] text-muted-foreground cursor-pointer"
                )}
              >
                <Icon className="size-5 text-muted-foreground" />
                <span>{link.label}</span>
              </button>
            );
          }

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative flex flex-col items-center gap-0.5 px-3 py-1 text-[10px]",
                active ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Icon className={cn("size-5", active && "text-primary")} />
              <span>{link.label}</span>
              {link.badge && link.badge > 0 ? (
                <Badge className="absolute -end-0 -top-0 flex size-4 items-center justify-center p-0 text-[9px]">
                  {link.badge}
                </Badge>
              ) : null}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

