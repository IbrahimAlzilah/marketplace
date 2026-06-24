import Image from "next/image";
import { cn } from "@/lib/utils";

type MarketplaceImageProps = {
  src: string;
  alt: string;
  /** cover = fill container (banners, pharmacy covers); contain = show full image (products) */
  fit?: "cover" | "contain";
  className?: string;
  containerClassName?: string;
  priority?: boolean;
  sizes?: string;
};

export function MarketplaceImage({
  src,
  alt,
  fit = "contain",
  className,
  containerClassName,
  priority,
  sizes = "100vw",
}: MarketplaceImageProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-muted",
        fit === "contain" && "bg-white dark:bg-muted/40",
        containerClassName
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className={cn(
          fit === "cover" ? "object-cover" : "object-contain p-2 sm:p-3",
          className
        )}
      />
    </div>
  );
}
