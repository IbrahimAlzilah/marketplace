"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { HelpCircle, MessageSquare, FileText } from "lucide-react";

export function HelpPage() {
  const t = useTranslations("help");

  const topics = [
    { href: "/help/faq", icon: HelpCircle, title: t("faq"), desc: t("faqDesc") },
    { href: "/help/contact", icon: MessageSquare, title: t("contact"), desc: t("contactDesc") },
    { href: "/legal/terms", icon: FileText, title: t("terms"), desc: t("termsDesc") },
  ];

  return (
    <div className="container-marketplace py-6 lg:py-6">
      <h1 className="mb-2 text-2xl font-bold lg:text-3xl">{t("title")}</h1>
      <p className="mb-8 text-muted-foreground">{t("subtitle")}</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {topics.map((topic) => {
          const Icon = topic.icon;
          return (
            <Link key={topic.href} href={topic.href}>
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardContent className="p-6">
                  <Icon className="h-8 w-8 text-primary" />
                  <h2 className="mt-4 font-semibold">{topic.title}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{topic.desc}</p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
