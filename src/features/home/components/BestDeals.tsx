"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { banners } from "@/lib/mock-data";

export function BestDeals() {
  const t = useTranslations("home");
  const locale = useLocale();

  return (
    <section className="container-marketplace">
      <div className="mb-4 flex items-center justify-between lg:mb-4">
        <h2 className="text-xl font-bold lg:text-2xl">{t("promotions")}</h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {banners.map((banner) => (
          <Link
            key={banner.id}
            href={banner.link}
            className="group block overflow-hidden rounded-xl border bg-muted transition-shadow hover:shadow-xs"
          >
            <div className="relative aspect-[2/1] w-full sm:aspect-[5/2]">
              <Image
                src={banner.image}
                alt={locale === "ar" ? banner.titleAr : banner.title}
                fill
                className="object-cover object-center transition-transform duration-300 group-hover:scale-[1.01]"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
