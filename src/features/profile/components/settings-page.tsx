"use client";

import { useTranslations, useLocale } from "next-intl";
import { ProfileLayout } from "@/components/layout/profile-sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { useTheme } from "next-themes";
import { Globe, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SettingsPage() {
  const t = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const switchLocale = () => {
    router.replace(pathname, { locale: locale === "en" ? "ar" : "en" });
  };

  return (
    <ProfileLayout title={t("settings")}>
      <div className="space-y-4">
        <Card>
          <CardContent className="flex items-center justify-between p-5">
            <div className="flex items-center gap-3">
              <Globe className="h-5 w-5 text-primary" />
              <div>
                <Label>{t("language")}</Label>
                <p className="text-sm text-muted-foreground">
                  {locale === "en" ? "English" : "العربية"}
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={switchLocale}>
              {locale === "en" ? "العربية" : "English"}
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-5">
            <div className="flex items-center gap-3">
              <Moon className="h-5 w-5 text-primary" />
              <div>
                <Label>{t("darkMode")}</Label>
                <p className="text-sm text-muted-foreground">Toggle dark/light theme</p>
              </div>
            </div>
            <Switch
              checked={theme === "dark"}
              onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
            />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <Label>{t("notifications")}</Label>
              <p className="text-sm text-muted-foreground">Order updates and promotions</p>
            </div>
            <Switch defaultChecked />
          </CardContent>
        </Card>
        <Button variant="destructive" className="w-full sm:w-auto" onClick={handleLogout}>{t("logout")}</Button>
      </div>
    </ProfileLayout>
  );
}
