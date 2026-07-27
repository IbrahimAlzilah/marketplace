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

export type WishlistState = {
  items: string[]; // productIds
  addItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  toggleItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
};
