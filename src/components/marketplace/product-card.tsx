"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Heart, MapPin, Minus, Plus, ShoppingCart, Star } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn, formatPrice, formatRating } from "@/lib/utils";
import type { Product } from "@/lib/mock-data";
import { getPharmacyById } from "@/lib/mock-data";
import { useCartStore } from "@/stores/cart-store";
import { useWishlistStore } from "@/stores/wishlist-store";
import { useToast } from "@/components/providers/toast-provider";

type ProductCardProps = {
  product: Product;
  className?: string;
};

export function ProductCard({ product, className }: ProductCardProps) {
  const t = useTranslations("common");
  const tt = useTranslations("toast");
  const locale = useLocale();
  const addItem = useCartStore((s) => s.addItem);
  const { toast } = useToast();
  const { toggleItem, isInWishlist } = useWishlistStore();
  const pharmacy = getPharmacyById(product.pharmacyId);
  const inWishlist = isInWishlist(product.id);
  const name = locale === "ar" ? product.nameAr : product.name;
  const pharmacyName = pharmacy ? (locale === "ar" ? pharmacy.nameAr : pharmacy.name) : "";

  const badgeVariant =
    product.badge === "offer"
      ? "offer"
      : product.badge === "bestseller"
        ? "secondary"
        : product.badge === "new"
          ? "success"
          : "default";

  return (
    <Card className={cn("group h-full overflow-hidden shadow-none", className)}>
      <div className="relative aspect-square overflow-hidden bg-white dark:bg-muted/30">
        <Link href={`/products/${product.slug}`} className="relative block h-full">
          <Image
            src={product.image}
            alt={name}
            fill
            className="object-contain p-3 transition-transform duration-300 group-hover:scale-105 sm:p-4"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          />
        </Link>
        <div className="absolute start-2 top-2 flex flex-col gap-1">
          {product.badge && (
            <Badge variant={badgeVariant} className="text-[10px]">
              {product.badge === "offer" ? "Offer" : product.badge === "bestseller" ? "Best Seller" : "New"}
            </Badge>
          )}
          {product.requiresPrescription && (
            <Badge variant="rx" className="text-[10px]">Rx</Badge>
          )}
        </div>
        <button
          onClick={() => toggleItem(product.id)}
          className="absolute end-2 top-2 rounded-full bg-background/80 p-2 backdrop-blur-sm transition-colors hover:bg-background"
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={cn("h-4 w-4", inWishlist && "fill-destructive text-destructive")} />
        </button>
        {!product.inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/60">
            <Badge variant="destructive">{t("outOfStock")}</Badge>
          </div>
        )}
      </div>
      <CardContent className="p-3">
        <Link href={`/products/${product.slug}`} className="block space-y-0.5">
          <p className="text-xs text-muted-foreground">{product.brand}</p>
          <h3 className="line-clamp-2 text-sm font-medium leading-snug truncate">{name}</h3>
        </Link>
        <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
          <Star className="h-3 w-3 fill-warning text-warning" />
          <span>{formatRating(product.rating)}</span>
          <span>({product.reviewCount})</span>
        </div>
        <p className="mt-0.5 truncate text-xs text-muted-foreground">{pharmacyName}</p>
        <div className="mt-2 flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-bold text-primary">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          <Button
            size="icon"
            className="h-8 w-8 shrink-0"
            disabled={!product.inStock}
            onClick={() => {
              addItem(product.id);
              toast({ title: tt("addedToCart"), description: tt("addedToCartDesc") });
            }}
            aria-label={t("addToCart")}
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-square animate-pulse bg-muted" />
      <CardContent className="space-y-2 p-3">
        <div className="h-3 w-16 animate-pulse rounded bg-muted" />
        <div className="h-4 w-full animate-pulse rounded bg-muted" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
        <div className="h-5 w-20 animate-pulse rounded bg-muted" />
      </CardContent>
    </Card>
  );
}

export function QuantityStepper({
  value,
  onChange,
  max = 99,
}: {
  value: number;
  onChange: (v: number) => void;
  max?: number;
}) {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={() => onChange(value - 1)}
        disabled={value <= 1}
      >
        <Minus className="h-3 w-3" />
      </Button>
      <span className="w-8 text-center text-sm font-medium">{value}</span>
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
      >
        <Plus className="h-3 w-3" />
      </Button>
    </div>
  );
}
