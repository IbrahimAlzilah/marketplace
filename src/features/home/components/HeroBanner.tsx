"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { banners } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/shared/components/ui/carousel";

export function HeroBanner() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

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
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/15 to-transparent md:from-black/30 md:via-black/10 md:to-transparent" />
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Arrows */}
        <button
          onClick={() => api?.scrollPrev()}
          className="absolute start-4 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white opacity-0 group-hover:opacity-100 hover:bg-white/35 transition-all duration-300 focus:outline-none"
          title="Previous slide"
          aria-label="Previous slide"
        >
          <ChevronLeft className="size-5 rtl:rotate-180" />
        </button>
        <button
          onClick={() => api?.scrollNext()}
          className="absolute end-4 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white opacity-0 group-hover:opacity-100 hover:bg-white/35 transition-all duration-300 focus:outline-none"
          title="Next slide"
          aria-label="Next slide"
        >
          <ChevronRight className="size-5 rtl:rotate-180" />
        </button>

        {/* Indicators */}
        <div className="absolute bottom-4 ltr:start-1/2 rtl:end-1/2 z-10 flex -translate-x-1/2 gap-2">
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
  );
}
