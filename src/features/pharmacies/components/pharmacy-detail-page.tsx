"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Clock, MapPin, Phone, Star } from "lucide-react";
import { notFound } from "next/navigation";
import { ProductCard } from "@/features/products";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
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
      <div className="relative h-32 sm:h-44 lg:h-48">
        <Image src={pharmacy.cover} alt={name} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      <div className="container-marketplace -mt-16 relative z-10 pb-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex items-end gap-4">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border-4 border-background shadow-sm lg:h-26 lg:w-26">
              <Image src={pharmacy.logo} alt={name} fill className="object-cover" />
            </div>
            <div className="pb-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold text-foreground lg:text-3xl">{name}</h1>
                <Badge variant={pharmacy.isOpen ? "success" : "destructive"}>
                  {pharmacy.isOpen ? tc("open") : tc("closed")}
                </Badge>
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
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

        <div className="mt-6">
          <Tabs defaultValue="products" className="w-full">
            <TabsList>
              <TabsTrigger value="products">{t("products")}</TabsTrigger>
              <TabsTrigger value="offers">{t("offers")}</TabsTrigger>
              <TabsTrigger value="reviews">{tc("reviews")}</TabsTrigger>
              <TabsTrigger value="branches">{t("branches")}</TabsTrigger>
              <TabsTrigger value="info">{locale === "ar" ? "Ù…Ø¹Ù„ÙˆÙ…Ø§Øª" : "Info"}</TabsTrigger>
            </TabsList>
            <TabsContent value="products" className="mt-6">
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
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
              <div className="rounded-xl border p-4 bg-card">
                <p className="font-medium">{address}</p>
                <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {pharmacy.eta} {tc("min")} Â· {pharmacy.distance} {tc("km")}
                </p>
              </div>
            </TabsContent>
            <TabsContent value="info" className="mt-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="rounded-xl border p-5 space-y-4 bg-card">
                  <h3 className="font-semibold text-lg">{locale === "ar" ? "Ù…Ø¹Ù„ÙˆÙ…Ø§Øª Ø§Ù„ØªÙˆØµÙŠÙ„" : "Delivery Info"}</h3>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <p className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <span>{locale === "ar" ? "ÙˆÙ‚Øª Ø§Ù„ØªÙˆØµÙŠÙ„ Ø§Ù„Ù…ØªÙˆÙ‚Ø¹" : "Est. delivery"}: {pharmacy.eta} {tc("min")}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span>{pharmacy.distance} {tc("km")} {locale === "ar" ? "Ø¨Ø¹ÙŠØ¯" : "away"}</span>
                    </p>
                  </div>
                </div>

                <div className="rounded-xl border p-5 space-y-4 bg-card">
                  <h3 className="font-semibold text-lg">{locale === "ar" ? "ØªÙØ§ØµÙŠÙ„ Ø§Ù„ØµÙŠØ¯Ù„ÙŠØ©" : "Pharmacy Details"}</h3>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <p className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span>{address}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <span>
                        {pharmacy.isOpen ? tc("open") : tc("closed")}
                        {!pharmacy.isOpen && pharmacy.opensAt && ` Â· ${tc("opensAt", { time: pharmacy.opensAt })}`}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

