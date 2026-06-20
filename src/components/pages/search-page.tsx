"use client";

import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { ProductCard } from "@/components/marketplace/product-card";
import { PharmacyCard } from "@/components/marketplace/pharmacy-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { products, pharmacies } from "@/lib/mock-data";

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q")?.toLowerCase() ?? "";
  const t = useTranslations("common");
  const locale = useLocale();

  const matchedProducts = products.filter((p) => {
    const name = locale === "ar" ? p.nameAr : p.name;
    return name.toLowerCase().includes(query) || p.brand.toLowerCase().includes(query);
  });

  const matchedPharmacies = pharmacies.filter((p) => {
    const name = locale === "ar" ? p.nameAr : p.name;
    return name.toLowerCase().includes(query);
  });

  return (
    <div className="container-marketplace py-6 lg:py-6">
      <h1 className="mb-6 text-2xl font-bold">
        Search results for &ldquo;{query}&rdquo;
      </h1>
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All ({matchedProducts.length + matchedPharmacies.length})</TabsTrigger>
          <TabsTrigger value="products">{t("products")} ({matchedProducts.length})</TabsTrigger>
          <TabsTrigger value="pharmacies">{t("pharmacies")} ({matchedPharmacies.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-6 space-y-8">
          {matchedPharmacies.length > 0 && (
            <div>
              <h2 className="mb-4 font-semibold">{t("pharmacies")}</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {matchedPharmacies.map((p) => (
                  <PharmacyCard key={p.id} pharmacy={p} variant="horizontal" />
                ))}
              </div>
            </div>
          )}
          {matchedProducts.length > 0 && (
            <div>
              <h2 className="mb-4 font-semibold">{t("products")}</h2>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {matchedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}
          {matchedProducts.length === 0 && matchedPharmacies.length === 0 && (
            <p className="text-center text-muted-foreground py-12">{t("noResults")}</p>
          )}
        </TabsContent>
        <TabsContent value="products" className="mt-6">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {matchedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="pharmacies" className="mt-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {matchedPharmacies.map((p) => (
              <PharmacyCard key={p.id} pharmacy={p} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export function SearchPage() {
  return (
    <Suspense>
      <SearchResults />
    </Suspense>
  );
}
