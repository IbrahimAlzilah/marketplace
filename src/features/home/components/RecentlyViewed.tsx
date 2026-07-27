"use client";

import { useTranslations } from "next-intl";
import { ProductCard, useRecentlyViewedStore } from "@/features/products";
import { SectionCarousel } from "@/shared/components/marketplace";
import { getProductById, products } from "@/lib/mock-data";

export function RecentlyViewed() {
  const t = useTranslations("home");
  const recentlyViewedIds = useRecentlyViewedStore((s) => s.items);
  const recentlyViewed = recentlyViewedIds.map(getProductById).filter(Boolean);

  if (recentlyViewed.length === 0) {
    return null;
  }

  return (
    <section className="container-marketplace">
      <div className="mb-4 flex items-center justify-between lg:mb-4">
        <h2 className="text-xl font-bold lg:text-2xl">{t("recentlyViewed")}</h2>
      </div>
      <SectionCarousel
        items={recentlyViewed.filter(Boolean) as typeof products}
        renderItem={(product) => <ProductCard product={product} />}
        itemClassName="basis-[46%] sm:basis-[46%] md:basis-[31%] lg:basis-[20%] xl:basis-[20%]"
      />
    </section>
  );
}
