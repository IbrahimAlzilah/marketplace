export type Category = {
  id: string;
  name: string;
  nameAr: string;
  slug: string;
  icon: string;
  subcategories?: Category[];
};
