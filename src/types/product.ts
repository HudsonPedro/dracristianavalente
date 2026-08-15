export type PriceVisibility =
  | "SHOW_PRICE"
  | "HIDE_PRICE"
  | "CONTACT_FOR_PRICE"
  | "REQUIRES_EVALUATION"
  | "REQUIRES_PROTOCOL";

export type ProductStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "DRAFT"
  | "OUT_OF_STOCK";

export type ProductAvailability =
  | "AVAILABLE"
  | "UNAVAILABLE"
  | "UNDER_CONSULTATION";

export type Product = {
  id: string;

  name: string;
  slug: string;
  sku?: string;

  brand: string;
  manufacturer?: string;

  categoryId: string;

  shortDescription: string;
  description?: string;

  images: string[];
  videos?: string[];

  price?: number;
  promotionalPrice?: number;

  priceVisibility: PriceVisibility;

  saleEnabled: boolean;
  requiresEvaluation: boolean;
  requiresProtocol: boolean;

  professionalProduct: boolean;
  homeCare: boolean;

  stock?: number;
  stockEnabled: boolean;

  availability: ProductAvailability;

  weight?: number;

  dimensions?: {
    width?: number;
    height?: number;
    length?: number;
  };

  usageInstructions?: string;
  composition?: string;
  warnings?: string;

  relatedProductIds?: string[];
  relatedProtocolIds?: string[];

  badge?: string;

  status: ProductStatus;

  seo?: {
    title?: string;
    description?: string;
    canonical?: string;
    socialImage?: string;
  };
};
