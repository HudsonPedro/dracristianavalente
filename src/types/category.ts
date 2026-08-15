export type ProductCategory = {
  id: string;

  name: string;
  slug: string;

  description?: string;

  image?: string;

  active: boolean;

  order: number;

  seo?: {
    title?: string;
    description?: string;
    canonical?: string;
    socialImage?: string;
  };
};
