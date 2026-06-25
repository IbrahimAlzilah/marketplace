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

export const categories: Category[] = [
  {
    id: "1",
    name: "Medicines",
    nameAr: "أدوية",
    slug: "medicines",
    icon: "💊",
    subcategories: [
      { id: "1-1", name: "Pain Relief", nameAr: "مسكنات الألم", slug: "pain-relief", icon: "" },
      { id: "1-2", name: "Cold & Flu", nameAr: "البرد والإنفلونزا", slug: "cold-flu", icon: "" },
      { id: "1-3", name: "Chronic Diseases", nameAr: "الأمراض المزمنة", slug: "chronic-diseases", icon: "" },
      { id: "1-4", name: "First Aid", nameAr: "الإسعافات الأولية", slug: "first-aid", icon: "" },
    ],
  },
  {
    id: "2",
    name: "Vitamins",
    nameAr: "فيتامينات",
    slug: "vitamins",
    icon: "🧴",
    subcategories: [
      { id: "2-1", name: "Multivitamins", nameAr: "الفيتامينات المتعددة", slug: "multivitamins", icon: "" },
      { id: "2-2", name: "Minerals", nameAr: "المعادن", slug: "minerals", icon: "" },
      { id: "2-3", name: "Immunity Boosters", nameAr: "مقويات المناعة", slug: "immunity-boosters", icon: "" },
      { id: "2-4", name: "Fish Oil", nameAr: "زيت السمك", slug: "fish-oil", icon: "" },
    ],
  },
  {
    id: "3",
    name: "Baby Care",
    nameAr: "العناية بالطفل",
    slug: "baby-care",
    icon: "👶",
    subcategories: [
      { id: "3-1", name: "Baby Milk", nameAr: "حليب الأطفال", slug: "baby-milk", icon: "" },
      { id: "3-2", name: "Diapers", nameAr: "حفاضات الأطفال", slug: "diapers", icon: "" },
      { id: "3-3", name: "Baby Skincare", nameAr: "العناية ببشرة الأطفال", slug: "baby-skincare", icon: "" },
      { id: "3-4", name: "Feeding Accessories", nameAr: "مستلزمات التغذية", slug: "feeding-accessories", icon: "" },
    ],
  },
  {
    id: "4",
    name: "Skin Care",
    nameAr: "العناية بالبشرة",
    slug: "skin-care",
    icon: "✨",
    subcategories: [
      { id: "4-1", name: "Skincare", nameAr: "العناية بالبشرة", slug: "skincare-face", icon: "" },
      { id: "4-2", name: "Suncare", nameAr: "واقيات الشمس", slug: "suncare", icon: "" },
      { id: "4-3", name: "Moisturizers", nameAr: "المرطبات", slug: "moisturizers", icon: "" },
      { id: "4-4", name: "Serums", nameAr: "السيروم", slug: "serums", icon: "" },
    ],
  },
  {
    id: "5",
    name: "Medical Devices",
    nameAr: "أجهزة طبية",
    slug: "medical-devices",
    icon: "🩺",
    subcategories: [
      { id: "5-1", name: "Blood Pressure", nameAr: "قياس ضغط الدم", slug: "blood-pressure", icon: "" },
      { id: "5-2", name: "Thermometers", nameAr: "أجهزة قياس الحرارة", slug: "thermometers", icon: "" },
      { id: "5-3", name: "Glucose Monitors", nameAr: "أجهزة قياس السكر", slug: "glucose-monitors", icon: "" },
      { id: "5-4", name: "Nebulizers", nameAr: "أجهزة الاستنشاق", slug: "nebulizers", icon: "" },
    ],
  },
  {
    id: "6",
    name: "Personal Care",
    nameAr: "العناية الشخصية",
    slug: "personal-care",
    icon: "🧼",
    subcategories: [
      { id: "6-1", name: "Body Wash", nameAr: "غسول الجسم", slug: "body-wash", icon: "" },
      { id: "6-2", name: "Deodorants", nameAr: "مزيلات العرق", slug: "deodorants", icon: "" },
      { id: "6-3", name: "Oral Care", nameAr: "العناية بالفم", slug: "oral-care", icon: "" },
      { id: "6-4", name: "Hair Care", nameAr: "العناية بالشعر", slug: "hair-care", icon: "" },
    ],
  },
  {
    id: "7",
    name: "Fitness & Nutrition",
    nameAr: "اللياقة والتغذية",
    slug: "fitness",
    icon: "💪",
    subcategories: [
      { id: "7-1", name: "Protein Powder", nameAr: "بودرة البروتين", slug: "protein-powder", icon: "" },
      { id: "7-2", name: "Energy Bars", nameAr: "ألواح الطاقة", slug: "energy-bars", icon: "" },
      { id: "7-3", name: "Shakers", nameAr: "شيكر / خافق", slug: "shakers", icon: "" },
      { id: "7-4", name: "Fat Burners", nameAr: "حوارق الدهون", slug: "fat-burners", icon: "" },
    ],
  },
  {
    id: "8",
    name: "Herbal Remedies",
    nameAr: "العلاجات العشبية",
    slug: "herbal",
    icon: "🌿",
    subcategories: [
      { id: "8-1", name: "Herbal Tea", nameAr: "شاي أعشاب", slug: "herbal-tea", icon: "" },
      { id: "8-2", name: "Natural Oils", nameAr: "زيوت طبيعية", slug: "natural-oils", icon: "" },
      { id: "8-3", name: "Honey", nameAr: "العسل", slug: "honey", icon: "" },
      { id: "8-4", name: "Organic Herbs", nameAr: "أعشاب عضوية", slug: "organic-herbs", icon: "" },
    ],
  },
];

export const pharmacies: Pharmacy[] = [
  {
    id: "p1",
    name: "Nahdi Pharmacy",
    nameAr: "صيدلية النهدي",
    slug: "nahdi-pharmacy",
    rating: 4.8,
    reviewCount: 1240,
    distance: 1.2,
    eta: 25,
    isOpen: true,
    deliveryFee: 0,
    freeDeliveryMin: 50,
    logo: "/images/pharmacies-1.png",
    cover: "/images/pharmacy-bg.avif",
    licensed: true,
    address: "King Fahd Road, Riyadh",
    addressAr: "طريق الملك فهد، الرياض",
  },
  {
    id: "p2",
    name: "Al-Dawaa Pharmacy",
    nameAr: "صيدلية الدواء",
    slug: "al-dawaa-pharmacy",
    rating: 4.6,
    reviewCount: 890,
    distance: 2.1,
    eta: 35,
    isOpen: true,
    deliveryFee: 15,
    freeDeliveryMin: 100,
    logo: "/images/pharmacy-logo.jpg",
    cover: "/images/pharmacy-bg.avif",
    licensed: true,
    address: "Olaya District, Riyadh",
    addressAr: "حي العليا، الرياض",
  },
  {
    id: "p3",
    name: "Boots Pharmacy",
    nameAr: "صيدلية بوتس",
    slug: "boots-pharmacy",
    rating: 4.5,
    reviewCount: 560,
    distance: 3.0,
    eta: 40,
    isOpen: false,
    opensAt: "08:00 AM",
    deliveryFee: 12,
    logo: "/images/pharmacies-1.png",
    cover: "/images/pharmacy-bg.avif",
    licensed: true,
    address: "Al Malqa, Riyadh",
    addressAr: "الملقا، الرياض",
  },
  {
    id: "p4",
    name: "United Pharmacy",
    nameAr: "صيدلية المتحدة",
    slug: "united-pharmacy",
    rating: 4.7,
    reviewCount: 720,
    distance: 1.8,
    eta: 30,
    isOpen: true,
    deliveryFee: 10,
    freeDeliveryMin: 75,
    logo: "/images/pharmacy-logo.jpg",
    cover: "/images/pharmacy-bg.avif",
    licensed: true,
    address: "Al Narjis, Riyadh",
    addressAr: "النرجس، الرياض",
  },
  {
    id: "p5",
    name: "Whites Pharmacy",
    nameAr: "صيدلية وايتس",
    slug: "whites-pharmacy",
    rating: 4.4,
    reviewCount: 430,
    distance: 2.5,
    eta: 38,
    isOpen: true,
    deliveryFee: 12,
    logo: "/images/pharmacy-logo.jpg",
    cover: "/images/pharmacy-bg.avif",
    licensed: true,
    address: "Al Yasmin, Riyadh",
    addressAr: "الياسمين، الرياض",
  },
  {
    id: "p6",
    name: "Adam Pharmacy",
    nameAr: "صيدلية آدم",
    slug: "adam-pharmacy",
    rating: 4.3,
    reviewCount: 310,
    distance: 4.2,
    eta: 45,
    isOpen: true,
    deliveryFee: 15,
    logo: "/images/pharmacy-logo.jpg",
    cover: "/images/pharmacy-bg.avif",
    licensed: true,
    address: "Al Rawdah, Riyadh",
    addressAr: "الروضة، الرياض",
  },
];

export const products: Product[] = [
  {
    id: "pr1",
    name: "Body & Hair Care Oils Collection",
    nameAr: "مجموعة زيوت العناية بالجسم والشعر",
    slug: "body-hair-care-oils",
    description: "Natural oil collection for skin nourishment and hair health.",
    descriptionAr: "مجموعة زيوت طبيعية لتغذية البشرة وصحة الشعر.",
    price: 68.0,
    originalPrice: 85.0,
    image: "/images/products/product-1.jpg",
    images: [
      "/images/products/product-1.jpg",
    ],
    categoryId: "6",
    pharmacyId: "p1",
    rating: 4.7,
    reviewCount: 142,
    inStock: true,
    stockCount: 50,
    requiresPrescription: false,
    badge: "bestseller",
    brand: "Nature's Bounty",
  },
  {
    id: "pr2",
    name: "Keune Satin Oil Shampoo",
    nameAr: "كيون ساتين أويل شامبو",
    slug: "keune-satin-oil-shampoo",
    description: "Keune Satin Oil shampoo for dry and dull hair.",
    descriptionAr: "شامبو كيون ساتين أويل للشعر الجاف والباهت.",
    price: 95.0,
    image: "/images/products/product-2.jpg",
    images: ["/images/products/product-2.jpg"],
    categoryId: "6",
    pharmacyId: "p1",
    rating: 4.5,
    reviewCount: 88,
    inStock: true,
    stockCount: 30,
    requiresPrescription: false,
    badge: "offer",
    brand: "Keune",
  },
  {
    id: "pr3",
    name: "Cetaphil Gentle Skin Cleanser",
    nameAr: "سيتافيل غسول لطيف للبشرة",
    slug: "cetaphil-gentle-skin-cleanser",
    description: "Gentle skin cleanser for sensitive skin.",
    descriptionAr: "غسول لطيف للبشرة الحساسة.",
    price: 62.0,
    image: "/images/products/product-3.jpg",
    images: ["/images/products/product-3.jpg"],
    categoryId: "4",
    pharmacyId: "p2",
    rating: 4.8,
    reviewCount: 456,
    inStock: true,
    stockCount: 25,
    requiresPrescription: false,
    brand: "Cetaphil",
  },
  {
    id: "pr4",
    name: "Pampers Rash Protection Diapers",
    nameAr: "حفاضات بامبرز لحماية البشرة",
    slug: "pampers-protection-diapers",
    description: "Premium diapers with active baby lotion.",
    descriptionAr: "حفاضات أطفال ممتازة مع لوشن لحماية البشرة.",
    price: 78.0,
    originalPrice: 95.0,
    image: "/images/products/product-4.jpg",
    images: ["/images/products/product-4.jpg"],
    categoryId: "3",
    pharmacyId: "p2",
    rating: 4.6,
    reviewCount: 198,
    inStock: true,
    stockCount: 20,
    requiresPrescription: false,
    badge: "new",
    brand: "Pampers",
  },
  {
    id: "pr5",
    name: "Prof Cold & Flu Tablets",
    nameAr: "بروف كولد اند فلو",
    slug: "prof-cold-flu",
    description: "Provides fast relief from cold and flu symptoms.",
    descriptionAr: "تخفيف سريع لأعراض البرد والإنفلونزا.",
    price: 18.5,
    originalPrice: 22.0,
    image: "/images/products/product-5.jpg",
    images: ["/images/products/product-5.jpg"],
    categoryId: "1",
    pharmacyId: "p3",
    rating: 4.9,
    reviewCount: 312,
    inStock: true,
    stockCount: 20,
    requiresPrescription: false,
    badge: "bestseller",
    brand: "Prof",
  },
  {
    id: "pr6",
    name: "Advil Cold & Sinus 20 Caplets",
    nameAr: "أدفيل كولد أند ساينس 20 قرص",
    slug: "advil-cold-sinus",
    description: "Fast relief of cold and sinus congestion.",
    descriptionAr: "تخفيف سريع لاحتقان الجيوب الأنفية والبرد.",
    price: 25.0,
    image: "/images/products/product-6.jpg",
    images: ["/images/products/product-6.jpg"],
    categoryId: "1",
    pharmacyId: "p1",
    rating: 4.2,
    reviewCount: 45,
    inStock: true,
    stockCount: 15,
    requiresPrescription: true,
    brand: "Advil",
  },
  {
    id: "pr7",
    name: "Jamieson Vitamin C 1000mg",
    nameAr: "جاميسون فيتامين سي 1000 مجم",
    slug: "jamieson-vitamin-c",
    description: "Vitamin C supplement for immune system support.",
    descriptionAr: "مكمل فيتامين سي لدعم الجهاز المناعي.",
    price: 55.0,
    originalPrice: 70.0,
    image: "/images/products/product-7.jpg",
    images: ["/images/products/product-7.jpg"],
    categoryId: "2",
    pharmacyId: "p4",
    rating: 4.4,
    reviewCount: 167,
    inStock: true,
    stockCount: 40,
    requiresPrescription: false,
    badge: "offer",
    brand: "Jamieson",
  },
  {
    id: "pr8",
    name: "Keune Care Hair Conditioner",
    nameAr: "كيون منعم ومغذي الشعر",
    slug: "keune-hair-conditioner",
    description: "Deep nourishing conditioner for smooth and healthy hair.",
    descriptionAr: "بلسم مغذي بعمق لشعر ناعم وصحي.",
    price: 110.0,
    image: "/images/products/product-2.jpg",
    images: ["/images/products/product-2.jpg"],
    categoryId: "6",
    pharmacyId: "p4",
    rating: 4.7,
    reviewCount: 203,
    inStock: true,
    stockCount: 18,
    requiresPrescription: false,
    brand: "Keune",
  },
  {
    id: "pr9",
    name: "Cetaphil Daily Hydrating Lotion",
    nameAr: "سيتافيل لوشن الترطيب اليومي",
    slug: "cetaphil-hydrating-lotion",
    description: "Lightweight, oil-free lotion provides instant hydration to skin.",
    descriptionAr: "لوشن خفيف الوزن وخالي من الزيوت يمنح ترطيباً فورياً للبشرة.",
    price: 89.0,
    image: "/images/products/product-3.jpg",
    images: ["/images/products/product-3.jpg"],
    categoryId: "4",
    pharmacyId: "p5",
    rating: 4.5,
    reviewCount: 98,
    inStock: true,
    stockCount: 12,
    requiresPrescription: false,
    brand: "Cetaphil",
  },
  {
    id: "pr10",
    name: "Advil Liqui-Gels Pain Reliever",
    nameAr: "أدفيل كبسولات مسكن للآلام",
    slug: "advil-liqui-gels",
    description: "Fast liquid-filled capsules for muscle and headache pain relief.",
    descriptionAr: "كبسولات سائلة سريعة لتسكين آلام العضلات والصداع.",
    price: 35.0,
    image: "/images/products/product-6.jpg",
    images: ["/images/products/product-6.jpg"],
    categoryId: "1",
    pharmacyId: "p5",
    rating: 4.3,
    reviewCount: 76,
    inStock: false,
    stockCount: 0,
    requiresPrescription: false,
    brand: "Advil",
  },
  {
    id: "pr11",
    name: "Jamieson Vitamin D3 1000 IU",
    nameAr: "جاميسون فيتامين د3 1000 وحدة",
    slug: "jamieson-vitamin-d3",
    description: "Helps support a healthy immune system and bone development.",
    descriptionAr: "يساعد في دعم صحة الجهاز المناعي ونمو العظام.",
    price: 48.0,
    image: "/images/products/product-7.jpg",
    images: ["/images/products/product-7.jpg"],
    categoryId: "2",
    pharmacyId: "p6",
    rating: 4.1,
    reviewCount: 54,
    inStock: true,
    stockCount: 60,
    requiresPrescription: false,
    brand: "Jamieson",
  },
  {
    id: "pr12",
    name: "Prof Pain Reliever & Fever Reducer",
    nameAr: "بروف مسكن للآلام وخافض للحرارة",
    slug: "prof-pain-reliever",
    description: "Effective pain relief and fever reduction for adults.",
    descriptionAr: "تخفيف فعال للآلام وخفض الحرارة للبالغين.",
    price: 25.0,
    originalPrice: 30.0,
    image: "/images/products/product-5.jpg",
    images: ["/images/products/product-5.jpg"],
    categoryId: "1",
    pharmacyId: "p6",
    rating: 4.6,
    reviewCount: 189,
    inStock: true,
    stockCount: 35,
    requiresPrescription: false,
    badge: "offer",
    brand: "Prof",
  },
];

export const banners = [
  {
    id: "b1",
    title: "20% Off Vitamins",
    titleAr: "خصم 20% على الفيتامينات",
    subtitle: "Boost your immunity this season",
    subtitleAr: "عزز مناعتك هذا الموسم",
    image: "/images/deals/deal_5.webp",
    link: "/products?category=vitamins",
  },
  {
    id: "b2",
    title: "Free Delivery",
    titleAr: "توصيل مجاني",
    subtitle: "On orders over SAR 100",
    subtitleAr: "للطلبات فوق 100 ريال",
    image: "/images/deals/deal_4.webp",
    link: "/pharmacies",
  },
  {
    id: "b3",
    title: "Baby Care Essentials",
    titleAr: "أساسيات العناية بالطفل",
    subtitle: "Trusted brands for your little ones",
    subtitleAr: "علامات تجارية موثوقة لأطفالك",
    image: "/images/deals/deal_3.webp",
    link: "/products?category=baby-care",
  },
];

export const orders: Order[] = [
  {
    id: "o1",
    orderNumber: "YUS-28491",
    status: "shipped",
    createdAt: "2026-06-18T10:00:00",
    total: 130.5,
    pharmacyIds: ["p1", "p2"],
    itemCount: 3,
  },
  {
    id: "o2",
    orderNumber: "YUS-28350",
    status: "delivered",
    createdAt: "2026-06-15T14:30:00",
    total: 245.0,
    pharmacyIds: ["p1"],
    itemCount: 2,
  },
  {
    id: "o3",
    orderNumber: "YUS-28201",
    status: "delivered",
    createdAt: "2026-06-10T09:15:00",
    total: 89.5,
    pharmacyIds: ["p4"],
    itemCount: 1,
  },
];

export const addresses: Address[] = [
  {
    id: "a1",
    label: "Home",
    street: "123 Al Malqa Street",
    city: "Riyadh",
    district: "Al Malqa",
    isDefault: true,
  },
  {
    id: "a2",
    label: "Office",
    street: "456 King Fahd Road",
    city: "Riyadh",
    district: "Al Olaya",
    isDefault: false,
  },
];

export const walletTransactions: WalletTransaction[] = [
  { id: "wt1", type: "credit", amount: 45.0, description: "Refund #YUS-28350", date: "2026-06-16" },
  { id: "wt2", type: "debit", amount: 20.0, description: "Order #YUS-28491", date: "2026-06-18" },
  { id: "wt3", type: "credit", amount: 10.0, description: "Campaign Reward", date: "2026-06-14" },
];

export const loyaltyTransactions: LoyaltyTransaction[] = [
  { id: "lt1", type: "earn", points: 130, description: "Order #YUS-28491", date: "2026-06-18" },
  { id: "lt2", type: "earn", points: 245, description: "Order #YUS-28350", date: "2026-06-15" },
  { id: "lt3", type: "redeem", points: -100, description: "Checkout discount", date: "2026-06-10" },
];

export function getProductById(id: string) {
  return products.find((p) => p.id === id);
}

export function getProductBySlug(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getPharmacyById(id: string) {
  return pharmacies.find((p) => p.id === id);
}

export function getPharmacyBySlug(slug: string) {
  return pharmacies.find((p) => p.slug === slug);
}

export function getCategoryBySlug(slug: string) {
  return categories.find((c) => c.slug === slug);
}

export function getProductsByPharmacy(pharmacyId: string) {
  return products.filter((p) => p.pharmacyId === pharmacyId);
}

export function getProductsByCategory(categoryId: string) {
  return products.filter((p) => p.categoryId === categoryId);
}
