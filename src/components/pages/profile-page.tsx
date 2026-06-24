"use client";

import { useTranslations } from "next-intl";
import { ProfileLayout } from "@/components/layout/profile-sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "@/i18n/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { formatPrice } from "@/lib/utils";
import { Star, Wallet } from "lucide-react";

export function ProfilePage() {
  const t = useTranslations("profile");
  const tc = useTranslations("common");
  const user = useAuthStore((s) => s.user);

  return (
    <ProfileLayout title={t("title")}>
      <div className="grid gap-6 sm:grid-cols-2">
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent shadow-none">
          <CardContent className="flex items-center gap-4 p-5">
            <Wallet className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">{tc("wallet")}</p>
              <p className="text-xl font-bold">{formatPrice(125.5)}</p>
            </div>
            <Button variant="outline" size="sm" className="ms-auto" asChild>
              <Link href="/profile/wallet">{tc("viewAll")}</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="border-secondary/20 bg-gradient-to-br from-secondary/5 to-transparent shadow-none">
          <CardContent className="flex items-center gap-4 p-5">
            <Star className="h-8 w-8 text-secondary" />
            <div>
              <p className="text-sm text-muted-foreground">{tc("loyalty")}</p>
              <p className="text-xl font-bold">2,400 pts</p>
            </div>
            <Button variant="outline" size="sm" className="ms-auto" asChild>
              <Link href="/profile/loyalty">{tc("viewAll")}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardContent className="p-6 space-y-4">
          <h2 className="font-semibold text-lg">{t("personalInfo")}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>{t("fullName")}</Label>
              <Input defaultValue={user?.name ?? "Ahmed Al-Rashid"} className="mt-1" />
            </div>
            <div>
              <Label>{t("phone")}</Label>
              <Input defaultValue={user?.phone ?? "+966 5XX XXX XXXX"} className="mt-1" />
            </div>
            <div className="sm:col-span-2">
              <Label>{t("email")}</Label>
              <Input defaultValue={user?.email ?? "ahmed@example.com"} className="mt-1" />
            </div>
          </div>
          <Button>{tc("save")}</Button>
        </CardContent>
      </Card>
    </ProfileLayout>
  );
}
