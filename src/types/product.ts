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
   * Categoria usada pelos filtros da loja.
   */
  categoryId: string;

  /**
   * Linha oficial à qual o produto pertence.
   * Ex.: Bio Smart, Shaft Care, Monodoses.
   */
  line?: string;

  /**
   * Classificação apresentada pela DNA VITAL.
   */
  usageType?: "PROFESSIONAL" | "HOME_CARE";

  shortDescription: string;
  description?: string;

  /**
   * Características e benefícios divulgados
   * oficialmente para a linha/produto.
   */
  benefits?: ProductBenefit[];

  /**
   * Ativos principais divulgados oficialmente.
   */
  activeIngredients?: ProductActive[];

  /**
   * Componentes individuais de uma linha.
   *
   * Ex. Shaft Care Home Care:
   * Shampoo, Condicionador e Leave-in.
   *
   * Ex. Linha de Crescimento:
   * Regenerador Homeostático,
   * Redutor de Queda,
   * Estimulador de Crescimento.
   */
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

  /**
   * Preencher somente quando houver
   * orientação oficial/autorizada.
   */
  usageInstructions?: string;

  /**
   * Campo mantido para composição completa,
   * quando essa informação estiver disponível.
   */
  composition?: string;

  warnings?: string;

  relatedProductIds?: string[];
  relatedProtocolIds?: string[];

  badge?: string;

  /**
   * URL da fonte oficial usada para
   * conferência das informações.
   */
  officialSource?: string;

  status: ProductStatus;

  seo?: {
    title?: string;
    description?: string;
    canonical?: string;
    socialImage?: string;
  };
};
