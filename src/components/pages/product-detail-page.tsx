"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Clock, Heart, MapPin, Shield, ShoppingCart, Star, Truck } from "lucide-react";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductCard, QuantityStepper } from "@/components/marketplace/product-card";
import {
  getProductBySlug,
  getPharmacyById,
  products,
  getProductsByCategory,
} from "@/lib/mock-data";
import { useCartStore } from "@/stores/cart-store";
import { useWishlistStore } from "@/stores/wishlist-store";
import { useRecentlyViewedStore } from "@/stores/recently-viewed-store";
import { cn, formatPrice, formatRating } from "@/lib/utils";

export function ProductDetailPage({ slug }: { slug: string }) {
  const product = getProductBySlug(slug);
  const t = useTranslations("products");
  const tc = useTranslations("common");
  const locale = useLocale();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const addItem = useCartStore((s) => s.addItem);
  const { toggleItem, isInWishlist } = useWishlistStore();
  const addRecentlyViewed = useRecentlyViewedStore((s) => s.addItem);

  useEffect(() => {
    if (product) addRecentlyViewed(product.id);
  }, [product, addRecentlyViewed]);

  if (!product) notFound();

  const pharmacy = getPharmacyById(product.pharmacyId);
  const name = locale === "ar" ? product.nameAr : product.name;
  const description = locale === "ar" ? product.descriptionAr : product.description;
  const related = getProductsByCategory(product.categoryId)
    .filter((p) => p.id !== product.id)
    .slice(0, 4);
  const inWishlist = isInWishlist(product.id);

  return (
    <div className="container-marketplace py-6 lg:py-6">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">{tc("home")}</Link>
        <span className="mx-2">/</span>
        <Link href="/products" className="hover:text-foreground">{tc("products")}</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{name}</span>
      </nav>

      {/* Desktop: 3-column Amazon-style layout */}
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left: Images */}
        <div className="lg:col-span-5">
          <div className="flex gap-4">
            <div className="hidden flex-col gap-2 sm:flex">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={cn(
                    "relative h-16 w-16 overflow-hidden rounded-lg border-2",
                    activeImage === i ? "border-primary" : "border-transparent"
                  )}
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
            <div className="relative aspect-square flex-1 overflow-hidden rounded-xl border bg-muted">
              <Image
                src={product.images[activeImage]}
                alt={name}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </div>
          </div>
        </div>

        {/* Center: Info */}
        <div className="lg:col-span-4">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">{product.brand}</p>
              <h1 className="mt-1 text-2xl font-bold lg:text-3xl">{name}</h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-warning text-warning" />
                <span className="font-medium">{formatRating(product.rating)}</span>
              </div>
              <span className="text-sm text-muted-foreground">
                ({product.reviewCount} {tc("reviews")})
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.badge && (
                <Badge variant="offer">{product.badge}</Badge>
              )}
              {product.requiresPrescription && (
                <Badge variant="rx">{tc("prescriptionRequired")}</Badge>
              )}
              <Badge variant={product.inStock ? "success" : "destructive"}>
                {product.inStock ? tc("inStock") : tc("outOfStock")}
              </Badge>
            </div>
            <Separator />
            <Tabs defaultValue="description">
              <TabsList>
                <TabsTrigger value="description">{t("description")}</TabsTrigger>
                <TabsTrigger value="howto">{t("howToUse")}</TabsTrigger>
                <TabsTrigger value="ingredients">{t("ingredients")}</TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {description}
              </TabsContent>
              <TabsContent value="howto" className="mt-4 text-sm text-muted-foreground">
                Follow your healthcare provider&apos;s instructions. Do not exceed recommended dosage.
              </TabsContent>
              <TabsContent value="ingredients" className="mt-4 text-sm text-muted-foreground">
                Active ingredients and full composition listed on product packaging.
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Right: Sticky purchase panel */}
        <div className="lg:col-span-3">
          <Card className="sticky top-36">
            <CardContent className="space-y-4 p-6">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-primary">{formatPrice(product.price)}</span>
                  {product.originalPrice && (
                    <span className="text-lg text-muted-foreground line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{tc("vat")}</p>
              </div>

              {pharmacy && (
                <div className="rounded-lg border p-3 space-y-2">
                  <Link
                    href={`/pharmacies/${pharmacy.slug}`}
                    className="flex items-center gap-2 font-medium hover:text-primary"
                  >
                    <div className="relative h-8 w-8 overflow-hidden rounded">
                      <Image src={pharmacy.logo} alt="" fill className="object-cover" />
                    </div>
                    {locale === "ar" ? pharmacy.nameAr : pharmacy.name}
                  </Link>
                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-warning text-warning" />
                      {formatRating(pharmacy.rating)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {pharmacy.eta} {tc("min")}
                    </span>
                    <span className="flex items-center gap-1">
                      <Truck className="h-3 w-3" />
                      {pharmacy.deliveryFee === 0 ? tc("freeDelivery") : formatPrice(pharmacy.deliveryFee)}
                    </span>
                  </div>
                  {pharmacy.licensed && (
                    <div className="flex items-center gap-1 text-xs text-primary">
                      <Shield className="h-3 w-3" />
                      {tc("licensed")}
                    </div>
                  )}
                </div>
              )}

              {product.requiresPrescription && (
                <div className="rounded-lg bg-violet-50 p-3 text-sm dark:bg-violet-900/20">
                  <p className="font-medium text-violet-800 dark:text-violet-300">
                    {tc("prescriptionRequired")}
                  </p>
                  <Button variant="outline" size="sm" className="mt-2 w-full">
                    Upload Prescription
                  </Button>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Quantity</span>
                <QuantityStepper
                  value={quantity}
                  onChange={setQuantity}
                  max={product.stockCount}
                />
              </div>

              <div className="space-y-2">
                <Button
                  className="w-full"
                  size="lg"
                  disabled={!product.inStock}
                  onClick={() => addItem(product.id, quantity)}
                >
                  <ShoppingCart className="h-4 w-4" />
                  {tc("addToCart")}
                </Button>
                <Button variant="outline" className="w-full" disabled={!product.inStock}>
                  {tc("buyNow")}
                </Button>
                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() => toggleItem(product.id)}
                >
                  <Heart className={cn("h-4 w-4", inWishlist && "fill-destructive text-destructive")} />
                  {tc("wishlist")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-6 text-xl font-bold">{t("related")}</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
