"use client";

import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { ProductCard } from "@/components/marketplace/product-card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categories, products, getCategoryBySlug } from "@/lib/mock-data";

type SortOption = "popular" | "price-low" | "price-high" | "rating";

export function ProductsPage() {
  const t = useTranslations("products");
  const locale = useLocale();
  const searchParams = useSearchParams();
  const categorySlug = searchParams.get("category");
  const [sort, setSort] = useState<SortOption>("popular");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    categorySlug ? [categorySlug] : []
  );

  const filteredProducts = useMemo(() => {
    let result = [...products];
    if (selectedCategories.length > 0) {
      const catIds = selectedCategories
        .map((slug) => getCategoryBySlug(slug)?.id)
        .filter(Boolean) as string[];
      result = result.filter((p) => catIds.includes(p.categoryId));
    }
    if (inStockOnly) {
      result = result.filter((p) => p.inStock);
    }
    switch (sort) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        result.sort((a, b) => b.reviewCount - a.reviewCount);
    }
    return result;
  }, [selectedCategories, inStockOnly, sort]);

  const toggleCategory = (slug: string) => {
    setSelectedCategories((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  const FiltersSidebar = () => (
    <aside className="space-y-6">
      <div>
        <h3 className="mb-3 font-semibold">{t("category")}</h3>
        <div className="space-y-2">
          {categories.map((cat) => (
            <div key={cat.id} className="flex items-center gap-2">
              <Checkbox
                id={`cat-${cat.id}`}
                checked={selectedCategories.includes(cat.slug)}
                onCheckedChange={() => toggleCategory(cat.slug)}
              />
              <Label htmlFor={`cat-${cat.id}`} className="cursor-pointer text-sm">
                {locale === "ar" ? cat.nameAr : cat.name}
              </Label>
            </div>
          ))}
        </div>
      </div>
      <Separator />
      <div>
        <h3 className="mb-3 font-semibold">{t("availability")}</h3>
        <div className="flex items-center gap-2">
          <Checkbox
            id="in-stock"
            checked={inStockOnly}
            onCheckedChange={(c) => setInStockOnly(!!c)}
          />
          <Label htmlFor="in-stock" className="cursor-pointer text-sm">
            {t("inStockOnly")}
          </Label>
        </div>
      </div>
      <Button
        variant="outline"
        className="w-full"
        onClick={() => {
          setSelectedCategories([]);
          setInStockOnly(false);
        }}
      >
        Clear filters
      </Button>
    </aside>
  );

  return (
    <div className="container-marketplace py-6 lg:py-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold lg:text-3xl">{t("title")}</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            {t("results", { count: filteredProducts.length })}
          </span>
          <Select value={sort} onValueChange={(v) => setSort(v as SortOption)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t("sort")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">{t("sortPopular")}</SelectItem>
              <SelectItem value="price-low">{t("sortPriceLow")}</SelectItem>
              <SelectItem value="price-high">{t("sortPriceHigh")}</SelectItem>
              <SelectItem value="rating">{t("sortRating")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mb-4 lg:hidden">
        <details className="rounded-xl border bg-card">
          <summary className="cursor-pointer px-4 py-3 font-semibold">{t("filters")}</summary>
          <div className="border-t p-4">
            <FiltersSidebar />
          </div>
        </details>
      </div>

      <div className="flex gap-8">
        <div className="hidden w-56 shrink-0 lg:block xl:w-64">
          <div className="sticky top-36 rounded-xl border bg-card p-5">
            <h2 className="mb-4 font-semibold">{t("filters")}</h2>
            <FiltersSidebar />
          </div>
        </div>

        <div className="min-w-0 flex-1">
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-lg font-medium">No products found</p>
              <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
