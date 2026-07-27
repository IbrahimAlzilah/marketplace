"use client";

import { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Clock, Loader2, CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { Price } from "@/shared/components/ui/currency";
import { getProductById } from "@/lib/mock-data";
import { useCartStore } from "../store/cart-store";
import { cn } from "@/lib/utils";
import { getMockAllocations, AllocationStatus, AllocationItem, SCENARIOS } from "@/features/checkout/lib/allocation-evaluator";

import { EmptyCart } from "../components/EmptyCart";
import { CartList } from "../components/CartList";
import { CartSummary } from "../components/CartSummary";
import { CartFooter } from "../components/CartFooter";
import { Shipping } from "../components/Shipping";

const mockAddresses = [
  { id: "addr-1", label: "the home", isMain: true, address: "Samaya Furnished Apartments, Room 260, Al Quds, Riyadh, Saudi Arabia" },
  { id: "addr-2", label: "the job", isMain: false, address: "Samaya Furnished Apartments, Room 260, Al Quds, Riyadh, Saudi Arabia" },
  { id: "addr-3", label: "the job", isMain: false, address: "Samaya Furnished Apartments, Room 260, Al Quds, Riyadh, Saudi Arabia" }
];

const mockApprovedPharmacies = [
  {
    name: "Nahdi Pharmacy",
    products: [
      { name: "Aspirin 100mg", qty: 1, price: 129.35 },
      { name: "Vitamin D3", qty: 1, price: 129.35 },
      { name: "Ibuprofen 200mg", qty: 1, price: 129.35 }
    ],
    deliveryFee: 129.35
  },
  {
    name: "Avnzor Pharmacy",
    products: [
      { name: "Cough Syrup", qty: 1, price: 129.35 },
      { name: "First Aid Kit", qty: 1, price: 129.35 }
    ],
    deliveryFee: 129.35
  }
];

const mockRejectedPharmacies = [
  {
    name: "Whites Pharmacy",
    reason: "Some items are currently out of stock",
    products: [
      { name: "Omega-3 Fish Oil", qty: 1, price: 129.35 },
      { name: "Multivitamin", qty: 1, price: 129.35 }
    ]
  }
];

export function CartPage() {
  const t = useTranslations("cart");
  const tCheckout = useTranslations("checkout");
  const locale = useLocale();
  const router = useRouter();
  const { items, checkoutLines, setCheckoutLines, setCheckoutAddressId, resetCheckout, activeScenarioId } = useCartStore();

  // Address dialog state
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [selectedAddrId, setSelectedAddrId] = useState("addr-1");

  // Simulated pharmacy approvals states
  const [processingOpen, setProcessingOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);

  // Flowchart Substitute State Gaps
  const [approvedPharmacies, setApprovedPharmacies] = useState(mockApprovedPharmacies);
  const [rejectedPharmacies, setRejectedPharmacies] = useState(mockRejectedPharmacies);
  const [alternativesOpen, setAlternativesOpen] = useState(false);

  // Allocation Simulation
  const [finalAllocations, setFinalAllocations] = useState<AllocationItem[]>([]);

  const getPharmacyTranslation = (name: string) => {
    if (name.includes("Nahdi")) return tCheckout("nahdiPharmacy");
    if (name.includes("Avnzor")) return tCheckout("avnzorPharmacy");
    if (name.includes("Whites")) return tCheckout("whitesPharmacy");
    return name;
  };

  const getProductTranslation = (name: string) => {
    if (name.includes("Aspirin")) return tCheckout("aspirin");
    if (name.includes("Vitamin")) return tCheckout("vitaminD");
    if (name.includes("Ibuprofen")) return tCheckout("ibuprofen");
    if (name.includes("Cough")) return tCheckout("coughSyrup");
    if (name.includes("First Aid")) return tCheckout("firstAidKit");
    if (name.includes("Omega-3")) return tCheckout("omega3");
    if (name.includes("Multivitamin")) return tCheckout("multivitamin");
    return name;
  };

  useEffect(() => {
    if (!processingOpen) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const nextTime = prev - 1;

        if (nextTime <= 0) {
          clearInterval(interval);
          setProcessingOpen(false);
          router.push("/checkout");
          return 0;
        }

        let pharmacyIdToUnlock = "";
        if (nextTime === 50) {
          pharmacyIdToUnlock = "p1";
        } else if (nextTime === 30) {
          pharmacyIdToUnlock = "p4";
        } else if (nextTime === 10) {
          pharmacyIdToUnlock = "ALL_REMAINING";
        }

        if (pharmacyIdToUnlock) {
          const currentLines = useCartStore.getState().checkoutLines;
          const updated = currentLines.map(line => {
            const final = finalAllocations.find(f => f.productId === line.productId);
            if (!final) return line;

            if (pharmacyIdToUnlock === "ALL_REMAINING" || line.pharmacyId === pharmacyIdToUnlock) {
              return {
                ...line,
                allocatedQty: final.allocatedQty,
                status: final.status,
                resolution: final.status === AllocationStatus.APPROVED ? ("approved" as const) : ("pending" as const),
              };
            }
            return line;
          });
          setCheckoutLines(updated);
        }

        return nextTime;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [processingOpen, finalAllocations, router, setCheckoutLines]);

  if (checkoutLines && checkoutLines.length > 0) {
    return (
      <div className="container-marketplace py-12 max-w-2xl mx-auto text-center space-y-6">
        <div className="flex justify-center">
          <div className="bg-secondary/12 relative flex size-20 items-center justify-center rounded-full">
            <div className="border-secondary/40 border-t-secondary border-r-secondary absolute inset-4.5 animate-spin rounded-full border-[3.5px]" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">{tCheckout("cartLocked")}</h1>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">{tCheckout("cartLockedDesc")}</p>
        </div>

        <div className="p-5 border rounded-2xl bg-card space-y-3 text-start">
          <h3 className="font-bold text-sm text-foreground">{locale === "ar" ? "تفاصيل الطلب النشط:" : "Active Checkout Details:"}</h3>
          <div className="divide-y text-xs text-muted-foreground">
            {checkoutLines.map((line, idx) => {
              const name = locale === "ar" ? line.productNameAr : line.productName;
              return (
                <div key={idx} className="py-2.5 flex justify-between">
                  <span>{name} ({line.requestedQty} {tCheckout("item")})</span>
                  <Price amount={line.price * line.requestedQty} className="font-semibold text-foreground" />
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            className="w-full sm:flex-1 py-5 rounded-2xl text-sm font-medium bg-primary hover:bg-primary/95 text-white"
            onClick={() => router.push("/checkout")}
          >
            {tCheckout("viewActiveCheckout")}
          </Button>
          <Button
            variant="outline"
            className="w-full sm:flex-1 py-5 rounded-2xl text-sm font-medium text-destructive border-destructive/20 hover:bg-destructive/5"
            onClick={() => {
              resetCheckout();
            }}
          >
            {tCheckout("cancelCheckout")}
          </Button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return <EmptyCart />;
  }

  const subtotal = items.reduce((sum, item) => {
    const product = getProductById(item.productId);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);
  const deliveryFees = 20; // Standard estimated delivery fee

  return (
    <div className="container-marketplace py-6 lg:py-6 relative space-y-8">
      <div>
        <h1 className="mb-6 text-xl font-bold">
          {t("title")} ({t("items", { count: items.length })})
        </h1>

        <div className="grid gap-8 lg:grid-cols-12">
          {/* Left: Cart items */}
          <div className="space-y-6 lg:col-span-8">
            <CartList items={items} />
          </div>

          {/* Right: Sticky summary */}
          <div className="lg:col-span-4">
            <CartSummary
              subtotal={subtotal}
              deliveryFees={deliveryFees}
              onCheckout={() => setAddressModalOpen(true)}
            />
          </div>
        </div>
      </div>

      <CartFooter />

      {/* Address Selection Modal */}
      <Shipping
        open={addressModalOpen}
        onOpenChange={setAddressModalOpen}
        addresses={mockAddresses}
        selectedAddressId={selectedAddrId}
        onSelectAddress={setSelectedAddrId}
        onConfirm={() => {
          const activeScenario = activeScenarioId ? SCENARIOS.find(s => s.id === activeScenarioId) : null;
          const allocations = activeScenario ? activeScenario.allocations : getMockAllocations(items);
          setFinalAllocations(allocations);

          const initialLines = allocations.map(line => ({
            ...line,
            allocatedQty: "?",
            status: AllocationStatus.PENDING,
            resolution: "pending" as const,
          }));

          setCheckoutLines(initialLines);
          setCheckoutAddressId(selectedAddrId);
          setAddressModalOpen(false);
          setTimeLeft(60);
          setProcessingOpen(true);
        }}
      />

      {/* 1. Processing Your Order Dialog Popup */}
      <Dialog open={processingOpen} onOpenChange={() => { }}>
        <DialogContent
          className="sm:max-w-lg p-6 rounded-3xl bg-card border text-center space-y-6"
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <div className="flex justify-center py-2">
            <div className="relative flex items-center justify-center">
              <Loader2 className="h-16 w-16 animate-spin text-primary" />
              <span className="absolute text-xs font-semibold text-primary">{tCheckout("reviewText")}</span>
            </div>
          </div>

          <div className="space-y-1">
            <DialogTitle className="text-xl font-bold text-foreground text-center">{tCheckout("processingOrder")}</DialogTitle>
            <p className="text-muted-foreground text-sm">{tCheckout("waitingApproval")}</p>
          </div>

          {/* Progress bar */}
          <div className="space-y-2 text-start">
            <div className="flex justify-between text-xs font-semibold text-muted-foreground">
              <span>{tCheckout("timeRemaining")}</span>
              <span className="flex items-center gap-1 font-bold">
                <Clock className="h-3.5 w-3.5" /> {timeLeft}s
              </span>
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-100"
                style={{ width: `${(timeLeft / 60) * 100}%` }}
              />
            </div>
          </div>

          {/* Pharmacy Status List */}
          <div className="space-y-3 pt-4 border-t text-start">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{tCheckout("pendingApprovalFrom")}</p>

            {Object.values(
              checkoutLines.reduce<Record<string, { pharmacyId: string; name: string; nameAr: string; lines: typeof checkoutLines }>>((acc, line) => {
                if (!acc[line.pharmacyId]) {
                  acc[line.pharmacyId] = {
                    pharmacyId: line.pharmacyId,
                    name: line.pharmacyName,
                    nameAr: line.pharmacyNameAr,
                    lines: [],
                  };
                }
                acc[line.pharmacyId].lines.push(line);
                return acc;
              }, {})
            ).map((group) => {
              let groupStatus: "Pending" | "Approve" | "Partial" | "Reject" = "Approve";
              if (group.lines.some(l => l.status === AllocationStatus.PENDING)) {
                groupStatus = "Pending";
              } else if (group.lines.some(l => l.status === AllocationStatus.REJECTED)) {
                groupStatus = "Reject";
              } else if (group.lines.some(l => l.status === AllocationStatus.PARTIAL)) {
                groupStatus = "Partial";
              }

              const displayName = locale === "ar" ? group.nameAr : group.name;

              return (
                <div key={group.pharmacyId} className="flex items-center justify-between p-3 rounded-2xl bg-muted/40 border">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 bg-white rounded-full border flex items-center justify-center font-bold text-primary text-xs">
                      {displayName[0]}
                    </div>
                    <div>
                      <h4 className="font-semibold text-xs text-foreground">{displayName}</h4>
                      <p className="text-[10px] text-muted-foreground">{t("items", { count: group.lines.length })}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-medium">
                    <span className={cn(
                      "h-2 w-2 rounded-full",
                      groupStatus === "Approve" ? "bg-green-500 animate-pulse" :
                      groupStatus === "Partial" ? "bg-orange-500" :
                      groupStatus === "Reject" ? "bg-red-500" :
                      "bg-yellow-500"
                    )} />
                    <span className={cn(
                      "font-semibold",
                      groupStatus === "Approve" ? "text-green-500" :
                      groupStatus === "Partial" ? "text-orange-500" :
                      groupStatus === "Reject" ? "text-red-500" :
                      "text-muted-foreground"
                    )}>
                      {groupStatus === "Approve" ? tCheckout("approve") :
                       groupStatus === "Partial" ? tCheckout("partiallyAvailable") :
                       groupStatus === "Reject" ? tCheckout("rejected") :
                       tCheckout("pending")}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>

      {/* 2. Order Approval Status Dialog Popup */}
      <Dialog open={statusOpen} onOpenChange={setStatusOpen}>
        <DialogContent
          className="sm:max-w-3xl max-h-[90vh] overflow-y-auto p-6 rounded-3xl bg-card border space-y-6"
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-foreground">{tCheckout("orderApprovalStatus")}</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5 fill-green-100" />
                <h3 className="text-sm font-bold">{tCheckout("approvedOrders", { count: approvedPharmacies.length })}</h3>
              </div>

              {approvedPharmacies.map((pharm, idx) => (
                <Card key={idx} className="rounded-2xl border p-4 space-y-3 bg-muted/20">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center font-bold text-primary text-xs">
                      {pharm.name[0]}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-foreground">{getPharmacyTranslation(pharm.name)}</h4>
                      <p className="text-[10px] text-muted-foreground">{t("items", { count: pharm.products.length })}</p>
                    </div>
                  </div>

                  <p className="text-[10px] font-semibold text-green-600 bg-green-500/5 px-2.5 py-1.5 rounded-lg border border-green-500/10">
                    {tCheckout("approvedNotice")}
                  </p>

                  <div className="space-y-1.5 text-[11px] text-foreground/80">
                    {pharm.products.map((p, pIdx) => (
                      <div key={pIdx} className="flex justify-between">
                        <span>{getProductTranslation(p.name)} × {p.qty}</span>
                        <Price amount={p.price} className="font-semibold text-foreground" iconClassName="text-foreground" />
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>

            {rejectedPharmacies.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-red-600">
                  <XCircle className="h-5 w-5 fill-red-100" />
                  <h3 className="text-sm font-bold">{tCheckout("rejectedOrders", { count: rejectedPharmacies.length })}</h3>
                </div>

                {rejectedPharmacies.map((pharm, idx) => (
                  <Card key={idx} className="rounded-2xl border p-4 border-red-200 bg-red-50/50 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-white rounded-full border flex items-center justify-center font-bold text-primary text-xs">
                          {pharm.name[0]}
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-foreground">{getPharmacyTranslation(pharm.name)}</h4>
                          <p className="text-[10px] text-muted-foreground">{t("items", { count: pharm.products.length })}</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-lg h-8 text-[11px] font-bold text-primary border-primary hover:bg-primary/5"
                        onClick={() => setAlternativesOpen(true)}
                      >
                        {tCheckout("viewAlternatives")}
                      </Button>
                    </div>

                    <p className="text-[10px] font-semibold text-red-600 bg-red-500/5 px-2.5 py-1.5 rounded-lg border border-red-500/10">
                      {pharm.reason === "Some items are currently out of stock" ? tCheckout("outOfStockNotice") : pharm.reason}
                    </p>
                  </Card>
                ))}
              </div>
            )}

            <div className="flex flex-col gap-2 pt-2 border-t">
              <Button
                className="w-full py-5 rounded-full text-sm font-medium bg-primary hover:bg-primary/95 text-white"
                onClick={() => {
                  setStatusOpen(false);
                  router.push("/checkout");
                }}
              >
                {tCheckout("continueToPayment")}
              </Button>
              <Button variant="ghost" className="w-full py-5 rounded-xl text-sm font-bold text-muted-foreground" onClick={() => setStatusOpen(false)}>
                {tCheckout("cancelOrder")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 2b. Marketplace Alternatives Modal Dialog */}
      <Dialog open={alternativesOpen} onOpenChange={setAlternativesOpen}>
        <DialogContent
          className="sm:max-w-xl max-h-[85vh] overflow-y-auto p-6 rounded-3xl bg-card border space-y-6"
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-foreground">{tCheckout("alternativesFound")}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl border space-y-3 bg-muted/20">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">{tCheckout("originalItem")}:</span>
                <span className="font-semibold text-foreground line-through">{getProductTranslation("Omega-3 Fish Oil")}</span>
              </div>
              <Separator className="my-1 border-dashed" />
              <div className="flex justify-between text-xs">
                <span className="text-success font-bold">{tCheckout("substituteItem")}:</span>
                <span className="font-bold text-primary inline-flex items-center gap-1">
                  {getProductTranslation("Seven Seas Cod Liver Oil")} (<Price amount={129.35} className="font-bold text-primary text-xs" />)
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl border space-y-3 bg-muted/20">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">{tCheckout("originalItem")}:</span>
                <span className="font-semibold text-foreground line-through">{getProductTranslation("Multivitamin")}</span>
              </div>
              <Separator className="my-1 border-dashed" />
              <div className="flex justify-between text-xs">
                <span className="text-success font-bold">{tCheckout("substituteItem")}:</span>
                <span className="font-bold text-primary inline-flex items-center gap-1">
                  {getProductTranslation("Centrum Adults Multivitamin")} (<Price amount={129.35} className="font-bold text-primary text-xs" />)
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-2 border-t">
            <Button
              className="w-full py-5 rounded-xl text-sm font-bold bg-primary hover:bg-primary/95 text-white"
              onClick={() => {
                setApprovedPharmacies([
                  ...mockApprovedPharmacies,
                  {
                    name: "Whites Pharmacy",
                    products: [
                      { name: "Seven Seas Cod Liver Oil", qty: 1, price: 129.35 },
                      { name: "Centrum Adults Multivitamin", qty: 1, price: 129.35 }
                    ],
                    deliveryFee: 129.35
                  }
                ]);
                setRejectedPharmacies([]);
                setAlternativesOpen(false);
              }}
            >
              {tCheckout("acceptSubstitutes")}
            </Button>
            <Button
              variant="outline"
              className="w-full py-5 rounded-xl text-sm font-bold"
              onClick={() => {
                setAlternativesOpen(false);
              }}
            >
              {tCheckout("removeAndContinue")}
            </Button>
            <Button
              variant="ghost"
              className="w-full py-5 rounded-xl text-sm font-bold text-muted-foreground"
              onClick={() => {
                setAlternativesOpen(false);
                setStatusOpen(false);
              }}
            >
              {tCheckout("cancelOrder")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
