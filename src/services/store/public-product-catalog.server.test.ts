import { describe, expect, it, vi } from "vitest";

vi.mock("./product-service.server", () => ({ productService: {} }));

import type { StoreProduct } from "../../domain/store/product";
import type { ProductService } from "./product-service";
import {
  projectPublicProduct,
  PublicProductCatalogService,
} from "./public-product-catalog.server";

function createProduct(overrides: Partial<StoreProduct> = {}): StoreProduct {
  return {
    id: "product-1",
    name: "Produto DNA",
    slug: "produto-dna",
    brand: "DNA VITAL",
    manufacturer: "Fabricante interno",
    categoryIds: ["home-care"],
    usageType: "HOME_CARE",
    shortDescription: "Descrição curta",
    ingredients: [{ id: "ingredient-1", name: "Ativo", description: "Descrição" }],
    components: [{ id: "component-1", name: "Componente" }],
    benefits: [{ id: "benefit-1", title: "Benefício" }],
    images: [
      { id: "image-1", url: "/product.webp", alt: "Produto", position: 0, main: true },
    ],
    price: 100,
    priceVisibility: "SHOW_PRICE",
    saleEnabled: true,
    requiresEvaluation: false,
    requiresProtocol: false,
    professionalProduct: false,
    homeCare: true,
    availability: "AVAILABLE",
    featured: false,
    displayOrder: 1,
    status: "ACTIVE",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-02T00:00:00.000Z",
    ...overrides,
  };
}

function createProductService(products: StoreProduct[]) {
  return {
    list: vi.fn(async () => products),
    getBySlug: vi.fn(async (slug: string) =>
      products.find((product) => product.slug === slug) ?? null,
    ),
  } as unknown as ProductService;
}

describe("PublicProductCatalogService", () => {
  it("projects a public product without internal status or timestamps", () => {
    const projected = projectPublicProduct(createProduct());

    expect(projected).toEqual({
      id: "product-1",
      name: "Produto DNA",
      slug: "produto-dna",
      brand: "DNA VITAL",
      manufacturer: "Fabricante interno",
      categoryIds: ["home-care"],
      usageType: "HOME_CARE",
      shortDescription: "Descrição curta",
      ingredients: [
        { id: "ingredient-1", name: "Ativo", description: "Descrição" },
      ],
      components: [{ id: "component-1", name: "Componente" }],
      benefits: [{ id: "benefit-1", title: "Benefício" }],
      images: [
        {
          id: "image-1",
          url: "/product.webp",
          alt: "Produto",
          position: 0,
          main: true,
        },
      ],
      price: 100,
      priceVisibility: "SHOW_PRICE",
      saleEnabled: true,
      requiresEvaluation: false,
      requiresProtocol: false,
      professionalProduct: false,
      homeCare: true,
      availability: "AVAILABLE",
      featured: false,
      displayOrder: 1,
    });
  });

  it("lists only ACTIVE products in stable display order", async () => {
    const products = [
      createProduct({ id: "z", name: "Zulu", slug: "zulu", displayOrder: 2 }),
      createProduct({ id: "inactive", slug: "inactive", status: "INACTIVE" }),
      createProduct({ id: "b", name: "Beta", slug: "beta", displayOrder: 1 }),
      createProduct({ id: "a", name: "Alfa", slug: "alfa", displayOrder: 1 }),
    ];
    const productService = createProductService(products);
    const catalog = new PublicProductCatalogService(productService);

    const result = await catalog.listPublicProducts();

    expect(result.map((product) => product.id)).toEqual(["a", "b", "z"]);
    expect(result.some((product) => product.id === "inactive")).toBe(false);
    expect(productService.list).toHaveBeenCalledWith({ status: "ACTIVE" });
  });

  it("returns an ACTIVE product by slug and null for missing or inactive slugs", async () => {
    const catalog = new PublicProductCatalogService(
      createProductService([
        createProduct({ slug: "active" }),
        createProduct({ slug: "inactive", status: "INACTIVE" }),
      ]),
    );

    await expect(catalog.getPublicProductBySlug("active")).resolves.toMatchObject({
      slug: "active",
    });
    await expect(catalog.getPublicProductBySlug("inactive")).resolves.toBeNull();
    await expect(catalog.getPublicProductBySlug("missing")).resolves.toBeNull();
  });

  it("returns batch results deduplicated and ordered like the requested ids", async () => {
    const productService = createProductService([
      createProduct({ id: "b", slug: "b" }),
      createProduct({ id: "a", slug: "a" }),
      createProduct({ id: "inactive", slug: "inactive", status: "INACTIVE" }),
    ]);
    const catalog = new PublicProductCatalogService(productService);

    const result = await catalog.getByIds([" b ", "a", "b", "missing", "inactive"]);

    expect(result.map((product) => product.id)).toEqual(["b", "a"]);
    expect(productService.list).toHaveBeenCalledWith({
      ids: ["b", "a", "missing", "inactive"],
      status: "ACTIVE",
    });
  });

  it("returns an empty batch without querying and rejects blank ids", async () => {
    const productService = createProductService([]);
    const catalog = new PublicProductCatalogService(productService);

    await expect(catalog.getByIds([])).resolves.toEqual([]);
    expect(productService.list).not.toHaveBeenCalled();
    await expect(catalog.getByIds([" "])).rejects.toThrow("ID de produto inválido.");
  });
});
