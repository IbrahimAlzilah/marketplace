"use client";

import { useState, useEffect, Suspense } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import Image from "next/image";
import {
  Check,
  CheckCircle,
  XCircle,
  ChevronLeft,
  Loader2,
  Wallet,
  Tag,
  Award,
  Clock,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group";
import { Separator } from "@/shared/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Price } from "@/shared/components/ui/currency";
import { useCartStore, CheckoutLine } from "@/stores/cart-store";
import { AllocationStatus } from "@/lib/allocation-evaluator";
import { getProductById, pharmacies } from "@/lib/mock-data";
import { PharmacyHeader } from "@/features/pharmacies";

// Helpers for line price calculations
function getLineTotalPrice(line: CheckoutLine): number {
  if (line.resolution === "removed") return 0;

  const allocQty = typeof line.allocatedQty === "number"
    ? line.allocatedQty
    : parseInt(String(line.allocatedQty), 10) || 0;

  if (line.resolution === "approved") {
    return line.price * line.requestedQty;
  }
  if (line.resolution === "accepted_partial") {
    return line.price * allocQty;
  }
  if (line.resolution === "accepted_substitute" && line.selectedSubstitute) {
    return line.selectedSubstitute.price * line.requestedQty;
  }
  if (line.resolution === "accepted_partial_and_substitute" && line.selectedSubstitute) {
    const remainingQty = line.requestedQty - allocQty;
    return (line.price * allocQty) + (line.selectedSubstitute.price * remainingQty);
  }

  return line.price * line.requestedQty;
}

type ResolvedItem = {
  productId: string;
  name: string;
  nameAr: string;
  qty: number;
  price: number;
  image: string;
  pharmacyName: string;
  pharmacyNameAr: string;
};

function getResolvedItems(lines: CheckoutLine[]): ResolvedItem[] {
  const items: ResolvedItem[] = [];
  lines.forEach((line) => {
    if (line.resolution === "removed") return;

    const allocQty = typeof line.allocatedQty === "number"
      ? line.allocatedQty
      : parseInt(String(line.allocatedQty), 10) || 0;

    if (line.resolution === "approved") {
      items.push({
        productId: line.productId,
        name: line.productName,
        nameAr: line.productNameAr,
        qty: line.requestedQty,
        price: line.price,
        image: line.image,
        pharmacyName: line.pharmacyName,
        pharmacyNameAr: line.pharmacyNameAr,
      });
    } else if (line.resolution === "accepted_partial") {
      items.push({
        productId: line.productId,
        name: line.productName,
        nameAr: line.productNameAr,
        qty: allocQty,
        price: line.price,
        image: line.image,
        pharmacyName: line.pharmacyName,
        pharmacyNameAr: line.pharmacyNameAr,
      });
    } else if (line.resolution === "accepted_substitute" && line.selectedSubstitute) {
      items.push({
        productId: line.selectedSubstitute.productId,
        name: line.selectedSubstitute.name,
        nameAr: line.selectedSubstitute.nameAr,
        qty: line.requestedQty,
        price: line.selectedSubstitute.price,
        image: line.selectedSubstitute.image,
        pharmacyName: line.pharmacyName,
        pharmacyNameAr: line.pharmacyNameAr,
      });
    } else if (line.resolution === "accepted_partial_and_substitute" && line.selectedSubstitute) {
      if (allocQty > 0) {
        items.push({
          productId: line.productId,
          name: line.productName,
          nameAr: line.productNameAr,
          qty: allocQty,
          price: line.price,
          image: line.image,
          pharmacyName: line.pharmacyName,
          pharmacyNameAr: line.pharmacyNameAr,
        });
      }
      const remainingQty = line.requestedQty - allocQty;
      if (remainingQty > 0) {
        items.push({
          productId: line.selectedSubstitute.productId,
          name: line.selectedSubstitute.name,
          nameAr: line.selectedSubstitute.nameAr,
          qty: remainingQty,
          price: line.selectedSubstitute.price,
          image: line.selectedSubstitute.image,
          pharmacyName: line.pharmacyName,
          pharmacyNameAr: line.pharmacyNameAr,
        });
      }
    }
  });
  return items;
}

type UnavailableItem = {
  name: string;
  nameAr: string;
  qty: number;
  price: number;
};

function getUnavailableItems(lines: CheckoutLine[]): UnavailableItem[] {
  const items: UnavailableItem[] = [];
  lines.forEach((line) => {
    const allocQty = typeof line.allocatedQty === "number"
      ? line.allocatedQty
      : parseInt(String(line.allocatedQty), 10) || 0;

    if (line.resolution === "removed") {
      items.push({
        name: line.productName,
        nameAr: line.productNameAr,
        qty: line.requestedQty,
        price: line.price,
      });
    } else if (line.resolution === "accepted_partial") {
      const missing = line.requestedQty - allocQty;
      if (missing > 0) {
        items.push({
          name: line.productName,
          nameAr: line.productNameAr,
          qty: missing,
          price: line.price,
        });
      }
    } else if (line.status === AllocationStatus.REJECTED && line.resolution === "pending") {
      items.push({
        name: line.productName,
        nameAr: line.productNameAr,
        qty: line.requestedQty,
        price: line.price,
      });
    }
  });
  return items;
}

function CheckoutPageContent() {
  const t = useTranslations("checkout");
  const tc = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();

  // Retrieve checkout states and actions from the store
  const checkoutLines = useCartStore((s) => s.checkoutLines);
  const resolvePartialLine = useCartStore((s) => s.resolvePartialLine);
  const resolveRejectedLine = useCartStore((s) => s.resolveRejectedLine);
  const resolvePartialWithSubstituteLine = useCartStore((s) => s.resolvePartialWithSubstituteLine);
  const resetCheckout = useCartStore((s) => s.resetCheckout);

  // local states for chosen substitutes
  const [chosenSubstitutes, setChosenSubstitutes] = useState<
    Record<
      string,
      { productId: string; name: string; nameAr: string; price: number; image: string }
    >
  >({});

  const [receiptLines, setReceiptLines] = useState<CheckoutLine[]>([]);
  const [receiptTotal, setReceiptTotal] = useState<number>(0);

  // Workflow starts at "review" (Order Approval Status) and moves to "payment_loading" | "payment_method" | "confirmation"
  const [phase, setPhase] = useState<"review" | "payment_loading" | "payment_method" | "confirmation">("review");

  // Store Pickup vs Delivery Gap State
  const [deliveryMethod, setDeliveryMethod] = useState<"delivery" | "pickup">("delivery");

  // Refund & Cancellation Gap States
  const [cancelledByUser, setCancelledByUser] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [refundChoice, setRefundChoice] = useState<"wallet" | "card">("wallet");

  // Payment states for Phase 4
  const [walletApplied, setWalletApplied] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState("apple-pay");
  const [promoCode, setPromoCode] = useState("WELCOME20");
  const [isPromoApplied, setIsPromoApplied] = useState(true);
  const [promoError, setPromoError] = useState("");

  // Loyalty states
  const [loyaltyApplied, setLoyaltyApplied] = useState(false);
  const [redeemPoints, setRedeemPoints] = useState(1000);

  // Receipt Modal State
  const [receiptOpen, setReceiptOpen] = useState(false);

  // Cart store actions
  const clearCart = useCartStore((s) => s.clearCart);

  const getPharmacyTranslation = (name: string) => {
    if (name.includes("Nahdi")) return t("nahdiPharmacy");
    if (name.includes("Avnzor")) return t("avnzorPharmacy");
    if (name.includes("Whites")) return t("whitesPharmacy");
    return name;
  };

  // Auto-advance from payment loading state to payment methods selection
  useEffect(() => {
    if (phase === "payment_loading") {
      const timer = setTimeout(() => {
        setPhase("payment_method");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  // Handler to apply promo code
  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === "WELCOME20") {
      setIsPromoApplied(true);
      setPromoError("");
    } else {
      setPromoError(t("invalidPromo"));
      setIsPromoApplied(false);
    }
  };

  // Handler to place order
  const handlePlaceOrder = () => {
    setReceiptLines([...checkoutLines]);
    setReceiptTotal(checkoutTotal);
    clearCart();
    setPhase("confirmation");
  };

  // Dynamic pricing breakdown values based on resolved checkout lines
  const resolvedItems = getResolvedItems(checkoutLines);
  const productPrice = checkoutLines.reduce((sum, line) => sum + getLineTotalPrice(line), 0);

  // Group active lines by pharmacy to calculate delivery fee
  const activePharmacies = Array.from(new Set(resolvedItems.map(item => item.pharmacyName)));
  const deliveryFee = activePharmacies.reduce((sum, pharmName) => {
    const pharmacy = pharmacies.find(p => p.name === pharmName || p.nameAr === pharmName);
    return sum + (pharmacy?.deliveryFee ?? 0);
  }, 0);

  const promoDiscount = isPromoApplied ? productPrice * 0.20 : 0; // 20% discount
  const balancePayment = walletApplied ? Math.min(79, productPrice - promoDiscount + deliveryFee) : 0; // use wallet balance up to remaining
  const loyaltyDiscount = loyaltyApplied ? redeemPoints * 0.01 : 0; // rate conversion

  // Final Total matches dynamic calculations
  const checkoutTotal = Math.max(0, productPrice - promoDiscount + deliveryFee - balancePayment - loyaltyDiscount);

  // Scenario 7 helper: checking if all lines are resolved and no items remain
  const hasUnresolved = checkoutLines.some(line => line.resolution === "pending");
  const hasNoPayableItems = checkoutLines.length > 0 && resolvedItems.length === 0;

  if (phase === "review") {
    const approvedLines = checkoutLines.filter(line => line.status === AllocationStatus.APPROVED);
    const partialLines = checkoutLines.filter(line => line.status === AllocationStatus.PARTIAL);
    const rejectedLines = checkoutLines.filter(line => line.status === AllocationStatus.REJECTED);

    return (
      <div className="container-marketplace py-6 lg:py-6 relative">
        <div className="flex items-center gap-3 mb-5">
          <Button variant="ghost" size="icon" onClick={() => router.push("/cart")} className="rounded-full">
            <ChevronLeft className="h-6 w-6 rtl:rotate-180" />
          </Button>
          <h1 className="text-xl font-bold text-foreground">{t("orderApprovalStatus")}</h1>
        </div>

        <div className="grid gap-8 lg:grid-cols-12">
          {/* Left Column: Decision Cards */}
          <div className="lg:col-span-8 space-y-6">

            {/* Scenario 7: Alert when no payable items remain */}
            {hasNoPayableItems && !hasUnresolved && (
              <div className="p-5 border border-red-500/20 bg-red-500/5 rounded-2xl flex items-start gap-3.5 text-red-600">
                <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5 text-red-500" />
                <div className="space-y-1">
                  <h4 className="font-bold text-sm">{t("entireOrderRejected")}</h4>
                  <p className="text-xs text-red-600/80 leading-relaxed">{t("entireOrderRejectedDesc")}</p>
                </div>
              </div>
            )}

            {/* 1. Approved Section */}
            {approvedLines.length > 0 && (
              <Card className="rounded-2xl border p-5 space-y-4 shadow-none">
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-5 w-5 fill-green-50" />
                  <h3 className="text-base font-bold">{t("approvedOrders", { count: approvedLines.length })}</h3>
                </div>
                <p className="text-xs text-green-600 bg-green-500/5 px-3 py-2 rounded-lg border border-green-500/10">
                  {t("approvedNotice")}
                </p>
                <div className="space-y-3">
                  {approvedLines.map((line) => {
                    const name = locale === "ar" ? line.productNameAr : line.productName;
                    return (
                      <div key={line.productId} className="flex justify-between items-center bg-card border rounded-xl p-3 text-sm">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="relative h-12 w-12 shrink-0 border rounded-lg bg-white overflow-hidden flex items-center justify-center">
                            <Image src={line.image} alt={name} fill className="object-contain p-1 rounded-lg" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-semibold text-foreground truncate">{name}</h4>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {getPharmacyTranslation(line.pharmacyName)}
                            </p>
                          </div>
                        </div>
                        <div className="text-end shrink-0 pl-3">
                          <Price amount={line.price} className="font-bold text-primary block text-right" />
                          <span className="text-xs text-muted-foreground">Qty: {line.requestedQty}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}

            {/* 2. Partially Available Section */}
            {partialLines.length > 0 && (
              <Card className="rounded-2xl border p-5 space-y-4 border-orange-200 bg-orange-50/10 shadow-none">
                <div className="flex items-center gap-2 text-orange-600">
                  <Clock className="h-5 w-5 text-orange-500" />
                  <h3 className="text-base font-bold">{t("partiallyAvailable")}</h3>
                </div>
                <div className="space-y-4">
                  {partialLines.map((line) => {
                    const name = locale === "ar" ? line.productNameAr : line.productName;
                    const allocated = line.allocatedQty;
                    const isPending = line.resolution === "pending";

                    // Detailed check for substitute choices in partials
                    const isAcceptedPartialOnly = line.resolution === "accepted_partial";
                    const isAcceptedPartialWithSub = line.resolution === "accepted_partial_and_substitute";
                    const isRemoved = line.resolution === "removed";

                    const subList = line.substitutes || [];
                    const remainingQty = line.requestedQty - (typeof allocated === "number" ? allocated : parseInt(String(allocated), 10) || 0);

                    return (
                      <div key={line.productId} className="bg-card border rounded-2xl p-4 space-y-3 shadow-none">
                        {/* Custom PharmacyHeader for consistent layout styling */}
                        <PharmacyHeader
                          name={line.pharmacyName}
                          nameAr={line.pharmacyNameAr}
                          status={AllocationStatus.PARTIAL}
                          className="border-none p-0 shadow-none hover:shadow-none bg-transparent"
                        />

                        <Separator />

                        <div className="flex justify-between items-start gap-4">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="relative h-12 w-12 shrink-0 border rounded-lg bg-white overflow-hidden flex items-center justify-center">
                              <Image src={line.image} alt={name} fill className="object-contain p-1 rounded-lg" />
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-semibold text-foreground truncate">{name}</h4>
                              <Price amount={line.price} className="text-xs text-muted-foreground font-normal" iconClassName="text-muted-foreground" />
                            </div>
                          </div>
                          <div className="text-end shrink-0 pl-3">
                            <span className="text-xs text-muted-foreground block">Requested: {line.requestedQty}</span>
                            <span className="text-xs text-green-600 font-bold block">Approved: {allocated}</span>
                          </div>
                        </div>

                        <p className="text-xs text-orange-600 bg-orange-500/5 px-3 py-2 rounded-lg border border-orange-500/10">
                          {t("partiallyAvailableNotice", { allocated, requested: line.requestedQty })}
                        </p>

                        {isPending ? (
                          <div className="space-y-3.5 pt-2 border-t">
                            {/* Scenario 5: Multiple substitute choices if list exists */}
                            {subList.length > 0 && (
                              <div className="space-y-2">
                                <p className="text-xs font-bold text-foreground">{t("selectSubstituteLabel")}</p>
                                <div className="grid gap-2">
                                  {subList.map((sub) => {
                                    const subName = locale === "ar" ? sub.nameAr : sub.name;
                                    const isChosen = chosenSubstitutes[line.productId]?.productId === sub.productId;

                                    return (
                                      <button
                                        key={sub.productId}
                                        onClick={() => {
                                          setChosenSubstitutes({
                                            ...chosenSubstitutes,
                                            [line.productId]: sub
                                          });
                                        }}
                                        className={cn(
                                          "flex items-center gap-3 p-3 rounded-xl border text-start transition-all",
                                          isChosen ? "border-primary bg-primary/5 shadow-sm" : "border-border hover:bg-muted/30"
                                        )}
                                      >
                                        <div className="h-10 w-10 relative bg-white border rounded-lg shrink-0 overflow-hidden flex items-center justify-center">
                                          <Image src={sub.image} alt={subName} fill className="object-contain p-0.5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <p className="font-bold text-xs truncate">{subName}</p>
                                          <Price amount={sub.price} className="text-[10px] text-primary font-semibold" />
                                        </div>
                                        <div className={cn(
                                          "h-4 w-4 rounded-full border flex items-center justify-center shrink-0",
                                          isChosen ? "border-primary bg-primary text-white" : "border-muted-foreground"
                                        )}>
                                          {isChosen && <span className="h-2 w-2 rounded-full bg-white" />}
                                        </div>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            <div className="flex flex-col sm:flex-row gap-2 pt-1">
                              <Button
                                variant="outline"
                                className="flex-1 text-xs py-5 rounded-xl text-green-600 border-green-600 hover:bg-green-500/5 bg-white font-bold"
                                onClick={() => resolvePartialLine(line.productId, true)}
                              >
                                {t("acceptPartialOnly", { qty: allocated })}
                              </Button>

                              {subList.length > 0 && (
                                <Button
                                  variant="outline"
                                  disabled={!chosenSubstitutes[line.productId]}
                                  className="flex-1 text-xs py-5 rounded-xl text-primary border-primary hover:bg-primary/5 bg-white font-bold"
                                  onClick={() => resolvePartialWithSubstituteLine(line.productId, chosenSubstitutes[line.productId])}
                                >
                                  {t("acceptPartialAndSubstitute", { qty: allocated, subQty: remainingQty })}
                                </Button>
                              )}

                              <Button
                                variant="ghost"
                                className="flex-1 text-xs py-5 rounded-xl text-destructive hover:bg-destructive/5 font-bold"
                                onClick={() => resolvePartialLine(line.productId, false)}
                              >
                                {t("removeLine")}
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="w-full flex justify-between items-center text-xs py-2 px-1 border-t">
                            <span className={cn(
                              "font-bold flex items-center gap-1.5",
                              isRemoved ? "text-destructive" : "text-green-600"
                            )}>
                              {isRemoved ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                              {isRemoved && t("removeLine")}
                              {isAcceptedPartialOnly && `${t("acceptPartialOnly", { qty: allocated })}`}
                              {isAcceptedPartialWithSub && `${t("acceptPartialAndSubstitute", { qty: allocated, subQty: remainingQty })} (${locale === "ar" ? line.selectedSubstitute?.nameAr : line.selectedSubstitute?.name})`}
                            </span>
                            <Button
                              variant="link"
                              className="text-[11px] h-auto p-0 font-semibold text-primary"
                              onClick={() => {
                                const currentLines = useCartStore.getState().checkoutLines;
                                const updated = currentLines.map(l => l.productId === line.productId ? { ...l, resolution: "pending" as const, selectedSubstitute: null } : l);
                                useCartStore.getState().setCheckoutLines(updated);
                              }}
                            >
                              {locale === "ar" ? "ØªØºÙŠÙŠØ±" : "Change"}
                            </Button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}

            {/* 3. Rejected Section */}
            {rejectedLines.length > 0 && (
              <Card className="rounded-2xl border p-5 space-y-4 border-destructive/20 bg-destructive/5 shadow-none">
                <div className="flex items-center gap-2 text-destructive">
                  <XCircle className="h-5 w-5" />
                  <h3 className="text-base font-bold">{t("rejectedOrders", { count: rejectedLines.length })}</h3>
                </div>
                <div className="space-y-4">
                  {rejectedLines.map((line) => {
                    const name = locale === "ar" ? line.productNameAr : line.productName;
                    const isPending = line.resolution === "pending";
                    const isSubstitute = line.resolution === "accepted_substitute";
                    const reason = locale === "ar" ? line.rejectionReasonAr : line.rejectionReason;
                    const subList = line.substitutes || [];

                    return (
                      <div key={line.productId} className="bg-card border border-destructive/10 rounded-2xl p-4 space-y-3 shadow-none">
                        {/* Custom PharmacyHeader for consistent layout styling */}
                        <PharmacyHeader
                          name={line.pharmacyName}
                          nameAr={line.pharmacyNameAr}
                          status={AllocationStatus.REJECTED}
                          className="border-none p-0 shadow-none hover:shadow-none bg-transparent"
                        />

                        <Separator />

                        <div className="flex justify-between items-start gap-4">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="relative h-12 w-12 shrink-0 border rounded-lg bg-white overflow-hidden flex items-center justify-center opacity-70">
                              <Image src={line.image} alt={name} fill className="object-contain p-1 rounded-lg" />
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-semibold text-foreground line-through truncate">{name}</h4>
                              <Price amount={line.price} className="text-xs text-muted-foreground font-normal" iconClassName="text-muted-foreground" />
                            </div>
                          </div>
                          <div className="text-end shrink-0 pl-3">
                            <Price amount={line.price} className="font-bold text-muted-foreground line-through block text-right" iconClassName="text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">Qty: {line.requestedQty}</span>
                          </div>
                        </div>

                        <p className="text-xs font-semibold text-red-600 bg-red-500/5 px-2.5 py-1.5 rounded-lg border border-red-500/10">
                          {reason === "Out of stock" ? t("outOfStockNotice") : reason}
                        </p>

                        {isPending ? (
                          <div className="space-y-3.5 pt-2 border-t">
                            {/* Scenario 4: Multiple substitute options display */}
                            {subList.length > 0 && (
                              <div className="space-y-2">
                                <p className="text-xs font-bold text-foreground">{t("selectSubstituteLabel")}</p>
                                <div className="grid gap-2">
                                  {subList.map((sub) => {
                                    const subName = locale === "ar" ? sub.nameAr : sub.name;
                                    const isChosen = chosenSubstitutes[line.productId]?.productId === sub.productId;

                                    return (
                                      <button
                                        key={sub.productId}
                                        onClick={() => {
                                          setChosenSubstitutes({
                                            ...chosenSubstitutes,
                                            [line.productId]: sub
                                          });
                                        }}
                                        className={cn(
                                          "flex items-center gap-3 p-3 rounded-xl border text-start transition-all",
                                          isChosen ? "border-primary bg-primary/5 shadow-sm" : "border-border hover:bg-muted/30"
                                        )}
                                      >
                                        <div className="h-10 w-10 relative bg-white border rounded-lg shrink-0 overflow-hidden flex items-center justify-center">
                                          <Image src={sub.image} alt={subName} fill className="object-contain p-0.5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <p className="font-bold text-xs truncate">{subName}</p>
                                          <Price amount={sub.price} className="text-[10px] text-primary font-semibold" />
                                        </div>
                                        <div className={cn(
                                          "h-4 w-4 rounded-full border flex items-center justify-center shrink-0",
                                          isChosen ? "border-primary bg-primary text-white" : "border-muted-foreground"
                                        )}>
                                          {isChosen && <span className="h-2 w-2 rounded-full bg-white" />}
                                        </div>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            <div className="flex gap-2.5 pt-1">
                              {subList.length > 0 && (
                                <Button
                                  variant="outline"
                                  disabled={!chosenSubstitutes[line.productId]}
                                  className="flex-1 text-xs py-5 rounded-xl text-primary border-primary hover:bg-primary/5 bg-white font-bold"
                                  onClick={() => resolveRejectedLine(line.productId, chosenSubstitutes[line.productId])}
                                >
                                  {t("acceptSubstitute")}
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                className="flex-1 text-xs py-5 rounded-xl text-destructive hover:bg-destructive/5 font-bold"
                                onClick={() => resolveRejectedLine(line.productId, null)}
                              >
                                {t("removeLine")}
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="w-full flex justify-between items-center text-xs py-2 px-1 border-t">
                            <span className={cn(
                              "font-bold flex items-center gap-1.5",
                              isSubstitute ? "text-green-600" : "text-destructive"
                            )}>
                              {isSubstitute ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                              {isSubstitute ? `${t("acceptSubstitute")} (${locale === "ar" ? line.selectedSubstitute?.nameAr : line.selectedSubstitute?.name})` : t("removeLine")}
                            </span>
                            <Button
                              variant="link"
                              className="text-[11px] h-auto p-0 font-semibold text-primary"
                              onClick={() => {
                                const currentLines = useCartStore.getState().checkoutLines;
                                const updated = currentLines.map(l => l.productId === line.productId ? { ...l, resolution: "pending" as const, selectedSubstitute: null } : l);
                                useCartStore.getState().setCheckoutLines(updated);
                              }}
                            >
                              {locale === "ar" ? "ØªØºÙŠÙŠØ±" : "Change"}
                            </Button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}
          </div>

          {/* Right Column: Sticky Summary Sheet */}
          <div className="lg:col-span-4">
            <Card className="rounded-2xl border p-5 space-y-5 sticky top-36 shadow-none">
              <h3 className="font-bold text-base text-foreground">{t("orderSummary")}</h3>

              {/* Dynamic summary rows */}
              <div className="space-y-3 text-xs">
                <div className="flex justify-between text-muted-foreground">
                  <span>{t("productPrice")}</span>
                  <Price amount={productPrice} className="font-semibold text-foreground" />
                </div>
                {isPromoApplied && (
                  <div className="flex justify-between text-destructive">
                    <span>{t("additionalDiscount")}</span>
                    <span className="inline-flex items-center gap-1 font-semibold text-destructive">-<Price amount={promoDiscount} className="text-destructive font-semibold" iconClassName="text-destructive" /></span>
                  </div>
                )}
                <div className="flex justify-between text-muted-foreground">
                  <span>{t("deliveryFees")}</span>
                  {deliveryFee > 0 ? (
                    <Price amount={deliveryFee} className="text-green-600 font-semibold" iconClassName="text-green-600" />
                  ) : (
                    <span className="text-green-600 font-semibold">{t("free")}</span>
                  )}
                </div>
                <Separator />
                <div className="flex justify-between text-sm font-bold text-foreground">
                  <span>{t("total")}</span>
                  <Price amount={checkoutTotal} className="text-sm font-bold text-foreground" />
                </div>
                <p className="text-[10px] text-muted-foreground">{t("includesVat")}</p>
              </div>

              {/* Action Trigger */}
              {hasNoPayableItems && !hasUnresolved ? (
                // Scenario 7: Back to Cart Button instead of Payment
                <Button
                  className="w-full py-6 rounded-2xl text-base font-bold bg-primary hover:bg-primary/90 text-white mt-2"
                  onClick={() => {
                    resetCheckout();
                    router.push("/cart");
                  }}
                >
                  {t("returnToCart")}
                </Button>
              ) : (
                <Button
                  disabled={hasUnresolved}
                  className="w-full py-6 rounded-full text-base font-medium bg-primary hover:bg-primary/90 text-white mt-2"
                  onClick={() => setPhase("payment_loading")}
                >
                  {t("continueToPayment")}
                </Button>
              )}

              {hasUnresolved && (
                <p className="text-[10px] text-center font-semibold text-destructive mt-1">
                  {locale === "ar" ? "ÙŠØ±Ø¬Ù‰ Ø­Ù„ Ø¬Ù…ÙŠØ¹ Ø§Ù„Ù‚Ø±Ø§Ø±Ø§Øª Ø§Ù„Ù…Ø¹Ù„Ù‚Ø© Ù„Ù„Ù…ØªØ§Ø¨Ø¹Ø© Ù„Ù„Ø¯ÙØ¹" : "Please resolve all pending decisions to continue to payment"}
                </p>
              )}
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Phase 5: Final Confirmation (Wireframe 1)
  if (phase === "confirmation") {
    const payableItems = getResolvedItems(receiptLines);
    const unAvailableItems = getUnavailableItems(receiptLines);

    return (
      <div className="container-marketplace py-8 max-w-2xl mx-auto text-center space-y-6">
        {/* Receipt Details Dialog */}
        <Dialog open={receiptOpen} onOpenChange={setReceiptOpen}>
          <DialogContent className="sm:max-w-lg p-6 rounded-2xl bg-card">
            <DialogHeader className="pb-2 border-b">
              <DialogTitle className="text-lg font-bold text-foreground">{t("electronicInvoice")}</DialogTitle>
            </DialogHeader>
            <div className="py-4 space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("invoiceOrderId")}</span>
                <span className="font-bold text-foreground">ORD-1779273580909</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("paymentMode")}</span>
                <span className="font-bold text-foreground capitalize">{t(selectedPayment)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("vat15")}</span>
                <Price amount={receiptTotal * 0.15} className="font-semibold" />
              </div>
              <Separator />
              <div className="space-y-2 text-start">
                <p className="font-semibold text-muted-foreground uppercase tracking-wide text-[10px]">{t("approvedShipments")}</p>
                {Object.values(
                  payableItems.reduce<Record<string, { name: string; nameAr: string; items: typeof payableItems }>>((acc, item) => {
                    const key = item.pharmacyName;
                    if (!acc[key]) {
                      acc[key] = {
                        name: item.pharmacyName,
                        nameAr: item.pharmacyNameAr,
                        items: [],
                      };
                    }
                    acc[key].items.push(item);
                    return acc;
                  }, {})
                ).map((group, idx) => {
                  const pharmName = locale === "ar" ? group.nameAr : group.name;
                  return (
                    <div key={idx} className="space-y-1 text-muted-foreground pt-2 first:pt-0">
                      <p className="font-bold text-foreground text-xs">{pharmName}</p>
                      {group.items.map((item, pIdx) => {
                        const pName = locale === "ar" ? item.nameAr : item.name;
                        return (
                          <p key={pIdx} className="flex items-center flex-wrap gap-1">
                            <span>â€¢ {pName} ({item.qty} {t("item")}) -</span>
                            <Price amount={item.price * item.qty} className="font-medium text-muted-foreground" iconClassName="text-muted-foreground" />
                          </p>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-sm text-primary">
                <span>{t("totalCharged")}</span>
                <Price amount={receiptTotal} className="text-primary font-bold text-sm" />
              </div>
            </div>
            <Button className="w-full rounded-xl" onClick={() => setReceiptOpen(false)}>
              {t("close")}
            </Button>
          </DialogContent>
        </Dialog>

        {/* Cancellation and Refund Choice Modal (Flowchart gap) */}
        <Dialog open={cancelModalOpen} onOpenChange={setCancelModalOpen}>
          <DialogContent
            className="sm:max-w-md p-6 rounded-3xl bg-card border space-y-5"
            onPointerDownOutside={(e) => e.preventDefault()}
            onEscapeKeyDown={(e) => e.preventDefault()}
          >
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-foreground">{t("cancelOrderPrompt")}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 text-start">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{t("refundMethod")}</h4>
              <RadioGroup value={refundChoice} onValueChange={(v) => setRefundChoice(v as "wallet" | "card")} className="space-y-3">
                <label
                  className={cn(
                    "flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-all hover:bg-muted/30",
                    refundChoice === "wallet" ? "border-primary bg-primary/5" : "border-border"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="wallet" />
                    <span className="text-xs font-semibold text-foreground">{t("refundToWallet")}</span>
                  </div>
                </label>
                <label
                  className={cn(
                    "flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-all hover:bg-muted/30",
                    refundChoice === "card" ? "border-primary bg-primary/5" : "border-border"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="card" />
                    <span className="text-xs font-semibold text-foreground">{t("refundToCard")}</span>
                  </div>
                </label>
              </RadioGroup>
            </div>

            <div className="flex gap-3 border-t pt-3">
              <Button
                className="flex-1 py-4 rounded-xl text-xs font-bold text-white bg-primary hover:bg-primary/95"
                onClick={() => {
                  setCancelledByUser(true);
                  setCancelModalOpen(false);
                }}
              >
                {t("viewAlternatives").includes("Alternatives") ? "Confirm" : "ØªØ£ÙƒÙŠØ¯"}
              </Button>
              <Button
                variant="outline"
                className="flex-1 py-4 rounded-xl text-xs font-bold"
                onClick={() => setCancelModalOpen(false)}
              >
                {tc("cancel")}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <div className="flex justify-center pt-4">
          <div className={cn(
            "flex h-20 w-20 items-center justify-center rounded-full border-4",
            cancelledByUser
              ? "bg-red-500/10 border-red-500/20"
              : "bg-primary/10 border-primary/20"
          )}>
            {cancelledByUser ? (
              <XCircle className="h-10 w-10 text-red-500" />
            ) : (
              <Check className="h-10 w-10 text-primary" />
            )}
          </div>
        </div>

        <div className="space-y-2">
          {cancelledByUser ? (
            <h1 className="text-2xl font-bold text-red-500">{t("orderCancelledStatus")}</h1>
          ) : deliveryMethod === "pickup" ? (
            <h1 className="text-2xl font-bold text-green-600">{t("pickupNotice")}</h1>
          ) : (
            <h1 className="text-2xl font-bold text-foreground">{t("orderPlacedSuccess")}</h1>
          )}
          <p className="text-muted-foreground text-sm">{t("orderId", { id: "ORD-1779273580909" })}</p>
        </div>

        <div className="space-y-4 text-start">
          {/* Available Items */}
          {payableItems.length > 0 && (
            <Card className="rounded-2xl border p-4 space-y-3 shadow-none">
              <div className="flex items-center gap-2 text-success text-sm font-semibold">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>{t("availableItems")}</span>
              </div>
              <div className="space-y-2">
                {payableItems.map((item, idx) => {
                  const name = locale === "ar" ? item.nameAr : item.name;
                  return (
                    <div key={idx} className="flex justify-between items-center bg-green-500/5 p-3 rounded-xl border border-green-500/10 text-xs">
                      <div>
                        <h4 className="font-semibold text-foreground">{name}</h4>
                        <span className="text-muted-foreground text-[10px]">{tc("cart")} Qty: {item.qty}</span>
                      </div>
                      <Price amount={item.price * item.qty} className="font-bold text-primary shrink-0" />
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {/* Unavailable Items */}
          {unAvailableItems.length > 0 && (
            <Card className="rounded-2xl border p-4 space-y-3 bg-muted/20 border-dashed shadow-none">
              <div className="flex items-center gap-2 text-destructive text-sm font-semibold">
                <XCircle className="h-4 w-4 text-red-600" />
                <div>
                  <span>{t("unavailableItems")}</span>
                  <p className="text-[10px] text-muted-foreground font-normal mt-0.5">{t("refundedToWallet")}</p>
                </div>
              </div>
              <div className="space-y-2">
                {unAvailableItems.map((item, idx) => {
                  const name = locale === "ar" ? item.nameAr : item.name;
                  return (
                    <div key={idx} className="flex justify-between items-center bg-red-500/5 p-3 rounded-xl border border-red-500/10 text-xs opacity-80">
                      <div>
                        <h4 className="font-semibold text-foreground">{name}</h4>
                        <span className="text-muted-foreground text-[10px]">{tc("cart")} Qty: {item.qty}</span>
                      </div>
                      <Price amount={item.price * item.qty} className="font-bold text-red-500 shrink-0" iconClassName="text-red-500" />
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {/* Final Total */}
          <div className="flex justify-between items-center py-3 border-t">
            <span className="font-bold text-foreground">{t("total")}</span>
            <Price amount={receiptTotal} className="text-xl font-bold text-primary" />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2">
          {/* {!cancelledByUser && (
            <Button
              className="w-full py-5 rounded-2xl text-base font-medium bg-destructive hover:bg-destructive/90 text-white"
              onClick={() => setCancelModalOpen(true)}
            >
              {t("cancelOrder")}
            </Button>
          )} */}
          <Button variant="default" className="w-full py-5 rounded-2xl text-base font-medium" onClick={() => router.push("/orders")}>
            {t("viewOrderStatus")}
          </Button>
          <Button variant="outline" className="w-full py-5 rounded-2xl text-base font-medium" onClick={() => setReceiptOpen(true)}>
            {t("viewReceipt")}
          </Button>
        </div>
      </div>
    );
  }

  // Modals visibility toggles
  const showPaymentLoading = phase === "payment_loading";

  return (
    <div className="container-marketplace py-6 lg:py-6 relative">
      {/* 3. Preparing Payment Session Loader (Phase 3) */}
      <Dialog open={showPaymentLoading} onOpenChange={() => { }}>
        <DialogContent
          className="sm:max-w-xs p-6 rounded-3xl bg-card border text-center flex flex-col items-center justify-center space-y-4"
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <DialogTitle className="text-base font-bold text-foreground">{t("preparingPayment")}</DialogTitle>
        </DialogContent>
      </Dialog>

      <div className="flex items-center gap-3 mb-5">
        <Button variant="ghost" size="icon" onClick={() => router.push("/cart")} className="rounded-full">
          <ChevronLeft className="size-6 rtl:-rotate-180" />
        </Button>
        <h1 className="text-2xl font-bold text-foreground">{t("paymentMethod")}</h1>
      </div>

      <div className={cn("grid gap-8 lg:grid-cols-12 transition-all duration-300", showPaymentLoading && "filter blur-[2px] select-none pointer-events-none")}>
        {/* Left Column: Form Settings */}
        <div className="lg:col-span-8 space-y-6">
          {/* Delivery Method Selector (Store Pickup Gap) */}
          <Card className="rounded-2xl border p-5 space-y-4">
            <h3 className="font-bold text-sm text-foreground">{t("deliveryMethod")}</h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                className={cn(
                  "flex flex-col items-center justify-center p-4 rounded-xl border transition-all text-xs font-semibold gap-1.5",
                  deliveryMethod === "delivery" ? "border-primary bg-primary/5 text-primary" : "border-border hover:bg-muted/30"
                )}
                onClick={() => setDeliveryMethod("delivery")}
              >
                <span>{t("homeDelivery")}</span>
              </button>
              <button
                type="button"
                className={cn(
                  "flex flex-col items-center justify-center p-4 rounded-xl border transition-all text-xs font-semibold gap-1.5",
                  deliveryMethod === "pickup" ? "border-primary bg-primary/5 text-primary" : "border-border hover:bg-muted/30"
                )}
                onClick={() => setDeliveryMethod("pickup")}
              >
                <span>{t("storePickup")}</span>
              </button>
            </div>

            {deliveryMethod === "pickup" && (
              <div className="space-y-3 pt-3 border-t text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("selectPickupBranch")}</span>
                  <span className="font-bold text-foreground">Nahdi Al-Malaz Branch</span>
                </div>
                <p className="text-[10px] text-green-600 font-semibold bg-green-500/5 px-2 py-1 rounded-lg">
                  {t("readyIn", { time: 15 })}
                </p>
              </div>
            )}
          </Card>

          {/* Wallet Toggle */}
          <Card className="rounded-2xl border p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-primary/5 rounded-full flex items-center justify-center text-primary">
                <Wallet className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">{t("walletBalance")}</p>
                <Price amount={79.00} className="text-sm font-semibold text-primary" />
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={walletApplied}
                onChange={() => setWalletApplied(!walletApplied)}
                disabled={showPaymentLoading}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
            </label>
          </Card>

          {/* Loyalty Points Option (Directly under Wallet Balance card) */}
          <Card className="rounded-2xl border p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-secondary/5 rounded-full flex items-center justify-center text-secondary">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">{t("loyaltyPoints")}</p>
                  <p className="text-xs text-muted-foreground">{t("ptsAvailable", { count: "2,400" })}</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={loyaltyApplied}
                  onChange={() => setLoyaltyApplied(!loyaltyApplied)}
                  disabled={showPaymentLoading}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary" />
              </label>
            </div>

            {loyaltyApplied && (
              <div className="space-y-3 pt-3 border-t text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("redeemPoints")}</span>
                  <span className="font-semibold text-foreground">{redeemPoints} pts</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="2400"
                  step="100"
                  value={redeemPoints}
                  onChange={(e) => setRedeemPoints(Number(e.target.value))}
                  disabled={showPaymentLoading}
                  className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-secondary"
                />
                <p className="text-[10px] text-muted-foreground leading-normal">
                  {t.rich("redemptionRate", {
                    pts: redeemPoints,
                    amount: () => <Price amount={redeemPoints * 0.01} className="font-semibold text-muted-foreground" iconClassName="text-muted-foreground" />
                  })}
                </p>
              </div>
            )}
          </Card>

          {/* Payment List Options */}
          <Card className="rounded-2xl border p-6 space-y-4">
            <h2 className="text-base font-bold text-foreground mb-2">{t("selectPaymentMethod")}</h2>
            <RadioGroup value={selectedPayment} onValueChange={setSelectedPayment} className="space-y-3">
              {[
                { id: "visa", label: t("visa"), sub: "**** 4209" },
                { id: "apple-pay", label: t("applePay") },
                { id: "tabby", label: t("tabby"), sub: t("tabbySub") },
                { id: "stc-pay", label: t("stcPay") },
                { id: "cash", label: t("cash") },
                { id: "mada", label: t("mada") }
              ].map((method) => (
                <label
                  key={method.id}
                  className={cn(
                    "flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-all hover:bg-muted/30",
                    selectedPayment === method.id ? "border-primary bg-primary/5" : "border-border"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value={method.id} disabled={showPaymentLoading} />
                    <div>
                      <span className="text-sm font-semibold text-foreground">{method.label}</span>
                      {method.sub && <p className="text-xs text-muted-foreground mt-0.5">{method.sub}</p>}
                    </div>
                  </div>
                </label>
              ))}
            </RadioGroup>
          </Card>
        </div>

        {/* Right Column: Sticky Summary Sheet containing Promo Code nesting */}
        <div className="lg:col-span-4">
          <Card className="rounded-2xl border p-5 space-y-5 sticky top-36">
            <h3 className="font-bold text-base text-foreground">{t("orderSummary")}</h3>

            {/* Nested Promo Code block */}
            <div className="space-y-2.5 pb-3 border-b">
              <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                <Tag className="h-3.5 w-3.5 text-primary" />
                <span>{t("promoCode")}</span>
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder={t("enterPromoCode")}
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  disabled={isPromoApplied || showPaymentLoading}
                  className="rounded-xl h-9 text-xs"
                />
                {isPromoApplied ? (
                  <Button variant="outline" size="sm" disabled={showPaymentLoading} className="shrink-0 text-destructive border-destructive rounded-xl text-xs h-9 px-3" onClick={() => setIsPromoApplied(false)}>
                    {t("remove")}
                  </Button>
                ) : (
                  <Button size="sm" disabled={showPaymentLoading} className="shrink-0 bg-primary rounded-xl text-white hover:bg-primary/95 text-xs h-9 px-3" onClick={handleApplyPromo}>
                    {t("apply")}
                  </Button>
                )}
              </div>
              {isPromoApplied && (
                <p className="text-[10px] font-semibold text-green-600 bg-green-500/5 border border-green-500/10 px-2 py-1 rounded-lg">
                  {t("promoApplied")}
                </p>
              )}
              {promoError && <p className="text-[10px] font-semibold text-destructive">{promoError}</p>}
            </div>

            {/* Dynamic summary rows */}
            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>{t("productPrice")}</span>
                <Price amount={productPrice} className="font-semibold text-foreground" />
              </div>
              {isPromoApplied && (
                <div className="flex justify-between text-destructive">
                  <span>{t("additionalDiscount")}</span>
                  <span className="inline-flex items-center gap-1 font-semibold text-destructive">-<Price amount={promoDiscount} className="text-destructive font-semibold" iconClassName="text-destructive" /></span>
                </div>
              )}
              <div className="flex justify-between text-muted-foreground">
                <span>{t("deliveryFees")}</span>
                <span className="text-green-600 font-semibold">{t("free")}</span>
              </div>
              {walletApplied && (
                <div className="flex justify-between text-primary">
                  <span>{t("paymentFromBalance")}</span>
                  <span className="inline-flex items-center gap-1 font-semibold text-primary">-<Price amount={balancePayment} className="text-primary font-semibold" /></span>
                </div>
              )}
              {loyaltyApplied && (
                <div className="flex justify-between text-secondary">
                  <span>{t("loyaltyApplied")}</span>
                  <span className="inline-flex items-center gap-1 font-semibold text-secondary">-<Price amount={loyaltyDiscount} className="text-secondary font-semibold" iconClassName="text-secondary" /></span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between text-sm font-bold text-foreground">
                <span>{t("total")}</span>
                <Price amount={checkoutTotal} className="text-sm font-bold text-foreground" />
              </div>
              <p className="text-[10px] text-muted-foreground">{t("includesVat")}</p>
            </div>

            {/* Confirm Payment Trigger */}
            <Button disabled={showPaymentLoading} className="w-full py-6 rounded-full text-base font-medium bg-primary hover:bg-primary/90 text-white mt-2" onClick={handlePlaceOrder}>
              {t("confirmPayment")}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}

export function CheckoutPage() {
  return (
    <Suspense fallback={<div className="container-marketplace py-20 text-center">Loading workflow...</div>}>
      <CheckoutPageContent />
    </Suspense>
  );
}

