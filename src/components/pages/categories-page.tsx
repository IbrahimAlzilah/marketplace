"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { categories } from "@/lib/mock-data";

export function CategoriesPage() {
  const t = useTranslations("home");
  const locale = useLocale();

  return (
    <div className="container-marketplace py-6 lg:py-6">
      <h1 className="mb-8 text-2xl font-bold lg:text-3xl">{t("categories")}</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((cat) => (
          <Link key={cat.id} href={`/products?category=${cat.slug}`}>
            <Card className="h-full transition-shadow hover:shadow-md">
              <CardContent className="flex flex-col items-center gap-3 p-8 text-center">
                <span className="text-4xl">{cat.icon}</span>
                <h2 className="font-semibold text-lg">
                  {locale === "ar" ? cat.nameAr : cat.name}
                </h2>
                <p className="text-sm text-primary">Browse products →</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
