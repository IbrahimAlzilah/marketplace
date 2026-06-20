"use client";

import { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Check, MapPin, CreditCard, Truck, ClipboardCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { OrderSummary } from "@/components/marketplace/order-summary";
import { addresses, getProductById, getPharmacyById } from "@/lib/mock-data";
import { useCartStore } from "@/stores/cart-store";
import { cn, formatPrice } from "@/lib/utils";

const steps = [
  { key: "address", icon: MapPin },
  { key: "delivery", icon: Truck },
  { key: "payment", icon: CreditCard },
  { key: "review", icon: ClipboardCheck },
] as const;

export function CheckoutPage() {
  const t = useTranslations("checkout");
  const tc = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();
  const { items, clearCart } = useCartStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAddress, setSelectedAddress] = useState(addresses[0]?.id ?? "");
  const [deliveryType, setDeliveryType] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("mada");

  const subtotal = items.reduce((sum, item) => {
    const product = getProductById(item.productId);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

  const pharmacyIds = [...new Set(items.map((i) => getProductById(i.productId)?.pharmacyId).filter(Boolean))];
  const deliveryFees = pharmacyIds.reduce((sum, id) => {
    const pharmacy = getPharmacyById(id!);
    return sum + (pharmacy?.deliveryFee ?? 0);
  }, 0);

  const handlePlaceOrder = () => {
    clearCart();
    router.push("/checkout/success");
  };

  useEffect(() => {
    if (items.length === 0) {
      router.push("/cart");
    }
  }, [items.length, router]);

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="container-marketplace py-6 lg:py-6">
      <h1 className="mb-8 text-2xl font-bold lg:text-3xl">{t("title")}</h1>

      {/* Stepper */}
      <div className="mb-8 flex items-center justify-center gap-2 sm:gap-4">
        {steps.map((step, i) => {
          const Icon = step.icon;
          const isActive = i === currentStep;
          const isDone = i < currentStep;
          return (
            <div key={step.key} className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={() => i < currentStep && setCurrentStep(i)}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                  isActive && "bg-primary/10 text-primary font-medium",
                  isDone && "text-primary cursor-pointer",
                  !isActive && !isDone && "text-muted-foreground"
                )}
              >
                <div className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border-2",
                  isActive && "border-primary bg-primary text-primary-foreground",
                  isDone && "border-primary bg-primary text-primary-foreground",
                  !isActive && !isDone && "border-muted-foreground/30"
                )}>
                  {isDone ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                </div>
                <span className="hidden sm:inline">{t(step.key)}</span>
              </button>
              {i < steps.length - 1 && (
                <div className={cn("h-px w-8 sm:w-16", isDone ? "bg-primary" : "bg-border")} />
              )}
            </div>
          );
        })}
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8 space-y-6">
          {currentStep === 0 && (
            <Card>
              <CardHeader>
                <CardTitle>{t("address")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {addresses.map((addr) => (
                  <label
                    key={addr.id}
                    className={cn(
                      "flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors",
                      selectedAddress === addr.id && "border-primary bg-primary/5"
                    )}
                  >
                    <input
                      type="radio"
                      name="address"
                      value={addr.id}
                      checked={selectedAddress === addr.id}
                      onChange={() => setSelectedAddress(addr.id)}
                      className="mt-1"
                    />
                    <div>
                      <p className="font-medium">{addr.label} {addr.isDefault && <span className="text-xs text-primary">(Default)</span>}</p>
                      <p className="text-sm text-muted-foreground">{addr.street}, {addr.district}, {addr.city}</p>
                    </div>
                  </label>
                ))}
                <Button variant="outline">Add new address</Button>
              </CardContent>
            </Card>
          )}

          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>{t("delivery")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {pharmacyIds.map((id) => {
                  const pharmacy = getPharmacyById(id!);
                  if (!pharmacy) return null;
                  const name = locale === "ar" ? pharmacy.nameAr : pharmacy.name;
                  return (
                    <div key={id} className="rounded-lg border p-4 space-y-3">
                      <p className="font-medium">{name}</p>
                      <RadioGroup value={deliveryType} onValueChange={setDeliveryType}>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="standard" id={`std-${id}`} />
                          <Label htmlFor={`std-${id}`}>{t("standardDelivery")} — {pharmacy.eta} {tc("min")}</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="express" id={`exp-${id}`} />
                          <Label htmlFor={`exp-${id}`}>{t("expressDelivery")} — {Math.max(15, pharmacy.eta - 10)} {tc("min")}</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  );
                })}
                <div>
                  <Label>{t("deliveryNotes")}</Label>
                  <Input placeholder="Apartment number, landmarks..." className="mt-1" />
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>{t("paymentMethods")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  {["mada", "apple-pay", "visa"].map((method) => (
                    <label
                      key={method}
                      className={cn(
                        "flex cursor-pointer items-center gap-3 rounded-lg border p-4",
                        paymentMethod === method && "border-primary bg-primary/5"
                      )}
                    >
                      <RadioGroupItem value={method} />
                      <span className="capitalize">{method.replace("-", " ")}</span>
                    </label>
                  ))}
                </RadioGroup>
                {paymentMethod === "visa" && (
                  <div className="space-y-3 pt-2">
                    <Input placeholder="Card number" />
                    <div className="grid grid-cols-2 gap-3">
                      <Input placeholder="MM/YY" />
                      <Input placeholder="CVV" />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {currentStep === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>{t("review")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => {
                  const product = getProductById(item.productId);
                  if (!product) return null;
                  return (
                    <div key={item.productId} className="flex justify-between text-sm">
                      <span>{locale === "ar" ? product.nameAr : product.name} × {item.quantity}</span>
                      <span>{formatPrice(product.price * item.quantity)}</span>
                    </div>
                  );
                })}
                <Separator />
                <div className="text-sm text-muted-foreground">
                  <p>Payment: {paymentMethod}</p>
                  <p>Address: {addresses.find((a) => a.id === selectedAddress)?.label}</p>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => currentStep > 0 ? setCurrentStep(currentStep - 1) : router.push("/cart")}
            >
              Back
            </Button>
            {currentStep < steps.length - 1 ? (
              <Button onClick={() => setCurrentStep(currentStep + 1)}>Continue</Button>
            ) : (
              <Button size="lg" onClick={handlePlaceOrder}>{t("placeOrder")}</Button>
            )}
          </div>
        </div>

        <div className="lg:col-span-4">
          <OrderSummary
            subtotal={subtotal}
            deliveryFees={deliveryFees}
            showCheckoutButton={false}
            className="sticky top-36"
          />
        </div>
      </div>
    </div>
  );
}
