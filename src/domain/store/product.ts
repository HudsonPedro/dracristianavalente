export type ProductStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "DRAFT";

export type ProductAvailability =
  | "AVAILABLE"
  | "UNAVAILABLE"
  | "UNDER_CONSULTATION";

export type ProductPriceVisibility =
  | "SHOW_PRICE"
  | "HIDE_PRICE"
  | "CONTACT_FOR_PRICE"
  | "REQUIRES_EVALUATION"
  | "REQUIRES_PROTOCOL";

export type ProductUsageType =
  | "PROFESSIONAL"
  | "HOME_CARE"
  | "PROFESSIONAL_AND_HOME_CARE";

export type StoreProductImage = {
  id: string;
  url: string;
  alt: string;
  position: number;
  main: boolean;
};

export type StoreProductIngredient = {
  id: string;
  name: string;
  description?: string;
};

export type StoreProductComponent = {
  id: string;
  name: string;
  description?: string;
};

export type StoreProductBenefit = {
  id: string;
  title: string;
  description?: string;
};

export type StoreProductSeo = {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
};

export type StoreProduct = {
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

  ingredients: StoreProductIngredient[];
  components: StoreProductComponent[];
  benefits: StoreProductBenefit[];

  usageInstructions?: string;

  images: StoreProductImage[];

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

  seo?: StoreProductSeo;

  status: ProductStatus;

  createdAt?: string;
  updatedAt?: string;
};
