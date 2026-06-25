"use client";

import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";

export function SiteFooter() {
  const t = useTranslations("footer");
  const tc = useTranslations("common");
  const locale = useLocale();

  return (
    <footer className="mt-auto border-t bg-card">
      <div className="container-marketplace pt-8 pb-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="mb-4 flex items-center gap-2">
              <Image
                src="/images/logo.png"
                alt="Yusur Logo"
                width={120}
                height={32}
                className="h-8 w-auto object-contain dark:brightness-0 dark:invert"
                style={{ width: "auto" }}
              />
            </Link>
            <p className="text-sm text-muted-foreground">{t("aboutText")}</p>
          </div>
          <div>
            <h4 className="mb-4 font-semibold">{t("quickLinks")}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/products" className="hover:text-foreground">{tc("products")}</Link></li>
              <li><Link href="/pharmacies" className="hover:text-foreground">{tc("pharmacies")}</Link></li>
              <li><Link href="/orders" className="hover:text-foreground">{tc("orders")}</Link></li>
              <li><Link href="/profile/wishlist" className="hover:text-foreground">{tc("wishlist")}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-semibold">{t("support")}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/help" className="hover:text-foreground">{t("helpCenter")}</Link></li>
              <li><Link href="/help/faq" className="hover:text-foreground">{t("faq")}</Link></li>
              <li><Link href="/help/contact" className="hover:text-foreground">{t("contact")}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-semibold">{t("legal")}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/legal/terms" className="hover:text-foreground">{t("terms")}</Link></li>
              <li><Link href="/legal/privacy" className="hover:text-foreground">{t("privacy")}</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
          {t("copyright")}
        </div>
      </div>
    </footer>
  );
}
