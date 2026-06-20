"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Clock, MapPin, Phone, Star } from "lucide-react";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/marketplace/product-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getPharmacyBySlug, getProductsByPharmacy } from "@/lib/mock-data";
import { formatRating } from "@/lib/utils";

export function PharmacyDetailPage({ slug }: { slug: string }) {
  const pharmacy = getPharmacyBySlug(slug);
  const t = useTranslations("pharmacies");
  const tc = useTranslations("common");
  const locale = useLocale();

  if (!pharmacy) notFound();

  const name = locale === "ar" ? pharmacy.nameAr : pharmacy.name;
  const address = locale === "ar" ? pharmacy.addressAr : pharmacy.address;
  const products = getProductsByPharmacy(pharmacy.id);

  return (
    <div>
      {/* Cover */}
      <div className="relative h-48 sm:h-64 lg:h-72">
        <Image src={pharmacy.cover} alt={name} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      <div className="container-marketplace -mt-16 relative z-10 pb-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex items-end gap-4">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border-4 border-background shadow-lg lg:h-28 lg:w-28">
              <Image src={pharmacy.logo} alt={name} fill className="object-cover" />
            </div>
            <div className="pb-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold text-white lg:text-3xl">{name}</h1>
                <Badge variant={pharmacy.isOpen ? "success" : "destructive"}>
                  {pharmacy.isOpen ? tc("open") : tc("closed")}
                </Badge>
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-white/80">
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-warning text-warning" />
                  {formatRating(pharmacy.rating)} ({pharmacy.reviewCount})
                </span>
                {pharmacy.licensed && <span>{tc("licensed")}</span>}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm">
              <Phone className="h-4 w-4" />
              {t("call")}
            </Button>
            <Button variant="secondary" size="sm">
              <MapPin className="h-4 w-4" />
              {t("directions")}
            </Button>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <Tabs defaultValue="products">
              <TabsList>
                <TabsTrigger value="products">{t("products")}</TabsTrigger>
                <TabsTrigger value="offers">{t("offers")}</TabsTrigger>
                <TabsTrigger value="reviews">{tc("reviews")}</TabsTrigger>
                <TabsTrigger value="branches">{t("branches")}</TabsTrigger>
              </TabsList>
              <TabsContent value="products" className="mt-6">
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="offers" className="mt-6">
                <p className="text-muted-foreground">Special offers from {name} coming soon.</p>
              </TabsContent>
              <TabsContent value="reviews" className="mt-6">
                <p className="text-muted-foreground">Customer reviews for {name}.</p>
              </TabsContent>
              <TabsContent value="branches" className="mt-6">
                <div className="rounded-xl border p-4">
                  <p className="font-medium">{address}</p>
                  <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {pharmacy.eta} {tc("min")} · {pharmacy.distance} {tc("km")}
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="lg:col-span-4">
            <div className="sticky top-36 rounded-xl border bg-card p-5 space-y-3">
              <h3 className="font-semibold">Delivery Info</h3>
              <div className="text-sm text-muted-foreground space-y-2">
                <p className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  Est. delivery: {pharmacy.eta} {tc("min")}
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  {pharmacy.distance} {tc("km")} away
                </p>
              </div>
              {!pharmacy.isOpen && pharmacy.opensAt && (
                <p className="text-sm text-warning">{tc("opensAt", { time: pharmacy.opensAt })}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
