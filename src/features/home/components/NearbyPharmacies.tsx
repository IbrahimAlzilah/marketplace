"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { PharmacyCard } from "@/features/pharmacies";
import { SectionCarousel } from "@/shared/components/marketplace";
import { pharmacies } from "@/lib/mock-data";

export function NearbyPharmacies() {
  const t = useTranslations("home");
  const tc = useTranslations("common");
  const nearbyPharmacies = pharmacies.slice(0, 6);

  return (
    <section className="container-marketplace">
      <div className="mb-4 flex items-center justify-between lg:mb-4">
        <h2 className="text-xl font-bold lg:text-2xl">{t("nearbyPharmacies")}</h2>
        <Link href="/pharmacies" className="text-sm font-medium text-primary hover:underline">
          {tc("seeAll")}
        </Link>
      </div>
      <SectionCarousel
        items={nearbyPharmacies}
        renderItem={(pharmacy) => <PharmacyCard pharmacy={pharmacy} />}
        itemClassName="basis-[85%] sm:basis-[48%] md:basis-[31%] lg:basis-[25%]"
      />
    </section>
  );
}
