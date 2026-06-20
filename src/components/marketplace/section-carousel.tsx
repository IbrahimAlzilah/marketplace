"use client";

import * as React from "react";
import { useLocale } from "next-intl";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

type SectionCarouselProps<T> = {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  itemClassName?: string;
  className?: string;
};

export function SectionCarousel<T>({
  items,
  renderItem,
  itemClassName = "basis-[80%] sm:basis-[45%] md:basis-[33.33%] lg:basis-[25%]",
  className,
}: SectionCarouselProps<T>) {
  const locale = useLocale();

  return (
    <div className={cn("relative w-full", className)}>
      <Carousel
        opts={{
          align: "start",
          loop: false,
          direction: locale === "ar" ? "rtl" : "ltr",
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-3 md:-ml-4">
          {items.map((item, index) => (
            <CarouselItem
              key={index}
              className={cn("pl-3 md:pl-4", itemClassName)}
            >
              {renderItem(item)}
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="hidden md:block">
          <CarouselPrevious className="absolute top-1/2 -translate-y-1/2 -start-6 lg:-start-10 xl:-start-12 h-10 w-10 border-primary/20 bg-background/90 text-primary shadow-sm backdrop-blur-sm transition-all hover:bg-primary hover:text-white" />
          <CarouselNext className="absolute top-1/2 -translate-y-1/2 -end-6 lg:-end-10 xl:-end-12 h-10 w-10 border-primary/20 bg-background/90 text-primary shadow-sm backdrop-blur-sm transition-all hover:bg-primary hover:text-white" />
        </div>
      </Carousel>
    </div>
  );
}
