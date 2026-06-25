"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { ChevronRight, Star, Wallet } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProductCard } from "@/components/marketplace/product-card";
import { PharmacyCard } from "@/components/marketplace/pharmacy-card";
import { SectionCarousel } from "@/components/marketplace/section-carousel";
import { banners, categories, pharmacies, products } from "@/lib/mock-data";
import { useRecentlyViewedStore } from "@/stores/recently-viewed-store";
import { getProductById } from "@/lib/mock-data";
import { formatPrice } from "@/lib/utils";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function HomePage() {
  const t = useTranslations("home");
  const tc = useTranslations("common");
  const locale = useLocale();
  const [activeBanner, setActiveBanner] = useState(0);
  const recentlyViewedIds = useRecentlyViewedStore((s) => s.items);
  const recentlyViewed = recentlyViewedIds.map(getProductById).filter(Boolean);

  const featuredProducts = products.slice(0, 8);
  const recommendedProducts = products.slice(4, 12);
  const nearbyPharmacies = pharmacies.slice(0, 6);

  const activeHero = banners[activeBanner];

  return (
    <div className="space-y-8 pb-8 lg:space-y-12">
      {/* Hero Banner */}
      <section className="container-marketplace pt-4 lg:pt-6">
        <div className="relative overflow-hidden rounded-2xl bg-muted shadow-sm">
          <div className="relative aspect-[2.5/1] w-full min-h-[160px] md:min-h-[200px] lg:max-h-[400px]">
            <Image
              src={activeHero.image}
              alt={locale === "ar" ? activeHero.titleAr : activeHero.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1440px"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-transparent md:from-black/70 md:via-black/35 md:to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-center p-5 sm:p-8 md:max-w-[55%] lg:p-12">
              <h1 className="text-xl font-bold text-white sm:text-2xl md:text-3xl lg:text-4xl">
                {locale === "ar" ? activeHero.titleAr : activeHero.title}
              </h1>
              <p className="mt-2 max-w-md text-sm text-white/90 sm:text-base">
                {locale === "ar" ? activeHero.subtitleAr : activeHero.subtitle}
              </p>
              <Button asChild className="mt-4 w-fit" size="lg">
                <Link href={activeHero.link}>
                  {tc("viewAll")}
                  <ChevronRight className="size-4 rtl:rotate-180" />
                </Link>
              </Button>
            </div>
          </div>
          <div className="absolute bottom-4 start-1/2 z-10 flex -translate-x-1/2 gap-2">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveBanner(i)}
                className={cn(
                  "h-2 rounded-full transition-all",
                  i === activeBanner ? "w-6 bg-white" : "w-2 bg-white/50 hover:bg-white/70"
                )}
                aria-label={`Banner ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Wallet & Loyalty highlights */}
      {/* <section className="container-marketplace">
        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 shadow-none">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <Wallet className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">{t("walletHighlight")}</p>
                <p className="text-xl font-bold text-primary">{formatPrice(125.5)}</p>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/profile/wallet">{tc("viewAll")}</Link>
              </Button>
            </CardContent>
          </Card>
          <Card className="border-secondary/20 bg-gradient-to-br from-secondary/5 to-secondary/10 shadow-none">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10">
                <Star className="h-6 w-6 text-secondary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">{t("loyaltyHighlight")}</p>
                <p className="text-xl font-bold text-secondary">{t("points", { count: "2,400" })}</p>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/profile/loyalty">{tc("viewAll")}</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section> */}

      {/* Categories */}
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
              className="flex flex-col items-center gap-2 rounded-xl border bg-card p-3 transition-shadow hover:shadow-sm lg:p-4"
            >
              <span className="text-2xl lg:text-3xl">{cat.icon}</span>
              <span className="text-center text-xs font-medium leading-tight lg:text-sm">
                {locale === "ar" ? cat.nameAr : cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Nearby Pharmacies */}
      <section className="container-marketplace">
        <div className="mb-4 flex items-center justify-between lg:mb-4">
          <h2 className="text-xl font-bold lg:text-2xl">{t("nearbyPharmacies")}</h2>
          <Link href="/pharmacies" className="text-sm font-medium text-primary hover:underline">
            {tc("seeAll")}
          </Link>
        </div>
        <SectionCarousel
          items={nearbyPharmacies}
          renderItem={(pharmacy) => <PharmacyCard pharmacy={pharmacy} />}
          itemClassName="basis-[85%] sm:basis-[48%] md:basis-[31%] lg:basis-[25%]"
        />
      </section>

      {/* Special Offers */}
      <section className="container-marketplace">
        <div className="mb-4 flex items-center justify-between lg:mb-4">
          <h2 className="text-xl font-bold lg:text-2xl">{t("promotions")}</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {banners.map((banner) => (
            <Link
              key={banner.id}
              href={banner.link}
              className="group block overflow-hidden rounded-xl border bg-muted shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="relative aspect-[2/1] w-full sm:aspect-[5/2]">
                <Image
                  src={banner.image}
                  alt={locale === "ar" ? banner.titleAr : banner.title}
                  fill
                  className="object-cover object-center transition-transform duration-300 group-hover:scale-[1.02]"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
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
          itemClassName="basis-[46%] sm:basis-[46%] md:basis-[31%] lg:basis-[20%] xl:basis-[18%]"
        />
      </section>

      {/* Recommended */}
      <section className="container-marketplace">
        <div className="mb-4 flex items-center justify-between lg:mb-4">
          <h2 className="text-xl font-bold lg:text-2xl">{t("productsRecommended")}</h2>
        </div>
        <SectionCarousel
          items={recommendedProducts}
          renderItem={(product) => <ProductCard product={product} />}
          itemClassName="basis-[46%] sm:basis-[46%] md:basis-[31%] lg:basis-[20%] xl:basis-[18%]"
        />
      </section>

      {/* Recently Viewed */}
      {recentlyViewed.length > 0 && (
        <section className="container-marketplace">
          <div className="mb-4 flex items-center justify-between lg:mb-4">
            <h2 className="text-xl font-bold lg:text-2xl">{t("recentlyViewed")}</h2>
          </div>
          <SectionCarousel
            items={recentlyViewed.filter(Boolean) as typeof products}
            renderItem={(product) => <ProductCard product={product} />}
            itemClassName="basis-[46%] sm:basis-[46%] md:basis-[31%] lg:basis-[20%] xl:basis-[18%]"
          />
        </section>
      )}

      {/* Download App Section */}
      <section className="container-marketplace my-8 md:my-12">
        <div className="relative rounded-3xl bg-secondary/90 px-6 py-12 sm:px-12 md:px-16 md:py-20 lg:py-20 text-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 md:pe-[280px] lg:pe-[320px]">
            <div className="max-w-xl text-center md:text-start rtl:md:text-start">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                {t("downloadTitle")}
              </h2>
              <p className="mt-4 text-base opacity-90 leading-relaxed md:text-lg">
                {t("downloadSubtitle")}
              </p>
              <div className="flex flex-wrap gap-4 mt-8 justify-center md:justify-start">
                <Link href="#" className="hover:opacity-90 transition-opacity">
                  <Image
                    src="/images/app-store.svg"
                    alt={t("appStore")}
                    width={162}
                    height={48}
                    className="h-12 w-auto"
                  />
                </Link>
                <Link href="#" className="hover:opacity-90 transition-opacity">
                  <Image
                    src="/images/google-play.svg"
                    alt={t("googlePlay")}
                    width={162}
                    height={48}
                    className="h-12 w-auto"
                  />
                </Link>
              </div>
            </div>
          </div>

          <div className="pointer-events-none absolute -top-6 -bottom-6 end-4 hidden w-[220px] md:block lg:end-12 lg:w-[260px]">
            <div className="relative h-full w-full">
              <Image
                src="/images/mockup-app.png"
                alt="Yusur App Mockup"
                fill
                className="object-contain object-bottom drop-shadow-2xl"
                sizes="260px"
                priority
              />
            </div>
          </div>

          <div className="relative mx-auto mt-8 aspect-[9/18] w-full max-w-[180px] md:hidden">
            <Image
              src="/images/mockup-app.png"
              alt="Yusur App Mockup"
              fill
              className="object-contain drop-shadow-xl"
              sizes="180px"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
