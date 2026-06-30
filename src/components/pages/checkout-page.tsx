"use client";

import { useState, useEffect, Suspense } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import {
  Check,
  CheckCircle,
  XCircle,
  ChevronLeft,
  Loader2,
  Wallet,
  Tag,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn, formatPrice } from "@/lib/utils";
import { useCartStore } from "@/stores/cart-store";

function CheckoutPageContent() {
  const t = useTranslations("checkout");
  const tc = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();

  // Workflow starts at payment loader: "payment_loading" | "payment_method" | "confirmation"
  const [phase, setPhase] = useState<"payment_loading" | "payment_method" | "confirmation">("payment_loading");

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

  // Translators helpers for mock details
  const getPharmacyTranslation = (name: string) => {
    if (name.includes("Nahdi")) return t("nahdiPharmacy");
    if (name.includes("Avnzor")) return t("avnzorPharmacy");
    if (name.includes("Whites")) return t("whitesPharmacy");
    return name;
  };

  const getProductTranslation = (name: string) => {
    if (name.includes("Aspirin")) return t("aspirin");
    if (name.includes("Vitamin")) return t("vitaminD");
    if (name.includes("Ibuprofen")) return t("ibuprofen");
    if (name.includes("Cough")) return t("coughSyrup");
    if (name.includes("First Aid")) return t("firstAidKit");
    if (name.includes("Omega-3")) return t("omega3");
    if (name.includes("Multivitamin")) return t("multivitamin");
    if (name.includes("Accu-Chek")) return t("glucoseMonitor");
    if (name.includes("Megamind")) return t("omegaLiquid");
    if (name.includes("Smilepen")) return t("whiteningStrips");
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
    clearCart();
    setPhase("confirmation");
  };

  // Dynamic pricing breakdown values
  const productPrice = 260;
  const promoDiscount = isPromoApplied ? 52 : 0; // 20% discount
  const balancePayment = walletApplied ? 79 : 0; // use exact wallet balance
  const loyaltyDiscount = loyaltyApplied ? redeemPoints * 0.01 : 0; // rate conversion
  const deliveryFee = 0; // free delivery

  // Final Total matches dynamic calculations
  const checkoutTotal = Math.max(0, productPrice - promoDiscount + deliveryFee - balancePayment - loyaltyDiscount);

  // Phase 5: Final Confirmation (Wireframe 1)
  if (phase === "confirmation") {
    return (
      <div className="1container-marketplace py-8 max-w-xl mx-auto text-center space-y-6">
        {/* Receipt Details Dialog */}
        <Dialog open={receiptOpen} onOpenChange={setReceiptOpen}>
          <DialogContent className="sm:max-w-md p-6 rounded-2xl bg-card">
            <DialogHeader className="pb-2 border-b">
              <DialogTitle className="text-lg font-bold text-center text-foreground">{t("electronicInvoice")}</DialogTitle>
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
                <span className="font-semibold">{formatPrice(checkoutTotal * 0.15)}</span>
              </div>
              <Separator />
              <div className="space-y-2 text-start">
                <p className="font-semibold text-muted-foreground uppercase tracking-wide text-[10px]">{t("approvedShipments")}</p>
                <div className="space-y-1 text-muted-foreground">
                  <p className="font-bold text-foreground text-xs">{getPharmacyTranslation("Nahdi Pharmacy")}</p>
                  <p>• {getProductTranslation("Aspirin 100mg")} (1 {t("item")}) - {formatPrice(129.35)}</p>
                  <p>• {getProductTranslation("Vitamin D3")} (1 {t("item")}) - {formatPrice(129.35)}</p>
                  <p>• {getProductTranslation("Ibuprofen 200mg")} (1 {t("item")}) - {formatPrice(129.35)}</p>
                </div>
                <div className="space-y-1 text-muted-foreground pt-2">
                  <p className="font-bold text-foreground text-xs">{getPharmacyTranslation("Avnzor Pharmacy")}</p>
                  <p>• {getProductTranslation("Cough Syrup")} (1 {t("item")}) - {formatPrice(129.35)}</p>
                  <p>• {getProductTranslation("First Aid Kit")} (1 {t("item")}) - {formatPrice(129.35)}</p>
                </div>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-sm text-primary">
                <span>{t("totalCharged")}</span>
                <span>{formatPrice(checkoutTotal)}</span>
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
                {t("viewAlternatives").includes("Alternatives") ? "Confirm" : "تأكيد"}
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
          <Card className="rounded-2xl border p-4 space-y-3">
            <div className="flex items-center gap-2 text-success text-sm font-semibold">
              <CheckCircle className="h-4 w-4" />
              <span>{t("availableItems")}</span>
            </div>
            <div className="space-y-2">
              {[
                { name: "Accu-Chek Instant Blood Glucose Monitor", qty: 2, price: 79.00 },
                { name: "Megamind Omega-3 227 ml Peach & Mango Liquid", qty: 2, price: 99.00 },
                { name: "Smilepen Night Whitening 14 Strips", qty: 2, price: 79.00 }
              ].map((item, idx) => (
                <div key={idx} className="flex justify-between items-center bg-green-500/5 p-3 rounded-xl border border-green-500/10 text-xs">
                  <div>
                    <h4 className="font-semibold text-foreground">{getProductTranslation(item.name)}</h4>
                    <span className="text-muted-foreground text-[10px]">{tc("cart")} Qty: {item.qty}</span>
                  </div>
                  <span className="font-bold text-primary shrink-0">{formatPrice(item.price)}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Unavailable Items */}
          <Card className="rounded-2xl border p-4 space-y-3 bg-muted/20 border-dashed">
            <div className="flex items-center gap-2 text-destructive text-sm font-semibold">
              <XCircle className="h-4 w-4" />
              <div>
                <span>{t("unavailableItems")}</span>
                <p className="text-[10px] text-muted-foreground font-normal mt-0.5">{t("refundedToWallet")}</p>
              </div>
            </div>
            <div className="space-y-2">
              {[
                { name: "Smilepen Night Whitening 14 Strips", qty: 2, price: 79.00 },
                { name: "Accu-Chek Instant Blood Glucose Monitor", qty: 2, price: 79.00 }
              ].map((item, idx) => (
                <div key={idx} className="flex justify-between items-center bg-red-500/5 p-3 rounded-xl border border-red-500/10 text-xs opacity-80">
                  <div>
                    <h4 className="font-semibold text-foreground">{getProductTranslation(item.name)}</h4>
                    <span className="text-muted-foreground text-[10px]">{tc("cart")} Qty: {item.qty}</span>
                  </div>
                  <span className="font-bold text-red-500 shrink-0">{formatPrice(item.price)}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Final Total */}
          <div className="flex justify-between items-center p-4 border-t border-b">
            <span className="font-bold text-foreground">{t("total")}</span>
            <span className="text-xl font-bold text-primary">{formatPrice(checkoutTotal)}</span>
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-4">
          {!cancelledByUser && (
            <Button
              className="w-full py-6 rounded-2xl text-base font-bold bg-destructive hover:bg-destructive/90 text-white"
              onClick={() => setCancelModalOpen(true)}
            >
              {t("cancelOrder")}
            </Button>
          )}
          <Button variant="outline" className="w-full py-6 rounded-2xl text-base font-bold" onClick={() => setReceiptOpen(true)}>
            {t("viewReceipt")}
          </Button>
          <Button variant="ghost" className="w-full py-6 rounded-2xl text-base font-bold text-muted-foreground" onClick={() => router.push("/orders")}>
            {t("viewOrderStatus")}
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
      <Dialog open={showPaymentLoading} onOpenChange={() => {}}>
        <DialogContent 
          className="sm:max-w-xs p-6 rounded-3xl bg-card border text-center flex flex-col items-center justify-center space-y-4"
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <DialogTitle className="text-base font-bold text-foreground">{t("preparingPayment")}</DialogTitle>
        </DialogContent>
      </Dialog>

      <div className="flex items-center gap-3 mb-8">
        <Button variant="ghost" size="icon" onClick={() => router.push("/cart")} className="rounded-full">
          <ChevronLeft className="h-6 w-6" />
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
                <p className="text-sm font-semibold text-primary">{formatPrice(79.00)}</p>
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
                  {t("redemptionRate", { pts: redeemPoints, amount: formatPrice(redeemPoints * 0.01) })}
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
                <span className="font-semibold text-foreground">{formatPrice(productPrice)}</span>
              </div>
              {isPromoApplied && (
                <div className="flex justify-between text-destructive">
                  <span>{t("additionalDiscount")}</span>
                  <span className="font-semibold">-{formatPrice(promoDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between text-muted-foreground">
                <span>{t("deliveryFees")}</span>
                <span className="text-green-600 font-semibold">{t("free")}</span>
              </div>
              {walletApplied && (
                <div className="flex justify-between text-primary">
                  <span>{t("paymentFromBalance")}</span>
                  <span className="font-semibold">-{formatPrice(balancePayment)}</span>
                </div>
              )}
              {loyaltyApplied && (
                <div className="flex justify-between text-secondary">
                  <span>{t("loyaltyApplied")}</span>
                  <span className="font-semibold">-{formatPrice(loyaltyDiscount)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between text-sm font-bold text-foreground">
                <span>{t("total")}</span>
                <span>{formatPrice(checkoutTotal)}</span>
              </div>
              <p className="text-[10px] text-muted-foreground">{t("includesVat")}</p>
            </div>

            {/* Confirm Payment Trigger */}
            <Button disabled={showPaymentLoading} className="w-full py-6 rounded-2xl text-base font-bold bg-primary hover:bg-primary/90 text-white mt-2" onClick={handlePlaceOrder}>
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
