import { getProductById, getPharmacyById } from "@/lib/mock-data";

export enum AllocationStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  PARTIAL = "PARTIAL",
  REJECTED = "REJECTED",
}

export type AllocationItem = {
  productId: string;
  productName: string;
  productNameAr: string;
  price: number;
  image: string;
  pharmacyId: string;
  pharmacyName: string;
  pharmacyNameAr: string;
  requestedQty: number;
  allocatedQty: string | number; // "?", "*", or number
  status: AllocationStatus;
  substitute?: {
    productId: string;
    name: string;
    nameAr: string;
    price: number;
    image: string;
  } | null;
  substitutes?: Array<{
    productId: string;
    name: string;
    nameAr: string;
    price: number;
    image: string;
  }>;
  rejectionReason?: string;
  rejectionReasonAr?: string;
};

export type ScenarioDefinition = {
  id: string;
  name: string;
  nameAr: string;
  items: Array<{ productId: string; quantity: number }>;
  allocations: AllocationItem[];
};

export function evaluateAllocation(requested: number, allocation: string | number | null | undefined): AllocationStatus {
  if (allocation === null || allocation === undefined || allocation === "?" || allocation === "") {
    return AllocationStatus.PENDING;
  }
  if (allocation === "*") {
    return AllocationStatus.REJECTED; // Corrected: * represents Fully Rejected
  }
  const allocNum = typeof allocation === "number" ? allocation : parseInt(String(allocation), 10);
  if (isNaN(allocNum)) {
    return AllocationStatus.PENDING;
  }
  if (allocNum === 0) {
    return AllocationStatus.REJECTED;
  }
  if (allocNum >= requested) {
    return AllocationStatus.APPROVED;
  }
  if (allocNum < requested) {
    return AllocationStatus.PARTIAL;
  }
  return AllocationStatus.PENDING;
}

export const SCENARIOS: ScenarioDefinition[] = [
  {
    id: "scenario-1",
    name: "Scenario 1 — Full Approval",
    nameAr: "السيناريو 1 — موافقة كاملة",
    items: [
      { productId: "pr1", quantity: 1 },
      { productId: "pr2", quantity: 2 }
    ],
    allocations: [
      {
        productId: "pr1",
        productName: "Body & Hair Care Oils Collection",
        productNameAr: "مجموعة زيوت العناية بالجسم والشعر",
        price: 68.0,
        image: "/images/products/product-1.jpg",
        pharmacyId: "p1",
        pharmacyName: "Nahdi Pharmacy",
        pharmacyNameAr: "صيدلية النهدي",
        requestedQty: 1,
        allocatedQty: 1,
        status: AllocationStatus.APPROVED
      },
      {
        productId: "pr2",
        productName: "Keune Satin Oil Shampoo",
        productNameAr: "كيون ساتين أويل شامبو",
        price: 95.0,
        image: "/images/products/product-2.jpg",
        pharmacyId: "p1",
        pharmacyName: "Nahdi Pharmacy",
        pharmacyNameAr: "صيدلية النهدي",
        requestedQty: 2,
        allocatedQty: 2,
        status: AllocationStatus.APPROVED
      }
    ]
  },
  {
    id: "scenario-2",
    name: "Scenario 2 — Partial Rejection",
    nameAr: "السيناريو 2 — رفض جزئي",
    items: [
      { productId: "pr1", quantity: 1 },
      { productId: "pr9", quantity: 1 }
    ],
    allocations: [
      {
        productId: "pr1",
        productName: "Body & Hair Care Oils Collection",
        productNameAr: "مجموعة زيوت العناية بالجسم والشعر",
        price: 68.0,
        image: "/images/products/product-1.jpg",
        pharmacyId: "p1",
        pharmacyName: "Nahdi Pharmacy",
        pharmacyNameAr: "صيدلية النهدي",
        requestedQty: 1,
        allocatedQty: 1,
        status: AllocationStatus.APPROVED
      },
      {
        productId: "pr9",
        productName: "Cetaphil Daily Hydrating Lotion",
        productNameAr: "سيتافيل لوشن الترطيب اليومي",
        price: 89.0,
        image: "/images/products/product-3.jpg",
        pharmacyId: "p5",
        pharmacyName: "Whites Pharmacy",
        pharmacyNameAr: "صيدلية وايتس",
        requestedQty: 1,
        allocatedQty: 0,
        status: AllocationStatus.REJECTED,
        rejectionReason: "Out of stock",
        rejectionReasonAr: "غير متوفر في المخزون"
      }
    ]
  },
  {
    id: "scenario-3",
    name: "Scenario 3 — Partial Allocation",
    nameAr: "السيناريو 3 — توزيع جزئي",
    items: [
      { productId: "pr7", quantity: 10 }
    ],
    allocations: [
      {
        productId: "pr7",
        productName: "Jamieson Vitamin C 1000mg",
        productNameAr: "جاميسون فيتامين سي 1000 مجم",
        price: 55.0,
        image: "/images/products/product-7.jpg",
        pharmacyId: "p4",
        pharmacyName: "United Pharmacy",
        pharmacyNameAr: "صيدلية المتحدة",
        requestedQty: 10,
        allocatedQty: 4,
        status: AllocationStatus.PARTIAL
      }
    ]
  },
  {
    id: "scenario-4",
    name: "Scenario 4 — Rejected with Replacements",
    nameAr: "السيناريو 4 — مرفوض مع بدائل",
    items: [
      { productId: "pr10", quantity: 1 }
    ],
    allocations: [
      {
        productId: "pr10",
        productName: "Advil Liqui-Gels Pain Reliever",
        productNameAr: "أدفيل كبسولات مسكن للآلام",
        price: 35.0,
        image: "/images/products/product-6.jpg",
        pharmacyId: "p5",
        pharmacyName: "Whites Pharmacy",
        pharmacyNameAr: "صيدلية وايتس",
        requestedQty: 1,
        allocatedQty: 0,
        status: AllocationStatus.REJECTED,
        rejectionReason: "Out of stock",
        rejectionReasonAr: "غير متوفر في المخزون",
        substitutes: [
          {
            productId: "sub-seven-seas",
            name: "Seven Seas Cod Liver Oil",
            nameAr: "زيت كبد السمك سفن سيز",
            price: 45.0,
            image: "/images/products/product-7.jpg"
          },
          {
            productId: "sub-centrum",
            name: "Centrum Adults Multivitamin",
            nameAr: "سنتروم فيتامينات متعددة للبالغين",
            price: 85.0,
            image: "/images/products/product-7.jpg"
          }
        ]
      }
    ]
  },
  {
    id: "scenario-5",
    name: "Scenario 5 — Partial Allocation with Replacements",
    nameAr: "السيناريو 5 — توزيع جزئي مع بدائل",
    items: [
      { productId: "pr7", quantity: 5 }
    ],
    allocations: [
      {
        productId: "pr7",
        productName: "Jamieson Vitamin C 1000mg",
        productNameAr: "جاميسون فيتامين سي 1000 مجم",
        price: 55.0,
        image: "/images/products/product-7.jpg",
        pharmacyId: "p4",
        pharmacyName: "United Pharmacy",
        pharmacyNameAr: "صيدلية المتحدة",
        requestedQty: 5,
        allocatedQty: 2,
        status: AllocationStatus.PARTIAL,
        substitutes: [
          {
            productId: "sub-seven-seas",
            name: "Seven Seas Cod Liver Oil",
            nameAr: "زيت كبد السمك سفن سيز",
            price: 45.0,
            image: "/images/products/product-7.jpg"
          },
          {
            productId: "sub-centrum",
            name: "Centrum Adults Multivitamin",
            nameAr: "سنتروم فيتامينات متعددة للبالغين",
            price: 85.0,
            image: "/images/products/product-7.jpg"
          }
        ]
      }
    ]
  },
  {
    id: "scenario-6",
    name: "Scenario 6 — Reject All Replacements",
    nameAr: "السيناريو 6 — رفض جميع البدائل",
    items: [
      { productId: "pr10", quantity: 1 }
    ],
    allocations: [
      {
        productId: "pr10",
        productName: "Advil Liqui-Gels Pain Reliever",
        productNameAr: "أدفيل كبسولات مسكن للآلام",
        price: 35.0,
        image: "/images/products/product-6.jpg",
        pharmacyId: "p5",
        pharmacyName: "Whites Pharmacy",
        pharmacyNameAr: "صيدلية وايتس",
        requestedQty: 1,
        allocatedQty: 0,
        status: AllocationStatus.REJECTED,
        rejectionReason: "Out of stock",
        rejectionReasonAr: "غير متوفر في المخزون",
        substitutes: [
          {
            productId: "sub-seven-seas",
            name: "Seven Seas Cod Liver Oil",
            nameAr: "زيت كبد السمك سفن سيز",
            price: 45.0,
            image: "/images/products/product-7.jpg"
          },
          {
            productId: "sub-centrum",
            name: "Centrum Adults Multivitamin",
            nameAr: "سنتروم فيتامينات متعددة للبالغين",
            price: 85.0,
            image: "/images/products/product-7.jpg"
          }
        ]
      }
    ]
  },
  {
    id: "scenario-7",
    name: "Scenario 7 — Entire Order Rejected",
    nameAr: "السيناريو 7 — رفض الطلب بالكامل",
    items: [
      { productId: "pr10", quantity: 1 }
    ],
    allocations: [
      {
        productId: "pr10",
        productName: "Advil Liqui-Gels Pain Reliever",
        productNameAr: "أدفيل كبسولات مسكن للآلام",
        price: 35.0,
        image: "/images/products/product-6.jpg",
        pharmacyId: "p5",
        pharmacyName: "Whites Pharmacy",
        pharmacyNameAr: "صيدلية وايتس",
        requestedQty: 1,
        allocatedQty: "*", // Fully Rejected
        status: AllocationStatus.REJECTED,
        rejectionReason: "Out of stock",
        rejectionReasonAr: "غير متوفر في المخزون",
        substitutes: []
      }
    ]
  },
  {
    id: "scenario-8",
    name: "Scenario 8 — Mixed Order",
    nameAr: "السيناريو 8 — طلب مختلط",
    items: [
      { productId: "pr1", quantity: 3 },
      { productId: "pr7", quantity: 5 },
      { productId: "pr10", quantity: 1 }
    ],
    allocations: [
      {
        productId: "pr1",
        productName: "Body & Hair Care Oils Collection",
        productNameAr: "مجموعة زيوت العناية بالجسم والشعر",
        price: 68.0,
        image: "/images/products/product-1.jpg",
        pharmacyId: "p1",
        pharmacyName: "Nahdi Pharmacy",
        pharmacyNameAr: "صيدلية النهدي",
        requestedQty: 3,
        allocatedQty: 3,
        status: AllocationStatus.APPROVED
      },
      {
        productId: "pr7",
        productName: "Jamieson Vitamin C 1000mg",
        productNameAr: "جاميسون فيتامين سي 1000 مجم",
        price: 55.0,
        image: "/images/products/product-7.jpg",
        pharmacyId: "p4",
        pharmacyName: "United Pharmacy",
        pharmacyNameAr: "صيدلية المتحدة",
        requestedQty: 5,
        allocatedQty: 2,
        status: AllocationStatus.PARTIAL,
        substitutes: [
          {
            productId: "sub-seven-seas",
            name: "Seven Seas Cod Liver Oil",
            nameAr: "زيت كبد السمك سفن سيز",
            price: 45.0,
            image: "/images/products/product-7.jpg"
          },
          {
            productId: "sub-centrum",
            name: "Centrum Adults Multivitamin",
            nameAr: "سنتروم فيتامينات متعددة للبالغين",
            price: 85.0,
            image: "/images/products/product-7.jpg"
          }
        ]
      },
      {
        productId: "pr10",
        productName: "Advil Liqui-Gels Pain Reliever",
        productNameAr: "أدفيل كبسولات مسكن للآلام",
        price: 35.0,
        image: "/images/products/product-6.jpg",
        pharmacyId: "p5",
        pharmacyName: "Whites Pharmacy",
        pharmacyNameAr: "صيدلية وايتس",
        requestedQty: 1,
        allocatedQty: 0,
        status: AllocationStatus.REJECTED,
        rejectionReason: "Out of stock",
        rejectionReasonAr: "غير متوفر في المخزون",
        substitutes: [
          {
            productId: "sub-seven-seas",
            name: "Seven Seas Cod Liver Oil",
            nameAr: "زيت كبد السمك سفن سيز",
            price: 45.0,
            image: "/images/products/product-7.jpg"
          }
        ]
      }
    ]
  }
];

export function getMockAllocations(cartItems: { productId: string; quantity: number }[]): AllocationItem[] {
  return cartItems.map((item) => {
    const product = getProductById(item.productId);
    if (!product) {
      return {
        productId: item.productId,
        productName: "Unknown Product",
        productNameAr: "منتج غير معروف",
        price: 0,
        image: "",
        pharmacyId: "unknown",
        pharmacyName: "Unknown Pharmacy",
        pharmacyNameAr: "صيدلية غير معروفة",
        requestedQty: item.quantity,
        allocatedQty: item.quantity,
        status: AllocationStatus.APPROVED,
      };
    }

    const pharmacy = getPharmacyById(product.pharmacyId);
    const pharmacyName = pharmacy?.name ?? "Pharmacy";
    const pharmacyNameAr = pharmacy?.nameAr ?? "صيدلية";

    let allocatedQty: string | number = item.quantity;
    let status = AllocationStatus.APPROVED;
    let substitutes = undefined;
    let rejectionReason = "";
    let rejectionReasonAr = "";

    // Simulate based on pharmacyId or product id
    if (product.pharmacyId === "p1") {
      allocatedQty = item.quantity;
      status = AllocationStatus.APPROVED;
    } else if (product.pharmacyId === "p4") {
      const requested = item.quantity;
      allocatedQty = Math.max(1, Math.floor(requested / 2));
      status = AllocationStatus.PARTIAL;
    } else if (product.pharmacyId === "p5") {
      allocatedQty = 0;
      status = AllocationStatus.REJECTED;
      rejectionReason = "Out of stock";
      rejectionReasonAr = "غير متوفر في المخزون";

      substitutes = [
        {
          productId: "sub-seven-seas",
          name: "Seven Seas Cod Liver Oil",
          nameAr: "زيت كبد السمك سفن سيز",
          price: 45.0,
          image: "/images/products/product-7.jpg",
        },
        {
          productId: "sub-centrum",
          name: "Centrum Adults Multivitamin",
          nameAr: "سنتروم فيتامينات متعددة للبالغين",
          price: 85.0,
          image: "/images/products/product-7.jpg",
        }
      ];
    } else {
      allocatedQty = item.quantity;
      status = AllocationStatus.APPROVED;
    }

    return {
      productId: item.productId,
      productName: product.name,
      productNameAr: product.nameAr,
      price: product.price,
      image: product.image,
      pharmacyId: product.pharmacyId,
      pharmacyName,
      pharmacyNameAr,
      requestedQty: item.quantity,
      allocatedQty,
      status,
      substitute: substitutes ? substitutes[0] : null,
      substitutes,
      rejectionReason,
      rejectionReasonAr,
    };
  });
}
