"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Clock, Trash2, Loader2, CheckCircle, XCircle } from "lucide-react";
import { Link, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { OrderSummary } from "@/components/marketplace/order-summary";
import { QuantityStepper } from "@/components/marketplace/product-card";
import { getProductById, getPharmacyById } from "@/lib/mock-data";
import { useCartStore } from "@/stores/cart-store";
import { cn, formatPrice } from "@/lib/utils";

const mockAddresses = [
  { id: "addr-1", label: "the home", isMain: true, address: "Samaya Furnished Apartments, Room 260, Al Quds, Riyadh, Saudi Arabia" },
  { id: "addr-2", label: "the job", isMain: false, address: "Samaya Furnished Apartments, Room 260, Al Quds, Riyadh, Saudi Arabia" },
  { id: "addr-3", label: "the job", isMain: false, address: "Samaya Furnished Apartments, Room 260, Al Quds, Riyadh, Saudi Arabia" }
];

// Mock approvals structure
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
  const tc = useTranslations("common");
  const tCheckout = useTranslations("checkout");
  const locale = useLocale();
  const router = useRouter();
  const { items, removeItem, updateQuantity } = useCartStore();

  // Address dialog state
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [selectedAddrId, setSelectedAddrId] = useState("addr-1");

  // Simulated pharmacy approvals states inside Cart Page
  const [processingOpen, setProcessingOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [nahdiStatus, setNahdiStatus] = useState<"Pending" | "Approve" | "Reject">("Pending");
  const [avnzorStatus, setAvnzorStatus] = useState<"Pending" | "Approve" | "Reject">("Pending");
  const [whitesStatus, setWhitesStatus] = useState<"Pending" | "Approve" | "Reject">("Pending");

  // Flowchart Substitute State Gaps
  const [approvedPharmacies, setApprovedPharmacies] = useState(mockApprovedPharmacies);
  const [rejectedPharmacies, setRejectedPharmacies] = useState(mockRejectedPharmacies);
  const [alternativesOpen, setAlternativesOpen] = useState(false);

  // Translators helpers for mock details
  const getAddressLabelTranslation = (label: string) => {
    if (label.includes("home")) return tCheckout("addressHome");
    if (label.includes("job")) return tCheckout("addressJob");
    return label;
  };

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

  // Accelerated timer tick logic for review simulation
  useEffect(() => {
    if (!processingOpen) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setProcessingOpen(false);
          setStatusOpen(true);
          return 0;
        }

        const nextTime = prev - 1;
        if (nextTime === 50) setAvnzorStatus("Approve");
        if (nextTime === 30) setNahdiStatus("Approve");
        if (nextTime === 10) setWhitesStatus("Reject");

        return nextTime;
      });
    }, 100); // 100ms per simulated second = 6 seconds total review

    return () => clearInterval(interval);
  }, [processingOpen]);

  const cartGroups = items.reduce<
    Record<string, { pharmacyId: string; lines: { productId: string; quantity: number }[] }>
  >((acc, item) => {
    const product = getProductById(item.productId);
    if (!product) return acc;
    if (!acc[product.pharmacyId]) {
      acc[product.pharmacyId] = { pharmacyId: product.pharmacyId, lines: [] };
    }
    acc[product.pharmacyId].lines.push(item);
    return acc;
  }, {});

  const groups = Object.values(cartGroups);
  const subtotal = items.reduce((sum, item) => {
    const product = getProductById(item.productId);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);
  const deliveryFees = groups.reduce((sum, group) => {
    const pharmacy = getPharmacyById(group.pharmacyId);
    return sum + (pharmacy?.deliveryFee ?? 0);
  }, 0);

  if (items.length === 0) {
    return (
      <div className="container-marketplace flex flex-col items-center justify-center py-20 text-center">
        <h1 className="text-2xl font-bold">{t("empty")}</h1>
        <p className="mt-2 text-muted-foreground">{t("emptyDescription")}</p>
        <Button asChild className="mt-6" size="lg">
          <Link href="/products">{tc("continueShopping")}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container-marketplace py-6 lg:py-6 relative">
      <h1 className="mb-6 text-xl font-bold">
        {t("title")} ({t("items", { count: items.length })})
      </h1>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left: Cart items */}
        <div className="space-y-6 lg:col-span-8">
          {groups.map((group) => {
            const pharmacy = getPharmacyById(group.pharmacyId);
            if (!pharmacy) return null;
            const pharmacyName = locale === "ar" ? pharmacy.nameAr : pharmacy.name;
            const groupSubtotal = group.lines.reduce((sum, line) => {
              const product = getProductById(line.productId);
              return sum + (product ? product.price * line.quantity : 0);
            }, 0);

            // Free Delivery Goal Calculations
            const freeDeliveryThreshold = 200; // SAR threshold for free delivery
            const isFreeDeliveryUnlocked = groupSubtotal >= freeDeliveryThreshold;
            const remainingForFree = Math.max(0, freeDeliveryThreshold - groupSubtotal);
            const freeDeliveryPercent = Math.min(100, Math.round((groupSubtotal / freeDeliveryThreshold) * 100));

            return (
              <Card key={group.pharmacyId} className="shadow-none border rounded-2xl overflow-hidden">
                <CardHeader className="pb-3 border-b bg-card">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="h-6 w-6 bg-primary/10 rounded-lg flex items-center justify-center font-bold text-primary text-[10px]">
                        🏥
                      </div>
                      <CardTitle className="text-base font-bold text-primary">
                        {pharmacyName}
                      </CardTitle>
                    </div>
                    <div className="text-xs font-semibold text-muted-foreground">
                      {t("deliveryEta", { time: pharmacy.eta })}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-5 space-y-4">
                  {/* Items List */}
                  <div className="space-y-3">
                    {group.lines.map((line) => {
                      const product = getProductById(line.productId);
                      if (!product) return null;
                      const name = locale === "ar" ? product.nameAr : product.name;
                      return (
                        <div key={line.productId} className="border rounded-xl p-3 flex items-center justify-between gap-4 bg-card">
                          <div className="flex items-center gap-3.5 min-w-0">
                            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border bg-white flex items-center justify-center">
                              <Image src={product.image} alt={name} fill className="object-contain p-1 rounded-lg" />
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-semibold text-sm text-foreground line-clamp-1 truncate">{name}</h4>
                              <p className="text-sm font-bold text-primary mt-0.5">
                                {formatPrice(product.price)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <QuantityStepper
                              value={line.quantity}
                              onChange={(q) => updateQuantity(line.productId, q)}
                              max={product.stockCount}
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-9 w-9 text-muted-foreground hover:text-destructive shrink-0"
                              onClick={() => removeItem(line.productId)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Delivery Threshold Indicator */}
                  {isFreeDeliveryUnlocked ? (
                    <div className="p-3.5 rounded-xl border border-green-500/10 bg-green-500/5 text-xs text-green-600 font-semibold text-start">
                      {t("freeDeliveryUnlocked")}
                    </div>
                  ) : (
                    <div className="p-3 rounded-lg border bg-muted/10 space-y-3">
                      <div className="flex justify-between text-xs font-semibold text-muted-foreground">
                        <span>{t("addMoreForFree", { amount: formatPrice(remainingForFree) })}</span>
                        <span>{freeDeliveryPercent}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all duration-300"
                          style={{ width: `${freeDeliveryPercent}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <Separator className="mb-1" />
                  <div className="flex justify-between text-sm pt-2">
                    <span className="text-muted-foreground">
                      {locale === "ar" ? "المجموع الفرعي للصيدلية:" : "Pharmacy Subtotal:"}
                    </span>
                    <span className="font-bold text-foreground">
                      {formatPrice(groupSubtotal)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Right: Sticky summary */}
        <div className="lg:col-span-4">
          <OrderSummary
            subtotal={subtotal}
            deliveryFees={deliveryFees}
            showCoupon={false}
            showWallet={false}
            showLoyalty={false}
            className="sticky top-36"
            onCheckout={() => setAddressModalOpen(true)}
          />
        </div>
      </div>

      {/* Address Selection Modal - Wireframe 5 */}
      <Dialog open={addressModalOpen} onOpenChange={setAddressModalOpen}>
        <DialogContent className="sm:max-w-lg p-6 rounded-2xl bg-card">
          <DialogHeader className="pb-2 border-b">
            <DialogTitle className="text-lg font-bold text-foreground">{tCheckout("chooseAddress")}</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <Button variant="outline" className="w-full justify-center gap-2 border-dashed border-2 py-6 rounded-xl hover:bg-primary/5">
              <span className="text-xl font-bold">+</span> {tCheckout("addNewTitle")}
            </Button>

            <RadioGroup value={selectedAddrId} onValueChange={setSelectedAddrId} className="space-y-3">
              {mockAddresses.map((addr) => (
                <label
                  key={addr.id}
                  className={cn(
                    "flex items-start gap-3 rounded-xl border p-4 cursor-pointer transition-all hover:bg-muted/40",
                    selectedAddrId === addr.id ? "border-primary bg-primary/5" : "border-border"
                  )}
                >
                  <RadioGroupItem value={addr.id} className="mt-1" />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-foreground">{getAddressLabelTranslation(addr.label)}</span>
                      {addr.isMain && (
                        <span className="text-[10px] bg-primary/10 text-primary font-semibold px-2 py-0.5 rounded-full">
                          {tCheckout("main")}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground leading-normal">{addr.address}</p>
                  </div>
                </label>
              ))}
            </RadioGroup>
          </div>
          <div className="flex flex-col gap-2 pt-2 border-t">
            <Button
              className="w-full py-6 rounded-xl text-base font-bold text-white bg-primary hover:bg-primary/95"
              onClick={() => {
                setAddressModalOpen(false);
                setApprovedPharmacies(mockApprovedPharmacies);
                setRejectedPharmacies(mockRejectedPharmacies);
                setTimeLeft(60);
                setNahdiStatus("Pending");
                setAvnzorStatus("Pending");
                setWhitesStatus("Pending");
                setProcessingOpen(true);
              }}
            >
              {tCheckout("select")}
            </Button>
            <Button
              variant="ghost"
              className="w-full py-6 rounded-xl text-base font-bold text-muted-foreground"
              onClick={() => setAddressModalOpen(false)}
            >
              {tCheckout("cancel")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 1. Processing Your Order Dialog Popup (Wireframe 4) */}
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

            {/* Pharmacy 1 */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/40 border">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 bg-white rounded-full border flex items-center justify-center font-bold text-primary text-xs">N</div>
                <div>
                  <h4 className="font-semibold text-xs text-foreground">{getPharmacyTranslation("Nahdi Pharmacy")}</h4>
                  <p className="text-[10px] text-muted-foreground">{t("items", { count: 3 })}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-[10px] font-medium">
                <span className={cn(
                  "h-2 w-2 rounded-full",
                  nahdiStatus === "Approve" ? "bg-green-500 animate-pulse" : "bg-yellow-500"
                )} />
                <span className={nahdiStatus === "Approve" ? "text-green-500 font-semibold" : "text-muted-foreground"}>
                  {nahdiStatus === "Approve" ? tCheckout("approve") : tCheckout("pending")}
                </span>
              </div>
            </div>

            {/* Pharmacy 2 */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/40 border">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 bg-white rounded-full border flex items-center justify-center font-bold text-primary text-xs">A</div>
                <div>
                  <h4 className="font-semibold text-xs text-foreground">{getPharmacyTranslation("Avnzor Pharmacy")}</h4>
                  <p className="text-[10px] text-muted-foreground">{t("items", { count: 1 })}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-[10px] font-medium">
                <span className={cn(
                  "h-2.5 w-2.5 rounded-full",
                  avnzorStatus === "Approve" ? "bg-green-500 animate-pulse" : "bg-yellow-500"
                )} />
                <span className={avnzorStatus === "Approve" ? "text-green-500 font-semibold" : "text-muted-foreground"}>
                  {avnzorStatus === "Approve" ? tCheckout("approve") : tCheckout("pending")}
                </span>
              </div>
            </div>

            {/* Pharmacy 3 */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/40 border">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 bg-white rounded-full border flex items-center justify-center font-bold text-primary text-xs">W</div>
                <div>
                  <h4 className="font-semibold text-xs text-foreground">{getPharmacyTranslation("Whites Pharmacy")}</h4>
                  <p className="text-[10px] text-muted-foreground">{t("items", { count: 1 })}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-[10px] font-medium">
                <span className={cn(
                  "h-2 w-2 rounded-full",
                  whitesStatus === "Reject" ? "bg-red-500 animate-pulse" : "bg-yellow-500"
                )} />
                <span className={whitesStatus === "Reject" ? "text-red-500 font-semibold" : "text-muted-foreground"}>
                  {whitesStatus === "Reject" ? tCheckout("rejected") : tCheckout("pending")}
                </span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 2. Order Approval Status Dialog Popup (Wireframe 3) */}
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
            {/* Approved Orders */}
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
                        <span className="font-semibold">{formatPrice(p.price)}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>

            {/* Rejected Orders */}
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

            {/* Footer Buttons */}
            <div className="flex flex-col gap-2 pt-2 border-t">
              <Button
                className="w-full py-5 rounded-xl text-sm font-bold bg-primary hover:bg-primary/95 text-white"
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

      {/* 2b. Marketplace Alternatives Modal Dialog (Flowchart substitution path) */}
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
            {/* Substitute item 1 */}
            <div className="p-4 rounded-2xl border space-y-3 bg-muted/20">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">{tCheckout("originalItem")}:</span>
                <span className="font-semibold text-foreground line-through">{getProductTranslation("Omega-3 Fish Oil")}</span>
              </div>
              <Separator className="my-1 border-dashed" />
              <div className="flex justify-between text-xs">
                <span className="text-success font-bold">{tCheckout("substituteItem")}:</span>
                <span className="font-bold text-primary">
                  {getProductTranslation("Seven Seas Cod Liver Oil")} (129.35 {tc("sar")})
                </span>
              </div>
            </div>

            {/* Substitute item 2 */}
            <div className="p-4 rounded-2xl border space-y-3 bg-muted/20">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">{tCheckout("originalItem")}:</span>
                <span className="font-semibold text-foreground line-through">{getProductTranslation("Multivitamin")}</span>
              </div>
              <Separator className="my-1 border-dashed" />
              <div className="flex justify-between text-xs">
                <span className="text-success font-bold">{tCheckout("substituteItem")}:</span>
                <span className="font-bold text-primary">
                  {getProductTranslation("Centrum Adults Multivitamin")} (129.35 {tc("sar")})
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-2 border-t">
            <Button
              className="w-full py-5 rounded-xl text-sm font-bold bg-primary hover:bg-primary/95 text-white"
              onClick={() => {
                // Merge Whites Pharmacy as Approved
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
