import { getProductById, getPharmacyById } from "./mock-data";

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
  rejectionReason?: string;
  rejectionReasonAr?: string;
};

export function evaluateAllocation(requested: number, allocation: string | number | null | undefined): AllocationStatus {
  if (allocation === null || allocation === undefined || allocation === "?") {
    return AllocationStatus.PENDING;
  }
  if (allocation === "*") {
    return AllocationStatus.APPROVED;
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
    let substitute = null;
    let rejectionReason = "";
    let rejectionReasonAr = "";

    // Simulate based on pharmacyId or product id
    if (product.pharmacyId === "p1") {
      // Nahdi Pharmacy - Case B/C (Approved)
      // Alternate for variety
      if (product.id === "pr1") {
        allocatedQty = "*"; // Case B
      } else {
        allocatedQty = item.quantity; // Case C
      }
      status = AllocationStatus.APPROVED;
    } else if (product.pharmacyId === "p4") {
      // United Pharmacy - Case D (Partial)
      const requested = item.quantity;
      const effectiveRequested = requested === 1 ? 2 : requested;
      allocatedQty = Math.max(1, Math.floor(effectiveRequested / 2));
      status = AllocationStatus.PARTIAL;
    } else if (product.pharmacyId === "p5") {
      // Whites Pharmacy - Case E (Rejected)
      allocatedQty = 0;
      status = AllocationStatus.REJECTED;
      rejectionReason = "Out of stock";
      rejectionReasonAr = "غير متوفر في المخزون";

      if (product.id === "pr10") {
        substitute = {
          productId: "pr5", // Suggest Prof Cold & Flu Tablets
          name: "Seven Seas Cod Liver Oil", // Keep labels consistent with translations/mock modal
          nameAr: "زيت كبد السمك سفن سيز",
          price: 129.35,
          image: "/images/products/product-7.jpg",
        };
      } else {
        substitute = {
          productId: "pr7", // Suggest Jamieson Vitamin C
          name: "Centrum Adults Multivitamin",
          nameAr: "سنتروم فيتامينات متعددة للبالغين",
          price: 129.35,
          image: "/images/products/product-7.jpg",
        };
      }
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
      requestedQty: product.pharmacyId === "p4" && item.quantity === 1 ? 2 : item.quantity,
      allocatedQty,
      status,
      substitute,
      rejectionReason,
      rejectionReasonAr,
    };
  });
}
