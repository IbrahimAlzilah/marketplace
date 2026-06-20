"use client";

import { useTranslations } from "next-intl";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  { q: "How do I place an order?", a: "Browse products, add to cart, and proceed to checkout. Select your address, delivery option, and payment method." },
  { q: "Can I order from multiple pharmacies?", a: "Yes. Your cart groups items by pharmacy. Each pharmacy ships separately with its own delivery fee and ETA." },
  { q: "How do I use my wallet balance?", a: "At checkout, toggle 'Use wallet balance' to apply your available credit toward your order total." },
  { q: "How do loyalty points work?", a: "Earn 1 point per SAR 1 spent. Redeem 100 points for SAR 1 discount at checkout." },
  { q: "What if I need a prescription?", a: "Products marked with Rx require a valid prescription. Upload your prescription during checkout for pharmacy verification." },
  { q: "What is your return policy?", a: "Unopened products can be returned within 7 days. Prescription medicines are non-returnable unless defective." },
];

export function FaqPage() {
  const t = useTranslations("help");

  return (
    <div className="container-marketplace py-6 lg:py-6">
      <h1 className="mb-8 text-2xl font-bold lg:text-3xl">{t("faqTitle")}</h1>
      <div className="mx-auto max-w-3xl">
        <Accordion type="single" collapsible className="space-y-2">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="rounded-lg border px-4">
              <AccordionTrigger className="text-start hover:no-underline">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
