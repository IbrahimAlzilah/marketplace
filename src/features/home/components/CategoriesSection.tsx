"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { categories } from "@/lib/mock-data";

export function CategoriesSection() {
  const t = useTranslations("home");
  const tc = useTranslations("common");
  const locale = useLocale();

  return (
    <section className="container-marketplace">
      <div className="mb-4 flex items-center justify-between lg:mb-4">
        <h2 className="text-xl font-bold lg:text-2xl">{t("categories")}</h2>
        <Link href="/categories" className="text-sm font-medium text-primary hover:underline">
          {tc("seeAll")}
        </Link>
      </div>
      <div className="grid grid-cols-4 gap-3 sm:grid-cols-4 md:grid-cols-8 lg:gap-4">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/products?category=${cat.slug}`}
            className="flex flex-col items-center gap-2 rounded-xl border bg-card p-3 transition-all duration-300 hover:border-primary/30 lg:p-4"
          >
            <span className="text-2xl lg:text-3xl">{cat.icon}</span>
            <span className="text-center text-xs font-medium leading-tight lg:text-sm">
              {locale === "ar" ? cat.nameAr : cat.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
