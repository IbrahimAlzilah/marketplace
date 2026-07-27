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

export type RecentlyViewedState = {
  recentlyViewedIds: string[];
  addRecentlyViewed: (productId: string) => void;
  clearRecentlyViewed: () => void;
};
