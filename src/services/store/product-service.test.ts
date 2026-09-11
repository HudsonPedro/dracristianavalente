import { beforeEach, describe, expect, it, vi } from "vitest";

import type { StoreProduct } from "../../domain/store/product";
import type {
  ProductListFilters,
  ProductRepository,
} from "../../repositories/store/product-repository";
import { ProductService } from "./product-service";

function createProduct(overrides: Partial<StoreProduct> = {}): StoreProduct {
  return {
    id: "product-1",
    name: "Produto DNA",
    slug: "produto-dna",
    brand: "DNA VITAL",
    categoryIds: ["home-care"],
    usageType: "HOME_CARE",
    shortDescription: "Descrição curta",
    ingredients: [],
    components: [],
    benefits: [],
    images: [],
    price: 100,
    promotionalPrice: 90,
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
    ...overrides,
  };
}

function createRepository(product = createProduct()) {
  return {
    list: vi.fn<(filters?: ProductListFilters) => Promise<StoreProduct[]>>(
      async () => [product],
    ),
    findById: vi.fn<(id: string) => Promise<StoreProduct | null>>(
      async () => product,
    ),
    findBySlug: vi.fn<(slug: string) => Promise<StoreProduct | null>>(
      async () => product,
    ),
    create: vi.fn<(value: StoreProduct) => Promise<StoreProduct>>(
      async (value) => value,
    ),
    update: vi.fn<
      (id: string, changes: Partial<StoreProduct>) => Promise<StoreProduct>
    >(async (_id, changes) => ({ ...product, ...changes })),
    delete: vi.fn<(id: string) => Promise<void>>(async () => undefined),
  } satisfies ProductRepository;
}

describe("ProductService", () => {
  let repository: ReturnType<typeof createRepository>;
  let service: ProductService;

  beforeEach(() => {
    repository = createRepository();
    service = new ProductService(repository);
  });

  it("delegates list filters and read operations to the repository", async () => {
    const filters = { status: "ACTIVE" as const, featured: true };

    await expect(service.list(filters)).resolves.toHaveLength(1);
    await expect(service.getById("product-1")).resolves.toMatchObject({
      id: "product-1",
    });
    await expect(service.getBySlug("produto-dna")).resolves.toMatchObject({
      slug: "produto-dna",
    });
    expect(repository.list).toHaveBeenCalledWith(filters);
    expect(repository.findById).toHaveBeenCalledWith("product-1");
    expect(repository.findBySlug).toHaveBeenCalledWith("produto-dna");
  });

  it("validates required fields before creating a product", async () => {
    await expect(service.create(createProduct({ name: "  " }))).rejects.toThrow(
      "Nome do produto é obrigatório.",
    );
    await expect(service.create(createProduct({ slug: "  " }))).rejects.toThrow(
      "Slug do produto é obrigatório.",
    );
    await expect(service.create(createProduct({ brand: "  " }))).rejects.toThrow(
      "Marca do produto é obrigatória.",
    );
    expect(repository.create).not.toHaveBeenCalled();
  });

  it("creates a valid product through the repository", async () => {
    const product = createProduct();

    await expect(service.create(product)).resolves.toEqual(product);
    expect(repository.create).toHaveBeenCalledWith(product);
  });

  it("rejects an update when the product does not exist", async () => {
    repository.findById.mockResolvedValue(null);

    await expect(service.update("missing", { featured: true })).rejects.toThrow(
      "Produto não encontrado.",
    );
    expect(repository.update).not.toHaveBeenCalled();
  });

  it("loads the current product and validates changes before updating", async () => {
    await expect(service.update("product-1", { name: "  " })).rejects.toThrow(
      "Nome do produto é obrigatório.",
    );
    expect(repository.update).not.toHaveBeenCalled();

    await service.update("product-1", { featured: true });
    expect(repository.findById).toHaveBeenCalledWith("product-1");
    expect(repository.update).toHaveBeenCalledWith("product-1", {
      featured: true,
    });
  });

  it("updates availability and saleEnabled through the existing update path", async () => {
    await service.setAvailability("product-1", "UNAVAILABLE");
    await service.setSaleEnabled("product-1", false);

    expect(repository.update).toHaveBeenNthCalledWith(1, "product-1", {
      availability: "UNAVAILABLE",
    });
    expect(repository.update).toHaveBeenNthCalledWith(2, "product-1", {
      saleEnabled: false,
    });
  });

  it("rejects invalid prices and accepts a valid promotional price", async () => {
    await expect(service.setPrice("product-1", -1)).rejects.toThrow(
      "O preço não pode ser negativo.",
    );
    await expect(service.setPrice("product-1", 100, -1)).rejects.toThrow(
      "O preço promocional não pode ser negativo.",
    );
    await expect(service.setPrice("product-1", 100, 101)).rejects.toThrow(
      "O preço promocional não pode ser maior que o preço normal.",
    );

    await service.setPrice("product-1", 100, 80);
    expect(repository.update).toHaveBeenCalledWith("product-1", {
      price: 100,
      promotionalPrice: 80,
    });
  });

  it.each([
    [{ status: "INACTIVE" as const }, "Produto não está ativo."],
    [{ saleEnabled: false }, "Venda online não está habilitada."],
    [{ availability: "UNAVAILABLE" as const }, "Produto não está disponível."],
    [{ requiresEvaluation: true }, "Produto requer avaliação profissional."],
    [{ requiresProtocol: true }, "Produto requer protocolo profissional."],
    [
      { priceVisibility: "HIDE_PRICE" as const },
      "Produto não está configurado para venda direta.",
    ],
    [{ price: undefined }, "Produto não possui preço configurado."],
  ])("rejects a product that is not eligible for sale", (changes, reason) => {
    expect(service.validateSale(createProduct(changes))).toEqual({
      allowed: false,
      reason,
    });
  });

  it("allows a product that satisfies every current sale rule", () => {
    expect(service.validateSale(createProduct())).toEqual({ allowed: true });
  });
});
