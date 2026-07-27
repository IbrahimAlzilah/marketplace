import { CheckoutLine, ResolvedItem } from "../types/checkout.types";

export function getLineTotalPrice(line: CheckoutLine): number {
  if (line.resolution === "removed") return 0;

  const allocQty = typeof line.allocatedQty === "number"
    ? line.allocatedQty
    : parseInt(String(line.allocatedQty), 10) || 0;

  if (line.resolution === "approved") {
    return line.price * line.requestedQty;
  }
  if (line.resolution === "accepted_partial") {
    return line.price * allocQty;
  }
  if (line.resolution === "accepted_substitute" && line.selectedSubstitute) {
    return line.selectedSubstitute.price * line.requestedQty;
  }
  if (line.resolution === "accepted_partial_and_substitute" && line.selectedSubstitute) {
    const remainingQty = line.requestedQty - allocQty;
    return (line.price * allocQty) + (line.selectedSubstitute.price * remainingQty);
  }

  return line.price * line.requestedQty;
}

export function getResolvedItems(lines: CheckoutLine[]): ResolvedItem[] {
  const items: ResolvedItem[] = [];
  lines.forEach((line) => {
    if (line.resolution === "removed") return;

    const allocQty = typeof line.allocatedQty === "number"
      ? line.allocatedQty
      : parseInt(String(line.allocatedQty), 10) || 0;

    if (line.resolution === "approved") {
      items.push({
        productId: line.productId,
        name: line.productName,
        nameAr: line.productNameAr,
        qty: line.requestedQty,
        price: line.price,
        image: line.image,
        pharmacyName: line.pharmacyName,
        pharmacyNameAr: line.pharmacyNameAr,
      });
    } else if (line.resolution === "accepted_partial") {
      items.push({
        productId: line.productId,
        name: line.productName,
        nameAr: line.productNameAr,
        qty: allocQty,
        price: line.price,
        image: line.image,
        pharmacyName: line.pharmacyName,
        pharmacyNameAr: line.pharmacyNameAr,
      });
    } else if (line.resolution === "accepted_substitute" && line.selectedSubstitute) {
      items.push({
        productId: line.selectedSubstitute.productId,
        name: line.selectedSubstitute.name,
        nameAr: line.selectedSubstitute.nameAr,
        qty: line.requestedQty,
        price: line.selectedSubstitute.price,
        image: line.selectedSubstitute.image,
        pharmacyName: line.pharmacyName,
        pharmacyNameAr: line.pharmacyNameAr,
      });
    } else if (line.resolution === "accepted_partial_and_substitute" && line.selectedSubstitute) {
      if (allocQty > 0) {
        items.push({
          productId: line.productId,
          name: line.productName,
          nameAr: line.productNameAr,
          qty: allocQty,
          price: line.price,
          image: line.image,
          pharmacyName: line.pharmacyName,
          pharmacyNameAr: line.pharmacyNameAr,
        });
      }
      const remainingQty = line.requestedQty - allocQty;
      if (remainingQty > 0) {
        items.push({
          productId: line.selectedSubstitute.productId,
          name: line.selectedSubstitute.name,
          nameAr: line.selectedSubstitute.nameAr,
          qty: remainingQty,
          price: line.selectedSubstitute.price,
          image: line.selectedSubstitute.image,
          pharmacyName: line.pharmacyName,
          pharmacyNameAr: line.pharmacyNameAr,
        });
      }
    } else {
      items.push({
        productId: line.productId,
        name: line.productName,
        nameAr: line.productNameAr,
        qty: line.requestedQty,
        price: line.price,
        image: line.image,
        pharmacyName: line.pharmacyName,
        pharmacyNameAr: line.pharmacyNameAr,
      });
    }
  });

  return items;
}
