export type SearchFilters = {
  query?: string;
  category?: string;
  pharmacy?: string;
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  sortBy?: "relevance" | "price_low" | "price_high" | "rating";
};
