import { CheckoutLine } from "../store/checkout-store";

export type { CheckoutLine };

export type ResolvedItem = {
  productId: string;
  name: string;
  nameAr: string;
  qty: number;
  price: number;
  image: string;
  pharmacyName: string;
  pharmacyNameAr: string;
};

export type PaymentMethod = "card" | "apple_pay" | "cash";

export type DeliveryMethod = "standard" | "express";
