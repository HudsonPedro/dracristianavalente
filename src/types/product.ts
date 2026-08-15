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

export type ProductComponent = {
  id: string;
  name: string;
  description?: string;
};

export type ProductActive = {
  name: string;
  description?: string;
};

export type ProductBenefit = {
  title: string;
  description?: string;
};

export type Product = {
  id: string;

  name: string;
  slug: string;
  sku?: string;

  brand: string;
  manufacturer?: string;

  /**
   * Categoria principal.
   * Mantida para compatibilidade e organização administrativa.
   */
  categoryId: string;

  /**
   * Todas as categorias nas quais o produto deve aparecer.
   *
   * Exemplo:
   * ["crescimento", "controle-queda", "couro-cabeludo"]
   */
  categoryIds: string[];

  /**
   * Linha oficial DNA VITAL.
   */
  line?: string;

  usageType?: "PROFESSIONAL" | "HOME_CARE";

  shortDescription: string;
  description?: string;

  benefits?: ProductBenefit[];

  activeIngredients?: ProductActive[];

  components?: ProductComponent[];

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

  officialSource?: string;

  status: ProductStatus;

  seo?: {
    title?: string;
    description?: string;
    canonical?: string;
    socialImage?: string;
  };
};
