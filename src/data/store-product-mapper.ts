import type { Product } from "../types/product";

import type {
  ProductStatus,
  ProductUsageType,
  StoreProduct,
  StoreProductBenefit,
  StoreProductImage,
  StoreProductIngredient,
} from "../domain/store/product";

function normalizeStatus(
  status: Product["status"],
): ProductStatus {
  if (status === "OUT_OF_STOCK") {
    return "ACTIVE";
  }

  return status;
}

function normalizeUsageType(
  product: Product,
): ProductUsageType {
  if (
    product.professionalProduct &&
    product.homeCare
  ) {
    return "PROFESSIONAL_AND_HOME_CARE";
  }

  if (product.usageType) {
    return product.usageType;
  }

  if (product.homeCare) {
    return "HOME_CARE";
  }

  return "PROFESSIONAL";
}

function mapIngredients(
  product: Product,
): StoreProductIngredient[] {
  return (product.activeIngredients ?? []).map(
    (ingredient, index) => ({
      id: `${product.id}-ingredient-${index + 1}`,
      name: ingredient.name,
      ...(ingredient.description
        ? {
            description:
              ingredient.description,
          }
        : {}),
    }),
  );
}

function mapBenefits(
  product: Product,
): StoreProductBenefit[] {
  return (product.benefits ?? []).map(
    (benefit, index) => ({
      id: `${product.id}-benefit-${index + 1}`,
      title: benefit.title,
      ...(benefit.description
        ? {
            description:
              benefit.description,
          }
        : {}),
    }),
  );
}

function mapImages(
  product: Product,
): StoreProductImage[] {
  return product.images.map(
    (url, index) => ({
      id: `${product.id}-image-${index + 1}`,
      url,
      alt: product.name,
      position: index,
      main: index === 0,
    }),
  );
}

export function mapCatalogProductToStoreProduct(
  product: Product,
  displayOrder: number,
): StoreProduct {
  return {
    id: product.id,

    name: product.name,
    slug: product.slug,

    brand: product.brand,

    ...(product.manufacturer
      ? {
          manufacturer:
            product.manufacturer,
        }
      : {}),

    ...(product.line
      ? {
          line: product.line,
        }
      : {}),

    categoryId:
      product.categoryId,

    categoryIds:
      product.categoryIds,

    usageType:
      normalizeUsageType(product),

    shortDescription:
      product.shortDescription,

    ...(product.description
      ? {
          description:
            product.description,
        }
      : {}),

    ingredients:
      mapIngredients(product),

    components:
      product.components ?? [],

    benefits:
      mapBenefits(product),

    ...(product.usageInstructions
      ? {
          usageInstructions:
            product.usageInstructions,
        }
      : {}),

    images:
      mapImages(product),

    ...(typeof product.price === "number"
      ? {
          price: product.price,
        }
      : {}),

    ...(typeof product.promotionalPrice ===
    "number"
      ? {
          promotionalPrice:
            product.promotionalPrice,
        }
      : {}),

    priceVisibility:
      product.priceVisibility,

    saleEnabled:
      product.saleEnabled,

    requiresEvaluation:
      product.requiresEvaluation,

    requiresProtocol:
      product.requiresProtocol,

    professionalProduct:
      product.professionalProduct,

    homeCare:
      product.homeCare,

    availability:
      product.availability,

    ...(product.badge
      ? {
          badge: product.badge,
        }
      : {}),

    featured: false,

    displayOrder,

    ...(product.officialSource
      ? {
          officialSource:
            product.officialSource,
        }
      : {}),

    ...(product.seo
      ? {
          seo: {
            ...(product.seo.title
              ? {
                  title:
                    product.seo.title,
                }
              : {}),

            ...(product.seo.description
              ? {
                  description:
                    product.seo.description,
                }
              : {}),

            ...(product.seo.canonical
              ? {
                  canonicalUrl:
                    product.seo.canonical,
                }
              : {}),
          },
        }
      : {}),

    status:
      normalizeStatus(product.status),
  };
}
