"use client";

import { useTranslations } from "next-intl";
import { ProductCard } from "@/features/products";
import { SectionCarousel } from "@/shared/components/marketplace";
import { products } from "@/lib/mock-data";

export function RecommendedProducts() {
  const t = useTranslations("home");
  const recommendedProducts = products.slice(4, 12);

  return (
    <section className="container-marketplace">
      <div className="mb-4 flex items-center justify-between lg:mb-4">
        <h2 className="text-xl font-bold lg:text-2xl">{t("productsRecommended")}</h2>
      </div>
      <SectionCarousel
        items={recommendedProducts}
        renderItem={(product) => <ProductCard product={product} />}
        itemClassName="basis-[46%] sm:basis-[46%] md:basis-[31%] lg:basis-[20%] xl:basis-[20%]"
      />
    </section>
  );
}
