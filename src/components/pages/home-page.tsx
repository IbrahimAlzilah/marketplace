"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "@/components/marketplace/product-card";
import { PharmacyCard } from "@/components/marketplace/pharmacy-card";
import { SectionCarousel } from "@/components/marketplace/section-carousel";
import { banners, categories, pharmacies, products } from "@/lib/mock-data";
import { useRecentlyViewedStore } from "@/stores/recently-viewed-store";
import { getProductById } from "@/lib/mock-data";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

export function HomePage() {
  const t = useTranslations("home");
  const tc = useTranslations("common");
  const locale = useLocale();
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const recentlyViewedIds = useRecentlyViewedStore((s) => s.items);
  const recentlyViewed = recentlyViewedIds.map(getProductById).filter(Boolean);

  const featuredProducts = products.slice(0, 8);
  const recommendedProducts = products.slice(4, 12);
  const nearbyPharmacies = pharmacies.slice(0, 6);

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });

    const interval = setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext();
      } else {
        api.scrollTo(0);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [api]);

  return (
    <div className="space-y-8 pb-8 lg:space-y-12">
      {/* Hero Banner */}
      <section className="container-marketplace pt-4 lg:pt-6">
        <Carousel
          setApi={setApi}
          opts={{ loop: true }}
          className="group relative overflow-hidden rounded-2xl bg-muted shadow-xs"
        >
          <CarouselContent>
            {banners.map((banner) => (
              <CarouselItem key={banner.id}>
                <Link href={banner.link} className="block relative aspect-[2.5/1] w-full min-h-[160px] md:min-h-[200px] lg:max-h-[400px]">
                  <Image
                    src={banner.image}
                    alt="Hero Banner"
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1440px"
                    className="object-cover object-center"
                  />
                  {/* <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-transparent md:from-black/70 md:via-black/35 md:to-transparent" /> */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/15 to-transparent md:from-black/30 md:via-black/10 md:to-transparent" />
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Arrows */}
          <button
            onClick={() => api?.scrollPrev()}
            className="absolute left-4 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white opacity-0 group-hover:opacity-100 hover:bg-white/35 transition-all duration-300 focus:outline-none rtl:left-auto rtl:right-4"
            aria-label="Previous slide"
          >
            <ChevronLeft className="size-5 rtl:rotate-180" />
          </button>
          <button
            onClick={() => api?.scrollNext()}
            className="absolute right-4 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white opacity-0 group-hover:opacity-100 hover:bg-white/35 transition-all duration-300 focus:outline-none rtl:right-auto rtl:left-4"
            aria-label="Next slide"
          >
            <ChevronRight className="size-5 rtl:rotate-180" />
          </button>

          {/* Indicators */}
          <div className="absolute bottom-4 start-1/2 z-10 flex -translate-x-1/2 gap-2">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => api?.scrollTo(i)}
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  i === current ? "w-6 bg-white" : "w-2 bg-white/50 hover:bg-white/70"
                )}
                aria-label={`Banner ${i + 1}`}
              />
            ))}
          </div>
        </Carousel>
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

          <div className="pointer-events-none absolute -top-16 bottom-6 end-10 hidden w-[240px] md:block lg:w-[380px] z-10">
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
