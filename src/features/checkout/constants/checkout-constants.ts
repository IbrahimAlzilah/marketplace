export const PAYMENT_METHODS = [
  { id: "card", labelKey: "creditCard" },
  { id: "apple_pay", labelKey: "applePay" },
  { id: "cash", labelKey: "cashOnDelivery" },
] as const;

export const DELIVERY_OPTIONS = [
  { id: "standard", fee: 12, estHours: 24 },
  { id: "express", fee: 25, estHours: 2 },
] as const;
