"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import {
  Bell,
  ChevronDown,
  Globe,
  Heart,
  Home,
  MapPin,
  Menu,
  Moon,
  Package,
  Search,
  ShoppingCart,
  Sun,
  User,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { categories } from "@/lib/mock-data";
import { useCartStore } from "@/stores/cart-store";
import { useLocationStore } from "@/stores/location-store";
import { useAuthStore } from "@/stores/auth-store";
import { LocationSelector } from "@/components/marketplace/location-selector";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const t = useTranslations("common");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const itemCount = useCartStore((s) => s.getItemCount());
  const { city, district } = useLocationStore();
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => setMounted(true), []);

  const navLinks = [
    { href: "/", label: t("home") },
    { href: "/products", label: t("products") },
    { href: "/pharmacies", label: t("pharmacies") },
    { href: "/orders", label: t("orders") },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const switchLocale = () => {
    const next = locale === "en" ? "ar" : "en";
    router.replace(pathname, { locale: next });
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/95">
      {/* Top bar */}
      <div className="border-b bg-primary/5">
        <div className="container-marketplace flex h-9 items-center justify-between text-xs text-muted-foreground">
          <button
            onClick={() => setLocationOpen(true)}
            className="flex items-center gap-1 hover:text-foreground"
          >
            <MapPin className="size-3 text-primary" />
            <span>{district}, {city}</span>
            <ChevronDown className="size-3" />
          </button>
          <div className="hidden items-center gap-4 sm:flex">
            <Link href="/profile/wallet" className="hover:text-foreground">{t("wallet")}</Link>
            <Link href="/profile/loyalty" className="hover:text-foreground">{t("loyalty")}</Link>
            <button onClick={switchLocale} className="flex items-center gap-1 hover:text-foreground">
              <Globe className="size-3" />
              {locale === "en" ? "العربية" : "English"}
            </button>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container-marketplace">
        <div className="flex h-16 items-center gap-4 lg:gap-8">
          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <Image
              src="/images/logo.png"
              alt="Yusur Logo"
              width={120}
              height={36}
              className="h-9 w-auto object-contain dark:brightness-0 dark:invert"
              priority
            />
          </Link>

          {/* Search - desktop */}
          <form onSubmit={handleSearch} className="hidden flex-1 md:flex max-w-2xl">
            <div className="relative w-full">
              <Search className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("search")}
                className="h-10 ps-10 pe-4"
              />
            </div>
          </form>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-primary/5",
                  pathname === link.href && "bg-primary/5 text-primary"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="ms-auto flex items-center gap-1 sm:gap-2">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <Search className="size-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hidden sm:flex" asChild>
              <Link href="/profile/wishlist">
                <Heart className="size-5" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" className="hidden sm:flex" asChild>
              <Link href="/notifications">
                <Bell className="size-5" />
              </Link>
            </Button>
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="hidden sm:flex"
              >
                {theme === "dark" ? <Sun className="size-5" /> : <Moon className="size-5" />}
              </Button>
            )}
            <Button variant="ghost" size="icon" className="relative" asChild>
              <Link href="/cart">
                <ShoppingCart className="size-5" />
                {itemCount > 0 && (
                  <Badge className="absolute -end-1 -top-1 flex size-5 items-center justify-center p-0 text-[10px]">
                    {itemCount}
                  </Badge>
                )}
              </Link>
            </Button>
            {isAuthenticated ? (
              <Button variant="ghost" size="sm" className="hidden sm:flex gap-2" asChild>
                <Link href="/profile">
                  <User className="size-4" />
                  <span className="max-w-[100px] truncate">{user?.name.split(" ")[0]}</span>
                </Link>
              </Button>
            ) : (
              <Button variant="outline" size="sm" className="hidden sm:flex" asChild>
                <Link href="/login">{t("login")}</Link>
              </Button>
            )}
            <Button variant="ghost" size="icon" className="sm:hidden" asChild>
              <Link href="/profile">
                <User className="size-5" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <Menu className="size-5" />
            </Button>
          </div>
        </div>

        {/* Categories mega nav - desktop */}
        <div className="hidden border-t py-1.5 lg:block">
          <div className="flex items-center gap-1 overflow-x-auto">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className="flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm hover:bg-primary/5"
              >
                <span>{cat.icon}</span>
                <span>{locale === "ar" ? cat.nameAr : cat.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile search */}
        <form onSubmit={handleSearch} className="pb-3 md:hidden">
          <div className="relative">
            <Search className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("search")}
              className="h-10 ps-10"
            />
          </div>
        </form>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="border-t bg-card lg:hidden">
          <nav className="container-marketplace space-y-1 py-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-primary/5"
              >
                {link.label}
              </Link>
            ))}
            <Link href="/profile" onClick={() => setMobileMenuOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-primary/5">
              {t("profile")}
            </Link>
            <button onClick={switchLocale} className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-primary/5">
              <Globe className="size-4" />
              {locale === "en" ? "العربية" : "English"}
            </button>
          </nav>
        </div>
      )}
      <LocationSelector open={locationOpen} onOpenChange={setLocationOpen} />
    </header>
  );
}

export function MobileBottomNav() {
  const t = useTranslations("common");
  const pathname = usePathname();
  const itemCount = useCartStore((s) => s.getItemCount());

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
