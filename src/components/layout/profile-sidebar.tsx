"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import {
  Heart,
  MapPin,
  Package,
  Settings,
  Star,
  User,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";

const profileLinks = [
  { href: "/profile", icon: User, key: "profile" },
  { href: "/profile/addresses", icon: MapPin, key: "addresses" },
  { href: "/orders", icon: Package, key: "orders" },
  { href: "/profile/wallet", icon: Wallet, key: "wallet" },
  { href: "/profile/loyalty", icon: Star, key: "loyalty" },
  { href: "/profile/wishlist", icon: Heart, key: "wishlist" },
  { href: "/profile/settings", icon: Settings, key: "settings" },
] as const;

export function ProfileSidebar() {
  const t = useTranslations("common");
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 lg:block">
      <nav className="sticky top-36 space-y-1 rounded-xl border bg-card p-2">
        {profileLinks.map((link) => {
          const Icon = link.icon;
          const active = pathname === link.href || (link.href !== "/profile" && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-primary/5 hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {t(link.key)}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

import { ProfileLayout } from "./profile-layout";

export { ProfileLayout };

