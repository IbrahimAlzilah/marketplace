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
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
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

  const columns = [
    [categories[0], categories[4]], // Medicines, Medical Devices
    [categories[1], categories[5]], // Vitamins, Personal Care
    [categories[2], categories[6]], // Baby Care, Fitness
    [categories[3], categories[7]], // Skin Care, Herbal
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
    <header className="sticky top-0 z-50 border-b bg-card">
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
              style={{ width: "auto" }}
              priority
            />
          </Link>

          {/* Search - desktop */}
          <form onSubmit={handleSearch} className="hidden flex-1 md:flex max-w-lg">
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
            <Button
              variant="ghost"
              size="sm"
              onClick={switchLocale}
              className="hidden sm:flex"
            >
              <Globe className="size-5 text-foreground/70" />
              {/* <span>{locale === "en" ? "العربية" : "English"}</span> */}
              <span>{locale === "en" ? "AR" : "EN"}</span>
            </Button>
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

      {/*  Quick Links mega nav - desktop */}
      <div
        className="relative hidden border-t border-slate-200/80 py-1.5 lg:block bg-card"
        onMouseLeave={() => setMegaMenuOpen(false)}
      >
        <div className="container-marketplace relative flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 overflow-x-auto">
            {/* All Categories trigger */}
            <button
              onClick={() => setMegaMenuOpen(!megaMenuOpen)}
              onMouseEnter={() => setMegaMenuOpen(true)}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm hover:bg-primary/5 transition-colors cursor-pointer",
                megaMenuOpen ? "text-primary bg-primary/5" : "text-foreground"
              )}
            >
              <Menu className="size-4" />
              <span>{t("allCategories")}</span>
              <ChevronDown className={cn("size-3.5 transition-transform duration-300")} />
            </button>

            {/* Desktop Nav Quick Links */}
            <Link
              href="/"
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm transition-colors hover:bg-primary/5 shrink-0",
                pathname === "/" ? "text-primary bg-primary/5" : "text-foreground/80"
              )}
            >
              {t("home")}
            </Link>
            <Link
              href="/pharmacies"
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm transition-colors hover:bg-primary/5 shrink-0",
                pathname === "/pharmacies" ? "text-primary bg-primary/5" : "text-foreground/80"
              )}
            >
              {t("pharmacies")}
            </Link>
            <Link
              href="/offers"
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm transition-colors hover:bg-primary/5 shrink-0",
                pathname === "/offers" ? "text-primary bg-primary/5" : "text-foreground/80"
              )}
            >
              {t("offers")}
            </Link>
            <Link
              href="/prescription"
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm transition-colors hover:bg-primary/5 shrink-0",
                pathname === "/prescription" ? "text-primary bg-primary/5" : "text-foreground/80"
              )}
            >
              {t("prescription")}
            </Link>
          </div>

          {/* Delivery Location badge/button */}
          <button
            onClick={() => setLocationOpen(true)}
            className="flex shrink-0 items-center gap-2 rounded-md border bg-muted/40 px-3 py-1 text-xs text-foreground/90 hover:bg-primary/5 hover:text-primary transition-all duration-200 border-border cursor-pointer"
          >
            <Image
              src="/images/flag-sa.webp"
              alt="SA Flag"
              width={18}
              height={12}
              className="rounded-sm object-contain"
              style={{ width: "auto", height: "auto" }}
            />
            <span className="flex items-center gap-1">
              <span className="text-muted-foreground font-medium">{t("deliveryTo")}:</span>
              <span className="font-semibold text-primary truncate max-w-[150px]">{district}, {city}</span>
            </span>
            <ChevronDown className="size-3 text-muted-foreground" />
          </button>

          {/* Mega Menu Dropdown Panel */}
          {megaMenuOpen && (
            <div
              className="absolute inset-x-0 top-full z-50 mt-1 border rounded-2xl bg-card shadow-2xl transition-all duration-300"
              onMouseEnter={() => setMegaMenuOpen(true)}
            >
              <div className="py-8 px-6">
                <div className="grid grid-cols-4 gap-8">
                  {columns.map((col, colIdx) => (
                    <div key={colIdx} className="space-y-8">
                      {col.map((cat) => {
                        if (!cat) return null;
                        const catName = locale === "ar" ? cat.nameAr : cat.name;
                        return (
                          <div key={cat.id} className="space-y-3">
                            <Link
                              href={`/products?category=${cat.slug}`}
                              className="block text-sm font-bold text-primary hover:text-primary/80 transition-colors border-b pb-1.5 border-primary/10"
                              onClick={() => setMegaMenuOpen(false)}
                            >
                              {catName}
                            </Link>
                            {cat.subcategories && (
                              <ul className="space-y-2">
                                {cat.subcategories.map((sub) => {
                                  const subName = locale === "ar" ? sub.nameAr : sub.name;
                                  return (
                                    <li key={sub.id}>
                                      <Link
                                        href={`/products?category=${cat.slug}&subcategory=${sub.slug}`}
                                        className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                                        onClick={() => setMegaMenuOpen(false)}
                                      >
                                        {subName}
                                      </Link>
                                    </li>
                                  );
                                })}
                              </ul>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
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
            <Link href="/profile/wallet" onClick={() => setMobileMenuOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-primary/5">
              {t("wallet")}
            </Link>
            <Link href="/profile/loyalty" onClick={() => setMobileMenuOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-primary/5">
              {t("loyalty")}
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
