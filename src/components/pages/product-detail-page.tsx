"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Clock, Heart, MapPin, Shield, ShoppingCart, Star, Truck, Loader2 } from "lucide-react";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductCard, QuantityStepper } from "@/components/marketplace/product-card";
import {
  getProductBySlug,
  getPharmacyById,
  products,
  getProductsByCategory,
  mockVendors,
} from "@/lib/mock-data";
import { useCartStore } from "@/stores/cart-store";
import { useWishlistStore } from "@/stores/wishlist-store";
import { useRecentlyViewedStore } from "@/stores/recently-viewed-store";
import { cn, formatPrice, formatRating } from "@/lib/utils";

export function ProductDetailPage({ slug }: { slug: string }) {
  const product = getProductBySlug(slug);
  const [selectedVendor, setSelectedVendor] = useState(mockVendors[2]);
  const t = useTranslations("products");
  const tc = useTranslations("common");
  const locale = useLocale();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const { items, addItem } = useCartStore();
  const [loading, setLoading] = useState(false);
  const cartItem = items.find((item) => item.productId === product?.id);
  const { toggleItem, isInWishlist } = useWishlistStore();
  const addRecentlyViewed = useRecentlyViewedStore((s) => s.addItem);

  useEffect(() => {
    if (product) addRecentlyViewed(product.id);
  }, [product, addRecentlyViewed]);

  if (!product) notFound();

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
      <div className="grid grid-cols-1 gap-8 md:grid-cols-[4fr_5fr_3.5fr]">
        {/* Left: Images */}
        <div className="flex flex-col gap-4">
          {/* Main Large Image Card */}
          <div className="relative aspect-square flex-1 overflow-hidden rounded-xl border bg-white dark:bg-muted/30">
            <Image
              src={product.images[activeImage]}
              alt={name}
              fill
              className="object-contain p-4 sm:p-6"
              priority
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
            <button
              onClick={() => toggleItem(product.id)}
              className="absolute end-4 top-4 rounded-full border bg-background/80 p-2.5 backdrop-blur-sm transition-all hover:scale-105 shadow-xs flex items-center justify-center"
              aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart className={cn("size-5", inWishlist && "fill-secondary text-secondary")} />
            </button>
          </div>

          {/* Image Dots Indicator */}
          <div className="flex justify-center items-center gap-1.5 py-1">
            {product.images.map((_, i) => {
              const isActive = activeImage === i;
              return (
                <span
                  key={i}
                  className={cn(
                    "transition-all duration-300 rounded-full",
                    isActive ? "w-8 h-2 bg-primary" : "w-2.5 h-2.5 bg-slate-200"
                  )}
                />
              );
            })}
          </div>

          {/* Thumbnail Images gallery row */}
          <div className="flex justify-center items-center gap-2.5 flex-wrap">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={cn(
                  "relative h-14 w-14 overflow-hidden rounded-md border border-2 bg-white p-1 transition-all duration-200",
                  activeImage === i 
                    ? "border-primary scale-110" 
                    : "border-slate-200 hover:border-slate-300"
                )}
              >
                <div className="relative h-full w-full">
                  <Image src={img} alt="" fill className="object-contain" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Center: Info */}
        <div className="space-y-4">
          <div>
            {/* Pharmacy Vendor Tag above Title */}
            <div className="flex items-center gap-2 text-xs font-semibold text-primary mb-1">
              <span>🏥</span>
              <Link href={`/pharmacies/${selectedVendor.slug}`} className="hover:underline">
                {locale === "ar" ? selectedVendor.nameAr : selectedVendor.name}
              </Link>
              <span className="text-muted-foreground/60">|</span>
              <span className="flex items-center gap-1 text-warning font-bold">
                <Star className="size-3.5 fill-warning text-warning" />
                {selectedVendor.rating}
              </span>
            </div>

            <h1 className="text-2xl font-bold lg:text-3xl text-foreground">{name}</h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-sm font-semibold text-warning">
              <Star className="size-3.5 fill-warning text-warning" />
              {formatRating(product.rating)}
            </div>
            <span className="text-xs text-muted-foreground">
              ({product.reviewCount} {tc("reviews")})
            </span>
          </div>

          {/* Price breakdown with dynamic vendor price, original price, and 13% off badge */}
          <div className="flex items-baseline gap-3 flex-wrap">
            <span className="text-2xl font-extrabold text-primary">
              {formatPrice(selectedVendor.price)}
            </span>
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(selectedVendor.price * 1.15)}
            </span>
            <span className="text-xs bg-red-100 text-red-600 font-bold px-2.5 py-1 rounded-lg border border-red-200">
              {locale === "ar" ? "%13 خصم" : "13% OFF"}
            </span>
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

        {/* Right: Sticky purchase panel */}
        <div className="space-y-4">
          <Card className="sticky top-36 border rounded-2xl bg-card">
            <CardContent className="space-y-3 p-6">
              <div>
                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-1">
                  {locale === "ar" ? "الإجمالي / PRICE" : "PRICE / الإجمالي"}
                </p>
                <span className="text-2xl font-extrabold text-primary">{formatPrice(selectedVendor.price)}</span>
              </div>

              <Separator />

              {/* Select Pharmacy Vendor Dropdown */}
              <div className="space-y-3 py-1 text-start">
                <div className="space-y-1">
                  <span className="text-sm font-medium text-foreground/80 block">
                    {t("selectPharmacyVendor")}
                  </span>
                  <Select
                    value={selectedVendor.id}
                    onValueChange={(val) => {
                      const found = mockVendors.find((v) => v.id === val);
                      if (found) setSelectedVendor(found);
                    }}
                  >
                    <SelectTrigger className="w-full bg-white text-sm h-10 border-slate-200/80 rounded-lg focus:ring-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white rounded-xl">
                      {mockVendors.map((vendor) => {
                        const vName = locale === "ar" ? vendor.nameAr : vendor.name;
                        return (
                          <SelectItem key={vendor.id} value={vendor.id} className="text-xs">
                            <div className="flex items-center gap-2">
                              {/* Round avatar showing first letter */}
                              <div className="h-6 w-6 rounded-full border border-slate-200 bg-white flex items-center justify-center font-bold text-primary text-[10px] shrink-0">
                                {vendor.logo}
                              </div>
                              <span className="font-semibold">{vName}</span>
                              <span className="text-muted-foreground text-xs mx-0.5">
                                ({formatPrice(vendor.price)})
                              </span>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                {/* Sub-lines */}
                <div className="space-y-2 text-sm pt-1.5 border-t">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Truck className="size-3.5 text-muted-foreground" />
                    <span>
                      {t("deliveryBy", { pharmacy: locale === "ar" ? selectedVendor.nameAr : selectedVendor.name })}
                    </span>
                  </div>

                  {/* Selected vendor specs: MapPin distance, Clock eta, and Truck fee */}
                  <div className="flex items-center gap-2 text-foreground/80 font-medium flex-wrap">
                    <div className="flex items-center gap-1">
                      <MapPin className="size-3.5 text-muted-foreground" />
                      <span>{selectedVendor.distance}</span>
                    </div>
                    <span className="text-muted-foreground/30">•</span>
                    <div className="flex items-center gap-1">
                      <Clock className="size-3.5 text-muted-foreground" />
                      <span>{locale === "ar" ? selectedVendor.etaAr : selectedVendor.eta}</span>
                    </div>
                    <span className="text-muted-foreground/30">•</span>
                    <div className="flex items-center gap-1">
                      <Truck className="size-3.5 text-muted-foreground" />
                      <span>{selectedVendor.deliveryFee === 0 ? tc("freeDelivery") : formatPrice(selectedVendor.deliveryFee)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between py-1">
                <span className="text-sm font-medium">Quantity</span>
                <QuantityStepper
                  value={quantity}
                  onChange={setQuantity}
                  max={product.stockCount}
                />
              </div>

              <div className="space-y-2">
                {cartItem ? (
                  <Button
                    variant="outline"
                    className="w-full border-primary text-primary hover:bg-primary/5 rounded-lg py-5"
                    asChild
                  >
                    <Link href="/cart">
                      View Cart / عرض السلة
                    </Link>
                  </Button>
                ) : (
                  <Button
                    className="w-full"
                    size="lg"
                    disabled={!product.inStock || loading}
                    onClick={() => {
                      setLoading(true);
                      setTimeout(() => {
                        addItem(product.id, quantity);
                        setLoading(false);
                      }, 850);
                    }}
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <ShoppingCart className="h-4 w-4" />
                        {tc("addToCart")}
                      </>
                    )}
                  </Button>
                )}
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
