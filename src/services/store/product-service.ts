import type { ProductAvailability, StoreProduct } from "../../domain/store/product";

import type {
  ProductListFilters,
  ProductRepository,
} from "../../repositories/store/product-repository";

export type ProductSaleValidation = {
  allowed: boolean;

  reason?: string;
};

export class ProductService {
  constructor(private readonly repository: ProductRepository) {}

  async list(filters?: ProductListFilters) {
    return this.repository.list(filters);
  }

  async getById(id: string) {
    return this.repository.findById(id);
  }

  async getBySlug(slug: string) {
    return this.repository.findBySlug(slug);
  }

  async create(product: StoreProduct) {
    this.validateProduct(product);

    return this.repository.create(product);
  }

  async update(id: string, changes: Partial<StoreProduct>) {
    const current = await this.repository.findById(id);

    if (!current) {
      throw new Error("Produto não encontrado.");
    }

    const updated: StoreProduct = {
      ...current,
      ...changes,

      id: current.id,
    };

    this.validateProduct(updated);

    return this.repository.update(id, changes);
  }

  async setAvailability(id: string, availability: ProductAvailability) {
    return this.update(id, {
      availability,
    });
  }

  async setSaleEnabled(id: string, saleEnabled: boolean) {
    return this.update(id, {
      saleEnabled,
    });
  }

  async setPrice(id: string, price?: number, promotionalPrice?: number) {
    if (typeof price === "number" && price < 0) {
      throw new Error("O preço não pode ser negativo.");
    }

    if (typeof promotionalPrice === "number" && promotionalPrice < 0) {
      throw new Error("O preço promocional não pode ser negativo.");
    }

    if (
      typeof price === "number" &&
      typeof promotionalPrice === "number" &&
      promotionalPrice > price
    ) {
      throw new Error("O preço promocional não pode ser maior que o preço normal.");
    }

    return this.update(id, {
      price,
      promotionalPrice,
    });
  }

  validateSale(product: StoreProduct): ProductSaleValidation {
    if (product.status !== "ACTIVE") {
      return {
        allowed: false,
        reason: "Produto não está ativo.",
      };
    }

    if (!product.saleEnabled) {
      return {
        allowed: false,
        reason: "Venda online não está habilitada.",
      };
    }

    if (product.availability !== "AVAILABLE") {
      return {
        allowed: false,
        reason: "Produto não está disponível.",
      };
    }

    if (product.requiresEvaluation) {
      return {
        allowed: false,
        reason: "Produto requer avaliação profissional.",
      };
    }

    if (product.requiresProtocol) {
      return {
        allowed: false,
        reason: "Produto requer protocolo profissional.",
      };
    }

    if (product.priceVisibility !== "SHOW_PRICE") {
      return {
        allowed: false,
        reason: "Produto não está configurado para venda direta.",
      };
    }

    if (typeof product.price !== "number") {
      return {
        allowed: false,
        reason: "Produto não possui preço configurado.",
      };
    }

    return {
      allowed: true,
    };
  }

  private validateProduct(product: StoreProduct) {
    if (!product.name.trim()) {
      throw new Error("Nome do produto é obrigatório.");
    }

    if (!product.slug.trim()) {
      throw new Error("Slug do produto é obrigatório.");
    }

    if (!product.brand.trim()) {
      throw new Error("Marca do produto é obrigatória.");
    }

    if (typeof product.price === "number" && product.price < 0) {
      throw new Error("O preço não pode ser negativo.");
    }

    if (typeof product.promotionalPrice === "number" && product.promotionalPrice < 0) {
      throw new Error("O preço promocional não pode ser negativo.");
    }

    if (
      typeof product.price === "number" &&
      typeof product.promotionalPrice === "number" &&
      product.promotionalPrice > product.price
    ) {
      throw new Error("O preço promocional não pode ser maior que o preço normal.");
    }
  }
}
