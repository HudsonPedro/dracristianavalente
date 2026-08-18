import { products } from "../../data/products";
import { mapCatalogProductToStoreProduct } from "../../data/store-product-mapper";

import type { StoreProduct } from "../../domain/store/product";

import { productService } from "./product-service.server";

export type StoreProductSeedResult = {
  total: number;
  created: number;
  updated: number;
  unchanged: number;
};

type SeedSafePatch = Pick<
  StoreProduct,
  | "name"
  | "slug"
  | "brand"
  | "categoryIds"
  | "usageType"
  | "shortDescription"
  | "ingredients"
  | "components"
  | "benefits"
  | "images"
  | "priceVisibility"
  | "requiresEvaluation"
  | "requiresProtocol"
  | "professionalProduct"
  | "homeCare"
  | "displayOrder"
> &
  Partial<
    Pick<
      StoreProduct,
      | "manufacturer"
      | "line"
      | "categoryId"
      | "description"
      | "usageInstructions"
      | "badge"
      | "officialSource"
      | "seo"
    >
  >;

function createSafePatch(
  product: StoreProduct,
): SeedSafePatch {
  return {
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

    ...(product.categoryId
      ? {
          categoryId:
            product.categoryId,
        }
      : {}),

    categoryIds:
      product.categoryIds,

    usageType:
      product.usageType,

    shortDescription:
      product.shortDescription,

    ...(product.description
      ? {
          description:
            product.description,
        }
      : {}),

    ingredients:
      product.ingredients,

    components:
      product.components,

    benefits:
      product.benefits,

    ...(product.usageInstructions
      ? {
          usageInstructions:
            product.usageInstructions,
        }
      : {}),

    images:
      product.images,

    priceVisibility:
      product.priceVisibility,

    requiresEvaluation:
      product.requiresEvaluation,

    requiresProtocol:
      product.requiresProtocol,

    professionalProduct:
      product.professionalProduct,

    homeCare:
      product.homeCare,

    ...(product.badge
      ? {
          badge:
            product.badge,
        }
      : {}),

    displayOrder:
      product.displayOrder,

    ...(product.officialSource
      ? {
          officialSource:
            product.officialSource,
        }
      : {}),

    ...(product.seo
      ? {
          seo:
            product.seo,
        }
      : {}),
  };
}

function currentSafeValues(
  product: StoreProduct,
): SeedSafePatch {
  return createSafePatch(product);
}

function hasChanges(
  current: StoreProduct,
  next: StoreProduct,
): boolean {
  return (
    JSON.stringify(
      currentSafeValues(current),
    ) !==
    JSON.stringify(
      createSafePatch(next),
    )
  );
}

export async function seedStoreProducts(): Promise<StoreProductSeedResult> {
  const result: StoreProductSeedResult = {
    total: products.length,
    created: 0,
    updated: 0,
    unchanged: 0,
  };

  for (
    let index = 0;
    index < products.length;
    index += 1
  ) {
    const catalogProduct =
      products[index];

    if (!catalogProduct) {
      continue;
    }

    const storeProduct =
      mapCatalogProductToStoreProduct(
        catalogProduct,
        index + 1,
      );

    const current =
      await productService.getById(
        storeProduct.id,
      );

    if (!current) {
      await productService.create(
        storeProduct,
      );

      result.created += 1;

      continue;
    }

    if (
      !hasChanges(
        current,
        storeProduct,
      )
    ) {
      result.unchanged += 1;

      continue;
    }

    await productService.update(
      storeProduct.id,
      createSafePatch(
        storeProduct,
      ),
    );

    result.updated += 1;
  }

  return result;
}
