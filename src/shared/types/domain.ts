export type Category = {
  id: string;
  name: string;
  nameAr: string;
  slug: string;
  icon: string;
  subcategories?: Category[];
};

export type Pharmacy = {
  id: string;
  name: string;
  nameAr: string;
  slug: string;
  rating: number;
  reviewCount: number;
  distance: number;
  eta: number;
  isOpen: boolean;
  opensAt?: string;
  deliveryFee: number;
  freeDeliveryMin?: number;
  logo: string;
  cover: string;
  licensed: boolean;
  address: string;
  addressAr: string;
};

export type Product = {
  id: string;
  name: string;
  nameAr: string;
  slug: string;
  description: string;
  descriptionAr: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  categoryId: string;
  pharmacyId: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockCount: number;
  requiresPrescription: boolean;
  badge?: "offer" | "bestseller" | "new";
  brand: string;
};

export type CartItem = {
  productId: string;
  quantity: number;
};

export type Order = {
  id: string;
  orderNumber: string;
  status: "pending" | "confirmed" | "preparing" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
  total: number;
  pharmacyIds: string[];
  itemCount: number;
};

export type Address = {
  id: string;
  label: string;
  street: string;
  city: string;
  district: string;
  isDefault: boolean;
};

export type WalletTransaction = {
  id: string;
  type: "credit" | "debit";
  amount: number;
  description: string;
  date: string;
};

export type LoyaltyTransaction = {
  id: string;
  type: "earn" | "redeem";
  points: number;
  description: string;
  date: string;
};
