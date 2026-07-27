"use client";

import * as React from "react";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";

export interface CurrencyProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  className?: string;
}

export function Currency({ size = 16, className, style, ...props }: CurrencyProps) {
  // ViewBox: 0 0 31 35. Maintain original aspect ratio if size is a number
  const parsedSize = typeof size === "number" ? size : parseFloat(size);
  const height = size;
  const width = isNaN(parsedSize) ? size : (parsedSize * 31) / 35;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 31 35"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("inline-block align-middle select-none text-[#5F2BAD]", className)}
      style={style}
      {...props}
    >
      <path
        d="M30.9756 28.1826C30.8353 29.5773 30.4706 30.9076 29.918 32.1328L18.2207 34.6201C18.3607 33.2253 18.7256 31.8946 19.2783 30.6689L30.9756 28.1826ZM14.5752 16.7695L18.2188 15.9951V4.88086C19.2267 3.64999 20.4671 2.6062 21.8633 1.82227V15.2197L30.9746 13.2832C30.8346 14.678 30.4697 16.009 29.917 17.2344L21.8633 18.9453V22.6709L30.9756 20.7334C30.8356 22.1281 30.4697 23.4583 29.917 24.6836V24.6826L18.2188 27.1709V19.7197L14.5752 20.4941V24.627C14.5752 25.0044 14.4603 25.3549 14.2637 25.6455L12.3682 28.4561C11.8981 29.1405 11.1752 29.6375 10.334 29.8125L0 32.0088C0.139988 30.6141 0.504954 29.2838 1.05762 28.0586L10.9307 25.9609V21.2686L1.71875 23.2266C1.85902 21.8318 2.22463 20.5017 2.77734 19.2764L10.9307 17.5439V3.05859C11.9386 1.82772 13.179 0.783658 14.5752 0V16.7695Z"
        fill="currentColor"
      />
    </svg>
  );
}

export interface PriceProps {
  amount: number;
  className?: string;
  size?: number | string;
  currencySize?: number | string;
  iconClassName?: string;
  amountClassName?: string;
  showCurrency?: boolean;
}

export function Price({
  amount,
  className,
  size,
  currencySize,
  iconClassName,
  amountClassName,
  showCurrency = true,
}: PriceProps) {
  const locale = useLocale();

  const formattedAmount = new Intl.NumberFormat(locale === "ar" ? "ar-SA" : "en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  // For Arabic locale, we place the currency icon after the amount (right side)
  // For English, we place the currency icon before the amount (left side)
  const isRtl = locale === "ar";

  // Calculate default icon size based on font size or prop
  const resolvedIconSize = currencySize || (size ? `calc(${typeof size === "number" ? `${size}px` : size} * 0.8)` : 14);

  return (
    <span
      className={cn("inline-flex items-center gap-1 font-bold", className)}
      style={size ? { fontSize: size } : undefined}
    >
      {isRtl ? (
        <>
          <span className={amountClassName}>{formattedAmount}</span>
          {showCurrency && (
            <Currency
              size={resolvedIconSize}
              className={cn("shrink-0", iconClassName)}
            />
          )}
        </>
      ) : (
        <>
          {showCurrency && (
            <Currency
              size={resolvedIconSize}
              className={cn("shrink-0", iconClassName)}
            />
          )}
          <span className={amountClassName}>{formattedAmount}</span>
        </>
      )}
    </span>
  );
}
