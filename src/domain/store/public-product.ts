import type {
  ProductAvailability,
  ProductPriceVisibility,
  ProductUsageType,
} from "./product";

export type PublicProductIngredient = {
  id: string;
  name: string;
  description?: string;
};

export type PublicProductComponent = {
  id: string;
  name: string;
  description?: string;
};

export type PublicProductBenefit = {
  id: string;
  title: string;
  description?: string;
};

export type PublicProductImage = {
  id: string;
  url: string;
  alt: string;
  position: number;
  main: boolean;
};

export type PublicProductSeo = {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
};

export type PublicProduct = {
  id: string;
  name: string;
  slug: string;
  brand: string;
  manufacturer?: string;
  line?: string;
  categoryId?: string;
  categoryIds: string[];
  usageType: ProductUsageType;
  shortDescription: string;
  description?: string;
  ingredients: PublicProductIngredient[];
  components: PublicProductComponent[];
  benefits: PublicProductBenefit[];
  usageInstructions?: string;
  images: PublicProductImage[];
  price?: number;
  promotionalPrice?: number;
  priceVisibility: ProductPriceVisibility;
  saleEnabled: boolean;
  requiresEvaluation: boolean;
  requiresProtocol: boolean;
  professionalProduct: boolean;
  homeCare: boolean;
  availability: ProductAvailability;
  badge?: string;
  featured: boolean;
  displayOrder: number;
  officialSource?: string;
  seo?: PublicProductSeo;
};
