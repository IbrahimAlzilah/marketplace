"use client";

import { useTranslations } from "next-intl";

export function LegalPage({ type }: { type: "terms" | "privacy" }) {
  const t = useTranslations("legal");

  const content =
    type === "terms"
      ? [
        { title: "1. Acceptance of Terms", body: "By accessing YUSUR Marketplace, you agree to these terms of service. If you do not agree, please do not use our platform." },
        { title: "2. Marketplace Services", body: "YUSUR connects consumers with licensed pharmacies. We facilitate orders but do not directly sell pharmaceutical products." },
        { title: "3. Prescription Medicines", body: "Prescription products require valid prescriptions verified by the dispensing pharmacy. False prescriptions may result in account termination." },
        { title: "4. Payments & Refunds", body: "All prices include VAT. Refunds for eligible products are credited to your YUSUR wallet within 5-7 business days." },
        { title: "5. Delivery", body: "Delivery times are estimates. YUSUR is not liable for delays caused by factors outside our control." },
      ]
      : [
        { title: "1. Information We Collect", body: "We collect personal information including name, phone, email, delivery addresses, and order history to provide our services." },
        { title: "2. How We Use Data", body: "Your data is used to process orders, improve services, send notifications, and comply with Saudi regulations including PDPL." },
        { title: "3. Data Sharing", body: "We share necessary order information with partner pharmacies and payment processors. We do not sell your personal data." },
        { title: "4. Data Security", body: "We implement industry-standard security measures to protect your personal and payment information." },
        { title: "5. Your Rights", body: "You may request access, correction, or deletion of your personal data by contacting support@yusur.sa." },
      ];

  return (
    <div className="container-marketplace py-6 lg:py-6">
      <h1 className="mb-8 text-2xl font-bold lg:text-3xl">
        {type === "terms" ? t("termsTitle") : t("privacyTitle")}
      </h1>
      <div className="prose prose-slate dark:prose-invert mx-auto max-w-3xl space-y-6">
        {content.map((section, i) => (
          <div key={i}>
            <h2 className="text-lg font-semibold">{section.title}</h2>
            <p className="mt-2 text-muted-foreground leading-relaxed">{section.body}</p>
          </div>
        ))}
        <p className="text-sm text-muted-foreground pt-4">Last updated: June 2026</p>
      </div>
    </div>
  );
}
