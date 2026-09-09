import type { StoreProduct } from "../../domain/store/product";
import type { PublicProduct } from "../../domain/store/public-product";
import type { ProductService } from "./product-service";
import { productService } from "./product-service.server";

export function projectPublicProduct(product: StoreProduct): PublicProduct {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    brand: product.brand,
    ...(product.manufacturer
      ? { manufacturer: product.manufacturer }
      : {}),
    ...(product.line ? { line: product.line } : {}),
    ...(product.categoryId ? { categoryId: product.categoryId } : {}),
    categoryIds: [...product.categoryIds],
    usageType: product.usageType,
    shortDescription: product.shortDescription,
    ...(product.description ? { description: product.description } : {}),
    ingredients: product.ingredients.map((ingredient) => ({
      id: ingredient.id,
      name: ingredient.name,
      ...(ingredient.description
        ? { description: ingredient.description }
        : {}),
    })),
    components: product.components.map((component) => ({
      id: component.id,
      name: component.name,
      ...(component.description
        ? { description: component.description }
        : {}),
    })),
    benefits: product.benefits.map((benefit) => ({
      id: benefit.id,
      title: benefit.title,
      ...(benefit.description
        ? { description: benefit.description }
        : {}),
    })),
    ...(product.usageInstructions
      ? { usageInstructions: product.usageInstructions }
      : {}),
    images: product.images.map((image) => ({
      id: image.id,
      url: image.url,
      alt: image.alt,
      position: image.position,
      main: image.main,
    })),
    ...(typeof product.price === "number" ? { price: product.price } : {}),
    ...(typeof product.promotionalPrice === "number"
      ? { promotionalPrice: product.promotionalPrice }
      : {}),
    priceVisibility: product.priceVisibility,
    saleEnabled: product.saleEnabled,
    requiresEvaluation: product.requiresEvaluation,
    requiresProtocol: product.requiresProtocol,
    professionalProduct: product.professionalProduct,
    homeCare: product.homeCare,
    availability: product.availability,
    ...(product.badge ? { badge: product.badge } : {}),
    featured: product.featured,
    displayOrder: product.displayOrder,
    ...(product.officialSource ? { officialSource: product.officialSource } : {}),
    ...(product.seo
      ? {
          seo: {
            ...(product.seo.title ? { title: product.seo.title } : {}),
            ...(product.seo.description
              ? { description: product.seo.description }
              : {}),
            ...(product.seo.canonicalUrl
              ? { canonicalUrl: product.seo.canonicalUrl }
              : {}),
            ...(typeof product.seo.noIndex === "boolean"
              ? { noIndex: product.seo.noIndex }
              : {}),
          },
        }
      : {}),
  };
}

export class PublicProductCatalogService {
  constructor(private readonly products: ProductService) {}

  async listPublicProducts(): Promise<PublicProduct[]> {
    const products = await this.products.list({ status: "ACTIVE" });

    return products
      .filter((product) => product.status === "ACTIVE")
      .map(projectPublicProduct)
      .sort(
        (left, right) =>
          left.displayOrder - right.displayOrder ||
          left.name.localeCompare(right.name, "pt-BR") ||
          left.id.localeCompare(right.id),
      );
  }

  async getPublicProductBySlug(slug: string): Promise<PublicProduct | null> {
    const product = await this.products.getBySlug(slug);

    if (!product || product.status !== "ACTIVE") {
      return null;
    }

    return projectPublicProduct(product);
  }
}

export const publicProductCatalogService =
  new PublicProductCatalogService(productService);
