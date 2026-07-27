"use client";

import { useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Heart, MapPin, Minus, Plus, ShoppingCart, Loader2, Trash2 } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Price } from "@/components/ui/currency";
import type { Product } from "@/lib/mock-data";
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
  const { items, addItem, updateQuantity } = useCartStore();
  const { toast } = useToast();
  const { toggleItem, isInWishlist } = useWishlistStore();
  const inWishlist = isInWishlist(product.id);
  const name = locale === "ar" ? product.nameAr : product.name;

  const [loading, setLoading] = useState(false);
  const cartItem = items.find((item) => item.productId === product.id);

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
              {product.badge === "offer" ? t("badgeOffer") : product.badge === "bestseller" ? t("badgeBestseller") : t("badgeNew")}
            </Badge>
          )}
          {product.requiresPrescription && (
            <Badge variant="rx" className="text-[10px]">Rx</Badge>
          )}
        </div>
        <button
          onClick={() => toggleItem(product.id)}
          className="absolute end-2 top-2 rounded-full bg-background/80 p-1.5 backdrop-blur-sm transition-colors hover:bg-background"
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={cn("size-4", inWishlist && "fill-secondary text-secondary")} />
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

        <div className="mt-2.5 flex flex-col leading-tight">
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <Price amount={product.price} className="text-base text-primary font-bold" />
            {product.originalPrice && (
              <Price
                amount={product.originalPrice}
                className="text-xs text-muted-foreground line-through font-normal"
                iconClassName="text-muted-foreground"
              />
            )}
          </div>
        </div>

        <div className="mt-3">
          {cartItem ? (
            <QuantityStepper
              value={cartItem.quantity}
              onChange={(q) => updateQuantity(product.id, q)}
              max={product.stockCount}
              className="w-full h-10 flex justify-between p-1"
            />
          ) : (
            <Button
              className={cn(
                "w-full h-10 rounded-full text-sm font-medium bg-primary hover:bg-primary/95 text-white flex items-center justify-center gap-2 transition-all duration-300",
                loading && "bg-primary/80 text-white/90 cursor-not-allowed"
              )}
              disabled={!product.inStock || loading}
              onClick={() => {
                setLoading(true);
                setTimeout(() => {
                  addItem(product.id);
                  setLoading(false);
                  toast({ title: tt("addedToCart"), description: tt("addedToCartDesc") });
                }, 800);
              }}
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin shrink-0" />
                  <span>{t("addingToCart")}</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="size-4 shrink-0" />
                  <span>{t("addToCart")}</span>
                </>
              )}
            </Button>
          )}
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

import { QuantityStepper } from "@/components/marketplace/quantity-stepper";

export { QuantityStepper };

