import {
  and,
  asc,
  eq,
  ilike,
  or,
  type SQL,
} from "drizzle-orm";

import { getDb } from "../../db";
import {
  productsTable,
  type NewProductRow,
  type ProductRow,
} from "../../db/schema/products";

import type {
  ProductAvailability,
  ProductPriceVisibility,
  ProductStatus,
  ProductUsageType,
  StoreProduct,
  StoreProductBenefit,
  StoreProductComponent,
  StoreProductImage,
  StoreProductIngredient,
  StoreProductSeo,
} from "../../domain/store/product";

import type {
  ProductListFilters,
  ProductRepository,
} from "./product-repository";

function toNumber(value: string | null): number | undefined {
  if (value === null) {
    return undefined;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed)
    ? parsed
    : undefined;
}

function mapRowToProduct(
  row: ProductRow,
): StoreProduct {
  return {
    id: row.id,

    name: row.name,
    slug: row.slug,

    brand: row.brand,

    ...(row.manufacturer !== null
      ? { manufacturer: row.manufacturer }
      : {}),

    ...(row.line !== null
      ? { line: row.line }
      : {}),

    ...(row.categoryId !== null
      ? { categoryId: row.categoryId }
      : {}),

    categoryIds:
      (row.categoryIds as string[]) ?? [],

    usageType:
      row.usageType as ProductUsageType,

    shortDescription:
      row.shortDescription,

    ...(row.description !== null
      ? { description: row.description }
      : {}),

    ingredients:
      (row.ingredients as StoreProductIngredient[]) ??
      [],

    components:
      (row.components as StoreProductComponent[]) ??
      [],

    benefits:
      (row.benefits as StoreProductBenefit[]) ??
      [],

    ...(row.usageInstructions !== null
      ? {
          usageInstructions:
            row.usageInstructions,
        }
      : {}),

    images:
      (row.images as StoreProductImage[]) ?? [],

    ...(toNumber(row.price) !== undefined
      ? {
          price: toNumber(row.price),
        }
      : {}),

    ...(toNumber(row.promotionalPrice) !==
    undefined
      ? {
          promotionalPrice: toNumber(
            row.promotionalPrice,
          ),
        }
      : {}),

    priceVisibility:
      row.priceVisibility as ProductPriceVisibility,

    saleEnabled:
      row.saleEnabled,

    requiresEvaluation:
      row.requiresEvaluation,

    requiresProtocol:
      row.requiresProtocol,

    professionalProduct:
      row.professionalProduct,

    homeCare:
      row.homeCare,

    availability:
      row.availability as ProductAvailability,

    ...(row.badge !== null
      ? { badge: row.badge }
      : {}),

    featured:
      row.featured,

    displayOrder:
      row.displayOrder,

    ...(row.officialSource !== null
      ? {
          officialSource:
            row.officialSource,
        }
      : {}),

    ...(row.seo !== null
      ? {
          seo:
            row.seo as StoreProductSeo,
        }
      : {}),

    status:
      row.status as ProductStatus,

    createdAt:
      row.createdAt.toISOString(),

    updatedAt:
      row.updatedAt.toISOString(),
  };
}

function mapProductToInsert(
  product: StoreProduct,
): NewProductRow {
  return {
    id: product.id,

    name: product.name,
    slug: product.slug,

    brand: product.brand,
    manufacturer:
      product.manufacturer ?? null,
    line:
      product.line ?? null,

    categoryId:
      product.categoryId ?? null,

    categoryIds:
      product.categoryIds,

    usageType:
      product.usageType,

    shortDescription:
      product.shortDescription,

    description:
      product.description ?? null,

    ingredients:
      product.ingredients,

    components:
      product.components,

    benefits:
      product.benefits,

    usageInstructions:
      product.usageInstructions ?? null,

    images:
      product.images,

    price:
      product.price !== undefined
        ? String(product.price)
        : null,

    promotionalPrice:
      product.promotionalPrice !== undefined
        ? String(product.promotionalPrice)
        : null,

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

    badge:
      product.badge ?? null,

    featured:
      product.featured,

    displayOrder:
      product.displayOrder,

    officialSource:
      product.officialSource ?? null,

    seo:
      product.seo ?? null,

    status:
      product.status,

    createdAt:
      product.createdAt
        ? new Date(product.createdAt)
        : new Date(),

    updatedAt:
      product.updatedAt
        ? new Date(product.updatedAt)
        : new Date(),
  };
}

function mapProductPatch(
  product: Partial<StoreProduct>,
): Partial<NewProductRow> {
  const patch: Partial<NewProductRow> = {
    updatedAt: new Date(),
  };

  if (product.name !== undefined) {
    patch.name = product.name;
  }

  if (product.slug !== undefined) {
    patch.slug = product.slug;
  }

  if (product.brand !== undefined) {
    patch.brand = product.brand;
  }

  if (product.manufacturer !== undefined) {
    patch.manufacturer =
      product.manufacturer;
  }

  if (product.line !== undefined) {
    patch.line = product.line;
  }

  if (product.categoryId !== undefined) {
    patch.categoryId =
      product.categoryId;
  }

  if (product.categoryIds !== undefined) {
    patch.categoryIds =
      product.categoryIds;
  }

  if (product.usageType !== undefined) {
    patch.usageType =
      product.usageType;
  }

  if (
    product.shortDescription !== undefined
  ) {
    patch.shortDescription =
      product.shortDescription;
  }

  if (product.description !== undefined) {
    patch.description =
      product.description;
  }

  if (product.ingredients !== undefined) {
    patch.ingredients =
      product.ingredients;
  }

  if (product.components !== undefined) {
    patch.components =
      product.components;
  }

  if (product.benefits !== undefined) {
    patch.benefits =
      product.benefits;
  }

  if (
    product.usageInstructions !== undefined
  ) {
    patch.usageInstructions =
      product.usageInstructions;
  }

  if (product.images !== undefined) {
    patch.images =
      product.images;
  }

  if (product.price !== undefined) {
    patch.price =
      String(product.price);
  }

  if (
    product.promotionalPrice !== undefined
  ) {
    patch.promotionalPrice =
      String(product.promotionalPrice);
  }

  if (
    product.priceVisibility !== undefined
  ) {
    patch.priceVisibility =
      product.priceVisibility;
  }

  if (product.saleEnabled !== undefined) {
    patch.saleEnabled =
      product.saleEnabled;
  }

  if (
    product.requiresEvaluation !== undefined
  ) {
    patch.requiresEvaluation =
      product.requiresEvaluation;
  }

  if (
    product.requiresProtocol !== undefined
  ) {
    patch.requiresProtocol =
      product.requiresProtocol;
  }

  if (
    product.professionalProduct !== undefined
  ) {
    patch.professionalProduct =
      product.professionalProduct;
  }

  if (product.homeCare !== undefined) {
    patch.homeCare =
      product.homeCare;
  }

  if (product.availability !== undefined) {
    patch.availability =
      product.availability;
  }

  if (product.badge !== undefined) {
    patch.badge =
      product.badge;
  }

  if (product.featured !== undefined) {
    patch.featured =
      product.featured;
  }

  if (product.displayOrder !== undefined) {
    patch.displayOrder =
      product.displayOrder;
  }

  if (
    product.officialSource !== undefined
  ) {
    patch.officialSource =
      product.officialSource;
  }

  if (product.seo !== undefined) {
    patch.seo =
      product.seo;
  }

  if (product.status !== undefined) {
    patch.status =
      product.status;
  }

  return patch;
}

export class DrizzleProductRepository
  implements ProductRepository
{
  async list(
    filters: ProductListFilters = {},
  ): Promise<StoreProduct[]> {
    const db = getDb();

    const conditions: SQL[] = [];

    if (filters.search?.trim()) {
      const search =
        `%${filters.search.trim()}%`;

      const searchCondition = or(
        ilike(productsTable.name, search),
        ilike(productsTable.slug, search),
        ilike(productsTable.brand, search),
      );

      if (searchCondition) {
        conditions.push(searchCondition);
      }
    }

    if (filters.status !== undefined) {
      conditions.push(
        eq(
          productsTable.status,
          filters.status,
        ),
      );
    }

    if (
      filters.saleEnabled !== undefined
    ) {
      conditions.push(
        eq(
          productsTable.saleEnabled,
          filters.saleEnabled,
        ),
      );
    }

    if (filters.categoryId !== undefined) {
      conditions.push(
        eq(
          productsTable.categoryId,
          filters.categoryId,
        ),
      );
    }

    if (filters.featured !== undefined) {
      conditions.push(
        eq(
          productsTable.featured,
          filters.featured,
        ),
      );
    }

    const rows = await db
      .select()
      .from(productsTable)
      .where(
        conditions.length > 0
          ? and(...conditions)
          : undefined,
      )
      .orderBy(
        asc(productsTable.displayOrder),
        asc(productsTable.name),
      );

    return rows.map(mapRowToProduct);
  }

  async findById(
    id: string,
  ): Promise<StoreProduct | null> {
    const db = getDb();

    const [row] = await db
      .select()
      .from(productsTable)
      .where(
        eq(productsTable.id, id),
      )
      .limit(1);

    return row
      ? mapRowToProduct(row)
      : null;
  }

  async findBySlug(
    slug: string,
  ): Promise<StoreProduct | null> {
    const db = getDb();

    const [row] = await db
      .select()
      .from(productsTable)
      .where(
        eq(productsTable.slug, slug),
      )
      .limit(1);

    return row
      ? mapRowToProduct(row)
      : null;
  }

  async create(
    product: StoreProduct,
  ): Promise<StoreProduct> {
    const db = getDb();

    const [created] = await db
      .insert(productsTable)
      .values(
        mapProductToInsert(product),
      )
      .returning();

    if (!created) {
      throw new Error(
        "Não foi possível criar o produto.",
      );
    }

    return mapRowToProduct(created);
  }

  async update(
    id: string,
    product: Partial<StoreProduct>,
  ): Promise<StoreProduct> {
    const db = getDb();

    const [updated] = await db
      .update(productsTable)
      .set(
        mapProductPatch(product),
      )
      .where(
        eq(productsTable.id, id),
      )
      .returning();

    if (!updated) {
      throw new Error(
        `Produto não encontrado: ${id}`,
      );
    }

    return mapRowToProduct(updated);
  }

  async delete(
    id: string,
  ): Promise<void> {
    const db = getDb();

    await db
      .delete(productsTable)
      .where(
        eq(productsTable.id, id),
      );
  }
}
