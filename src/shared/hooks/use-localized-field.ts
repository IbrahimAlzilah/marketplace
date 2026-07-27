/**
 * useLocalizedField
 *
 * Eliminates the recurring inline ternary pattern:
 *   `locale === "ar" ? item.nameAr : item.name`
 *
 * Usage:
 *   const { getField } = useLocalizedField();
 *   const name = getField(product, "name");   // returns nameAr when locale is "ar"
 *   const desc = getField(product, "description");
 *
 * Alternatively, use the static utility for non-component contexts:
 *   import { getLocalizedName } from "@/shared/hooks/use-localized-field";
 *   const name = getLocalizedName(product, locale);
 */

"use client";

import { useLocale } from "next-intl";

type LocalizedObject = Record<string, unknown>;

/**
 * Returns the localized value for a given base field key.
 * If locale is "ar", returns `item[fieldAr]` if it exists, otherwise falls back to `item[field]`.
 */
export function getLocalizedField<T extends LocalizedObject>(
  item: T,
  field: string,
  locale: string
): string {
  const arKey = `${field}Ar` as keyof T;
  const baseKey = field as keyof T;
  if (locale === "ar" && arKey in item && item[arKey]) {
    return String(item[arKey]);
  }
  return String(item[baseKey] ?? "");
}

/**
 * Convenience shorthand for the most common case: "name" field.
 */
export function getLocalizedName<T extends LocalizedObject>(
  item: T,
  locale: string
): string {
  return getLocalizedField(item, "name", locale);
}

/**
 * React hook that returns a `getField` helper pre-bound to the current locale.
 *
 * @example
 * const { getField, isRtl } = useLocalizedField();
 * const name = getField(product, "name");
 * const description = getField(product, "description");
 */
export function useLocalizedField() {
  const locale = useLocale();
  const isRtl = locale === "ar";

  const getField = <T extends LocalizedObject>(item: T, field: string): string =>
    getLocalizedField(item, field, locale);

  const getName = <T extends LocalizedObject>(item: T): string =>
    getLocalizedField(item, "name", locale);

  return { getField, getName, locale, isRtl };
}
