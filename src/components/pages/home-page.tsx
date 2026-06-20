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

  return (
    <div className="space-y-8 pb-8 lg:space-y-12">
      {/* Hero Banner */}
      <section className="container-marketplace pt-4 lg:pt-6">
        <div className="relative overflow-hidden rounded-2xl">
          <div className="relative aspect-[21/9] min-h-[180px] sm:aspect-[21/7] lg:aspect-[21/6]">
            <Image
              src={banners[activeBanner].image}
              alt={locale === "ar" ? banners[activeBanner].titleAr : banners[activeBanner].title}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-center p-6 sm:p-10 lg:p-16">
              <h1 className="max-w-lg text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
                {locale === "ar" ? banners[activeBanner].titleAr : banners[activeBanner].title}
              </h1>
              <p className="mt-2 max-w-md text-sm text-white/80 sm:text-base">
                {locale === "ar" ? banners[activeBanner].subtitleAr : banners[activeBanner].subtitle}
              </p>
              <Button asChild className="mt-4 w-fit" size="lg">
                <Link href={banners[activeBanner].link}>
                  {tc("viewAll")}
                  <ChevronRight className="size-4 rtl:rotate-180" />
                </Link>
              </Button>
            </div>
          </div>
          <div className="absolute bottom-4 start-1/2 flex -translate-x-1/2 gap-2">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveBanner(i)}
                className={`h-2 rounded-full transition-all ${i === activeBanner ? "w-6 bg-white" : "w-2 bg-white/50"}`}
                aria-label={`Banner ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Wallet & Loyalty highlights - desktop row */}
      <section className="container-marketplace">
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
      </section>

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
              className="flex flex-col items-center gap-2 rounded-xl border bg-card p-3 transition-shadow hover:shadow-xs lg:p-4"
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

      {/* Promotions */}
      <section className="container-marketplace">
        <div className="mb-4 flex items-center justify-between lg:mb-4">
          <h2 className="text-xl font-bold lg:text-2xl">{t("promotions")}</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {banners.map((banner) => (
            <Link key={banner.id} href={banner.link} className="group relative overflow-hidden rounded-xl">
              <div className="relative aspect-[16/7]">
                <Image
                  src={banner.image}
                  alt={locale === "ar" ? banner.titleAr : banner.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                  sizes="(max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-black/30" />
                <div className="absolute inset-0 flex items-end p-4">
                  <p className="font-semibold text-white">
                    {locale === "ar" ? banner.titleAr : banner.title}
                  </p>
                </div>
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
          itemClassName="basis-[46%] sm:basis-[46%] md:basis-[31%] lg:basis-[20%]"
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
          itemClassName="basis-[46%] sm:basis-[46%] md:basis-[31%] lg:basis-[20%]"
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
            itemClassName="basis-[46%] sm:basis-[46%] md:basis-[31%] lg:basis-[20%]"
          />
        </section>
      )}

      {/* Download App Section */}
      <section className="container-marketplace my-8 md:my-12">
        <div className="relative overflow-visible rounded-3xl bg-secondary/90 px-6 py-12 sm:px-12 md:px-16 md:py-20 lg:py-24 text-white">
          {/* Main flex container for layout */}
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
                    src="/images/app-store.svg?v=1"
                    alt={t("appStore")}
                    width={162}
                    height={48}
                    className="h-12 w-auto"
                  />
                </Link>
                <Link href="#" className="hover:opacity-90 transition-opacity">
                  <Image
                    src="/images/google-play.svg?v=1"
                    alt={t("googlePlay")}
                    width={162}
                    height={48}
                    className="h-12 w-auto"
                  />
                </Link>
              </div>
            </div>
          </div>

          {/* 3D phone mockup overlay for desktop */}
          <div className="absolute hidden md:block -top-10 -bottom-10 end-8 lg:end-16 w-[260px] lg:w-[300px] pointer-events-none drop-shadow-2xl">
            <Image
              src="/images/mockup-app.png?v=1"
              alt="Yusur App Mockup"
              fill
              className="object-contain"
              sizes="(max-width: 1024px) 260px, 300px"
              priority
            />
          </div>

          {/* Mobile phone mockup inside regular layout flow */}
          <div className="md:hidden flex justify-center mt-8 w-full max-w-[200px] mx-auto aspect-[9/18.5] relative drop-shadow-xl h-96">
            <Image
              src="/images/mockup-app.png?v=1"
              alt="Yusur App Mockup"
              fill
              className="object-contain"
              sizes="200px"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
