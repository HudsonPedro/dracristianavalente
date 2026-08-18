import {
  canFulfillQuantity,
  getInventoryStatus,
  getQuantityForSale,
  type Inventory,
  type InventoryAvailability,
} from "../../domain/store/inventory";

import type { InventoryRepository } from "../../repositories/store/inventory-repository";

export class InventoryService {
  constructor(private readonly repository: InventoryRepository) {}

  async list() {
    return this.repository.list();
  }

  async getByProductId(productId: string) {
    return this.repository.findByProductId(productId);
  }

  async getAvailability(productId: string): Promise<InventoryAvailability | null> {
    const inventory = await this.repository.findByProductId(productId);

    if (!inventory) {
      return null;
    }

    return {
      productId,

      stockEnabled: inventory.stockEnabled,

      quantityAvailable: inventory.quantityAvailable,

      quantityReserved: inventory.quantityReserved,

      quantityForSale: getQuantityForSale(inventory),

      status: getInventoryStatus(inventory),
    };
  }

  async createOrUpdate(inventory: Inventory) {
    this.validateInventory(inventory);

    return this.repository.save(inventory);
  }

  async setQuantity(productId: string, quantity: number) {
    if (!Number.isInteger(quantity) || quantity < 0) {
      throw new Error("A quantidade em estoque deve ser um número inteiro maior ou igual a zero.");
    }

    return this.repository.updateQuantity(productId, quantity);
  }

  async canSell(productId: string, quantity: number) {
    const inventory = await this.repository.findByProductId(productId);

    if (!inventory) {
      return {
        allowed: false,
        reason: "Estoque do produto não configurado.",
      };
    }

    if (!Number.isInteger(quantity) || quantity <= 0) {
      return {
        allowed: false,
        reason: "Quantidade inválida.",
      };
    }

    if (!canFulfillQuantity(inventory, quantity)) {
      return {
        allowed: false,
        reason: "Quantidade solicitada indisponível em estoque.",
      };
    }

    return {
      allowed: true,
    };
  }

  async reserve(productId: string, quantity: number) {
    const validation = await this.canSell(productId, quantity);

    if (!validation.allowed) {
      throw new Error(validation.reason);
    }

    return this.repository.reserve(productId, quantity);
  }

  async release(productId: string, quantity: number) {
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new Error("Quantidade inválida.");
    }

    return this.repository.release(productId, quantity);
  }

  async commit(productId: string, quantity: number) {
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new Error("Quantidade inválida.");
    }

    return this.repository.commitReservedStock(productId, quantity);
  }

  private validateInventory(inventory: Inventory) {
    if (inventory.quantityAvailable < 0 || !Number.isInteger(inventory.quantityAvailable)) {
      throw new Error("Quantidade disponível inválida.");
    }

    if (inventory.quantityReserved < 0 || !Number.isInteger(inventory.quantityReserved)) {
      throw new Error("Quantidade reservada inválida.");
    }

    if (inventory.minimumStock < 0 || !Number.isInteger(inventory.minimumStock)) {
      throw new Error("Estoque mínimo inválido.");
    }
  }
}
