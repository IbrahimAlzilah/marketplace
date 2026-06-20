"use client";

import { useTranslations } from "next-intl";
import { ProfileLayout } from "@/components/layout/profile-sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { addresses } from "@/lib/mock-data";
import { MapPin, Plus } from "lucide-react";

export function AddressesPage() {
  const t = useTranslations("common");

  return (
    <ProfileLayout title={t("addresses")}>
      <div className="mb-4 flex justify-end">
        <Button><Plus className="h-4 w-4" />Add Address</Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {addresses.map((addr) => (
          <Card key={addr.id}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="font-semibold">{addr.label}</span>
                  {addr.isDefault && <Badge variant="secondary">Default</Badge>}
                </div>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {addr.street}, {addr.district}, {addr.city}
              </p>
              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm">{t("edit")}</Button>
                <Button variant="ghost" size="sm" className="text-destructive">{t("delete")}</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ProfileLayout>
  );
}
