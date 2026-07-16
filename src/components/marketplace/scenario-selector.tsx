"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Beaker, ChevronRight, Play, RefreshCw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useCartStore } from "@/stores/cart-store";
import { SCENARIOS } from "@/lib/allocation-evaluator";
import { cn } from "@/lib/utils";

export function ScenarioSelector() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("checkout");
  const { activeScenarioId, setActiveScenarioId, setCheckoutLines, resetCheckout } = useCartStore();
  const [open, setOpen] = useState(false);

  const handleSelectScenario = (scenarioId: string) => {
    const scenario = SCENARIOS.find((s) => s.id === scenarioId);
    if (!scenario) return;

    // Reset checkout state
    resetCheckout();

    // Populate store cart items
    useCartStore.setState({
      items: scenario.items.map((it) => ({
        productId: it.productId,
        quantity: it.quantity,
      })),
      activeScenarioId: scenario.id,
    });

    // Close selector and redirect to cart to begin flow
    setOpen(false);
    router.push("/cart");
  };

  const handleReset = () => {
    resetCheckout();
    useCartStore.setState({
      items: [],
      activeScenarioId: null,
    });
    setOpen(false);
    router.push("/cart");
  };

  return (
    <div className="fixed bottom-8 end-6 z-50">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            size="lg"
            title={locale === "ar" ? "سيناريوهات الاختبار" : "Test Scenarios"}
            className="rounded-full shadow-2xl bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90 flex items-center gap-2 border border-white/20 h-12 w-12 px-3 hover:scale-105 transition-transform"
          >
            <Beaker className="size-6 animate-pulse" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-hidden flex flex-col p-6 rounded-3xl bg-card border">
          <DialogHeader className="pb-3 border-b">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                {locale === "ar" ? "أداة محاكاة سيناريوهات الشراء" : "Checkout Scenario Simulator"}
              </DialogTitle>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto py-4 pr-1 space-y-4 text-xs leading-normal">
            <p className="text-muted-foreground text-xs leading-relaxed">
              {locale === "ar"
                ? "اختر أحد السيناريوهات الـ 8 التالية لتحميل المنتجات وحالات الموافقة في سلتك تلقائياً واختبار تدفق الشراء خطوة بخطوة."
                : "Select one of the 8 business approval scenarios below to instantly load the required products and allocation outcomes into your cart."}
            </p>

            <div className="grid gap-3.5">
              {SCENARIOS.map((sc) => {
                const isActive = activeScenarioId === sc.id;
                const scName = locale === "ar" ? sc.nameAr : sc.name;

                return (
                  <button
                    key={sc.id}
                    onClick={() => handleSelectScenario(sc.id)}
                    className={cn(
                      "w-full text-start p-3.5 rounded-2xl border transition-all duration-200 hover:bg-primary/5 flex items-center justify-between gap-4",
                      isActive
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border hover:border-primary/30"
                    )}
                  >
                    <div className="space-y-1 flex-1 min-w-0">
                      <h4 className="font-bold text-sm text-foreground flex items-center gap-2 truncate">
                        {isActive && (
                          <span className="h-2.5 w-2.5 rounded-full bg-primary animate-ping shrink-0" />
                        )}
                        {scName}
                      </h4>
                      <p className="text-muted-foreground text-[11px]">
                        {locale === "ar"
                          ? `تحتوي على: ${sc.items.length} منتجات · ${sc.allocations.filter(a => a.status === "APPROVED").length} معتمدة`
                          : `Loads: ${sc.items.length} items · ${sc.allocations.filter(a => a.status === "APPROVED").length} approved`}
                      </p>
                    </div>
                    <div className={cn(
                      "h-8 w-8 rounded-full flex items-center justify-center border text-muted-foreground shrink-0 transition-colors",
                      isActive ? "bg-primary border-primary text-white" : "bg-card border-border hover:bg-primary/10 hover:text-primary"
                    )}>
                      <Play className="h-3.5 w-3.5 fill-current" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex gap-3 pt-3 border-t">
            <Button
              variant="outline"
              className="flex-1 py-5 rounded-xl text-xs font-bold flex items-center justify-center gap-2"
              onClick={handleReset}
            >
              <RefreshCw className="h-3.5 w-3.5" />
              {locale === "ar" ? "إعادة تعيين السلة" : "Reset Cart & Demo"}
            </Button>
            <Button
              className="flex-1 py-5 rounded-xl text-xs font-bold"
              onClick={() => setOpen(false)}
            >
              {locale === "ar" ? "إغلاق" : "Close"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
