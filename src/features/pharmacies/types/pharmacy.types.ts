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
