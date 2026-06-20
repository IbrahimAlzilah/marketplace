"use client";

import { useTranslations } from "next-intl";
import { ProfileLayout } from "@/components/layout/profile-sidebar";
import { ProductCard } from "@/components/marketplace/product-card";
import { Button } from "@/components/ui/button";
import { getProductById } from "@/lib/mock-data";
import { useWishlistStore } from "@/stores/wishlist-store";
import { Link } from "@/i18n/navigation";
import { Heart } from "lucide-react";

export function WishlistPage() {
  const t = useTranslations("common");
  const items = useWishlistStore((s) => s.items);
  const products = items.map(getProductById).filter(Boolean);

  return (
    <ProfileLayout title={t("wishlist")}>
      {products.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-center">
          <Heart className="h-12 w-12 text-muted-foreground/50" />
          <p className="mt-4 text-lg font-medium">Your wishlist is empty</p>
          <Button asChild className="mt-4">
            <Link href="/products">{t("continueShopping")}</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => product && (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </ProfileLayout>
  );
}
