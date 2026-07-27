"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ProductCard } from "@/features/products";
import { SectionCarousel } from "@/shared/components/marketplace";
import { products } from "@/lib/mock-data";

export function FeaturedProducts() {
  const t = useTranslations("home");
  const tc = useTranslations("common");
  const featuredProducts = products.slice(0, 8);

  return (
    <section className="container-marketplace">
      <div className="mb-4 flex items-center justify-between lg:mb-4">
        <h2 className="text-xl font-bold lg:text-2xl">{t("featuredProducts")}</h2>
        <Link href="/products" className="text-sm font-medium text-primary hover:underline">
          {tc("seeAll")}
        </Link>
      </div>
      <SectionCarousel
        items={featuredProducts}
        renderItem={(product) => <ProductCard product={product} />}
        itemClassName="basis-[46%] sm:basis-[46%] md:basis-[31%] lg:basis-[20%] xl:basis-[20%]"
      />
    </section>
  );
}
