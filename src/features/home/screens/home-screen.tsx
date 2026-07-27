"use client";

import { HeroBanner } from "../components/HeroBanner";
import { CategoriesSection } from "../components/CategoriesSection";
import { NearbyPharmacies } from "../components/NearbyPharmacies";
import { BestDeals } from "../components/BestDeals";
import { FeaturedProducts } from "../components/FeaturedProducts";
import { RecommendedProducts } from "../components/RecommendedProducts";
import { RecentlyViewed } from "../components/RecentlyViewed";
import { DownloadApp } from "../components/DownloadApp";

export function HomePage() {
  return (
    <div className="space-y-8 pb-8 lg:space-y-12">
      <HeroBanner />
      <CategoriesSection />
      <NearbyPharmacies />
      <BestDeals />
      <FeaturedProducts />
      <RecommendedProducts />
      <RecentlyViewed />
      <DownloadApp />
    </div>
  );
}
